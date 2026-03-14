"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signUp(form.email, form);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] py-16 px-6">
      <div className="max-w-2xl w-full space-y-10 bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 relative overflow-hidden">
        
        {/* Decorative flair */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-[70px] -mr-20 -mt-20 opacity-60"></div>

        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <Link href="/" className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center rounded-2xl text-2xl font-black italic shadow-2xl transform hover:scale-110 transition-transform">
              R
            </Link>
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">
            CREATE YOUR PROFILE<span className="text-indigo-600">.</span>
          </h2>
          <p className="mt-3 text-sm font-medium text-gray-400">
            Provide your details for a seamless delivery experience
          </p>
        </div>

        <form className="mt-10 space-y-8 relative z-10" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Delivery Name</label>
              <input
                name="fullName"
                type="text"
                required
                className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all text-sm"
                placeholder="Johnathan Doe"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all text-sm"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Contact Number</label>
              <input
                name="phone"
                type="tel"
                required
                className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all text-sm"
                placeholder="+91 99999 00000"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Access Secret</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all text-sm"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Confirm Secret</label>
              <input
                name="confirmPassword"
                type="password"
                required
                className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all text-sm"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Street Address</label>
              <textarea
                name="address"
                required
                rows={3}
                className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all text-sm"
                placeholder="House No, Building, Area Name..."
                value={form.address}
                onChange={handleChange}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">City / Region</label>
              <input
                name="city"
                type="text"
                required
                className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all text-sm"
                placeholder="Mumbai"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Pincode</label>
              <input
                name="pincode"
                type="text"
                required
                className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all text-sm"
                placeholder="110001"
                value={form.pincode}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-6 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Initializing Profile..." : "Complete Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10">
          Existing member?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Member Access
          </Link>
        </p>
      </div>
    </div>
  );
}
