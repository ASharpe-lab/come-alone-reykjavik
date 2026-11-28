"use client";

import { useState } from "react";
import Image from "next/image";
import type { EventCardData } from "@/components/organisms/EventCard/EventCard";
import EventDetails from "@/components/organisms/EventCard/EventDetails";
import eventDetailsData from "@/components/organisms/EventCard/eventDetailsData";
import styles from "./VisitorCalendar.module.css";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: "UTC" });
const shortDateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function monthKey(date: Date) {
  return dayKey(date).slice(0, 7);
}

function dateFromKey(key: string) {
  return new Date(`${key}T00:00:00Z`);
}

function calendarWeeks(month: Date) {
  const year = month.getUTCFullYear();
  const index = month.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, index + 1, 0)).getUTCDate();
  const offset = (month.getUTCDay() + 6) % 7;

  return Array.from({ length: Math.ceil((offset + daysInMonth) / 7) }, (_, week) => (
    weekdays.map((_, column) => new Date(Date.UTC(year, index, week * 7 + column - offset + 1)))
  ));
}

function CalendarEntry({ event, date, showDate = false }: { event: EventCardData; date?: string; showDate?: boolean }) {
  const details = eventDetailsData(event);
  const day = date ? dateFromKey(date) : undefined;

  return (
    <li className={styles.entry}>
      <EventDetails event={day ? { ...details, dateLabel: dateFormat.format(day) } : details} triggerClassName={styles.eventButton}>
        {showDate && day && <time dateTime={date}>{shortDateFormat.format(day)}</time>}
        <span>{event.title}</span>
        <small>{event.schedule.split(", ").at(-1)}</small>
      </EventDetails>
    </li>
  );
}

export default function VisitorCalendar({ events, today }: { events: EventCardData[]; today: string }) {
  const [requestedMonth, setRequestedMonth] = useState<string>();
  const dated = events
    .flatMap((event) => event.startDate ? [{ event, date: event.startDate }] : [])
    .sort((a, b) => a.date.localeCompare(b.date));
  const firstUpcoming = dated.find(({ date }) => date >= today);
  const displayedMonth = requestedMonth ?? (firstUpcoming ?? dated.at(-1))?.date.slice(0, 7) ?? today.slice(0, 7);

  if (!displayedMonth) return null;

  const month = dateFromKey(`${displayedMonth}-01`);
  const heading = monthFormat.format(month);
  const monthEvents = dated.filter(({ date }) => date.startsWith(`${displayedMonth}-`));
  const undated = events.filter((event) => !event.startDate);
  const byDay = new Map<string, EventCardData[]>();
  for (const { event, date } of monthEvents) {
    const sameDay = byDay.get(date) ?? [];
    sameDay.push(event);
    byDay.set(date, sameDay);
  }

  function moveMonth(amount: number) {
    setRequestedMonth(monthKey(new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + amount, 1))));
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.toolbar}>
        <h3 aria-live="polite">{heading}</h3>
        <div className={styles.controls}>
          <button className={styles.previous} type="button" aria-label="Previous month" onClick={() => moveMonth(-1)}>
            <Image src="/visitor-account/arrow.svg" width={17} height={17} alt="" />
          </button>
          <button className={styles.todayButton} type="button" onClick={() => setRequestedMonth(monthKey(new Date()))}>Today</button>
          <button type="button" aria-label="Next month" onClick={() => moveMonth(1)}>
            <Image src="/visitor-account/arrow.svg" width={17} height={17} alt="" />
          </button>
        </div>
      </div>
      <table className={styles.grid} aria-label={`${heading} calendar`}>
        <thead>
          <tr>
            {weekdays.map((weekday) => <th key={weekday} scope="col" aria-label={weekday}>{weekday.slice(0, 3)}</th>)}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks(month).map((week) => (
            <tr key={dayKey(week[0])}>
              {week.map((day) => {
                const date = dayKey(day);
                const outside = day.getUTCMonth() !== month.getUTCMonth();
                const items = byDay.get(date);

                return (
                  <td key={date} data-outside={outside || undefined}>
                    <time dateTime={date} aria-label={dateFormat.format(day)} aria-current={date === today ? "date" : undefined}>
                      {day.getUTCDate()}
                    </time>
                    {items && (
                      <>
                        <ul className={styles.dayEvents}>
                          {items.map((event) => <CalendarEntry key={event.title} event={event} date={date} />)}
                        </ul>
                        <span className={styles.marker} aria-hidden="true" />
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {monthEvents.length ? (
        <div className={styles.agenda}>
          <h4>Going this month</h4>
          <ul>
            {monthEvents.map(({ event, date }) => <CalendarEntry key={`${date}-${event.title}`} event={event} date={date} showDate />)}
          </ul>
        </div>
      ) : (
        <p className={styles.empty}>No Going events this month.</p>
      )}
      {undated.length > 0 && (
        <div className={styles.undated}>
          <h4>Events awaiting a confirmed date</h4>
          <ul>{undated.map((event) => <CalendarEntry key={event.id} event={event} />)}</ul>
        </div>
      )}
    </div>
  );
}
