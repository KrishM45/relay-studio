import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Relay Studio — Research once. Create everywhere.",
  description: "Relay Studio is an AI-powered research workspace built specifically for knowledge creators. Research, organize, and transform knowledge inside one workspace.",
  keywords: ["research", "creator", "AI research", "workspace", "scripts", "Notion alternative"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="font-sans antialiased text-foreground bg-background">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
