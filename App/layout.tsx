import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Match App",
  description: "Recruiter CV screening app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
