import type { AuthRepository } from "@/modules/auth/domain/auth-repository";
import type { LoginCredentials } from "@/modules/auth/domain/entities";

export async function loginWithPassword(repository: AuthRepository, credentials: LoginCredentials) {
  return repository.login(credentials);
}