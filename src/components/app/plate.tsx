// === CONTRACTS ===
// id: plate_caption_only_when_label
//   given: a feature and showLabel
//   then: the plate renders a FaceGlyph and a caption only when showLabel is true
//   class: ux_correctness
//   call: hmmm
//
// id: plate_mask_isolates_region
//   given: blurOthers
//   then: the region mask keeps only the feature region sharp
//   class: ux_correctness
//   call: hmmm
// === END CONTRACTS ===

import type { Feature, RegionId } from "@/data/catalog";
import { FaceGlyph } from "./face-glyph";

type Props = {
  feature: Feature;
  blurOthers?: boolean;
  showLabel: boolean;
  seed?: number;
};

const REGION_MASK: Record<RegionId, string> = {
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

export function Plate({ feature, blurOthers = false, showLabel, seed = 0 }: Props) {
  return (
    <figure
      className="overflow-hidden rounded-md border border-border bg-raised"
      aria-label={showLabel ? undefined : "Two profile drawings sharing one unnamed facial feature"}
    >
      <div className="relative">
        <div className={blurOthers ? "feature-soft" : undefined}>
          <FaceGlyph feature={feature} seed={seed} />
        </div>
        {blurOthers ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              WebkitMaskImage: REGION_MASK[feature.region],
              maskImage: REGION_MASK[feature.region],
            }}
          >
            <FaceGlyph feature={feature} seed={seed} />
          </div>
        ) : null}
      </div>
      {showLabel ? (
        <figcaption className="border-t border-border px-3 py-2 text-sm text-fg">
          {feature.name}
        </figcaption>
      ) : null}
    </figure>
  );
}
