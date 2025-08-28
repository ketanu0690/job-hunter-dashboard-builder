import { supabase } from "@/integrations/supabase/client";
import AppLoader from "@/shared/components/Loader";
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  metaData?: any;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  checkAuth: () => Promise<boolean>;
  login: (username: string, password: string) => Promise<void>;
  loginWithProvider: (
    providerName: "google" | "github" | "gitlab"
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const ensureProfile = async (supaUser: any) => {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", supaUser.id)
      .single();

    if (!existingProfile) {
      const { error } = await supabase.from("profiles").insert({
        id: supaUser.id,
        username: supaUser.user_metadata?.full_name ?? supaUser.email,
        email: supaUser.email,
        user_metadata: {}, // start with empty JSON
      });

      if (error) {
        console.error("Error inserting profile:", error.message);
      }
    }
  };

  useEffect(() => {
    const validateSession = async () => {
      try {
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
            metaData: supaUser.user_metadata,
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
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);

    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("auth-token");
  };

  const loginWithProvider = async (
    providerName: "google" | "github" | "gitlab"
  ) => {
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: providerName,
    });

    console.log("code break", data);
    if (error) {
      console.error("OAuth login error:", error.message);
      throw new Error("OAuth Login Failed");
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    const { data, error } = await supabase.auth.getSession();
    return Boolean(data?.session?.user && !error);
  };

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        checkAuth,
        loginWithProvider,
      }}
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
