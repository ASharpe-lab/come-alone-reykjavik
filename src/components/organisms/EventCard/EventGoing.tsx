"use client";

import { useState, type MouseEvent } from "react";
import formStyles from "@/components/Popup/FormPopup.module.css";
import { useGoingLogin } from "@/components/organisms/VisitorLogin/GoingLoginProvider";
import { useVisitorEventPreference } from "@/lib/visitorEventPreferences";
import styles from "./EventCard.module.css";

type EventGoingProps = {
  eventId: string;
  title: string;
  remove?: boolean;
  onRemove?: () => void;
};

export default function EventGoing({ eventId, title, remove = false, onRemove }: EventGoingProps) {
  const requestLogin = useGoingLogin();
  const { selected, signedIn, changeSelection } = useVisitorEventPreference("going", eventId);
  const added = selected && signedIn;
  const [error, setError] = useState("");

  function update(event: MouseEvent<HTMLButtonElement>) {
    if (!remove && !signedIn) {
      if (!requestLogin) {
        setError("Open the visitor login to add this event to Going.");
        return;
      }
      event.currentTarget.closest("dialog")?.close();
      requestLogin({ id: eventId, title });
      return;
    }
    if (!remove && added) return;

    try {
      changeSelection(!remove);
      setError("");
      if (remove) onRemove?.();
    } catch {
      setError("Unable to update Going in this browser.");
    }
  }

  if (remove) {
    return (
      <div className={styles.goingRemove}>
        <button type="button" aria-label={`Remove ${title} from Going`} onClick={update}>Remove</button>
        {error && <p className={styles.goingStatus} role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <div className={styles.goingAction}>
      <button className={formStyles.submit} type="button" aria-disabled={added || undefined} onClick={update}>
        {added ? "Going · Free" : "I’m going · Free"}
      </button>
      <p className={styles.goingStatus} role="status">{error || (added ? "Added to Going." : "")}</p>
    </div>
  );
}
