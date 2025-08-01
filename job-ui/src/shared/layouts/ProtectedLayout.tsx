import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) navigate({ to: "/login", replace: true });
  }, [session]);

  if (!session) return null;

  return <>{children}</>;
};
