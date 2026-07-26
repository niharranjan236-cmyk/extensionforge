"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { getSession } from "@/lib/auth";
import { getProjects, type ProjectRow } from "@/lib/supabase";

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { (async () => {
    const session = getSession(); if (!session?.access_token) { setError("Please log in to view this project."); return; }
    try { setProject((await getProjects(session.access_token)).find((row) => row.id === id) || null); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Project load failed."); }
  })(); }, [id]);
  return <main className="min-h-screen md:flex"><Sidebar /><section className="flex-1 p-4 sm:p-6 md:p-10"><Link href="/dashboard" className="text-blue-300">← Dashboard</Link>{error && <p className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</p>}{!project ? <p className="mt-8 text-slate-300">Loading project...</p> : <><div className="mt-6 flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><h1 className="text-4xl font-semibold">{project.name}</h1><p className="mt-2 text-slate-400">{project.description}</p></div><Link className="btn-primary" href={`/generator?project=${project.id}`}>Edit project</Link></div><div className="mt-8 grid gap-4">{Object.entries(project.files).map(([name, content]) => <article className="card" key={name}><h2 className="font-semibold text-blue-200">{name}</h2><pre className="mt-4 max-h-96 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-200">{content}</pre></article>)}</div></>}</section></main>;
}
