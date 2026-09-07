import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ChartNoAxesColumn, ClipboardList, ScanFace } from "lucide-react";
import { useEffect, useState } from "react";
import { Atlas } from "@/components/app/atlas";
import { Drill } from "@/components/app/drill";
import { FieldCard } from "@/components/app/field-card";
import { Recall } from "@/components/app/recall";
import { FEATURES } from "@/data/catalog";
import { dueCount } from "@/lib/leitner";
import { useTrainer } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const tab = useTrainer((s) => s.tab);
  const setTab = useTrainer((s) => s.setTab);
  const deck = useTrainer((s) => s.deck);
  const trials = useTrainer((s) => s.trials);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const done = useTrainer.persist.rehydrate();
    void Promise.resolve(done).then(() => setReady(true));
  }, []);

  const due = ready ? dueCount(deck) : FEATURES.length;
  const hits = trials.filter((t) => t.correct).length;
  const recall = trials.length ? Math.round((hits / trials.length) * 100) : null;

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] text-subtle uppercase">
            isolate · retrieve · describe
          </p>
          <h1 className="font-display mt-1 text-4xl tracking-tight text-fg italic sm:text-5xl">
            Lineament
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Learn the names on isolated plates, then spend ninety seconds describing
            one live face from the top of the head down.
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-3 font-mono text-[11px] tracking-wide text-subtle uppercase">
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

      <main className="mt-6 flex-1">
        {tab === "drill" ? <Drill /> : null}
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
      <dd className="mt-1 font-sans text-lg font-medium tracking-normal text-fg normal-case">{v}</dd>
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
  id: "drill" | "field" | "atlas" | "recall";
  current: string;
  set: (id: "drill" | "field" | "atlas" | "recall") => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const on = current === id;
  return (
    <button
      type="button"
      onClick={() => set(id)}
      className={`inline-flex min-h-11 items-center gap-2 rounded-sm border px-3 text-sm ${
        on ? "border-primary bg-raised text-fg" : "border-border bg-surface text-muted"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
