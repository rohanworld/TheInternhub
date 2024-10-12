import type { Metadata } from "next";
import { Golos_Text } from 'next/font/google';
import "./globals.css";
import "./custom.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider as ThemeProvider } from "next-themes";
import Providers from "@/components/ThemeProvider";
import { StoreProvider } from "@/store/StoreProvider";
import GTMWrapper from '@/components/GTMWrapper';
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const Golos_init = Golos_Text({
  subsets: ['cyrillic', 'cyrillic-ext', 'latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--golos-text',
});

export const metadata: Metadata = {
  title: "Internhub",
  description: "The forest for your internship hunt",
  icons: "logo.png",  // Updated icon path
  openGraph: {
    title: "Internhub",
    description: "The forest for your internship hunt",
    type: "website",
    locale: "en_US",
    url: "https://intern-hub-rosy.vercel.app/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const bodyClass = `antialiased min-h-screen pt-12 ${Golos_init.variable}`;
  return (
    <StoreProvider>
      <html lang="en">
        <body className={bodyClass}>
          <Providers>
            <Navbar />
            <GTMWrapper />
            <div className="h-full lg:pt-4 bg-custom-gradient-light dark:bg-custom-gradient-dark">
              {children}
              <Footer />
            </div>
            <Toaster />
          </Providers>
        </body>
      </html>
    </StoreProvider>
  );
}