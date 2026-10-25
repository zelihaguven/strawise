import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

const body = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "STRAWISE — Doğru pipet, doğru işletmeye",
  description:
    "Kafe ve restoranlar için: 'sorulmadan verilmez' ile pipet tasarrufunu hesapla, doğrulanmış alternatif malzemeyi seç, tedarikçi iddiasını yapay zekâ ile denetle.",
};

export const viewport: Viewport = {
  themeColor: "#f7f5ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
