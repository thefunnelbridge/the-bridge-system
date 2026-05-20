import type { ReactNode } from "react";

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="tfb-kicker">{children}</p>;
}

export function SectionHeader({
  kicker,
  title,
  children,
  className = "",
}: {
  kicker: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-6 ${className}`}>
      <Kicker>{kicker}</Kicker>
      <h2 className="tfb-h2">{title}</h2>
      {children ? (
        <div className="max-w-3xl space-y-5 text-lg leading-8 text-ink/75 sm:text-xl">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function EditorialQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-2 border-ember pl-5 font-display text-2xl font-semibold italic leading-tight text-copper sm:text-3xl">
      {children}
    </blockquote>
  );
}

export function PillNumber({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-bone font-mono text-[0.7rem] font-bold text-copper">
      {children}
    </span>
  );
}
