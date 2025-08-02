import KMentor from "@/pages/KMentor";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/kmentor")({
  component: RouteComponent,
});

function RouteComponent() {
  return <KMentor />;
}
