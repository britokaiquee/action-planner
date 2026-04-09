"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { AuthRole } from "@/modules/auth/domain/entities";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface RegisterFormProps {
  role: AuthRole;
}

export function RegisterForm({ role }: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jobFunction, setJobFunction] = useState("");
  const [success, setSuccess] = useState(false);

  const isGestor = role === "gestor";

  const toneClasses = isGestor
    ? { input: "focus:border-gestor focus:ring-0", button: "primary" as const }
    : { input: "focus:border-tecnico focus:ring-0", button: "secondary" as const };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      router.push(`/${role}/login`);
    }, 1500);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Field label="Nome Completo">
        <Input
          autoComplete="name"
          className={cn("h-14 rounded-[0.875rem] border-[#d0d7e2] px-4 text-[0.95rem] text-[#49566b] placeholder:text-[#a0a9b8]", toneClasses.input)}
          onChange={(e) => setName(e.target.value)}
          placeholder={isGestor ? "Maria Costa" : "João da Silva"}
          required
          value={name}
        />
      </Field>

      <Field label="E-mail">
        <Input
          autoComplete="email"
          className={cn("h-14 rounded-[0.875rem] border-[#d0d7e2] px-4 text-[0.95rem] text-[#49566b] placeholder:text-[#a0a9b8]", toneClasses.input)}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemplo.com"
          required
          type="email"
          value={email}
        />
      </Field>

      <Field label="Senha">
        <Input
          autoComplete="new-password"
          className={cn("h-14 rounded-[0.875rem] border-[#d0d7e2] px-4 text-[0.95rem] text-[#49566b] placeholder:text-[#a0a9b8]", toneClasses.input)}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="exemplo123"
          required
          type="password"
          value={password}
        />
      </Field>

      <Field label="Função">
        <Input
          className={cn("h-14 rounded-[0.875rem] border-[#d0d7e2] px-4 text-[0.95rem] text-[#49566b] placeholder:text-[#a0a9b8]", toneClasses.input)}
          onChange={(e) => setJobFunction(e.target.value)}
          placeholder={isGestor ? "Coordenadora" : "Técnico de TI"}
          required
          value={jobFunction}
        />
      </Field>

      {success ? (
        <p className="rounded-[1rem] bg-green-50 px-4 py-3 text-sm font-medium text-gestor">
          Cadastro realizado com sucesso! Redirecionando...
        </p>
      ) : null}

      <Button
        className="mt-2 h-14 rounded-[1rem] text-[1.05rem] font-semibold shadow-none"
        disabled={success}
        type="submit"
        variant={toneClasses.button}
      >
        {isGestor ? "Cadastrar Gestor" : "Cadastrar Técnico"}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-[0.9rem] font-semibold text-[#1a2233]">{label}</label>
      {children}
    </div>
  );
}
