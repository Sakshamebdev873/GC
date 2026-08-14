export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : ""}>
      {eyebrow && (
        <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-accent-dark">
          {align === "center" && <span className="h-px w-8 bg-accent-dark/40" />}
          {eyebrow}
          {align === "center" && <span className="h-px w-8 bg-accent-dark/40" />}
        </p>
      )}
      <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-primary">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-muted">{description}</p>
      )}
    </div>
  );
}
