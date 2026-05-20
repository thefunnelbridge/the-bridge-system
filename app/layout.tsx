import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Bridge System™ by The Funnel Bridge™",
  description:
    "Plataforma de inteligencia aplicada para detectar puntos de fuga, priorizar acciones y operar con más claridad.",
  manifest: "/manifest.json",
  icons: {
    icon: "/bridge-icon.svg",
    apple: "/bridge-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F1EA",
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
