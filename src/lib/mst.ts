/** Official Monk Skin Tone Scale hex values (CC BY 4.0, Ellis Monk / Google). */
export type Band = "light" | "medium" | "dark";

export type MonkTone = {
  id: number;
  code: string;
  hex: string;
  band: Band;
  note: string;
  fitzpatrick: string;
};

export const MONK_TONES: MonkTone[] = [
  {
    id: 1,
    code: "MST-1",
    hex: "#f6ede4",
    band: "light",
    note: "Fairest published step. Very high L*, low chroma.",
    fitzpatrick: "I–II",
  },
  {
    id: 2,
    code: "MST-2",
    hex: "#f3e7db",
    band: "light",
    note: "Fair with a slightly warmer paper undertone.",
    fitzpatrick: "I–II",
  },
  {
    id: 3,
    code: "MST-3",
    hex: "#f7ead0",
    band: "light",
    note: "Light gold-ivory. Highest yellow bias on the light end.",
    fitzpatrick: "II–III",
  },
  {
    id: 4,
    code: "MST-4",
    hex: "#eadaba",
    band: "light",
    note: "Light-medium beige. Last step in the light group.",
    fitzpatrick: "III",
  },
  {
    id: 5,
    code: "MST-5",
    hex: "#d7bd96",
    band: "medium",
    note: "Medium tan. Center of the published range.",
    fitzpatrick: "III–IV",
  },
  {
    id: 6,
    code: "MST-6",
    hex: "#a07e56",
    band: "medium",
    note: "Medium-deep bronze. Last step in the medium group.",
    fitzpatrick: "IV",
  },
  {
    id: 7,
    code: "MST-7",
    hex: "#825c43",
    band: "dark",
    note: "Deep amber-brown. First step of the dark group.",
    fitzpatrick: "V",
  },
  {
    id: 8,
    code: "MST-8",
    hex: "#604134",
    band: "dark",
    note: "Rich umber. Mid-dark published step.",
    fitzpatrick: "V",
  },
  {
    id: 9,
    code: "MST-9",
    hex: "#3a312a",
    band: "dark",
    note: "Deep espresso. Low chroma, high melanin.",
    fitzpatrick: "VI",
  },
  {
    id: 10,
    code: "MST-10",
    hex: "#292420",
    band: "dark",
    note: "Deepest published step.",
    fitzpatrick: "VI",
  },
];

export type ItaClass = {
  id: string;
  label: string;
  min: number;
  max: number;
};

/** COLIPA / ISO 24444 ITA° skin-colour categories. */
export const ITA_CLASSES: ItaClass[] = [
  { id: "very-light", label: "Very light", min: 55, max: 90 },
  { id: "light", label: "Light", min: 41, max: 55 },
  { id: "intermediate", label: "Intermediate", min: 28, max: 41 },
  { id: "tan", label: "Tan", min: 10, max: 28 },
  { id: "brown", label: "Brown", min: -30, max: 10 },
  { id: "dark", label: "Dark", min: -90, max: -30 },
];

export type Lab = { L: number; a: number; b: number };
export type Rgb = { r: number; g: number; b: number };

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "").trim();
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (v: number) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function rgbToLab({ r, g, b }: Rgb): Lab {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  const x = (R * 0.4124564 + G * 0.3575761 + B * 0.1804375) / 0.95047;
  const y = (R * 0.2126729 + G * 0.7151522 + B * 0.072175) / 1;
  const z = (R * 0.0193339 + G * 0.119192 + B * 0.9503041) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

export function hexToLab(hex: string): Lab {
  return rgbToLab(hexToRgb(hex));
}

export function deltaE76(a: Lab, b: Lab): number {
  const dL = a.L - b.L;
  const da = a.a - b.a;
  const db = a.b - b.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

/** Individual Typology Angle in degrees. ISO 24444 / COLIPA. */
export function itaDegrees(lab: Lab): number {
  return (Math.atan2(lab.L - 50, lab.b) * 180) / Math.PI;
}

export function classifyIta(ita: number): ItaClass {
  const found = ITA_CLASSES.find((c) => ita > c.min && ita <= c.max);
  if (found) return found;
  if (ita > 55) return ITA_CLASSES[0];
  return ITA_CLASSES[ITA_CLASSES.length - 1];
}

export function nearestMonk(hex: string): { tone: MonkTone; deltaE: number } {
  const lab = hexToLab(hex);
  let best = MONK_TONES[0];
  let bestD = Infinity;
  for (const tone of MONK_TONES) {
    const d = deltaE76(lab, hexToLab(tone.hex));
    if (d < bestD) {
      best = tone;
      bestD = d;
    }
  }
  return { tone: best, deltaE: bestD };
}

export function contrastInk(hex: string): "ink" | "paper" {
  const { r, g, b } = hexToRgb(hex);
  const y = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return y > 0.55 ? "ink" : "paper";
}

export function formatLab(lab: Lab): string {
  return `L* ${lab.L.toFixed(1)}  a* ${lab.a.toFixed(1)}  b* ${lab.b.toFixed(1)}`;
}
