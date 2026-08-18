import Link from "next/link";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-dark shadow-sm shadow-accent/20 hover:shadow-md hover:shadow-accent/25",
  secondary:
    "bg-primary text-white hover:bg-primary-light",
  ghost:
    "bg-transparent text-primary border border-border hover:bg-surface hover:border-primary/20",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]";

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
  type,
  onClick,
  disabled = false,
}: {
  href?: string;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className} ${
    disabled ? "pointer-events-none opacity-50 hover:translate-y-0" : ""
  }`;

  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
