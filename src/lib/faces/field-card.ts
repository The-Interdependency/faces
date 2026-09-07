// === MODULE_BUILD ===
// id: lineament_field_card
//   module_name: field_card
//   module_kind: schema
//   summary: top-to-bottom slots for describing a live face in under two minutes
//   owner: Erin Spencer
//   public_surface: FIELD_SLOTS, composeDescription, emptyPicks
//   internal_surface: none
//   auth_boundary: none
//   storage_boundary: none
//   network_boundary: none
//   user_data_boundary: none
//   admin_only: false
//   tests: src/lib/faces/field-card.ts#test_field_slots_cover_catalog
//   rollout: default_enabled
//   rollback: hide Field tab
// === END MODULE_BUILD ===

import { FEATURES, featuresInRegion } from "./catalog";
import type { Feature, Region } from "./types";

export type FieldPick = string | "skip";
export type FieldPicks = Record<string, FieldPick>;

export type FieldChoice = {
  id: string;
  label: string;
  featureId?: string;
};

export type FieldSlot = {
  id: string;
  label: string;
  prompt: string;
  choices: FieldChoice[];
};

const ORDER: { id: string; label: string; prompt: string; region?: Region }[] = [
  { id: "outline", label: "Outline", prompt: "The outer shape of the head.", region: "outline" },
  { id: "forehead", label: "Forehead", prompt: "Brow to hair.", region: "forehead" },
  { id: "hairline", label: "Hairline", prompt: "Where hair meets skin.", region: "hairline" },
  { id: "brows", label: "Brows", prompt: "Arch, weight, set.", region: "brows" },
  { id: "eyes", label: "Eyes", prompt: "Aperture and tilt.", region: "eyes" },
  { id: "nose", label: "Nose", prompt: "Bridge and tip.", region: "nose" },
  { id: "cheeks", label: "Cheeks", prompt: "Bone and volume.", region: "cheeks" },
  { id: "mouth", label: "Mouth", prompt: "Width, fullness, corners.", region: "mouth" },
  { id: "jaw", label: "Jaw", prompt: "Width and angle.", region: "jaw" },
  { id: "chin", label: "Chin", prompt: "Projection and notch.", region: "chin" },
  { id: "ears", label: "Ears", prompt: "Skip if hair hides them.", region: "ears" },
];

function choicesFor(region: Region): FieldChoice[] {
  return featuresInRegion(region).map((f) => ({
    id: f.id,
    label: f.term,
    featureId: f.id,
  }));
}

export const FIELD_SLOTS: FieldSlot[] = ORDER.map((row) => ({
  id: row.id,
  label: row.label,
  prompt: row.prompt,
  choices: choicesFor(row.region!),
}));

export function emptyPicks(): FieldPicks {
  return Object.fromEntries(FIELD_SLOTS.map((s) => [s.id, ""]));
}

export function composeDescription(picks: FieldPicks): string {
  const parts: string[] = [];
  for (const slot of FIELD_SLOTS) {
    const pick = picks[slot.id];
    if (!pick || pick === "skip") continue;
    const choice = slot.choices.find((c) => c.id === pick);
    if (!choice) continue;
    parts.push(choice.label);
  }
  return parts.join(", ");
}

export function filledCount(picks: FieldPicks): number {
  return FIELD_SLOTS.filter((s) => {
    const v = picks[s.id];
    return Boolean(v) && v !== "skip";
  }).length;
}

export function featureForPick(picks: FieldPicks, slotId: string): Feature | undefined {
  const pick = picks[slotId];
  if (!pick || pick === "skip") return undefined;
  return FEATURES.find((f) => f.id === pick);
}

export function test_field_slots_cover_catalog() {
  const covered = new Set(
    FIELD_SLOTS.flatMap((s) => s.choices.map((c) => c.featureId).filter(Boolean)),
  );
  for (const f of FEATURES) {
    if (!covered.has(f.id)) throw new Error(`catalog term missing from field card: ${f.id}`);
  }
  if (FIELD_SLOTS.length !== 11) throw new Error("expected eleven field slots");
}
