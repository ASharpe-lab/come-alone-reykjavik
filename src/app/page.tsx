import styles from "./Home.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <section
        className={styles.section}
        id="events"
        aria-labelledby="events-heading"
      >
        <h1 className={styles.heading} id="events-heading">
          Events
        </h1>
      </section>
      <section
        className={styles.section}
        id="city-stories"
        aria-labelledby="city-stories-heading"
      >
        <h2 className={styles.heading} id="city-stories-heading">
          City stories
        </h2>
      </section>
    </main>
  );
}
