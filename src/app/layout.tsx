import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Message Intent Translator",
  description: "Subconscious Communication Layer Analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
