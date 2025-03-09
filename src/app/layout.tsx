import type { Metadata } from "next";
import { Exo } from "next/font/google";
import "./globals.css";

const aguDisplay = Exo({
  weight: "variable",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QrScanner - TPP",
  description: "Built by @mainishanhoon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${aguDisplay.className} tracking-wide font-normal antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
