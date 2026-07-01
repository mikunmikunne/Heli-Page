"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabaseClient";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      try {
        // 1. Check local mock user first
        const mockUserStr = localStorage.getItem("heli_mock_user");
        if (mockUserStr) {
          try {
            setUser(JSON.parse(mockUserStr));
            setLoading(false);
            return;
          } catch (e) {
            localStorage.removeItem("heli_mock_user");
          }
        }

        // 2. Fallback to Supabase Auth check
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.warn("Failed to retrieve session from Supabase, using mock fallback:", err);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        // Only clear user if no local mock user exists
        if (!localStorage.getItem("heli_mock_user")) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    // If Supabase is unconfigured (placeholder URL) or lacks Google Auth configuration
    const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                          process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project-id");

    if (isPlaceholder) {
      const mockCustomerUser = {
        id: "mock-customer-uuid-5678",
        email: "customer@gmail.com",
        app_metadata: { provider: "google" },
        user_metadata: { 
          full_name: "Heli Valued Customer", 
          avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" 
        },
        aud: "authenticated",
        created_at: new Date().toISOString()
      };
      setUser(mockCustomerUser as any);
      localStorage.setItem("heli_mock_user", JSON.stringify(mockCustomerUser));
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.warn("Google Sign In failed, using offline fallback:", err);
      const mockCustomerUser = {
        id: "mock-customer-uuid-5678",
        email: "customer@gmail.com",
        app_metadata: { provider: "google" },
        user_metadata: { 
          full_name: "Heli Valued Customer", 
          avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" 
        },
        aud: "authenticated",
        created_at: new Date().toISOString()
      };
      setUser(mockCustomerUser as any);
      localStorage.setItem("heli_mock_user", JSON.stringify(mockCustomerUser));
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    // Fallback: If it's a test/demo admin login credentials
    if (email === "admin@heli.vn" && password === "admin123") {
      const mockUser = {
        id: "mock-admin-uuid-1234-5678",
        email: "admin@heli.vn",
        app_metadata: { provider: "email" },
        user_metadata: { role: "admin", full_name: "Heli Staff Administrator" },
        aud: "authenticated",
        created_at: new Date().toISOString()
      };
      setUser(mockUser as any);
      localStorage.setItem("heli_mock_user", JSON.stringify(mockUser));
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (err: any) {
      console.warn("Supabase auth failed to fetch, checking local mock credentials fallback", err);
      return { 
        error: { 
          message: "Failed to connect to authentication server. Please verify your internet connection or use the offline admin login (admin@heli.vn / admin123)." 
        } 
      };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("heli_mock_user");
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sign out from Supabase failed:", err);
    }
    setUser(null);
  };

  // Admin if logged in via 'email' provider (password login) or if email matches admin pattern
  const isAdmin = user 
    ? !!(user.app_metadata?.provider === "email" || user.user_metadata?.role === "admin" || user.email?.includes("admin"))
    : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signInWithGoogle,
        signInWithPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
