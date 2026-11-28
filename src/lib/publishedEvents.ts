import type { EventCardData } from "@/components/organisms/EventCard/EventCard";

export type PublishedEvent = EventCardData & {
  id: string;
  createdAt: number;
};

export const defaultEventCover = "/organizer-event-cover.png";

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

export function publishEvent(event: PublishedEvent) {
  return accessEvents("readwrite", (store) => store.add(event));
}

export async function readPublishedEvents() {
  const events = await accessEvents<PublishedEvent[]>("readonly", (store) => store.getAll());
  return events.sort((a, b) => b.createdAt - a.createdAt);
}
