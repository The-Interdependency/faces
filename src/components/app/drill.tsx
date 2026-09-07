import { useEffect, useMemo, useRef, useState } from "react";
import { FEATURES, REGIONS, featureById, featuresIn } from "@/data/catalog";
import { nextDue, probeChoices } from "@/lib/leitner";
import { useTrainer } from "@/lib/store";
import { Plate } from "./plate";

const ENCODE = [
  { value: 3000, label: "3 s", hint: "brief glance" },
  { value: 6000, label: "6 s", hint: "one clean look" },
  { value: 12000, label: "12 s", hint: "study the line" },
  { value: 0, label: "Self", hint: "you decide" },
];

type Phase = "encode" | "probe" | "feedback";

export function Drill() {
  const deck = useTrainer((s) => s.deck);
  const mark = useTrainer((s) => s.mark);
  const regionFilter = useTrainer((s) => s.regionFilter);
  const setRegionFilter = useTrainer((s) => s.setRegionFilter);
  const encodeMs = useTrainer((s) => s.encodeMs);
  const setEncodeMs = useTrainer((s) => s.setEncodeMs);
  const [tick, setTick] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<Phase>("encode");
  const [choice, setChoice] = useState("");
  const lastId = useRef<string | undefined>(undefined);
  const shownAt = useRef(Date.now());
  const encodeUsed = useRef(0);
  const probeAt = useRef(0);

  useEffect(() => {
    useTrainer.persist.rehydrate();
    setHydrated(true);
  }, []);

  const feature = useMemo(() => {
    if (!hydrated) return FEATURES[0];
    if (regionFilter !== "due") {
      const pool = featuresIn(regionFilter as never);
      return pool[tick % Math.max(pool.length, 1)] ?? FEATURES[0];
    }
    const card = nextDue(deck, Date.now(), lastId.current);
    return featureById(card.featureId) ?? FEATURES[0];
  }, [hydrated, regionFilter, tick, deck]);

  const options = useMemo(() => probeChoices(feature), [feature]);

  useEffect(() => {
    setPhase("encode");
    setChoice("");
    shownAt.current = Date.now();
    if (encodeMs > 0) {
      const id = window.setTimeout(() => {
        encodeUsed.current = encodeMs;
        probeAt.current = Date.now();
        setPhase("probe");
      }, encodeMs);
      return () => window.clearTimeout(id);
    }
  }, [feature.id, encodeMs, tick]);

  function hideName() {
    encodeUsed.current = Date.now() - shownAt.current;
    probeAt.current = Date.now();
    setPhase("probe");
  }

  function answer(id: string) {
    if (phase !== "probe") return;
    setChoice(id);
    setPhase("feedback");
  }

  function next(pass: boolean) {
    mark(feature.id, pass, encodeUsed.current, Date.now() - probeAt.current);
    lastId.current = feature.id;
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
              onChange={(e) => setRegionFilter(e.target.value)}
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
                onClick={() => setEncodeMs(n.value)}
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
        <Plate feature={feature} blurOthers showLabel={phase !== "probe"} />
      </div>

      {phase === "encode" ? (
        <div className="mt-5 flex flex-col items-center gap-3">
          {encodeMs === 0 ? (
            <button
              type="button"
              onClick={hideName}
              className="min-h-11 rounded-sm bg-primary px-4 text-sm text-primary-fg hover:bg-accent"
            >
              Hide the name
            </button>
          ) : (
            <Drain ms={encodeMs} />
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
                onClick={() => answer(opt.id)}
                className={`min-h-12 rounded-md border px-3 text-left text-sm ${
                  tone === "ok"
                    ? "border-ok bg-ok/15 text-fg"
                    : tone === "bad"
                      ? "border-bad bg-bad/15 text-fg"
                      : "border-border bg-raised text-fg hover:border-primary"
                }`}
              >
                {opt.hex ? (
                  <span className="mr-2 inline-block size-3 rounded-sm border border-border align-middle" style={{ background: opt.hex }} />
                ) : null}
                {opt.name}
              </button>
            );
          })}
        </div>
      ) : null}

      {phase === "feedback" ? (
        <div className="mt-5 flex flex-col items-center gap-3">
          <p className="text-sm text-muted">
            {held ? "Held." : `It was ${feature.name.toLowerCase()}.`} {feature.gloss}
          </p>
          <button
            type="button"
            onClick={() => next(held)}
            className="min-h-11 rounded-sm bg-primary px-4 text-sm text-primary-fg hover:bg-accent"
          >
            Next line
          </button>
        </div>
      ) : null}
    </section>
  );
}

function Drain({ ms }: { ms: number }) {
  return (
    <div className="h-1 w-48 overflow-hidden rounded-full bg-raised" role="progressbar" aria-label="Encoding time">
      <div
        className="h-full bg-primary"
        style={{
          width: "100%",
          transformOrigin: "left",
          animation: `lineament-drain ${ms}ms linear forwards`,
        }}
      />
    </div>
  );
}
