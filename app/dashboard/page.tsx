"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { getSession } from "@/lib/auth";
import { deleteProject, getProjects, type ProjectRow } from "@/lib/supabase";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProjects() {
    const session = getSession();
    if (!session?.access_token) { setError("Log in to view your saved Supabase projects."); setLoading(false); return; }
    try { setProjects(await getProjects(session.access_token)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load projects."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void loadProjects(); }, []);

  async function remove(id: string) {
    const session = getSession(); if (!session?.access_token) return;
    await deleteProject(session.access_token, id);
    setProjects((rows) => rows.filter((project) => project.id !== id));
  }
  async function download(project: ProjectRow) {
    const response = await fetch(`/api/projects/${project.id}/zip`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: project.name, files: project.files }) });
    const blob = await response.blob(); const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.zip`; anchor.click(); URL.revokeObjectURL(url);
  }

  return <main className="min-h-screen md:flex"><Sidebar /><section className="flex-1 p-4 sm:p-6 md:p-10"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><p className="text-blue-300">Dashboard</p><h1 className="text-3xl font-semibold sm:text-5xl">Your extension workspace</h1><p className="mt-3 max-w-2xl text-slate-400">View, edit, delete, and download ZIP files for projects saved to your authenticated Supabase account.</p></div><Link href="/generator" className="btn-primary">New extension</Link></div>{error && <p className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</p>}<div className="mt-10 grid gap-4 md:grid-cols-3"><div className="card"><p className="text-slate-400">Saved projects</p><p className="mt-2 text-4xl font-bold">{projects.length}</p></div><div className="card"><p className="text-slate-400">Generated files</p><p className="mt-2 text-4xl font-bold">{projects.reduce((sum, project) => sum + Object.keys(project.files || {}).length, 0)}</p></div><div className="card"><p className="text-slate-400">Storage</p><p className="mt-2 text-4xl font-bold">Supabase</p></div></div><section className="card mt-8"><h2 className="text-2xl font-semibold">Project history</h2><p className="mt-1 text-slate-400">Every generated project is attached to the authenticated user via row-level security.</p>{loading ? <p className="mt-6 text-slate-300">Loading projects...</p> : <div className="mt-6 grid gap-3">{projects.map((project) => <div className="rounded-2xl border border-white/10 p-4" key={project.id}><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><span className="font-semibold">{project.name}</span><span className="text-sm text-slate-400">{new Date(project.updated_at).toLocaleDateString()}</span></div><p className="mt-2 line-clamp-2 text-sm text-slate-400">{project.prompt}</p><div className="mt-4 flex flex-wrap gap-2"><Link className="btn-secondary py-2" href={`/projects/${project.id}`}>View</Link><Link className="btn-secondary py-2" href={`/generator?project=${project.id}`}>Edit</Link><button className="btn-secondary py-2" type="button" onClick={() => remove(project.id)}>Delete</button><button className="btn-primary py-2" type="button" onClick={() => download(project)}>Download ZIP</button></div></div>)}{!projects.length && <p className="text-slate-400">No projects yet. Generate your first extension to populate history.</p>}</div>}</section></section></main>;
}
