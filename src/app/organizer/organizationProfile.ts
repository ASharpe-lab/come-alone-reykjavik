"use client";

import { useSyncExternalStore } from "react";
import { getDemoSession, subscribeToDemoSession } from "@/components/organisms/VisitorLogin/demoSession";

export type OrganizationProfile = {
  name: string;
  contactName: string;
  contactEmail: string;
  website: string;
  location: string;
  description: string;
};

const defaultProfile: OrganizationProfile = {
  name: "Leir Studio",
  contactName: "",
  contactEmail: "",
  website: "",
  location: "",
  description: "",
};

const profileChanged = "koma:organization-profile-changed";
export const defaultOrganizerKey = "koma-organization-profile";

function subscribeToProfiles(listener: () => void) {
  window.addEventListener(profileChanged, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(profileChanged, listener);
    window.removeEventListener("storage", listener);
  };
}

function readProfile(storageKey: string) {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function profileFromStorage(snapshot: string | null): OrganizationProfile | null {
  if (!snapshot) return null;

  try {
    const stored: Partial<OrganizationProfile> | null = JSON.parse(snapshot);
    const name = typeof stored?.name === "string" ? stored.name.trim() : "";
    if (!name) return null;

    const value = (field: keyof OrganizationProfile) => {
      const candidate = stored?.[field];
      return typeof candidate === "string" ? candidate : defaultProfile[field];
    };
    return {
      name,
      contactName: value("contactName"),
      contactEmail: value("contactEmail"),
      website: value("website"),
      location: value("location"),
      description: value("description"),
    };
  } catch {
    return null;
  }
}

export function useOrganizerAccountKey() {
  const session = useSyncExternalStore(subscribeToDemoSession, () => getDemoSession("organizer"), () => null);
  const email = session?.profile?.email.trim().toLowerCase();
  return email ? `${defaultOrganizerKey}:${email}` : defaultOrganizerKey;
}

export function useOrganizationProfile() {
  const storageKey = useOrganizerAccountKey();
  const snapshot = useSyncExternalStore(subscribeToProfiles, () => readProfile(storageKey), () => null);
  const savedProfile = profileFromStorage(snapshot);
  return { storageKey, profile: savedProfile ?? defaultProfile, hasSavedProfile: savedProfile !== null };
}

export function saveOrganizationProfile(storageKey: string, profile: OrganizationProfile) {
  window.localStorage.setItem(storageKey, JSON.stringify(profile));
  window.dispatchEvent(new Event(profileChanged));
}
