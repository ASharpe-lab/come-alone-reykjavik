import Image from "next/image";
import { Bebas_Neue, Permanent_Marker, Space_Grotesk } from "next/font/google";
import StorySignup from "./StorySignup";
import styles from "./CityStory.module.css";

const headingFont = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-story-heading",
});

const markerFont = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-story-marker",
});

const textFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-story-text",
});

export default function CityStory() {
  return (
    <section
      className={`${styles.story} ${headingFont.variable} ${markerFont.variable} ${textFont.variable}`}
      id="city-stories"
      aria-labelledby="city-stories-heading"
    >
      <div className={styles.photo}>
        <Image
          src="/reykjavik-city-story.jpg"
          alt="Colourful rooftops across Reykjavík"
          fill
          sizes="(max-width: 760px) 100vw, 58vw"
        />
        <p className={styles.readingTime}>City story · 6 min read</p>
      </div>
      <div className={styles.panel}>
        <p className={styles.eyebrow}>Reykjavík stories</p>
        <h2 className={styles.heading} id="city-stories-heading">
          The pool is Reykjavík’s living room
        </h2>
        <p className={styles.summary}>
          Where to go, what to do, and why nobody minds the weather. A beginner’s
          guide to the city’s most beloved ritual.
        </p>
        <StorySignup />
      </div>
    </section>
  );
}
