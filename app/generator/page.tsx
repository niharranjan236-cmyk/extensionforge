"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { buildExtensionFiles, inferExtensionInput, type ExtensionInput } from "@/lib/extension";
import { createProject, getProjects, updateProject, type ProjectFiles } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

const starterPrompt = "Build a Chrome extension that helps busy founders summarize the current page, save quick notes, and keep a clean productivity workflow.";
const initialForm = inferExtensionInput(starterPrompt);

function GeneratorWorkspace() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");
  const [prompt, setPrompt] = useState(starterPrompt);
  const [form, setForm] = useState<ExtensionInput>(initialForm);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const files = useMemo(() => buildExtensionFiles(form), [form]);
  const update = (key: keyof ExtensionInput, value: string) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => { setMessage(""); setError(""); }, [form]);

  useEffect(() => {
    if (!projectId) return;
    const session = getSession();
    if (!session?.access_token) { setError("Please log in to edit projects."); return; }
    void getProjects(session.access_token).then((rows) => {
      const project = rows.find((row) => row.id === projectId);
      if (!project) return;
      const next = inferExtensionInput(project.prompt);
      setPrompt(project.prompt);
      setForm({ ...next, name: project.name, description: project.description });
      setMessage("Loaded project for editing. Save will update the existing Supabase project.");
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Project load failed."));
  }, [projectId]);

  async function generateFromPrompt() {
    setGenerating(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed.");
      setForm(data.input);
      setMessage(data.source === "fallback" ? "Generated with the local fallback because OPENAI_API_KEY is not configured." : "Generated with OpenAI.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Generation failed."); }
    finally { setGenerating(false); }
  }

  async function saveProject() {
    const session = getSession();
    if (!session?.access_token) { setError("Please log in before saving projects."); return; }
    setSaving(true); setError("");
    try {
      if (projectId) {
        await updateProject(session.access_token, projectId, { name: form.name, prompt: form.prompt, description: form.description, files });
        setMessage("Project updated in your Supabase account.");
      } else {
        await createProject(session.access_token, { name: form.name, prompt: form.prompt, description: form.description, files });
        setMessage("Project saved to your Supabase account.");
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Save failed."); }
    finally { setSaving(false); }
  }

  async function downloadZip(projectFiles: ProjectFiles = files, name = form.name) {
    const response = await fetch("/api/projects/new/zip", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, files: projectFiles }) });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "extension"}.zip`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <main className="min-h-screen md:flex"><Sidebar /><section className="flex-1 p-4 sm:p-6 md:p-10"><div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end"><div><p className="text-blue-300">AI Chrome Extension Builder</p><h1 className="max-w-4xl text-3xl font-semibold sm:text-5xl">Describe an extension and export a Manifest V3 ZIP.</h1><p className="mt-3 max-w-2xl text-slate-400">ExtensionForge uses OpenAI for natural-language generation, saves projects to Supabase, and exports complete Chrome extension ZIPs.</p></div><div className="flex gap-3"><button className="btn-secondary" type="button" disabled={saving} onClick={saveProject}>{saving ? "Saving..." : projectId ? "Update project" : "Save project"}</button><button className="btn-primary" type="button" onClick={() => downloadZip()}>Download ZIP</button></div></div>{error && <p className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</p>}{message && <p className="mt-6 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-4 text-blue-100">{message}</p>}<div className="mt-8 grid gap-6 xl:grid-cols-[460px_1fr]"><form className="card space-y-4"><label className="block text-sm font-medium">AI prompt<textarea className="input mt-2 min-h-40" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the Chrome extension you want..." /></label><button className="btn-primary w-full" type="button" disabled={generating} onClick={generateFromPrompt}>{generating ? "Generating..." : "Generate files with AI"}</button><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm">Extension name<input className="input mt-2" value={form.name} onChange={(e) => update("name", e.target.value)} /></label><label className="block text-sm">Primary color<input className="input mt-2 h-[50px]" type="color" value={form.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} /></label></div><label className="block text-sm">Description<textarea className="input mt-2 min-h-28" value={form.description} onChange={(e) => update("description", e.target.value)} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm">Popup title<input className="input mt-2" value={form.popupTitle} onChange={(e) => update("popupTitle", e.target.value)} /></label><label className="block text-sm">Button text<input className="input mt-2" value={form.buttonText} onChange={(e) => update("buttonText", e.target.value)} /></label></div></form><div className="grid gap-4">{Object.entries(files).map(([name, content]) => <article className="card" key={name}><div className="flex items-center justify-between gap-3"><h2 className="font-semibold text-blue-200">{name}</h2><span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200">{content.length.toLocaleString()} chars</span></div><pre className="mt-4 max-h-72 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-200">{content}</pre></article>)}</div></div></section></main>;
}

export default function GeneratorPage() {
  return <Suspense fallback={<main className="min-h-screen md:flex"><Sidebar /><section className="flex-1 p-10 text-slate-300">Loading generator...</section></main>}><GeneratorWorkspace /></Suspense>;
}
