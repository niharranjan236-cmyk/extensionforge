"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem("extensionforge.user", JSON.stringify({ email, name: name || email.split("@")[0] || "Builder", authenticatedAt: new Date().toISOString() }));
    router.push("/dashboard");
  }

  return <main className="grid min-h-screen place-items-center px-6 py-12"><div className="card w-full max-w-md"><Link href="/" className="text-sm text-blue-300">← ExtensionForge</Link><h1 className="mt-6 text-3xl font-semibold">{isLogin ? "Welcome back" : "Create your account"}</h1><p className="mt-2 text-slate-400">{isLogin ? "Log in to save projects and export ZIPs." : "Create a workspace for AI-generated Chrome extensions."}</p><form className="mt-8 space-y-4" onSubmit={submit}><input className="input" placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />{!isLogin && <input className="input" placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} required />}<input className="input" placeholder="Password" type="password" required minLength={6} /><button className="btn-primary w-full" type="submit">{isLogin ? "Log in" : "Register"}</button></form><p className="mt-6 text-center text-sm text-slate-400">{isLogin ? "No account?" : "Already registered?"} <Link className="text-blue-300" href={isLogin ? "/register" : "/login"}>{isLogin ? "Create one" : "Log in"}</Link></p></div></main>;
}
