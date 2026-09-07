// === MODULE_BUILD ===
// id: lineament_leitner_scheduler
//   module_name: leitner_scheduler
//   module_kind: engine
//   summary: session-scaled Leitner boxes that spend time on weak feature names
//   owner: Erin Spencer
//   public_surface: gradeCard, nextDue, emptyDeck, encodeBucket
//   internal_surface: intervalForBox
//   auth_boundary: none
//   storage_boundary: none
//   network_boundary: none
//   user_data_boundary: none
//   admin_only: false
//   tests: src/lib/faces/leitner.ts#test_fail_resets_box
//   rollout: default_enabled
//   rollback: drop scheduler and keep FIFO queue
// === END MODULE_BUILD ===
//
// === CONTRACTS ===
// id: leitner_fail_resets_to_box_one
//   given: a card in box 4 that is graded fail
//   then: box becomes 1 and dueAt is now
//   class: correctness
//   call: src/lib/faces/leitner.ts#test_fail_resets_box
//
// id: leitner_pass_promotes_and_spaces
//   given: a card in box 1 graded pass
//   then: box becomes 2 and dueAt is later than now
//   class: correctness
//   call: src/lib/faces/leitner.ts#test_pass_promotes
// === END CONTRACTS ===

import { FEATURES } from "./catalog";
import type { EncodeMs, LeitnerCard, TrialLog } from "./types";

const BOX_INTERVAL_MS = [0, 0, 45_000, 3 * 60_000, 12 * 60_000, 45 * 60_000] as const;

export function emptyDeck(now = Date.now()): Record<string, LeitnerCard> {
  const cards: Record<string, LeitnerCard> = {};
  for (const feature of FEATURES) {
    cards[feature.id] = {
      featureId: feature.id,
      box: 1,
      reviews: 0,
      correct: 0,
      streak: 0,
      lastResult: null,
      lastSeenAt: 0,
      dueAt: now,
    };
  }
  return cards;
}

export function intervalForBox(box: LeitnerCard["box"]): number {
  return BOX_INTERVAL_MS[box] ?? 0;
}

export function gradeCard(card: LeitnerCard, passed: boolean, now = Date.now()): LeitnerCard {
  if (!passed) {
    return {
      ...card,
      box: 1,
      reviews: card.reviews + 1,
      streak: 0,
      lastResult: "fail",
      lastSeenAt: now,
      dueAt: now,
    };
  }
  const box = Math.min(5, card.box + 1) as LeitnerCard["box"];
  return {
    ...card,
    box,
    reviews: card.reviews + 1,
    correct: card.correct + 1,
    streak: card.streak + 1,
    lastResult: "pass",
    lastSeenAt: now,
    dueAt: now + intervalForBox(box),
  };
}

export function nextDue(
  cards: Record<string, LeitnerCard>,
  now = Date.now(),
  avoidId?: string,
): LeitnerCard {
  const list = Object.values(cards).sort((a, b) => {
    const ad = a.dueAt - now;
    const bd = b.dueAt - now;
    if (ad !== bd) return ad - bd;
    if (a.box !== b.box) return a.box - b.box;
    return a.lastSeenAt - b.lastSeenAt;
  });
  const preferred = list.find((c) => c.featureId !== avoidId) ?? list[0];
  if (!preferred) throw new Error("empty deck");
  return preferred;
}

export function encodeBucket(ms: number): "3s" | "6s" | "12s" | "self" {
  if (ms <= 0) return "self";
  if (ms <= 4000) return "3s";
  if (ms <= 8000) return "6s";
  return "12s";
}

export function ratioByEncode(trials: TrialLog[]) {
  const buckets: Record<"3s" | "6s" | "12s" | "self", { n: number; hits: number; ms: number }> = {
    "3s": { n: 0, hits: 0, ms: 0 },
    "6s": { n: 0, hits: 0, ms: 0 },
    "12s": { n: 0, hits: 0, ms: 0 },
    self: { n: 0, hits: 0, ms: 0 },
  };
  for (const trial of trials) {
    const key = encodeBucket(trial.encodeMs);
    buckets[key].n += 1;
    buckets[key].ms += Math.max(trial.encodeMs, 1);
    if (trial.correct) buckets[key].hits += 1;
  }
  return (Object.keys(buckets) as Array<keyof typeof buckets>).map((key) => {
    const b = buckets[key];
    return {
      key,
      n: b.n,
      recall: b.n ? b.hits / b.n : 0,
      seconds: b.n ? b.ms / b.n / 1000 : 0,
      ratio: b.ms > 0 ? b.hits / (b.ms / 1000) : 0,
    };
  });
}

export const ENCODE_OPTIONS: { value: EncodeMs; label: string; hint: string }[] = [
  { value: 3000, label: "3 s", hint: "brief glance" },
  { value: 6000, label: "6 s", hint: "one clean look" },
  { value: 12000, label: "12 s", hint: "study the line" },
  { value: 0, label: "Self", hint: "you decide" },
];

export function test_fail_resets_box(): void {
  const now = 1_000_000;
  const card: LeitnerCard = {
    featureId: "nose_aquiline",
    box: 4,
    reviews: 6,
    correct: 5,
    streak: 3,
    lastResult: "pass",
    lastSeenAt: now - 1000,
    dueAt: now + 1000,
  };
  const next = gradeCard(card, false, now);
  if (next.box !== 1) throw new AssertionError(`expected box 1, got ${next.box}`);
  if (next.dueAt !== now) throw new AssertionError("fail must be due immediately");
  if (next.streak !== 0) throw new AssertionError("fail must break streak");
}

export function test_pass_promotes(): void {
  const now = 2_000_000;
  const card: LeitnerCard = {
    featureId: "nose_aquiline",
    box: 1,
    reviews: 0,
    correct: 0,
    streak: 0,
    lastResult: null,
    lastSeenAt: 0,
    dueAt: now,
  };
  const next = gradeCard(card, true, now);
  if (next.box !== 2) throw new AssertionError(`expected box 2, got ${next.box}`);
  if (next.dueAt <= now) throw new AssertionError("pass must schedule later");
}

class AssertionError extends Error {
  name = "AssertionError";
}
