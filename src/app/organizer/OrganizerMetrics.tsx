"use client";

import { featuredEvents } from "@/components/organisms/EventsSection/featuredEvents";
import { usePublishedEvents } from "@/components/organisms/EventsSection/usePublishedEvents";
import { useToday } from "@/lib/useToday";
import { useVisitorEventTotals } from "@/lib/visitorEventPreferences";
import { defaultOrganizerKey, useOrganizerAccountKey } from "./organizationProfile";
import styles from "./OrganizerStudio.module.css";

const leirStudioEvent = featuredEvents.find((event) => event.id === "clay-cups-and-coffee");

export default function OrganizerMetrics({ fontClassName }: { fontClassName: string }) {
  const organizerKey = useOrganizerAccountKey();
  const { events: published } = usePublishedEvents();
  const today = useToday();
  const owned = published.filter((event) => (event.organizerKey ?? defaultOrganizerKey) === organizerKey);
  const events = organizerKey === defaultOrganizerKey && leirStudioEvent ? [...owned, leirStudioEvent] : owned;
  const upcoming = events.filter((event) => today && event.startDate && event.startDate >= today).length;
  const totals = useVisitorEventTotals(new Set(events.map((event) => event.id)));

  const metrics = [
    { label: "Upcoming events", value: upcoming, note: "Published from today onward" },
    { label: "Total attendees", value: totals.going, note: "Going responses in this browser" },
    { label: "Interested", value: totals.saved, note: "Saves in this browser" },
  ];

  return (
    <dl className={`${styles.metrics} ${fontClassName}`}>
      {metrics.map(({ label, value, note }) => (
        <div className={styles.metric} key={label}>
          <dt>{label}</dt>
          <dd className={styles.metricValue}>{value}</dd>
          <dd className={styles.metricNote}>{note}</dd>
        </div>
      ))}
    </dl>
  );
}
