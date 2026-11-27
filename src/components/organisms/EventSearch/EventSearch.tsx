import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import styles from "./EventSearch.module.css";

const searchFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-event-search",
});

type EventSearchProps = {
  query?: string;
  when?: string;
  where?: string;
};

export default function EventSearch({
  query = "",
  when = "this-week",
  where = "all-reykjavik",
}: EventSearchProps) {
  return (
    <form
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

      <label className={styles.filter}>
        <span className={styles.label}>When</span>
        <span className={styles.select}>
          <select name="when" defaultValue={when}>
            <option value="this-week">This week</option>
            <option value="today">Today</option>
            <option value="this-weekend">This weekend</option>
            <option value="any-date">Any date</option>
          </select>
          <Image src="/event-search-chevron.svg" width={10} height={6} alt="" />
        </span>
      </label>

      <label className={styles.filter}>
        <span className={styles.label}>Where</span>
        <span className={styles.select}>
          <select name="where" defaultValue={where}>
            <option value="all-reykjavik">All Reykjavík</option>
            <option value="city-centre">City centre</option>
            <option value="outside-city-centre">Outside city centre</option>
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
