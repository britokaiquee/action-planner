import type { ActionRepository } from "@/modules/actions/domain/action-repository";

export async function getActionFormContext(repository: ActionRepository) {
  const [technicians, defaults, actions] = await Promise.all([
    repository.listTechnicians(),
    repository.getFormDefaults(),
    repository.listActions(),
  ]);

  return {
    technicians,
    defaults,
    ongoingActions: actions,
  };
}