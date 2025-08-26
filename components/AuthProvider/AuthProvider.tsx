"use client";

import { useEffect, useState, ReactNode } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getCurrentUser } from "@/lib/api/serverApi";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    async function initializeAuth() {
      try {
        const sessionValid = await checkSession();
        if (sessionValid) {
          const user = await getCurrentUser();
          if (user) {
            setUser(user);
          } else {
            clearIsAuthenticated();
          }
        } else {
          clearIsAuthenticated();
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, [setUser, clearIsAuthenticated]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}
