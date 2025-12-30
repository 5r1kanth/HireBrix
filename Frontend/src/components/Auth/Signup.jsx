import React, { useState } from "react";
import SignupDashboardMock from "../Dashboard/SignupDashboardMock";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    companyName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup Data: ", formData);
    // TODO: call signup API here
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SECTION */}
      <div className="w-3/5 electric-blue text-white flex flex-col justify-between h-screen relative overflow-hidden">
        {/* TEXT BLOCK */}
        <div className="w-full text-left pt-2 pb-10 pl-40 h-full flex flex-col justify-center">
          <h1 className="w-full text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-[var(--hiring-lime)] to-[var(--electric-blue)] text-transparent bg-clip-text">
            HireBrix
          </h1>
          <span className="block text-3xl font-medium opacity-95 -mt-6">Track & Hire</span>

          <p className="mt-4 text-white text-xs sm:text-sm md:text-base leading-relaxed max-w-md mb-10">
            Bring complete visibility to your consultant lifecycle — from onboarding to submissions, interviews, performance tracking, and successful placements.
          </p>
        </div>

        {/* DASHBOARD MOCK AT BOTTOM */}
        <div className="relative">
          <SignupDashboardMock />
        </div>
      </div>

      {/* RIGHT SECTION - SIGNUP FORM */}
      <div className="w-2/5 flex items-center justify-center px-12 bg-white relative overflow-hidden">
        {/* Subtle background shapes */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-gradient-to-tr from-pink-200 to-yellow-200 rounded-full opacity-15 blur-3xl"></div>

        <div className="w-full max-w-md relative z-10">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Create Your Account</h2>
          <p className="text-gray-500 mb-6 text-sm">Join now and start managing your business efficiently.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First + Last Name */}
            <div className="flex gap-3">
              <div className="w-1/2 relative">
                <input
                  type="text"
                  name="firstName"
                  placeholder=" "
                  onChange={handleChange}
                  required
                  className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none peer transition"
                />
                <label
                  className="
            absolute left-0 -top-3 text-gray-500 text-sm transition-all
            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
            peer-focus:-top-3 peer-focus:text-gray-500 peer-focus:text-sm
            pointer-events-none
          ">
                  First Name
                </label>
              </div>

              <div className="w-1/2 relative">
                <input
                  type="text"
                  name="lastName"
                  placeholder=" "
                  onChange={handleChange}
                  required
                  className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none peer transition"
                />
                <label
                  className="
            absolute left-0 -top-3 text-gray-500 text-sm transition-all
            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
            peer-focus:-top-3 peer-focus:text-gray-500 peer-focus:text-sm
            pointer-events-none
          ">
                  Last Name
                </label>
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder=" "
                required
                onChange={handleChange}
                className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none peer transition"
              />
              <label
                className="
          absolute left-0 -top-3 text-gray-500 text-sm transition-all
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
          peer-focus:-top-3 peer-focus:text-gray-500 peer-focus:text-sm
          pointer-events-none
        ">
                Email Address
              </label>
            </div>

            {/* Company */}
            <div className="relative">
              <input
                type="text"
                name="companyName"
                placeholder=" "
                required
                onChange={handleChange}
                className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none peer transition"
              />
              <label
                className="
          absolute left-0 -top-3 text-gray-500 text-sm transition-all
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
          peer-focus:-top-3 peer-focus:text-gray-500 peer-focus:text-sm
          pointer-events-none
        ">
                Company Name
              </label>
            </div>

            <button className="w-full py-3 bg-gradient-to-tr from-[var(--electric-blue)] to-[var(--hiring-lime)] text-white rounded-md font-semibold hover:scale-105 transform transition">
              Sign Up
            </button>
          </form>

          <p className="text-sm mt-5 text-gray-500 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
