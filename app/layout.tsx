import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/src/components/ui/sonner";
import { ThemeProvider } from "@/src/components/theme-provider";

const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

export const metadata: Metadata = {
  title: "The Intimacy Camp 2026",
  description: "Raising a Pure Breed Of Mighty Men.",
  icons: {
    icon: '/images/20230803_194307_0000.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}





