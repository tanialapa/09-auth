"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.refresh();
  }, [pathname, router]);

  return <>{children}</>;
}
