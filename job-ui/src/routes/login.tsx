import Login from "@/pages/Login";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  validateSearch: (search) => ({
    redirect:
      typeof search.redirect === "string" ? search.redirect : "/dashboard",
  }),

  loader: async ({ context }) => {
    const isAuth = await context.auth.checkAuth();
    if (isAuth) throw redirect({ to: "/dashboard" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Login />;
}
