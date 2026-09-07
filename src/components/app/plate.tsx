import type { Feature } from "@/data/catalog";
import { FaceGlyph } from "./face-glyph";

type Props = {
  feature: Feature;
  blurOthers?: boolean;
  showLabel: boolean;
};

export function Plate({ feature, showLabel }: Props) {
  return (
    <figure className="overflow-hidden rounded-md border border-border bg-raised">
      <FaceGlyph feature={feature} />
      {showLabel ? (
        <figcaption className="border-t border-border px-3 py-2 text-sm text-fg">{feature.name}</figcaption>
      ) : null}
    </figure>
  );
}
