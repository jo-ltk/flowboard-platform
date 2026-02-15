import type { Metadata } from "next";
import { Inter, Syne, Instrument_Serif, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["project management", "task management", "SaaS", "productivity", "FlowBoard"],
  authors: [{ name: "FlowBoard" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

import { CommandPalette } from "@/components/system/CommandPalette";
import { Toaster } from "sonner";
import { DemoProvider } from "@/context/DemoContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${syne.variable} ${instrumentSerif.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen font-body antialiased">
        <DemoProvider>
          <CommandPalette />
          <Toaster />
          {children}
        </DemoProvider>
      </body>
    </html>
  );
}
