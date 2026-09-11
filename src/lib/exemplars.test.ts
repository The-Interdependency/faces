import assert from "node:assert/strict";
import test from "node:test";
import { FEATURES } from "@/data/catalog";
import { makeExemplarLine } from "./exemplars";

test("an exemplar line shares the target knobs and varies everything else", () => {
  const feature = FEATURES.find((candidate) => candidate.id === "eyes_almond");
  assert.ok(feature);
  const line = makeExemplarLine(feature, 42);
  assert.deepEqual(
    line.map((face) => face.viewpoint),
    ["left", "right"],
  );
  for (const face of line) {
    for (const [key, value] of Object.entries(feature.knobs)) {
      assert.equal(face.knobs[key as keyof typeof face.knobs], value);
    }
  }
  const targetKeys = new Set(Object.keys(feature.knobs));
  assert.ok(
    Object.keys(line[0].knobs).some(
      (key) =>
        !targetKeys.has(key) &&
        line[0].knobs[key as keyof (typeof line)[0]["knobs"]] !==
          line[1].knobs[key as keyof (typeof line)[1]["knobs"]],
    ),
  );
});
