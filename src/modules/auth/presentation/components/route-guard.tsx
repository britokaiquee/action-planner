"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import type { AuthRole } from "@/modules/auth/domain/entities";
import { useAuth } from "@/modules/auth/presentation/auth-provider";
import { AuthLoadingState } from "@/modules/auth/presentation/components/auth-loading-state";

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated, role } = useAuth();

  useEffect(() => {
    if (isHydrated && isAuthenticated && role) {
      window.location.replace(`/${role}`);
    }
  }, [isAuthenticated, isHydrated, role]);

  if (!isHydrated || isAuthenticated) {
    return <AuthLoadingState />;
  }

  return <>{children}</>;
}

export function ProtectedRoleRoute({ children, role: requiredRole }: { children: ReactNode; role: AuthRole }) {
  const { isAuthenticated, isHydrated, role } = useAuth();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      window.location.replace(`/${requiredRole}/login`);
      return;
    }

    if (role && role !== requiredRole) {
      window.location.replace(`/${role}`);
    }
  }, [isAuthenticated, isHydrated, requiredRole, role]);

  if (!isHydrated || !isAuthenticated || role !== requiredRole) {
    return <AuthLoadingState />;
  }

  return <>{children}</>;
}
