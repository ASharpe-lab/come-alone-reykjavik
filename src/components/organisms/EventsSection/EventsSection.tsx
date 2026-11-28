import { Bebas_Neue, Permanent_Marker, Space_Grotesk, Tinos } from "next/font/google";
import EventCard from "@/components/organisms/EventCard/EventCard";
import EventSearch from "@/components/organisms/EventSearch/EventSearch";
import EventScroller from "./EventScroller";
import PublishedEventCards from "./PublishedEventCards";
import { featuredEvents } from "./featuredEvents";
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
  const { q, when, where } = filters;

  return (
    <section
      className={`${styles.events} ${displayFont.variable} ${markerFont.variable} ${textFont.variable} ${dateFont.variable}`}
      id="events"
      aria-labelledby="events-heading"
    >
      <EventSearch
        query={typeof q === "string" ? q : undefined}
        when={typeof when === "string" ? when : undefined}
        where={typeof where === "string" ? where : undefined}
      />
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
        {q !== undefined && (
          <p className={styles.searchStatus}>Search and filters aren’t connected yet.</p>
        )}
        <EventScroller>
          <ul className={styles.cards}>
            <PublishedEventCards />
            {featuredEvents.map((event) => (
              <li key={event.title}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        </EventScroller>
      </div>
    </section>
  );
}
