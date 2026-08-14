export function GridTexture({
  color,
  size,
  opacity,
  className = "absolute inset-0",
}: {
  color: string;
  size: number;
  opacity: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
    />
  );
}
