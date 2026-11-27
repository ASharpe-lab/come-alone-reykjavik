import type { Metadata } from "next";
import { Tinos } from "next/font/google";
import OrganizerProgramme from "./OrganizerProgramme";
import styles from "./OrganizerStudio.module.css";

export const metadata: Metadata = { title: "Overview · KOMA Organizer Studio" };

const metricFont = Tinos({ subsets: ["latin"], weight: "400", variable: "--font-organizer-metric" });

const metrics = [
  { label: "Upcoming events", value: "2", note: "1 pending review" },
  { label: "Total attendees", value: "37", note: "Across all events" },
  { label: "Interested", value: "84", note: "+12 this week" },
];

export default function OrganizerOverview() {
  return (
    <main className={styles.workspace} aria-labelledby="organizer-heading">
      <p className={styles.eyebrow}>Organizer overview</p>
      <h1 id="organizer-heading">Good morning,<br />Leir Studio.</h1>
      <dl className={`${styles.metrics} ${metricFont.variable}`}>
        {metrics.map(({ label, value, note }) => (
          <div className={styles.metric} key={label}>
            <dt>{label}</dt>
            <dd className={styles.metricValue}>{value}</dd>
            <dd className={styles.metricNote}>{note}</dd>
          </div>
        ))}
      </dl>
      <OrganizerProgramme linkToEvents />
    </main>
  );
}
