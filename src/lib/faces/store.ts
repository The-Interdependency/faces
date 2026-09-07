import { create } from "zustand";
import { persist } from "zustand/middleware";
import { emptyPicks } from "./field-card";
import { emptyDeck, gradeCard, nextDue } from "./leitner";
import type { EncodeMs, LeitnerCard, TrainerState, TrialLog } from "./types";

type Actions = {
  setEncodeMs: (ms: EncodeMs) => void;
  recordTrial: (featureId: string, correct: boolean, encodeMs: number, latencyMs: number) => void;
  resetProgress: () => void;
  peekDue: (avoidId?: string) => LeitnerCard;
  setFieldPick: (slotId: string, value: string) => void;
  clearField: () => void;
};

export const useTrainer = create<TrainerState & Actions>()(
  persist(
    (set, get) => ({
      cards: emptyDeck(),
      trials: [],
      encodeMs: 6000,
      sessionStartedAt: Date.now(),
      fieldPicks: emptyPicks(),
      setEncodeMs: (encodeMs) => set({ encodeMs }),
      recordTrial: (featureId, correct, encodeMs, latencyMs) => {
        const now = Date.now();
        const cards = { ...get().cards };
        const current = cards[featureId] ?? emptyDeck()[featureId]!;
        cards[featureId] = gradeCard(current, correct, now);
        const trial: TrialLog = { at: now, featureId, encodeMs, correct, latencyMs };
        set({ cards, trials: [...get().trials, trial].slice(-400) });
      },
      resetProgress: () =>
        set({
          cards: emptyDeck(),
          trials: [],
          sessionStartedAt: Date.now(),
          fieldPicks: emptyPicks(),
        }),
      peekDue: (avoidId) => nextDue(get().cards, Date.now(), avoidId),
      setFieldPick: (slotId, value) =>
        set({ fieldPicks: { ...get().fieldPicks, [slotId]: value } }),
      clearField: () => set({ fieldPicks: emptyPicks() }),
    }),
    {
      name: "lineament-trainer",
      skipHydration: true,
      merge: (persisted, current) => {
        const prev = (persisted ?? {}) as Partial<TrainerState>;
        return {
          ...current,
          ...prev,
          cards: { ...emptyDeck(), ...(prev.cards ?? {}) },
          fieldPicks: { ...emptyPicks(), ...(prev.fieldPicks ?? {}) },
        };
      },
    },
  ),
);
