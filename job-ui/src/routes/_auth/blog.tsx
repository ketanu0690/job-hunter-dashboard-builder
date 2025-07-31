import BlogManagement from "@/pages/BlogManagement";
import { BlogProvider } from "@/providers/BlogProvider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/blog")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <BlogProvider>
      <BlogManagement />;
    </BlogProvider>
  );
}
