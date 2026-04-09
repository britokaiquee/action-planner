import type { AuthPublicUser, AuthSession, LoginCredentials, RegisterUserInput } from "@/modules/auth/domain/entities";

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  register(input: RegisterUserInput): Promise<AuthPublicUser>;
}