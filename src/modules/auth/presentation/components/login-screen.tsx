import { RoleAccessCard } from "@/modules/auth/presentation/components/role-access-card";
import type { AuthRole } from "@/modules/auth/domain/entities";
import { LoginForm } from "@/modules/auth/presentation/components/login-form";
import { PublicOnlyRoute } from "@/modules/auth/presentation/components/route-guard";

interface LoginScreenProps {
  role: AuthRole;
}

export function LoginScreen({ role }: LoginScreenProps) {
  return (
    <PublicOnlyRoute>
      <main className="min-h-screen bg-tecnico">
        <section className="px-6 pb-32 pt-16 text-white sm:pb-36 sm:pt-20">
          <div className="mx-auto max-w-[48rem] space-y-4 text-center">
            <h1 className="text-[1.75rem] font-medium leading-tight tracking-[-0.03em] sm:text-[4rem]">Gestão de Ações</h1>
            <p className="text-[0.9rem] text-white/85 sm:text-[1.35rem]">Selecione o tipo de acesso</p>
          </div>
        </section>

        <section className="-mt-12 rounded-t-[3rem] bg-white px-6 pb-14 pt-8 shadow-card sm:-mt-16 sm:pb-16 sm:pt-10">
          <div className="mx-auto max-w-[48rem]">
            <div className="space-y-3 sm:space-y-4">
              <RoleAccessCard activeRole={role} href="/tecnico/login" role="tecnico" />
              <RoleAccessCard activeRole={role} href="/gestor/login" role="gestor" />
            </div>
            <div className="mt-6 sm:mt-8">
              <LoginForm role={role} />
            </div>
          </div>
        </section>
      </main>
    </PublicOnlyRoute>
  );
}