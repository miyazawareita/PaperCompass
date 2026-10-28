import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { CompassIcon } from "./components/Icons";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "最新のAI論文から読む1本を見つける。arXivの新着論文をピックアップし、AIが日本語要約・難易度・重要キーワードを解説します。情報系の学部生のための論文選びアプリ。";

export const metadata: Metadata = {
  title: {
    default: "PaperCompass — 今週読むAI論文が見つかる",
    template: "%s | PaperCompass",
  },
  description,
  openGraph: {
    title: "PaperCompass — 今週読むAI論文が見つかる",
    description,
    siteName: "PaperCompass",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PaperCompass — 今週読むAI論文が見つかる",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1017" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-20 border-b border-line bg-background/80 backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-fg">
                <CompassIcon className="size-5" />
              </span>
              PaperCompass
            </Link>
            <span className="hidden text-sm text-muted sm:block">
              情報系学部生のための論文コンパス
            </span>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-line">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>
              論文データ:{" "}
              <a href="https://arxiv.org" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                arXiv
              </a>
              {" "}（Thank you to arXiv for use of its open access interoperability.）
            </p>
            <p>AI解説: Google Gemini ・ © 2026 PaperCompass</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
