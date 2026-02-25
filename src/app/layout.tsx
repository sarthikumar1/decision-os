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

export const metadata: Metadata = {
  title: "Decision OS — Structured Decision-Making Tool",
  description:
    "A structured decision-making tool. Define options, criteria, weights, and scores to find the best choice with sensitivity analysis.",
  keywords: [
    "decision making",
    "weighted scoring",
    "multi-criteria analysis",
    "sensitivity analysis",
    "decision engine",
    "productivity",
  ],
  metadataBase: new URL("https://decision-os-hazel.vercel.app"),
  openGraph: {
    title: "Decision OS — Structured Decision-Making Tool",
    description:
      "Define options, criteria, and scores. See rankings, breakdowns, and sensitivity analysis.",
    url: "https://decision-os-hazel.vercel.app",
    siteName: "Decision OS",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Decision OS — Structured Decision-Making Tool",
    description:
      "Define options, criteria, and scores. See rankings, breakdowns, and sensitivity analysis.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
