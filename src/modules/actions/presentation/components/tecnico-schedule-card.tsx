import { Clock3, MapPin } from "lucide-react";

import type { TecnicoDashboardAssignmentViewModel } from "@/modules/actions/application/get-tecnico-dashboard";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
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
    <Card>
      <CardContent className="flex flex-col gap-6 p-6 sm:gap-8 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h3 className="flex-1 pr-2 text-[1.6rem] font-semibold leading-[1.08] tracking-[-0.04em] text-text-strong sm:text-card-title">
            {assignment.title}
          </h3>

          <Badge className="px-5 py-3 text-[1rem] sm:text-lg" variant={badgeVariantMap[assignment.badgeTone]}>
            {assignment.badgeLabel}
          </Badge>
        </div>

        <div className="space-y-4 text-[1.02rem] text-text-muted sm:text-[1.85rem]">
          <div className="flex items-center gap-4">
            <Clock3 className="h-6 w-6 shrink-0 text-[#556176] sm:h-8 sm:w-8" />
            <span>{assignment.timeLabel}</span>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-[#556176] sm:h-8 sm:w-8" />
            <span>{assignment.locationLabel}</span>
          </div>
        </div>

        {assignment.primaryActionLabel ? (
          <Button className="mt-1 text-[1.1rem] sm:text-[1.875rem]" variant="primary">
            {assignment.primaryActionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}