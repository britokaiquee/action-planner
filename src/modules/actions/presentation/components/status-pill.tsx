import type { PlannedStatus } from "@/modules/actions/domain/entities";
import { formatStatusLabel } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";

interface StatusPillProps {
  status: PlannedStatus;
}

export function StatusPill({ status }: StatusPillProps) {
  const variant =
    status === "andamento"
      ? "info"
      : status === "planejamento"
        ? "warning"
        : status === "concluida"
          ? "success"
          : "danger";

  return <Badge variant={variant}>{formatStatusLabel(status)}</Badge>;
}