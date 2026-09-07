// === MODULE_BUILD ===
// id: lineament_feature_catalog
//   module_name: feature_catalog
//   module_kind: schema
//   summary: forensic-style facial feature vocabulary with distinctive knob sets
//   owner: Erin Spencer
//   public_surface: FEATURES, REGIONS, featureById, featuresInRegion
//   internal_surface: none
//   auth_boundary: none
//   storage_boundary: none
//   network_boundary: none
//   user_data_boundary: none
//   admin_only: false
//   tests: src/lib/faces/catalog.ts#test_catalog_unique_ids
//   rollout: default_enabled
//   rollback: remove catalog import sites
// === END MODULE_BUILD ===
//
// === CONTRACTS ===
// id: catalog_unique_stable_ids
//   given: the published FEATURES list
//   then: every feature.id is unique and every region has at least three variants
//   class: correctness
//   call: src/lib/faces/catalog.ts#test_catalog_unique_ids
//
// id: catalog_knobs_are_partial
//   given: any feature
//   then: knobs only touch the region they name and include at least one key
//   class: correctness
//   call: src/lib/faces/catalog.ts#test_catalog_knobs_scoped
// === END CONTRACTS ===

import type { Feature, FaceKnobs, Region } from "./types";

export const REGIONS: { id: Region; label: string; note: string }[] = [
  { id: "outline", label: "Outline", note: "the outer shape of the head" },
  { id: "eyes", label: "Eyes", note: "aperture, tilt, and lid" },
  { id: "brows", label: "Brows", note: "arch, weight, set" },
  { id: "nose", label: "Nose", note: "bridge, tip, and profile" },
  { id: "mouth", label: "Mouth", note: "width, fullness, corners" },
  { id: "jaw", label: "Jaw", note: "width and mandibular angle" },
  { id: "chin", label: "Chin", note: "projection and notch" },
  { id: "cheeks", label: "Cheeks", note: "malar bone and fullness" },
  { id: "ears", label: "Ears", note: "size and flare from the skull" },
  { id: "hairline", label: "Hairline", note: "peak, recession, height" },
  { id: "forehead", label: "Forehead", note: "vertical rise above the brow" },
];

const REGION_KEYS: Record<Region, (keyof FaceKnobs)[]> = {
  outline: ["jawWidth", "foreheadHeight", "chinPoint"],
  eyes: ["eyeWidth", "eyeHeight", "eyeTilt", "lidHood", "eyeGap", "eyeRound"],
  brows: ["browArch", "browThick", "browGap", "browSet"],
  nose: ["noseWidth", "noseLength", "noseBridge", "noseHook", "noseTip"],
  mouth: ["lipWidth", "lipFull", "cupidBow", "mouthCorner"],
  jaw: ["jawWidth", "jawAngle"],
  chin: ["chinLength", "chinCleft", "chinPoint"],
  cheeks: ["cheekBone", "cheekFull"],
  ears: ["earSize", "earFlare"],
  hairline: ["hairlineHeight", "widowPeak", "recede"],
  forehead: ["foreheadHeight"],
};

