import { ReactNode } from "react";

type BadgeTone = "neutral" | "accent" | "success" | "primary";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-surface text-muted",
  accent: "bg-accent/10 text-accent-dark",
  success: "bg-success/10 text-success",
  primary: "bg-primary/10 text-primary",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: BadgeTone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
