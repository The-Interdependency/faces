import assert from "node:assert/strict";
import test from "node:test";
import { MONK_TONES, contrastInk, monkToneIdFromLegacyFeature } from "./mst";

test("Monk scale contains the ten published unique swatches", () => {
  assert.equal(MONK_TONES.length, 10);
  assert.equal(new Set(MONK_TONES.map((tone) => tone.code)).size, 10);
  assert.equal(new Set(MONK_TONES.map((tone) => tone.hex)).size, 10);
});

test("legacy tone ids migrate without accepting unrelated values", () => {
  assert.equal(monkToneIdFromLegacyFeature("skin_mst_1"), 1);
  assert.equal(monkToneIdFromLegacyFeature("skin_mst_10"), 10);
  assert.equal(monkToneIdFromLegacyFeature("skin_mst_11"), null);
  assert.equal(monkToneIdFromLegacyFeature("eyes_almond"), null);
});

test("tone line colour follows contrast rather than a hand-written band", () => {
  assert.equal(contrastInk(MONK_TONES[0].hex), "ink");
  assert.equal(contrastInk(MONK_TONES[9].hex), "paper");
});
