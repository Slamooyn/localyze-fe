"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { api, ApiError } from "@/lib/api/client";
import { useAppStore } from "@/lib/store";

const DEMO_RUN = "/app?lat=-6.2264&lng=106.8531&category=coffee-grab-go&analyze=1";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const setAuth = useAppStore((s) => s.setAuth);
  const next = params.get("next");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (creds?: { email: string; password: string }) => {
    const e = creds?.email ?? email;
    const p = creds?.password ?? password;
    setError(null);
    if (!creds) {
      if (mode === "register" && name.trim().length < 1) return setError("Nama wajib diisi.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return setError("Format email tidak valid.");
      if (p.length < 8) return setError("Password minimal 8 karakter.");
    }
    setLoading(true);
    try {
      const res =
        mode === "register" && !creds
          ? await api.register(name.trim(), e, p)
          : await api.login(e, p);
      setAuth(res.token, res.user);
      router.push(next ?? (mode === "register" ? DEMO_RUN : "/app"));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        {mode === "register" ? "Buat akun" : "Masuk"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {mode === "register"
          ? "Daftar untuk menjalankan analisis pertamamu."
          : "Masuk untuk melanjutkan ke dashboard."}
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(ev) => {
          ev.preventDefault();
          submit();
        }}
      >
        {mode === "register" && (
          <Field label="Nama">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
              placeholder="Nama kamu"
              autoComplete="name"
            />
          </Field>
        )}
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="kamu@email.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            placeholder={mode === "register" ? "Minimal 8 karakter" : "Password"}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
          />
        </Field>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-avoid-bg px-3 py-2 text-sm text-avoid">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-brand-bright disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "register" ? "Daftar & mulai" : "Masuk"}
        </button>
      </form>

      {mode === "login" && (
        <button
          onClick={() => submit({ email: "demo@localyze.id", password: "demo1234" })}
          disabled={loading}
          className="mt-3 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
        >
          Masuk sebagai akun demo
        </button>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        {mode === "register" ? (
          <>
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-brand hover:underline">
              Masuk
            </Link>
          </>
        ) : (
          <>
            Belum punya akun?{" "}
            <Link href="/register" className="font-medium text-brand hover:underline">
              Daftar
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
