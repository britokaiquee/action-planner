import type { ActionRepository } from "@/modules/actions/domain/action-repository";
import type { ActionEntity, DashboardSummary } from "@/modules/actions/domain/entities";
import { coordinatorName } from "@/modules/actions/infrastructure/actions.seed";
import { formatLongDate } from "@/shared/lib/utils";

export interface GestorDashboardViewModel {
  coordinatorName: string;
  dateLabel: string;
  summary: DashboardSummary;
  actions: ActionEntity[];
}

export async function getGestorDashboard(repository: ActionRepository): Promise<GestorDashboardViewModel> {
  const actions = await repository.listActions();
  const activeActions = actions.filter((action) => action.plannedStatus !== "concluida");
  const activeTechnicians = new Set(
    activeActions.flatMap((action) =>
      action.dailyAllocations.filter((allocation) => allocation.status !== "conflito").map((allocation) => allocation.technicianId),
    ),
  );

  return {
    coordinatorName,
    dateLabel: formatLongDate(new Date()),
    summary: {
      activeActions: activeActions.length,
      activeTechnicians: activeTechnicians.size,
    },
    actions: activeActions,
  };
}