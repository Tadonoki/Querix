export type LocalAuthUser = {
  id?: string;
  name: string;
  email: string;
  image?: string | null;
  provider?: "email";
};

const AUTH_STORAGE_KEY = "querix-auth-user";
export const AUTH_EVENT = "querix-auth-change";

function fallbackName(email: string) {
  const rawName = email.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  return rawName
    ? rawName.replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Pengguna Querix";
}

export function readLocalAuthUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as LocalAuthUser) : null;
  } catch {
    return null;
  }
}

export function saveLocalAuthUser(user: LocalAuthUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (user) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function createLocalEmailUser({
  email,
  name
}: {
  email: string;
  name?: string;
}) {
  const normalizedEmail = email.trim().toLowerCase();

  return {
    id: `local-${normalizedEmail}`,
    name: name?.trim() || fallbackName(normalizedEmail),
    email: normalizedEmail,
    provider: "email" as const
  };
}
