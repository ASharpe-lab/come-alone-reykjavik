import type { Metadata } from "next";
import OrganizerEventsWorkspace from "../OrganizerEventsWorkspace";

export const metadata: Metadata = { title: "My events · KOMA Organizer Studio" };

export default function MyEvents() {
  return <OrganizerEventsWorkspace view="events" />;
}
