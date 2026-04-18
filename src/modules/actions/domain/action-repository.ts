import type { ActionEntity, FormDefaults, TeamMember, Technician } from "@/modules/actions/domain/entities";

export interface ActionRepository {
  listActions(): Promise<ActionEntity[]>;
  getActionById(actionId: string): Promise<ActionEntity | null>;
  listTechnicians(): Promise<Technician[]>;
  listTeamMembers(): Promise<TeamMember[]>;
  getFormDefaults(): Promise<FormDefaults>;
}