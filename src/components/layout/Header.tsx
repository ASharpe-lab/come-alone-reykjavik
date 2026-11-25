import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

export type HeaderLink = {
  label: string;
  href: string;
};

type HeaderProps = {
  links: HeaderLink[];
  listEventHref?: string;
};

export default function Header({ links, listEventHref }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="KOMA home">
        <Image src="/koma-mark.svg" alt="" width={53} height={50} priority />
        <span>KOMA</span>
      </Link>

      <nav className={styles.navigation} aria-label="Main navigation">
        {links.map((link) => (
          <Link className={styles.navigationLink} href={link.href} key={link.label}>
            {link.label}
          </Link>
        ))}
        {listEventHref && (
          <Link className={styles.actionLink} href={listEventHref}>
            List an event <span aria-hidden="true">→</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
