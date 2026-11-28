import Image from "next/image";
import { Bebas_Neue, Permanent_Marker, Space_Grotesk } from "next/font/google";
import styles from "./HomeHero.module.css";

const headlineFont = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hero-headline",
});

const markerFont = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hero-marker",
});

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-hero-body",
});

export default function HomeHero() {
  return (
    <section
      className={`${styles.hero} ${headlineFont.variable} ${markerFont.variable} ${bodyFont.variable}`}
      aria-labelledby="home-hero-heading"
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Reykjavík, together</p>
          <h1 className={styles.headline} id="home-hero-heading">
            <span>Find your way</span> <span>into the city.</span>
          </h1>
          <p className={styles.description}>
            Small events, open doors, and good reasons to go out—even if you’re
            going alone.
          </p>
        </div>
        <div className={styles.artwork}>
          <div className={styles.photo}>
            <Image
              src="/koma-reykjavik-hero.jpg"
              alt="People walking along a street in Reykjavík"
              fill
              preload
              sizes="(max-width: 530px) 46vw, (max-width: 767px) 244px, (max-width: 1440px) 23vw, 330px"
            />
          </div>
          <span className={styles.coordinates}>64°08′ N</span>
        </div>
      </div>
    </section>
  );
}
