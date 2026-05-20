import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

const styles = {
  primary: "border-ink bg-ink text-bone hover:bg-ember hover:border-ember",
  secondary: "border-[color:var(--line)] bg-bone text-ink hover:border-copper hover:bg-bone-2",
  ghost: "border-transparent bg-transparent text-ink hover:bg-bone-2",
};

export function Button({ href, variant = "primary", className = "", children, ...props }: ButtonProps) {
  const classes = `inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em] transition ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
