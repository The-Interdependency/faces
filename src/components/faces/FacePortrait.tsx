import type { FaceSpec, Region } from "@/lib/faces/types";

type Props = {
  spec: FaceSpec;
  highlight: Region;
  blurOthers: boolean;
  size?: number;
};

function regionOf(name: Region, highlight: Region, blurOthers: boolean, uid: string) {
  const on = name === highlight;
  return {
    filter: blurOthers && !on ? `url(#soft-${uid})` : on ? `url(#focus-${uid})` : undefined,
    opacity: blurOthers && !on ? 0.55 : 1,
  };
}

export function FacePortrait({ spec, highlight, blurOthers, size = 168 }: Props) {
  const uid = `${spec.seed}-${spec.viewpoint}`;
  const { knobs: k, viewpoint, skin, hair, iris } = spec;
  const dir = viewpoint === "left" ? -1 : 1;
  const yaw = dir * 22;
  const cx = 80 + dir * 6;
  const lip = shade(skin, -18);
  const shadeC = shade(skin, -28);
  const lightC = shade(skin, 16);
  const browC = shade(hair, 10);

  const jawW = 46 * k.jawWidth;
  const chinY = 168 + (k.chinLength - 1) * 14;
  const chinX = cx + dir * (k.chinPoint * 4 - (1 - k.chinLength) * 8);
  const cheekY = 108 - k.cheekBone * 8;
  const cheekX = cx + dir * (18 + k.cheekFull * 8);
  const hairTop = 28 - k.foreheadHeight * 10 - k.hairlineHeight * 6;
  const peak = k.widowPeak * 14;
  const templeCut = k.recede * 16;

  const eyeY = 92 + k.browSet * -6;
  const eyeSpread = 16 * k.eyeGap;
  const nearX = cx + dir * (eyeSpread + 2);
  const farX = cx - dir * (eyeSpread - 4);
  const nearW = 11 * k.eyeWidth;
  const farW = 8.2 * k.eyeWidth;
  const eyeH = 6.2 * k.eyeHeight;
  const tilt = k.eyeTilt * 18;

  const browY = eyeY - 12 - k.browSet * 8;
  const noseTop = 86;
  const noseBot = noseTop + 34 * k.noseLength;
  const noseX = cx + dir * (6 + k.noseBridge * 6);
  const hook = k.noseHook * 10;
  const tipW = 7 * k.noseWidth + k.noseTip * 3;

  const mouthY = 138 + (k.chinLength - 1) * 2;
  const mouthW = 16 * k.lipWidth;
  const mouthX = cx + dir * 4;
  const full = 3.2 * k.lipFull;
  const bow = k.cupidBow * 3.4;
  const corner = k.mouthCorner * 4;

  const earX = cx - dir * (48 + k.earFlare * 8);
  const earY = 96;
  const earH = 22 * k.earSize;

  const headPath = `
    M ${cx - dir * 8} ${hairTop + 18}
    C ${cx - dir * (38 + templeCut)} ${hairTop + 22}, ${cx - jawW} ${92}, ${cx - jawW + dir * 4} ${128}
    Q ${cx - jawW * 0.72} ${152}, ${chinX - 8 * k.chinPoint} ${chinY}
    Q ${chinX} ${chinY + 6 + k.chinPoint * 2}, ${chinX + 8 * (1 - k.chinPoint * 0.4)} ${chinY - 2}
    Q ${cx + jawW * 0.7} ${148}, ${cx + jawW * 0.92} ${118}
    C ${cx + jawW} ${88}, ${cx + dir * 36} ${52}, ${cx + dir * 10} ${hairTop + 20}
    Z
  `;

  const hairPath = `
    M ${cx - dir * 6} ${hairTop + 8}
    C ${cx - dir * (42 - templeCut)} ${hairTop - 4}, ${cx - dir * 20} ${hairTop - 16}, ${cx} ${hairTop - 6 + (peak ? 0 : 4)}
    Q ${cx} ${hairTop + 10 + peak} ${cx} ${hairTop + 2}
    C ${cx + dir * 18} ${hairTop - 18}, ${cx + dir * 46} ${hairTop + 6}, ${cx + dir * 38} ${72}
    Q ${cx + dir * 30} ${58}, ${cx + dir * 8} ${48}
    C ${cx - dir * 8} ${40}, ${cx - dir * 28} ${58}, ${cx - dir * 6} ${hairTop + 8}
    Z
  `;

  return (
    <svg
      width={size}
      height={Math.round(size * 1.28)}
      viewBox="0 0 160 200"
      aria-hidden="true"
      className="block"
    >
      <defs>
        <filter id={`soft-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.35" />
        </filter>
        <filter id={`focus-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
          <feMorphology operator="dilate" radius="0.15" />
        </filter>
      </defs>
      <g transform={`rotate(${yaw * 0.18} ${cx} 108)`}>
        <ellipse cx={cx} cy={188} rx={28} ry={6} fill="#000" opacity={0.18} />
        <g {...regionOf("ears", highlight, blurOthers, uid)}>
          <path
            d={`M ${earX} ${earY - earH * 0.35}
                Q ${earX - dir * (10 + k.earFlare * 6)} ${earY}
                  ${earX} ${earY + earH * 0.55}
                Q ${earX + dir * 5} ${earY + 4} ${earX} ${earY - earH * 0.35} Z`}
            fill={shadeC}
            stroke={shade(skin, -40)}
            strokeWidth="0.8"
          />
        </g>
        <path d={headPath} fill={skin} stroke={shade(skin, -42)} strokeWidth="1.1" />
        <path
          d={`M ${cx - dir * 18} ${cheekY + 18} Q ${cheekX} ${cheekY} ${cx + dir * 6} ${cheekY + 22}`}
          fill="none"
          stroke={shadeC}
          strokeWidth={1.2 + k.cheekBone}
          filter={regionOf("cheeks", highlight, blurOthers, uid).filter}
          opacity={(0.35 + k.cheekBone * 0.25) * (blurOthers && highlight !== "cheeks" ? 0.55 : 1)}
        />
        <ellipse
          cx={cheekX}
          cy={cheekY + 8}
          rx={10 + k.cheekFull * 6}
          ry={8 + k.cheekFull * 5}
          fill={lightC}
          filter={regionOf("cheeks", highlight, blurOthers, uid).filter}
          opacity={(0.18 + k.cheekFull * 0.2) * (blurOthers && highlight !== "cheeks" ? 0.55 : 1)}
        />
        <g {...regionOf("hairline", highlight, blurOthers, uid)}>
          <path d={hairPath} fill={hair} />
        </g>
        <g {...regionOf("forehead", highlight, blurOthers, uid)}>
          <path
            d={`M ${cx - 16} ${hairTop + 28} Q ${cx} ${hairTop + 20} ${cx + 16} ${hairTop + 28}`}
            fill="none"
            stroke={shadeC}
            strokeWidth="1"
            opacity={0.25}
          />
        </g>
        <g {...regionOf("brows", highlight, blurOthers, uid)}>
          <Brow
            x={nearX}
            y={browY}
            dir={dir}
            w={nearW * 1.35}
            arch={k.browArch}
            thick={k.browThick}
            color={browC}
          />
          <Brow
            x={farX}
            y={browY + 1}
            dir={-dir}
            w={farW * 1.4}
            arch={k.browArch * 0.85}
            thick={k.browThick * 0.85}
            color={browC}
          />
        </g>
        <g {...regionOf("eyes", highlight, blurOthers, uid)}>
          <Eye
            x={nearX}
            y={eyeY}
            w={nearW}
            h={eyeH}
            tilt={tilt * dir}
            round={k.eyeRound}
            hood={k.lidHood}
            iris={iris}
            skin={skin}
          />
          <Eye
            x={farX}
            y={eyeY + 1}
            w={farW}
            h={eyeH * 0.92}
            tilt={tilt * -dir * 0.6}
            round={k.eyeRound}
            hood={k.lidHood}
            iris={iris}
            skin={skin}
          />
        </g>
        <g {...regionOf("nose", highlight, blurOthers, uid)}>
          <path
            d={`M ${cx + dir * 2} ${noseTop}
                Q ${noseX + dir * hook * 0.3} ${noseTop + 16}
                  ${noseX + dir * hook} ${noseBot - 6}
                Q ${noseX + dir * (2 + k.noseTip * 2)} ${noseBot + k.noseTip}
                  ${noseX - dir * tipW * 0.2} ${noseBot}
                Q ${noseX - dir * tipW} ${noseBot - 4}
                  ${noseX - dir * (4 + k.noseWidth * 2)} ${noseBot - 10}`}
            fill="none"
            stroke={shadeC}
            strokeWidth="1.35"
            strokeLinecap="round"
          />
          <ellipse
            cx={noseX + dir * 1}
            cy={noseBot - 2}
            rx={3.2 * k.noseWidth}
            ry={2.2}
            fill={shadeC}
            opacity={0.35}
          />
        </g>
        <g {...regionOf("mouth", highlight, blurOthers, uid)}>
          <path
            d={`M ${mouthX - mouthW} ${mouthY + corner}
                Q ${mouthX - 4} ${mouthY - full - bow} ${mouthX} ${mouthY - full * 0.35}
                Q ${mouthX + 4} ${mouthY - full - bow} ${mouthX + mouthW} ${mouthY + corner}
                Q ${mouthX} ${mouthY + full * 1.15} ${mouthX - mouthW} ${mouthY + corner} Z`}
            fill={lip}
            stroke={shade(lip, -30)}
            strokeWidth="0.8"
          />
          <path
            d={`M ${mouthX - mouthW * 0.86} ${mouthY + corner * 0.4}
                Q ${mouthX} ${mouthY + 0.6} ${mouthX + mouthW * 0.86} ${mouthY + corner * 0.4}`}
            fill="none"
            stroke={shade(lip, -40)}
            strokeWidth="0.7"
          />
        </g>
        <g {...regionOf("jaw", highlight, blurOthers, uid)}>
          <path
            d={`M ${cx - jawW * 0.82} ${130} Q ${cx - jawW * 0.6} ${150} ${chinX - 10} ${chinY - 6}`}
            fill="none"
            stroke={shadeC}
            strokeWidth={1.1 + (1.2 - k.jawAngle)}
            opacity={0.45}
          />
        </g>
        <g {...regionOf("chin", highlight, blurOthers, uid)}>
          {k.chinCleft > 0.4 ? (
            <path
              d={`M ${chinX} ${chinY - 10} L ${chinX} ${chinY + 1}`}
              stroke={shadeC}
              strokeWidth={1.2 * k.chinCleft}
              opacity={0.55}
            />
          ) : null}
          <path
            d={`M ${chinX - 7} ${chinY - 4} Q ${chinX} ${chinY + 3 * k.chinPoint} ${chinX + 7} ${chinY - 4}`}
            fill="none"
            stroke={shadeC}
            strokeWidth="1"
            opacity={0.4}
          />
        </g>
      </g>
    </svg>
  );
}

function Eye({
  x,
  y,
  w,
  h,
  tilt,
  round,
  hood,
  iris,
  skin,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tilt: number;
  round: number;
  hood: number;
  iris: string;
  skin: string;
}) {
  const rr = h * (0.55 + round * 0.45);
  return (
    <g transform={`rotate(${tilt} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx={w} ry={h} fill="#f4eee8" />
      <ellipse cx={x + 0.4} cy={y + 0.3} rx={h * 0.85} ry={h * 0.85} fill={iris} />
      <circle cx={x + 0.2} cy={y + 0.2} r={h * 0.38} fill="#111" />
      <circle cx={x - 1.4} cy={y - 1.2} r={1.1} fill="#fff" opacity={0.8} />
      <path
        d={`M ${x - w} ${y - h * 0.2} Q ${x} ${y - h - hood * 4} ${x + w} ${y - h * 0.15}`}
        fill={skin}
        opacity={0.55 + hood * 0.4}
      />
      <ellipse cx={x} cy={y} rx={w} ry={rr} fill="none" stroke="#2a2420" strokeWidth="0.9" />
    </g>
  );
}

function Brow({
  x,
  y,
  dir,
  w,
  arch,
  thick,
  color,
}: {
  x: number;
  y: number;
  dir: number;
  w: number;
  arch: number;
  thick: number;
  color: string;
}) {
  const peakX = x + dir * w * 0.25;
  return (
    <path
      d={`M ${x - dir * w} ${y + 1} Q ${peakX} ${y - 7 * arch} ${x + dir * w} ${y + 2}`}
      fill="none"
      stroke={color}
      strokeWidth={1.6 + thick * 2.2}
      strokeLinecap="round"
    />
  );
}

function shade(hex: string, delta: number) {
  const n = hex.replace("#", "");
  const r = clamp(parseInt(n.slice(0, 2), 16) + delta);
  const g = clamp(parseInt(n.slice(2, 4), 16) + delta);
  const b = clamp(parseInt(n.slice(4, 6), 16) + delta);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
