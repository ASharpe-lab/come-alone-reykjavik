"use client";

import { useEffect, useState } from "react";
import { readPublishedEvents, subscribeToPublishedEvents, type PublishedEvent } from "@/lib/publishedEvents";

const noEvents: PublishedEvent[] = [];

export function usePublishedEvents(reloadKey?: string) {
  const [events, setEvents] = useState<PublishedEvent[] | null>(null);

  useEffect(() => {
    let active = true;
    let latestRead = 0;

    function refresh() {
      const read = ++latestRead;
      void readPublishedEvents().then((published) => {
        if (active && read === latestRead) setEvents(published);
      }).catch(() => {
        if (active && read === latestRead) setEvents([]);
      });
    }

    const unsubscribe = subscribeToPublishedEvents(refresh);
    refresh();
    return () => {
      active = false;
      unsubscribe();
    };
  }, [reloadKey]);

  return { events: events ?? noEvents, loading: events === null };
}
