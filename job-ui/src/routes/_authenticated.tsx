import { Outlet, redirect, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    console.log(
      "came here to check authentication ",
      context,
      context.auth.isAuthenticated
    );
    if (!context?.auth?.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          // Save current location for redirect after login
          redirect: location.href,
        },
      });
    }
  },
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
