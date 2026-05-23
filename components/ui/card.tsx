import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  const hasCustomBackground = /\bbg-/.test(className) || className.includes("bridge-dark-wave") || className.includes("bridge-glass");
  const backgroundClass = hasCustomBackground ? "" : "bg-white/45";

  return (
    <section className={`rounded-xl border border-[color:var(--line)] ${backgroundClass} p-5 shadow-[0_18px_50px_rgba(10,10,10,0.045)] transition duration-300 ease-out ${className}`}>
      {children}
    </section>
  );
}
