"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";

type SavedProject = { id: string; name: string; prompt: string; updatedAt: string; fileCount: number };
const fallbackProjects: SavedProject[] = [
  { id: "demo-1", name: "LaunchBar Notes", prompt: "Save fast notes from the active tab.", updatedAt: new Date().toISOString(), fileCount: 9 },
  { id: "demo-2", name: "Coupon Scout", prompt: "Find coupon codes while shopping.", updatedAt: new Date().toISOString(), fileCount: 9 },
  { id: "demo-3", name: "Tab Focus", prompt: "Block distracting tabs during focus time.", updatedAt: new Date().toISOString(), fileCount: 9 }
];

export default function DashboardPage() {
  const [projects, setProjects] = useState<SavedProject[]>(fallbackProjects);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("extensionforge.projects") || "[]") as SavedProject[];
    if (saved.length) setProjects(saved);
  }, []);

  return <main className="min-h-screen md:flex"><Sidebar /><section className="flex-1 p-4 sm:p-6 md:p-10"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><p className="text-blue-300">Dashboard</p><h1 className="text-3xl font-semibold sm:text-5xl">Your extension workspace</h1><p className="mt-3 max-w-2xl text-slate-400">Save AI-generated projects, review prompts, and download deployment-ready Chrome extension ZIPs.</p></div><div className="card flex items-center gap-4"><div className="grid h-12 w-12 place-items-center rounded-full bg-blue-500 font-bold">A</div><div><p className="font-semibold">Alex Morgan</p><p className="text-sm text-slate-400">Authenticated workspace</p></div></div></div><div className="mt-10 grid gap-4 md:grid-cols-3"><div className="card"><p className="text-slate-400">Saved projects</p><p className="mt-2 text-4xl font-bold">{projects.length}</p></div><div className="card"><p className="text-slate-400">Generated files</p><p className="mt-2 text-4xl font-bold">{projects.reduce((sum, project) => sum + project.fileCount, 0)}</p></div><div className="card"><p className="text-slate-400">Deployment</p><p className="mt-2 text-4xl font-bold">Vercel</p></div></div><section className="card mt-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-semibold">Recent projects</h2><p className="mt-1 text-slate-400">Projects are stored locally for this production-ready prototype.</p></div><Link href="/generator" className="btn-primary">New extension</Link></div><div className="mt-6 grid gap-3">{projects.map((project) => <div className="rounded-2xl border border-white/10 p-4" key={project.id}><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><span className="font-semibold">{project.name}</span><span className="text-sm text-slate-400">{new Date(project.updatedAt).toLocaleDateString()}</span></div><p className="mt-2 line-clamp-2 text-sm text-slate-400">{project.prompt}</p></div>)}</div></section></section></main>;
}
