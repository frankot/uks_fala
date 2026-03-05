"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Nieprawidłowy email lub hasło");
      setLoading(false);
    } else {
      router.push("/admin/cms");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-deep-700">
            <span className="text-[14px] font-bold text-white">UF</span>
          </div>
          <h1 className="text-[1.5rem] font-bold text-sand-900">Panel admina</h1>
          <p className="mt-1 text-[14px] text-sand-500">UKS Fala Nieporęt</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-sand-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[12px] font-bold uppercase tracking-wider text-sand-500"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                placeholder="admin@uksfala.com.pl"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-[12px] font-bold uppercase tracking-wider text-sand-500"
              >
                Hasło
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-coral-50 px-4 py-3 text-[14px] text-coral-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-deep-700 text-[15px] font-bold text-white transition-all hover:bg-deep-800 disabled:opacity-60"
          >
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>
      </div>
    </div>
  );
}
