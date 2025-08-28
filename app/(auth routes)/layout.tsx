"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
  type?: "sign-in" | "sign-up";
}

export default function AuthLayout({ children, type }: LayoutProps) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  const layoutClass = type ? `${type}-layout` : "auth-layout";

  return <div className={layoutClass}>{children}</div>;
}
