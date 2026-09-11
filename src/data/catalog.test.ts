// === CHECKS ===
// id: check_catalog_stable_unique_ids_three_per_region
//   proves: catalog_stable_unique_ids_three_per_region
//   call: self::catalog_has_stable_unique_ids_and_at_least_three_terms_per_region
//   requires: node
//   timeout: 20
//   mutates: none
//   cleanup: none
//
// id: check_catalog_knobs_stay_in_region_scope
//   proves: catalog_knobs_stay_in_region_scope
//   call: self::feature_knobs_stay_inside_their_documented_region_scope
//   requires: node
//   timeout: 20
//   mutates: none
//   cleanup: none
//
// id: check_field_card_covers_every_term_once
//   proves: field_card_covers_every_term_once
//   call: self::field_card_covers_every_structural_term_exactly_once
//   requires: node
//   timeout: 20
//   mutates: none
//   cleanup: none
//
// id: check_named_line_keeps_appearance_separate
//   proves: named_line_keeps_appearance_separate
//   call: self::description_keeps_appearance_separate_and_follows_top_to_bottom_order
//   requires: node
//   timeout: 20
//   mutates: none
//   cleanup: none
// === END CHECKS ===

import assert from "node:assert/strict";
import test from "node:test";
import {
  FEATURES,
  FIELD_CARD,
  FIELD_ROWS,
  REGIONS,
  REGION_KNOBS,
  emptyPicks,
  namedLine,
} from "./catalog";

test("catalog has stable unique ids and at least three terms per region", () => {
  assert.equal(FEATURES.length, 62);
  assert.equal(new Set(FEATURES.map((feature) => feature.id)).size, FEATURES.length);
  assert.equal(REGIONS.length, 11);
  for (const region of REGIONS) {
    assert.ok(
      FEATURES.filter((feature) => feature.region === region.id).length >= 3,
      `${region.id} needs at least three terms`,
    );
  }
});

test("feature knobs stay inside their documented region scope", () => {
  for (const feature of FEATURES) {
    const keys = Object.keys(feature.knobs);
    assert.ok(keys.length > 0, `${feature.id} has no distinguishing knobs`);
    const allowed = new Set<string>(REGION_KNOBS[feature.region]);
    for (const key of keys) {
      assert.ok(allowed.has(key), `${feature.id} changes out-of-scope knob ${key}`);
    }
  }
});

test("field card covers every structural term exactly once", () => {
  assert.equal(FIELD_ROWS.length, 11);
  const ids = FIELD_CARD.flatMap((row) => row.choices.map((choice) => choice.id));
  assert.equal(ids.length, FEATURES.length);
  assert.equal(new Set(ids).size, FEATURES.length);
  assert.deepEqual(new Set(ids), new Set(FEATURES.map((feature) => feature.id)));
});

test("description keeps appearance separate and follows top-to-bottom order", () => {
  const picks = emptyPicks();
  picks.outline = "outline_oval";
  picks.eyes = "eyes_almond";
  assert.equal(namedLine(picks, "MST-6"), "skin tone MST-6, oval, almond");
});
