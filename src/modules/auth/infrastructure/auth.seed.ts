import type { AuthRole, AuthUser } from "@/modules/auth/domain/entities";

export const MOCK_AUTH_PASSWORD = "12345678";

export const authUsersSeed: AuthUser[] = [
  {
    id: "gestor-1",
    name: "Maria Costa",
    email: "gestor@acessodemo.com",
    password: MOCK_AUTH_PASSWORD,
    role: "gestor",
    profileTag: "#M8K4X2",
    cpf: "123.456.789-10",
    phone: "(73) 99999-1000",
    department: "Coordenação Geral",
  },
  {
    id: "tecnico-1",
    name: "João Silva",
    email: "tecnico@acessodemo.com",
    password: MOCK_AUTH_PASSWORD,
    role: "tecnico",
    profileTag: "#1AE3DP",
    cpf: "987.654.321-00",
    phone: "(73) 99999-2000",
    jobTitle: "Técnico de TI",
  },
];

export const authDemoCredentials: Record<AuthRole, { email: string; password: string }> = {
  gestor: {
    email: "gestor@acessodemo.com",
    password: MOCK_AUTH_PASSWORD,
  },
  tecnico: {
    email: "tecnico@acessodemo.com",
    password: MOCK_AUTH_PASSWORD,
  },
};