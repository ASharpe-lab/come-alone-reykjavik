import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { eventAreas, eventCategories } from "@/lib/eventClassification";
import { eventDates, type EventFilters } from "@/lib/eventSearch";
import styles from "./EventSearch.module.css";

const searchFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-event-search",
});

export default function EventSearch({ query, category, when, where }: EventFilters) {
  return (
    <form
      key={JSON.stringify([query, category, when, where])}
      action="/#events"
      method="get"
      role="search"
      aria-label="Find events"
      className={`${styles.search} ${searchFont.variable}`}
    >
      <label className={styles.query}>
        <Image src="/event-search-magnifier.svg" width={21} height={22} alt="" />
        <input
          type="search"
          name="q"
          aria-label="Search events"
          placeholder="What are you in the mood for?"
          defaultValue={query}
        />
      </label>

      <label className={`${styles.filter} ${styles.category}`}>
        <span className={styles.label}>Category</span>
        <span className={styles.select}>
          <select name="category" defaultValue={category}>
            <option value="">All categories</option>
            {eventCategories.map((name) => <option key={name}>{name}</option>)}
          </select>
          <Image src="/event-search-chevron.svg" width={10} height={6} alt="" />
        </span>
      </label>

      <label className={styles.filter}>
        <span className={styles.label}>When</span>
        <span className={styles.select}>
          <select name="when" defaultValue={when}>
            {eventDates.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
          <Image src="/event-search-chevron.svg" width={10} height={6} alt="" />
        </span>
      </label>

      <label className={styles.filter}>
        <span className={styles.label}>Where</span>
        <span className={styles.select}>
          <select name="where" defaultValue={where}>
            <option value="">All areas</option>
            {eventAreas.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
          <Image src="/event-search-chevron.svg" width={10} height={6} alt="" />
        </span>
      </label>

      <div className={styles.action}>
        <button type="submit">
          Find events
          <Image src="/event-search-arrow.svg" width={20} height={20} alt="" />
        </button>
      </div>
    </form>
  );
}
