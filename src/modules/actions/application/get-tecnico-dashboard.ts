import type { ActionRepository } from "@/modules/actions/domain/action-repository";
import { technicianName } from "@/modules/actions/infrastructure/actions.seed";
import { formatLongDate } from "@/shared/lib/utils";

export interface TecnicoDashboardViewModel {
  technicianName: string;
  dateLabel: string;
  todayActionId: string;
  upcomingActionId: string;
  totalAssignments: number;
  todayPendingCheckIn: boolean;
}

export async function getTecnicoDashboard(repository: ActionRepository): Promise<TecnicoDashboardViewModel> {
  const actions = await repository.listActions();
  const todayAction = actions[0];
  const upcomingAction = actions[1] ?? actions[0];

  return {
    technicianName,
    dateLabel: formatLongDate(new Date()),
    todayActionId: todayAction.id,
    upcomingActionId: upcomingAction.id,
    totalAssignments: actions.reduce((total, action) => total + action.dailyAllocations.length, 0),
    todayPendingCheckIn: true,
  };
}