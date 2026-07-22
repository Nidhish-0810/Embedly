import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Embedly - Custom AI Agent Builder",
  description: "Create and embed custom AI chatbots trained on your data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-slate-900 bg-slate-50 dark:bg-slate-950 dark:text-slate-50">
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
        <Toaster richColors position="top-center" theme="system" />
      </body>
    </html>
  );
}
