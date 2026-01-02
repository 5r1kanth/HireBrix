import React, { useState } from "react";
import SignupDashboardMock from "../Dashboard/SignupDashboardMock";
import { signup } from "@/api/auth.api";
import { useToast } from "@/context/ToastContext";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    companyName: "",
  });

  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const capitalize = (str) =>
    str
      ?.trim()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const companyId = "";

    const payload = {
      companyName: formData.companyName,
      email: formData.email.trim(),
      firstName: capitalize(formData.firstName).trim(),
      middleName: capitalize(formData.middleName).trim(),
      lastName: capitalize(formData.lastName).trim(),
    };

    try {
      const result = await signup(payload);
      console.log("sugnup.jsx - ", result.success);
      if (result?.success === false) {
        toast.error(result?.message || "Signup failed.");
        return;
      }

      toast.success(result?.message || "Signup successful! Check your email.");
    } catch (error) {
      toast.error(error?.message || "Signup failed. Please try again.");
    }
    // TODO: call signup API here
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SECTION */}
      <div className="w-3/5 electric-blue text-white flex flex-col justify-between h-screen relative overflow-hidden">
        {/* BRANDING + TEXT */}
        <div className="w-full text-left pt-14 pl-32 pr-10 flex flex-col z-10">
          <h1
            className="text-6xl font-extrabold tracking-tight mb-3
                         bg-gradient-to-r from-[var(--hiring-lime)]
                         to-[var(--electric-blue)] text-transparent bg-clip-text">
            HireBrix
          </h1>

          <span className="text-2xl font-medium opacity-90 -mt-1 tracking-wide">Track & Hire</span>

          <p className="mt-6 text-white opacity-90 text-sm sm:text-base leading-relaxed max-w-md">
            Bring complete visibility to your consultant lifecycle — from onboarding to submissions, interviews, performance tracking, and successful placements.
          </p>
        </div>

        {/* Dashboard Mock */}
        <div className="absolute -bottom-24 left-24 z-0">
          <SignupDashboardMock />
        </div>
      </div>

      {/* RIGHT SECTION - SIGNUP FORM */}
      <div className="w-2/5 bg-white flex items-center justify-center px-14 relative">
        {/* Soft BG Accents */}
        <div
          className="absolute -top-16 -right-20 w-52 h-52 
                        bg-gradient-to-br from-blue-200 to-purple-200
                        rounded-full opacity-20 blur-[80px]"></div>
        <div
          className="absolute -bottom-24 -left-14 w-72 h-72
                        bg-gradient-to-tr from-pink-200 to-yellow-200
                        rounded-full opacity-20 blur-[80px]"></div>

        <div className="w-full max-w-md relative z-10">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Create Your Account</h2>
          <p className="text-gray-500 text-sm mb-8">Join now and start managing your business efficiently.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First + Middle + Last Name */}
            <div className="flex gap-3">
              {/* First */}
              <div className="relative w-1/3">
                <input
                  type="text"
                  name="firstName"
                  placeholder=" "
                  required
                  className="peer w-full p-3 border-b-2 border-gray-300 
                             focus:border-[var(--electric-blue)]
                             outline-none transition"
                  onChange={handleChange}
                />
                <label
                  className="absolute left-0 text-gray-500 text-sm
                                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                                   peer-focus:-top-3 peer-focus:text-sm
                                   peer-focus:text-gray-700 top-0
                                   pointer-events-none transition-all">
                  First Name
                </label>
              </div>

              {/* Middle */}
              <div className="relative w-1/3">
                <input
                  type="text"
                  name="middleName"
                  placeholder=" "
                  className="peer w-full p-3 border-b-2 border-gray-300 
                             focus:border-[var(--electric-blue)]
                             outline-none transition"
                  onChange={handleChange}
                />
                <label
                  className="absolute left-0 text-gray-500 text-sm
                                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                                   peer-focus:-top-3 peer-focus:text-sm
                                   peer-focus:text-gray-700 top-0
                                   pointer-events-none transition-all">
                  Middle
                </label>
              </div>

              {/* Last */}
              <div className="relative w-1/3">
                <input
                  type="text"
                  name="lastName"
                  placeholder=" "
                  required
                  className="peer w-full p-3 border-b-2 border-gray-300 
                             focus:border-[var(--electric-blue)]
                             outline-none transition"
                  onChange={handleChange}
                />
                <label
                  className="absolute left-0 text-gray-500 text-sm
                                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                                   peer-focus:-top-3 peer-focus:text-sm
                                   peer-focus:text-gray-700 top-0
                                   pointer-events-none transition-all">
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
                className="peer w-full p-3 border-b-2 border-gray-300 
                           focus:border-[var(--electric-blue)]
                           outline-none transition"
                onChange={handleChange}
              />
              <label
                className="absolute left-0 text-gray-500 text-sm
                                 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                                 peer-focus:-top-3 peer-focus:text-sm
                                 peer-focus:text-gray-700 top-0
                                 pointer-events-none transition-all">
                Work Email
              </label>
            </div>

            {/* Company */}
            <div className="relative">
              <input
                type="text"
                name="companyName"
                placeholder=" "
                required
                className="peer w-full p-3 border-b-2 border-gray-300 
                           focus:border-[var(--electric-blue)]
                           outline-none transition"
                onChange={handleChange}
              />
              <label
                className="absolute left-0 text-gray-500 text-sm
                                 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                                 peer-focus:-top-3 peer-focus:text-sm
                                 peer-focus:text-gray-700 top-0
                                 pointer-events-none transition-all">
                Company Name
              </label>
            </div>

            {/* Submit */}
            <button
              className="w-full py-3 mt-2 font-semibold rounded-md text-white
                         bg-gradient-to-tr from-[var(--electric-blue)] to-[var(--hiring-lime)]
                         hover:scale-[1.03] active:scale-100 transition-transform shadow-md">
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
      {/* <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, show: false }))} /> */}
    </div>
  );
}
