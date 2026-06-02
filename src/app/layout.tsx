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
  title: "消息意图翻译 Agent",
  description: "中文办公沟通意图分析与回复生成工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={geistSans.variable + " " + geistMono.variable + " h-full antialiased"}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
