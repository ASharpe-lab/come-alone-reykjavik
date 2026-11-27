import type { Metadata } from "next";
import OrganizerEventsWorkspace from "../OrganizerEventsWorkspace";

export const metadata: Metadata = { title: "Organization · KOMA Organizer Studio" };

export default function Organization() {
  return <OrganizerEventsWorkspace view="organization" />;
}
