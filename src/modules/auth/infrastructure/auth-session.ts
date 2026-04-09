import type { NextResponse } from "next/server";

import type { AuthPublicUser, AuthSession } from "@/modules/auth/domain/entities";

export const AUTH_ROLE_COOKIE = "action-planner-role";
export const AUTH_USER_COOKIE = "action-planner-user";
export const AUTH_TOKEN_COOKIE = "action-planner-token";

export function toPublicAuthUser(user: {
  id: string;
  name: string;
  email: string;
  role: "gestor" | "tecnico";
  cpf?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
}): AuthPublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    cpf: user.cpf,
    phone: user.phone,
    department: user.department,
    jobTitle: user.jobTitle,
  };
}

export function applySessionCookies(response: NextResponse, session: AuthSession) {
  response.cookies.set(AUTH_ROLE_COOKIE, session.user.role, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });

  response.cookies.set(AUTH_USER_COOKIE, session.user.name, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });

  response.cookies.set(AUTH_TOKEN_COOKIE, session.accessToken, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(AUTH_ROLE_COOKIE, "", { expires: new Date(0), path: "/" });
  response.cookies.set(AUTH_USER_COOKIE, "", { expires: new Date(0), path: "/" });
  response.cookies.set(AUTH_TOKEN_COOKIE, "", { expires: new Date(0), path: "/" });
}