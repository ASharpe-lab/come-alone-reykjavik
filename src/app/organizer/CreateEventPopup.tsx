"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import formStyles from "@/components/Popup/FormPopup.module.css";
import Popup from "@/components/Popup/Popup";
import { eventAreas, eventCategories } from "@/lib/eventClassification";
import { defaultEventCover, publishEvent } from "@/lib/publishedEvents";
import styles from "./CreateEventPopup.module.css";
import studioStyles from "./OrganizerStudio.module.css";
import { useOrganizerAccountKey } from "./organizationProfile";

const photoTypes = ["image/jpeg", "image/png", "image/webp"];
const eventTags = ["Beginner-friendly", "Come alone", "Materials included", "Outside", "Quiet event", "Casual"];
const maxPhotoSize = 5 * 1024 * 1024;
const eventTimeZone = "Atlantic/Reykjavik";
const weekdayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: eventTimeZone });
const dayFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: eventTimeZone });
const scheduleFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: eventTimeZone,
});
const priceFormat = new Intl.NumberFormat("en-US");

function readPhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("The selected photo could not be opened."));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function CreateEventPopup() {
  const router = useRouter();
  const organizerKey = useOrganizerAccountKey();
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const saving = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [preview, setPreview] = useState<string>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (preview) return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function choosePhoto(change: ChangeEvent<HTMLInputElement>) {
    const input = change.currentTarget;
    const photo = input.files?.[0];
    const invalid = photo && (!photoTypes.includes(photo.type) || photo.size > maxPhotoSize);
    input.setCustomValidity(invalid ? "Choose a JPG, PNG, or WebP photo up to 5 MB." : "");
    setPreview(photo && !invalid ? URL.createObjectURL(photo) : undefined);
    if (invalid) input.reportValidity();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving.current) return;

    const fields = new FormData(event.currentTarget);
    const title = String(fields.get("eventTitle")).trim();
    const category = eventCategories.find((option) => option === fields.get("category"));
    const area = eventAreas.find((option) => option.value === fields.get("area"))?.value;
    const venue = String(fields.get("location")).trim();
    const description = String(fields.get("description")).trim();
    const startsAt = new Date(`${fields.get("date")}T${fields.get("time")}:00Z`);
    const price = Number(fields.get("price"));
    const selectedTags = fields.getAll("tags");
    if (!title || !category || !venue || !description || Number.isNaN(startsAt.getTime()) || !Number.isSafeInteger(price) || price < 0) {
      setError("Fill in the event title, category, date, time, location, description, and price. Use 0 for a free event.");
      return;
    }

    saving.current = true;
    setIsSaving(true);
    setError("");
    try {
      let image = defaultEventCover;
      const photo = fields.get("photo");
      if (photo instanceof File && photo.size > 0) {
        try {
          image = await readPhoto(photo);
          const decoded = new window.Image();
          decoded.src = image;
          await decoded.decode();
        } catch {
          setError("The selected photo could not be opened. Choose a different photo.");
          return;
        }
      }

      if (!dialog.current?.open) return;
      await publishEvent({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        organizerKey,
        title,
        startDate: startsAt.toISOString().slice(0, 10),
        day: Number(dayFormat.format(startsAt)),
        weekday: weekdayFormat.format(startsAt),
        schedule: scheduleFormat.format(startsAt),
        venue,
        area,
        description,
        category,
        price: price === 0 ? "Free" : `${priceFormat.format(price)} ISK`,
        tags: eventTags.filter((tag) => selectedTags.includes(tag)),
        image,
        imageAlt: "",
      });

      if (dialog.current?.open) {
        dialog.current.close();
        router.push("/#events");
      }
    } catch {
      setError("The event couldn’t be saved in this browser. Please try again.");
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  }

  return (
    <>
      <button
        className={studioStyles.create}
        type="button"
        aria-haspopup="dialog"
        aria-controls={id}
        disabled={isSaving}
        onClick={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          dialog.current?.showModal();
          titleInput.current?.focus({ preventScroll: true });
        }}
      >
        Create an event <span aria-hidden="true">+</span>
      </button>
      <Popup
        id={id}
        ref={dialog}
        className={styles.dialog}
        closeLabel="Close create event"
        aria-labelledby={`${id}-title`}
        onClose={(event) => {
          if (event.currentTarget.open) return;
          form.current?.reset();
          form.current?.querySelector<HTMLInputElement>('input[name="photo"]')?.setCustomValidity("");
          setPreview(undefined);
          setError("");
        }}
      >
        <div className={styles.layout}>
          <div className={styles.photo}>
            <Image src={preview ?? defaultEventCover} alt={preview ? "Selected event photo" : ""} fill sizes="(max-width: 640px) 100vw, 400px" unoptimized={Boolean(preview)} />
          </div>
          <div className={styles.content}>
            <h2 id={`${id}-title`}>Create an event</h2>
            <form className={styles.form} ref={form} method="dialog" onSubmit={submit}>
              <label className={formStyles.field}>
                Event title
                <input ref={titleInput} name="eventTitle" maxLength={100} required />
              </label>
              <div className={styles.columns}>
                <label className={formStyles.field}>
                  Category
                  <select name="category" defaultValue="" required>
                    <option value="" disabled>Choose a category</option>
                    {eventCategories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label className={formStyles.field}>
                  Area (optional)
                  <select name="area" defaultValue="">
                    <option value="">Choose an area</option>
                    {eventAreas.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className={styles.columns}>
                <label className={formStyles.field}>
                  Date
                  <input type="date" name="date" required />
                </label>
                <label className={formStyles.field}>
                  Time
                  <input type="time" name="time" required />
                </label>
              </div>
              <div className={styles.columns}>
                <label className={formStyles.field}>
                  Location
                  <input name="location" maxLength={160} required />
                </label>
                <label className={formStyles.field}>
                  Price (ISK)
                  <input type="number" name="price" min={0} step={1} placeholder="0 for free" required />
                </label>
              </div>
              <label className={formStyles.field}>
                Event description
                <textarea className={styles.description} name="description" rows={3} maxLength={2000} required />
              </label>
              <fieldset className={styles.tagField}>
                <legend className={formStyles.field}>Event tags (optional)</legend>
                <div className={styles.tagChoices}>
                  {eventTags.map((tag) => (
                    <label className={styles.tagChoice} key={tag}>
                      <input type="checkbox" name="tags" value={tag} />
                      {tag}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className={`${formStyles.field} ${styles.upload}`}>
                Photo (optional)
                <input type="file" name="photo" accept={photoTypes.join(",")} aria-describedby={`${id}-photo-help`} onChange={choosePhoto} />
                <span id={`${id}-photo-help`}>JPG, PNG, or WebP up to 5 MB</span>
              </label>
              {error && <p className={styles.error} role="alert">{error}</p>}
              <button className={formStyles.submit} type="submit" disabled={isSaving}>
                {isSaving ? "Saving…" : "Add to Events"}
              </button>
            </form>
          </div>
        </div>
      </Popup>
    </>
  );
}
