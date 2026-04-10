import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { AuthRole } from "@/modules/auth/domain/entities";
import { PublicOnlyRoute } from "@/modules/auth/presentation/components/route-guard";
import { RegisterForm } from "@/modules/auth/presentation/components/register-form";
import { cn } from "@/shared/lib/utils";

interface RegisterScreenProps {
  role: AuthRole;
}

export function RegisterScreen({ role }: RegisterScreenProps) {
  const isGestor = role === "gestor";

  return (
    <PublicOnlyRoute>
      <main className="min-h-screen bg-background">
        <section className={cn("px-6 py-6 text-white", isGestor ? "bg-gestor" : "bg-tecnico")}>
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <Link
              aria-label="Voltar"
              className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
              href={isGestor ? "/gestor/login" : "/tecnico/login"}
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-[1.35rem] font-semibold leading-tight sm:text-2xl">
              {isGestor ? "Cadastrar Gestor" : "Cadastrar T\u00e9cnico"}
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 pb-14 pt-8 sm:px-6">
          <RegisterForm role={role} />
        </section>
      </main>
    </PublicOnlyRoute>
  );
}