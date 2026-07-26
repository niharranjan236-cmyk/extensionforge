import type { SupabaseSession } from "./supabase";
const key = "extensionforge.session";
export const saveSession = (session: SupabaseSession) => localStorage.setItem(key, JSON.stringify(session));
export const getSession = (): SupabaseSession | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) as SupabaseSession : null;
};
export const clearSession = () => localStorage.removeItem(key);
