import Link from "next/link";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#08090c]/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500 shadow-glow">✦</span>
          ExtensionForge
        </Link>
        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="/#features">Features</a><a href="/#pricing">Pricing</a><a href="/#faq">FAQ</a><a href="/#contact">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm text-slate-300 sm:block">Log in</Link>
          <Link href="/register" className="btn-primary py-2">Start free</Link>
        </div>
      </nav>
    </header>
  );
}
