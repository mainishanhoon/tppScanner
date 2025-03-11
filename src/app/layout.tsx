import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const aguDisplay = Rubik({
  weight: 'variable',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'QrScanner - TPP',
  description: 'Built by @mainishanhoon',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${aguDisplay.className} font-normal tracking-wide antialiased`}
      >
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          className={`${aguDisplay.className} font-bold`}
        />
      </body>
    </html>
  );
}
