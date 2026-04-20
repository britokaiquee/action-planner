import type { ActionRepository } from "@/modules/actions/domain/action-repository";
import { formatCurrency, formatShortDateTime } from "@/shared/lib/utils";

export interface TecnicoCheckInResourceViewModel {
  id: string;
  label: string;
  quantityLabel: string;
}

export interface TecnicoCheckInViewModel {
  actionId: string;
  actionDate: string;
  headerTitle: string;
  headerSubtitle: string;
  locationLabel: string;
  timeLabel: string;
  dateLabel: string;
  resources: TecnicoCheckInResourceViewModel[];
  helperText?: string;
  isLocationConfirmed: boolean;
  confirmationLabel?: string;
  confirmationTimestamp?: string;
}

interface GetTecnicoCheckInOptions {
  actionId: string;
  technicianName: string;
  actionDate?: string;
}

function normalizeName(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatDateLabel(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const startLabel = formatter.format(new Date(`${startDate}T00:00:00`));
  const endLabel = formatter.format(new Date(`${endDate}T00:00:00`));

  return startDate === endDate ? startLabel : `${startLabel} até ${endLabel}`;
}

export async function getTecnicoCheckIn(
  repository: ActionRepository,
  { actionId, technicianName, actionDate }: GetTecnicoCheckInOptions,
): Promise<TecnicoCheckInViewModel | null> {
  const [action, technicians] = await Promise.all([repository.getActionById(actionId), repository.listTechnicians()]);

  if (!action) {
    return null;
  }

  const technician = technicians.find((item) => normalizeName(item.name) === normalizeName(technicianName));

  if (!technician) {
    return null;
  }

  const allocation = action.dailyAllocations.find(
    (item) => item.technicianId === technician.id && (actionDate ? item.date === actionDate : true),
  );

  if (!allocation) {
    return null;
  }

  const confirmationRecord = action.executionRecords.find(
    (record) =>
      record.actionDate === allocation.date &&
      record.type === "check-in" &&
      normalizeName(record.technicianName) === normalizeName(technicianName),
  );

  const resources = action.executionResources?.length
    ? action.executionResources.map((resource) => ({
        id: resource.id,
        label: resource.label,
        quantityLabel: resource.quantityLabel,
      }))
    : [
        ...action.commonResources.map((resource) => ({
          id: resource.id,
          label: resource.label,
          quantityLabel: resource.description ?? resource.plate ?? formatCurrency(resource.cost),
        })),
        ...technician.participantResources.map((resource) => ({
          id: resource.id,
          label: resource.label,
          quantityLabel: formatCurrency(resource.cost),
        })),
      ];

  return {
    actionId: action.id,
    actionDate: allocation.date,
    headerTitle: "Ação",
    headerSubtitle: action.title,
    locationLabel: `${action.city}, ${action.local}`,
    timeLabel: `${allocation.checkInTime} - ${allocation.checkOutTime}`,
    dateLabel: formatDateLabel(action.startDate, action.endDate),
    resources,
    helperText: allocation.notes ?? action.notes,
    isLocationConfirmed: Boolean(confirmationRecord),
    confirmationLabel: confirmationRecord ? `Localização confirmada em ${formatShortDateTime(confirmationRecord.timestamp)}` : undefined,
    confirmationTimestamp: confirmationRecord?.timestamp,
  };
}