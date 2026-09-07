import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BookOpen, ChartNoAxesColumn, ClipboardList, RotateCcw, ScanFace } from "lucide-react";
import { FEATURES, REGIONS, featureById, featuresInRegion } from "@/lib/faces/catalog";
import { emptyPicks } from "@/lib/faces/field-card";
import { ENCODE_OPTIONS, ratioByEncode } from "@/lib/faces/leitner";
import { useTrainer } from "@/lib/faces/store";
import type { EncodeMs, Feature, Region } from "@/lib/faces/types";
import { Button } from "@/components/ui/button";
import { FaceLine } from "./FaceLine";
import { DrillStage } from "./DrillStage";
import { FieldCard } from "./FieldCard";

type Tab = "drill" | "field" | "atlas" | "ratio";

export function TrainerApp() {
  const [tab, setTab] = useState<Tab>("field");
  const [atlasFeature, setAtlasFeature] = useState<Feature>(FEATURES[0]!);
  useEffect(() => {
    void useTrainer.persist.rehydrate();
  }, []);
  const trials = useTrainer((s) => s.trials);
  const cards = useTrainer((s) => s.cards);
  const dueCount = Object.values(cards).filter((c) => c.dueAt <= Date.now()).length;
  const hits = trials.filter((t) => t.correct).length;

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] text-subtle uppercase">
            isolate · retrieve · describe
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-tight text-fg italic sm:text-5xl">
            Lineament
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Learn the names on isolated plates, then spend ninety seconds describing
            one live face from the top of the head down.
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-3 font-mono text-[11px] tracking-wide text-subtle uppercase">
          <Stat k="due" v={String(dueCount)} />
          <Stat k="trials" v={String(trials.length)} />
          <Stat k="recall" v={trials.length ? `${Math.round((hits / trials.length) * 100)}%` : "—"} />
        </dl>
      </header>

      <nav className="mt-5 flex flex-wrap gap-2" aria-label="Sections">
        <TabBtn id="drill" tab={tab} setTab={setTab} icon={<ScanFace className="size-4" />}>
          Drill
        </TabBtn>
        <TabBtn id="field" tab={tab} setTab={setTab} icon={<ClipboardList className="size-4" />}>
          Field
        </TabBtn>
        <TabBtn id="atlas" tab={tab} setTab={setTab} icon={<BookOpen className="size-4" />}>
          Atlas
        </TabBtn>
        <TabBtn id="ratio" tab={tab} setTab={setTab} icon={<ChartNoAxesColumn className="size-4" />}>
          Time / recall
        </TabBtn>
      </nav>

      <main className="mt-6 flex-1">
        {tab === "drill" ? <DrillPanel /> : null}
        {tab === "field" ? (
          <FieldPanel
            onOpenTerm={(f) => {
              setAtlasFeature(f);
              setTab("atlas");
            }}
          />
        ) : null}
        {tab === "atlas" ? <AtlasPanel open={atlasFeature} setOpen={setAtlasFeature} /> : null}
        {tab === "ratio" ? <RatioPanel /> : null}
      </main>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="min-w-16 rounded-md border border-border bg-surface px-3 py-2">
      <dt>{k}</dt>
      <dd className="mt-1 font-sans text-lg font-medium tracking-normal text-fg normal-case">{v}</dd>
    </div>
  );
}

