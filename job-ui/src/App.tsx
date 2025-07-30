import { RouterProvider } from "@tanstack/react-router";
import { lazy } from "react";
import { router } from "./routerSetup";

const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </>
  );
};

export default App;
