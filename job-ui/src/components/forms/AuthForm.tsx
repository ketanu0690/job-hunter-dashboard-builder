import React, { useState, createContext, useContext, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "../../hooks/use-toast";
import { supabase } from "../../integrations/supabase/client";

// AuthContext and hook
interface AuthContextType {
  session: any;
  token: string | null;
  setSession: (session: any) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setToken(data.session?.access_token || null);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setToken(session?.access_token || null);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, token, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signIn") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSession(data.session);
        toast({ title: "Signed in!", description: "You are now logged in." });
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSession(data.session);
        toast({
          title: "Signed up!",
          description: "Check your email to confirm your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow">
      <div className="flex justify-center mb-4">
        <Button
          variant={mode === "signIn" ? "default" : "outline"}
          onClick={() => setMode("signIn")}
          className="mr-2"
        >
          Sign In
        </Button>
        <Button
          variant={mode === "signUp" ? "default" : "outline"}
          onClick={() => setMode("signUp")}
        >
          Sign Up
        </Button>
      </div>
      <form onSubmit={handleAuth} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading
            ? mode === "signIn"
              ? "Signing In..."
              : "Signing Up..."
            : mode === "signIn"
            ? "Sign In"
            : "Sign Up"}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;
