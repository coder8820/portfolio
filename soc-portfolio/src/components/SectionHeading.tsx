export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <div className="flex items-center gap-2 font-mono text-xs text-accent mb-3">
        <span className="w-1.5 h-1.5 bg-accent rounded-full crt-dot" />
        <span className="tracking-widest uppercase">{eyebrow}</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-text font-mono">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
