import type { Metadata } from "next";
import OrganizerEventsWorkspace from "../../OrganizerEventsWorkspace";

export const metadata: Metadata = { title: "Create an event · KOMA Organizer Studio" };

export default function CreateEventPage() {
  return <OrganizerEventsWorkspace view="create-event" />;
}
