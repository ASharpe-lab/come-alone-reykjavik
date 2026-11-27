import Link from "next/link";
import OrganizerProgramme from "./OrganizerProgramme";
import styles from "./OrganizerStudio.module.css";

export default function OrganizerEventsWorkspace({ view }: { view: "events" | "organization" | "create-event" }) {
  const headingId = `organizer-${view}-heading`;
  const showEvents = view === "events";
  const createLabel = <>Create an event <span aria-hidden="true">+</span></>;

  return (
    <main className={styles.workspace} aria-labelledby={headingId}>
      <div className={styles.overview}>
        <div>
          <p className={styles.eyebrow}>Organizer overview</p>
          <h1 id={headingId}>Good morning,<br />Leir Studio.</h1>
        </div>
        {view === "create-event" ? (
          <button className={styles.create} type="button" disabled>{createLabel}</button>
        ) : (
          <Link href="/organizer/events/new" className={styles.create}>{createLabel}</Link>
        )}
      </div>
      <OrganizerProgramme linkToEvents={!showEvents} showEvents={showEvents} />
    </main>
  );
}
