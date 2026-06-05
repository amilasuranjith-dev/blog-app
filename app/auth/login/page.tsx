"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl items-center">
        <div className="grid w-full gap-10 md:grid-cols-[1fr_420px] md:items-center">
          <section className="space-y-5">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
              Welcome back
            </p>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Sign in and pick up where you left off.
              </h1>
              <p className="max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Access your account to continue reading, manage your profile, and follow the latest posts.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Log in</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Enter your email and password.
              </p>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10"
                  placeholder="Your password"
                />
              </div>

              {errorMessage ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-400"
              >
                {isSubmitting ? "Signing in..." : "Log in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
              New to the blog?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-50"
              >
                Create an account
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
