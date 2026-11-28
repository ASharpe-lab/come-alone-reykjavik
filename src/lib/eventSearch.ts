import type { EventCardData } from "@/components/organisms/EventCard/EventCard";
import { eventAreas, eventCategories } from "./eventClassification";

export const eventDates = [
  { value: "any-date", label: "Any date" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This week" },
  { value: "this-weekend", label: "This weekend" },
] as const;

export function parseEventFilters(params: Record<string, string | string[] | undefined>) {
  const text = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value.trim() : "";
  };

  const category = text("category").toLowerCase();
  const when = text("when");
  const where = text("where");
  return {
    query: text("q"),
    category: eventCategories.find((name) => name.toLowerCase() === category) ?? "",
    when: eventDates.find(({ value }) => value === when)?.value ?? "any-date",
    where: eventAreas.find(({ value }) => value === where)?.value ?? "",
  };
}

export type EventFilters = ReturnType<typeof parseEventFilters>;

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "")
    .replaceAll("ð", "d").replaceAll("þ", "th").replaceAll("æ", "ae")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function areaOf({ area, venue }: EventCardData) {
  if (area) return area;
  // Older listings only have a venue. Use explicit area words when present.
  if (/\boutside (?:the )?(?:city cent(?:re|er)|downtown)\b/i.test(venue)) return "outside-city-centre";
  if (/\b(?:city cent(?:re|er)|downtown)\b/i.test(venue)) return "city-centre";
}

function upcomingRange(when: EventFilters["when"], today: string) {
  if (when === "today") return { start: today, end: today };

  // Reykjavík's local calendar stays on UTC.
  const date = new Date(`${today}T00:00:00Z`);
  const daysToSunday = (7 - date.getUTCDay()) % 7;
  const dateAfter = (days: number) => {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result.toISOString().slice(0, 10);
  };

  return {
    start: when === "this-weekend" ? dateAfter(Math.max(0, daysToSunday - 1)) : today,
    end: dateAfter(daysToSunday),
  };
}

export function filterEvents(events: EventCardData[], { query, category, when, where }: EventFilters, today: string) {
  if (when !== "any-date" && !today) return [];

  const range = when === "any-date" ? null : upcomingRange(when, today);
  const terms = normalize(query).split(" ").filter(Boolean);

  return events.filter((event) => {
    if (category && event.category !== category) return false;
    if (where && areaOf(event) !== where) return false;
    if (range && (!event.startDate || event.startDate < range.start || event.startDate > range.end)) return false;
    if (terms.length === 0) return true;

    const text = normalize([event.title, event.category, event.venue, event.description, ...event.tags].join(" "));
    return terms.every((term) => text.includes(term));
  });
}
