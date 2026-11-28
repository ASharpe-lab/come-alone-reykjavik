import CreateEventPopup from "./CreateEventPopup";
import OrganizerProgramme from "./OrganizerProgramme";
import styles from "./OrganizerStudio.module.css";

export default function OrganizerEventsWorkspace({ view }: { view: "events" | "organization" }) {
  const headingId = `organizer-${view}-heading`;
  const showEvents = view === "events";

  return (
    <main className={styles.workspace} aria-labelledby={headingId}>
      <div className={styles.overview}>
        <div>
          <p className={styles.eyebrow}>Organizer overview</p>
          <h1 id={headingId}>Good morning,<br />Leir Studio.</h1>
        </div>
        <CreateEventPopup />
      </div>
      <OrganizerProgramme linkToEvents={!showEvents} showEvents={showEvents} />
    </main>
  );
}
