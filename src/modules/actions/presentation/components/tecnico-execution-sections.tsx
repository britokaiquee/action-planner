import Link from "next/link";
import { CalendarDays, Clock3, MapPin, UsersRound } from "lucide-react";

import type { TecnicoCheckInResourceViewModel } from "@/modules/actions/application/get-tecnico-check-in";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/shared/ui/card";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-[4rem] items-start gap-3 sm:min-h-[4.2rem]">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-[#98A2B3] sm:h-7 sm:w-7">{icon}</div>

      <div className="min-w-0 space-y-1">
        <p className="text-[0.88rem] font-medium tracking-[-0.02em] text-text-strong sm:text-[0.95rem]">{label}</p>
        <p className="text-[0.98rem] leading-snug text-text-muted sm:text-[1.02rem]">{value}</p>
      </div>
    </div>
  );
}

interface TecnicoExecutionActionInfoCardProps {
  locationLabel: string;
  timeLabel: string;
  dateLabel: string;
  participantsHref: string;
  title?: string;
  className?: string;
  contentClassName?: string;
}

export function TecnicoExecutionActionInfoCard({
  locationLabel,
  timeLabel,
  dateLabel,
  participantsHref,
  title = "Informações da ação",
  className,
  contentClassName,
}: TecnicoExecutionActionInfoCardProps) {
  return (
    <Card className={cn("w-full rounded-[1.15rem] border-[#d9dfe8] shadow-[0_2px_8px_rgba(16,24,40,0.06),0_3px_8px_rgba(16,24,40,0.04)]", className)}>
      <CardContent className={cn("flex flex-col gap-3 p-[1.1rem] sm:p-5 lg:p-[1.35rem]", contentClassName)}>
        <div>
          <h2 className="text-[1.28rem] font-semibold leading-[1.02] tracking-[-0.04em] text-text-strong sm:text-[1.42rem] lg:text-[1.24rem]">
            {title}
          </h2>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-2.5 sm:gap-3">
          <InfoRow icon={<MapPin className="h-6 w-6" strokeWidth={2} />} label="Local" value={locationLabel} />
          <InfoRow icon={<Clock3 className="h-6 w-6" strokeWidth={2} />} label="Horário" value={timeLabel} />
          <InfoRow icon={<CalendarDays className="h-6 w-6" strokeWidth={2} />} label="Data" value={dateLabel} />

          <Link
            className="inline-flex h-[2.85rem] min-h-[2.85rem] w-fit items-center justify-center gap-2 self-start rounded-[1rem] border border-border bg-[#f8f9fc] px-4 text-[0.98rem] font-medium text-text-strong transition hover:bg-[#f2f5fa]"
            href={participantsHref}
          >
            <UsersRound className="h-5 w-5 text-tecnico" strokeWidth={2.1} />
            Participantes
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

interface TecnicoExecutionResourcesListProps {
  resources: TecnicoCheckInResourceViewModel[];
  className?: string;
  itemClassName?: string;
}

export function TecnicoExecutionResourcesList({
  resources,
  className,
  itemClassName,
}: TecnicoExecutionResourcesListProps) {
  return (
    <div className={cn("flex flex-1 flex-col gap-2 sm:gap-2.5", className)}>
      {resources.map((resource) => (
        <div
          className={cn(
            "flex min-h-[3rem] items-center gap-4 rounded-[0.95rem] bg-[#f8f9fc] px-4 py-2.5 sm:min-h-[3.15rem] sm:px-4 sm:py-2.5 lg:min-h-[3.35rem] lg:px-5",
            itemClassName,
          )}
          key={resource.id}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-tecnico" />
            <span className="text-[0.95rem] font-medium leading-snug text-text-strong sm:text-[0.98rem] lg:text-[0.97rem]">{`${resource.label} (${resource.quantityLabel})`}</span>
          </div>
        </div>
      ))}
    </div>
  );
}