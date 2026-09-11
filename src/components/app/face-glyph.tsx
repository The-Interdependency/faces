// === CONTRACTS ===
// id: glyph_renders_left_right
//   given: a feature
//   then: the glyph renders a left and a right profile with the feature region in focus
//   class: ux_correctness
//   call: hmmm
//
// id: glyph_knobs_fall_back_to_base
//   given: a feature with partial knobs
//   then: missing knobs fall back to BASE_FACE_KNOBS values
//   class: correctness
//   call: hmmm
// === END CONTRACTS ===

import type { FaceKnobs, Feature, RegionId } from "@/data/catalog";
import { BASE_FACE_KNOBS, makeExemplarLine } from "@/lib/exemplars";

type Knobs = FaceKnobs;

function n(knobs: Knobs, key: keyof FaceKnobs, fallback = 0) {
  const v = knobs[key];
  return typeof v === "number" && Number.isFinite(v) ? v : (BASE_FACE_KNOBS[key] ?? fallback);
}

function FaceView({ knobs, yaw, focus }: { knobs: Knobs; yaw: number; focus: RegionId }) {
  const ink = "#efe8e6";
  const faint = "rgba(239,232,230,0.22)";
  const hot = "#e8ece8";

  const stroke = (region: RegionId, thin = 1.4) => ({
    stroke: focus === region ? hot : ink,
    strokeWidth: focus === region ? 2.2 : thin,
    opacity: focus === region ? 1 : 0.55,
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  });

  const cx = 100 + yaw * 16;
  const top = 28 - n(knobs, "foreheadHeight") * 8;
  const hair = 44 + n(knobs, "hairlineHeight") * 14;
  const recede = n(knobs, "recede") * 12;
  const peak = n(knobs, "widowPeak") * 10;
  const browY = 86 - n(knobs, "browSet") * 12;
  const eyeY = 100;
  const noseLen = 28 * n(knobs, "noseLength");
  const noseY = eyeY + noseLen;
  const mouthY = noseY + 16;
  const chinY = 196 + (n(knobs, "chinLength") - 1) * 14;
  const half = 48 * n(knobs, "jawWidth");
  const temple = 50 + n(knobs, "foreheadHeight") * 2;
  const chinPt = n(knobs, "chinPoint") * 8;
  const angle = n(knobs, "jawAngle");
  const gonion = 0.55 + angle * 0.2;

  const head = [
    `M ${cx} ${top}`,
    `C ${cx - temple} ${top + 4}, ${cx - half + recede} ${hair + 4}, ${cx - half} ${browY}`,
    `C ${cx - half - 1} ${eyeY + 16}, ${cx - half * gonion} ${mouthY + 8}, ${cx - 6 - chinPt * 0.4} ${chinY}`,
    `Q ${cx} ${chinY + 6}, ${cx + 6 + chinPt * 0.4} ${chinY}`,
    `C ${cx + half * gonion} ${mouthY + 8}, ${cx + half + 1} ${eyeY + 16}, ${cx + half} ${browY}`,
    `C ${cx + half - recede} ${hair + 4}, ${cx + temple} ${top + 4}, ${cx} ${top}`,
  ].join(" ");

  const hairline = [
    `M ${cx - half + recede + 8} ${hair}`,
    `Q ${cx} ${hair + peak} ${cx + half - recede - 8} ${hair}`,
  ].join(" ");

  const gap = 16 * n(knobs, "eyeGap");
  const eW = 12 * n(knobs, "eyeWidth");
  const eH = 5.4 * n(knobs, "eyeHeight") * (0.55 + n(knobs, "eyeRound") * 0.55);
  const tilt = n(knobs, "eyeTilt") * 9;
  const hood = n(knobs, "lidHood");

  const eye = (side: number) => {
    const x = cx + side * gap + yaw * 5;
    const y = eyeY;
    return { x, y };
  };

  const brow = (side: number) => {
    const inner = cx + side * (9 * n(knobs, "browGap"));
    const outer = inner + side * (eW + 6);
    const arch = n(knobs, "browArch") * 6;
    return `M ${inner} ${browY} Q ${(inner + outer) / 2} ${browY - arch} ${outer} ${browY + 0.8}`;
  };

  const noseX = cx + yaw * 10;
  const hook = n(knobs, "noseHook") * 7;
  const nW = 8 * n(knobs, "noseWidth");
  const nose = [
    `M ${cx + yaw * 3} ${eyeY + 4}`,
    `Q ${noseX + hook * Math.sign(yaw || 1) * 0.15} ${eyeY + noseLen * 0.55}, ${noseX} ${noseY}`,
  ].join(" ");
  const alae = [
    `M ${noseX - nW} ${noseY - 3} Q ${noseX - nW * 0.2} ${noseY + 2 + n(knobs, "noseTip")} ${noseX} ${noseY}`,
    `M ${noseX + nW} ${noseY - 3} Q ${noseX + nW * 0.2} ${noseY + 2 + n(knobs, "noseTip")} ${noseX} ${noseY}`,
  ].join(" ");

  const lipW = 17 * n(knobs, "lipWidth");
  const lipH = 3.2 * n(knobs, "lipFull");
  const bow = n(knobs, "cupidBow") * 2.8;
  const corner = n(knobs, "mouthCorner") * 3.5;
  const upper = `M ${cx - lipW} ${mouthY - corner} Q ${cx - lipW * 0.4} ${mouthY - lipH - bow} ${cx} ${mouthY - lipH * 0.25} Q ${cx + lipW * 0.4} ${mouthY - lipH - bow} ${cx + lipW} ${mouthY - corner}`;
  const lower = `M ${cx - lipW} ${mouthY - corner} Q ${cx} ${mouthY + lipH * 1.3} ${cx + lipW} ${mouthY - corner}`;
  const philtrum = `M ${noseX} ${noseY + 3} L ${cx} ${mouthY - lipH - 2}`;

  const cheek = (side: number) => {
    const drop = (1 - n(knobs, "cheekFull")) * 6;
    const bone = n(knobs, "cheekBone") * 6;
    return `M ${cx + side * (half * 0.35)} ${eyeY + 14} Q ${cx + side * (half * 0.62 + bone)} ${mouthY - 4 + drop} ${cx + side * (half * 0.28)} ${mouthY + 6}`;
  };

  const earH = 24 * n(knobs, "earSize");
  const flare = 3 + n(knobs, "earFlare") * 7;
  const nearSide = yaw >= 0 ? 1 : -1;
  const earX = cx + nearSide * (half + flare * 0.35);
  const earY = eyeY - 2;
  const earRim = `M ${cx + nearSide * half} ${earY} C ${earX + nearSide * flare} ${earY + 3}, ${earX + nearSide * flare} ${earY + earH * 0.7}, ${cx + nearSide * (half - 2)} ${earY + earH}`;
  const lobeFree = n(knobs, "earFlare") > 0.35;
  const lobe = `M ${cx + nearSide * (half - 1)} ${earY + earH * 0.7} Q ${earX + nearSide * (lobeFree ? 5 : 1)} ${earY + earH + 4} ${cx + nearSide * (half - 4)} ${earY + earH * 0.82}`;
  const darwin = `M ${earX + nearSide * flare * 0.55} ${earY + 7} l ${nearSide * 3} 3`;

  const L = eye(-1);
  const R = eye(1);

  return (
    <svg viewBox="0 0 200 240" className="h-full w-full" aria-hidden>
      <rect width="200" height="240" fill="#16161b" />
      <path
        d={head}
        fill="none"
        stroke={focus === "outline" ? hot : ink}
        strokeWidth={focus === "outline" ? 2.2 : 1.5}
        opacity={focus === "outline" ? 1 : 0.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={hairline} {...stroke("hairline", 1.35)} />
      <path
        d={`M ${cx - 22} ${(top + hair) / 2 + 6} Q ${cx} ${(top + browY) / 2} ${cx + 22} ${(top + hair) / 2 + 6}`}
        {...stroke("forehead", 1.15)}
      />
      <path d={brow(-1)} {...stroke("brows", 1.2 + n(knobs, "browThick") * 1.6)} />
      <path d={brow(1)} {...stroke("brows", 1.2 + n(knobs, "browThick") * 1.6)} />
      {n(knobs, "browGap") < 0.3 ? (
        <path d={`M ${cx - 5} ${browY + 1} L ${cx + 5} ${browY + 1}`} {...stroke("brows", 1.8)} />
      ) : null}

      <g transform={`rotate(${-tilt} ${L.x} ${L.y})`}>
        <ellipse cx={L.x} cy={L.y} rx={eW} ry={eH} {...stroke("eyes")} />
        <circle cx={L.x} cy={L.y} r={Math.min(eH * 0.7, 2.4)} fill={ink} fillOpacity="0.7" />
        {hood > 0.45 ? (
          <path
            d={`M ${L.x - eW} ${L.y - eH * 0.15} Q ${L.x} ${L.y - eH + hood * 4} ${L.x + eW} ${L.y - eH * 0.15}`}
            {...stroke("eyes")}
          />
        ) : null}
      </g>
      <g transform={`rotate(${tilt} ${R.x} ${R.y})`}>
        <ellipse cx={R.x} cy={R.y} rx={eW} ry={eH} {...stroke("eyes")} />
        <circle cx={R.x} cy={R.y} r={Math.min(eH * 0.7, 2.4)} fill={ink} fillOpacity="0.7" />
        {hood > 0.45 ? (
          <path
            d={`M ${R.x - eW} ${R.y - eH * 0.15} Q ${R.x} ${R.y - eH + hood * 4} ${R.x + eW} ${R.y - eH * 0.15}`}
            {...stroke("eyes")}
          />
        ) : null}
      </g>

      <path d={nose} {...stroke("nose")} />
      <path d={alae} {...stroke("nose")} />
      <path d={cheek(-1)} {...stroke("cheeks", 1.2)} opacity={focus === "cheeks" ? 1 : 0.2} />
      <path d={cheek(1)} {...stroke("cheeks", 1.2)} opacity={focus === "cheeks" ? 1 : 0.2} />
      {n(knobs, "cheekFull") > 0.75 ? (
        <>
          <path d={`M ${cx - lipW - 6} ${mouthY + 3} q -2 3 0 6`} {...stroke("cheeks")} />
          <path d={`M ${cx + lipW + 6} ${mouthY + 3} q 2 3 0 6`} {...stroke("cheeks")} />
        </>
      ) : null}
      <path d={upper} {...stroke("mouth")} />
      <path d={lower} {...stroke("mouth")} />
      {n(knobs, "cupidBow") > 0.25 ? (
        <path
          d={philtrum}
          {...stroke("mouth", 1.1)}
          opacity={n(knobs, "cupidBow") > 0.7 ? 1 : 0.25}
        />
      ) : null}
      <path
        d={`M ${cx - half * gonion} ${mouthY + 10} Q ${cx - half * 0.35} ${chinY - 16} ${cx - 5} ${chinY}`}
        {...stroke("jaw", 1.35)}
      />
      <path
        d={`M ${cx + half * gonion} ${mouthY + 10} Q ${cx + half * 0.35} ${chinY - 16} ${cx + 5} ${chinY}`}
        {...stroke("jaw", 1.35)}
      />
      <path
        d={`M ${cx - 11 - chinPt} ${chinY - 3} Q ${cx} ${chinY + 4} ${cx + 11 + chinPt} ${chinY - 3}`}
        {...stroke("chin")}
      />
      {n(knobs, "chinCleft") > 0.4 ? (
        <path d={`M ${cx} ${chinY - 12} L ${cx} ${chinY + 2}`} {...stroke("chin")} />
      ) : null}
      <path d={earRim} {...stroke("ears")} />
      <path d={lobe} {...stroke("ears", 1.2)} />
      {focus === "ears" && n(knobs, "earSize") >= 1.08 ? (
        <path d={darwin} {...stroke("ears")} />
      ) : null}
      <line x1="100" y1="22" x2="100" y2="214" stroke={faint} strokeWidth="0.7" />
    </svg>
  );
}

function seedFromId(id: string): number {
  let hash = 2166136261;
  for (let index = 0; index < id.length; index += 1) {
    hash = Math.imul(hash ^ id.charCodeAt(index), 16777619);
  }
  return hash >>> 0;
}

export function FaceGlyph({ feature, seed = 0 }: { feature: Feature; seed?: number }) {
  const [left, right] = makeExemplarLine(feature, seedFromId(feature.id) + seed);
  return (
    <div className="grid grid-cols-2 overflow-hidden bg-raised">
      <div className="relative border-r border-border">
        <FaceView knobs={left.knobs} yaw={-0.38} focus={feature.region} />
        <span className="pointer-events-none absolute bottom-2 left-3 font-mono text-xs tracking-wide text-fg/65 uppercase">
          looks left
        </span>
      </div>
      <div className="relative">
        <FaceView knobs={right.knobs} yaw={0.38} focus={feature.region} />
        <span className="pointer-events-none absolute right-3 bottom-2 font-mono text-xs tracking-wide text-fg/65 uppercase">
          looks right
        </span>
      </div>
    </div>
  );
}
