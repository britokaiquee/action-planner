"use client";

import { useTransition } from "react";

import { useAuth } from "@/modules/auth/presentation/auth-provider";
import { ProtectedRoleRoute } from "@/modules/auth/presentation/components/route-guard";

export function GestorUnderConstructionScreen() {
  const { logout } = useAuth();
  const [isPending, startTransition] = useTransition();

  function handleBackToLogin() {
    startTransition(() => {
      logout();
      window.location.replace("/gestor/login");
    });
  }

  return (
    <ProtectedRoleRoute role="gestor">
      <main className="min-h-screen bg-background px-6 pt-20 text-center">
        <div className="mx-auto flex max-w-sm flex-col items-center gap-6">
          <h1 className="text-[1.75rem] font-medium tracking-[-0.03em] text-text-muted sm:text-[2rem]">Em construção</h1>

          <button
            className="text-[1.2rem] font-medium text-gestor underline decoration-gestor underline-offset-4 transition hover:text-gestor-dark disabled:opacity-60"
            disabled={isPending}
            onClick={handleBackToLogin}
            type="button"
          >
            Voltar ao login
          </button>
        </div>
      </main>
    </ProtectedRoleRoute>
  );
}