import type { FaceKnobs, Feature } from "@/data/catalog";

export type Viewpoint = "left" | "right";

export type Exemplar = {
  viewpoint: Viewpoint;
  knobs: FaceKnobs;
};

export const BASE_FACE_KNOBS: FaceKnobs = {
  jawWidth: 1,
  jawAngle: 0.4,
  foreheadHeight: 0.6,
  chinPoint: 0.35,
  chinLength: 1,
  chinCleft: 0,
  eyeWidth: 1,
  eyeHeight: 0.9,
  eyeTilt: 0,
  eyeRound: 0.4,
  lidHood: 0.2,
  eyeGap: 1,
  browArch: 0.45,
  browThick: 0.55,
  browSet: 0,
  browGap: 0.85,
  noseHook: 0.15,
  noseLength: 1,
  noseBridge: 0.55,
  noseTip: 0.5,
  noseWidth: 0.95,
  lipFull: 0.7,
  lipWidth: 1,
  cupidBow: 0.4,
  mouthCorner: 0,
  cheekBone: 0.5,
  cheekFull: 0.5,
  earSize: 1,
  earFlare: 0.4,
  widowPeak: 0.1,
  hairlineHeight: 0.5,
  recede: 0.15,
};

function range(random: () => number, min: number, max: number): number {
  return min + (max - min) * random();
}

export function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function baselineKnobs(random: () => number): FaceKnobs {
  return {
    jawWidth: range(random, 0.85, 1.1),
    jawAngle: range(random, 0.3, 0.6),
    foreheadHeight: range(random, 0.4, 0.7),
    chinPoint: range(random, 0.2, 0.45),
    chinLength: range(random, 0.85, 1.08),
    chinCleft: range(random, 0, 0.15),
    eyeWidth: range(random, 0.88, 1.08),
    eyeHeight: range(random, 0.85, 1.08),
    eyeTilt: range(random, -0.15, 0.15),
    eyeRound: range(random, 0.25, 0.55),
    lidHood: range(random, 0.1, 0.4),
    eyeGap: range(random, 0.9, 1.1),
    browArch: range(random, 0.25, 0.6),
    browThick: range(random, 0.4, 0.75),
    browSet: range(random, -0.1, 0.25),
    browGap: range(random, 0.85, 1.1),
    noseHook: range(random, -0.1, 0.2),
    noseLength: range(random, 0.88, 1.08),
    noseBridge: range(random, 0.4, 0.7),
    noseTip: range(random, 0.4, 0.7),
    noseWidth: range(random, 0.82, 1.08),
    lipFull: range(random, 0.45, 0.75),
    lipWidth: range(random, 0.88, 1.08),
    cupidBow: range(random, 0.25, 0.55),
    mouthCorner: range(random, -0.15, 0.15),
    cheekBone: range(random, 0.3, 0.6),
    cheekFull: range(random, 0.35, 0.65),
    earSize: range(random, 0.85, 1.1),
    earFlare: range(random, 0.25, 0.55),
    widowPeak: range(random, 0, 0.15),
    hairlineHeight: range(random, 0.4, 0.7),
    recede: range(random, 0, 0.2),
  };
}

export function makeExemplar(feature: Feature, seed: number, viewpoint: Viewpoint): Exemplar {
  return {
    viewpoint,
    knobs: { ...baselineKnobs(seededRandom(seed)), ...feature.knobs },
  };
}

export function makeExemplarLine(feature: Feature, seed: number): [Exemplar, Exemplar] {
  return [makeExemplar(feature, seed + 13, "left"), makeExemplar(feature, seed + 110, "right")];
}
