import type { ActionRepository } from "@/modules/actions/domain/action-repository";

export async function getActionDetail(repository: ActionRepository, actionId: string) {
  return repository.getActionById(actionId);
}