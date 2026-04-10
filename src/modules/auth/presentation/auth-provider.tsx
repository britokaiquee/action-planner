"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";

import { loginWithPassword } from "@/modules/auth/application/login-with-password";
import { registerUser } from "@/modules/auth/application/register-user";
import type {
  AuthPublicUser,
  AuthRole,
  AuthSession,
  LoginCredentials,
  RegisterUserInput,
} from "@/modules/auth/domain/entities";
import {
  clearStoredAuthSession,
  getStoredAuthSessionSnapshot,
  persistStoredAuthSession,
  subscribeToStoredAuthSession,
} from "@/modules/auth/infrastructure/auth-local-storage";
import { authRepository } from "@/modules/auth/infrastructure/mock-auth-repository";

interface AuthContextValue {
  session: AuthSession | null;
  user: AuthPublicUser | null;
  role: AuthRole | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthSession>;
  register: (input: RegisterUserInput) => Promise<AuthPublicUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(subscribeToStoredAuthSession, getStoredAuthSessionSnapshot, () => null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsHydrated(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  async function handleLogin(credentials: LoginCredentials) {
    const nextSession = await loginWithPassword(authRepository, credentials);

    persistStoredAuthSession(nextSession);

    return nextSession;
  }

  async function handleRegister(input: RegisterUserInput) {
    return registerUser(authRepository, input);
  }

  function handleLogout() {
    clearStoredAuthSession();
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        role: session?.user.role ?? null,
        isAuthenticated: Boolean(session),
        isHydrated,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
