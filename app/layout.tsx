import type { Metadata } from "next";
import { Dosis } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import FloatingButtons from "@/components/FloatingButtons";
import { Toaster } from "sonner";

const dosis = Dosis({
  variable: "--font-dosis",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mainuddin's Project Directory",
  description: "Explore Mainuddin's Creations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dosis.variable} antialiased`}>
        <ThemeProvider attribute="data-theme" defaultTheme="system">
          <div className="w-full max-sm:px-4 sm:max-w-[80%] mx-auto">
            {children}
            <FloatingButtons />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
