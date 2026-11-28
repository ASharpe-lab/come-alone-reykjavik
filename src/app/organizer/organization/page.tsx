import type { Metadata } from "next";
import studioStyles from "../OrganizerStudio.module.css";
import OrganizationProfileForm from "./OrganizationProfileForm";
import styles from "./OrganizationProfile.module.css";

export const metadata: Metadata = { title: "Organization · KOMA Organizer Studio" };

export default function Organization() {
  return (
    <main className={`${studioStyles.workspace} ${styles.profile}`} aria-labelledby="organization-heading">
      <p className={studioStyles.eyebrow}>Organizer Studio</p>
      <h1 className={styles.heading} id="organization-heading">Organization profile</h1>
      <p className={styles.intro}>Your organization name appears at the top of the sidebar.</p>
      <OrganizationProfileForm />
    </main>
  );
}
