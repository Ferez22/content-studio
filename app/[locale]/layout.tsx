import type { Metadata } from "next";
import { EB_Garamond, Inter, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";
import { NewsletterToast } from "@/components/newsletter-toast";
import { UntranslatedPathsProvider } from "@/components/untranslated-paths";
import { getUntranslatedPaths } from "@/lib/content";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    metadataBase: new URL(site.url),
    title: { default: t("siteTitle"), template: "%s | Qartmina" },
    description: t("siteDescription"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning className="motion-safe:scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${inter.variable} ${garamond.variable} antialiased  `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <UntranslatedPathsProvider value={await getUntranslatedPaths(routing.locales)}>
            <main className="bg-background text-foreground">
              <Navbar />
              {children}
              <Footer />
            </main>
            <ChatWidget />
            <NewsletterToast />
            </UntranslatedPathsProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
