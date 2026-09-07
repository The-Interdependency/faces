import { createFileRoute } from "@tanstack/react-router";
import { TrainerApp } from "@/components/faces/TrainerApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <TrainerApp />;
}
