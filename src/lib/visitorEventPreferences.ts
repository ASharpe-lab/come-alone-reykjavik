"use client";

import { useSyncExternalStore } from "react";
import { getDemoSession, subscribeToDemoSession } from "@/components/organisms/VisitorLogin/demoSession";

type EventPreference = "saved" | "going";
const preferences = ["saved", "going"] as const;
const changedEvent = "koma:visitor-events-changed";

function preferenceNamespace(preference: EventPreference) {
  return `koma:${preference}-events:`;
}

function prefix(preference: EventPreference, email = "") {
  return `${preferenceNamespace(preference)}${encodeURIComponent(email.trim().toLowerCase())}:`;
}

function usePreferenceScope(preference: EventPreference) {
  const session = useSyncExternalStore(subscribeToDemoSession, () => getDemoSession("visitor"), () => null);
  return { accountPrefix: prefix(preference, session?.profile?.email), signedIn: Boolean(session) };
}

function subscribeToVisitorEvents(listener: () => void) {
  window.addEventListener(changedEvent, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(changedEvent, listener);
    window.removeEventListener("storage", listener);
  };
}

function readEntries(storage: Storage, accountPrefix: string) {
  const entries: { id: string; value: string }[] = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (!key?.startsWith(accountPrefix)) continue;
    const value = storage.getItem(key);
    if (value !== null) entries.push({ id: key.slice(accountPrefix.length), value });
  }
  return entries.sort((a, b) => Number(b.value) - Number(a.value) || a.id.localeCompare(b.id));
}

function readSnapshot(accountPrefix: string) {
  try {
    return JSON.stringify(readEntries(window.localStorage, accountPrefix).map(({ id }) => id));
  } catch {
    return "[]";
  }
}

export function useVisitorEventIds(preference: EventPreference) {
  const { accountPrefix } = usePreferenceScope(preference);
  const snapshot = useSyncExternalStore(subscribeToVisitorEvents, () => readSnapshot(accountPrefix), () => "[]");
  return { ids: JSON.parse(snapshot) as string[], snapshot };
}

type VisitorEventTotals = Record<EventPreference, number>;
const emptyTotals = JSON.stringify({ saved: 0, going: 0 });

function readEventTotals(eventIds: ReadonlySet<string>) {
  if (eventIds.size === 0) return emptyTotals;

  try {
    const storage = window.localStorage;
    const totals: VisitorEventTotals = { saved: 0, going: 0 };
    for (let index = 0; index < storage.length; index++) {
      const key = storage.key(index);
      if (!key) continue;

      const preference = preferences.find((kind) => key.startsWith(preferenceNamespace(kind)));
      if (!preference) continue;

      const separator = key.indexOf(":", preferenceNamespace(preference).length);
      if (separator !== -1 && eventIds.has(key.slice(separator + 1))) totals[preference]++;
    }
    return JSON.stringify(totals);
  } catch {
    return emptyTotals;
  }
}

export function useVisitorEventTotals(eventIds: ReadonlySet<string>) {
  const snapshot = useSyncExternalStore(subscribeToVisitorEvents, () => readEventTotals(eventIds), () => emptyTotals);
  return JSON.parse(snapshot) as VisitorEventTotals;
}

function isSelected(key: string) {
  try {
    return window.localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

function changeStoredSelection(key: string, value?: boolean) {
  const storage = window.localStorage;
  const current = storage.getItem(key) !== null;
  const next = value ?? !current;
  if (current === next) return current;
  if (next) storage.setItem(key, String(Date.now()));
  else storage.removeItem(key);
  window.dispatchEvent(new Event(changedEvent));
  return next;
}

export function useVisitorEventPreference(preference: EventPreference, eventId: string) {
  const { accountPrefix, signedIn } = usePreferenceScope(preference);
  const key = `${accountPrefix}${eventId}`;
  const selected = useSyncExternalStore(subscribeToVisitorEvents, () => isSelected(key), () => false);

  return { selected, signedIn, changeSelection: (value?: boolean) => changeStoredSelection(key, value) };
}

export function addEventToGoing(eventId: string, email?: string) {
  changeStoredSelection(`${prefix("going", email)}${eventId}`, true);
}

export function keepGuestEventPreferences(email: string) {
  if (!email.trim()) return;
  try {
    const storage = window.localStorage;
    for (const preference of preferences) {
      const guestPrefix = prefix(preference);
      const accountPrefix = prefix(preference, email);
      const guestEvents = readEntries(storage, guestPrefix);

      for (const { id, value } of guestEvents) {
        const key = `${accountPrefix}${id}`;
        if (storage.getItem(key) === null) storage.setItem(key, value);
      }
      for (const { id, value } of guestEvents) {
        const key = `${guestPrefix}${id}`;
        if (storage.getItem(key) === value) storage.removeItem(key);
      }
    }
    window.dispatchEvent(new Event(changedEvent));
  } catch {
    // Uncopied guest preferences stay in place if storage is unavailable.
  }
}
