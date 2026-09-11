import { Button } from "@/components/ui/button";
import { REGIONS, featuresIn } from "@/data/catalog";
import { MONK_TONES } from "@/lib/mst";
import { useTrainer } from "@/lib/store";
import { Plate } from "./plate";
import { ToneFace } from "./tone-face";

export function Atlas() {
  const regionFilter = useTrainer((state) => state.regionFilter);
  const setRegionFilter = useTrainer((state) => state.setRegionFilter);
  const region = regionFilter === "due" ? "outline" : regionFilter;
  const list = featuresIn(region);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <div>
          <h2 className="font-display text-2xl italic sm:text-3xl">Structural atlas</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Sixty-two isolated terms across eleven facial surfaces. Each plate keeps the named
            feature stable while other proportions vary.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Atlas region">
          {REGIONS.map((candidate) => (
            <Button
              key={candidate.id}
              variant="ghost"
              aria-pressed={region === candidate.id}
              onClick={() => setRegionFilter(candidate.id)}
              className={
                region === candidate.id
                  ? "min-h-11 border-primary bg-raised px-3 text-fg"
                  : "min-h-11 bg-bg px-3 text-muted"
              }
            >
              {candidate.label}
            </Button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {list.map((feature) => (
            <article key={feature.id} className="min-w-0">
              <Plate feature={feature} blurOthers showLabel />
              <p className="mt-2 text-sm leading-relaxed text-muted">{feature.gloss}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="rounded-lg border border-border bg-surface p-4 sm:p-6"
        aria-labelledby="tone-reference-title"
      >
        <p className="font-mono text-xs tracking-wide text-subtle uppercase">
          Appearance reference
        </p>
        <h2 id="tone-reference-title" className="mt-1 font-display text-2xl italic sm:text-3xl">
          Monk Skin Tone Scale
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Use the closest of ten published colour swatches when lighting permits. A person’s skin is
          not a single RGB value, and this scale does not encode race or sun-response type.
        </p>
        <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {MONK_TONES.map((tone) => (
            <li key={tone.id} className="rounded-md border border-border bg-bg p-3 text-center">
              <ToneFace hex={tone.hex} size={64} label={`${tone.code} swatch`} />
              <p className="mt-2 font-mono text-xs text-fg">{tone.code}</p>
              <p className="mt-1 font-mono text-xs text-subtle uppercase">{tone.hex}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Source: Monk, Ellis. “Monk Skin Tone Scale,” 2019.{" "}
          <a
            href="https://skintone.google"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline decoration-border underline-offset-4 hover:decoration-accent"
          >
            skintone.google
          </a>
          . Licensed CC BY 4.0.
        </p>
      </section>
    </div>
  );
}
