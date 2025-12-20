import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-lg font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-button hover:shadow-glow hover:-translate-y-1 active:translate-y-0 active:scale-95",
        secondary: "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-button hover:shadow-glow hover:-translate-y-1 active:translate-y-0 active:scale-95",
        success: "bg-gradient-to-r from-success to-success/90 text-success-foreground shadow-button hover:shadow-glow hover:-translate-y-1 active:translate-y-0 active:scale-95",
        accent: "bg-gradient-to-r from-accent to-accent/90 text-accent-foreground shadow-button hover:shadow-glow hover:-translate-y-1 active:translate-y-0 active:scale-95",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        game: "bg-gradient-to-br from-warning to-secondary text-foreground shadow-lg border-4 border-foreground/10 hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-14 px-8 py-3",
        sm: "h-10 rounded-xl px-4 text-sm",
        lg: "h-16 rounded-2xl px-10 text-xl",
        xl: "h-20 rounded-3xl px-12 text-2xl",
        icon: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
