import assert from "node:assert/strict";
import test from "node:test";
import { FEATURES } from "@/data/catalog";
import { dueCount, freshDeck, nextDue, probeChoices, recallRows, reviewCard } from "./leitner";

test("fresh deck includes every structural feature and all cards are due", () => {
  const deck = freshDeck(1_000);
  assert.equal(Object.keys(deck).length, FEATURES.length);
  assert.equal(dueCount(deck, 1_000), FEATURES.length);
  assert.equal(nextDue(deck, 1_000).box, 1);
});

test("pass promotes and spaces; failure returns immediately to box one", () => {
  const original = freshDeck(1_000).eyes_almond;
  const passed = reviewCard(original, true, 2_000);
  assert.equal(passed.box, 2);
  assert.ok(passed.dueAt > 2_000);
  const failed = reviewCard({ ...passed, box: 4 }, false, 3_000);
  assert.equal(failed.box, 1);
  assert.equal(failed.dueAt, 3_000);
  assert.equal(failed.streak, 0);
});

test("retrieval probes are deterministic, unique, regional, and include the target", () => {
  for (const feature of FEATURES) {
    const first = probeChoices(feature);
    const second = probeChoices(feature);
    assert.deepEqual(first, second);
    assert.equal(first.length, 4);
    assert.equal(new Set(first.map((choice) => choice.id)).size, 4);
    assert.ok(first.some((choice) => choice.id === feature.id));
    assert.ok(first.every((choice) => choice.region === feature.region));
  }
});

test("recall rows report encoding and answer latency without making causal claims", () => {
  const rows = recallRows([
    { featureId: "eyes_almond", correct: true, encodeMs: 3000, probeMs: 1000, at: 1 },
    { featureId: "eyes_round", correct: false, encodeMs: 3000, probeMs: 3000, at: 2 },
  ]);
  const row = rows.find((candidate) => candidate.key === "3s");
  assert.ok(row);
  assert.equal(row.recall, 0.5);
  assert.equal(row.encodeSeconds, 3);
  assert.equal(row.probeSeconds, 2);
});
