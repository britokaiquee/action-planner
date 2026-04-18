import type { TecnicoTeamMemberViewModel } from "@/modules/actions/application/get-tecnico-team";
import { cn } from "@/shared/lib/utils";

interface TecnicoTeamMemberCardProps {
  member: TecnicoTeamMemberViewModel;
}

export function TecnicoTeamMemberCard({ member }: TecnicoTeamMemberCardProps) {
  return (
    <div
      className={cn(
        "flex min-h-[5rem] w-full items-center justify-between gap-4 rounded-[1.1rem] border px-4 py-4 text-left shadow-card",
        member.isManager ? "border-gestor-outline bg-gestor-soft" : "border-border bg-card",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[1.05rem] font-semibold tracking-[-0.04em] text-text-strong sm:text-[1.125rem]">{member.nameLabel}</p>
        <p className={cn("mt-1 truncate text-[0.92rem] sm:text-[0.95rem]", member.isManager ? "text-gestor-dark" : "text-text-muted")}>{member.roleLabel}</p>
      </div>

      <span className="shrink-0 text-[0.95rem] font-semibold tracking-[-0.03em] text-[#556176] sm:text-[1rem]">{member.profileTag}</span>
    </div>
  );
}