import type { Metadata, Viewport } from "next";
import { Noto_Sans_Arabic, Noto_Sans_Gurmukhi, Source_Code_Pro, Source_Sans_3, Syne } from "next/font/google";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const sans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

const mono = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500", "600"],
});

const ar = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-ar",
  weight: ["400", "700"],
});

const pa = Noto_Sans_Gurmukhi({
  subsets: ["gurmukhi"],
  variable: "--font-pa",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Firebreak — See what's ahead, and look after each other",
  description:
    "A calm 24-hour wildfire outlook for Alberta communities: live hotspots, wind-driven spread, neighbourly briefings, and safer roads. A planning companion, not an official warning.",
  applicationName: "Firebreak",
  authors: [{ name: "STEMergent Hacks 2026 — SAIT Software Development" }],
  keywords: ["wildfire", "Alberta", "Jasper", "evacuation", "FIRMS", "CWFIS"],
};

export const viewport: Viewport = {
  themeColor: "#080605",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-lang="en">
      <body className={`${display.variable} ${sans.variable} ${mono.variable} ${ar.variable} ${pa.variable}`}>
        {children}
      </body>
    </html>
  );
}
