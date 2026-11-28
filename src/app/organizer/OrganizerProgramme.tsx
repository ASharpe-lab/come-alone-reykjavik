import Image from "next/image";
import Link from "next/link";
import { useId } from "react";
import EventDetails from "@/components/organisms/EventCard/EventDetails";
import styles from "./OrganizerStudio.module.css";

const demoEvents = [
  {
    title: "Clay cups & coffee",
    image: "/featured-events/clay-cups.jpg",
    date: "22 Nov",
    time: "11:00",
    attendance: "14 / 20",
    capacityUsed: 70,
    status: "Published",
  },
  {
    title: "Winter glazing circle",
    image: "/featured-events/book-club.jpg",
    date: "06 Dec",
    time: "16:30",
    attendance: "— / 16",
    capacityUsed: 0,
    status: "Pending",
  },
];

export default function OrganizerProgramme({ linkToEvents = false, showEvents = true }: {
  linkToEvents?: boolean;
  showEvents?: boolean;
}) {
  const headingId = useId();

  return (
    <section className={styles.programme} aria-labelledby={headingId}>
      <p className={styles.eyebrow}>Your program</p>
      <div className={styles.sectionHeader}>
        <h2 id={headingId}>Upcoming events</h2>
        {linkToEvents && (
          <Link href="/organizer/events" className={styles.viewAll}>
            View all events
            <Image src="/featured-events/details-arrow.svg" alt="" width={16} height={16} />
          </Link>
        )}
      </div>
      {showEvents && (
        <div className={styles.tableRegion} role="region" aria-label="Upcoming events" tabIndex={0}>
          <table className={styles.table}>
            <thead>
              <tr><th scope="col">Event</th><th scope="col">Date</th><th scope="col">Attendance</th><th scope="col">Status</th></tr>
            </thead>
            <tbody>
              {demoEvents.map((event) => (
                <tr key={event.title}>
                  <th scope="row">
                    <EventDetails
                      triggerClassName={styles.eventName}
                      event={{
                        title: event.title,
                        image: event.image,
                        dateLabel: event.date,
                        category: "Workshop",
                        metadata: [
                          { label: "Time", value: event.time, icon: "/featured-events/clock.svg" },
                          { label: "Organizer", value: "Leir Studio" },
                          { label: "Attendance", value: event.attendance },
                          { label: "Status", value: event.status },
                        ],
                      }}
                    >
                      <Image src={event.image} alt="" width={72} height={62} />
                      <span>{event.title}<small>Workshop · Leir Studio</small></span>
                    </EventDetails>
                  </th>
                  <td>{event.date}<small>{event.time}</small></td>
                  <td className={styles.attendance}>
                    {event.attendance}
                    <progress max={100} value={event.capacityUsed} aria-hidden="true" />
                  </td>
                  <td>
                    <span className={`${styles.status} ${event.status === "Published" ? styles.published : ""}`}>
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
