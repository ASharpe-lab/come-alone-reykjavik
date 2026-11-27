"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bebas_Neue, Permanent_Marker, Space_Grotesk } from "next/font/google";
import Popup from "@/components/Popup/Popup";
import styles from "@/components/Popup/FormPopup.module.css";
import { getDemoSession, setDemoSession, subscribeToDemoSession, type AccountRole } from "./demoSession";

const headingFont = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-popup-heading",
});

const markerFont = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-popup-marker",
});

const textFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-popup-text",
});

const demoEmail = "you@example.com";
const demoPassword = "koma-demo";

function matchesDemoLogin(details: FormData) {
  const email = details.get("email");
  return (
    typeof email === "string" &&
    email.trim().toLowerCase() === demoEmail &&
    details.get("password") === demoPassword
  );
}

type VisitorLoginProps = {
  triggerClassName?: string;
  organizerTrigger?: { className: string; label: ReactNode };
};

export default function VisitorLogin({ triggerClassName, organizerTrigger }: VisitorLoginProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [role, setRole] = useState<AccountRole>("visitor");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const visitorSignedIn = useSyncExternalStore(
    subscribeToDemoSession,
    () => Boolean(getDemoSession("visitor")),
    () => false,
  );
  const dialogId = useId();
  const headingId = `${dialogId}-heading`;
  const hintId = `${dialogId}-hint`;
  const isOrganizer = role === "organizer";

  useEffect(() => {
    if (dialogRef.current?.open) {
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [role, isSigningUp]);

  function openLogin(event: MouseEvent<HTMLButtonElement>, nextRole: AccountRole) {
    event.currentTarget.focus({ preventScroll: true });
    setRole(nextRole);
    setLoginError(false);
    setIsSigningUp(false);
    const dialog = dialogRef.current;
    dialog?.showModal();
    dialog?.querySelector("input")?.focus({ preventScroll: true });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const details = new FormData(event.currentTarget);
    if (!isSigningUp && !matchesDemoLogin(details)) {
      setLoginError(true);
      return;
    }

    const email = String(details.get("email") ?? "").trim();
    const username = String(details.get("username") ?? "").trim();
    const profile = isOrganizer && isSigningUp
      ? { username: username || email.split("@")[0], email }
      : null;

    setDemoSession(role, { profile });
    dialogRef.current?.close();
    if (isOrganizer) router.push("/organizer/events");
  }

  const loginTitle = isOrganizer ? "Organizer login" : "Log in to KOMA";
  const signUpLink = isOrganizer ? "Create an account" : "Sign up";
  const signUpPrompt = isOrganizer ? "New organizer?" : "Don’t have an account?";

  return (
    <>
      {triggerClassName && (
        <button
          className={triggerClassName}
          type="button"
          aria-haspopup={visitorSignedIn ? undefined : "dialog"}
          aria-controls={visitorSignedIn ? undefined : dialogId}
          onClick={(event) => {
            if (visitorSignedIn) setDemoSession("visitor", null);
            else openLogin(event, "visitor");
          }}
        >
          {visitorSignedIn ? "Log out" : "Log in"}
        </button>
      )}
      {organizerTrigger && (
        <button
          className={organizerTrigger.className}
          type="button"
          aria-haspopup="dialog"
          aria-controls={dialogId}
          onClick={(event) => openLogin(event, "organizer")}
        >
          {organizerTrigger.label}
        </button>
      )}
      <Popup
        ref={dialogRef}
        id={dialogId}
        className={`${styles.dialog} ${headingFont.variable} ${markerFont.variable} ${textFont.variable}`}
        aria-labelledby={headingId}
        aria-describedby={hintId}
        closeLabel={isSigningUp ? "Close sign-up" : "Close login"}
        onClose={(event) => {
          if (event.currentTarget.open) return;
          event.currentTarget.querySelector("form")?.reset();
          setLoginError(false);
          setIsSigningUp(false);
        }}
      >
        <div className={styles.content}>
          <Image className={styles.brandMark} src="/koma-mark.svg" alt="" width={53} height={50} />
          {isSigningUp && <p className={styles.eyebrow}>Keep your plans close</p>}
          <h2 className={styles.heading} id={headingId} ref={headingRef} tabIndex={-1}>
            {isSigningUp ? "Sign up for KOMA" : loginTitle}
          </h2>
          {isOrganizer && !isSigningUp && (
            <p className={styles.hint}>Log in to publish and manage your events.</p>
          )}
          {!isSigningUp && (
            <p className={styles.hint} id={hintId}>
              Try the {role} demo with <strong>{demoEmail}</strong> and password <strong>{demoPassword}</strong>.
            </p>
          )}
          <form
            key={`${role}-${isSigningUp ? "sign-up" : "login"}`}
            className={styles.form}
            method="dialog"
            autoComplete="off"
            onInput={() => setLoginError(false)}
            onSubmit={handleSubmit}
          >
            <div className={styles.fields}>
              {isOrganizer && isSigningUp && (
                <label className={styles.field}>
                  Username (optional)
                  <input name="username" type="text" placeholder="Choose a username" maxLength={40} />
                </label>
              )}
              <label className={styles.field}>
                Email address
                <input
                  name="email"
                  type="email"
                  aria-invalid={loginError || undefined}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className={styles.field}>
                Password
                <input
                  name="password"
                  type="password"
                  aria-invalid={loginError || undefined}
                  placeholder="Enter your password"
                  required
                />
              </label>
            </div>
            {!isSigningUp && (
              <>
                <p className={styles.error} role="alert">
                  {loginError && "Use the demo email address and password shown above."}
                </p>
                {!isOrganizer && (
                  <button className={styles.reset} type="button" disabled>
                    Forgot password?
                  </button>
                )}
              </>
            )}
            <button
              className={isSigningUp || isOrganizer ? `${styles.submit} ${styles.signUpSubmit}` : styles.submit}
              type="submit"
            >
              {isSigningUp ? "Create account" : "Log in"}
            </button>
          </form>
          {isSigningUp && (
            <p className={styles.demoNote} id={hintId}>
              Use sample details to try sign-up. Your demo session stays in this tab.
            </p>
          )}
          <p className={styles.accountPrompt}>
            {isSigningUp ? "Already have an account?" : signUpPrompt}{" "}
            <button
              className={styles.accountLink}
              type="button"
              onClick={() => {
                setLoginError(false);
                setIsSigningUp(!isSigningUp);
              }}
            >
              {isSigningUp ? "Log in" : signUpLink}
            </button>
          </p>
          {!isOrganizer && !isSigningUp && organizerTrigger && (
            <p className={styles.accountPrompt}>
              Organizing an event?{" "}
              <button className={styles.accountLink} type="button" onClick={() => {
                setLoginError(false);
                setRole("organizer");
              }}>
                Organizer login
              </button>
            </p>
          )}
        </div>
      </Popup>
    </>
  );
}
