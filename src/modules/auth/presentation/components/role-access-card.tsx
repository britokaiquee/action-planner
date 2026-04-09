import Link from "next/link";
import { UserRound, UsersRound } from "lucide-react";

import type { AuthRole } from "@/modules/auth/domain/entities";
import { cn } from "@/shared/lib/utils";

interface RoleAccessCardProps {
  href: string;
  role: AuthRole;
  activeRole: AuthRole;
}

const roleCopy: Record<AuthRole, { title: string; description: string }> = {
  tecnico: {
    title: "Técnico",
    description: "Acesso para técnicos de campo",
  },
  gestor: {
    title: "Gestor",
    description: "Acesso para coordenadores",
  },
};

export function RoleAccessCard({ href, role, activeRole }: RoleAccessCardProps) {
  const isActive = role === activeRole;
  const Icon = role === "gestor" ? UsersRound : UserRound;
  const tone = role === "gestor" ? "gestor" : "tecnico";

  return (
    <Link
      className={cn(
        "flex items-center gap-4 rounded-[0.875rem] px-5 py-4 transition sm:gap-5 sm:rounded-[2rem] sm:px-7 sm:py-6",
        isActive
          ? tone === "gestor"
            ? "border-[2px] border-gestor bg-[#edf9f1]"
            : "border-[2px] border-tecnico bg-[#edf3ff]"
          : "border border-[#dfe4eb] bg-white",
      )}
      href={href}
    >
      <div
        className={cn(
          "flex h-[3.1rem] w-[3.1rem] shrink-0 items-center justify-center rounded-full sm:h-[4.5rem] sm:w-[4.5rem]",
          isActive ? (tone === "gestor" ? "bg-gestor text-white" : "bg-tecnico text-white") : "bg-[#edf0f5] text-[#566173]",
        )}
      >
        <Icon className="h-6 w-6 sm:h-9 sm:w-9" strokeWidth={2.2} />
      </div>

      <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1.5">
        <p className="text-[1.1rem] font-semibold leading-tight text-[#0d1320] sm:text-[1.35rem]">{roleCopy[role].title}</p>
        <p className="text-[0.875rem] leading-snug text-[#677285] sm:text-[0.95rem] sm:leading-6">{roleCopy[role].description}</p>
      </div>
    </Link>
  );
}