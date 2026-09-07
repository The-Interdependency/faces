export type Region =
  | "outline"
  | "eyes"
  | "brows"
  | "nose"
  | "mouth"
  | "jaw"
  | "chin"
  | "cheeks"
  | "ears"
  | "hairline"
  | "forehead";

export type Viewpoint = "left" | "right";

export type FaceKnobs = {
  eyeWidth: number;
  eyeHeight: number;
  eyeTilt: number;
  lidHood: number;
  eyeGap: number;
  eyeRound: number;
  browArch: number;
  browThick: number;
  browGap: number;
  browSet: number;
  noseWidth: number;
  noseLength: number;
  noseBridge: number;
  noseHook: number;
  noseTip: number;
  lipWidth: number;
  lipFull: number;
  cupidBow: number;
  mouthCorner: number;
  jawWidth: number;
  jawAngle: number;
  chinLength: number;
  chinCleft: number;
  chinPoint: number;
  cheekBone: number;
  cheekFull: number;
  earSize: number;
  earFlare: number;
  hairlineHeight: number;
  widowPeak: number;
  recede: number;
  foreheadHeight: number;
};

export type FaceSpec = {
  seed: number;
  viewpoint: Viewpoint;
  skin: string;
  hair: string;
  iris: string;
  knobs: FaceKnobs;
};

export type Feature = {
  id: string;
  region: Region;
  name: string;
  term: string;
  gloss: string;
  knobs: Partial<FaceKnobs>;
};

export type EncodeMs = 3000 | 6000 | 12000 | 0;

export type LeitnerCard = {
  featureId: string;
  box: 1 | 2 | 3 | 4 | 5;
  reviews: number;
  correct: number;
  streak: number;
  lastResult: "pass" | "fail" | null;
  lastSeenAt: number;
  dueAt: number;
};

export type TrialLog = {
  at: number;
  featureId: string;
  encodeMs: number;
  correct: boolean;
  latencyMs: number;
};

export type TrainerState = {
  cards: Record<string, LeitnerCard>;
  trials: TrialLog[];
  encodeMs: EncodeMs;
  sessionStartedAt: number;
  fieldPicks: Record<string, string>;
};
