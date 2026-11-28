import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import VisitorLogin from "@/components/organisms/VisitorLogin/VisitorLogin";
import styles from "./Header.module.css";

const headerFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-header",
});

export type HeaderLink = {
  label: string;
  href: string;
};

type HeaderProps = {
  links: HeaderLink[];
  loginHref?: string;
  listEventHref?: string;
};

export default function Header({ links, loginHref, listEventHref }: HeaderProps) {
  const listEventLabel = (
    <>
      List an event
      <Image src="/header-list-event-arrow.svg" alt="" width={17} height={17} />
    </>
  );

  return (
    <header className={`${styles.header} ${headerFont.variable}`}>
      <Link className={styles.brand} href="/" aria-label="KOMA home">
        <span className={styles.mark}>
          <Image src="/koma-mark.svg" alt="" width={53} height={50} loading="eager" />
        </span>
        <span>KOMA</span>
      </Link>

      <nav className={styles.navigation} aria-label="Main navigation">
        {links.map((link) => (
          <Link className={styles.navigationLink} href={link.href} key={link.label}>
            {link.label}
          </Link>
        ))}
        {loginHref && (
          <Link className={styles.navigationLink} href={loginHref}>
            Log in
          </Link>
        )}
        {(!loginHref || !listEventHref) && (
          <VisitorLogin
            triggerClassName={loginHref ? undefined : styles.navigationLink}
            organizerTrigger={listEventHref ? undefined : { className: styles.actionLink, label: listEventLabel }}
          />
        )}
        {listEventHref && (
          <Link className={styles.actionLink} href={listEventHref}>
            {listEventLabel}
          </Link>
        )}
      </nav>
    </header>
  );
}
