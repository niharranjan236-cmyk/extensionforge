"use client";
import JSZip from "jszip";
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { buildExtensionFiles, inferExtensionInput, type ExtensionInput } from "@/lib/extension";

const starterPrompt = "Build a Chrome extension that helps busy founders summarize the current page, save quick notes, and keep a clean productivity workflow.";
const initialForm = inferExtensionInput(starterPrompt);

type SavedProject = { id: string; name: string; prompt: string; updatedAt: string; fileCount: number };

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState(starterPrompt);
  const [form, setForm] = useState<ExtensionInput>(initialForm);
  const [saved, setSaved] = useState(false);
  const files = useMemo(() => buildExtensionFiles(form), [form]);
  const update = (key: keyof ExtensionInput, value: string) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => setSaved(false), [form]);

  function generateFromPrompt() {
    setForm(inferExtensionInput(prompt));
  }

  function saveProject() {
    const project: SavedProject = { id: crypto.randomUUID(), name: form.name, prompt: form.prompt, updatedAt: new Date().toISOString(), fileCount: Object.keys(files).length };
    const projects = JSON.parse(localStorage.getItem("extensionforge.projects") || "[]") as SavedProject[];
    localStorage.setItem("extensionforge.projects", JSON.stringify([project, ...projects].slice(0, 20)));
    setSaved(true);
  }

  async function downloadZip() {
    const zip = new JSZip();
    Object.entries(files).forEach(([name, content]) => zip.file(name, content));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "extension"}.zip`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <main className="min-h-screen md:flex"><Sidebar /><section className="flex-1 p-4 sm:p-6 md:p-10"><div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end"><div><p className="text-blue-300">AI Chrome Extension Builder</p><h1 className="max-w-4xl text-3xl font-semibold sm:text-5xl">Describe an extension and export a Manifest V3 ZIP.</h1><p className="mt-3 max-w-2xl text-slate-400">ExtensionForge turns plain English into manifest.json, popup, background, content script, icons, project storage, and a browser-ready download.</p></div><div className="flex gap-3"><button className="btn-secondary" type="button" onClick={saveProject}>{saved ? "Saved" : "Save project"}</button><button className="btn-primary" type="button" onClick={downloadZip}>Download ZIP</button></div></div><div className="mt-8 grid gap-6 xl:grid-cols-[460px_1fr]"><form className="card space-y-4"><label className="block text-sm font-medium">AI prompt<textarea className="input mt-2 min-h-40" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the Chrome extension you want..." /></label><button className="btn-primary w-full" type="button" onClick={generateFromPrompt}>Generate files with AI</button><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm">Extension name<input className="input mt-2" value={form.name} onChange={(e) => update("name", e.target.value)} /></label><label className="block text-sm">Primary color<input className="input mt-2 h-[50px]" type="color" value={form.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} /></label></div><label className="block text-sm">Description<textarea className="input mt-2 min-h-28" value={form.description} onChange={(e) => update("description", e.target.value)} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm">Popup title<input className="input mt-2" value={form.popupTitle} onChange={(e) => update("popupTitle", e.target.value)} /></label><label className="block text-sm">Button text<input className="input mt-2" value={form.buttonText} onChange={(e) => update("buttonText", e.target.value)} /></label></div></form><div className="grid gap-4">{Object.entries(files).map(([name, content]) => <article className="card" key={name}><div className="flex items-center justify-between gap-3"><h2 className="font-semibold text-blue-200">{name}</h2><span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200">{content.length.toLocaleString()} chars</span></div><pre className="mt-4 max-h-72 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-200">{content}</pre></article>)}</div></div></section></main>;
}
