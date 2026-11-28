import type { Metadata } from "next";
import CreateEventPopup from "../CreateEventPopup";
import OrganizationGreeting from "../OrganizationGreeting";
import OrganizerProgramme from "../OrganizerProgramme";
import styles from "../OrganizerStudio.module.css";

export const metadata: Metadata = { title: "My events · KOMA Organizer Studio" };

export default function MyEvents() {
  return (
    <main className={styles.workspace} aria-labelledby="organizer-events-heading">
      <div className={styles.overview}>
        <div>
          <p className={styles.eyebrow}>Organizer overview</p>
          <OrganizationGreeting id="organizer-events-heading" />
        </div>
        <CreateEventPopup />
      </div>
      <OrganizerProgramme />
    </main>
  );
}
