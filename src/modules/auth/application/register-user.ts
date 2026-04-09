import type { AuthRepository } from "@/modules/auth/domain/auth-repository";
import type { RegisterUserInput } from "@/modules/auth/domain/entities";

export async function registerUser(repository: AuthRepository, input: RegisterUserInput) {
  return repository.register(input);
}