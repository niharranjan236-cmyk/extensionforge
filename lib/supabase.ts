export type SupabaseUser = { id: string; email?: string; user_metadata?: Record<string, unknown> };
export type SupabaseSession = { access_token: string; refresh_token?: string; user: SupabaseUser };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

async function supabaseFetch<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase environment variables are not configured.");
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token || supabaseAnonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {})
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.msg || data?.message || data?.error_description || "Supabase request failed.");
  return data as T;
}

export async function signUp(email: string, password: string, name: string) {
  return supabaseFetch<{ access_token?: string; user?: SupabaseUser }>("/auth/v1/signup", { method: "POST", body: JSON.stringify({ email, password, data: { name } }) });
}

export async function signIn(email: string, password: string) {
  return supabaseFetch<SupabaseSession>("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function getProjects(token: string) {
  return supabaseFetch<ProjectRow[]>("/rest/v1/projects?select=*&order=updated_at.desc", undefined, token);
}

export async function createProject(token: string, project: ProjectInsert) {
  const rows = await supabaseFetch<ProjectRow[]>("/rest/v1/projects", { method: "POST", body: JSON.stringify(project) }, token);
  return rows[0];
}

export async function updateProject(token: string, id: string, project: Partial<ProjectInsert>) {
  const rows = await supabaseFetch<ProjectRow[]>(`/rest/v1/projects?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(project) }, token);
  return rows[0];
}

export async function deleteProject(token: string, id: string) {
  await supabaseFetch(`/rest/v1/projects?id=eq.${id}`, { method: "DELETE" }, token);
}

export type ProjectFiles = Record<string, string>;
export type ProjectRow = { id: string; user_id: string; name: string; prompt: string; description: string; files: ProjectFiles; created_at: string; updated_at: string };
export type ProjectInsert = { name: string; prompt: string; description: string; files: ProjectFiles };
