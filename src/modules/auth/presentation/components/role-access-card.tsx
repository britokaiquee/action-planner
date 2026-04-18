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
        "flex items-center gap-4 rounded-[1.45rem] border px-6 py-5 transition-[background-color,border-color,box-shadow,color] duration-500 ease-out sm:gap-5 sm:rounded-[2rem] sm:px-7 sm:py-6",
        isActive
          ? tone === "gestor"
            ? "border-2 border-gestor bg-[#eefaf2] shadow-[0_10px_24px_rgba(8,179,61,0.06)]"
            : "border-2 border-tecnico bg-[#edf3ff] shadow-[0_10px_24px_rgba(37,99,235,0.06)]"
          : "border-[#dfe4eb] bg-white",
      )}
      href={href}
    >
      <div
        className={cn(
          "flex h-[3.7rem] w-[3.7rem] shrink-0 items-center justify-center rounded-full transition-[background-color,color] duration-500 ease-out sm:h-[4.5rem] sm:w-[4.5rem]",
          isActive ? (tone === "gestor" ? "bg-gestor text-white" : "bg-tecnico text-white") : "bg-[#edf0f5] text-[#566173]",
        )}
      >
        <Icon className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={2.2} />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-[1.2rem] font-semibold leading-tight text-[#0d1320] sm:text-[1.35rem]">{roleCopy[role].title}</p>
        <p className="text-[0.95rem] leading-snug text-[#677285] sm:text-[0.95rem] sm:leading-6">{roleCopy[role].description}</p>
      </div>
    </Link>
  );
}