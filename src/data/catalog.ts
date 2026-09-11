import platesJson from "./plates.json";

export type RegionId =
  | "outline"
  | "forehead"
  | "hairline"
  | "brows"
  | "eyes"
  | "nose"
  | "cheeks"
  | "mouth"
  | "jaw"
  | "chin"
  | "ears";

export type FaceKnobs = {
  jawWidth: number;
  jawAngle: number;
  foreheadHeight: number;
  chinPoint: number;
  chinLength: number;
  chinCleft: number;
  eyeWidth: number;
  eyeHeight: number;
  eyeTilt: number;
  eyeRound: number;
  lidHood: number;
  eyeGap: number;
  browArch: number;
  browThick: number;
  browSet: number;
  browGap: number;
  noseHook: number;
  noseLength: number;
  noseBridge: number;
  noseTip: number;
  noseWidth: number;
  lipFull: number;
  lipWidth: number;
  cupidBow: number;
  mouthCorner: number;
  cheekBone: number;
  cheekFull: number;
  earSize: number;
  earFlare: number;
  widowPeak: number;
  hairlineHeight: number;
  recede: number;
};

export type Feature = {
  id: string;
  region: RegionId;
  name: string;
  term: string;
  gloss: string;
  knobs: Partial<FaceKnobs>;
};

export const REGIONS: ReadonlyArray<{
  id: RegionId;
  label: string;
  note: string;
}> = [
  { id: "outline", label: "Outline", note: "the outer shape of the head" },
  { id: "forehead", label: "Forehead", note: "vertical rise above the brow" },
  { id: "hairline", label: "Hairline", note: "peak, recession, height" },
  { id: "brows", label: "Brows", note: "arch, weight, set" },
  { id: "eyes", label: "Eyes", note: "aperture, tilt, and lid" },
  { id: "nose", label: "Nose", note: "bridge, tip, and profile" },
  { id: "cheeks", label: "Cheeks", note: "malar bone and fullness" },
  { id: "mouth", label: "Mouth", note: "width, fullness, corners" },
  { id: "jaw", label: "Jaw", note: "width and mandibular angle" },
  { id: "chin", label: "Chin", note: "projection and notch" },
  { id: "ears", label: "Ears", note: "size and flare from the skull" },
];

export const REGION_IDS = new Set<RegionId>(REGIONS.map((region) => region.id));

/** Knobs a term may deliberately change while isolating its named region. */
export const REGION_KNOBS: Record<RegionId, ReadonlyArray<keyof FaceKnobs>> = {
  outline: ["jawWidth", "foreheadHeight", "chinPoint"],
  forehead: ["foreheadHeight", "hairlineHeight", "jawWidth", "recede"],
  hairline: ["hairlineHeight", "widowPeak", "recede"],
  brows: ["browArch", "browThick", "browGap", "browSet"],
  eyes: ["eyeWidth", "eyeHeight", "eyeTilt", "lidHood", "eyeGap", "eyeRound", "browSet"],
  nose: ["noseWidth", "noseLength", "noseBridge", "noseHook", "noseTip"],
  cheeks: ["cheekBone", "cheekFull"],
  mouth: ["lipWidth", "lipFull", "cupidBow", "mouthCorner"],
  jaw: ["jawWidth", "jawAngle", "chinLength"],
  chin: ["chinLength", "chinCleft", "chinPoint"],
  ears: ["earSize", "earFlare"],
};

/** The 62 structural terms. Appearance attributes intentionally live elsewhere. */
export const FEATURES = platesJson as Feature[];

export const FIELD_ROWS: ReadonlyArray<{
  id: RegionId;
  label: string;
  prompt: string;
}> = [
  { id: "outline", label: "Outline", prompt: "The outer shape of the head." },
  { id: "forehead", label: "Forehead", prompt: "Brow to hair." },
  { id: "hairline", label: "Hairline", prompt: "Where hair meets skin." },
  { id: "brows", label: "Brows", prompt: "Arch, weight, set." },
  { id: "eyes", label: "Eyes", prompt: "Aperture and tilt." },
  { id: "nose", label: "Nose", prompt: "Bridge and tip." },
  { id: "cheeks", label: "Cheeks", prompt: "Bone and volume." },
  { id: "mouth", label: "Mouth", prompt: "Width, fullness, corners." },
  { id: "jaw", label: "Jaw", prompt: "Width and angle." },
  { id: "chin", label: "Chin", prompt: "Projection and notch." },
  { id: "ears", label: "Ears", prompt: "Skip if hair hides them." },
];

export function featuresIn(region: RegionId): Feature[] {
  return FEATURES.filter((feature) => feature.region === region);
}

export function featureById(id: string): Feature | undefined {
  return FEATURES.find((feature) => feature.id === id);
}

export const FIELD_CARD = FIELD_ROWS.map((row) => ({
  ...row,
  choices: featuresIn(row.id).map((feature) => ({
    id: feature.id,
    label: feature.term,
  })),
}));

export type FieldPicks = Record<RegionId, string>;

export function emptyPicks(): FieldPicks {
  return Object.fromEntries(FIELD_CARD.map((row) => [row.id, ""])) as FieldPicks;
}

export function namedLine(picks: Partial<FieldPicks>, skinToneCode?: string): string {
  const parts: string[] = [];
  if (skinToneCode) parts.push(`skin tone ${skinToneCode}`);
  for (const row of FIELD_CARD) {
    const id = picks[row.id];
    if (!id || id === "skip") continue;
    const choice = row.choices.find((candidate) => candidate.id === id);
    if (choice) parts.push(choice.label);
  }
  return parts.join(", ");
}

export function namedCount(picks: Partial<FieldPicks>): number {
  return FIELD_CARD.filter((row) => {
    const value = picks[row.id];
    return Boolean(value) && value !== "skip";
  }).length;
}
