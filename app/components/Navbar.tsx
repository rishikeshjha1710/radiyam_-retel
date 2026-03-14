"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const { items } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Don't show regular nav on admin pages to keep it clean
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? "py-4" : "py-8"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-center justify-between px-4 md:px-8 py-3 md:py-4 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-500 ${
          scrolled 
            ? "bg-white/80 backdrop-blur-2xl shadow-xl shadow-gray-100 border border-white/20" 
            : "bg-transparent"
        }`}>
          <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-indigo-200">
               <span className="text-white font-black text-lg md:text-xl italic">R</span>
            </div>
            <span className={`text-base md:text-2xl font-black tracking-tighter transition-colors hidden sm:block ${
              scrolled ? "text-gray-900" : (pathname === "/" ? "text-white" : "text-gray-900")
            }`}>
              RADIYAMI<span className="text-indigo-600">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {[
              { label: "Home Essentials", href: "/products" },
              { label: "Cleaning Luxe", href: "/products" },
              { label: "Premium Care", href: "/products" }
            ].map((link) => (
              <Link 
                key={link.label}
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-indigo-600 ${
                  scrolled ? "text-gray-500" : (pathname === "/" ? "text-white/70" : "text-gray-500")
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {isAdmin && (
              <Link 
                href="/admin"
                className={`px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                  isAdminPage 
                    ? "bg-indigo-600 text-white shadow-lg" 
                    : (scrolled ? "bg-gray-100 text-gray-900" : "bg-white/10 text-white backdrop-blur-md")
                }`}
              >
                Console
              </Link>
            )}

            <Link href="/checkout" className="relative group">
              <div className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-all ${
                scrolled ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : "bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-indigo-600 text-white text-[8px] md:text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <button 
                onClick={() => signOut()}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-all ${
                  scrolled ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                } shadow-lg hover:scale-105 active:scale-95`}
                title="Sign Out"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                 </svg>
              </button>
            ) : (
              <Link 
                href="/login"
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                  scrolled ? "bg-gray-900 text-white shadow-xl shadow-gray-200" : "bg-white text-gray-900 shadow-xl shadow-white/10"
                } hover:-translate-y-0.5 active:translate-y-0`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
