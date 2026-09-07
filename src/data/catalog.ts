import platesJson from "./plates.json";
import { MONK_TONES } from "@/lib/mst";

export type RegionId =
  | "outline"
  | "skin"
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

export type Feature = {
  id: string;
  region: RegionId;
  name: string;
  term: string;
  gloss: string;
  knobs?: Record<string, number>;
  hex?: string;
};

export const REGIONS: { id: RegionId; label: string; note: string }[] = [
  { id: "outline", label: "Outline", note: "the outer shape of the head" },
  { id: "skin", label: "Skin", note: "Monk Skin Tone, the published colour step" },
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

const ANATOMY = platesJson as unknown as Feature[];

const SKIN: Feature[] = MONK_TONES.map((tone) => ({
  id: `skin_mst_${tone.id}`,
  region: "skin" as const,
  name: `${tone.code}`,
  term: tone.code,
  gloss: `Monk Skin Tone ${tone.id}. ${tone.note} Not a racial category.`,
  hex: tone.hex,
}));

export const FEATURES: Feature[] = [...ANATOMY, ...SKIN];

export const FIELD_ROWS: {
  id: RegionId;
  label: string;
  prompt: string;
}[] = [
  { id: "outline", label: "Outline", prompt: "The outer shape of the head." },
  {
    id: "skin",
    label: "Skin",
    prompt: "Monk Skin Tone. Name the published step, not a race.",
  },
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
  return FEATURES.filter((f) => f.region === region);
}

export function featureById(id: string): Feature | undefined {
  return FEATURES.find((f) => f.id === id);
}

export const FIELD_CARD = FIELD_ROWS.map((row) => ({
  ...row,
  choices: featuresIn(row.id).map((f) => ({
    id: f.id,
    label: f.term,
    hex: f.hex,
  })),
}));

export function emptyPicks(): Record<string, string> {
  return Object.fromEntries(FIELD_CARD.map((r) => [r.id, ""]));
}

export function namedLine(picks: Record<string, string>): string {
  const parts: string[] = [];
  for (const row of FIELD_CARD) {
    const id = picks[row.id];
    if (!id || id === "skip") continue;
    const choice = row.choices.find((c) => c.id === id);
    if (choice) parts.push(choice.label);
  }
  return parts.join(", ");
}

export function namedCount(picks: Record<string, string>): number {
  return FIELD_CARD.filter((r) => {
    const v = picks[r.id];
    return !!v && v !== "skip";
  }).length;
}

export const REGION_MASK: Record<string, string> = {
  outline: "radial-gradient(ellipse 74% 84% at 50% 46%, #000 0%, #000 64%, transparent 88%)",
  skin: "radial-gradient(ellipse 70% 80% at 50% 48%, #000 0%, #000 70%, transparent 90%)",
  forehead: "linear-gradient(to bottom, #000 0%, #000 40%, transparent 52%)",
  hairline: "linear-gradient(to bottom, #000 0%, #000 38%, transparent 50%)",
  brows: "linear-gradient(to bottom, transparent 24%, #000 32%, #000 50%, transparent 58%)",
  eyes: "linear-gradient(to bottom, transparent 30%, #000 36%, #000 56%, transparent 64%)",
  ears: "linear-gradient(to right, #000 0%, #000 24%, transparent 34%, transparent 66%, #000 76%, #000 100%)",
  cheeks: "linear-gradient(to bottom, transparent 40%, #000 48%, #000 70%, transparent 80%)",
  nose: "linear-gradient(to bottom, transparent 36%, #000 44%, #000 66%, transparent 74%)",
  mouth: "linear-gradient(to bottom, transparent 50%, #000 56%, #000 72%, transparent 80%)",
  jaw: "linear-gradient(to bottom, transparent 60%, #000 68%, #000 96%, transparent 100%)",
  chin: "linear-gradient(to bottom, transparent 48%, #000 54%, #000 74%, transparent 84%)",
};
