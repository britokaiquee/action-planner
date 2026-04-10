"use client";

import type { AuthRole } from "@/modules/auth/domain/entities";
import { LogoutButton } from "@/modules/auth/presentation/components/logout-button";
import { ProtectedRoleRoute } from "@/modules/auth/presentation/components/route-guard";
import { useAuth } from "@/modules/auth/presentation/auth-provider";
import { PageShell } from "@/shared/layout/page-shell";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";

interface ProtectedRoleHomeProps {
  role: AuthRole;
}

const roleCopy: Record<AuthRole, { title: string; subtitle: string; helper: string }> = {
  gestor: {
    title: "Painel do Gestor",
    subtitle: "Acompanhe sua sessao ativa e siga para os fluxos operacionais do planejamento.",
    helper: "Acesso autenticado para coordenacao e configuracao de acoes.",
  },
  tecnico: {
    title: "Painel do Tecnico",
    subtitle: "Confira sua sessao ativa e siga para os registros de execucao em campo.",
    helper: "Acesso autenticado para operacao, check-in e check-out.",
  },
};

export function ProtectedRoleHome({ role }: ProtectedRoleHomeProps) {
  const { user } = useAuth();
  const copy = roleCopy[role];

  return (
    <ProtectedRoleRoute role={role}>
      <PageShell headerAction={<LogoutButton />} subtitle={copy.subtitle} title={copy.title} tone={role}>
        <Card>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={role === "gestor" ? "success" : "info"}>Sessao ativa</Badge>
              <p className="text-sm font-medium text-[#607086]">{copy.helper}</p>
            </div>

            <div className="space-y-1">
              <h2 className="text-[1.35rem] font-semibold text-[#172033]">{user?.name}</h2>
              <p className="text-[0.98rem] text-[#607086]">{user?.email}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBlock label="Perfil" value={role === "gestor" ? "Gestor" : "Tecnico"} />
              <InfoBlock label={role === "gestor" ? "Departamento" : "Funcao"} value={user?.department ?? user?.jobTitle ?? "Nao informado"} />
              <InfoBlock label="Telefone" value={user?.phone ?? "Nao informado"} />
              <InfoBlock label="CPF" value={user?.cpf ?? "Nao informado"} />
            </div>
          </CardContent>
        </Card>
      </PageShell>
    </ProtectedRoleRoute>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-border bg-[#f8fafc] px-4 py-4">
      <p className="text-[0.85rem] font-semibold uppercase tracking-[0.08em] text-[#7f8a9d]">{label}</p>
      <p className="mt-2 text-[1rem] font-medium text-[#1a2233]">{value}</p>
    </div>
  );
}
