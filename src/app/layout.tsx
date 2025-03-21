import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const rubik = Montserrat({
  weight: 'variable',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CheckIn System - TPP',
  description: 'Built by @mainishanhoon',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.className} font-normal tracking-wider antialiased`}>
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          className={`${rubik.className} font-bold`}
        />
      </body>
    </html>
  );
}
