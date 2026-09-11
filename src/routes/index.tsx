import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ChartNoAxesColumn, ClipboardList, ScanFace } from "lucide-react";
import { useEffect, useState } from "react";
import { Atlas } from "@/components/app/atlas";
import { Drill } from "@/components/app/drill";
import { FieldCard } from "@/components/app/field-card";
import { Recall } from "@/components/app/recall";
import { Button } from "@/components/ui/button";
import { FEATURES } from "@/data/catalog";
import { dueCount } from "@/lib/leitner";
import { useTrainer, type Tab } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const tab = useTrainer((s) => s.tab);
  const setTab = useTrainer((s) => s.setTab);
  const deck = useTrainer((s) => s.deck);
  const trials = useTrainer((s) => s.trials);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const done = useTrainer.persist.rehydrate();
    void Promise.resolve(done).then(
      () => setReady(true),
      () => setReady(true),
    );
  }, []);

  const due = ready ? dueCount(deck) : FEATURES.length;
  const hits = trials.filter((t) => t.correct).length;
  const recall = trials.length ? Math.round((hits / trials.length) * 100) : null;

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="font-mono text-xs tracking-widest text-subtle uppercase">
            isolate · retrieve · describe
          </p>
          <h1 className="font-display mt-1 text-4xl tracking-tight text-fg italic sm:text-5xl">
            Faces
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Learn 62 structural terms across 11 facial surfaces, then build a top-to-bottom
            description with appearance recorded separately.
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-3 font-mono text-xs tracking-wide text-subtle uppercase">
          <HeaderStat k="due" v={String(due)} />
          <HeaderStat k="trials" v={String(trials.length)} />
          <HeaderStat k="recall" v={recall === null ? "—" : `${recall}%`} />
        </dl>
      </header>

      <nav className="mt-5 flex flex-wrap gap-2" aria-label="Sections">
        <TabBtn id="drill" current={tab} set={setTab} icon={<ScanFace className="size-4" />}>
          Drill
        </TabBtn>
        <TabBtn id="field" current={tab} set={setTab} icon={<ClipboardList className="size-4" />}>
          Field
        </TabBtn>
        <TabBtn id="atlas" current={tab} set={setTab} icon={<BookOpen className="size-4" />}>
          Atlas
        </TabBtn>
        <TabBtn
          id="recall"
          current={tab}
          set={setTab}
          icon={<ChartNoAxesColumn className="size-4" />}
        >
          Time / recall
        </TabBtn>
      </nav>

      <main
        id={`panel-${tab}`}
        className="mt-6 flex-1 outline-none"
        aria-labelledby={`tab-${tab}`}
        tabIndex={-1}
      >
        {tab === "drill" ? <Drill ready={ready} /> : null}
        {tab === "field" ? <FieldCard /> : null}
        {tab === "atlas" ? <Atlas /> : null}
        {tab === "recall" ? <Recall /> : null}
      </main>
    </div>
  );
}

function HeaderStat({ k, v }: { k: string; v: string }) {
  return (
    <div className="min-w-16 rounded-md border border-border bg-surface px-3 py-2">
      <dt>{k}</dt>
      <dd className="mt-1 font-sans text-lg font-medium tracking-normal text-fg normal-case">
        {v}
      </dd>
    </div>
  );
}

function TabBtn({
  id,
  current,
  set,
  icon,
  children,
}: {
  id: Tab;
  current: Tab;
  set: (id: Tab) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const on = current === id;
  return (
    <Button
      id={`tab-${id}`}
      variant="ghost"
      onClick={() => set(id)}
      aria-pressed={on}
      aria-controls={`panel-${id}`}
      className={on ? "border-primary bg-raised px-3 text-fg" : "px-3 text-muted"}
    >
      {icon}
      {children}
    </Button>
  );
}
