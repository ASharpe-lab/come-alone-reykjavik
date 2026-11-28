"use client";

import Link from "next/link";
import EventCard from "@/components/organisms/EventCard/EventCard";
import { filterEvents, type EventFilters } from "@/lib/eventSearch";
import { useToday } from "@/lib/useToday";
import EventScroller from "./EventScroller";
import { featuredEvents } from "./featuredEvents";
import { usePublishedEvents } from "./usePublishedEvents";
import styles from "./EventsSection.module.css";

export default function EventResults({ filters }: { filters: EventFilters }) {
  const { events: published, loading } = usePublishedEvents();
  const today = useToday();
  const events = filterEvents([...published, ...featuredEvents], filters, today);
  const hasFilters = Boolean(filters.query || filters.category || filters.when !== "any-date" || filters.where);
  const searching = loading || (filters.when !== "any-date" && !today);

  return (
    <>
      {hasFilters && (
        <div className={styles.searchStatus}>
          <p role="status">
            {searching ? "Searching for events…" : events.length > 0
              ? `${events.length} ${events.length === 1 ? "event matches" : "events match"} your search.`
              : "No events match your search."}
          </p>
          <Link href="/#events">Clear filters</Link>
        </div>
      )}
      {events.length > 0 && (
        <EventScroller>
          <ul className={styles.cards}>
            {events.map((event) => (
              <li key={event.id}><EventCard event={event} /></li>
            ))}
          </ul>
        </EventScroller>
      )}
    </>
  );
}
