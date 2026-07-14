import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1:1 Chat",
  description: "One-to-one chat app built with FastAPI + Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
