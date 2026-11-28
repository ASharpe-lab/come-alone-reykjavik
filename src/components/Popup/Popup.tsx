"use client";

import Image from "next/image";
import type { ComponentPropsWithRef } from "react";
import styles from "./Popup.module.css";

type PopupProps = Pick<
  ComponentPropsWithRef<"dialog">,
  "ref" | "id" | "className" | "aria-labelledby" | "aria-describedby" | "onClose" | "children"
> & { closeLabel: string };

export default function Popup({ className, closeLabel, children, ...props }: PopupProps) {
  return (
    <dialog
      {...props}
      className={className ? `${styles.popup} ${className}` : styles.popup}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      {children}
      <form method="dialog" className={styles.closeForm}>
        <button className={styles.close} type="submit" aria-label={closeLabel}>
          <Image src="/login-close.svg" alt="" width={20} height={20} />
        </button>
      </form>
    </dialog>
  );
}