export const FEATURES: Feature[] = [
  {
    id: "eyes_almond",
    region: "eyes",
    name: "Almond eyes",
    term: "almond",
    gloss: "Tapered inner and outer corners with a long, even aperture.",
    knobs: { eyeWidth: 1.18, eyeHeight: 0.82, eyeTilt: 0.12, eyeRound: 0.2, lidHood: 0.15 },
  },
  {
    id: "eyes_hooded",
    region: "eyes",
    name: "Hooded lids",
    term: "hooded",
    gloss: "A fold of skin drops over the crease and shortens the visible lid.",
    knobs: { lidHood: 1, eyeHeight: 0.7, eyeWidth: 1.02, eyeRound: 0.35 },
  },
  {
    id: "eyes_round",
    region: "eyes",
    name: "Round eyes",
    term: "round",
    gloss: "Tall aperture with little taper; the iris is fully framed.",
    knobs: { eyeWidth: 0.92, eyeHeight: 1.22, eyeRound: 1, lidHood: 0.05, eyeTilt: 0 },
  },
  {
    id: "eyes_deep_set",
    region: "eyes",
    name: "Deep-set eyes",
    term: "deep-set",
    gloss: "The globe sits back; the brow shelf casts a short shadow.",
    knobs: { lidHood: 0.55, browSet: -0.4, eyeHeight: 0.78, eyeGap: 0.9 },
  },
  {
    id: "eyes_upturned",
    region: "eyes",
    name: "Upturned eyes",
    term: "upturned",
    gloss: "Outer canthus sits higher than the inner; a positive palpebral tilt.",
    knobs: { eyeTilt: 0.55, eyeWidth: 1.08, eyeHeight: 0.88 },
  },
  {
    id: "eyes_downturned",
    region: "eyes",
    name: "Downturned eyes",
    term: "downturned",
    gloss: "Outer canthus drops below the inner corner.",
    knobs: { eyeTilt: -0.55, eyeWidth: 1.1, eyeHeight: 0.86 },
  },
  {
    id: "brows_arched",
    region: "brows",
    name: "Arched brows",
    term: "arched",
    gloss: "A high peak sits past the iris, then falls toward the temple.",
    knobs: { browArch: 1, browThick: 0.55, browSet: 0.15 },
  },
  {
    id: "brows_straight",
    region: "brows",
    name: "Straight brows",
    term: "straight",
    gloss: "Almost no peak; the line runs level across the ridge.",
    knobs: { browArch: 0.05, browThick: 0.6, browSet: 0 },
  },
  {
    id: "brows_bushy",
    region: "brows",
    name: "Bushy brows",
    term: "bushy",
    gloss: "Heavy, wide strokes that nearly meet the lid.",
    knobs: { browThick: 1.2, browArch: 0.35, browGap: 0.7 },
  },
  {
    id: "brows_high_set",
    region: "brows",
    name: "High-set brows",
    term: "high-set",
    gloss: "A wide shelf of forehead sits between brow and lid.",
    knobs: { browSet: 0.85, browArch: 0.4, browThick: 0.5 },
  },
  {
    id: "nose_aquiline",
    region: "nose",
    name: "Aquiline nose",
    term: "aquiline",
    gloss: "A convex hook in profile, like an eagle’s beak.",
    knobs: { noseHook: 1, noseLength: 1.15, noseBridge: 0.7, noseTip: 0.35 },
  },
  {
    id: "nose_button",
    region: "nose",
    name: "Button nose",
    term: "button",
    gloss: "Short, low bridge with a small rounded tip.",
    knobs: { noseLength: 0.7, noseWidth: 0.85, noseHook: 0, noseTip: 0.85, noseBridge: 0.35 },
  },
  {
    id: "nose_roman",
    region: "nose",
    name: "Roman nose",
    term: "roman",
    gloss: "A high, nearly straight bridge that projects strongly.",
    knobs: { noseBridge: 1, noseLength: 1.12, noseHook: 0.15, noseWidth: 0.82 },
  },
  {
    id: "nose_snub",
    region: "nose",
    name: "Snub nose",
    term: "snub",
    gloss: "Short and slightly upturned at the tip.",
    knobs: { noseLength: 0.68, noseTip: 1, noseHook: -0.35, noseWidth: 0.95 },
  },
  {
    id: "nose_broad",
    region: "nose",
    name: "Broad nose",
    term: "broad",
    gloss: "Wide alae and a generous tip, read most clearly in three-quarter view.",
    knobs: { noseWidth: 1.28, noseTip: 0.7, noseBridge: 0.45, noseLength: 0.95 },
  },
  {
    id: "mouth_full",
    region: "mouth",
    name: "Full lips",
    term: "full",
    gloss: "Both vermilion borders are thick, with a soft outer contour.",
    knobs: { lipFull: 1.15, lipWidth: 0.98, cupidBow: 0.45 },
  },
  {
    id: "mouth_thin",
    region: "mouth",
    name: "Thin lips",
    term: "thin",
    gloss: "A narrow vermilion with little vertical volume.",
    knobs: { lipFull: 0.28, lipWidth: 0.95, cupidBow: 0.2 },
  },
  {
    id: "mouth_wide",
    region: "mouth",
    name: "Wide mouth",
    term: "wide",
    gloss: "Commissures sit well outside the iris line.",
    knobs: { lipWidth: 1.28, lipFull: 0.7, mouthCorner: 0.1 },
  },
  {
    id: "mouth_cupid",
    region: "mouth",
    name: "Cupid’s bow",
    term: "cupid’s bow",
    gloss: "A sharp double peak on the upper lip.",
    knobs: { cupidBow: 1, lipFull: 0.85, lipWidth: 0.92 },
  },
  {
    id: "mouth_downturned",
    region: "mouth",
    name: "Downturned mouth",
    term: "downturned",
    gloss: "Commissures fall below the midline of the lips.",
    knobs: { mouthCorner: -0.9, lipWidth: 1.02, lipFull: 0.6 },
  },
  {
    id: "jaw_square",
    region: "jaw",
    name: "Square jaw",
    term: "square",
    gloss: "A wide bigonial width and an abrupt mandibular angle.",
    knobs: { jawWidth: 1.22, jawAngle: 0.2 },
  },
  {
    id: "jaw_tapered",
    region: "jaw",
    name: "Tapered jaw",
    term: "tapered",
    gloss: "The mandible narrows cleanly toward the chin.",
    knobs: { jawWidth: 0.72, jawAngle: 0.85 },
  },
  {
    id: "jaw_rounded",
    region: "jaw",
    name: "Rounded jaw",
    term: "rounded",
    gloss: "A soft curve with little angular break at the gonion.",
    knobs: { jawWidth: 0.95, jawAngle: 0.55 },
  },
  {
    id: "jaw_lantern",
    region: "jaw",
    name: "Lantern jaw",
    term: "lantern",
    gloss: "A long, projecting lower third that reads in profile first.",
    knobs: { jawWidth: 1.05, jawAngle: 0.35, chinLength: 1.2 },
  },
  {
    id: "chin_cleft",
    region: "chin",
    name: "Cleft chin",
    term: "cleft",
    gloss: "A vertical notch in the mentalis, visible from both sides.",
    knobs: { chinCleft: 1, chinPoint: 0.4, chinLength: 1.05 },
  },
  {
    id: "chin_pointed",
    region: "chin",
    name: "Pointed chin",
    term: "pointed",
    gloss: "A sharp mental point rather than a padded pad.",
    knobs: { chinPoint: 1, chinLength: 1.1, chinCleft: 0 },
  },
  {
    id: "chin_receding",
    region: "chin",
    name: "Receding chin",
    term: "receding",
    gloss: "The chin sits behind the lower lip in profile.",
    knobs: { chinLength: 0.55, chinPoint: 0.15, chinCleft: 0 },
  },
  {
    id: "chin_strong",
    region: "chin",
    name: "Strong chin",
    term: "strong",
    gloss: "Broad, forward mental eminence without a sharp point.",
    knobs: { chinLength: 1.18, chinPoint: 0.25, chinCleft: 0.1 },
  },
  {
    id: "cheeks_high",
    region: "cheeks",
    name: "High cheekbones",
    term: "high cheekbones",
    gloss: "Malar bones sit high and catch a hard side light.",
    knobs: { cheekBone: 1, cheekFull: 0.35 },
  },
  {
    id: "cheeks_hollow",
    region: "cheeks",
    name: "Hollow cheeks",
    term: "hollow",
    gloss: "A concavity under the malar, often read as a long midface.",
    knobs: { cheekBone: 0.7, cheekFull: 0.05 },
  },
  {
    id: "cheeks_full",
    region: "cheeks",
    name: "Full cheeks",
    term: "full",
    gloss: "Soft volume from the nasolabial fold out to the zygoma.",
    knobs: { cheekFull: 1, cheekBone: 0.35 },
  },
  {
    id: "ears_prominent",
    region: "ears",
    name: "Prominent ears",
    term: "prominent",
    gloss: "The helix stands away from the skull — clearest in profile.",
    knobs: { earSize: 1.15, earFlare: 1 },
  },
  {
    id: "ears_close",
    region: "ears",
    name: "Close-set ears",
    term: "close-set",
    gloss: "The pinna lies flat against the head.",
    knobs: { earSize: 0.9, earFlare: 0.1 },
  },
  {
    id: "ears_large",
    region: "ears",
    name: "Large ears",
    term: "large",
    gloss: "A long pinna relative to the face, even when pinned back.",
    knobs: { earSize: 1.35, earFlare: 0.45 },
  },
  {
    id: "hairline_widow",
    region: "hairline",
    name: "Widow’s peak",
    term: "widow’s peak",
    gloss: "A V-shaped descent at the midline of the hairline.",
    knobs: { widowPeak: 1, hairlineHeight: 0.55, recede: 0.15 },
  },
  {
    id: "hairline_receding",
    region: "hairline",
    name: "Receding hairline",
    term: "receding",
    gloss: "Temples pull back, leaving a high, often M-shaped front.",
    knobs: { recede: 1, hairlineHeight: 0.85, widowPeak: 0.1 },
  },
  {
    id: "hairline_low",
    region: "hairline",
    name: "Low hairline",
    term: "low",
    gloss: "Hair meets the brow shelf with little forehead showing.",
    knobs: { hairlineHeight: 0.2, recede: 0, widowPeak: 0.05 },
  },
  {
    id: "forehead_high",
    region: "forehead",
    name: "High forehead",
    term: "high",
    gloss: "A tall frontal rise from brow to hairline.",
    knobs: { foreheadHeight: 1, hairlineHeight: 0.9 },
  },
  {
    id: "forehead_low",
    region: "forehead",
    name: "Low forehead",
    term: "low",
    gloss: "A short vertical span between brow and hair.",
    knobs: { foreheadHeight: 0.2, hairlineHeight: 0.25 },
  },
  {
    id: "forehead_broad",
    region: "forehead",
    name: "Broad forehead",
    term: "broad",
    gloss: "Wide frontal bone; the temples do not pinch.",
    knobs: { foreheadHeight: 0.7, jawWidth: 1.08, recede: 0.2 },
  },
{
    id: "outline_oval",
    region: "outline",
    name: "Oval face",
    term: "oval",
    gloss: "A longer-than-wide outline that tapers gently at the chin.",
    knobs: { jawWidth: 0.92, foreheadHeight: 0.7, chinPoint: 0.4 },
  },
  {
    id: "outline_round",
    region: "outline",
    name: "Round face",
    term: "round",
    gloss: "Similar width and length with a soft, circular perimeter.",
    knobs: { jawWidth: 1.12, foreheadHeight: 0.45, chinPoint: 0.15 },
  },
  {
    id: "outline_long",
    region: "outline",
    name: "Long face",
    term: "long",
    gloss: "A tall, narrow outline; forehead-to-chin reads stretched.",
    knobs: { jawWidth: 0.78, foreheadHeight: 1, chinPoint: 0.45 },
  },
  {
    id: "outline_square",
    region: "outline",
    name: "Square face",
    term: "square",
    gloss: "Forehead and jaw share a similar width with little taper.",
    knobs: { jawWidth: 1.22, foreheadHeight: 0.55, chinPoint: 0.1 },
  },
  {
    id: "outline_heart",
    region: "outline",
    name: "Heart-shaped face",
    term: "heart",
    gloss: "A wide forehead that narrows to a pointed chin.",
    knobs: { jawWidth: 0.7, foreheadHeight: 0.75, chinPoint: 1 },
  },
  {
    id: "eyes_close",
    region: "eyes",
    name: "Close-set eyes",
    term: "close-set",
    gloss: "A short intercanthal span; the eyes sit near the nose root.",
    knobs: { eyeGap: 0.55, eyeWidth: 0.95 },
  },
  {
    id: "eyes_wide",
    region: "eyes",
    name: "Wide-set eyes",
    term: "wide-set",
    gloss: "A long intercanthal span; more nose bridge shows between.",
    knobs: { eyeGap: 1.4, eyeWidth: 0.95 },
  },
  {
    id: "eyes_prominent",
    region: "eyes",
    name: "Prominent eyes",
    term: "prominent",
    gloss: "The globe sits forward; lids do not recess under the brow.",
    knobs: { eyeHeight: 1.15, lidHood: 0.05, eyeRound: 0.7 },
  },
  {
    id: "brows_unibrow",
    region: "brows",
    name: "Unibrow",
    term: "unibrow",
    gloss: "The brows meet or nearly meet over the glabella.",
    knobs: { browGap: 0.15, browThick: 0.85 },
  },
  {
    id: "brows_low_set",
    region: "brows",
    name: "Low-set brows",
    term: "low-set",
    gloss: "Little shelf between brow and lid; the ridge sits close to the eye.",
    knobs: { browSet: -0.7, browThick: 0.6 },
  },
  {
    id: "nose_crooked",
    region: "nose",
    name: "Crooked nose",
    term: "crooked",
    gloss: "The dorsum or tip deviates off the midline.",
    knobs: { noseBridge: 0.7, noseWidth: 0.95, noseHook: 0.25 },
  },
  {
    id: "nose_bifid",
    region: "nose",
    name: "Bifid tip",
    term: "bifid tip",
    gloss: "A groove splits the nasal tip into two lobes.",
    knobs: { noseTip: 0.9, noseWidth: 1.05 },
  },
  {
    id: "nose_flared",
    region: "nose",
    name: "Flared alae",
    term: "flared alae",
    gloss: "The wings of the nose stand wide of the tip.",
    knobs: { noseWidth: 1.35, noseTip: 0.55 },
  },
  {
    id: "mouth_upturned",
    region: "mouth",
    name: "Upturned mouth",
    term: "upturned",
    gloss: "Commissures sit above the midline of the lips.",
    knobs: { mouthCorner: 0.85, lipWidth: 1.02 },
  },
  {
    id: "mouth_philtrum_deep",
    region: "mouth",
    name: "Deep philtrum",
    term: "deep philtrum",
    gloss: "A clear groove and raised columns between nose and lip.",
    knobs: { cupidBow: 0.85, lipFull: 0.7 },
  },
  {
    id: "mouth_philtrum_flat",
    region: "mouth",
    name: "Flat philtrum",
    term: "flat philtrum",
    gloss: "Little or no groove between the nose and the upper lip.",
    knobs: { cupidBow: 0.05, lipFull: 0.55 },
  },
  {
    id: "cheeks_dimple",
    region: "cheeks",
    name: "Dimples",
    term: "dimples",
    gloss: "A pit in the soft cheek, often nearer the mouth than the ear.",
    knobs: { cheekFull: 0.8, cheekBone: 0.45 },
  },
  {
    id: "ears_lobe_attached",
    region: "ears",
    name: "Attached lobes",
    term: "attached lobes",
    gloss: "The lobe joins the face with no hanging free edge.",
    knobs: { earSize: 1, earFlare: 0.35 },
  },
  {
    id: "ears_lobe_free",
    region: "ears",
    name: "Free lobes",
    term: "free lobes",
    gloss: "The lobe hangs clear of the jaw before it meets the face.",
    knobs: { earSize: 1.08, earFlare: 0.4 },
  },
  {
    id: "ears_darwin",
    region: "ears",
    name: "Darwin’s tubercle",
    term: "Darwin’s tubercle",
    gloss: "A small bump on the helix, usually on the upper rim.",
    knobs: { earSize: 1.1, earFlare: 0.5 },
  },
  {
    id: "hairline_cowlick",
    region: "hairline",
    name: "Cowlick",
    term: "cowlick",
    gloss: "A spiral or reverse growth at the hairline that breaks the part.",
    knobs: { widowPeak: 0.2, hairlineHeight: 0.5 },
  },
  {
    id: "forehead_brow_ridge",
    region: "forehead",
    name: "Brow ridge",
    term: "brow ridge",
    gloss: "A projecting supraorbital shelf above the eyes.",
    knobs: { foreheadHeight: 0.55 },
  },

];

