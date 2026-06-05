import PostCard, { type PostCardPost } from "@/components/PostCard";
import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      "id, title, content, cover_image_url, is_premium, status, slug, created_at"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const postList = (posts ?? []) as PostCardPost[];

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
            Publication
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Latest Posts
          </h1>
          <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
            Browse the newest published articles from the blog.
          </p>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            <p className="font-medium">Supabase query failed</p>
            <p className="mt-1 text-sm">{error.message}</p>
          </div>
        ) : postList.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <p className="font-medium text-zinc-950 dark:text-zinc-50">
              No posts yet
            </p>
            <p className="mt-1 text-sm">
              Published posts will appear here when they are ready.
            </p>
          </div>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {postList.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
