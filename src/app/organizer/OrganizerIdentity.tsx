"use client";

import { useSyncExternalStore } from "react";
import { getDemoSession, subscribeToDemoSession } from "@/components/organisms/VisitorLogin/demoSession";
import styles from "./OrganizerStudio.module.css";

const sampleProfile = { username: "Anna Smith", email: "anna@example.com" };

export default function OrganizerIdentity() {
  const session = useSyncExternalStore(
    subscribeToDemoSession,
    () => getDemoSession("organizer"),
    () => null,
  );
  const { username, email } = session?.profile ?? sampleProfile;
  const initials = username.split(/\s+/).slice(0, 2).map((word) => Array.from(word)[0]).join("").toUpperCase();

  return (
    <div className={styles.user}>
      <span className={styles.avatar} aria-hidden="true">{initials}</span>
      <p>{username} <small>{email}</small></p>
    </div>
  );
}
