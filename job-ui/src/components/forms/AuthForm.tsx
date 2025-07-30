import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { supabase } from "../../integrations/supabase/client";
import { toast } from "../../hooks/use-toast";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Github,
  Linkedin,
  Info,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "@tanstack/react-router";

interface AuthFormProps {
  redirectToHome?: boolean;
}

interface AuthFormProps {
  redirectToHome?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ redirectToHome }) => {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [oAuthLoading, setOAuthLoading] = useState<{
    google?: boolean;
    github?: boolean;
    linkedin?: boolean;
  }>({});

  const { setSession } = useAuth();
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (mode === "signUp" && password.length < 6)
      return "Password must be at least 6 characters";
    return "";
  };

  const handleInputChange = (field: "email" | "password", value: string) => {
    if (field === "email") {
      setEmail(value);
      if (errors.email) {
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
      }
    } else {
      setPassword(value);
      if (errors.password) {
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
      }
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      if (mode === "signIn") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSession(data.session);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        // Redirect after login
        if (redirectToHome) {
          navigate({ to: "/" });
        } else {
          const role = data.session?.user?.user_metadata?.role;
          if (role === "admin") {
            navigate({ to: "/" }); // admin
          } else {
            navigate({ to: "/" });
          }
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSession(data.session);
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        // After sign up, redirect
        if (redirectToHome) {
          navigate({ to: "/" });
        } else {
          navigate({ to: "/" });
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

  const handleOAuthSignIn = async (
    provider: "google" | "github" | "linkedin"
  ) => {
    setOAuthLoading((prev) => ({ ...prev, [provider]: true }));
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
      });
      if (error) throw error;
      toast({
        title: `${
          provider.charAt(0).toUpperCase() + provider.slice(1)
        } Login Success`,
        description: "You have been signed in successfully.",
      });
    } catch (error) {
      toast({
        title: `${
          provider.charAt(0).toUpperCase() + provider.slice(1)
        } Login Error`,
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setOAuthLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  const getOAuthIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return (
          <svg className="h-5 w-5" viewBox="0 0 48 48">
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
        );
      case "github":
        return <Github className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className=" flex  bg-white dark:bg-gray-900  ">
        <div className="flex-1 flex flex-col justify-center p-8">
          <div className="text-center mb-10 animate-fadeIn">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:scale-105 transition-transform">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
              {mode === "signIn"
                ? "Sign In to Career Flow"
                : "Create Your Career Flow Account"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-md sm:text-lg">
              {mode === "signIn"
                ? "Continue your journey with us."
                : "Join now and start building your future."}
            </p>
          </div>
        </div>

        <div className="flex-1 p-8 lg:p-12">
          {/* Mode Toggle with Radix */}
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(val) => val && setMode(val as "signIn" | "signUp")}
            // className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-8"
          >
            <ToggleGroupItem
              value="signIn"
              className={`flex-1 h-12 rounded-lg text-sm font-medium transition-colors duration-200 ${
                mode === "signIn"
                  ? "bg-balck dark:bg-gray-900 text-blue-600 shadow"
                  : "bg-transparent text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Sign In
            </ToggleGroupItem>
            <ToggleGroupItem
              value="signUp"
              className={`flex-1 h-12 rounded-lg text-sm font-medium transition-colors duration-200 ${
                mode === "signUp"
                  ? "bg-black dark:bg-gray-900 text-blue-600 shadow"
                  : "bg-transparent text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Sign Up
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Form */}
          <form
            onSubmit={handleAuth}
            className="space-y-6 px-6 py-8 bg-white dark:bg-gray-900 rounded-xl shadow-md w-full max-w-md mx-auto"
          >
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={cn(
                    "pl-12",
                    errors.email && "border-red-500 focus:ring-red-500"
                  )}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password with Tooltip */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="end"
                      className="bg-gray-800 text-white text-sm px-3 py-2 rounded shadow"
                    >
                      Use at least 8 characters, including a number.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={cn(
                    "pl-12 pr-12",
                    errors.password && "border-red-500 focus:ring-red-500"
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-lg font-semibold"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  {mode === "signIn" ? "Signing In..." : "Creating Account..."}
                </div>
              ) : mode === "signIn" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
            <span className="mx-4 text-gray-500 text-sm font-medium">
              or continue with
            </span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
          </div>

          {/* OAuth Buttons with example Dialog fallback */}
          <div className="space-y-3 flex flex-col">
            {/* Google Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 justify-center gap-3 text-base"
              disabled={oAuthLoading.google}
              onClick={() => handleOAuthSignIn("google")}
            >
              {oAuthLoading.google ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-muted border-t-transparent" />
              ) : (
                getOAuthIcon("google")
              )}
              <span className="truncate">Continue with Google</span>
            </Button>

            {/* GitHub Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 justify-center gap-2 text-base"
              disabled={oAuthLoading.github}
              onClick={() => handleOAuthSignIn("github")}
            >
              {oAuthLoading.github ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-muted border-t-transparent" />
              ) : (
                getOAuthIcon("github")
              )}
              <span className="truncate">GitHub</span>
            </Button>

            {/* LinkedIn Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 justify-center gap-2 text-base"
              disabled={oAuthLoading.linkedin}
              onClick={() => handleOAuthSignIn("linkedin")}
            >
              {oAuthLoading.linkedin ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-muted border-t-transparent" />
              ) : (
                getOAuthIcon("linkedin")
              )}
              <span className="truncate">LinkedIn</span>
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            {mode === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {mode === "signIn" ? "Sign up here" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
