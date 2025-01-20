import type { Metadata } from "next";
import { Inter, Quicksand } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-inter",
});

const quicksand = Quicksand({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand'
});

export const metadata: Metadata = {
  title: "Checkout Asaas",
  description: "Checkout para pagamentos via Asaas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${quicksand.variable} ${inter.variable}`}>
      <body className="antialiased font-quicksand">
        {children}
      </body>
    </html>
  );
}
