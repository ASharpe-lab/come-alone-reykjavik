export type AccountRole = "visitor" | "organizer";

type DemoProfile = { username: string; email: string };
type DemoSession = { profile: DemoProfile | null };

const sessions: Partial<Record<AccountRole, DemoSession | null>> = {};
const listeners = new Set<() => void>();

function isDemoProfile(value: unknown): value is DemoProfile {
  return (
    typeof value === "object" && value !== null &&
    "username" in value && typeof value.username === "string" && value.username.trim().length > 0 &&
    "email" in value && typeof value.email === "string"
  );
}

export function subscribeToDemoSession(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getDemoSession(role: AccountRole) {
  if (sessions[role] === undefined) {
    try {
      const value = window.sessionStorage.getItem(`koma-${role}-demo-session`);
      if (value === "active") {
        sessions[role] = { profile: null };
      } else {
        const profile: unknown = value ? JSON.parse(value) : null;
        sessions[role] = isDemoProfile(profile) ? { profile } : null;
      }
    } catch {
      sessions[role] = null;
    }
  }
  return sessions[role];
}

export function setDemoSession(role: AccountRole, session: DemoSession | null) {
  sessions[role] = session;
  const key = `koma-${role}-demo-session`;

  try {
    if (session) {
      window.sessionStorage.setItem(key, session.profile ? JSON.stringify(session.profile) : "active");
    } else {
      window.sessionStorage.removeItem(key);
    }
  } catch {
    // Keep the demo usable when browser storage is unavailable.
  }

  for (const listener of listeners) listener();
}
