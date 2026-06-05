import { createServerSupabaseClient } from "../lib/supabase/server";
import PostCard, { type PostCardPost } from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createServerSupabaseClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, content, cover_image_url, is_premium, status, slug, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(10);

  const postList = (posts ?? []) as PostCardPost[];

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
            Latest stories
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Read fresh posts from the publication.
          </h1>
          <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
            Explore free articles now, with premium stories ready for subscribers as the blog grows.
          </p>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            <p className="font-medium">Supabase query failed</p>
            <p className="mt-1 text-sm">{error.message}</p>
          </div>
        ) : postList.length === 0 ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            <p className="font-medium">No published posts yet.</p>
            <p className="mt-1 text-sm">Publish your first post from the admin panel to show it here.</p>
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
