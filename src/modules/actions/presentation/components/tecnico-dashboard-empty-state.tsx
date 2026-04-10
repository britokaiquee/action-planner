import { CalendarX2 } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/card";

interface TecnicoDashboardEmptyStateProps {
  title: string;
  description: string;
}

export function TecnicoDashboardEmptyState({ title, description }: TecnicoDashboardEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-4 p-6 sm:gap-5 sm:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-tecnico-soft text-tecnico sm:h-16 sm:w-16">
          <CalendarX2 className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-text-strong sm:text-[2rem]">{title}</h3>
          <p className="max-w-[34rem] text-[1rem] leading-relaxed text-text-muted sm:text-[1.35rem]">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}