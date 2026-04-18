import type { AuthRepository } from "@/modules/auth/domain/auth-repository";
import type { AuthPublicUser, AuthSession, LoginCredentials, RegisterUserInput } from "@/modules/auth/domain/entities";
import { createStoredAuthUser, findStoredAuthUserByCredentials, findStoredAuthUserByEmail } from "@/modules/auth/infrastructure/auth-local-storage";
import { toPublicAuthUser } from "@/modules/auth/infrastructure/auth-session";

export class MockAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const user = findStoredAuthUserByCredentials(credentials);

    await new Promise((resolve) => setTimeout(resolve, 450));

    if (!user) {
      throw new Error("Credenciais inválidas para o perfil selecionado.");
    }

    const safeUser = toPublicAuthUser(user);

    return {
      user: safeUser,
      accessToken: `mock-token-${safeUser.role}-${safeUser.id}`,
    };
  }

  async register(input: RegisterUserInput): Promise<AuthPublicUser> {
    await new Promise((resolve) => setTimeout(resolve, 450));

    if (findStoredAuthUserByEmail(input.email)) {
      throw new Error("Já existe um cadastro com este e-mail.");
    }

    const user = createStoredAuthUser(input);

    return toPublicAuthUser(user);
  }
}

export const authRepository = new MockAuthRepository();