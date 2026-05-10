import type { ReactNode } from "react";

type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "destructive" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success/10 text-success",
  warning: "bg-accent/10 text-accent-foreground",
  destructive: "bg-destructive/10 text-destructive",
  outline: "border border-border bg-transparent text-foreground"
};

function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeProps, type BadgeVariant };
