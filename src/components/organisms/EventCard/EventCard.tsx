import Image from "next/image";
import type { EventArea } from "@/lib/eventClassification";
import EventBookmark from "./EventBookmark";
import EventDetails from "./EventDetails";
import eventDetailsData from "./eventDetailsData";
import styles from "./EventCard.module.css";

export type EventCardData = {
  id: string;
  title: string;
  day: number;
  startDate?: string;
  weekday: string;
  schedule: string;
  venue: string;
  area?: EventArea;
  category?: string;
  tags: string[];
  price: string;
  image: string;
  imageAlt: string;
  description?: string;
};

export default function EventCard({ event }: { event: EventCardData }) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <div className={styles.photo}>
          <Image
            src={event.image}
            alt={event.imageAlt}
            fill
            sizes="(max-width: 560px) 85vw, (max-width: 900px) 42vw, (max-width: 1440px) 21vw, 294px"
          />
        </div>
        <p className={styles.date}>
          <span className={styles.day}>{event.day}</span>{" "}
          <span className={styles.weekday}>{event.weekday}</span>
        </p>
        <EventBookmark className={styles.bookmark} eventId={event.id} title={event.title} />
        {event.category && <p className={styles.category}>{event.category}</p>}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{event.title}</h3>
        <div className={styles.metadata}>
          <p>
            <Image src="/featured-events/clock.svg" alt="" width={17} height={17} />
            <span>{event.schedule}</span>
          </p>
          <p>
            <Image src="/featured-events/location.svg" alt="" width={17} height={17} />
            <span>{event.venue}</span>
          </p>
        </div>
        {event.tags.length > 0 && (
          <ul className={styles.tags} aria-label="Event tags">
            {event.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        )}
        <div className={styles.bottom}>
          <p>{event.price}</p>
          <EventDetails event={eventDetailsData(event)} />
        </div>
      </div>
    </article>
  );
}
