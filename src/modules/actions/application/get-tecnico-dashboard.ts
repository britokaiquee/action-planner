import type { ActionRepository } from "@/modules/actions/domain/action-repository";
import { formatDateKey, formatLongDateCapitalized, formatShortDate } from "@/shared/lib/utils";

export type TecnicoDashboardBadgeTone = "warning" | "neutral" | "info" | "success" | "danger";

export interface TecnicoDashboardAssignmentViewModel {
  id: string;
  actionId: string;
  title: string;
  locationLabel: string;
  timeLabel: string;
  date: string;
  badgeLabel: string;
  badgeTone: TecnicoDashboardBadgeTone;
  primaryActionLabel?: string;
}

export interface TecnicoDashboardViewModel {
  technicianName: string;
  dateLabel: string;
  todayAssignments: TecnicoDashboardAssignmentViewModel[];
  upcomingAssignments: TecnicoDashboardAssignmentViewModel[];
}

interface GetTecnicoDashboardOptions {
  technicianName: string;
  currentDate?: Date;
}

function normalizeName(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export async function getTecnicoDashboard(
  repository: ActionRepository,
  { technicianName, currentDate = new Date() }: GetTecnicoDashboardOptions,
): Promise<TecnicoDashboardViewModel> {
  const actions = await repository.listActions();
  const technicians = await repository.listTechnicians();
  const technician = technicians.find((item) => normalizeName(item.name) === normalizeName(technicianName));
  const todayKey = formatDateKey(currentDate);

  if (!technician) {
    return {
      technicianName,
      dateLabel: formatLongDateCapitalized(currentDate),
      todayAssignments: [],
      upcomingAssignments: [],
    };
  }

  const assignments = actions
    .flatMap((action) =>
      action.dailyAllocations
        .filter((allocation) => allocation.technicianId === technician.id)
        .map((allocation) => {
          const hasCheckInRecord = action.executionRecords.some(
            (record) =>
              record.actionDate === allocation.date &&
              record.type === "check-in" &&
              normalizeName(record.technicianName) === normalizeName(technicianName),
          );
          const hasCheckOutRecord = action.executionRecords.some(
            (record) =>
              record.actionDate === allocation.date &&
              record.type === "check-out" &&
              normalizeName(record.technicianName) === normalizeName(technicianName),
          );

          const isToday = allocation.date === todayKey;
          const isInProgress = hasCheckInRecord && !hasCheckOutRecord;

          return {
            id: `${action.id}:${allocation.date}:${allocation.technicianId}`,
            actionId: action.id,
            title: action.title,
            locationLabel: `${action.city}, ${action.local}`,
            timeLabel: `${allocation.checkInTime} - ${allocation.checkOutTime}`,
            date: allocation.date,
            badgeLabel: isToday ? (isInProgress ? "Em andamento" : "Pendente") : formatShortDate(allocation.date),
            badgeTone: isToday ? (isInProgress ? "info" : "warning") : "neutral",
            primaryActionLabel: isToday ? "Check-in / check-out" : undefined,
          } satisfies TecnicoDashboardAssignmentViewModel;
        }),
    )
    .sort((left, right) => left.date.localeCompare(right.date) || left.timeLabel.localeCompare(right.timeLabel));

  return {
    technicianName: technician.name,
    dateLabel: formatLongDateCapitalized(currentDate),
    todayAssignments: assignments.filter((assignment) => assignment.date === todayKey),
    upcomingAssignments: assignments.filter((assignment) => assignment.date > todayKey),
  };
}