import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://closernet.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CloserNet — Peer-to-Peer Marketplace with Escrow & Low Fees",
  description:
    "Sell used goods on CloserNet with ~5% total fees, built-in escrow protection, and smart shipping estimates. A simpler alternative to eBay for collectibles, electronics, and more.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "CloserNet — Closer to Real Value. Protected by Escrow.",
    description:
      "Peer-to-peer marketplace with ~5% total fees, escrow protection, and shipping tools built in.",
    siteName: "CloserNet",
  },
  twitter: {
    card: "summary_large_image",
    title: "CloserNet — Closer to Real Value. Protected by Escrow.",
    description:
      "Peer-to-peer marketplace with ~5% total fees, escrow protection, and shipping tools built in.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
