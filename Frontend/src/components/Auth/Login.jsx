import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import ThemeToggle from "../Theme/ThemeToggle";

export default function Login() {
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect screen size
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleResize = () => setIsDesktop(mediaQuery.matches);

    handleResize(); // initial check
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Read invite token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get("invite");

    if (inviteToken) {
      sessionStorage.setItem("invite_token", inviteToken);
      setInvite(inviteToken);
    } else {
      setError("This application is invite-only. Please use your invite link.");
    }
  }, []);

  const handleGoogleLogin = () => {
    const inviteToken = sessionStorage.getItem("invite_token");

    if (!inviteToken) {
      setError("Missing invite token. Please use your invite link.");
      return;
    }

    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/auth/google/start?invite=${inviteToken}`;
  };

  /* =========================
     BLOCK MOBILE SCREENS
  ========================= */
  if (!isDesktop) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-gradient px-6 text-center">
        <div className="max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h1 className="text-xl font-semibold text-almost-black mb-3">
            Desktop Required
          </h1>
          <p className="text-sm text-gray-700">
            <b>Mobile experience coming soon 🚧</b>
            <br />
            Our mobile version is currently being built.
            <br />
            For now, please access HireBrix on a desktop or laptop.
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     DESKTOP LOGIN UI
  ========================= */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center hero-gradient px-4 py-12 sm:py-20 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Title */}
      <h1
        className="w-full text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight sm:tracking-widest mb-6 
                     bg-gradient-to-r from-[var(--electric-blue)] to-[var(--electric-blue)] text-transparent bg-clip-text"
      >
        HireBrix
      </h1>

      {/* Description */}
      <p className="text-almost-black text-xs sm:text-sm md:text-base leading-relaxed max-w-md sm:max-w-lg text-center mb-10">
        Bring complete visibility to your consultant lifecycle — from onboarding
        to submissions, interviews, performance tracking, and successful
        placements.
      </p>

      {/* Error */}
      {error && (
        <p className="mb-4 text-sm text-red-600 text-center max-w-sm">
          {error}
        </p>
      )}

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        className="group flex items-center justify-center gap-2.5 px-6 py-3 bg-color rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.35)] transition-shadow border border-gray-300"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-4 h-4"
        />
        <span className="text-almost-black font-medium">
          Continue with Google
        </span>
        <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Agreement */}
      <p className="mt-6 text-xs text-gray-500 max-w-md text-center">
        By clicking <span className="font-medium">Continue</span>, you agree to
        our{" "}
        <a href="#" className="underline hover:text-almost-black">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-almost-black">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
