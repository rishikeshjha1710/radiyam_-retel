"use client";

import { useEffect, useState } from "react";
import { getUsersList } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    getUsersList().then((u) => {
      setUsers(u);
      setLoading(false);
    });
  }, []);

  if (authLoading || loading) return <div className="p-8">Loading users...</div>;
  if (!isAdmin) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900">User Management</h1>
        <p className="text-gray-500 font-medium">Overview of registered customers and administrators.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 font-black uppercase tracking-widest text-[10px] border-b border-gray-50">
                <th className="px-10 py-6">User</th>
                <th className="px-10 py-6">Role</th>
                <th className="px-10 py-6 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-black">
                        {user.email?.[0].toUpperCase() || "U"}
                      </div>
                      <span className="font-bold text-gray-900">{user.email || user.id}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {user.role || 'customer'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right text-gray-400 font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
