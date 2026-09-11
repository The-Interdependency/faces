// === CHECKS ===
// id: check_mst_ten_published_unique_swatches
//   proves: mst_ten_published_unique_swatches
//   call: self::monk_scale_contains_the_ten_published_unique_swatches
//   requires: node
//   timeout: 20
//   mutates: none
//   cleanup: none
//
// id: check_mst_legacy_tone_ids_migrate_only_valid
//   proves: mst_legacy_tone_ids_migrate_only_valid
//   call: self::legacy_tone_ids_migrate_without_accepting_unrelated_values
//   requires: node
//   timeout: 20
//   mutates: none
//   cleanup: none
//
// id: check_mst_contrast_ink_follows_luminance
//   proves: mst_contrast_ink_follows_luminance
//   call: self::tone_line_colour_follows_contrast_rather_than_a_hand_written_band
//   requires: node
//   timeout: 20
//   mutates: none
//   cleanup: none
// === END CHECKS ===

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
