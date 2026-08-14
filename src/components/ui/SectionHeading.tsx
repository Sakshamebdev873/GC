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
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-dark">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-primary">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-muted">{description}</p>
      )}
    </div>
  );
}
