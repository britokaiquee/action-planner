import type { ActionRepository, CreateExecutionRecordInput } from "@/modules/actions/domain/action-repository";
import type { ActionEntity, ExecutionRecord, FormDefaults, TeamMember, Technician } from "@/modules/actions/domain/entities";
import { actionsSeed, formDefaults, teamMembersSeed, techniciansSeed } from "@/modules/actions/infrastructure/actions.seed";

export class MockActionRepository implements ActionRepository {
  async listActions(): Promise<ActionEntity[]> {
    return actionsSeed;
  }

  async getActionById(actionId: string): Promise<ActionEntity | null> {
    return actionsSeed.find((action) => action.id === actionId) ?? null;
  }

  async listTechnicians(): Promise<Technician[]> {
    return techniciansSeed;
  }

  async listTeamMembers(): Promise<TeamMember[]> {
    return teamMembersSeed;
  }

  async getFormDefaults(): Promise<FormDefaults> {
    return formDefaults;
  }

  async createExecutionRecord(input: CreateExecutionRecordInput): Promise<ExecutionRecord | null> {
    const action = actionsSeed.find((item) => item.id === input.actionId);

    if (!action) {
      return null;
    }

    const existingRecord = action.executionRecords.find(
      (record) =>
        record.actionDate === input.actionDate &&
        record.type === input.type &&
        record.technicianName === input.technicianName,
    );

    if (existingRecord) {
      return existingRecord;
    }

    const nextRecord: ExecutionRecord = {
      id: `exec-${input.actionId}-${input.actionDate}-${input.type}-${action.executionRecords.length + 1}`,
      actionId: input.actionId,
      actionDate: input.actionDate,
      type: input.type,
      technicianName: input.technicianName,
      timestamp: input.timestamp ?? new Date().toISOString(),
      notes: input.notes,
    };

    action.executionRecords.push(nextRecord);

    return nextRecord;
  }
}

export const actionRepository = new MockActionRepository();