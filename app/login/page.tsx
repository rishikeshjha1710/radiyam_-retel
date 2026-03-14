"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ADMIN_PHONES = [
  "+919570729077",
  "+917295893663"
];

export default function LoginPage() {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, sendOtp, confirmOtp } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Restriction: Phone Auth is for Admin Direct Access ONLY
    const strippedPhone = phone.replace(/\s/g, "");
    if (!ADMIN_PHONES.includes(strippedPhone)) {
      setError("SECURITY: This phone signature is restricted to Executive Admins. Please use the Email/ID tab.");
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(phone, "recaptcha-container");
      setConfirmationResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Ensure phone format is +91...");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await confirmOtp(confirmationResult, otp);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid Executive Verification Code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] py-12 px-6">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50 relative overflow-hidden">
        
        {/* Decorative flair */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-[60px] -mr-16 -mt-16 opacity-50"></div>

        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <Link href="/" className="w-14 h-14 bg-gray-900 text-white flex items-center justify-center rounded-2xl text-2xl font-black italic shadow-xl transform hover:rotate-6 transition-transform">
              R
            </Link>
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">
            RADIYAMI<span className="text-indigo-600">.</span>
          </h2>
          <p className="mt-3 text-sm font-medium text-gray-400">
            {method === 'email' ? 'Member authentication for premium selection' : 'EXCLUSIVE EXECUTIVE GATEWAY'}
          </p>
        </div>

        {/* Method Toggle */}
        <div className="flex p-1 bg-gray-50 rounded-2xl relative z-10 border border-gray-100">
          <button 
            type="button"
            onClick={() => { setMethod("email"); setError(""); setConfirmationResult(null); }}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            Customer Login
          </button>
          <button 
            type="button"
            onClick={() => { setMethod("phone"); setError(""); setConfirmationResult(null); }}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'phone' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
          >
            Executive Admin
          </button>
        </div>

        <div className="relative z-10">
          {method === "email" ? (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email-address" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Identifier / Email</label>
                  <input
                    id="email-address"
                    type="text"
                    required
                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all text-sm"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" unsafe-label-html="true" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Security Secret</label>
                  <input
                    id="password"
                    type="password"
                    required
                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Establish Member Session"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {!confirmationResult ? (
                <form className="space-y-6" onSubmit={handlePhoneSubmit}>
                  <div>
                    <label htmlFor="phone" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Admin Signature (Phone)</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all text-sm"
                      placeholder="+91 00000 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div id="recaptcha-container"></div>

                  {error && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">{error}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? "Dispatching OTP..." : "Request Admin Verification"}
                  </button>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={handleOtpSubmit}>
                  <div>
                    <label htmlFor="otp" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">6-Digit Verification Code</label>
                    <input
                      id="otp"
                      type="text"
                      required
                      className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-black text-gray-900 placeholder-gray-300 transition-all text-sm text-center tracking-[0.5em]"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>

                  {error && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">{error}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? "Establishing Link..." : "Unlock Dashboard"}
                  </button>
                  <button type="button" onClick={() => setConfirmationResult(null)} className="w-full text-center text-[10px] font-black tracking-widest text-gray-400 uppercase hover:text-indigo-600 transition-colors">
                    Back to Selection
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10">
          Not registered?{" "}
          <Link href="/signup" className="text-indigo-600 hover:underline">
            Register Collective
          </Link>
        </p>
      </div>
    </div>
  );
}
