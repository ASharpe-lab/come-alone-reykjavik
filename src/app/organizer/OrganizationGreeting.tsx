"use client";

import { useOrganizationProfile } from "./organizationProfile";

export default function OrganizationGreeting({ id }: { id: string }) {
  const { profile } = useOrganizationProfile();

  return <h1 id={id}>Good morning,<br />{profile.name.replace(/\.$/, "")}.</h1>;
}
