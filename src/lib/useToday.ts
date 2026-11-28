"use client";

import { useSyncExternalStore } from "react";

function getToday() {
  // Reykjavík stays on UTC year-round.
  return new Date().toISOString().slice(0, 10);
}

function subscribeToToday(onChange: () => void) {
  const timer = window.setInterval(onChange, 60_000);
  window.addEventListener("focus", onChange);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", onChange);
  };
}

export function useToday() {
  return useSyncExternalStore(subscribeToToday, getToday, () => "");
}
