import { createServerSupabaseClient } from "../lib/supabase/server";

export const dynamic = "force-dynamic";

type Post = {
  id: string;
  title: string;
  content: string;
  is_premium: boolean;
};

export default async function Home() {
  const supabase = await createServerSupabaseClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, content, is_premium")
    .order("id", { ascending: false })
    .limit(10);

  const postList = (posts ?? []) as Post[];

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
            Supabase test
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Blog posts from Supabase
          </h1>
          <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
            This page fetches directly from your <span className="font-medium">posts</span> table to verify the connection.
          </p>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            <p className="font-medium">Supabase query failed</p>
            <p className="mt-1 text-sm">{error.message}</p>
          </div>
        ) : postList.length === 0 ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            <p className="font-medium">Connection works.</p>
            <p className="mt-1 text-sm">No posts found yet. Add a row to the posts table to see it here.</p>
          </div>
        ) : (
          <section className="grid gap-4">
            {postList.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{post.content}</p>
                  </div>
                  {post.is_premium ? (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950/60 dark:text-amber-200">
                      Premium
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
                      Free
                    </span>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
