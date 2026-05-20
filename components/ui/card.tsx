import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-[color:var(--line)] bg-white/45 p-5 shadow-[0_18px_50px_rgba(10,10,10,0.04)] ${className}`}>
      {children}
    </section>
  );
}
