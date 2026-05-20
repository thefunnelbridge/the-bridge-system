import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Bridge System™ by The Funnel Bridge™",
  description:
    "Plataforma de inteligencia aplicada para detectar puntos de fuga, priorizar acciones y operar con más claridad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
