import type { AuthUser, LoginCredentials, RegisterUserInput } from "@/modules/auth/domain/entities";
import { authUsersSeed, MOCK_AUTH_PASSWORD } from "@/modules/auth/infrastructure/auth.seed";

declare global {
  var __actionPlannerAuthUsers: AuthUser[] | undefined;
}

function getStore() {
  if (!globalThis.__actionPlannerAuthUsers) {
    globalThis.__actionPlannerAuthUsers = authUsersSeed.map((user) => ({ ...user }));
  }

  return globalThis.__actionPlannerAuthUsers;
}

export function findAuthUserByCredentials(credentials: LoginCredentials) {
  return getStore().find(
    (currentUser) =>
      currentUser.email.toLowerCase() === credentials.email.toLowerCase() &&
      currentUser.password === credentials.password &&
      currentUser.role === credentials.role,
  );
}

export function findAuthUserByEmail(email: string) {
  return getStore().find((currentUser) => currentUser.email.toLowerCase() === email.toLowerCase());
}

export function createAuthUser(input: RegisterUserInput) {
  const newUser: AuthUser = {
    id: `${input.role}-${crypto.randomUUID()}`,
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password ?? MOCK_AUTH_PASSWORD,
    role: input.role,
    cpf: input.cpf,
    phone: input.phone,
    department: input.department,
    jobTitle: input.jobTitle,
  };

  getStore().push(newUser);

  return newUser;
}