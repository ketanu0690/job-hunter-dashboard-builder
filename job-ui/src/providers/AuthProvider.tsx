import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface AuthContextType {
  session: any;
  token: string | null;
  setSession: (session: any) => void;
  clearAuthStorage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // 🔄 On mount: restore session and listen for auth state changes
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setToken(session?.access_token || null);
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setToken(data.session?.access_token || null);
      setLoadingSession(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ⛔ Redirect to login if session is missing
  useEffect(() => {
    if (!session && !loadingSession) {
      localStorage.removeItem("unsplash_image");
      // navigate({ to: "/login" }); // or "/login" if that's your intended redirect
    }
  }, [session, loadingSession]);

  // ⏳ Auto-logout after 15 minutes of inactivity
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      setSession(null);
      setToken(null);
      navigate({ to: "/login" });
    };

    const resetTimer = () => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      inactivityTimeout.current = setTimeout(logout, 15 * 60 * 1000); // 15 min
    };

    if (session) {
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("mousedown", resetTimer);
      window.addEventListener("touchstart", resetTimer);
      resetTimer();
    }

    return () => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [session]);

  const clearAuthStorage = () => {
    const keysToRemove = ["unsplash_image", "token", "supabase.auth.token"];
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    sessionStorage.clear();
    document.cookie = "";
  };

  return loadingSession ? null : (
    <AuthContext.Provider
      value={{ session, token, setSession, clearAuthStorage }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
