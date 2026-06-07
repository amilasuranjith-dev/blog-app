"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    async function loadUser(userId: string) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (isMounted && profile) {
        setIsAdmin(profile.role === "admin");
        
        if (profile.role !== "admin") {
          const { data: subscription } = await supabase
            .from("subscriptions")
            .select("id")
            .eq("user_id", userId)
            .eq("status", "active")
            .gt("current_period_end", new Date().toISOString())
            .single();

          if (subscription) {
            setIsPremium(true);
          }
        }
      }
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (isMounted) {
        if (user) {
          setIsLoggedIn(true);
          loadUser(user.id);
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
          setIsPremium(false);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (isMounted) {
          if (session?.user) {
            setIsLoggedIn(true);
            loadUser(session.user.id);
          } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
            setIsPremium(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const showSubscribe = !isAdmin && !isPremium;
  const showAdmin = isAdmin;
  const showDashboard = isLoggedIn && !isAdmin;

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              TechBlog.
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              Exploring the future of web development, artificial intelligence, and software engineering. Quality articles for dedicated readers.
            </p>
            <div className="flex items-center space-x-5 pt-2">
              <a href="#" className="text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.004 3.985H5.078z" />
                </svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                <span className="sr-only">Email</span>
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Platform Links */}
          <div className="space-y-6 md:justify-self-end md:text-right">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-zinc-900 dark:text-zinc-100">
              Platform
            </h3>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Search Articles</Link>
              </li>
              {showSubscribe && (
                <li>
                  <Link href="/subscribe" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Subscribe to Premium</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Account & Legal Links */}
          <div className="space-y-6 md:justify-self-end md:text-right">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-zinc-900 dark:text-zinc-100">
              Account
            </h3>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              {showDashboard && (
                <li>
                  <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Member Portal</Link>
                </li>
              )}
              {showAdmin && (
                <li>
                  <Link href="/admin" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Admin Dashboard</Link>
                </li>
              )}
              {!isLoggedIn && (
                <li>
                  <Link href="/auth/login" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Login / Signup</Link>
                </li>
              )}
              <li>
                <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            &copy; {currentYear} TechBlog, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span>Designed with</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span>precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
