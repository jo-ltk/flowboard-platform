import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-sage-deep text-cream hover:bg-sage-deep-dark active:bg-sage-deep shadow-soft hover:shadow-glow-blue",
  secondary:
    "bg-soft-blue text-sage-deep hover:bg-soft-blue-light active:bg-soft-blue shadow-soft",
  outline:
    "border border-border-blue bg-transparent text-sage-deep hover:bg-soft-blue/5 hover:border-soft-blue active:bg-soft-blue/10",
  ghost:
    "text-sage-deep/60 hover:bg-soft-blue/5 hover:text-sage-deep active:bg-soft-blue/10",
  accent:
    "bg-light-green text-sage-deep hover:bg-light-green-dark active:bg-light-green shadow-soft hover:shadow-glow-green",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs font-bold uppercase tracking-wider gap-2",
  md: "h-11 px-6 text-sm font-bold uppercase tracking-wider gap-2.5",
  lg: "h-14 px-8 text-base font-bold uppercase tracking-widest gap-3",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-md)] transition-all duration-300 ease-in-out select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-blue focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
