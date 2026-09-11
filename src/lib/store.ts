import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import {
  FEATURES,
  REGION_IDS,
  emptyPicks,
  featureById,
  type FieldPicks,
  type RegionId,
} from "@/data/catalog";
import { freshDeck, reviewCard, type Card, type Trial } from "@/lib/leitner";
import { monkToneIdFromLegacyFeature } from "@/lib/mst";

export const STORAGE_KEY = "faces-trainer";
export const LEGACY_STORAGE_KEY = "lineament-trainer";
export const STORAGE_VERSION = 2;

export type Tab = "drill" | "field" | "atlas" | "recall";
export type RegionFilter = "due" | RegionId;
export type EncodeMs = 0 | 3000 | 6000 | 12000;

export type Appearance = {
  skinToneId: number | null;
};

type State = {
  tab: Tab;
  setTab: (tab: Tab) => void;
  regionFilter: RegionFilter;
  setRegionFilter: (id: RegionFilter) => void;
  encodeMs: EncodeMs;
  setEncodeMs: (ms: EncodeMs) => void;
  fieldPicks: FieldPicks;
  appearance: Appearance;
  pickField: (rowId: RegionId, choiceId: string) => void;
  setSkinToneId: (toneId: number | null) => void;
  clearCard: () => void;
  deck: Record<string, Card>;
  trials: Trial[];
  mark: (featureId: string, pass: boolean, encodeMs: number, probeMs: number) => void;
  resetDeck: () => void;
};

type PersistedTrainerState = Pick<
  State,
  "tab" | "regionFilter" | "encodeMs" | "fieldPicks" | "appearance" | "deck" | "trials"
>;

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function finite(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function validToneId(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 10
    ? value
    : null;
}

function normalizeCard(featureId: string, value: unknown, fallback: Card): Card {
  const source = record(value);
  if (!source) return fallback;
  const reviews = Math.max(0, Math.trunc(finite(source.reviews, fallback.reviews)));
  const correct = Math.min(
    reviews,
    Math.max(0, Math.trunc(finite(source.correct, fallback.correct))),
  );
  const lastResult =
    source.lastResult === "pass" || source.lastResult === "fail" ? source.lastResult : null;
  return {
    featureId,
    box: Math.min(5, Math.max(1, Math.trunc(finite(source.box, fallback.box)))),
    reviews,
    correct,
    streak: Math.max(0, Math.trunc(finite(source.streak, fallback.streak))),
    lastResult,
    lastSeenAt: Math.max(0, finite(source.lastSeenAt, fallback.lastSeenAt)),
    dueAt: Math.max(0, finite(source.dueAt, fallback.dueAt)),
  };
}

function normalizeDeck(value: unknown): Record<string, Card> {
  const source = record(value) ?? {};
  const fallback = freshDeck();
  return Object.fromEntries(
    FEATURES.map((feature) => [
      feature.id,
      normalizeCard(feature.id, source[feature.id], fallback[feature.id]),
    ]),
  );
}

function normalizeFieldPicks(value: unknown): FieldPicks {
  const source = record(value) ?? {};
  const picks = emptyPicks();
  for (const region of REGION_IDS) {
    const candidate = source[region];
    if (candidate === "skip" || candidate === "") {
      picks[region] = candidate;
      continue;
    }
    if (typeof candidate === "string" && featureById(candidate)?.region === region) {
      picks[region] = candidate;
    }
  }
  return picks;
}

function normalizeTrials(value: unknown): Trial[] {
  if (!Array.isArray(value)) return [];
  return value
    .flatMap((item): Trial[] => {
      const source = record(item);
      if (!source || typeof source.featureId !== "string" || !featureById(source.featureId)) {
        return [];
      }
      return [
        {
          featureId: source.featureId,
          correct: source.correct === true,
          encodeMs: Math.max(0, finite(source.encodeMs, 0)),
          probeMs: Math.max(0, finite(source.probeMs, finite(source.latencyMs, 0))),
          at: Math.max(0, finite(source.at, Date.now())),
        },
      ];
    })
    .slice(-400);
}

/** Pure migration used both by Zustand and contract tests. */
export function migratePersistedState(value: unknown): PersistedTrainerState {
  const source = record(value) ?? {};
  const legacyPicks = record(source.fieldPicks) ?? {};
  const appearanceSource = record(source.appearance);
  const skinToneId =
    validToneId(appearanceSource?.skinToneId) ?? monkToneIdFromLegacyFeature(legacyPicks.skin);
  const tab: Tab =
    source.tab === "drill" ||
    source.tab === "atlas" ||
    source.tab === "recall" ||
    source.tab === "field"
      ? source.tab
      : "field";
  const regionFilter: RegionFilter =
    source.regionFilter === "due" ||
    (typeof source.regionFilter === "string" && REGION_IDS.has(source.regionFilter as RegionId))
      ? (source.regionFilter as RegionFilter)
      : "due";
  const encodeMs: EncodeMs = [0, 3000, 6000, 12000].includes(Number(source.encodeMs))
    ? (Number(source.encodeMs) as EncodeMs)
    : 6000;
  return {
    tab,
    regionFilter,
    encodeMs,
    fieldPicks: normalizeFieldPicks(source.fieldPicks),
    appearance: { skinToneId },
    deck: normalizeDeck(source.deck ?? source.cards),
    trials: normalizeTrials(source.trials),
  };
}

const browserStorage: StateStorage = {
  getItem(name) {
    if (typeof globalThis.localStorage === "undefined") return null;
    return (
      globalThis.localStorage.getItem(name) ??
      (name === STORAGE_KEY ? globalThis.localStorage.getItem(LEGACY_STORAGE_KEY) : null)
    );
  },
  setItem(name, value) {
    globalThis.localStorage.setItem(name, value);
    if (name === STORAGE_KEY) globalThis.localStorage.removeItem(LEGACY_STORAGE_KEY);
  },
  removeItem(name) {
    globalThis.localStorage.removeItem(name);
  },
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
      appearance: { skinToneId: null },
      pickField: (rowId, choiceId) => {
        if (choiceId !== "" && choiceId !== "skip" && featureById(choiceId)?.region !== rowId)
          return;
        set({ fieldPicks: { ...get().fieldPicks, [rowId]: choiceId } });
      },
      setSkinToneId: (skinToneId) => set({ appearance: { skinToneId: validToneId(skinToneId) } }),
      clearCard: () => set({ fieldPicks: emptyPicks(), appearance: { skinToneId: null } }),
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
          ].slice(-400),
        });
      },
      resetDeck: () => set({ deck: freshDeck(), trials: [] }),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      skipHydration: true,
      storage: createJSONStorage(() => browserStorage),
      migrate: (persisted) => migratePersistedState(persisted),
      merge: (persisted, current) => ({
        ...current,
        ...migratePersistedState(persisted),
      }),
      partialize: (state): PersistedTrainerState => ({
        tab: state.tab,
        regionFilter: state.regionFilter,
        encodeMs: state.encodeMs,
        fieldPicks: state.fieldPicks,
        appearance: state.appearance,
        deck: state.deck,
        trials: state.trials,
      }),
    },
  ),
);
