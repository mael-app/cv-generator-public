import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";

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
          <main className="container mx-auto px-4 py-8 max-w-6xl">
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
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
