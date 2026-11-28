"use client";

import { useState } from "react";
import Image from "next/image";
import { useVisitorEventPreference } from "@/lib/visitorEventPreferences";
import styles from "./EventBookmark.module.css";

type EventBookmarkProps = {
  eventId: string;
  title: string;
  className: string;
  onRemove?: () => void;
};

export default function EventBookmark({ eventId, title, className, onRemove }: EventBookmarkProps) {
  const { selected: saved, changeSelection } = useVisitorEventPreference("saved", eventId);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  function changeBookmark() {
    try {
      const next = changeSelection();
      setFailed(false);
      setMessage(next ? `${title} added to Saved.` : `${title} removed from Saved.`);
      if (!next) onRemove?.();
    } catch {
      setFailed(true);
      setMessage("Bookmarks couldn’t be saved in this browser.");
    }
  }

  return (
    <span className={`${styles.bookmark} ${className}`}>
      <button
        type="button"
        aria-label={`Save ${title}`}
        aria-pressed={saved}
        title={saved ? "Remove from Saved" : "Save event"}
        onClick={changeBookmark}
      >
        <Image src="/featured-events/bookmark.svg" alt="" width={20} height={20} />
      </button>
      <span className={failed ? styles.error : styles.status} role="status">{message}</span>
    </span>
  );
}
