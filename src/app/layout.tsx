import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies, headers } from "next/headers";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Lang } from "@/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CV Generator",
  description:
    "Generate a professionally styled CV/Resume PDF with dynamic brand color extraction.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieLang = cookieStore.get("lang")?.value as Lang | undefined;
  const acceptLanguage = headerStore.get("accept-language") ?? "";
  const browserLang = acceptLanguage.startsWith("fr") ? "fr" : "en";
  const defaultLang: Lang =
    cookieLang === "fr" || cookieLang === "en" ? cookieLang : browserLang;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider defaultLang={defaultLang}>
            <Navbar />
            <main className="container mx-auto px-4 py-8 max-w-7xl">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
