import type { ActionEntity, FormDefaults, Technician } from "@/modules/actions/domain/entities";

export interface ActionRepository {
  listActions(): Promise<ActionEntity[]>;
  getActionById(actionId: string): Promise<ActionEntity | null>;
  listTechnicians(): Promise<Technician[]>;
  getFormDefaults(): Promise<FormDefaults>;
}