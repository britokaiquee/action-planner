import type { ActionRepository } from "@/modules/actions/domain/action-repository";
import type { ActionEntity, FormDefaults, Technician } from "@/modules/actions/domain/entities";
import { actionsSeed, formDefaults, techniciansSeed } from "@/modules/actions/infrastructure/actions.seed";

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

  async getFormDefaults(): Promise<FormDefaults> {
    return formDefaults;
  }
}

export const actionRepository = new MockActionRepository();