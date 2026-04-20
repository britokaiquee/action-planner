import type { ActionRepository } from "@/modules/actions/domain/action-repository";

import { getTecnicoCheckIn, type TecnicoCheckInViewModel } from "./get-tecnico-check-in";

export interface TecnicoCheckOutViewModel extends TecnicoCheckInViewModel {
  checkInCardTitle: string;
  checkInTimeLabel: string;
}

interface GetTecnicoCheckOutOptions {
  actionId: string;
  technicianName: string;
  actionDate?: string;
  transientCheckInTimestamp?: string;
}

function formatCompactTime(timestamp?: string) {
  if (!timestamp) {
    return "--h--";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(timestamp))
    .replace(":", "h");
}

export async function getTecnicoCheckOut(
  repository: ActionRepository,
  { actionId, technicianName, actionDate, transientCheckInTimestamp }: GetTecnicoCheckOutOptions,
): Promise<TecnicoCheckOutViewModel | null> {
  const checkIn = await getTecnicoCheckIn(repository, {
    actionId,
    actionDate,
    technicianName,
  });

  if (!checkIn) {
    return null;
  }

  return {
    ...checkIn,
    checkInCardTitle: "Realização do check-in",
    checkInTimeLabel: formatCompactTime(transientCheckInTimestamp ?? checkIn.confirmationTimestamp),
  };
}