import React, { useState } from "react";
import { supabase } from "../../../integrations/supabase/client";
import { toast } from "../../../hooks/use-toast";

import {
  Eye,
  EyeOff,
  Mail,
  User,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "@tanstack/react-router";

const AuthForm = () => {
  const [step, setStep] = useState("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isSignUp, setIsSignUp] = useState(false);

  const { login, loginWithProvider } = useAuth();
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email: string) => {
    console.log(email);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return "Email is required";
    if (emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    return "";
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    await loginWithProvider("google");
  };

  const handleEmailSubmit = () => {
    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }
    setErrors({});
    setStep("password");
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setErrors({ password: "Password must be at least 6 characters" });
      return;
    }
    const passwordError = validatePassword(password);

    if (passwordError) {
      setErrors({ email: "", password: passwordError });
      return;
    }

    try {
      setErrors({});
      setLoading(true);
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      setStep("success");
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
  const resetFlow = () => {
    setStep("initial");
    setEmail("");
    setPassword("");
    setErrors({});
    setIsSignUp(false);
    navigate({ to: "/dashboard" });
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  const ColorfulDots = () => (
    <div className="relative w-32 h-32 mx-auto mb-8">
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => {
          const angle = (i / 40) * 2 * Math.PI;
          const radius = 45 + Math.sin(i * 0.5) * 10;
          const x = Math.cos(angle) * radius + 64;
          const y = Math.sin(angle) * radius + 64;
          const hue = (i / 40) * 360;

          return (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-pulse"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                backgroundColor: `hsl(${hue}, 70%, 60%)`,
                animationDelay: `${i * 0.1}s`,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            CF
          </span>
        </div>
      </div>
    </div>
  );

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center animate-fadeIn">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Career Flow!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You've successfully signed in to your account.
            </p>
            <button
              onClick={resetFlow}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
            {step === "initial" && (
              <div className="text-center animate-fadeIn">
                <ColorfulDots />

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Sign in to Career Flow
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Use your email or another service to continue with Career Flow
                  (it's free!)
                </p>

                <div className="space-y-4">
                  <button
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 font-medium"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent" />
                    ) : (
                      <GoogleIcon />
                    )}
                    Continue with Google
                  </button>

                  <button
                    onClick={() => setStep("email")}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 font-medium"
                  >
                    <Mail className="w-5 h-5" />
                    Continue with email
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {isSignUp
                      ? "Already have an account? Sign in"
                      : "Don't have an account? Sign up"}
                  </button>
                </div>
              </div>
            )}

            {step === "email" && (
              <div className="animate-slideIn">
                <button
                  onClick={() => setStep("initial")}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {isSignUp ? "Create your account" : "Sign in with email"}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter your email address to continue
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-gray-900 dark:text-white bg-white dark:bg-gray-700 ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleEmailSubmit()
                      }
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleEmailSubmit}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === "password" && (
              <div className="animate-slideIn">
                <button
                  onClick={() => setStep("email")}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">
                      {email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Enter your password
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">{email}</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={
                        isSignUp
                          ? "Create a password (min. 6 characters)"
                          : "Enter your password"
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-4 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-gray-900 dark:text-white bg-white dark:bg-gray-700 ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handlePasswordSubmit()
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}

                  <button
                    onClick={handlePasswordSubmit}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        {isSignUp ? "Creating account..." : "Signing in..."}
                      </>
                    ) : (
                      <>
                        {isSignUp ? "Create account" : "Sign in"}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {!isSignUp && (
                    <div className="text-center">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
              By continuing, you agree to Career Flow's{" "}
              <button className="text-blue-600 hover:text-blue-700">
                Terms of Use
              </button>{" "}
              &{" "}
              <button className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }

          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </>
  );
};

export default AuthForm;
