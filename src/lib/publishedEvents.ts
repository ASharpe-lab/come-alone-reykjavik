import type { EventCardData } from "@/components/organisms/EventCard/EventCard";

export type PublishedEvent = EventCardData & {
  createdAt: number;
  organizerKey?: string;
};

export const defaultEventCover = "/organizer-event-cover.png";
const publishedEventsChanged = "koma:published-events-changed";

function openEventsDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("koma-events", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("events", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function accessEvents<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>) {
  const database = await openEventsDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction("events", mode);
      const request = run(transaction.objectStore("events"));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error ?? request.error ?? new Error("Event storage was interrupted."));
    });
  } finally {
    database.close();
  }
}

export async function publishEvent(event: PublishedEvent & { organizerKey: string }) {
  const key = await accessEvents("readwrite", (store) => store.add(event));
  window.dispatchEvent(new Event(publishedEventsChanged));
  try {
    window.localStorage.setItem(publishedEventsChanged, event.id);
  } catch {
    // The IndexedDB write succeeded even when other tabs cannot be notified.
  }
  return key;
}

export function subscribeToPublishedEvents(listener: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === publishedEventsChanged) listener();
  }

  window.addEventListener(publishedEventsChanged, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(publishedEventsChanged, listener);
    window.removeEventListener("storage", onStorage);
  };
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function recoverStartDate(schedule: string) {
  // Older listings only saved their date in the en-GB schedule text.
  const match = /^\w+, (\d{1,2}) ([A-Za-z]+) (\d{4})\b/.exec(schedule);
  if (!match) return undefined;

  const [, day, monthName, year] = match;
  const month = monthNames.indexOf(monthName);
  if (month === -1) return undefined;

  const date = new Date(Date.UTC(Number(year), month, Number(day)));
  return date.getUTCDate() === Number(day) ? date.toISOString().slice(0, 10) : undefined;
}

export async function readPublishedEvents() {
  const events = await accessEvents<PublishedEvent[]>("readonly", (store) => store.getAll());
  return events.sort((a, b) => b.createdAt - a.createdAt).map((event) => (
    event.startDate ? event : { ...event, startDate: recoverStartDate(event.schedule) }
  ));
}
