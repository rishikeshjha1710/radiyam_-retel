import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "./components/ClientProviders";
import Navbar from "./components/Navbar";
import Link from "next/link"; // Added Link import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RADIYAMI. | Premium Household Excellence",
  description: "Curated collection of luxury household essentials and cleaning masterpieces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#fafafa] selection:bg-indigo-100 selection:text-indigo-900`}>
        <ClientProviders>
          <Navbar />
          <main className="min-h-screen pt-20">
            {children}
          </main>
          
          <footer className="bg-white border-t border-gray-100 py-20 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
               <div>
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm">
                      <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
                   </div>
                   <h2 className="text-2xl font-black tracking-tighter">RADIYAMI<span className="text-indigo-600">.</span></h2>
                </div>
                  <p className="text-gray-400 font-medium max-w-xs leading-relaxed text-sm">
                    Elevating your living space with premium household solutions and artisanal home care.
                  </p>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                  <div className="space-y-4">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Essentials</h3>
                     <ul className="space-y-2 text-sm font-bold text-gray-700">
                        <li><Link href="/products" className="hover:text-indigo-600 transition-colors">Cleaning</Link></li>
                        <li><Link href="/products" className="hover:text-indigo-600 transition-colors">Kitchen</Link></li>
                        <li><Link href="/products" className="hover:text-indigo-600 transition-colors">Home Care</Link></li>
                     </ul>
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Meta</h3>
                     <ul className="space-y-2 text-sm font-bold text-gray-700">
                        <li><Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin Console</Link></li>
                        <li><Link href="/login" className="hover:text-indigo-600 transition-colors">Account</Link></li>
                     </ul>
                  </div>
               </div>
            </div>
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">© 2024 RADIYAMI RETEL MULTITUDE OPC PVT LTD. ALL RIGHTS RESERVED.</p>
               <div className="flex gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <a href="#" className="hover:text-indigo-600">Privacy</a>
                  <a href="#" className="hover:text-indigo-600">Terms</a>
               </div>
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
