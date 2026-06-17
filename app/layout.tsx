import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nameless Intelligence",
  description: "Signal before noise for emerging digital tribes and opportunity clusters.",
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
