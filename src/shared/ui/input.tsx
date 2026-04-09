import * as React from "react";

import { cn } from "@/shared/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "h-[var(--size-field)] w-full rounded-field border border-border bg-card px-5 text-lg text-foreground outline-none transition focus:border-outline-strong focus:ring-2 focus:ring-tecnico/15",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";