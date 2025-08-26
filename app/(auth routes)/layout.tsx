"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: ReactNode;
  layoutType: "sign-in" | "sign-up";
}

export default function AuthLayout({ children, layoutType }: AuthLayoutProps) {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      router.refresh();
    } catch (err: unknown) {
      setHasError(true);
      setErrorMessage(err instanceof Error ? err.message : String(err));
      console.error("AuthLayout error:", err);
    }
  }, [router]);

  if (hasError) {
    return (
      <div className={`${layoutType}-layout`}>
        <h2>Something went wrong.</h2>
        <pre>{errorMessage}</pre>
      </div>
    );
  }

  return <div className={`${layoutType}-layout`}>{children}</div>;
}
