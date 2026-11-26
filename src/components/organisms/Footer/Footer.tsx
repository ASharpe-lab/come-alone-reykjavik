import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

export type FooterLink = {
  label: string;
  href: string;
};

type FooterProps = {
  links: FooterLink[];
  tagline: string;
  copyright: string;
};

export default function Footer({ links, tagline, copyright }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <Link className={styles.brand} href="/" aria-label="KOMA home">
          <Image src="/koma-mark.svg" alt="" width={53} height={50} />
          <span>KOMA</span>
        </Link>

        <p className={styles.tagline}>{tagline}</p>

        <nav className={styles.navigation} aria-label="Footer navigation">
          {links.map((link) => (
            <Link href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <p className={styles.copyright}>{copyright}</p>
    </footer>
  );
}
