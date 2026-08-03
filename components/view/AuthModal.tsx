"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/context/AuthModalContext";
import { signIn, signUp } from "@/lib/auth-client";

const GoogleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
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
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const AuthModal = () => {
  const { isOpen, mode, closeAuthModal, setMode } = useAuthModal();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAuthModal();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeAuthModal]);

  if (!isOpen) return null;

  const bgImageSrc = mode === "signin" ? "/bg-signin.webp" : "/bg-signup.webp";

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await signIn.email({
          email,
          password,
          callbackURL: "/",
        });
        if (error) {
          setErrorMessage(error.message || "Failed to sign in. Please check your credentials.");
        } else {
          closeAuthModal();
        }
      } else {
        const userName = name.trim() || email.split("@")[0];
        const { error } = await signUp.email({
          email,
          password,
          name: userName,
          callbackURL: "/",
        });
        if (error) {
          setErrorMessage(error.message || "Failed to create account.");
        } else {
          closeAuthModal();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    setLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in with Google.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm transition-all"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-210 bg-[#121218] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-130"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Auth Image */}
        <div className="relative hidden md:flex md:w-1/2 flex-col justify-end p-6 overflow-hidden min-h-130">
          <Image
            key={mode}
            src={bgImageSrc}
            alt="Auth background"
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            priority
            className="object-cover object-center transition-all duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex items-center font-bold text-2xl tracking-tight text-white">
            <span>love</span>
            <span className="text-violet-500">.ai</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-9 flex flex-col justify-between relative bg-[#121218] text-white">
          {/* Close Button */}
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              {mode === "signin" ? "Sign in" : "Create Account"}
            </h2>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === "signup" && (
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Full Name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 bg-[#1a1a24] border-white/10 text-white placeholder:text-white/40 rounded-xl focus-visible:ring-violet-500 focus-visible:border-violet-500 text-sm w-full transition-all"
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40 pointer-events-none z-10" />
                <Input
                  type="email"
                  required
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10.5 pr-4 h-11 bg-[#1a1a24] border-white/10 text-white placeholder:text-white/40 rounded-xl focus-visible:ring-violet-500 focus-visible:border-violet-500 text-sm w-full transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40 pointer-events-none z-10" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10.5 pr-10.5 h-11 bg-[#1a1a24] border-white/10 text-white placeholder:text-white/40 rounded-xl focus-visible:ring-violet-500 focus-visible:border-violet-500 text-sm w-full transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer z-10"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>

              {mode === "signin" ? (
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    className="text-white/70 hover:text-white underline underline-offset-2 cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              ) : (
                <p className="text-xs text-white/50 pt-0.5">
                  Minimum 6 characters
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-4 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-semibold rounded-xl cursor-pointer transition-all shadow-lg shadow-violet-600/30 text-sm border-0 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "signin" ? "Sign in" : "Create Free Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative bg-[#121218] px-3 text-xs text-white/50 font-medium">
                {mode === "signin" ? "or sign in with" : "or continue with"}
              </span>
            </div>

            {/* Social Sign-in (Google) */}
            <Button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full h-11 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl flex items-center justify-center gap-2.5 cursor-pointer transition-all border-0 shadow-sm text-sm"
            >
              <GoogleIcon className="w-5 h-5 shrink-0" />
              Google
            </Button>

            {mode === "signup" && (
              <p className="text-[11px] text-white/40 text-center mt-3">
                By signing up, you agree to{" "}
                <a
                  href="#"
                  className="underline text-white/60 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </p>
            )}
          </div>

          {/* Modal Bottom Footer */}
          <div className="w-full border-t border-white/10 pt-4 mt-6">
            {mode === "signin" ? (
              <p className="text-xs text-center text-white/60">
                Don't have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-violet-400 font-medium hover:text-violet-300 hover:underline cursor-pointer ml-1 transition-colors"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-xs text-center text-white/60">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-violet-400 font-medium hover:text-violet-300 hover:underline cursor-pointer ml-1 transition-colors"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
