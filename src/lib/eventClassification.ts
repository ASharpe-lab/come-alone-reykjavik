export const eventCategories = ["Music", "Theatre", "Workshops", "Outdoors", "Culture", "Social"] as const;

export const eventAreas = [
  { value: "city-centre", label: "City centre" },
  { value: "outside-city-centre", label: "Outside city centre" },
] as const;

export type EventArea = (typeof eventAreas)[number]["value"];
