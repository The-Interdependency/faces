import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { FIELD_CARD, featureById, namedCount, namedLine } from "@/data/catalog";
import { useTrainer } from "@/lib/store";
import { cn } from "@/lib/utils";

export function FieldCard() {
  const picks = useTrainer((s) => s.fieldPicks);
  const pickField = useTrainer((s) => s.pickField);
  const clearCard = useTrainer((s) => s.clearCard);
  const setTab = useTrainer((s) => s.setTab);
  const setRegionFilter = useTrainer((s) => s.setRegionFilter);
  const [copied, setCopied] = useState(false);
  const line = namedLine(picks);
  const count = namedCount(picks);

  async function copy() {
    try {
      await navigator.clipboard.writeText(line);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* embed may block clipboard */
    }
  }

  function openTerm(featureId: string) {
    const f = featureById(featureId);
    if (!f) return;
    setRegionFilter(f.region);
    setTab("atlas");
  }

  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl italic sm:text-3xl">Field card</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Look at one adult. Tap one word per line. Skip anything you cannot see.
            Ninety seconds is enough. Hesitate? Open the atlas on that word.
          </p>
        </div>
        <p className="font-mono text-[11px] tracking-wide text-subtle uppercase">
          {count} / {FIELD_CARD.length} named
        </p>
      </div>

      <ol className="mt-6 space-y-4">
        {FIELD_CARD.map((row, i) => {
          const value = picks[row.id] ?? "";
          return (
            <li key={row.id} className="border-t border-border pt-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-fg">
                  <span className="mr-2 font-mono text-[11px] text-subtle">{i + 1}</span>
                  {row.label}
                </p>
                <p className="text-xs text-subtle">{row.prompt}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {row.choices.map((choice) => {
                  const on = value === choice.id;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => pickField(row.id, on ? "" : choice.id)}
                      className={cn(
                        "inline-flex min-h-10 items-center gap-2 rounded-sm border px-3 text-sm",
                        on
                          ? "border-primary bg-raised text-fg"
                          : "border-border bg-bg text-muted hover:text-fg",
                      )}
                    >
                      {choice.hex ? (
                        <span
                          className="size-3.5 shrink-0 rounded-sm border border-border"
                          style={{ background: choice.hex }}
                          aria-hidden
                        />
                      ) : null}
                      {choice.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => pickField(row.id, value === "skip" ? "" : "skip")}
                  className={cn(
                    "min-h-10 rounded-sm border px-3 text-sm",
                    value === "skip"
                      ? "border-warn text-warn"
                      : "border-border bg-bg text-subtle hover:text-muted",
                  )}
                >
                  can’t see
                </button>
                {value && value !== "skip" ? (
                  <button
                    type="button"
                    onClick={() => openTerm(value)}
                    className="min-h-10 px-2 text-sm text-accent underline-offset-4 hover:underline"
                  >
                    atlas
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p className="max-w-xl text-sm text-muted">{line || "Nothing named yet."}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            disabled={!line}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border bg-raised px-3 text-sm text-fg disabled:opacity-40"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            Copy line
          </button>
          <button
            type="button"
            onClick={clearCard}
            className="min-h-11 rounded-sm border border-border bg-transparent px-3 text-sm text-muted hover:text-fg"
          >
            Clear card
          </button>
        </div>
      </div>
    </section>
  );
}
