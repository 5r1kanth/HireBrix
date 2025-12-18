import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@assets/colorlogo.png";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { NAVBAR } from "../../data/Landing";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <header className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl rounded-lg bg-white backdrop-blur px-6 lg:px-8 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src={Logo} alt="HireBrix" className="w-10 h-10 rounded-lg" />
          <div className="text-left">
            <div className="text-lg font-semibold">HireBrix</div>
            <div className="text-xs text-gray-500 -mt-0.5">Track & Hire</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {NAVBAR.navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-400 font-medium hover:text-gray-900 hover:underline transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg text-sm text-gray-700 font-medium border border-gray-400 hover:text-gray-900 hover:scale-105 transition-transform"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-tr from-[var(--electric-blue)] to-[var(--hiring-lime)] text-white shadow hover:scale-105 transition-transform"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--electric-blue)]"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="flex flex-col px-6 pt-4 pb-6 gap-4 text-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 font-medium hover:text-gray-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}

              {/* Mobile Buttons */}
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm text-gray-700 font-medium border border-gray-400 hover:text-gray-900 transition-transform w-full mx-auto"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-tr from-[var(--electric-blue)] to-[var(--hiring-lime)] text-white shadow hover:scale-105 transition-transform w-full mx-auto"
                onClick={() => setIsOpen(false)}
              >
                Start Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
