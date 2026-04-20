"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { ArrowLeft, Search, UsersRound } from "lucide-react";

import {
  getTecnicoActionParticipants,
  type TecnicoActionParticipantsViewModel,
} from "@/modules/actions/application/get-tecnico-action-participants";
import { actionRepository } from "@/modules/actions/infrastructure/mock-action-repository";
import { useAuth } from "@/modules/auth/presentation/auth-provider";
import { ProtectedRoleRoute } from "@/modules/auth/presentation/components/route-guard";

import { TecnicoTeamMemberCard } from "./tecnico-team-member-card";

interface TecnicoActionParticipantsScreenProps {
  actionId: string;
  actionDate?: string;
  origin?: "check-in" | "check-out";
  transientCheckInTimestamp?: string;
}

function TecnicoActionParticipantsLoading() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="h-[5rem] animate-pulse rounded-[1.1rem] border border-border bg-surface-muted shadow-card" key={index} />
      ))}
    </div>
  );
}

export function TecnicoActionParticipantsScreen({
  actionId,
  actionDate,
  origin = "check-in",
  transientCheckInTimestamp,
}: TecnicoActionParticipantsScreenProps) {
  const { user } = useAuth();
  const [participants, setParticipants] = useState<TecnicoActionParticipantsViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadParticipants() {
      if (!actionId) {
        if (isActive) {
          setParticipants(null);
          setIsLoading(false);
        }

        return;
      }

      setIsLoading(true);

      const nextParticipants = await getTecnicoActionParticipants(actionRepository, {
        actionId,
        currentUser: {
          name: user?.name,
          profileTag: user?.profileTag,
        },
      });

      if (!isActive) {
        return;
      }

      setParticipants(nextParticipants);
      setIsLoading(false);
    }

    void loadParticipants();

    return () => {
      isActive = false;
    };
  }, [actionId, user?.name, user?.profileTag]);

  const normalizedQuery = query
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const visibleMembers = (participants?.members ?? []).filter((member) => {
    if (!normalizedQuery) {
      return true;
    }

    const searchable = `${member.nameLabel} ${member.roleLabel}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });

  const backHref =
    origin === "check-out"
      ? actionDate
        ? `/tecnico/check-out/${actionId}?date=${actionDate}${transientCheckInTimestamp ? `&checkInAt=${encodeURIComponent(transientCheckInTimestamp)}` : ""}`
        : `/tecnico/check-out/${actionId}${transientCheckInTimestamp ? `?checkInAt=${encodeURIComponent(transientCheckInTimestamp)}` : ""}`
      : actionDate
        ? `/tecnico/check-in/${actionId}?date=${actionDate}`
        : `/tecnico/check-in/${actionId}`;

  return (
    <ProtectedRoleRoute role="tecnico">
      <div className="min-h-screen bg-background text-foreground">
        <header className="bg-tecnico text-white shadow-hero">
          <div className="mx-auto flex min-h-[8.75rem] w-full max-w-[56.25rem] items-center gap-3 px-4 pb-[18px] pt-10 sm:min-h-[9.5rem] sm:px-6 sm:pb-[18px] sm:pt-11">
            <Link
              aria-label={origin === "check-out" ? "Voltar para o check-out" : "Voltar para o check-in"}
              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center text-white transition hover:text-white/90 sm:h-9 sm:w-9"
              href={backHref}
            >
              <ArrowLeft className="h-6 w-6 sm:h-7 sm:w-7" />
            </Link>

            <div className="min-w-0">
              <h1 className="text-[1.35rem] font-medium leading-tight tracking-[-0.03em] sm:text-[1.55rem]">Participantes</h1>
              <p className="mt-1 truncate text-[0.98rem] leading-snug text-white/90 sm:text-[1.12rem]">
                {participants?.actionTitle ?? "Ação"}
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-[56.25rem] flex-col px-4 pb-6 pt-4 sm:px-6 sm:pb-8">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#667085]" />
            <input
              className="h-14 w-full rounded-[1.75rem] border border-border bg-card pl-14 pr-4 text-[1.05rem] text-text-strong shadow-card outline-none transition placeholder:text-[#98A2B3] focus:border-tecnico-outline focus:ring-2 focus:ring-tecnico/15"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar participante..."
              type="search"
              value={query}
            />
          </label>

          <section className="mt-4 flex flex-1 flex-col">
            {isLoading ? (
              <TecnicoActionParticipantsLoading />
            ) : visibleMembers.length ? (
              <div className="space-y-3">
                {visibleMembers.map((member) => (
                  <TecnicoTeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.35rem] border border-border bg-card px-5 py-8 text-center shadow-card">
                <UsersRound className="mx-auto h-8 w-8 text-[#98A2B3]" />
                <p className="mt-3 text-[1.05rem] font-semibold tracking-[-0.03em] text-text-strong">Nenhum participante encontrado</p>
                <p className="mt-2 text-[0.94rem] text-text-muted">Ajuste a busca para localizar pelo nome ou função.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </ProtectedRoleRoute>
  );
}