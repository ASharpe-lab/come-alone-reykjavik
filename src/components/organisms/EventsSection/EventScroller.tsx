"use client";

import Image from "next/image";
import { useId, useRef, type ReactNode } from "react";
import styles from "./EventsSection.module.css";

export default function EventScroller({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollerId = useId();

  return (
    <div className={styles.scrollerShell}>
      <div
        id={scrollerId}
        ref={scrollerRef}
        className={styles.cardScroller}
        role="region"
        aria-label="Featured events"
        tabIndex={0}
      >
        {children}
      </div>
      <div className={styles.jumpControls}>
        <button
          type="button"
          aria-controls={scrollerId}
          aria-label="Scroll to first event row"
          onClick={() => scrollerRef.current?.scrollTo({ top: 0 })}
        >
          <Image src="/events-scroll-up.svg" alt="" width={12} height={9} />
        </button>
        <button
          type="button"
          aria-controls={scrollerId}
          aria-label="Scroll to last event row"
          onClick={() => {
            const scroller = scrollerRef.current;
            if (scroller) scroller.scrollTo({ top: scroller.scrollHeight });
          }}
        >
          <Image src="/events-scroll-down.svg" alt="" width={12} height={9} />
        </button>
      </div>
    </div>
  );
}
