import React from "react";

export default function Hero() {
  return (
    <section className="hero-gradient rounded-lg min-h-[calc(100vh-16px)] flex flex-col justify-center py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Content */}
          <div className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Track Every Consultant, Onboarding to Placement
              </h1>

              <p className="text-md text-gray-700 mb-6">
                Unified workspace to manage consultants, submissions, interviews,
                vendors, and performance — save time, reduce manual work, and streamline hiring.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-6 justify-center lg:justify-start">
                <a
                  href="#signup"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-tr from-[var(--electric-blue)] to-[var(--hiring-lime)] text-white font-medium shadow hover:scale-105 transition-transform duration-300"
                >
                  Start Free Trial
                </a>

                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Book a Demo
                </a>
              </div>

              <div className="text-sm text-gray-500 mb-8">
                No credit card required • Onboard in minutes
              </div>

              {/* Trust Logos */}
              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-6">
                {["transistor", "reform", "tuple", "savvycal", "statamic"].map((logo, idx) => (
                  <img
                    key={idx}
                    width="80"
                    height="48"
                    src={`https://tailwindcss.com/plus-assets/img/logos/158x48/${logo}-logo-gray-900.svg`}
                    alt={logo}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Floating Cards */}
          <div className="lg:col-span-6 relative flex justify-center mt-10 lg:mt-0">
            <div className="w-full max-w-xl relative flex justify-center lg:block">

              {/* Light Dashboard Card (Tilt Left) */}
              <div className="relative mx-auto lg:mx-0 w-[360px] md:w-[420px] soft-card rounded-2xl glass p-4 transition-transform animate-float hover:scale-105 -rotate-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="text-xs text-gray-600">Job Board · 38 submissions</div>
                  </div>
                  <div className="text-xs text-gray-400">Preview</div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="h-6 bg-gray-100 rounded w-2/5 mb-3"></div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="h-8 bg-gray-50 rounded"></div>
                    <div className="h-8 bg-gray-50 rounded"></div>
                    <div className="h-8 bg-gray-50 rounded"></div>
                  </div>
                  <div className="h-36 bg-gray-50 rounded"></div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                  <div>View full board</div>
                  <div className="text-sm font-medium text-gray-200">Open</div>
                </div>
              </div>

              {/* Dark Technical Card (Tilt Right) */}
              <div className="absolute right-[-28px] top-24 md:top-20 w-[300px] md:w-[350px] dark-card rounded-2xl p-4 text-white animate-float2 rotate-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-gray-300">Skills · Primary</div>
                  <div className="text-xs px-2 py-1 rounded bg-white/10 text-green-400">Live</div>
                </div>

                <div className="text-xs text-gray-300 mb-3">Upcoming Interviews</div>
                <div className="h-24 bg-gradient-to-r from-[#021027] to-[#05213b] rounded mb-3"></div>

                <div className="flex items-center justify-between text-xs text-gray-300">
                  <div>Success Rate</div>
                  <div className="text-green-400 font-semibold">+18%</div>
                </div>
              </div>

              {/* Accent Shape */}
              <div className="absolute -right-6 bottom-6 w-20 h-20 rounded bg-gradient-to-tr from-[var(--accent2)] to-[var(--accent3)] opacity-10 -z-10"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float2 {
          animation: float2 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
