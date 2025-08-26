"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { getSession } from "@/lib/api/clientApi";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getSession();
        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
          router.push("/sign-in");
        }
      } catch {
        clearIsAuthenticated();
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, setUser, clearIsAuthenticated]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}
