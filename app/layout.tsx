import type { Metadata } from "next";
import { AppNavigation } from "@/components/app-navigation";
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
      <body>
        <AppNavigation />
        <main className="px-4 py-8 sm:px-6 lg:ml-72 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
