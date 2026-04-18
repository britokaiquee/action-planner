"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import type { AuthRole } from "@/modules/auth/domain/entities";
import { authDemoCredentials } from "@/modules/auth/infrastructure/auth.seed";
import { useAuth } from "@/modules/auth/presentation/auth-provider";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface LoginFormProps {
  role: AuthRole;
  defaultEmail?: string;
  visualRole?: AuthRole;
}

const LOGIN_STORAGE_KEY = "action-planner-login-fields";
const REGISTER_SUCCESS_STORAGE_KEY = "action-planner-register-success";
const REGISTER_SUCCESS_TIMEOUT_MS = 4000;

interface RegisterSuccessFlash {
  role: AuthRole;
  message: string;
  description: string;
}

const LEGACY_DEMO_EMAILS: Record<AuthRole, string[]> = {
  gestor: ["gestor@actionplanner.com", "gestor@acessodemo.com"],
  tecnico: ["tecnico@actionplanner.com", "tecnico@acessodemo.com"],
};

function normalizeLoginDemoEmail(email: string) {
  if (LEGACY_DEMO_EMAILS.gestor.includes(email)) {
    return authDemoCredentials.gestor.email;
  }

  if (LEGACY_DEMO_EMAILS.tecnico.includes(email)) {
    return authDemoCredentials.tecnico.email;
  }

  return email;
}

function isAnyDemoEmail(email: string) {
  return Object.values(authDemoCredentials).some((credentials) => credentials.email === email) ||
    Object.values(LEGACY_DEMO_EMAILS).some((emails) => emails.includes(email));
}

function readStoredFields(role: AuthRole): { email: string; password: string } {
  try {
    const raw = typeof window !== "undefined" ? sessionStorage.getItem(LOGIN_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw) as { email: string; password: string };
      const normalizedEmail = normalizeLoginDemoEmail(parsed.email);

      if (isAnyDemoEmail(normalizedEmail)) {
        return {
          email: authDemoCredentials[role].email,
          password: authDemoCredentials[role].password,
        };
      }

      return { ...parsed, email: normalizedEmail };
    }
  } catch {}
  return { email: "", password: "" };
}

function writeStoredFields(email: string, password: string) {
  try {
    sessionStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify({ email, password }));
  } catch {}
}

function readRegisterSuccessFlash(role: AuthRole): RegisterSuccessFlash | null {
  try {
    const raw = sessionStorage.getItem(REGISTER_SUCCESS_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as RegisterSuccessFlash;
    sessionStorage.removeItem(REGISTER_SUCCESS_STORAGE_KEY);

    return parsed.role === role ? parsed : null;
  } catch {
    return null;
  }
}

export function LoginForm({ role, defaultEmail = "", visualRole }: LoginFormProps) {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const stored = readStoredFields(role);
  const defaultEmailValue = normalizeLoginDemoEmail(defaultEmail || searchParams.get("email") || "");
  const [email, setEmail] = useState(stored.email || defaultEmailValue || authDemoCredentials[role].email);
  const [password, setPassword] = useState(stored.password || authDemoCredentials[role].password);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState<RegisterSuccessFlash | null>(null);
  const [isPending, startTransition] = useTransition();
  const toneRole = visualRole ?? role;

  const toneClasses =
    toneRole === "gestor"
      ? {
          input: "h-16 rounded-[1.05rem] border-[#d0d7e2] px-5 text-[0.95rem] text-[#49566b] placeholder:text-[#a0a9b8] focus:border-gestor focus:ring-0 sm:h-[5.2rem] sm:rounded-[1.35rem] sm:px-6 sm:text-[1rem]",
          link: "text-gestor",
          button: "primary" as const,
        }
      : {
          input: "h-16 rounded-[1.05rem] border-[#d0d7e2] px-5 text-[0.95rem] text-[#49566b] placeholder:text-[#a0a9b8] focus:border-tecnico focus:ring-0 sm:h-[5.2rem] sm:rounded-[1.35rem] sm:px-6 sm:text-[1rem]",
          link: "text-tecnico",
          button: "secondary" as const,
        };

  useEffect(() => {
    const flash = readRegisterSuccessFlash(role);

    if (!flash) {
      return;
    }

    setSuccessMessage(flash);

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage(null);
    }, REGISTER_SUCCESS_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [role]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    startTransition(async () => {
      try {
        const session = await login({
          email: email.trim(),
          password,
          role,
        });

        writeStoredFields("", "");
        window.location.replace(`/${session.user.role}`);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Não foi possível entrar no momento.");
      }
    });
  }

  return (
    <form className="space-y-4 pt-0" onSubmit={handleSubmit}>
      <div className="space-y-2.5">
        <label className="block text-[0.92rem] font-medium text-[#39465d] sm:text-[1.05rem]" htmlFor="email">
          Login
        </label>
        <Input
          autoComplete="email"
          className={toneClasses.input}
          id="email"
          onChange={(event) => {
            setEmail(event.target.value);
            writeStoredFields(event.target.value, password);
          }}
          placeholder="Digite seu e-mail"
          required
          type="email"
          value={email}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-[0.92rem] font-medium text-[#39465d] sm:text-[1.05rem]" htmlFor="password">
          Senha
        </label>
        <div className="relative">
          <Input
            autoComplete="current-password"
            className={cn(toneClasses.input, "pr-16")}
            id="password"
            onChange={(event) => {
              setPassword(event.target.value);
              writeStoredFields(email, event.target.value);
            }}
            placeholder="Digite sua senha"
            required
            type={isPasswordVisible ? "text" : "password"}
            value={password}
          />

          <button
            aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9ba6b8] transition hover:text-[#6d7890]"
            onClick={() => setIsPasswordVisible((current) => !current)}
            type="button"
          >
            {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex justify-end pt-0.5">
          <button className={cn("text-[0.8rem] font-semibold underline underline-offset-2 transition-colors duration-500 ease-out", toneClasses.link)} type="button">
            Esqueci minha senha
          </button>
        </div>
      </div>

      {errorMessage ? (
        <p className="rounded-[1rem] border border-[#ffd7da] bg-[#fff5f6] px-4 py-3 text-sm font-medium text-danger">{errorMessage}</p>
      ) : null}

      {successMessage ? (
        <div className="rounded-[1rem] border border-[#b6e8c8] bg-[#edf9f1] px-4 py-4">
          <p className="text-sm font-semibold text-gestor">{successMessage.message}</p>
          <p className="text-sm text-[#3a7a56]">{successMessage.description}</p>
        </div>
      ) : null}

      <div className="pt-1 sm:flex sm:justify-center sm:pt-0">
        <Button className="mt-0 h-16 rounded-[1.2rem] text-[1rem] font-semibold shadow-button transition-[background-color,color,box-shadow] duration-500 ease-out sm:mt-5 sm:h-[5.2rem] sm:min-w-[28rem] sm:rounded-[1.5rem] sm:text-[1.55rem]" disabled={isPending} type="submit" variant={toneClasses.button}>
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </div>

      <p className="pt-0.5 text-center text-[1rem] text-[#687487] sm:pt-2 sm:text-[1.05rem]">
        Ainda não tem acesso?{" "}
        <Link className={cn("font-semibold transition-colors duration-500 ease-out", toneClasses.link)} href={role === "gestor" ? "/gestor/cadastro" : "/tecnico/cadastro"}>
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}

