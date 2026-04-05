import type { Metadata, Viewport } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Welcome | We're Glad You're Here",
  description:
    "Thank you for visiting! Watch a short message and let us know how we can connect with you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-cream antialiased">
        <div className="light-rays" aria-hidden="true" />
        <div className="cross-watermark" aria-hidden="true" />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
