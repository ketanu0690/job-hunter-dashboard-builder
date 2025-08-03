import { supabase } from "@/integrations/supabase/client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  checkAuth: () => Promise<boolean>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      try {
        console.log("came here");
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session?.user) {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("auth-token");
        } else {
          const supaUser = data.session.user;

          setUser({
            id: supaUser.id,
            email: supaUser.email ?? "",
            username:
              supaUser.user_metadata?.full_name ?? supaUser.email ?? "User",
          });

          setIsAuthenticated(true);
          localStorage.setItem("auth-token", data.session.access_token);
        }
      } catch (error) {
        console.error("Error Occured While Validating: ");
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = async (username: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });

    if (error) throw new Error(error.message);

    const supaUser = data.user;
    if (supaUser && data.session) {
      setUser({
        id: supaUser.id,
        email: supaUser.email ?? "",
        username: supaUser.user_metadata?.full_name ?? supaUser.email ?? "User",
      });
      setIsAuthenticated(true);
      localStorage.setItem("auth-token", data.session.access_token);
    } else {
      throw new Error("Login failed: Session or user not returned.");
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);

    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("auth-token");
  };

  const checkAuth = async (): Promise<boolean> => {
    const { data, error } = await supabase.auth.getSession();
    return Boolean(data?.session?.user && !error);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        {/* Spinner Animation */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>

        {/* Label below spinner */}
        <div className="text-xl font-semibold animate-pulse">K Loder..</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
