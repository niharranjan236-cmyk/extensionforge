import Link from "next/link";
import { Nav } from "@/components/Nav";

const features = [
  ["AI prompt builder", "Describe an extension in plain English and generate Manifest V3-ready source files."],
  ["Launch workspace", "Track recent projects, profile details, and handoff-ready extension packages."],
  ["Production polish", "Responsive UI, dark mode, pricing, FAQ, and contact flows built for conversion."],
  ["ZIP exports", "Download manifest, popup, background, content script, icons, and README as a ready-to-load archive."]
];
const faqs = [
  ["Can I publish generated extensions?", "Yes. ExtensionForge creates starter files you can customize, test, and submit to the Chrome Web Store."],
  ["Does it use Manifest V3?", "Generated projects use Manifest V3 and a minimal popup architecture."],
  ["Is this responsive?", "Every surface is designed for desktop, tablet, and mobile workflows."]
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-white text-slate-950 dark:bg-[#08090c] dark:text-white">
      <Nav />
      <section className="gradient-grid relative px-6 pb-24 pt-36">
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl text-center">
          <p className="mx-auto mb-6 w-fit rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">Chrome extensions from idea to ZIP in minutes</p>
          <h1 className="mx-auto max-w-5xl text-5xl font-semibold tracking-tight sm:text-7xl">Forge production-ready Chrome extension starters without boilerplate.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">ExtensionForge combines an AI prompt builder, authentication screens, project dashboard, local project saving, Manifest V3 generation, icons, background and content scripts, and ZIP downloads.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/generator" className="btn-primary">Generate extension</Link><Link href="/dashboard" className="btn-secondary">View dashboard</Link></div>
          <div className="card mx-auto mt-16 max-w-5xl p-3"><div className="rounded-2xl border border-white/10 bg-slate-950 p-6 text-left shadow-2xl"><div className="mb-6 flex gap-2"><span className="h-3 w-3 rounded-full bg-red-400"/><span className="h-3 w-3 rounded-full bg-yellow-400"/><span className="h-3 w-3 rounded-full bg-green-400"/></div><pre className="overflow-x-auto text-sm text-blue-100">{`AI prompt → manifest.json\npopup.html + popup.js\nbackground.js + content.js\nicons/icon-128.svg\n\n$ extensionforge export --zip`}</pre></div></div>
        </div>
      </section>
      <section id="features" className="mx-auto grid max-w-7xl gap-4 px-6 py-20 md:grid-cols-2 lg:grid-cols-4">{features.map(([title, body]) => <article className="card" key={title}><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 text-slate-400">{body}</p></article>)}</section>
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20"><div className="grid gap-6 lg:grid-cols-3">{["Starter", "Pro", "Scale"].map((plan, i) => <div className="card" key={plan}><h3 className="text-2xl font-semibold">{plan}</h3><p className="mt-4 text-4xl font-bold">${[0,19,79][i]}<span className="text-base text-slate-400">/mo</span></p><p className="mt-4 text-slate-400">{["Validate ideas", "Ship faster", "Team governance"][i]}</p><Link href="/register" className="btn-primary mt-8 w-full">Choose {plan}</Link></div>)}</div></section>
      <section id="faq" className="mx-auto max-w-4xl px-6 py-20">{faqs.map(([q,a]) => <details className="card mb-4" key={q}><summary className="cursor-pointer text-lg font-semibold">{q}</summary><p className="mt-3 text-slate-400">{a}</p></details>)}</section>
      <section id="contact" className="mx-auto max-w-7xl px-6 py-20"><div className="card flex flex-col justify-between gap-6 md:flex-row md:items-center"><div><h2 className="text-3xl font-semibold">Ready to forge your next extension?</h2><p className="mt-2 text-slate-400">Contact hello@extensionforge.dev or start with the generator today.</p></div><Link href="/generator" className="btn-primary">Open generator</Link></div></section>
    </main>
  );
}
