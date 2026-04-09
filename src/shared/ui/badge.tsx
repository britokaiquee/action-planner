import type { ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-4 py-2.5 text-base font-medium tracking-[-0.01em]", {
  variants: {
    variant: {
      info: "bg-info text-tecnico",
      warning: "bg-warning text-[#ba6b00]",
      success: "bg-success text-gestor",
      neutral: "bg-surface-neutral text-text-muted",
      danger: "bg-danger-soft text-danger",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: ReactNode;
}

export function Badge({ children, className, variant }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}