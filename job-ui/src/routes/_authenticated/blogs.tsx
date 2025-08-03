import { createFileRoute, redirect } from "@tanstack/react-router";
import BlogShowcase from "@/features/Kblog/components/blog";

export const Route = createFileRoute("/_authenticated/blogs")({
  validateSearch: (search) => ({
    redirect:
      typeof search.redirect === "string" ? search.redirect : "/dashboard",
  }),
  loader: async (ctx) => {
    const isAuth = await ctx.context.auth.checkAuth();
    if (!isAuth) {
      throw redirect({ to: "/login", search: { redirect: '/blog' } });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <BlogShowcase />;
}
