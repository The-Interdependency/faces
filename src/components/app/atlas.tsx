import { REGIONS, featuresIn } from "@/data/catalog";
import { useTrainer } from "@/lib/store";
import { Plate } from "./plate";

export function Atlas() {
  const regionFilter = useTrainer((s) => s.regionFilter);
  const setRegionFilter = useTrainer((s) => s.setRegionFilter);
  const region = regionFilter === "due" ? "outline" : regionFilter;
  const list = featuresIn(region as never);

  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl italic sm:text-3xl">Atlas</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Isolated plates by region. Skin uses the Monk Skin Tone Scale — ten
            published steps, not Fitzpatrick types and not race.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Atlas region">
        {REGIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRegionFilter(r.id)}
            className={`min-h-10 rounded-sm border px-3 text-sm ${
              region === r.id
                ? "border-primary bg-raised text-fg"
                : "border-border bg-bg text-muted hover:text-fg"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {list.map((f) => (
          <article key={f.id} className="min-w-0">
            <Plate feature={f} blurOthers showLabel />
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.gloss}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
