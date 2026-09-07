import type { Feature, Region } from "@/lib/faces/types";

type Props = {
  feature: Feature;
  blurOthers: boolean;
  label?: string;
  showLabel?: boolean;
};

const REGION_MASK: Record<Region, string> = {
  outline: "radial-gradient(ellipse 74% 84% at 50% 46%, #000 0%, #000 64%, transparent 88%)",
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

export function FaceLine({ feature, blurOthers, label, showLabel }: Props) {
  const src = `/faces/${feature.id}.jpg`;
  return (
    <div className="relative">
      <figure className="relative overflow-hidden rounded-md border border-border bg-raised">
        <img
          src={src}
          alt=""
          width={1792}
          height={1008}
          className={`block h-auto w-full ${blurOthers ? "blur-[1.6px]" : ""}`}
        />
        {blurOthers ? (
          <img
            src={src}
            alt=""
            width={1792}
            height={1008}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{
              WebkitMaskImage: REGION_MASK[feature.region],
              maskImage: REGION_MASK[feature.region],
            }}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-3 pb-2 font-mono text-[10px] tracking-wide text-fg/80 uppercase sm:text-[11px]">
          <span>looks left</span>
          <span>looks right</span>
        </div>
      </figure>
      {showLabel && label ? (
        <p className="mt-3 text-center font-display text-[1.65rem] leading-tight tracking-tight text-accent italic sm:text-[2rem]">
          {label}
        </p>
      ) : (
        <p className="mt-3 text-center font-display text-[1.65rem] leading-tight tracking-tight text-subtle italic sm:text-[2rem]">
          name the shared feature
        </p>
      )}
    </div>
  );
}
