import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-[var(--size-button)] w-full items-center justify-center rounded-cta px-6 text-lg font-semibold tracking-[-0.02em] transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 md:w-auto",
  {
    variants: {
      variant: {
        primary: "bg-gestor text-white shadow-button focus-visible:ring-gestor hover:bg-gestor-dark",
        secondary: "bg-tecnico text-white shadow-button focus-visible:ring-tecnico hover:bg-tecnico-dark",
        soft: "bg-card text-foreground ring-1 ring-border shadow-card focus-visible:ring-outline-strong",
        danger: "bg-danger text-white shadow-button focus-visible:ring-danger hover:bg-[#dd0008]",
      },
      size: {
        default: "h-16",
        lg: "h-16 px-8 text-[1.875rem]",
        icon: "h-14 w-14 rounded-full px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} type={type} {...props} />;
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };