import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  tone: "gestor" | "tecnico";
}

export function MetricCard({ title, value, icon: Icon, tone }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex min-h-[7.5rem] flex-col items-center justify-center gap-2 text-center sm:min-h-52 sm:gap-4">
        <div className={tone === "gestor" ? "text-gestor" : "text-tecnico"}>
          <Icon className="h-7 w-7 sm:h-12 sm:w-12" />
        </div>
        <div>
          <p className="text-[1.75rem] font-semibold text-foreground sm:text-metric-value">{value}</p>
          <p className="mt-1 text-[0.75rem] text-text-muted sm:mt-3 sm:text-xl">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}