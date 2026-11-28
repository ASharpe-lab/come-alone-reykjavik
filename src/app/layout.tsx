import type { Metadata } from "next";
import { Geist } from "next/font/google";
import GoingLoginProvider from "@/components/organisms/VisitorLogin/GoingLoginProvider";
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
        <GoingLoginProvider>{children}</GoingLoginProvider>
      </body>
    </html>
  );
}
