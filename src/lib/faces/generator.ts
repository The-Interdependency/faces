// === MODULE_BUILD ===
// id: lineament_exemplar_generator
//   module_name: exemplar_generator
//   module_kind: engine
//   summary: builds a line of left/right profile faces sharing one distinctive feature
//   owner: Erin Spencer
//   public_surface: makeLine, applyFeature, baselineKnobs
//   internal_surface: randomKnobs
//   auth_boundary: none
//   storage_boundary: none
//   network_boundary: none
//   user_data_boundary: none
//   admin_only: false
//   tests: src/lib/faces/generator.ts#test_line_shares_target_feature
//   rollout: default_enabled
//   rollback: remove generator import sites
// === END MODULE_BUILD ===
//
// === CONTRACTS ===
// id: line_shares_one_feature_varies_the_rest
//   given: makeLine(feature, seed, 4)
//   then: all faces share the feature knobs and include both left and right viewpoints
//   class: correctness
//   call: src/lib/faces/generator.ts#test_line_shares_target_feature
// === END CONTRACTS ===

import { FEATURES } from "./catalog";
import { mulberry32, pick, range } from "./rng";
import type { FaceKnobs, FaceSpec, Feature, Viewpoint } from "./types";

const SKINS = ["#c4a07a", "#e0c2a2", "#8d5a3b", "#f0d5b8", "#6b4330", "#d8b48c"];
const HAIRS = ["#1c1714", "#3a2a1c", "#6b4a28", "#2c2420", "#4a3a28", "#111010", "#5c3a22"];
const IRISES = ["#3d4a3a", "#4a3a28", "#2c3a4a", "#5a4630", "#243028"];

export function baselineKnobs(rng: () => number): FaceKnobs {
  return {
    eyeWidth: range(rng, 0.88, 1.08),
    eyeHeight: range(rng, 0.85, 1.08),
    eyeTilt: range(rng, -0.15, 0.15),
    lidHood: range(rng, 0.1, 0.4),
    eyeGap: range(rng, 0.9, 1.1),
    eyeRound: range(rng, 0.25, 0.55),
    browArch: range(rng, 0.25, 0.6),
    browThick: range(rng, 0.4, 0.75),
    browGap: range(rng, 0.85, 1.1),
    browSet: range(rng, -0.1, 0.25),
    noseWidth: range(rng, 0.82, 1.08),
    noseLength: range(rng, 0.88, 1.08),
    noseBridge: range(rng, 0.4, 0.7),
    noseHook: range(rng, -0.1, 0.2),
    noseTip: range(rng, 0.4, 0.7),
    lipWidth: range(rng, 0.88, 1.08),
    lipFull: range(rng, 0.45, 0.75),
    cupidBow: range(rng, 0.25, 0.55),
    mouthCorner: range(rng, -0.15, 0.15),
    jawWidth: range(rng, 0.85, 1.1),
    jawAngle: range(rng, 0.3, 0.6),
    chinLength: range(rng, 0.85, 1.08),
    chinCleft: range(rng, 0, 0.15),
    chinPoint: range(rng, 0.2, 0.45),
    cheekBone: range(rng, 0.3, 0.6),
    cheekFull: range(rng, 0.35, 0.65),
    earSize: range(rng, 0.85, 1.1),
    earFlare: range(rng, 0.25, 0.55),
    hairlineHeight: range(rng, 0.4, 0.7),
    widowPeak: range(rng, 0, 0.15),
    recede: range(rng, 0, 0.2),
    foreheadHeight: range(rng, 0.4, 0.7),
  };
}

export function applyFeature(base: FaceKnobs, feature: Feature): FaceKnobs {
  return { ...base, ...feature.knobs };
}

export function makeFace(seed: number, viewpoint: Viewpoint, feature: Feature): FaceSpec {
  const rng = mulberry32(seed);
  const knobs = applyFeature(baselineKnobs(rng), feature);
  return {
    seed,
    viewpoint,
    skin: pick(rng, SKINS),
    hair: pick(rng, HAIRS),
    iris: pick(rng, IRISES),
    knobs,
  };
}

export function makeLine(feature: Feature, seed: number, count = 4): FaceSpec[] {
  const views: Viewpoint[] = [];
  for (let i = 0; i < count; i++) views.push(i % 2 === 0 ? "left" : "right");
  return views.map((viewpoint, i) => makeFace(seed + i * 97 + 13, viewpoint, feature));
}

export function distractors(feature: Feature, seed: number, n = 3): Feature[] {
  const rng = mulberry32(seed + 901);
  const pool = FEATURES.filter((f) => f.id !== feature.id);
  const same = pool.filter((f) => f.region === feature.region);
  const other = pool.filter((f) => f.region !== feature.region);
  const picks: Feature[] = [];
  const take = (list: Feature[]) => {
    const remain = list.filter((f) => !picks.some((p) => p.id === f.id));
    if (remain.length) picks.push(pick(rng, remain));
  };
  take(same);
  take(same);
  while (picks.length < n) take(other.length ? other : pool);
  return picks.slice(0, n);
}

export function test_line_shares_target_feature(): void {
  const feature = FEATURES[0]!;
  const line = makeLine(feature, 42, 4);
  if (line.length !== 4) throw new AssertionError("line must have 4 faces");
  const views = new Set(line.map((f) => f.viewpoint));
  if (!views.has("left") || !views.has("right")) {
    throw new AssertionError("line must include left and right profiles");
  }
  for (const face of line) {
    for (const [key, value] of Object.entries(feature.knobs)) {
      const got = face.knobs[key as keyof FaceKnobs];
      if (got !== value) {
        throw new AssertionError(`shared knob ${key} drifted (${got} vs ${value})`);
      }
    }
  }
}

class AssertionError extends Error {
  name = "AssertionError";
}
