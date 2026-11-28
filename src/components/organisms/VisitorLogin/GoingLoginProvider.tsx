"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import VisitorLogin from "./VisitorLogin";

export type GoingLoginEvent = { id: string; title: string };

const GoingLoginContext = createContext<((event: GoingLoginEvent) => void) | null>(null);

export function useGoingLogin() {
  return useContext(GoingLoginContext);
}

export default function GoingLoginProvider({ children }: { children: ReactNode }) {
  const [event, setEvent] = useState<GoingLoginEvent | null>(null);

  return (
    <GoingLoginContext.Provider value={setEvent}>
      {children}
      {event && <VisitorLogin goingEvent={event} onDismiss={() => setEvent(null)} />}
    </GoingLoginContext.Provider>
  );
}
