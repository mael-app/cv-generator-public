import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CV Generator",
  description:
    "Generate a professionally styled CV/Resume PDF with dynamic brand color extraction.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-7xl">
            {children}
          </main>
          <footer className="border-t mt-12 py-4 text-center text-sm text-muted-foreground">
            Made by{" "}
            <a
              href="https://github.com/mael-app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              Maël
            </a>{" "}
            with ❤️ —{" "}
            <a
              href="https://github.com/mael-app/cv-generator-public"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              Source code
            </a>
            <span className="mx-2 text-muted-foreground/40">·</span>
            <a
              href="/privacy"
              className="hover:text-foreground hover:underline transition-colors"
            >
              Privacy
            </a>
            <span className="mx-2 text-muted-foreground/40">·</span>
            <a
              href="/legal"
              className="hover:text-foreground hover:underline transition-colors"
            >
              Legal
            </a>
          </footer>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
