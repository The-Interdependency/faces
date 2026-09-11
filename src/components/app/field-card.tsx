// === CONTRACTS ===
// id: field_card_renders_rows_and_skip
//   given: the published FIELD_CARD rows
//   then: each row renders its choices and a skip toggle
//   class: ux_correctness
//   call: hmmm
//
// id: field_card_keeps_appearance_separate
//   given: the appearance fieldset
//   then: skin tone is recorded apart from the eleven structural surfaces
//   class: ux_correctness
//   call: hmmm
// === END CONTRACTS ===

import { Check, Copy, Eraser } from "lucide-react";
import { useState } from "react";
import { FIELD_CARD, featureById, namedCount, namedLine, type RegionId } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { MONK_TONES, monkToneById } from "@/lib/mst";
import { useTrainer } from "@/lib/store";
import { cn } from "@/lib/utils";

type CopyStatus = "idle" | "copied" | "unavailable";

export function FieldCard() {
  const picks = useTrainer((state) => state.fieldPicks);
  const skinToneId = useTrainer((state) => state.appearance.skinToneId);
  const pickField = useTrainer((state) => state.pickField);
  const setSkinToneId = useTrainer((state) => state.setSkinToneId);
  const clearCard = useTrainer((state) => state.clearCard);
  const setTab = useTrainer((state) => state.setTab);
  const setRegionFilter = useTrainer((state) => state.setRegionFilter);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const selectedTone = monkToneById(skinToneId);
  const line = namedLine(picks, selectedTone?.code);
  const count = namedCount(picks);

  async function copy() {
    try {
      await navigator.clipboard.writeText(line);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("unavailable");
    }
    window.setTimeout(() => setCopyStatus("idle"), 1800);
  }

  function openTerm(featureId: string) {
    const feature = featureById(featureId);
    if (!feature) return;
    setRegionFilter(feature.region);
    setTab("atlas");
  }

  function pick(rowId: RegionId, value: string, selected: boolean) {
    pickField(rowId, selected ? "" : value);
  }

  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl italic sm:text-3xl">Field card</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Look at one adult. Choose one term per structural line and skip anything obscured.
            Appearance is recorded separately, so tone is never treated as facial anatomy.
          </p>
        </div>
        <p className="font-mono text-xs tracking-wide text-subtle uppercase">
          <span className="tabular-nums">
            {count} / {FIELD_CARD.length}
          </span>{" "}
          surfaces named
        </p>
      </div>

      <fieldset className="mt-6 rounded-md border border-border bg-bg p-3 sm:p-4">
        <legend className="px-1 text-sm font-medium text-fg">Appearance · optional</legend>
        <p className="max-w-2xl text-xs leading-relaxed text-muted">
          Choose the closest Monk Skin Tone swatch only when the skin is visible under usable light.
          This is a colour reference, not race or skin response.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {MONK_TONES.map((tone) => {
            const selected = skinToneId === tone.id;
            return (
              <Button
                key={tone.id}
                variant="ghost"
                aria-pressed={selected}
                aria-label={`${tone.code}${selected ? ", selected" : ""}`}
                onClick={() => setSkinToneId(selected ? null : tone.id)}
                className={cn(
                  "justify-start px-2 font-mono text-xs",
                  selected ? "border-primary bg-raised text-fg" : "bg-surface text-muted",
                )}
              >
                <span
                  aria-hidden="true"
                  className="size-5 shrink-0 rounded-full border border-border"
                  style={{ backgroundColor: tone.hex }}
                />
                {tone.code}
              </Button>
            );
          })}
        </div>
      </fieldset>

      <ol className="mt-6 space-y-4">
        {FIELD_CARD.map((row, index) => {
          const value = picks[row.id] ?? "";
          return (
            <li key={row.id} className="border-t border-border pt-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-fg">
                  <span className="mr-2 font-mono text-xs text-subtle">{index + 1}</span>
                  {row.label}
                </p>
                <p className="text-xs text-subtle">{row.prompt}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {row.choices.map((choice) => {
                  const selected = value === choice.id;
                  return (
                    <Button
                      key={choice.id}
                      variant="ghost"
                      aria-pressed={selected}
                      onClick={() => pick(row.id, choice.id, selected)}
                      className={cn(
                        "min-h-11 px-3 font-normal tracking-normal",
                        selected
                          ? "border-primary bg-raised text-fg"
                          : "border-border bg-bg text-muted",
                      )}
                    >
                      {choice.label}
                    </Button>
                  );
                })}
                <Button
                  variant="ghost"
                  aria-pressed={value === "skip"}
                  onClick={() => pick(row.id, "skip", value === "skip")}
                  className={cn(
                    "min-h-11 px-3 font-normal tracking-normal",
                    value === "skip" ? "border-warn text-warn" : "bg-bg text-subtle",
                  )}
                >
                  can’t see
                </Button>
                {value && value !== "skip" ? (
                  <Button
                    variant="quiet"
                    onClick={() => openTerm(value)}
                    className="min-h-11 px-2 font-normal tracking-normal text-accent"
                  >
                    open atlas
                  </Button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p className="max-w-xl text-sm text-muted">{line || "Nothing named yet."}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={copy} disabled={!line}>
            {copyStatus === "copied" ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copyStatus === "copied" ? "Copied" : "Copy line"}
          </Button>
          <Button variant="quiet" onClick={clearCard}>
            <Eraser className="size-4" />
            Clear card
          </Button>
        </div>
        <p className="sr-only" aria-live="polite">
          {copyStatus === "copied"
            ? "Description copied to clipboard."
            : copyStatus === "unavailable"
              ? "Clipboard access is unavailable."
              : ""}
        </p>
      </div>
    </section>
  );
}
