import AdminDashboard from "@/pages/AdminDashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/__dashboard/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminDashboard />;
}
