import { RouterProvider } from "@tanstack/react-router";
import { lazy } from "react";
import { router } from "./routerSetup";
import { AuthProvider, useAuth } from "./providers/AuthProvider";
import { ThemeProvider } from "./providers/ThemeProvider";

const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InnerApp />
        <ReactQueryDevtools />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
