"use client";

import { useEffect, useState } from "react";

import { CalendarDays } from "lucide-react";

import { getTecnicoDashboard, type TecnicoDashboardViewModel } from "@/modules/actions/application/get-tecnico-dashboard";
import { actionRepository } from "@/modules/actions/infrastructure/mock-action-repository";
import { useAuth } from "@/modules/auth/presentation/auth-provider";
import { LogoutButton } from "@/modules/auth/presentation/components/logout-button";
import { ProtectedRoleRoute } from "@/modules/auth/presentation/components/route-guard";
import { PageShell } from "@/shared/layout/page-shell";
import { formatLongDateTitleCase } from "@/shared/lib/utils";

import { TecnicoDashboardEmptyState } from "./tecnico-dashboard-empty-state";
import { TecnicoDashboardLoading } from "./tecnico-dashboard-loading";
import { TecnicoScheduleCard } from "./tecnico-schedule-card";

const REFERENCE_DASHBOARD_DATE = new Date(2026, 3, 6);

export function TecnicoDashboardScreen() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<TecnicoDashboardViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const jobTitle = user?.jobTitle?.replace("Tecnico", "Técnico") ?? "Técnico de campo";

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
        currentDate: REFERENCE_DASHBOARD_DATE,
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
  }, [user?.name]);

  return (
    <ProtectedRoleRoute role="tecnico">
      <PageShell
        dateLabel={dashboard?.dateLabel ?? formatLongDateTitleCase(REFERENCE_DASHBOARD_DATE)}
        headerAction={<LogoutButton label="Sair da conta" />}
        subtitle={jobTitle}
        title={`Olá, ${dashboard?.technicianName ?? user?.name ?? "Técnico"}`}
        tone="tecnico"
      >
        {isLoading ? (
          <TecnicoDashboardLoading />
        ) : (
          <div className="space-y-10">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-text-strong">
                <CalendarDays className="h-7 w-7 text-tecnico sm:h-9 sm:w-9" />
                <h2 className="text-[1.68rem] font-semibold tracking-[-0.04em] sm:text-section-title">Minhas Ações Hoje</h2>
              </div>

              {dashboard?.todayAssignments.length ? (
                <div className="space-y-4 sm:space-y-6">
                  {dashboard.todayAssignments.map((assignment) => (
                    <TecnicoScheduleCard assignment={assignment} key={assignment.id} />
                  ))}
                </div>
              ) : (
                <TecnicoDashboardEmptyState
                  description="Quando houver uma ação prevista para hoje, ela aparecerá aqui."
                  title="Nenhuma ação para hoje"
                />
              )}
            </section>

            <section className="space-y-4">
              <h2 className="text-[1.68rem] font-semibold tracking-[-0.04em] text-text-strong sm:text-section-title">Próximas Ações</h2>

              {dashboard?.upcomingAssignments.length ? (
                <div className="space-y-4 sm:space-y-6">
                  {dashboard.upcomingAssignments.map((assignment) => (
                    <TecnicoScheduleCard assignment={assignment} key={assignment.id} />
                  ))}
                </div>
              ) : (
                <TecnicoDashboardEmptyState
                  description="Suas próximas ações serão listadas aqui."
                  title="Sem próximas ações"
                />
              )}
            </section>
          </div>
        )}
      </PageShell>
    </ProtectedRoleRoute>
  );
}