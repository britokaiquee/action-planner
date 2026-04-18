import type {
  ActionEntity,
  ExecutionRecord,
  ExecutionType,
  FormDefaults,
  TeamMember,
  Technician,
} from "@/modules/actions/domain/entities";

export interface CreateExecutionRecordInput {
  actionId: string;
  actionDate: string;
  type: ExecutionType;
  technicianName: string;
  notes?: string;
  timestamp?: string;
}

export interface ActionRepository {
  listActions(): Promise<ActionEntity[]>;
  getActionById(actionId: string): Promise<ActionEntity | null>;
  listTechnicians(): Promise<Technician[]>;
  listTeamMembers(): Promise<TeamMember[]>;
  getFormDefaults(): Promise<FormDefaults>;
  createExecutionRecord(input: CreateExecutionRecordInput): Promise<ExecutionRecord | null>;
}