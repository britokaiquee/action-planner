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
        <section className={cn("flex min-h-[8.75rem] items-center px-4 pb-[18px] pt-10 text-white sm:min-h-[9.5rem] sm:px-6 sm:pb-[18px] sm:pt-11", isGestor ? "bg-gestor" : "bg-tecnico")}>
          <div className="mx-auto flex w-full max-w-[56.25rem] items-center gap-3">
            <Link
              aria-label="Voltar"
              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center text-white transition hover:text-white/90 sm:h-9 sm:w-9"
              href={isGestor ? "/gestor/login" : "/tecnico/login"}
            >
              <ArrowLeft className="h-6 w-6 sm:h-7 sm:w-7" />
            </Link>
            <h1 className="text-[1.35rem] font-medium leading-tight tracking-[-0.03em] sm:text-[1.55rem]">
              {isGestor ? "Cadastrar gestor" : "Cadastrar técnico"}
            </h1>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[56.25rem] px-5 pb-14 pt-10 sm:px-6">
          <RegisterForm role={role} />
        </section>
      </main>
    </PublicOnlyRoute>
  );
}