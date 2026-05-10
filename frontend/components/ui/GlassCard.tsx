import type React from "react";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      className={
        "glass-panel soft-card rounded-[24px] bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 " +
        className
      }
    >
      {children}
    </div>
  );
}

