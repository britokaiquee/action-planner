import { AlertCircle, UserRound } from "lucide-react";

import type { ActionEntity } from "@/modules/actions/domain/entities";
import { formatCurrency } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";

interface TeamListCardProps {
  action: ActionEntity;
}

export function TeamListCard({ action }: TeamListCardProps) {
  return (
    <div className="space-y-4">
      {action.technicians.map((technician) => {
        const allocationWithConflict = action.dailyAllocations.find(
          (allocation) => allocation.technicianId === technician.id && allocation.hasTechnicianConflict,
        );

        return (
          <Card key={technician.id}>
            <CardContent className="space-y-3 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold text-foreground">{technician.name}</p>
                  <p className="text-sm text-text-muted">{technician.specialty}</p>
                </div>
                <div className="flex items-center gap-2 text-gestor">
                  <UserRound className="h-5 w-5" />
                  <span className="text-sm font-medium">{formatCurrency(technician.dailyCost)}</span>
                </div>
              </div>

              <p className="text-sm text-text-muted">{technician.city}</p>

              {allocationWithConflict ? (
                <div className="flex items-start gap-3 rounded-field bg-warning p-4 text-[#ba6b00]">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div className="space-y-2">
                    <Badge variant="warning">Conflito de agenda</Badge>
                    <p className="text-sm">{allocationWithConflict.notes ?? "Existe outra alocacao ativa para este tecnico na mesma data."}</p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}