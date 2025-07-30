import BlogManagement from "@/pages/BlogManagement";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/blog")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BlogManagement />;
}
