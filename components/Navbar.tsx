"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
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

      let isUserAdmin = false;
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        if (profile?.role === "admin") {
          isUserAdmin = true;
        }
      }

      if (isMounted) {
        setUser(user);
        setIsAdmin(isUserAdmin);
        setIsLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      let isUserAdmin = false;
      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();
        isUserAdmin = profile?.role === "admin";
      }

      if (isMounted) {
        setIsAdmin(isUserAdmin);
        setIsLoading(false);
      }

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

        <div className="flex flex-wrap items-center justify-end gap-3 text-sm w-full sm:w-auto mt-2 sm:mt-0">
          {isLoading ? (
            <div className="h-9 w-36 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
          ) : user ? (
            <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 w-full sm:w-auto">
              {!isAdmin && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium transition hover:border-zinc-900 hover:text-zinc-950 dark:border-zinc-700 dark:hover:border-zinc-100 dark:hover:text-zinc-50 shrink-0"
                >
                  Dashboard
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 shrink-0"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin Panel
                </Link>
              )}
              <div className="flex flex-1 sm:flex-none items-center justify-between sm:justify-start gap-3 sm:border-l border-zinc-200 dark:border-zinc-800 sm:pl-4">
                <span className="max-w-[140px] sm:max-w-52 truncate text-zinc-600 dark:text-zinc-400" title={user.email}>
                  {user.email}
                </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isSigningOut}
                className="rounded-lg border border-zinc-300 px-3 py-2 font-medium transition hover:border-zinc-900 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:hover:border-zinc-100 dark:hover:text-zinc-50 shrink-0"
              >
                {isSigningOut ? "Logging out..." : "Logout"}
              </button>
              </div>
            </div>
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
