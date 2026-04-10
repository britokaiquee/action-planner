"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";

import { useAuth } from "@/modules/auth/presentation/auth-provider";

interface LogoutButtonProps {
  label?: string;
}

export function LogoutButton({ label = "Sair" }: LogoutButtonProps) {
  const { logout } = useAuth();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      logout();
      window.location.replace("/");
    });
  }

  return (
    <button
      aria-label={label}
      className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black/15 transition hover:bg-black/20 disabled:opacity-60"
      disabled={isPending}
      onClick={handleLogout}
      type="button"
    >
      <LogOut className="h-7 w-7" />
    </button>
  );
}