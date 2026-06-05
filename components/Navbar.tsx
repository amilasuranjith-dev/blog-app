"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isMounted) {
        setUser(user);
        setIsLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  async function handleLogout() {
    setIsSigningOut(true);
    const { error } = await supabase.auth.signOut();

    if (!error) {
      setUser(null);
      router.push("/");
      router.refresh();
    }

    setIsSigningOut(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 text-zinc-900 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 dark:text-zinc-50">
      <nav className="mx-auto flex min-h-16 w-full max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Blog App
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <Link className="transition hover:text-zinc-950 dark:hover:text-zinc-50" href="/">
              Home
            </Link>
            <Link className="transition hover:text-zinc-950 dark:hover:text-zinc-50" href="/search">
              Search
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {isLoading ? (
            <div className="h-9 w-36 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
          ) : user ? (
            <>
              <span className="max-w-52 truncate text-zinc-600 dark:text-zinc-400">
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isSigningOut}
                className="rounded-lg border border-zinc-300 px-3 py-2 font-medium transition hover:border-zinc-900 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:hover:border-zinc-100 dark:hover:text-zinc-50"
              >
                {isSigningOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg border border-zinc-300 px-3 py-2 font-medium transition hover:border-zinc-900 hover:text-zinc-950 dark:border-zinc-700 dark:hover:border-zinc-100 dark:hover:text-zinc-50"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-zinc-900 px-3 py-2 font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
