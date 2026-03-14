"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading, isAdmin, signOut } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 p-12 max-w-md w-full text-center border border-gray-50">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-8V7m0 0a2 2 0 100-4 2 2 0 000 4zm0 0v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase mb-3">Access Restricted</h1>
          <p className="text-gray-400 font-medium mb-8">Professional credentials required to access the Radiyami Command Center.</p>
          <Link
            href="/admin/login"
            className="inline-block w-full bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const nav = [
    { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/admin/products", label: "Inventory", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { href: "/admin/add-product", label: "Ship Piece", icon: "M12 4v16m8-8H4" },
    { href: "/admin/orders", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { href: "/admin/users", label: "Team", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 flex">
      {/* Premium Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col p-8 fixed h-full z-50">
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-3 group">
             <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:rotate-6 transition-all">
                <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
             </div>
             <span className="text-xl font-black tracking-tighter italic">RADIYAMI<span className="text-indigo-600">.</span></span>
          </Link>
          <div className="mt-6 p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100">
             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-black italic shadow-sm">ID</div>
             <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security Key</p>
                <p className="text-xs font-bold text-gray-900 truncate">{user.email}</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {nav.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                pathname === href
                  ? "bg-gray-900 text-white shadow-2xl shadow-gray-200"
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={icon} />
               </svg>
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-8 border-t border-gray-50">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
             </svg>
            End Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-80 min-h-screen">
         <div className="p-8">
            <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100 min-h-[calc(100vh-4rem)]">
               {children}
            </div>
         </div>
      </main>
    </div>
  );
}
