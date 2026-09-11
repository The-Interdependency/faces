// === CONTRACTS ===
// id: recall_stats_track_store
//   given: deck and trials from the store
//   then: terms, due and trial counts are rendered from live state
//   class: correctness
//   call: hmmm
//
// id: recall_rows_bucket_by_encode_window
//   given: trial rows
//   then: the table shows one row per encode window with recall and latency
//   class: correctness
//   call: hmmm
// === END CONTRACTS ===

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FEATURES, featureById } from "@/data/catalog";
import { dueCount, recallRows } from "@/lib/leitner";
import { useTrainer } from "@/lib/store";

export function Recall() {
  const deck = useTrainer((s) => s.deck);
  const trials = useTrainer((s) => s.trials);
  const resetDeck = useTrainer((s) => s.resetDeck);
  const due = dueCount(deck);
  const rows = recallRows(trials);
  const reviewed = Object.values(deck)
    .filter((c) => c.reviews > 0)
    .sort((a, b) => b.reviews - a.reviews);

  function confirmReset() {
    if (window.confirm("Reset all drill progress and trial history?")) resetDeck();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl italic sm:text-3xl">Time / recall</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              Descriptive session metrics for seeing time, answer latency, and recall. Small samples
              are volatile; these figures are not a validated assessment.
            </p>
          </div>
          <Button variant="quiet" onClick={confirmReset}>
            <RotateCcw className="size-4" />
            Reset deck
          </Button>
        </div>
        <dl className="mt-5 grid grid-cols-3 gap-3 font-mono text-xs tracking-wide text-subtle uppercase">
          <Stat k="terms" v={String(FEATURES.length)} />
          <Stat k="due" v={String(due)} />
          <Stat k="trials" v={String(trials.length)} />
        </dl>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="font-mono text-xs tracking-wide text-subtle uppercase">
              <tr>
                <th className="py-2">Window</th>
                <th>n</th>
                <th>recall</th>
                <th>mean look</th>
                <th>mean answer</th>
                <th>hits / look s</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-t border-border">
                  <td className="py-2 text-fg">{r.key}</td>
                  <td className="text-muted">{r.n}</td>
                  <td className="text-muted">{r.n ? `${Math.round(r.recall * 100)}%` : "—"}</td>
                  <td className="text-muted tabular-nums">
                    {r.n ? `${r.encodeSeconds.toFixed(1)}s` : "—"}
                  </td>
                  <td className="text-muted tabular-nums">
                    {r.n ? `${r.probeSeconds.toFixed(1)}s` : "—"}
                  </td>
                  <td className="text-muted tabular-nums">
                    {r.n ? r.hitsPerStudySecond.toFixed(2) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <h3 className="font-display text-xl italic">Reviewed</h3>
        {reviewed.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No cards reviewed yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {reviewed.slice(0, 24).map((c) => {
              const f = featureById(c.featureId);
              return (
                <li
                  key={c.featureId}
                  className="flex justify-between gap-3 border-b border-border pb-2 text-sm"
                >
                  <span className="text-fg">{f?.name ?? c.featureId}</span>
                  <span className="font-mono text-xs text-subtle tabular-nums">
                    {c.correct}/{c.reviews}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <aside className="rounded-lg border border-border bg-surface p-5 text-sm leading-relaxed text-muted">
        <h2 className="font-display text-2xl text-fg italic">How the line is built</h2>
        <ul className="mt-3 space-y-2">
          <li>
            <span className="text-fg">Isolation.</span> One trait is held constant; other knobs vary
            and are slightly blurred so the name attaches to the right contour.
          </li>
          <li>
            <span className="text-fg">Viewpoint.</span> Left and right three-quarter profiles stop
            the name from locking to a single silhouette.
          </li>
          <li>
            <span className="text-fg">Retrieval.</span> The label is printed once, then removed. A
            four-choice probe is harder than rereading, and that difficulty is the point.
          </li>
          <li>
            <span className="text-fg">Spacing.</span> Correct answers move out in time; misses
            return now. Cramming the same card is cheaper in the minute and worse tomorrow.
          </li>
          <li>
            <span className="text-fg">Appearance.</span> Optional complexion notes use the nearest
            Monk Skin Tone swatch. Tone remains separate from the eleven anatomical surfaces and
            from drill progress.
          </li>
        </ul>
      </aside>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="min-w-16 rounded-md border border-border bg-raised px-3 py-2">
      <dt>{k}</dt>
      <dd className="mt-1 font-sans text-lg font-medium tracking-normal text-fg normal-case">
        {v}
      </dd>
    </div>
  );
}
