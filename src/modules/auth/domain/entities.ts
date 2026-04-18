export type AuthRole = "gestor" | "tecnico";

export interface AuthPublicUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  profileTag?: string;
  cpf?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  password: string;
  profileTag?: string;
  cpf?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: AuthRole;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password?: string;
  role: AuthRole;
  cpf?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
}

export interface AuthSession {
  user: AuthPublicUser;
  accessToken: string;
}