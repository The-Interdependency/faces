import { contrastInk } from "@/lib/mst";

type Props = {
  hex: string;
  size?: number;
  label?: string;
};

export function ToneFace({ hex, size = 88, label }: Props) {
  const ink = contrastInk(hex) === "ink" ? "#1a1612" : "#faf7f2";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <circle cx="44" cy="44" r="42" fill={hex} stroke="rgba(26,22,18,0.12)" strokeWidth="1.5" />
      <ellipse cx="44" cy="52" rx="18" ry="22" fill="none" stroke={ink} strokeOpacity="0.18" strokeWidth="1.4" />
      <circle cx="34" cy="42" r="2.2" fill={ink} fillOpacity="0.55" />
      <circle cx="54" cy="42" r="2.2" fill={ink} fillOpacity="0.55" />
      <path
        d="M36 56c3.2 3.4 12.8 3.4 16 0"
        fill="none"
        stroke={ink}
        strokeOpacity="0.4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
