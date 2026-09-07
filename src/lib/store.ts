import { create } from "zustand";
import { persist } from "zustand/middleware";
import { emptyPicks } from "@/data/catalog";
import { freshDeck, reviewCard, type Card, type Trial } from "@/lib/leitner";

type Tab = "drill" | "field" | "atlas" | "recall";

type State = {
  tab: Tab;
  setTab: (tab: Tab) => void;
  regionFilter: string;
  setRegionFilter: (id: string) => void;
  encodeMs: number;
  setEncodeMs: (ms: number) => void;
  fieldPicks: Record<string, string>;
  pickField: (rowId: string, choiceId: string) => void;
  clearCard: () => void;
  deck: Record<string, Card>;
  trials: Trial[];
  mark: (featureId: string, pass: boolean, encodeMs: number, probeMs: number) => void;
  resetDeck: () => void;
};

export const useTrainer = create<State>()(
  persist(
    (set, get) => ({
      tab: "field",
      setTab: (tab) => set({ tab }),
      regionFilter: "due",
      setRegionFilter: (regionFilter) => set({ regionFilter }),
      encodeMs: 6000,
      setEncodeMs: (encodeMs) => set({ encodeMs }),
      fieldPicks: emptyPicks(),
      pickField: (rowId, choiceId) =>
        set({ fieldPicks: { ...get().fieldPicks, [rowId]: choiceId } }),
      clearCard: () => set({ fieldPicks: emptyPicks() }),
      deck: freshDeck(),
      trials: [],
      mark: (featureId, pass, encodeMs, probeMs) => {
        const deck = get().deck;
        const card = deck[featureId];
        if (!card) return;
        set({
          deck: { ...deck, [featureId]: reviewCard(card, pass) },
          trials: [
            ...get().trials,
            { featureId, correct: pass, encodeMs, probeMs, at: Date.now() },
          ],
        });
      },
      resetDeck: () => set({ deck: freshDeck(), trials: [] }),
    }),
    {
      name: "lineament-trainer",
      skipHydration: true,
      merge: (persisted, current) => {
        const p = (persisted as Partial<State>) ?? {};
        return {
          ...current,
          ...p,
          deck: { ...freshDeck(), ...(p.deck ?? {}) },
          fieldPicks: { ...emptyPicks(), ...(p.fieldPicks ?? {}) },
        };
      },
    },
  ),
);
