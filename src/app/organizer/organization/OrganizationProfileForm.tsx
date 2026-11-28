"use client";

import { useRef, useState, type FormEvent } from "react";
import formStyles from "@/components/Popup/FormPopup.module.css";
import { saveOrganizationProfile, useOrganizationProfile, type OrganizationProfile } from "../organizationProfile";
import styles from "./OrganizationProfile.module.css";

const fields = [
  { name: "name", label: "Organization name", type: "text", autoComplete: "organization", maxLength: 100 },
  { name: "contactName", label: "Contact name", type: "text", autoComplete: "name", maxLength: 100 },
  { name: "contactEmail", label: "Contact email", type: "email", autoComplete: "email", maxLength: 254 },
  { name: "website", label: "Website", type: "url", autoComplete: "url", maxLength: 300 },
  { name: "location", label: "Location", type: "text", autoComplete: "address-level2", maxLength: 160 },
] as const;

export default function OrganizationProfileForm() {
  const details = useOrganizationProfile();
  return <ProfileFields key={details.storageKey} {...details} />;
}

function ProfileFields({ storageKey, profile, hasSavedProfile }: {
  storageKey: string;
  profile: OrganizationProfile;
  hasSavedProfile: boolean;
}) {
  const actionButton = useRef<HTMLButtonElement>(null);
  const [draft, setDraft] = useState<OrganizationProfile | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; error?: boolean }>();
  const editing = !hasSavedProfile || draft !== null;
  const values = draft ?? profile;

  function change(field: keyof OrganizationProfile, value: string) {
    setDraft((current) => ({ ...(current ?? profile), [field]: value }));
    setFeedback(undefined);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nameField = form.elements.namedItem("name") as HTMLInputElement;

    if (!editing) {
      setDraft(profile);
      setFeedback(undefined);
      nameField.focus();
      return;
    }

    const submitted = new FormData(form);
    const value = (field: keyof OrganizationProfile) => String(submitted.get(field) ?? "").trim();
    const name = value("name");
    if (!name) {
      setFeedback({ message: "Enter an organization name.", error: true });
      nameField.focus();
      return;
    }

    try {
      saveOrganizationProfile(storageKey, {
        name,
        contactName: value("contactName"),
        contactEmail: value("contactEmail"),
        website: value("website"),
        location: value("location"),
        description: value("description"),
      });
      setDraft(null);
      setFeedback({ message: "Changes saved" });
    } catch {
      setFeedback({ message: "Changes couldn’t be saved in this browser. Please try again.", error: true });
    }
  }

  function cancel() {
    setDraft(null);
    setFeedback(undefined);
    actionButton.current?.focus();
  }

  return (
    <form className={styles.form} onSubmit={submit} method="post">
      {fields.map(({ name, label, ...attributes }) => (
        <label key={name} className={name === "name" ? `${formStyles.field} ${styles.fullWidth}` : formStyles.field}>
          {label}
          <input
            {...attributes}
            name={name}
            value={values[name]}
            onChange={(event) => change(name, event.currentTarget.value)}
            required={editing && name === "name"}
            readOnly={!editing}
            tabIndex={editing ? undefined : -1}
          />
        </label>
      ))}
      <label className={`${formStyles.field} ${styles.fullWidth}`}>
        About the organization
        <textarea
          className={styles.description}
          name="description"
          value={values.description}
          onChange={(event) => change("description", event.currentTarget.value)}
          rows={4}
          maxLength={2000}
          readOnly={!editing}
          tabIndex={editing ? undefined : -1}
        />
      </label>
      <div className={`${styles.actions} ${styles.fullWidth}`}>
        <button ref={actionButton} className={formStyles.submit} type="submit">
          {editing ? "Save changes" : "Edit details"}
        </button>
        {editing && hasSavedProfile && (
          <button className={`${formStyles.accountLink} ${styles.cancel}`} type="button" onClick={cancel}>Cancel</button>
        )}
        <p className={styles.feedback} role="status" data-error={feedback?.error}>{feedback?.message}</p>
      </div>
    </form>
  );
}
