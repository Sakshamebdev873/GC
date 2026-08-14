import Link from "next/link";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-dark shadow-sm shadow-accent/20",
  secondary:
    "bg-primary text-white hover:bg-primary-light",
  ghost:
    "bg-transparent text-primary border border-border hover:bg-surface",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors whitespace-nowrap";

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
  type,
}: {
  href?: string;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
}) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} className={classes}>
      {children}
    </button>
  );
}
