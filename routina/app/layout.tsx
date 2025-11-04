import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AuthProvider } from "@/components/auth-provider";
import { PostHogProvider } from "@/lib/analytics";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Routina - AI-Powered Routine Builder & Habit Coach",
  description: "Generate and follow adaptive daily routines to improve consistency and focus with AI-powered routine generation and habit tracking.",
  keywords: ["routine builder", "habit tracker", "AI productivity", "daily planner", "time management"],
  authors: [{ name: "MiniMax Agent" }],
  openGraph: {
    title: "Routina - AI-Powered Routine Builder",
    description: "Generate and follow adaptive daily routines with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <Suspense fallback={null}>
          <PostHogProvider>
            <Providers>
              <AuthProvider>
                {children}
              </AuthProvider>
            </Providers>
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