export function featureById(id: string): Feature | undefined {
  return FEATURES.find((f) => f.id === id);
}

export function featuresInRegion(region: Region): Feature[] {
  return FEATURES.filter((f) => f.region === region);
}

export function test_catalog_unique_ids(): void {
  const ids = FEATURES.map((f) => f.id);
  const set = new Set(ids);
  if (set.size !== ids.length) {
    throw new AssertionError("feature ids must be unique");
  }
  for (const region of REGIONS) {
    const n = featuresInRegion(region.id).length;
    if (n < 3) {
      throw new AssertionError(`${region.id} needs at least 3 variants, has ${n}`);
    }
  }
}

export function test_catalog_knobs_scoped(): void {
  for (const feature of FEATURES) {
    const keys = Object.keys(feature.knobs) as (keyof FaceKnobs)[];
    if (keys.length < 1) {
      throw new AssertionError(`${feature.id} has empty knobs`);
    }
    const allowed = new Set(REGION_KEYS[feature.region]);
    // lantern jaw also sets chinLength; forehead may set hairline/jaw — allow documented extras
    const extras: Partial<Record<string, (keyof FaceKnobs)[]>> = {
      jaw_lantern: ["chinLength"],
      eyes_deep_set: ["browSet"],
      forehead_high: ["hairlineHeight"],
      forehead_low: ["hairlineHeight"],
      forehead_broad: ["jawWidth", "recede"],
    };
    for (const key of extras[feature.id] ?? []) allowed.add(key);
    for (const key of keys) {
      if (!allowed.has(key)) {
        throw new AssertionError(`${feature.id} knob ${key} is outside ${feature.region}`);
      }
    }
  }
}

class AssertionError extends Error {
  name = "AssertionError";
}
