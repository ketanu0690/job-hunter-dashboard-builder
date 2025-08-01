import { createFileRoute } from "@tanstack/react-router";
import BlogShowcase from "@/features/Kblog/components/blog/BlogShowcase";

export const Route = createFileRoute("/_authenticated/blogs")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BlogShowcase />;
}
