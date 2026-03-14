"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut, type User } from "firebase/auth";
import { auth } from "./firebase";

const ADMIN_EMAILS = (typeof process.env.NEXT_PUBLIC_ADMIN_EMAILS === "string"
  ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
  : []) as string[];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not configured");
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (auth) await fbSignOut(auth);
  };

  return { user, loading, isAdmin, signIn, signOut };
}
