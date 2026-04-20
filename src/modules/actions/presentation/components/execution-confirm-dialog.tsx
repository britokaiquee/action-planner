import type { ReactNode } from "react";

import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

interface ExecutionConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  icon?: ReactNode;
  variant?: "secondary" | "danger";
}

export function ExecutionConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  isSubmitting = false,
  icon,
  variant = "secondary",
}: ExecutionConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="animate-dialog-overlay fixed inset-0 z-50 flex items-end justify-center bg-[#101828]/38 px-4 pb-6 pt-8 sm:items-center sm:px-6">
      <Card className="animate-dialog-sheet-mobile w-full max-w-[27rem] rounded-[1.4rem] border-[#d9dfe8] shadow-[0_10px_28px_rgba(16,24,40,0.12)] sm:animate-dialog-sheet-desktop sm:shadow-[0_8px_22px_rgba(16,24,40,0.1)]">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="space-y-3">
            {icon ? <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4ff] text-tecnico">{icon}</div> : null}
            <div className="space-y-2">
              <h2 className="text-[1.3rem] font-semibold leading-tight tracking-[-0.04em] text-text-strong">{title}</h2>
              <p className="text-[0.98rem] leading-relaxed text-text-muted">{description}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <Button className="sm:min-w-[10rem]" disabled={isSubmitting} onClick={onConfirm} variant={variant}>
              {confirmLabel}
            </Button>
            <Button className="bg-white text-text-strong ring-1 ring-border hover:bg-[#f8f9fc] sm:min-w-[9rem]" disabled={isSubmitting} onClick={onCancel}>
              {cancelLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}