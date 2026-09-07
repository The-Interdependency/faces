import { useEffect, useMemo, useRef, useState } from "react";
import { distractors } from "@/lib/faces/generator";
import type { EncodeMs, Feature } from "@/lib/faces/types";
import { Button } from "@/components/ui/button";
import { FaceLine } from "./FaceLine";

type Props = {
  feature: Feature;
  encodeMs: EncodeMs;
  onDone: (correct: boolean, encodeSpentMs: number, latencyMs: number) => void;
};

type Phase = "encode" | "probe" | "feedback";

export function DrillStage({ feature, encodeMs, onDone }: Props) {
  const seed = useMemo(() => hashSeed(feature.id), [feature.id]);
  const choices = useMemo(() => {
    const mix = [feature, ...distractors(feature, seed, 3)];
    return mix
      .map((item, i) => ({ item, o: (seed + i * 17) % 97 }))
      .sort((a, b) => a.o - b.o)
      .map((row) => row.item);
  }, [feature, seed]);

  const [phase, setPhase] = useState<Phase>("encode");
  const [picked, setPicked] = useState<string | null>(null);
  const started = useRef(Date.now());
  const encodedFor = useRef(0);
  const probeAt = useRef(0);

  useEffect(() => {
    started.current = Date.now();
    if (encodeMs <= 0) return;
    const t = window.setTimeout(() => {
      encodedFor.current = encodeMs;
      probeAt.current = Date.now();
      setPhase("probe");
    }, encodeMs);
    return () => window.clearTimeout(t);
  }, [encodeMs, feature.id]);

  const reveal = () => {
    encodedFor.current = Date.now() - started.current;
    probeAt.current = Date.now();
    setPhase("probe");
  };

  const answer = (id: string) => {
    if (phase !== "probe") return;
    setPicked(id);
    setPhase("feedback");
  };

  const correct = picked === feature.id;
  const remain =
    encodeMs > 0 && phase === "encode"
      ? Math.max(0, encodeMs - (typeof window === "undefined" ? 0 : 0))
      : 0;

  return (
    <div className="mt-5">
      <FaceLine
        feature={feature}
        blurOthers
        label={feature.name}
        showLabel={phase !== "probe"}
      />

      {phase === "encode" ? (
        <div className="mt-5 flex flex-col items-center gap-3">
          {encodeMs === 0 ? (
            <Button onClick={reveal}>Hide the name</Button>
          ) : (
            <EncodeBar ms={encodeMs} />
          )}
          <p className="text-xs text-subtle">
            Look at the sharp region only. The printed name appears once.
          </p>
          {remain ? null : null}
        </div>
      ) : null}

      {phase !== "encode" ? (
        <div className="mx-auto mt-5 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
          {choices.map((choice) => {
            const state =
              phase === "feedback"
                ? choice.id === feature.id
                  ? "ok"
                  : choice.id === picked
                    ? "bad"
                    : "idle"
                : "idle";
            return (
              <button
                key={choice.id}
                type="button"
                disabled={phase !== "probe"}
                onClick={() => answer(choice.id)}
                className={`min-h-12 rounded-md border px-3 text-left text-sm ${
                  state === "ok"
                    ? "border-ok bg-ok/15 text-fg"
                    : state === "bad"
                      ? "border-bad bg-bad/15 text-fg"
                      : "border-border bg-raised text-fg hover:border-primary"
                }`}
              >
                {choice.name}
              </button>
            );
          })}
        </div>
      ) : null}

      {phase === "feedback" ? (
        <div className="mt-5 flex flex-col items-center gap-3">
          <p className="text-sm text-muted">
            {correct ? "Held." : `It was ${feature.name.toLowerCase()}.`} {feature.gloss}
          </p>
          <Button
            onClick={() =>
              onDone(correct, encodedFor.current, Date.now() - probeAt.current)
            }
          >
            Next line
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function EncodeBar({ ms }: { ms: number }) {
  return (
    <div
      className="h-1 w-48 overflow-hidden rounded-full bg-raised"
      role="progressbar"
      aria-label="Encoding time"
    >
      <div
        className="h-full bg-primary"
        style={{
          width: "100%",
          transformOrigin: "left",
          animation: `lineament-drain ${ms}ms linear forwards`,
        }}
      />
      <style>{`@keyframes lineament-drain { from { transform: scaleX(1) } to { transform: scaleX(0) } }`}</style>
    </div>
  );
}
