"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { AuthRole } from "@/modules/auth/domain/entities";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface LoginFormProps {
  role: AuthRole;
  defaultEmail?: string;
}

export function LoginForm({ role, defaultEmail = "" }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");

  const toneClasses =
    role === "gestor"
      ? {
          input: "h-14 rounded-[0.875rem] border-[#d0d7e2] px-4 text-[0.95rem] text-[#49566b] placeholder:text-[#a0a9b8] focus:border-gestor focus:ring-0 sm:h-[5.85rem] sm:rounded-[1.55rem] sm:px-6 sm:text-[1.05rem]",
          link: "text-gestor",
          button: "primary" as const,
        }
      : {
          input: "h-14 rounded-[0.875rem] border-[#d0d7e2] px-4 text-[0.95rem] text-[#49566b] placeholder:text-[#a0a9b8] focus:border-tecnico focus:ring-0 sm:h-[5.85rem] sm:rounded-[1.55rem] sm:px-6 sm:text-[1.05rem]",
          link: "text-tecnico",
          button: "secondary" as const,
        };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/${role}`);
  }

  return (
    <form className="space-y-6 pt-2" onSubmit={handleSubmit}>
      <div className="space-y-3">
        <label className="block text-[1.1rem] font-medium text-[#39465d] sm:text-[1.2rem]" htmlFor="email">
          Login
        </label>
        <Input
          autoComplete="email"
          className={toneClasses.input}
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="usuario@exemplo.com"
          type="email"
          value={email}
        />
      </div>

      <div className="space-y-3">
        <label className="block text-[1.1rem] font-medium text-[#39465d] sm:text-[1.2rem]" htmlFor="password">
          Senha
        </label>
        <Input
          autoComplete="current-password"
          className={toneClasses.input}
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Digite sua senha"
          type="password"
          value={password}
        />
      </div>

      <Button className="mt-4 h-14 rounded-[1rem] text-[1.1rem] font-semibold shadow-none sm:mt-7 sm:h-[5.8rem] sm:rounded-[1.8rem] sm:text-[1.95rem]" type="submit" variant={toneClasses.button}>
        Entrar
      </Button>

      <p className="pt-4 text-center text-[1.05rem] text-[#687487] sm:text-[1.1rem]">
        Ainda não tem acesso?{" "}
        <Link className={cn("font-semibold", toneClasses.link)} href={role === "gestor" ? "/gestor/cadastro" : "/tecnico/cadastro"}>
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}

