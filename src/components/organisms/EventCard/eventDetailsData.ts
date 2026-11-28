import type { EventCardData } from "./EventCard";

export default function eventDetailsData(event: EventCardData) {
  return {
    id: event.id,
    title: event.title,
    image: event.image,
    imageAlt: event.imageAlt,
    dateLabel: `${event.weekday} · ${event.day}`,
    category: event.category,
    metadata: [
      { label: "Time", value: event.schedule, icon: "/featured-events/clock.svg" },
      { label: "Place", value: event.venue, icon: "/featured-events/location.svg" },
    ],
    tags: event.tags,
    price: event.price,
    description: event.description,
  };
}
