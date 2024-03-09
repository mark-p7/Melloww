import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Mellow",
  description: "Emotional Journal and Mood Tracker App for Mental Health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={cn("", poppins.variable)}>{children}</body>
      </UserProvider>
    </html>
  );
}
