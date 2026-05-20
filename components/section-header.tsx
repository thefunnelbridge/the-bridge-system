export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] text-copper">{eyebrow}</p> : null}
      <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">{title}</h1>
      {description ? <p className="mt-3 text-base leading-7 text-fog">{description}</p> : null}
    </div>
  );
}
