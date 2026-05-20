export function FlowTimeline({ steps }: { steps: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-6">
      {steps.map((step, index) => (
        <div key={step} className="rounded-lg border border-[color:var(--line)] bg-white/45 p-4">
          <span className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">0{index + 1}</span>
          <p className="mt-3 text-base font-semibold text-ink">{step}</p>
        </div>
      ))}
    </div>
  );
}
