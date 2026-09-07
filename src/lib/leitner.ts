import { FEATURES, type Feature } from "@/data/catalog";

export type Card = {
  featureId: string;
  box: number;
  reviews: number;
  correct: number;
  streak: number;
  lastResult: "pass" | "fail" | null;
  lastSeenAt: number;
  dueAt: number;
};

export type Trial = {
  featureId: string;
  correct: boolean;
  encodeMs: number;
  probeMs: number;
  at: number;
};

const DELAYS = [0, 0, 45_000, 180_000, 720_000, 2_700_000];

export function freshDeck(now = Date.now()): Record<string, Card> {
  const deck: Record<string, Card> = {};
  for (const f of FEATURES) {
    deck[f.id] = {
      featureId: f.id,
      box: 1,
      reviews: 0,
      correct: 0,
      streak: 0,
      lastResult: null,
      lastSeenAt: 0,
      dueAt: now,
    };
  }
  return deck;
}

export function reviewCard(card: Card, pass: boolean, now = Date.now()): Card {
  if (!pass) {
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
  const box = Math.min(5, card.box + 1);
  return {
    ...card,
    box,
    reviews: card.reviews + 1,
    correct: card.correct + 1,
    streak: card.streak + 1,
    lastResult: "pass",
    lastSeenAt: now,
    dueAt: now + (DELAYS[box] ?? 0),
  };
}

export function nextDue(
  deck: Record<string, Card>,
  now = Date.now(),
  exclude?: string,
): Card {
  const rows = Object.values(deck).sort((a, b) => {
    const da = a.dueAt - now;
    const db = b.dueAt - now;
    if (da !== db) return da - db;
    if (a.box !== b.box) return a.box - b.box;
    return a.lastSeenAt - b.lastSeenAt;
  });
  return rows.find((c) => c.featureId !== exclude) ?? rows[0];
}

export function dueCount(deck: Record<string, Card>, now = Date.now()): number {
  return Object.values(deck).filter((c) => c.dueAt <= now).length;
}

export function encodeBucket(ms: number): "3s" | "6s" | "12s" | "self" {
  if (ms <= 0) return "self";
  if (ms <= 4000) return "3s";
  if (ms <= 8000) return "6s";
  return "12s";
}

export function recallRows(trials: Trial[]) {
  const bins: Record<string, { n: number; hits: number; ms: number }> = {
    "3s": { n: 0, hits: 0, ms: 0 },
    "6s": { n: 0, hits: 0, ms: 0 },
    "12s": { n: 0, hits: 0, ms: 0 },
    self: { n: 0, hits: 0, ms: 0 },
  };
  for (const t of trials) {
    const k = encodeBucket(t.encodeMs);
    bins[k].n += 1;
    bins[k].ms += Math.max(t.encodeMs, 1);
    if (t.correct) bins[k].hits += 1;
  }
  return (["3s", "6s", "12s", "self"] as const).map((key) => {
    const b = bins[key];
    return {
      key,
      n: b.n,
      recall: b.n ? b.hits / b.n : 0,
      seconds: b.n ? b.ms / b.n / 1000 : 0,
      ratio: b.ms > 0 ? b.hits / (b.ms / 1000) : 0,
    };
  });
}

export function hash32(s: string): number {
  let t = 2166136261;
  for (let i = 0; i < s.length; i++) t = Math.imul(t ^ s.charCodeAt(i), 16777619);
  return t >>> 0;
}

export function probeChoices(feature: Feature, n = 4): Feature[] {
  const pool = FEATURES.filter((f) => f.region === feature.region && f.id !== feature.id);
  const seed = hash32(feature.id);
  const shuffled = [...pool].sort((a, b) => hash32(a.id + seed) - hash32(b.id + seed));
  const picks = [feature, ...shuffled.slice(0, n - 1)];
  return picks.sort((a, b) => hash32(a.id + "opt" + seed) - hash32(b.id + "opt" + seed));
}
