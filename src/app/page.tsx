import { Suspense } from "react";
import CityStory from "@/components/organisms/CityStory/CityStory";
import EventsSection from "@/components/organisms/EventsSection/EventsSection";
import Footer from "@/components/organisms/Footer/Footer";
import Header from "@/components/organisms/Header/Header";
import HomeHero from "@/components/organisms/HomeHero/HomeHero";
import styles from "./Home.module.css";

type SearchParams = PageProps<"/">["searchParams"];
const links = [
  { label: "Events", href: "#events" },
  { label: "City stories", href: "#city-stories" },
];

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <>
      <Header links={links} />
      <main className={styles.main}>
        <HomeHero />
        <Suspense fallback={<EventsSection />}>
          <FilteredEvents searchParams={searchParams} />
        </Suspense>
        <CityStory />
      </main>
      <Footer links={links} />
    </>
  );
}

async function FilteredEvents({ searchParams }: { searchParams: SearchParams }) {
  return <EventsSection filters={await searchParams} />;
}
