"use client";
import JSZip from "jszip";
import { useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { buildExtensionFiles, type ExtensionInput } from "@/lib/extension";

export default function GeneratorPage() {
  const [form, setForm] = useState<ExtensionInput>({ name: "Focus Forge", description: "A clean productivity popup.", popupTitle: "Focus Forge", buttonText: "Start focus" });
  const files = useMemo(() => buildExtensionFiles(form), [form]);
  const update = (key: keyof ExtensionInput, value: string) => setForm((current) => ({ ...current, [key]: value }));
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
  return <main className="min-h-screen md:flex"><Sidebar /><section className="flex-1 p-6 md:p-10"><p className="text-blue-300">Chrome Extension Generator</p><h1 className="text-4xl font-semibold">Generate a loadable starter extension</h1><div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]"><form className="card space-y-4"><label className="block text-sm">Extension name<input className="input mt-2" value={form.name} onChange={(e) => update("name", e.target.value)} /></label><label className="block text-sm">Description<textarea className="input mt-2 min-h-28" value={form.description} onChange={(e) => update("description", e.target.value)} /></label><label className="block text-sm">Popup title<input className="input mt-2" value={form.popupTitle} onChange={(e) => update("popupTitle", e.target.value)} /></label><label className="block text-sm">Button text<input className="input mt-2" value={form.buttonText} onChange={(e) => update("buttonText", e.target.value)} /></label><button className="btn-primary w-full" type="button" onClick={downloadZip}>Download ZIP</button></form><div className="grid gap-4">{Object.entries(files).map(([name, content]) => <article className="card" key={name}><h2 className="font-semibold text-blue-200">{name}</h2><pre className="mt-4 max-h-72 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-200">{content}</pre></article>)}</div></div></section></main>;
}
