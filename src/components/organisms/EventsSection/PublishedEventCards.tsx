"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/organisms/EventCard/EventCard";
import { readPublishedEvents, type PublishedEvent } from "@/lib/publishedEvents";

export default function PublishedEventCards() {
  const [events, setEvents] = useState<PublishedEvent[]>([]);

  useEffect(() => {
    let active = true;
    void readPublishedEvents().then((published) => {
      if (active) setEvents(published);
    }).catch(() => {
      if (active) setEvents([]);
    });
    return () => { active = false; };
  }, []);

  return events.map((event) => (
    <li key={event.id}>
      <EventCard event={event} />
    </li>
  ));
}
