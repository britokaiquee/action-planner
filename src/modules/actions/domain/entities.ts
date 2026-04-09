export type UserRole = "gestor" | "tecnico";
export type PlannedStatus = "planejamento" | "andamento" | "concluida" | "atrasada";
export type DailyAllocationStatus = "confirmado" | "pendente" | "conflito";
export type ExecutionType = "check-in" | "check-out";
export type ParticipantResourceType = "diaria" | "alimentacao" | "epi" | "ferramenta";
export type CommonResourceType = "veiculo" | "logistica" | "material";

export interface ParticipantResource {
  id: string;
  label: string;
  cost: number;
  type: ParticipantResourceType;
}

export interface Technician {
  id: string;
  name: string;
  city: string;
  specialty: string;
  dailyCost: number;
  participantResources: ParticipantResource[];
}

export interface DailyAllocation {
  technicianId: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: DailyAllocationStatus;
  notes?: string;
  hasTechnicianConflict?: boolean;
  hasVehicleConflict?: boolean;
}

export interface CommonResource {
  id: string;
  label: string;
  cost: number;
  type: CommonResourceType;
  description?: string;
  plate?: string;
  hasConflict?: boolean;
}

export interface ExecutionRecord {
  id: string;
  actionId: string;
  actionDate: string;
  type: ExecutionType;
  technicianName: string;
  timestamp: string;
  notes?: string;
}

export interface ActionMetrics {
  progressPercent: number;
  activeParticipants: number;
  pendingParticipants: number;
  predictedCost: number;
}

export interface ActionEntity {
  id: string;
  title: string;
  description: string;
  city: string;
  local: string;
  startDate: string;
  endDate: string;
  plannedStatus: PlannedStatus;
  notes?: string;
  technicians: Technician[];
  dailyAllocations: DailyAllocation[];
  commonResources: CommonResource[];
  executionRecords: ExecutionRecord[];
  metrics: ActionMetrics;
}

export interface DashboardSummary {
  activeActions: number;
  activeTechnicians: number;
}

export interface FormDefaults {
  checkInTime: string;
  checkOutTime: string;
}