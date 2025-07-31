import { Outlet, createRootRoute } from "@tanstack/react-router";
import MainLayout from "@/shared/layouts/MainLayout";
import { AuthProvider } from "@/providers/AuthProvider";

function RootComponent() {
  return (
    <AuthProvider>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </AuthProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
