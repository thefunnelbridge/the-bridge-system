export function BridgeSignalSvg({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 720 180" fill="none" aria-hidden="true">
      <path d="M48 118C138 42 238 42 328 118C418 194 518 194 672 54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <path d="M48 128C138 62 236 62 324 128C412 194 522 194 672 72" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity=".28" />
      <path d="M86 118H184M230 92H330M382 142H482M532 96H638" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".22" />
      {[86, 184, 230, 330, 382, 482, 532, 638].map((x, index) => (
        <circle key={x} cx={x} cy={index % 2 === 0 ? 118 : 92} r={index % 3 === 0 ? 6 : 4} fill="currentColor" opacity={index % 3 === 0 ? ".8" : ".46"} />
      ))}
    </svg>
  );
}

export function BridgeMiniGlyph({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 80" fill="none" aria-hidden="true">
      <path d="M14 56C36 24 58 24 80 56C102 88 124 88 146 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M31 56H54M68 44H92M106 56H129" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".42" />
      <circle cx="14" cy="56" r="5" fill="currentColor" />
      <circle cx="80" cy="56" r="5" fill="currentColor" />
      <circle cx="146" cy="24" r="5" fill="currentColor" />
    </svg>
  );
}
