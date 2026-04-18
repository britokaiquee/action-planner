"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { AuthRole } from "@/modules/auth/domain/entities";
import { useAuth } from "@/modules/auth/presentation/auth-provider";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface RegisterFormProps {
  role: AuthRole;
}

const LOGIN_STORAGE_KEY = "action-planner-login-fields";
const REGISTER_SUCCESS_STORAGE_KEY = "action-planner-register-success";

export function RegisterForm({ role }: RegisterFormProps) {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [jobFunction, setJobFunction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const isGestor = role === "gestor";

  const toneClasses = isGestor
    ? { input: "focus:border-gestor focus:ring-0", button: "primary" as const }
    : { input: "focus:border-tecnico focus:ring-0", button: "secondary" as const };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    startTransition(async () => {
      try {
        await register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          department: isGestor ? "Coordenação" : undefined,
          jobTitle: isGestor ? undefined : jobFunction.trim(),
        });

        try {
          sessionStorage.removeItem(LOGIN_STORAGE_KEY);
          sessionStorage.setItem(
            REGISTER_SUCCESS_STORAGE_KEY,
            JSON.stringify({
              role,
              message: "Cadastro realizado com sucesso!",
              description: "Confirme o cadastro em seu e-mail para ativar o acesso.",
            }),
          );
        } catch {}

        router.push(`/${role}/login`);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Não foi possível concluir o cadastro.");
      }
    });
  }

  return (
    <form className="w-full space-y-6" onSubmit={handleSubmit}>
      <Field label="Nome">
        <Input
          autoComplete="name"
          className={cn("!h-16 !rounded-[1.1rem] border-[#d0d7e2] !px-5 !text-[1rem] text-[#49566b] placeholder:text-[#a0a9b8]", toneClasses.input)}
          onChange={(e) => setName(e.target.value)}
          placeholder={isGestor ? "Maria Costa" : "João da Silva"}
          required
          value={name}
        />
      </Field>

      {!isGestor ? (
        <Field label="Função">
          <Input
            className={cn("!h-16 !rounded-[1.1rem] border-[#d0d7e2] !px-5 !text-[1rem] text-[#49566b] placeholder:text-[#a0a9b8]", toneClasses.input)}
            onChange={(e) => setJobFunction(e.target.value)}
            placeholder="Técnico de TI"
            required
            value={jobFunction}
          />
        </Field>
      ) : null}

      <Field label="E-mail">
        <Input
          autoComplete="email"
          className={cn("!h-16 !rounded-[1.1rem] border-[#d0d7e2] !px-5 !text-[1rem] text-[#49566b] placeholder:text-[#a0a9b8]", toneClasses.input)}
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
          className={cn("!h-16 !rounded-[1.1rem] border-[#d0d7e2] !px-5 !text-[1rem] text-[#49566b] placeholder:text-[#a0a9b8]", toneClasses.input)}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="exemplo123"
          required
          type="password"
          value={password}
        />
      </Field>

      <Field label="Confirmar senha">
        <Input
          autoComplete="new-password"
          className={cn("!h-16 !rounded-[1.1rem] border-[#d0d7e2] !px-5 !text-[1rem] text-[#49566b] placeholder:text-[#a0a9b8]", toneClasses.input)}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repita a senha"
          required
          type="password"
          value={confirmPassword}
        />
      </Field>

      {errorMessage ? <p className="rounded-[1rem] border border-[#ffd7da] bg-[#fff5f6] px-4 py-3 text-sm font-medium text-danger">{errorMessage}</p> : null}

      <Button
        className="mt-2 !h-16 !w-full !rounded-[1.1rem] !text-[1.05rem] font-semibold shadow-button"
        disabled={isPending}
        type="submit"
        variant={toneClasses.button}
      >
        {isPending ? "Cadastrando..." : isGestor ? "Cadastrar gestor" : "Cadastrar técnico"}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <label className="block text-[0.95rem] font-semibold text-[#39465d]">{label}</label>
      {children}
    </div>
  );
}
