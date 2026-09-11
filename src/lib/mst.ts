/**
 * Official Monk Skin Tone Scale swatches.
 *
 * Scale citation: Monk, Ellis. “Monk Skin Tone Scale,” 2019.
 * https://skintone.google — licensed CC BY 4.0.
 */
export type MonkTone = {
  id: number;
  code: string;
  hex: string;
};

export const MONK_TONES: ReadonlyArray<MonkTone> = [
  { id: 1, code: "MST-1", hex: "#f6ede4" },
  { id: 2, code: "MST-2", hex: "#f3e7db" },
  { id: 3, code: "MST-3", hex: "#f7ead0" },
  { id: 4, code: "MST-4", hex: "#eadaba" },
  { id: 5, code: "MST-5", hex: "#d7bd96" },
  { id: 6, code: "MST-6", hex: "#a07e56" },
  { id: 7, code: "MST-7", hex: "#825c43" },
  { id: 8, code: "MST-8", hex: "#604134" },
  { id: 9, code: "MST-9", hex: "#3a312a" },
  { id: 10, code: "MST-10", hex: "#292420" },
];

export function monkToneById(id: number | null | undefined): MonkTone | undefined {
  return MONK_TONES.find((tone) => tone.id === id);
}

/** Parses the retired structural-card id used by pre-v2 saved state. */
export function monkToneIdFromLegacyFeature(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const match = /^skin_mst_(10|[1-9])$/.exec(value);
  return match ? Number(match[1]) : null;
}

function channel(value: number): number {
  const srgb = value / 255;
  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

/** Chooses the higher-contrast line colour for a tone swatch. */
export function contrastInk(hex: string): "ink" | "paper" {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  const luminance =
    0.2126 * channel((value >> 16) & 255) +
    0.7152 * channel((value >> 8) & 255) +
    0.0722 * channel(value & 255);
  const inkContrast = (luminance + 0.05) / 0.05;
  const paperContrast = 1.05 / (luminance + 0.05);
  return inkContrast >= paperContrast ? "ink" : "paper";
}
