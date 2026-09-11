import assert from "node:assert/strict";
import test from "node:test";
import { FEATURES } from "@/data/catalog";
import { migratePersistedState } from "./store";

test("legacy cards migrate into the v2 deck and retain progress", () => {
  const migrated = migratePersistedState({
    cards: {
      eyes_almond: {
        featureId: "eyes_almond",
        box: 4,
        reviews: 7,
        correct: 6,
        streak: 2,
        lastResult: "pass",
        lastSeenAt: 100,
        dueAt: 200,
      },
    },
    fieldPicks: { eyes: "eyes_almond", skin: "skin_mst_7" },
    trials: [
      {
        featureId: "eyes_almond",
        correct: true,
        encodeMs: 3000,
        latencyMs: 850,
        at: 123,
      },
    ],
  });

  assert.equal(Object.keys(migrated.deck).length, FEATURES.length);
  assert.equal(migrated.deck.eyes_almond.box, 4);
  assert.equal(migrated.fieldPicks.eyes, "eyes_almond");
  assert.equal(migrated.appearance.skinToneId, 7);
  assert.equal(migrated.trials[0].probeMs, 850);
  assert.equal("skin" in migrated.fieldPicks, false);
});

test("current deck state drops retired skin cards and fills missing anatomy", () => {
  const migrated = migratePersistedState({
    regionFilter: "skin",
    deck: {
      skin_mst_4: { featureId: "skin_mst_4", box: 5 },
    },
  });
  assert.equal(migrated.regionFilter, "due");
  assert.equal("skin_mst_4" in migrated.deck, false);
  assert.equal(Object.keys(migrated.deck).length, 62);
});

test("malformed persisted values fail closed to valid defaults", () => {
  const migrated = migratePersistedState({
    tab: "admin",
    encodeMs: -1,
    fieldPicks: { eyes: "nose_roman" },
    appearance: { skinToneId: 99 },
    trials: [{ featureId: "missing", correct: true }],
  });
  assert.equal(migrated.tab, "field");
  assert.equal(migrated.encodeMs, 6000);
  assert.equal(migrated.fieldPicks.eyes, "");
  assert.equal(migrated.appearance.skinToneId, null);
  assert.deepEqual(migrated.trials, []);
});
