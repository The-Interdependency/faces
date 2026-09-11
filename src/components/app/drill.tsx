import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FEATURES, REGIONS, featureById, featuresIn } from "@/data/catalog";
import { nextDue, probeChoices } from "@/lib/leitner";
import { useTrainer, type EncodeMs, type RegionFilter } from "@/lib/store";
import { Plate } from "./plate";

const ENCODE: ReadonlyArray<{ value: EncodeMs; label: string; hint: string }> = [
  { value: 3000, label: "3 s", hint: "brief glance" },
  { value: 6000, label: "6 s", hint: "one clean look" },
  { value: 12000, label: "12 s", hint: "study the line" },
  { value: 0, label: "Self", hint: "you decide" },
];

type Phase = "encode" | "probe" | "feedback";

export function Drill({ ready }: { ready: boolean }) {
  const deck = useTrainer((s) => s.deck);
  const mark = useTrainer((s) => s.mark);
  const regionFilter = useTrainer((s) => s.regionFilter);
  const setRegionFilter = useTrainer((s) => s.setRegionFilter);
  const encodeMs = useTrainer((s) => s.encodeMs);
  const setEncodeMs = useTrainer((s) => s.setEncodeMs);
  const [tick, setTick] = useState(0);
  const [phase, setPhase] = useState<Phase>("encode");
  const [choice, setChoice] = useState("");
  const [lastId, setLastId] = useState<string | undefined>();
  const shownAt = useRef(0);
  const encodeUsed = useRef(0);
  const probeAt = useRef(0);
  const probeUsed = useRef(0);

  const feature = useMemo(() => {
    if (!ready) return FEATURES[0];
    if (regionFilter !== "due") {
      const pool = featuresIn(regionFilter);
      return pool[tick % Math.max(pool.length, 1)] ?? FEATURES[0];
    }
    const card = nextDue(deck, 0, lastId);
    return featureById(card.featureId) ?? FEATURES[0];
  }, [ready, regionFilter, tick, deck, lastId]);

  const options = useMemo(() => probeChoices(feature), [feature]);

  useEffect(() => {
    if (!ready) return;
    shownAt.current = performance.now();
    if (encodeMs > 0) {
      const id = window.setTimeout(() => {
        encodeUsed.current = encodeMs;
        probeAt.current = performance.now();
        setPhase("probe");
      }, encodeMs);
      return () => window.clearTimeout(id);
    }
  }, [feature.id, encodeMs, ready]);

  function resetEncoding() {
    setPhase("encode");
    setChoice("");
    encodeUsed.current = 0;
    probeUsed.current = 0;
  }

  function chooseRegion(value: RegionFilter) {
    resetEncoding();
    setRegionFilter(value);
  }

  function chooseEncode(value: EncodeMs) {
    resetEncoding();
    setEncodeMs(value);
  }

  function hideName(at: number) {
    encodeUsed.current = at - shownAt.current;
    probeAt.current = at;
    setPhase("probe");
  }

  function answer(id: string, at: number) {
    if (phase !== "probe") return;
    probeAt.current = probeAt.current || at;
    probeUsed.current = Math.max(0, at - probeAt.current);
    setChoice(id);
    setPhase("feedback");
  }

  function next(pass: boolean) {
    mark(feature.id, pass, encodeUsed.current, probeUsed.current);
    setLastId(feature.id);
    resetEncoding();
    setTick((n) => n + 1);
  }

  const held = choice === feature.id;

  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs text-subtle">
            Region
            <select
              value={regionFilter}
              onChange={(event) => chooseRegion(event.target.value as RegionFilter)}
              className="min-h-11 rounded-sm border border-border bg-raised px-2 text-sm text-fg"
            >
              <option value="due">Due mix (Leitner)</option>
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-1" aria-label="Encode time">
            {ENCODE.map((n) => (
              <button
                key={n.value}
                type="button"
                onClick={() => chooseEncode(n.value)}
                aria-pressed={encodeMs === n.value}
                className={`min-h-11 rounded-sm border px-3 text-sm ${
                  encodeMs === n.value
                    ? "border-primary bg-primary text-primary-fg"
                    : "border-border bg-raised text-muted"
                }`}
                title={n.hint}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Plate feature={feature} blurOthers showLabel={phase !== "probe"} seed={tick * 9973} />
      </div>

      {phase === "encode" ? (
        <div className="mt-5 flex flex-col items-center gap-3">
          {encodeMs === 0 ? (
            <Button onClick={(event) => hideName(event.timeStamp)}>Hide the name</Button>
          ) : (
            <Drain key={encodeMs} ms={encodeMs} />
          )}
          <p className="text-xs text-subtle">
            Look at the sharp region only. The printed name appears once.
          </p>
        </div>
      ) : null}

      {phase !== "encode" ? (
        <div className="mx-auto mt-5 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
          {options.map((opt) => {
            let tone: "ok" | "bad" | "idle" = "idle";
            if (phase === "feedback") {
              if (opt.id === feature.id) tone = "ok";
              else if (opt.id === choice) tone = "bad";
            }
            return (
              <button
                key={opt.id}
                type="button"
                disabled={phase !== "probe"}
                onClick={(event) => answer(opt.id, event.timeStamp)}
                aria-label={opt.name}
                aria-pressed={choice === opt.id}
                className={`min-h-12 rounded-md border px-3 text-left text-sm ${
                  tone === "ok"
                    ? "border-ok bg-ok/15 text-fg"
                    : tone === "bad"
                      ? "border-bad bg-bad/15 text-fg"
                      : "border-border bg-raised text-fg hover:border-primary"
                }`}
              >
                {opt.name}
              </button>
            );
          })}
        </div>
      ) : null}

      {phase === "feedback" ? (
        <div className="mt-5 flex flex-col items-center gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            {held ? "Correct." : `It was ${feature.name.toLowerCase()}.`} {feature.gloss}
          </p>
          <Button onClick={() => next(held)}>Next line</Button>
        </div>
      ) : null}
    </section>
  );
}

function Drain({ ms }: { ms: number }) {
  const [remaining, setRemaining] = useState(ms);

  useEffect(() => {
    const startedAt = performance.now();
    const update = () => setRemaining(Math.max(0, ms - (performance.now() - startedAt)));
    const interval = window.setInterval(update, 100);
    return () => window.clearInterval(interval);
  }, [ms]);

  return (
    <div
      className="h-1 w-48 overflow-hidden rounded-full bg-raised"
      role="progressbar"
      aria-label="Encoding time remaining"
      aria-valuemin={0}
      aria-valuemax={ms}
      aria-valuenow={Math.round(remaining)}
      aria-valuetext={`${Math.ceil(remaining / 1000)} seconds remaining`}
    >
      <div
        className="h-full bg-primary"
        style={{
          width: "100%",
          transformOrigin: "left",
          animation: `faces-drain ${ms}ms linear forwards`,
        }}
      />
    </div>
  );
}
