"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { saveSession } from "@/lib/auth";
import { signIn, signUp } from "@/lib/supabase";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const result = isLogin ? await signIn(email, password) : await signUp(email, password, name || email.split("@")[0]);
      if ("access_token" in result && result.access_token && result.user) saveSession(result as Parameters<typeof saveSession>[0]);
      router.push("/dashboard");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Authentication failed."); }
    finally { setLoading(false); }
  }

  return <main className="grid min-h-screen place-items-center px-6 py-12"><div className="card w-full max-w-md"><Link href="/" className="text-sm text-blue-300">← ExtensionForge</Link><h1 className="mt-6 text-3xl font-semibold">{isLogin ? "Welcome back" : "Create your account"}</h1><p className="mt-2 text-slate-400">{isLogin ? "Log in with Supabase Auth to save projects and export ZIPs." : "Create a Supabase-backed workspace for AI-generated Chrome extensions."}</p>{error && <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}<form className="mt-8 space-y-4" onSubmit={submit}><input className="input" placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />{!isLogin && <input className="input" placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} required />}<input className="input" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} /><button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? "Please wait..." : isLogin ? "Log in" : "Register"}</button></form><p className="mt-6 text-center text-sm text-slate-400">{isLogin ? "No account?" : "Already registered?"} <Link className="text-blue-300" href={isLogin ? "/register" : "/login"}>{isLogin ? "Create one" : "Log in"}</Link></p></div></main>;
}
