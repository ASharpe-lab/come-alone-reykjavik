"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { setDemoSession } from "@/components/organisms/VisitorLogin/demoSession";
import styles from "./OrganizerStudio.module.css";

const links = [
  { href: "/organizer", label: "Overview" },
  { href: "/organizer/events", label: "My events" },
  { href: "/organizer/organization", label: "Organization" },
];

export default function OrganizerSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.organization}>
        <span className={styles.organizationMark} aria-hidden="true">LS</span>
        <p>Leir Studio <small>Organizer account</small></p>
      </div>
      <nav className={styles.navigation} aria-label="Organizer Studio">
        {links.map(({ href, label }, index) => {
          const isPage = pathname === href;
          const isEventsSection = href === "/organizer/events" && pathname.startsWith(`${href}/`);

          return (
            <Link key={href} href={href} aria-current={isPage ? "page" : isEventsSection ? "location" : undefined}>
              <span aria-hidden="true">0{index + 1}</span> {label}
            </Link>
          );
        })}
      </nav>
      <Link href="/" className={styles.signOut} onClick={() => setDemoSession("organizer", null)}>
        Log out
      </Link>
    </aside>
  );
}
