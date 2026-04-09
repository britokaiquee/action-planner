import * as React from "react";

import { cn } from "@/shared/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "min-h-36 w-full rounded-field border border-border bg-card px-5 py-4 text-lg text-foreground outline-none transition focus:border-outline-strong focus:ring-2 focus:ring-tecnico/15",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";