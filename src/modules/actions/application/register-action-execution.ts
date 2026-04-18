import type { ActionRepository, CreateExecutionRecordInput } from "@/modules/actions/domain/action-repository";

export async function registerActionExecution(repository: ActionRepository, input: CreateExecutionRecordInput) {
  return repository.createExecutionRecord(input);
}