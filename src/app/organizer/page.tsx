import type { Metadata } from "next";
import { Tinos } from "next/font/google";
import OrganizationGreeting from "./OrganizationGreeting";
import OrganizerMetrics from "./OrganizerMetrics";
import OrganizerProgramme from "./OrganizerProgramme";
import styles from "./OrganizerStudio.module.css";

export const metadata: Metadata = { title: "Overview · KOMA Organizer Studio" };

const metricFont = Tinos({ subsets: ["latin"], weight: "400", variable: "--font-organizer-metric" });

export default function OrganizerOverview() {
  return (
    <main className={styles.workspace} aria-labelledby="organizer-heading">
      <p className={styles.eyebrow}>Organizer overview</p>
      <OrganizationGreeting id="organizer-heading" />
      <OrganizerMetrics fontClassName={metricFont.variable} />
      <OrganizerProgramme linkToEvents />
    </main>
  );
}
