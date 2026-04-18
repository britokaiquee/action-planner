"use client";

import { startTransition, useEffect, useState } from "react";

import Link from "next/link";
import { ArrowLeft, LogOut, Search } from "lucide-react";

import { getTecnicoTeam, type TecnicoTeamViewModel } from "@/modules/actions/application/get-tecnico-team";
import { actionRepository } from "@/modules/actions/infrastructure/mock-action-repository";
import { useAuth } from "@/modules/auth/presentation/auth-provider";
import { ProtectedRoleRoute } from "@/modules/auth/presentation/components/route-guard";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import { TecnicoTeamMemberCard } from "./tecnico-team-member-card";

function TecnicoTeamLoading() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="h-[5rem] animate-pulse rounded-[1.1rem] border border-border bg-surface-muted shadow-card" key={index} />
      ))}
    </div>
  );
}

export function TecnicoTeamScreen() {
  const { user } = useAuth();
  const [team, setTeam] = useState<TecnicoTeamViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [hasLeftTeam, setHasLeftTeam] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadTeam() {
      setIsLoading(true);

      const nextTeam = await getTecnicoTeam(actionRepository, {
        currentUser: {
          name: user?.name,
          jobTitle: user?.jobTitle,
          profileTag: user?.profileTag,
        },
      });

      if (!isActive) {
        return;
      }

  setTeam(nextTeam);
      setHasLeftTeam(false);
      setIsLoading(false);
    }

    void loadTeam();

    return () => {
      isActive = false;
    };
  }, [user?.jobTitle, user?.name, user?.profileTag]);

  const normalizedQuery = query
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const visibleMembers = (team?.members ?? []).filter((member) => {
    if (hasLeftTeam && member.isCurrentUser) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchable = `${member.nameLabel} ${member.roleLabel}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });

  function handleLeaveTeam() {
    if (hasLeftTeam) {
      return;
    }

    startTransition(() => {
      setHasLeftTeam(true);
    });
  }

  return (
    <ProtectedRoleRoute role="tecnico">
      <div className="min-h-screen bg-background text-foreground">
        <header className="bg-tecnico text-white shadow-hero">
          <div className="mx-auto flex min-h-[8.75rem] w-full max-w-[56.25rem] items-center gap-3 px-4 pb-[18px] pt-10 sm:min-h-[9.5rem] sm:px-6 sm:pb-[18px] sm:pt-11">
            <Link
              aria-label="Voltar para o dashboard técnico"
              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center text-white transition hover:text-white/90 sm:h-9 sm:w-9"
              href="/tecnico"
            >
              <ArrowLeft className="h-6 w-6 sm:h-7 sm:w-7" />
            </Link>

            <h1 className="text-[1.35rem] font-medium leading-tight tracking-[-0.03em] sm:text-[1.55rem]">Equipe</h1>
          </div>
        </header>

        <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-[56.25rem] flex-col px-4 pb-6 pt-4 sm:px-6 sm:pb-8">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#667085]" />
            <input
              className="h-14 w-full rounded-[1.75rem] border border-border bg-card pl-14 pr-4 text-[1.05rem] text-text-strong shadow-card outline-none transition placeholder:text-[#98A2B3] focus:border-tecnico-outline focus:ring-2 focus:ring-tecnico/15"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar por nome ou função..."
              type="search"
              value={query}
            />
          </label>

          <section className="mt-4 flex flex-1 flex-col">
            {isLoading ? (
              <TecnicoTeamLoading />
            ) : visibleMembers.length ? (
              <div className="space-y-3">
                {visibleMembers.map((member) => (
                  <TecnicoTeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.35rem] border border-border bg-card px-5 py-6 text-center shadow-card">
                <p className="text-[1.05rem] font-semibold tracking-[-0.03em] text-text-strong">Nenhum integrante encontrado</p>
                <p className="mt-2 text-[0.94rem] text-text-muted">Ajuste a busca para localizar por nome ou função.</p>
              </div>
            )}
          </section>

          <Button
            className={cn(
              "mt-6 h-14 min-h-14 justify-center gap-3 rounded-[1rem] px-5 text-[1.05rem] font-semibold shadow-button sm:mx-auto sm:flex sm:h-[3.5rem] sm:min-h-[3.5rem] sm:min-w-[12rem] sm:px-8 sm:text-[1.1rem]",
              hasLeftTeam ? "bg-danger/80" : undefined,
            )}
            disabled={hasLeftTeam}
            onClick={handleLeaveTeam}
            variant="danger"
          >
            <LogOut className="h-6 w-6" />
            {hasLeftTeam ? "Saída registrada" : "Sair da equipe"}
          </Button>
        </main>
      </div>
    </ProtectedRoleRoute>
  );
}