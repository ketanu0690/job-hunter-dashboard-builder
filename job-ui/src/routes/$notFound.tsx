import { GameDialog } from "@/components/games/GameDialog";
import { createFileRoute } from "@tanstack/react-router";
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col space-y-6 bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold text-green-600 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-2">
          Page not found
        </p>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
        >
          Go back to Home
        </a>
      </div>

      <GameDialog />
    </div>
  );
}

export const Route = createFileRoute("/$notFound")({
  component: NotFound,
});
