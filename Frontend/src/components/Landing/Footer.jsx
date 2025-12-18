import { Twitter, Linkedin, Github } from "lucide-react";
import Logo from "@assets/footerlogo.png";

export default function Footer() {
  return (
    <footer className="bg-dark-only text-gray-300 rounded-lg">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        {/* Main Flex Container */}
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between sm:items-start">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img width="50" height="50" src={Logo} alt="HireBrix Logo" />
              </div>
              <div>
                <div className="font-semibold text-white">HireBrix</div>
                <div className="text-sm text-gray-500">Track & Hire</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-sm text-center sm:text-left">
              Centralize submissions, automate interviews, and gain team
              insights — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-20 mb-8">
            {/* Product */}
            <div className="text-center sm:text-left">
              <div className="font-medium text-white mb-3">Product</div>
              <ul className="text-sm space-y-2 text-gray-400">
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#integrations">Integrations</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="text-center sm:text-left">
              <div className="font-medium text-white mb-3">Company</div>
              <ul className="text-sm space-y-2 text-gray-400">
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#careers">Careers</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>
          </div>
          {/* Contact + Social */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
            <div className="font-medium text-white mb-1">Contact</div>
            <div className="text-sm text-gray-400 mb-2">
              support@hirebrix.app
            </div>

            <div className="flex gap-3 justify-center sm:justify-start">
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                <Twitter size={18} className="text-white" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                <Linkedin size={18} className="text-white" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                <Github size={18} className="text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center py-2 text-sm text-gray-500">
        © 2025 HireBrix · Terms · Privacy
      </div>
    </footer>
  );
}
