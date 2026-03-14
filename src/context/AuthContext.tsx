"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as fbSignOut, 
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type User,
  type ConfirmationResult
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, data: any) => Promise<any>;
  sendOtp: (phoneNumber: string, recaptchaContainerId: string) => Promise<ConfirmationResult>;
  confirmOtp: (confirmationResult: ConfirmationResult, code: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PHONES = [
  "+919570729077",
  "+917295893663"
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdToken();
        Cookies.set("auth_token", token, { expires: 7, secure: true, sameSite: 'strict' });
        
        // Admin status strictly via phone
        const isAdminUser = !!u.phoneNumber && ADMIN_PHONES.includes(u.phoneNumber.replace(/\s/g, ''));
        
        if (isAdminUser) {
          Cookies.set("admin_session", "true", { expires: 1, secure: true, sameSite: 'strict' });
        } else {
          Cookies.remove("admin_session");
        }
      } else {
        Cookies.remove("auth_token");
        Cookies.remove("admin_session");
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const isAdmin = !!user?.phoneNumber && ADMIN_PHONES.includes(user.phoneNumber.replace(/\s/g, ''));

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not configured");
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, userData: any) => {
    if (!auth) throw new Error("Firebase not configured");
    const { setUserProfile } = await import("@/lib/firestore");
    const result = await createUserWithEmailAndPassword(auth, email, userData.password);
    
    // Save full user details for delivery
    await setUserProfile(result.user.uid, {
      uid: result.user.uid,
      email: result.user.email,
      fullName: userData.fullName,
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      pincode: userData.pincode,
      role: "user",
      createdAt: Date.now()
    });
    return result;
  };

  const sendOtp = async (phoneNumber: string, recaptchaContainerId: string) => {
    if (!auth) throw new Error("Firebase not configured");
    const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: "invisible",
    });
    return signInWithPhoneNumber(auth, phoneNumber, verifier);
  };

  const confirmOtp = async (confirmationResult: ConfirmationResult, code: string) => {
    const { setUserProfile } = await import("@/lib/firestore");
    const result = await confirmationResult.confirm(code);
    if (result.user) {
      // Check if this is a known admin
      const stripped = result.user.phoneNumber?.replace(/\s/g, '') || "";
      const role = ADMIN_PHONES.includes(stripped) ? "admin" : "user";
      
      await setUserProfile(result.user.uid, {
        uid: result.user.uid,
        phone: result.user.phoneNumber,
        role: role,
        lastLogin: Date.now()
      });
    }
    return result;
  };

  const signOut = async () => {
    if (auth) {
      await fbSignOut(auth);
      Cookies.remove("auth_token");
      Cookies.remove("admin_session");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signUp, sendOtp, confirmOtp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
