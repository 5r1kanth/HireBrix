import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import ThemeToggle from "../Theme/ThemeToggle";

export default function Login() {
  const [inviteToken, setInviteToken] = useState(null);
  const [inviteEmail, setInviteEmail] = useState(null);
  const [error, setError] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);

  /** =============================
   * Detect Desktop
   ============================= */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleResize = () => setIsDesktop(mediaQuery.matches);
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  /** =============================
   * Read Invite Token & Email
   ============================= */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const token = params.get("token");

    if (email && token) {
      setInviteEmail(email);
      setInviteToken(token);
      sessionStorage.setItem("invite_token", token);
      sessionStorage.setItem("invite_email", email);
    } else {
      setError("This application is invite-only. Please use your invite link.");
    }
  }, []);

  /** =============================
   * Load Google Identity Services script
   ============================= */
  const loadGoogleScript = () =>
    new Promise((resolve, reject) => {
      if (window.google?.accounts?.oauth2) return resolve();

      const existingScript = document.getElementById("google-oauth");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.id = "google-oauth";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Google OAuth script failed to load"));
        document.body.appendChild(script);
      } else {
        resolve();
      }
    });

  /** =============================
   * Initialize Google OAuth popup
   ============================= */
  const initGooglePopup = (token, email) => {
    if (!window.google?.accounts?.oauth2) {
      setError("Google OAuth not loaded. Please try again.");
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const oauth2Client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "email profile openid",
      callback: async (tokenResponse) => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/frontend-callback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accessToken: tokenResponse.access_token,
              inviteToken: token,
              inviteEmail: email,
            }),
          });
          console.log(email);
          const data = await res.json();

          if (res.ok) {
            if (data.email.toLowerCase() !== inviteEmail.toLowerCase()) {
              setError("You must sign in with the email you were invited with.");
              return;
            }

            localStorage.setItem("token", data.token);
            window.location.href = "/consultant"; // Landing page after successful login
          } else {
            setError(data.message || "Google login failed.");
          }
        } catch (err) {
          setError(err.message || "Something went wrong during Google login.");
        }
      },
    });

    // Open Google OAuth popup
    oauth2Client.requestAccessToken();
  };

  /** =============================
   * Handle Google Login button click
   ============================= */
  const handleGoogleLogin = async () => {
    if (!inviteToken || !inviteEmail) {
      setError("Missing invite token or email. Please use your invite link.");
      return;
    }

    try {
      await loadGoogleScript(); // Load GIS script
      initGooglePopup(inviteToken, inviteEmail);
    } catch (err) {
      setError(err.message);
    }
  };

  /** =============================
   * Desktop check
   ============================= */
  if (!isDesktop) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-gradient px-6 text-center">
        <div className="max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h1 className="text-xl font-semibold text-almost-black mb-3">Desktop Required</h1>
          <p className="text-sm text-gray-700">
            <b>Mobile experience coming soon 🚧</b>
            <br />
            Please access HireBrix on a desktop or laptop.
          </p>
        </div>
      </div>
    );
  }

  /** =============================
   * Render Login Page
   ============================= */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center hero-gradient px-4 py-12 sm:py-20 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1
        className="w-full text-center text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 
                     bg-gradient-to-r from-[var(--electric-blue)] to-[var(--electric-blue)] text-transparent bg-clip-text">
        HireBrix
      </h1>

      <p className="text-almost-black text-xs sm:text-sm md:text-base leading-relaxed max-w-md text-center mb-10">
        Bring complete visibility to your consultant lifecycle — from onboarding to submissions, interviews, performance tracking, and successful placements.
      </p>

      {error && <p className="mb-4 text-sm text-red-600 text-center max-w-sm">{error}</p>}

      <button
        onClick={handleGoogleLogin}
        className="group flex items-center justify-center gap-2.5 px-6 py-3 bg-color rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.35)] transition-shadow border border-gray-300">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
        <span className="text-almost-black font-medium">Continue with Google</span>
        <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
      </button>

      <p className="mt-6 text-xs text-gray-500 max-w-md text-center">
        By clicking <span className="font-medium">Continue</span>, you agree to our{" "}
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
