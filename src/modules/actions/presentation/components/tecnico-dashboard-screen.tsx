"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { CalendarDays, UsersRound } from "lucide-react";

import { Button } from "@/shared/ui/button";

import { getTecnicoDashboard, type TecnicoDashboardViewModel } from "@/modules/actions/application/get-tecnico-dashboard";
import { listPendingDemoCheckouts, subscribeToPendingDemoCheckouts } from "@/modules/actions/infrastructure/demo-checkout-session";
import { actionRepository } from "@/modules/actions/infrastructure/mock-action-repository";
import { authDemoCredentials } from "@/modules/auth/infrastructure/auth.seed";
import { useAuth } from "@/modules/auth/presentation/auth-provider";
import { LogoutButton } from "@/modules/auth/presentation/components/logout-button";
import { ProtectedRoleRoute } from "@/modules/auth/presentation/components/route-guard";
import { PageShell } from "@/shared/layout/page-shell";
import { formatLongDateCapitalized } from "@/shared/lib/utils";

import { TecnicoDashboardEmptyState } from "./tecnico-dashboard-empty-state";
import { TecnicoDashboardLoading } from "./tecnico-dashboard-loading";
import { TecnicoScheduleCard } from "./tecnico-schedule-card";

const DEMO_DASHBOARD_DATE = new Date(2026, 3, 10);

export function TecnicoDashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [systemDate] = useState(() => new Date());
  const [dashboard, setDashboard] = useState<TecnicoDashboardViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDemoCheckouts, setPendingDemoCheckouts] = useState(() =>
    user?.email ? listPendingDemoCheckouts(user.email) : [],
  );

  const jobTitle = user?.jobTitle?.replace("Tecnico", "Técnico") ?? "Técnico de campo";
  const hasTodayAssignments = Boolean(dashboard?.todayAssignments.length);
  const isDemoTecnico = user?.email?.toLowerCase() === authDemoCredentials.tecnico.email.toLowerCase();
  const currentDate = isDemoTecnico ? DEMO_DASHBOARD_DATE : systemDate;

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      if (!user?.name) {
        setDashboard(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const nextDashboard = await getTecnicoDashboard(actionRepository, {
        currentDate,
        technicianName: user.name,
      });

      if (!isActive) {
        return;
      }

      setDashboard(nextDashboard);
      setIsLoading(false);
    }

    void loadDashboard();

    return () => {
      isActive = false;
    };
  }, [currentDate, user?.name]);

  useEffect(() => {
    if (!user?.email) {
      setPendingDemoCheckouts([]);
      return;
    }

    setPendingDemoCheckouts(listPendingDemoCheckouts(user.email));

    return subscribeToPendingDemoCheckouts(() => {
      setPendingDemoCheckouts(listPendingDemoCheckouts(user.email));
    });
  }, [user?.email]);

  function getAssignmentHref(actionId: string, date: string) {
    const pendingCheckout = pendingDemoCheckouts.find((item) => item.actionId === actionId && item.actionDate === date);

    if (pendingCheckout) {
      return `/tecnico/check-out/${actionId}?date=${date}&checkInAt=${encodeURIComponent(pendingCheckout.checkInAt)}`;
    }

    return `/tecnico/check-in/${actionId}?date=${date}`;
  }

  function getAssignmentStatusOverride(actionId: string, date: string) {
    const pendingCheckout = pendingDemoCheckouts.find((item) => item.actionId === actionId && item.actionDate === date);

    if (!pendingCheckout) {
      return null;
    }

    return {
      badgeLabel: "Em andamento",
      badgeTone: "info" as const,
    };
  }

  return (
    <ProtectedRoleRoute role="tecnico">
      <PageShell
        dateLabel={dashboard?.dateLabel ?? formatLongDateCapitalized(currentDate)}
        headerAction={<LogoutButton label="Sair da conta" />}
        headerClassName="min-h-[10.25rem] px-4 pb-[22px] pt-14 sm:min-h-[11rem] sm:px-6 sm:pb-[22px] sm:pt-16"
        metaLabel={user?.profileTag}
        subtitle={jobTitle}
        title={`Olá, ${dashboard?.technicianName ?? user?.name ?? "Técnico"}`}
        tone="tecnico"
      >
        {isLoading ? (
          <TecnicoDashboardLoading />
        ) : (
          <div className="space-y-10">
            {hasTodayAssignments ? (
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-text-strong">
                  <CalendarDays className="h-7 w-7 text-tecnico sm:h-9 sm:w-9" />
                  <h2 className="text-[1.68rem] font-semibold tracking-[-0.04em] sm:text-section-title">Minhas ações hoje</h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {dashboard?.todayAssignments.map((assignment) => (
                    <TecnicoScheduleCard
                      assignment={{
                        ...assignment,
                        ...getAssignmentStatusOverride(assignment.actionId, assignment.date),
                      }}
                      href={getAssignmentHref(assignment.actionId, assignment.date)}
                      key={assignment.id}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="space-y-4">
              <h2 className="text-[1.68rem] font-semibold tracking-[-0.04em] text-text-strong sm:text-section-title">Próximas ações</h2>

              {dashboard?.upcomingAssignments.length ? (
                <div className="space-y-4 sm:space-y-6">
                  {dashboard.upcomingAssignments.map((assignment) => (
                    <TecnicoScheduleCard
                      assignment={{
                        ...assignment,
                        ...getAssignmentStatusOverride(assignment.actionId, assignment.date),
                      }}
                      href={getAssignmentHref(assignment.actionId, assignment.date)}
                      key={assignment.id}
                    />
                  ))}
                </div>
              ) : (
                <TecnicoDashboardEmptyState description="Sem ações agendadas no momento" />
              )}
            </section>

            <Button className="h-14 min-h-14 justify-center gap-3 rounded-[1rem] px-5 text-[1.05rem] font-semibold shadow-button sm:mx-auto sm:flex sm:h-[3.5rem] sm:min-h-[3.5rem] sm:min-w-[12rem] sm:px-8 sm:text-[1.1rem]" onClick={() => router.push("/tecnico/equipe")} variant="secondary">
              <UsersRound className="h-6 w-6" />
              Equipe
            </Button>
          </div>
        )}
      </PageShell>
    </ProtectedRoleRoute>
  );
}