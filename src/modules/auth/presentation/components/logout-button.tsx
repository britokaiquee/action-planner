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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/15 transition hover:bg-black/20 disabled:opacity-60 sm:h-14 sm:w-14"
      disabled={isPending}
      onClick={handleLogout}
      type="button"
    >
      <LogOut className="h-5 w-5 sm:h-7 sm:w-7" />
    </button>
  );
}