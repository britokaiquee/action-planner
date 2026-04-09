import type { AuthRole, AuthUser } from "@/modules/auth/domain/entities";

export const MOCK_AUTH_PASSWORD = "12345678";

export const authUsersSeed: AuthUser[] = [
  {
    id: "gestor-1",
    name: "Maria Costa",
    email: "gestor@actionplanner.com",
    password: MOCK_AUTH_PASSWORD,
    role: "gestor",
    cpf: "123.456.789-10",
    phone: "(73) 99999-1000",
    department: "Coordenacao Geral",
  },
  {
    id: "tecnico-1",
    name: "Joao Silva",
    email: "tecnico@actionplanner.com",
    password: MOCK_AUTH_PASSWORD,
    role: "tecnico",
    cpf: "987.654.321-00",
    phone: "(73) 99999-2000",
    jobTitle: "Tecnico de TI",
  },
];

export const authDemoCredentials: Record<AuthRole, { email: string; password: string }> = {
  gestor: {
    email: "gestor@actionplanner.com",
    password: MOCK_AUTH_PASSWORD,
  },
  tecnico: {
    email: "tecnico@actionplanner.com",
    password: MOCK_AUTH_PASSWORD,
  },
};