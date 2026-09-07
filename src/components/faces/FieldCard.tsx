import { ClipboardCopy, RotateCcw } from "lucide-react";
import { FEATURES } from "@/lib/faces/catalog";
import {
  FIELD_SLOTS,
  composeDescription,
  filledCount,
  type FieldPicks,
} from "@/lib/faces/field-card";
import type { Feature } from "@/lib/faces/types";
import { Button } from "@/components/ui/button";

type Props = {
  picks: FieldPicks;
  onPick: (slotId: string, value: string | "skip") => void;
  onClear: () => void;
  onOpenTerm: (feature: Feature) => void;
};

export function FieldCard({ picks, onPick, onClear, onOpenTerm }: Props) {
  const line = composeDescription(picks);
  const n = filledCount(picks);

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
          {n} / {FIELD_SLOTS.length} named
        </p>
      </div>

      <ol className="mt-6 space-y-4">
        {FIELD_SLOTS.map((slot, i) => {
          const current = picks[slot.id] ?? "";
          return (
            <li key={slot.id} className="border-t border-border pt-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-fg">
                  <span className="mr-2 font-mono text-[11px] text-subtle">{i + 1}</span>
                  {slot.label}
                </p>
                <p className="text-xs text-subtle">{slot.prompt}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {slot.choices.map((choice) => {
                  const on = current === choice.id;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => onPick(slot.id, on ? "" : choice.id)}
                      className={`min-h-10 rounded-sm border px-3 text-sm ${
                        on
                          ? "border-primary bg-raised text-fg"
                          : "border-border bg-bg text-muted hover:text-fg"
                      }`}
                    >
                      {choice.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => onPick(slot.id, current === "skip" ? "" : "skip")}
                  className={`min-h-10 rounded-sm border px-3 text-sm ${
                    current === "skip"
                      ? "border-warn text-warn"
                      : "border-border bg-bg text-subtle hover:text-muted"
                  }`}
                >
                  can’t see
                </button>
                {current && current !== "skip"
                  ? (() => {
                      const feat = FEATURES.find((f) => f.id === current);
                      if (!feat) return null;
                      return (
                        <button
                          type="button"
                          onClick={() => onOpenTerm(feat)}
                          className="min-h-10 px-2 text-sm text-accent underline-offset-4 hover:underline"
                        >
                          see plate
                        </button>
                      );
                    })()
                  : null}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 rounded-md border border-border bg-raised p-4">
        <p className="font-mono text-[11px] tracking-wide text-subtle uppercase">Description</p>
        <p className="mt-2 font-display text-xl leading-snug text-fg italic sm:text-2xl">
          {line || "Nothing named yet."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="ghost"
            disabled={!line}
            onClick={() => {
              void navigator.clipboard.writeText(line);
            }}
          >
            <ClipboardCopy className="size-4" />
            Copy line
          </Button>
          <Button variant="quiet" onClick={onClear}>
            <RotateCcw className="size-4" />
            Clear card
          </Button>
        </div>
      </div>
    </section>
  );
}
