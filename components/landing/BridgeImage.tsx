import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

type BridgeImageProps = {
  src: string;
  alt: string;
  label: string;
  priority?: boolean;
  className?: string;
};

export function BridgeImage({
  src,
  alt,
  label,
  priority = false,
  className = "",
}: BridgeImageProps) {
  const publicPath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  const exists = fs.existsSync(publicPath);

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-[color:var(--line)] bg-bone-2 shadow-soft ${className}`}
    >
      {exists ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(circle_at_25%_15%,rgba(255,59,31,0.16),transparent_32%),linear-gradient(135deg,#F5F1EA,#DDD6C6)] p-5">
          <div className="flex items-center justify-between font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-copper">
            <span>Imagen preparada</span>
            <span>◢</span>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold leading-none text-ink">
              {label}
            </p>
            <p className="mt-3 max-w-sm font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.12em] text-fog">
              Reemplazar en {src}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
