import { Clock3, MapPin } from "lucide-react";

import type { TecnicoDashboardAssignmentViewModel } from "@/modules/actions/application/get-tecnico-dashboard";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";

const badgeVariantMap = {
  warning: "warning",
  neutral: "neutral",
  info: "info",
  success: "success",
  danger: "danger",
} as const;

interface TecnicoScheduleCardProps {
  assignment: TecnicoDashboardAssignmentViewModel;
}

export function TecnicoScheduleCard({ assignment }: TecnicoScheduleCardProps) {
  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col gap-4 p-5 sm:gap-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="flex-1 pr-2 text-[1.25rem] font-semibold leading-[1.08] tracking-[-0.04em] text-text-strong sm:text-card-title">
            {assignment.title}
          </h3>

          <Badge className="min-w-[4.25rem] justify-center px-3 py-1 text-[0.82rem] leading-none sm:min-w-[4.6rem] sm:px-3.5 sm:py-1.5 sm:text-[0.9rem]" variant={badgeVariantMap[assignment.badgeTone]}>
            {assignment.badgeLabel}
          </Badge>
        </div>

        <div className="space-y-3 text-[0.95rem] text-text-muted sm:text-[1.85rem]">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 shrink-0 text-[#556176] sm:h-8 sm:w-8" />
            <span>{assignment.timeLabel}</span>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#556176] sm:h-8 sm:w-8" />
            <span>{assignment.locationLabel}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}