import { Bebas_Neue, Permanent_Marker, Space_Grotesk, Tinos } from "next/font/google";
import EventSearch from "@/components/organisms/EventSearch/EventSearch";
import { parseEventFilters } from "@/lib/eventSearch";
import EventResults from "./EventResults";
import styles from "./EventsSection.module.css";

const displayFont = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-events-display",
});

const markerFont = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-events-marker",
});

const textFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-events-text",
});

const dateFont = Tinos({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-events-date",
});

type EventsSectionProps = {
  filters?: Record<string, string | string[] | undefined>;
};

export default function EventsSection({ filters = {} }: EventsSectionProps) {
  const search = parseEventFilters(filters);

  return (
    <section
      className={`${styles.events} ${displayFont.variable} ${markerFont.variable} ${textFont.variable} ${dateFont.variable}`}
      id="events"
      aria-labelledby="events-heading"
    >
      <EventSearch {...search} />
      <div className={styles.content}>
        <div className={styles.headingRow}>
          <div>
            <p className={styles.eyebrow}>Happening soon</p>
            <h2 className={styles.heading} id="events-heading">
              Something to look forward to
            </h2>
          </div>
          <p className={styles.intro}>
            Handpicked happenings around Reykjavík—easy to join, worth leaving home for.
          </p>
        </div>
        <EventResults filters={search} />
      </div>
    </section>
  );
}
