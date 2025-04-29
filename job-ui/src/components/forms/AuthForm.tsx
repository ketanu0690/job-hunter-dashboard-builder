import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { supabase } from "../../integrations/supabase/client";
import { toast } from "../../hooks/use-toast";

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
  const [loadingSession, setLoadingSession] = useState<boolean>(true);
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  
  // Restore session on mount and listen for changes
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

  useEffect(() => {
    if (!session && !loadingSession) {
      navigate("/login");
    }
  }, [session, loadingSession]);

  // Auto-logout after inactivity (15 minutes)
  useEffect(() => {
    const logout = async () => {

      await supabase.auth.signOut();
      setSession(null);
      setToken(null)
      window.location.href = "/login";
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

  return loadingSession ? null : (
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

interface AuthFormProps {
  redirectToHome?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ redirectToHome }) => {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();

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
        // Redirect after login
        if (redirectToHome) {
          navigate("/");
        } else {
          const role = data.session?.user?.user_metadata?.role;
          if (role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSession(data.session);
        toast({
          title: "Signed up!",
          description: "Check your email to confirm your account.",
        });
        // After sign up, redirect
        if (redirectToHome) {
          navigate("/");
        } else {
          navigate("/");
        }
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
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
        <span className="mx-2 text-gray-400 text-xs">or</span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          try {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: "google",
            });
            if (error) throw error;
          } catch (error) {
            toast({
              title: "Google Login Error",
              description: (error as Error).message,
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }
        }}
      >
        <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
          <g>
            <path
              fill="#4285F4"
              d="M44.5 20H24v8.5h11.7C34.7 33.1 29.9 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"
            />
            <path
              fill="#34A853"
              d="M6.3 14.7l7 5.1C15.1 17.1 19.2 14 24 14c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3c-7.2 0-13.2 4.1-16.7 10.1z"
            />
            <path
              fill="#FBBC05"
              d="M24 44c5.9 0 10.7-1.9 14.2-5.1l-6.6-5.4C29.7 35.1 27 36 24 36c-5.8 0-10.7-3.9-12.5-9.2l-7 5.4C7.1 40.1 14.1 44 24 44z"
            />
            <path
              fill="#EA4335"
              d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-4.6 0-8.4-3.8-8.4-8.5s3.8-8.5 8.4-8.5c2.6 0 4.9 1 6.5 2.6l6.4-6.4C37.5 7.1 31.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"
            />
          </g>
        </svg>
        Continue with Google
      </Button>
    </div>
  );
};

export default AuthForm;