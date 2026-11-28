import type { Metadata } from "next";
import { Bebas_Neue, Permanent_Marker, Space_Grotesk, Tinos } from "next/font/google";
import Footer from "@/components/organisms/Footer/Footer";
import VisitorAccount, { VisitorLogout } from "./VisitorAccount";
import styles from "./VisitorAccount.module.css";

export const metadata: Metadata = { title: "My account · KOMA" };

const display = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-events-display" });
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-events-marker" });
const text = Space_Grotesk({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-events-text" });
const date = Tinos({ subsets: ["latin"], weight: "400", variable: "--font-events-date" });

export default function AccountPage() {
  return (
    <div className={`${styles.account} ${display.variable} ${marker.variable} ${text.variable} ${date.variable}`}>
      <VisitorAccount />
      <Footer links={[]}>
        <VisitorLogout />
      </Footer>
    </div>
  );
}
