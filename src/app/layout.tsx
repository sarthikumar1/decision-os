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
  keywords: ["decision making", "weighted scoring", "multi-criteria analysis", "sensitivity analysis"],
  openGraph: {
    title: "Decision OS — Structured Decision-Making Tool",
    description: "Define options, criteria, and scores. See rankings, breakdowns, and sensitivity analysis.",
    type: "website",
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
