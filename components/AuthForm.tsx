import Link from "next/link";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  return <main className="grid min-h-screen place-items-center px-6 py-12"><div className="card w-full max-w-md"><Link href="/" className="text-sm text-blue-300">← ExtensionForge</Link><h1 className="mt-6 text-3xl font-semibold">{isLogin ? "Welcome back" : "Create your account"}</h1><p className="mt-2 text-slate-400">{isLogin ? "Log in to your extension workspace." : "Start generating Chrome extensions today."}</p><form className="mt-8 space-y-4"><input className="input" placeholder="Email" type="email" />{!isLogin && <input className="input" placeholder="Full name" />}<input className="input" placeholder="Password" type="password" /><button className="btn-primary w-full" type="button">{isLogin ? "Log in" : "Register"}</button></form><p className="mt-6 text-center text-sm text-slate-400">{isLogin ? "No account?" : "Already registered?"} <Link className="text-blue-300" href={isLogin ? "/register" : "/login"}>{isLogin ? "Create one" : "Log in"}</Link></p></div></main>;
}
