import { AlertCircle, Truck } from "lucide-react";

import type { CommonResource } from "@/modules/actions/domain/entities";
import { formatCurrency } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";

interface ResourceListCardProps {
  resources: CommonResource[];
}

export function ResourceListCard({ resources }: ResourceListCardProps) {
  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <Card key={resource.id}>
          <CardContent className="flex items-start justify-between gap-4 p-6">
            <div className="space-y-2">
              <p className="text-2xl font-semibold text-foreground">{resource.label}</p>
              {resource.description ? <p className="text-lg text-text-muted">{resource.description}</p> : null}
              <p className="text-xl font-medium text-gestor">{formatCurrency(resource.cost)}</p>
              {resource.hasConflict ? (
                <div className="flex items-start gap-3 rounded-field bg-danger-soft p-4 text-danger">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div className="space-y-2">
                    <Badge variant="danger">Conflito de veiculo</Badge>
                    <p className="text-sm">Este recurso aparece em outra acao no mesmo intervalo previsto.</p>
                  </div>
                </div>
              ) : null}
            </div>

            {resource.type === "veiculo" ? <Truck className="mt-1 h-7 w-7 text-text-soft" /> : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}