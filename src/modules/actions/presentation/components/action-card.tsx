import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";

import type { ActionEntity } from "@/modules/actions/domain/entities";
import { formatDateRange } from "@/shared/lib/utils";
import { Card, CardContent } from "@/shared/ui/card";

import { StatusPill } from "./status-pill";

interface ActionCardProps {
  action: ActionEntity;
  href: string;
}

export function ActionCard({ action, href }: ActionCardProps) {
  return (
    <Link className="block transition-transform duration-200 hover:-translate-y-0.5" href={href}>
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:gap-8 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <h3 className="max-w-[18ch] text-[1.05rem] font-semibold leading-tight text-foreground sm:max-w-[16ch] sm:text-card-title">{action.title}</h3>
            <StatusPill status={action.plannedStatus} />
          </div>

          <div className="grid gap-2.5 text-[0.82rem] text-text-muted sm:grid-cols-2 sm:gap-5 sm:text-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <MapPin className="h-4 w-4 shrink-0 sm:h-6 sm:w-6" />
              <span>
                {action.city}, {action.local}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <CalendarDays className="h-4 w-4 shrink-0 sm:h-6 sm:w-6" />
              <span>{formatDateRange(action.startDate, action.endDate)}</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2 sm:justify-end sm:gap-3">
              <Users className="h-4 w-4 shrink-0 sm:h-6 sm:w-6" />
              <span>{action.technicians.length} tecnicos</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}