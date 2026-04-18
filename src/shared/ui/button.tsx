import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-14 w-full items-center justify-center rounded-panel px-6 text-base font-semibold transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 md:w-auto",
  {
    variants: {
      variant: {
        primary: "bg-gestor text-white shadow-card focus-visible:ring-gestor",
        secondary: "bg-tecnico text-white shadow-card focus-visible:ring-tecnico",
        soft: "bg-white text-foreground ring-1 ring-border focus-visible:ring-foreground",
        danger: "bg-danger text-white shadow-card focus-visible:ring-danger",
      },
      size: {
        default: "h-14",
        lg: "h-16 px-8 text-lg",
        icon: "h-12 w-12 rounded-full px-0",
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