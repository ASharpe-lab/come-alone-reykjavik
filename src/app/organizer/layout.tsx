import { Bebas_Neue, Permanent_Marker, Space_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import OrganizerIdentity from "./OrganizerIdentity";
import OrganizerSidebar from "./OrganizerSidebar";
import styles from "./OrganizerStudio.module.css";

const display = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-organizer-display" });
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-organizer-marker" });
const text = Space_Grotesk({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-organizer-text" });

export default function OrganizerLayout({ children }: LayoutProps<"/organizer">) {
  return (
    <div className={`${styles.studio} ${display.variable} ${marker.variable} ${text.variable}`}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="KOMA home">
          <Image src="/koma-mark.svg" alt="" width={53} height={50} />
          KOMA
        </Link>
        <p className={styles.studioLabel}>Organizer Studio</p>
        <OrganizerIdentity />
      </header>
      <div className={styles.layout}>
        <OrganizerSidebar />
        {children}
      </div>
    </div>
  );
}
