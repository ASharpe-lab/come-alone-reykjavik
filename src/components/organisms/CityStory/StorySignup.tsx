"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import Popup from "@/components/Popup/Popup";
import form from "@/components/Popup/FormPopup.module.css";
import styles from "./CityStory.module.css";

export default function StorySignup() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const id = useId();

  return (
    <>
      <button
        className={styles.action}
        type="button"
        aria-haspopup="dialog"
        aria-controls={id}
        onClick={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          dialogRef.current?.showModal();
          dialogRef.current?.querySelector("input")?.focus({ preventScroll: true });
        }}
      >
        Sign up for the story
        <Image src="/event-search-arrow.svg" alt="" width={20} height={20} />
      </button>
      <Popup
        id={id}
        ref={dialogRef}
        className={form.dialog}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        closeLabel="Close story sign-up"
        onClose={(event) => {
          if (event.currentTarget.open) return;
          event.currentTarget.querySelector("form")?.reset();
          setSubmitted(false);
        }}
      >
        <div className={form.content}>
          <Image className={form.brandMark} src="/koma-mark.svg" alt="" width={53} height={50} />
          <p className={form.eyebrow}>Reykjavík stories</p>
          <h2 className={form.heading} id={`${id}-title`}>Get the pool story</h2>
          <p className={form.hint} id={`${id}-description`}>Get an email when the story is published.</p>
          <form
            className={form.form}
            method="dialog"
            autoComplete="off"
            onInput={() => setSubmitted(false)}
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <label className={form.field}>
              Email address
              <input type="email" name="email" placeholder="you@example.com" required />
            </label>
            <button className={`${form.submit} ${form.signUpSubmit}`} type="submit">Notify me</button>
            <p className={form.demoNote} role="status">
              {submitted ? "Demo sign-up complete." : "Use a sample email to try this prototype."}
            </p>
          </form>
        </div>
      </Popup>
    </>
  );
}
