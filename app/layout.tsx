import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Inter as FontSans } from "next/font/google";

import { cn } from "../lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

/* export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
}); */

export const metadata: Metadata = {
  title: "Support",
  description: "Powered by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background font-sans antialiased w-full h-screen",
          /*  fontSans.variable, */
          inter.className
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
