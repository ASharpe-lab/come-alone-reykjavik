"use client";

import { useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import EventBookmark from "@/components/organisms/EventCard/EventBookmark";
import EventDetails from "@/components/organisms/EventCard/EventDetails";
import EventGoing from "@/components/organisms/EventCard/EventGoing";
import eventDetailsData from "@/components/organisms/EventCard/eventDetailsData";
import { featuredEvents } from "@/components/organisms/EventsSection/featuredEvents";
import { usePublishedEvents } from "@/components/organisms/EventsSection/usePublishedEvents";
import { getDemoSession, setDemoSession, subscribeToDemoSession } from "@/components/organisms/VisitorLogin/demoSession";
import { useToday } from "@/lib/useToday";
import { useVisitorEventIds } from "@/lib/visitorEventPreferences";
import { AccountIdentity, sampleProfile } from "../organizer/OrganizerIdentity";
import studioStyles from "../organizer/OrganizerStudio.module.css";
import VisitorCalendar from "./VisitorCalendar";
import styles from "./VisitorAccount.module.css";

const featuredById = new Map(featuredEvents.map((event) => [event.id, event]));
const workshopEvent = featuredById.get("clay-cups-and-coffee");

export function VisitorLogout() {
  return <Link href="/" onClick={() => setDemoSession("visitor", null)}>Log out</Link>;
}

export default function VisitorAccount() {
  const session = useSyncExternalStore(subscribeToDemoSession, () => getDemoSession("visitor"), () => null);
  const profile = session?.profile ?? sampleProfile;
  const givenName = profile.username.trim().split(/\s+/)[0];
  const [selected, select] = useState(0);
  const goingTab = useRef<HTMLButtonElement>(null);
  const savedTab = useRef<HTMLButtonElement>(null);
  const calendarTab = useRef<HTMLButtonElement>(null);
  const id = useId();
  const today = useToday();
  const going = useVisitorEventIds("going");
  const saved = useVisitorEventIds("saved");
  const { events: publishedEvents } = usePublishedEvents(`${going.snapshot}:${saved.snapshot}`);
  const publishedById = new Map(publishedEvents.map((event) => [event.id, event]));

  function resolveEvents(ids: string[]) {
    return ids.flatMap((eventId) => {
      const event = featuredById.get(eventId) ?? publishedById.get(eventId);
      return event ? [event] : [];
    });
  }

  const goingEvents = resolveEvents(going.ids);
  const savedEvents = resolveEvents(saved.ids);
  const nextEvent = goingEvents
    .flatMap((event) => event.startDate && event.startDate >= today ? [{ event, date: event.startDate }] : [])
    .sort((a, b) => a.date.localeCompare(b.date))[0]?.event;
  const tabs = [
    { label: "Going", heading: "Events you’re going to", items: goingEvents },
    { label: "Saved", heading: "Saved events", items: savedEvents },
    { label: "Calendar", heading: "My calendar", items: null },
  ];

  function moveTab(event: KeyboardEvent<HTMLDivElement>) {
    const destinations: Record<string, number> = {
      ArrowLeft: (selected + tabs.length - 1) % tabs.length,
      ArrowRight: (selected + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const index = destinations[event.key];
    if (typeof index !== "number") return;

    event.preventDefault();
    select(index);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('button[role="tab"]')[index]?.focus();
  }

  return (
    <>
      <header className={studioStyles.header}>
        <Link className={studioStyles.brand} href="/" aria-label="KOMA home">
          <Image src="/koma-mark.svg" alt="" width={53} height={50} />
          KOMA
        </Link>
        <button
          className={`${studioStyles.studioLabel} ${styles.calendarShortcut}`}
          type="button"
          onClick={() => {
            select(tabs.length - 1);
            calendarTab.current?.focus();
          }}
        >
          My calendar
        </button>
        <AccountIdentity profile={profile} />
      </header>
      <main>
        <section className={styles.hero} aria-labelledby={`${id}-greeting`}>
          <div className={`${styles.container} ${styles.greeting}`}>
            <div>
              <p className={styles.marker}>Your Reykjavík</p>
              <h1 id={`${id}-greeting`}>Good to see you,<br />{givenName}.</h1>
            </div>
            {nextEvent ? (
              <EventDetails
                event={eventDetailsData(nextEvent)}
                triggerClassName={`${styles.nextUp} ${styles.nextUpTrigger}`}
                triggerLabel={`Next up, ${nextEvent.title}`}
              >
                <span className={styles.nextLabel}>Next up</span>
                <span className={styles.nextTitle}>{nextEvent.title}</span>
                <span>{nextEvent.schedule} · {nextEvent.venue}</span>
              </EventDetails>
            ) : (
              <aside className={styles.nextUp} aria-label="Next event">
                <p className={styles.nextLabel}>Next up</p>
                <p className={styles.nextTitle}>No upcoming Going events</p>
              </aside>
            )}
          </div>
        </section>
        <section className={`${styles.container} ${styles.plans}`} aria-labelledby={`${id}-plans`}>
          <div className={styles.plansHeader}>
            <div>
              <p className={`${styles.marker} ${styles.accent}`}>Your plans</p>
              <h2 id={`${id}-plans`}>{tabs[selected].heading}</h2>
            </div>
            <Link className={styles.browse} href="/#events">
              Find more events
              <Image src="/visitor-account/arrow.svg" alt="" width={17} height={17} />
            </Link>
          </div>
          <div className={styles.tabs} role="tablist" aria-label="Visitor account views" onKeyDown={moveTab}>
            {tabs.map((tab, index) => (
              <button
                type="button"
                key={tab.label}
                ref={tab.label === "Going" ? goingTab : tab.label === "Saved" ? savedTab : calendarTab}
                role="tab"
                id={`${id}-tab-${index}`}
                aria-controls={`${id}-panel-${index}`}
                aria-selected={index === selected}
                tabIndex={index === selected ? 0 : -1}
                onClick={() => select(index)}
              >
                {tab.label}
                {tab.items && <span aria-hidden="true">{tab.items.length}</span>}
              </button>
            ))}
          </div>
          {tabs.map((tab, index) => (
            <div
              key={tab.label}
              role="tabpanel"
              id={`${id}-panel-${index}`}
              aria-labelledby={`${id}-tab-${index}`}
              hidden={index !== selected}
              tabIndex={tab.items ? undefined : 0}
            >
              {tab.items === null ? (
                <VisitorCalendar events={goingEvents} today={today} />
              ) : tab.items.length > 0 ? (
                <ul className={styles.eventList}>
                  {tab.items.map((event) => (
                    <li key={event.id} className={styles.eventRow}>
                      <p className={styles.date}><span>{event.day}</span>{event.weekday}</p>
                      <div className={styles.thumbnail}>
                        <Image src={event.image} alt="" fill sizes="(max-width: 640px) 66px, 170px" />
                      </div>
                      <div className={styles.eventInfo}>
                        <p className={styles.category}>{event.category}</p>
                        <h3>{event.title}</h3>
                        <p><Image src="/visitor-account/clock.svg" alt="" width={15} height={15} /> {event.schedule.split(", ").at(-1)}</p>
                        <p><Image src="/visitor-account/location.svg" alt="" width={15} height={15} /> {event.venue}</p>
                      </div>
                      <div className={styles.eventActions}>
                        {tab.label === "Saved" ? (
                          <EventBookmark
                            className={styles.savedBookmark}
                            eventId={event.id}
                            title={event.title}
                            onRemove={() => savedTab.current?.focus({ preventScroll: true })}
                          />
                        ) : (
                          <EventGoing
                            eventId={event.id}
                            title={event.title}
                            remove
                            onRemove={() => goingTab.current?.focus({ preventScroll: true })}
                          />
                        )}
                        <EventDetails event={eventDetailsData(event)} triggerClassName={styles.eventAction}>
                          <span aria-hidden="true">•••</span>
                        </EventDetails>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyEvents} role="status">
                  {tab.label === "Saved"
                    ? "No saved events yet. Use the bookmark icon on an event card to save it here."
                    : "No Going events yet. Choose I’m going on a free event to add it here."}
                </p>
              )}
            </div>
          ))}
          {tabs[selected].items && workshopEvent && (
            <aside className={styles.workshops}>
              <div>
                <p className={`${styles.marker} ${styles.accent}`}>Picked for you</p>
                <p>Try something you’ve never done before.</p>
              </div>
              <EventDetails
                event={eventDetailsData(workshopEvent)}
                triggerClassName={`${styles.browse} ${styles.workshopButton}`}
                triggerLabel={`Explore workshops, ${workshopEvent.title}`}
              >
                Explore workshops
                <Image src="/visitor-account/arrow.svg" alt="" width={17} height={17} />
              </EventDetails>
            </aside>
          )}
        </section>
      </main>
    </>
  );
}
