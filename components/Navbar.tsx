"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { Home, LayoutDashboard, LogOut, Menu, Search, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [openMenuPathname, setOpenMenuPathname] = useState<string | null>(null);
  const isMobileMenuOpen = openMenuPathname === pathname;

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
    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 1500);

    async function loadUser() {
      try {
        // Hydrate immediately from local session so Login/Signup never hang on network
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (isMounted) {
            setUser(null);
            setIsAdmin(false);
            setIsLoading(false);
          }
          return;
        }

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
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setIsAdmin(false);
        }
      } finally {
        clearTimeout(fallbackTimer);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        const currentUser = session?.user ?? null;
        if (isMounted) {
          setUser(currentUser);
        }

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
        }

        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          router.refresh();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  async function handleLogout() {
    setIsSigningOut(true);
    const { error } = await supabase.auth.signOut();

    if (!error) {
      setUser(null);
      setOpenMenuPathname(null);
      router.push("/");
      router.refresh();
    }

    setIsSigningOut(false);
  }

  const isHomeActive = pathname === "/";
  const isSearchActive = pathname?.startsWith("/search");

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 text-zinc-900 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 dark:text-zinc-50">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Blog App
          </Link>

          <div className="hidden items-center gap-4 text-sm font-medium sm:flex">
            <Link
              className={`transition hover:text-zinc-950 dark:hover:text-zinc-50 ${
                isHomeActive
                  ? "text-zinc-950 dark:text-zinc-50"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
              href="/"
            >
              Home
            </Link>
            <Link
              className={`transition hover:text-zinc-950 dark:hover:text-zinc-50 ${
                isSearchActive
                  ? "text-zinc-950 dark:text-zinc-50"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
              href="/search"
            >
              Search
            </Link>
          </div>
        </div>

        {/* Desktop Auth / Actions */}
        <div className="hidden items-center gap-3 text-sm sm:flex">
          {isLoading ? (
            <div className="h-9 w-36 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
          ) : user ? (
            <div className="flex items-center gap-4">
              {!isAdmin && (
                <Link
                  href="/dashboard"
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium transition hover:border-zinc-900 hover:text-zinc-950 dark:border-zinc-700 dark:hover:border-zinc-100 dark:hover:text-zinc-50"
                >
                  Dashboard
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
              <div className="flex items-center gap-3 border-l border-zinc-200 pl-4 dark:border-zinc-800">
                <span className="max-w-52 truncate text-zinc-600 dark:text-zinc-400" title={user.email}>
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isSigningOut}
                  className="shrink-0 rounded-lg border border-zinc-300 px-3 py-2 font-medium transition hover:border-zinc-900 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:hover:border-zinc-100 dark:hover:text-zinc-50"
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

        {/* Mobile Quick Actions */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/search"
            aria-label="Search posts"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
              isSearchActive
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
            }`}
          >
            <Search className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setOpenMenuPathname((prev) => (prev === pathname ? null : pathname))}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Collapsible Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white/95 px-4 pb-4 pt-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 sm:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setOpenMenuPathname(null)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isHomeActive
                  ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/search"
              onClick={() => setOpenMenuPathname(null)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isSearchActive
                  ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              }`}
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
          </div>

          <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            {isLoading ? (
              <div className="h-10 w-full rounded-lg bg-zinc-100 dark:bg-zinc-900" />
            ) : user ? (
              <div className="flex flex-col gap-2.5">
                <div className="truncate px-1 text-xs text-zinc-500 dark:text-zinc-400" title={user.email}>
                  Signed in as <span className="font-medium text-zinc-800 dark:text-zinc-200">{user.email}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-sm">
                  {!isAdmin ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setOpenMenuPathname(null)}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 font-medium transition hover:border-zinc-900 hover:text-zinc-950 dark:border-zinc-700 dark:hover:border-zinc-100 dark:hover:text-zinc-50"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/admin"
                      onClick={() => setOpenMenuPathname(null)}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                      <Settings className="h-4 w-4" />
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 font-medium transition hover:border-zinc-900 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:hover:border-zinc-100 dark:hover:text-zinc-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {isSigningOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 text-sm">
                <Link
                  href="/auth/login"
                  onClick={() => setOpenMenuPathname(null)}
                  className="flex items-center justify-center rounded-lg border border-zinc-300 px-3 py-2 font-medium transition hover:border-zinc-900 hover:text-zinc-950 dark:border-zinc-700 dark:hover:border-zinc-100 dark:hover:text-zinc-50"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setOpenMenuPathname(null)}
                  className="flex items-center justify-center rounded-lg bg-zinc-900 px-3 py-2 font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
