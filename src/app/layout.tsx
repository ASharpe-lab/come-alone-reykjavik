import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Footer from "@/components/organisms/Footer/Footer";
import Header from "@/components/organisms/Header/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KOMA — Come Alone Reykjavík",
  description: "Find your way into the city.",
  icons: {
    icon: "/koma-mark.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>
        <Header
          links={[
            { label: "Events", href: "#events" },
            { label: "City stories", href: "#city-stories" },
          ]}
        />
        {children}
        <Footer
          links={[
            { label: "Events", href: "#events" },
            { label: "City stories", href: "#city-stories" },
          ]}
          tagline="Come as you are. Leave knowing the city a little better."
          copyright="Made for Reykjavík · 2025"
        />
      </body>
    </html>
  );
}
