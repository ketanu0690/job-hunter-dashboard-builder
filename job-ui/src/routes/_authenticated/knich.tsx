import { FindNicheApp } from "@/features/KNich";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/knich")({
  component: RouteComponent,
});

function RouteComponent() {
  return <FindNicheApp />;
}
