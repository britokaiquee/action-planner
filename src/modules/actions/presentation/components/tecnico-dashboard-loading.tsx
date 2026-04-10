import { CalendarDays } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/card";

export function TecnicoDashboardLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-text-strong">
          <CalendarDays className="h-7 w-7 text-tecnico sm:h-9 sm:w-9" />
          <div className="h-8 w-56 rounded-full bg-surface-neutral sm:h-12" />
        </div>

        <LoadingCard hasButton />
      </section>

      <section className="space-y-4">
        <div className="h-8 w-56 rounded-full bg-surface-neutral sm:h-12" />
        <LoadingCard />
      </section>
    </div>
  );
}

function LoadingCard({ hasButton = false }: { hasButton?: boolean }) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:space-y-8 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="h-20 w-48 rounded-[1.5rem] bg-surface-neutral sm:h-24 sm:w-72" />
          <div className="h-12 w-28 rounded-full bg-surface-neutral sm:h-16 sm:w-40" />
        </div>

        <div className="space-y-4">
          <div className="h-8 w-48 rounded-full bg-surface-neutral sm:h-10 sm:w-64" />
          <div className="h-8 w-full rounded-full bg-surface-neutral sm:h-10" />
        </div>

        {hasButton ? <div className="h-16 w-full rounded-cta bg-surface-neutral" /> : null}
      </CardContent>
    </Card>
  );
}