function TabBtn({
  id,
  tab,
  setTab,
  icon,
  children,
}: {
  id: Tab;
  tab: Tab;
  setTab: (t: Tab) => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  const on = tab === id;
  return (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={`inline-flex min-h-11 items-center gap-2 rounded-sm border px-3 text-sm ${
        on ? "border-primary bg-raised text-fg" : "border-border bg-surface text-muted"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function DrillPanel() {
  const encodeMs = useTrainer((s) => s.encodeMs);
  const setEncodeMs = useTrainer((s) => s.setEncodeMs);
  const peekDue = useTrainer((s) => s.peekDue);
  const recordTrial = useTrainer((s) => s.recordTrial);
  const resetProgress = useTrainer((s) => s.resetProgress);
  const [regionLock, setRegionLock] = useState<Region | "all">("all");
  const [round, setRound] = useState(0);
  const [lastId, setLastId] = useState<string | undefined>();
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);

  const feature = useMemo(() => {
    if (!live) return FEATURES[0]!;
    if (regionLock === "all") {
      const due = peekDue(lastId);
      return featureById(due.featureId) ?? FEATURES[0]!;
    }
    const pool = featuresInRegion(regionLock);
    const i = round % pool.length;
    return pool[i]!;
    // peekDue is stable enough; round/lastId/regionLock drive refresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, regionLock, lastId]);

  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="region">
            Region
          </label>
          <select
            id="region"
            value={regionLock}
            onChange={(e) => {
              setRegionLock(e.target.value as Region | "all");
              setRound((n) => n + 1);
            }}
            className="min-h-11 rounded-sm border border-border bg-raised px-3 text-sm text-fg"
          >
            <option value="all">Due mix (Leitner)</option>
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label} only
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Encode time">
          {ENCODE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setEncodeMs(opt.value as EncodeMs)}
              className={`min-h-11 rounded-sm px-3 text-sm ${
                encodeMs === opt.value ? "bg-primary text-primary-fg" : "bg-raised text-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm text-muted">
        Surrounding features stay slightly blurred so the shared trait is the only sharp
        signal. Profiles look left, then right.
      </p>
      <DrillStage
        key={`${feature.id}-${round}`}
        feature={feature}
        encodeMs={encodeMs}
        onDone={(correct, spent, latency) => {
          recordTrial(feature.id, correct, spent, latency);
          setLastId(feature.id);
          setRound((n) => n + 1);
        }}
      />
      <div className="mt-6 flex justify-end">
        <Button variant="quiet" onClick={() => resetProgress()}>
          <RotateCcw className="size-4" />
          Reset deck
        </Button>
      </div>
    </section>
  );
}

function FieldPanel({ onOpenTerm }: { onOpenTerm: (f: Feature) => void }) {
  const picks = useTrainer((s) => s.fieldPicks) ?? emptyPicks();
  const setFieldPick = useTrainer((s) => s.setFieldPick);
  const clearField = useTrainer((s) => s.clearField);
  return (
    <FieldCard
      picks={picks}
      onPick={setFieldPick}
      onClear={clearField}
      onOpenTerm={onOpenTerm}
    />
  );
}

function AtlasPanel({
  open,
  setOpen,
}: {
  open: Feature;
  setOpen: (f: Feature) => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-lg border border-border bg-surface p-3">
        <p className="px-2 pb-2 font-mono text-[11px] tracking-wide text-subtle uppercase">
          {FEATURES.length} terms
        </p>
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          {REGIONS.map((region) => (
            <div key={region.id}>
              <p className="px-2 text-xs font-medium text-muted">{region.label}</p>
              <ul className="mt-1">
                {featuresInRegion(region.id).map((f) => (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => setOpen(f)}
                      className={`flex min-h-10 w-full items-center rounded-sm px-2 text-left text-sm ${
                        open.id === f.id ? "bg-raised text-fg" : "text-muted hover:text-fg"
                      }`}
                    >
                      {f.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
      <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <FaceLine
          feature={open}
          blurOthers
          label={open.name}
          showLabel
        />
        <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-muted">
          {open.gloss}
        </p>
      </section>
    </div>
  );
}

function RatioPanel() {
  const trials = useTrainer((s) => s.trials);
  const cards = useTrainer((s) => s.cards);
  const rows = ratioByEncode(trials);
  const weakest = Object.values(cards)
    .filter((c) => c.reviews > 0)
    .sort((a, b) => a.correct / Math.max(1, a.reviews) - b.correct / Math.max(1, b.reviews))
    .slice(0, 6);

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="font-display text-2xl italic">Seeing time vs. recall</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Massed staring feels fluent and fades. Brief encoding plus retrieval usually
          buys more names per minute. Change the encode preset on Drill and watch this
          table fill — the ratio is hits per second of looking.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="font-mono text-[11px] tracking-wide text-subtle uppercase">
              <tr>
                <th className="pb-2">Encode</th>
                <th className="pb-2">Trials</th>
                <th className="pb-2">Recall</th>
                <th className="pb-2">Avg look</th>
                <th className="pb-2">Hits / sec</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-t border-border">
                  <td className="py-3 font-medium">{row.key}</td>
                  <td className="py-3 tabular-nums">{row.n}</td>
                  <td className="py-3 tabular-nums">{row.n ? `${Math.round(row.recall * 100)}%` : "—"}</td>
                  <td className="py-3 tabular-nums">{row.n ? `${row.seconds.toFixed(1)}s` : "—"}</td>
                  <td className="py-3 tabular-nums">{row.n ? row.ratio.toFixed(2) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="font-display text-2xl italic">Weak boxes</h2>
        <p className="mt-2 text-sm text-muted">
          Failed names drop to box 1 and return immediately. That is the Leitner spend:
          time goes to what you cannot yet retrieve.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {weakest.length === 0 ? (
            <li className="text-sm text-subtle">No graded cards yet.</li>
          ) : (
            weakest.map((c) => {
              const f = featureById(c.featureId);
              return (
                <li
                  key={c.featureId}
                  className="flex items-center justify-between rounded-md border border-border bg-raised px-3 py-2 text-sm"
                >
                  <span>{f?.name ?? c.featureId}</span>
                  <span className="font-mono text-[11px] text-subtle">
                    box {c.box} · {c.correct}/{c.reviews}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      </div>
      <MethodNotes />
    </section>
  );
}

function MethodNotes() {
  return (
    <aside className="rounded-lg border border-border bg-surface p-5 text-sm leading-relaxed text-muted">
      <h2 className="font-display text-2xl text-fg italic">How the line is built</h2>
      <ul className="mt-3 space-y-2">
        <li>
          <span className="text-fg">Isolation.</span> One trait is held constant; other
          knobs vary and are slightly blurred so the name attaches to the right contour.
        </li>
        <li>
          <span className="text-fg">Viewpoint.</span> Left and right three-quarter
          profiles stop the name from locking to a single silhouette.
        </li>
        <li>
          <span className="text-fg">Retrieval.</span> The label is printed once, then
          removed. A four-choice probe is harder than rereading, and that difficulty is
          the point.
        </li>
        <li>
          <span className="text-fg">Spacing.</span> Correct answers move out in time;
          misses return now. Cramming the same card is cheaper in the minute and worse
          tomorrow.
        </li>
      </ul>
    </aside>
  );
}
