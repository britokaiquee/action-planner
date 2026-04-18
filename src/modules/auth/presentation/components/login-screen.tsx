"use client";

import { useEffect, useState } from "react";

import { RoleAccessCard } from "@/modules/auth/presentation/components/role-access-card";
import type { AuthRole } from "@/modules/auth/domain/entities";
import { LoginForm } from "@/modules/auth/presentation/components/login-form";
import { PublicOnlyRoute } from "@/modules/auth/presentation/components/route-guard";
import { cn } from "@/shared/lib/utils";

interface LoginScreenProps {
  role: AuthRole;
}

export function LoginScreen({ role }: LoginScreenProps) {
  const [visualRole, setVisualRole] = useState<AuthRole>(() => {
    if (typeof window === "undefined") {
      return role;
    }

    return (window.sessionStorage.getItem("action-planner-login-role") as AuthRole | null) ?? role;
  });

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (visualRole !== role) {
        setVisualRole(role);
      }
    });

    window.sessionStorage.setItem("action-planner-login-role", role);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [role, visualRole]);

  const isGestor = visualRole === "gestor";

  return (
    <PublicOnlyRoute>
      <main className={cn("flex min-h-screen flex-col transition-colors duration-500 ease-out", isGestor ? "bg-gestor" : "bg-tecnico")}>
        <section className="px-6 pb-32 pt-20 text-white sm:pb-36 sm:pt-20">
          <div className="mx-auto max-w-[48rem] space-y-4 text-center">
            <h1 className="text-[2.45rem] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[4rem]">Gestão de Ações</h1>
          </div>
        </section>

        <section className="-mt-[3.8rem] flex-1 rounded-t-[3.5rem] bg-white px-6 pb-8 pt-7 shadow-card sm:-mt-16 sm:pb-12 sm:pt-10">
          <div className="mx-auto flex h-full max-w-[48rem] flex-col">
            <div className="space-y-2.5 sm:space-y-4">
              <RoleAccessCard activeRole={role} href="/tecnico/login" role="tecnico" />
              <RoleAccessCard activeRole={role} href="/gestor/login" role="gestor" />
            </div>
            <div className="mt-3 sm:mt-4">
              <LoginForm key={role} role={role} visualRole={visualRole} />
            </div>
          </div>
        </section>
      </main>
    </PublicOnlyRoute>
  );
}