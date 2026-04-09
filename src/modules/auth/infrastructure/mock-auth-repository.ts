import type { AuthRepository } from "@/modules/auth/domain/auth-repository";
import type { AuthPublicUser, AuthSession, LoginCredentials, RegisterUserInput } from "@/modules/auth/domain/entities";
import { createAuthUser, findAuthUserByCredentials, findAuthUserByEmail } from "@/modules/auth/infrastructure/auth-memory-store";
import { toPublicAuthUser } from "@/modules/auth/infrastructure/auth-session";

export class MockAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const user = findAuthUserByCredentials(credentials);

    await new Promise((resolve) => setTimeout(resolve, 450));

    if (!user) {
      throw new Error("Credenciais invalidas para o perfil selecionado.");
    }

    const safeUser = toPublicAuthUser(user);

    return {
      user: safeUser,
      accessToken: `mock-token-${safeUser.role}-${safeUser.id}`,
    };
  }

  async register(input: RegisterUserInput): Promise<AuthPublicUser> {
    await new Promise((resolve) => setTimeout(resolve, 450));

    if (findAuthUserByEmail(input.email)) {
      throw new Error("Ja existe um cadastro com este e-mail no servidor local mockado.");
    }

    const user = createAuthUser(input);

    return toPublicAuthUser(user);
  }
}

export const authRepository = new MockAuthRepository();