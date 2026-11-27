"use client";

import Image from "next/image";
import { useId, useRef, type ReactNode } from "react";
import Popup from "@/components/Popup/Popup";
import styles from "./EventCard.module.css";

type EventDetailsProps = {
  event: {
    title: string;
    image: string;
    imageAlt?: string;
    dateLabel: string;
    category: string;
    metadata: { label: string; value: string; icon?: string }[];
    tags?: string[];
    price?: string;
  };
  triggerClassName?: string;
  children?: ReactNode;
};

export default function EventDetails({ event, triggerClassName, children }: EventDetailsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dialogId = useId();
  const titleId = `${dialogId}-title`;

  return (
    <>
      <button
        className={triggerClassName ? `${styles.detailsTrigger} ${triggerClassName}` : styles.detailsTrigger}
        type="button"
        aria-label={`See details for ${event.title}`}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        onClick={(click) => {
          click.currentTarget.focus({ preventScroll: true });
          dialogRef.current?.showModal();
          titleRef.current?.focus({ preventScroll: true });
        }}
      >
        {children ?? (
          <>
            See details
            <Image src="/featured-events/details-arrow.svg" alt="" width={16} height={16} />
          </>
        )}
      </button>
      <Popup
        className={styles.detailsDialog}
        closeLabel={`Close details for ${event.title}`}
        ref={dialogRef}
        id={dialogId}
        aria-labelledby={titleId}
      >
        <div className={styles.detailsLayout}>
          <div className={styles.detailsPhoto}>
            <Image src={event.image} alt={event.imageAlt ?? ""} fill sizes="(max-width: 640px) 100vw, 400px" />
            <p className={styles.detailsCategory}>{event.category}</p>
          </div>
          <div className={styles.detailsContent}>
            <p className={styles.detailsDate}>{event.dateLabel}</p>
            <h2 className={styles.detailsTitle} id={titleId} ref={titleRef} tabIndex={-1}>{event.title}</h2>
            <dl className={styles.detailsMetadata}>
              {event.metadata.map(({ label, value, icon }) => (
                <div key={label}>
                  <dt>
                    {icon && <Image src={icon} alt="" width={20} height={20} />}
                    {label}
                  </dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            {event.tags && (
              <ul className={styles.tags} aria-label="Event tags">
                {event.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            )}
            {event.price && <p className={styles.detailsPrice}><span>Entry</span> {event.price}</p>}
          </div>
        </div>
      </Popup>
    </>
  );
}
