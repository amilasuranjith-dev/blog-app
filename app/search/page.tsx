import Form from "next/form";
import PostCard, { type PostCardPost } from "@/components/PostCard";
import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";

  let postList: PostCardPost[] = [];
  let errorMsg = "";

  if (query) {
    const supabase = await createClient();
    const { data: posts, error } = await supabase
      .from("posts")
      .select("id, title, content, cover_image_url, is_premium, status, slug, created_at")
      .eq("status", "published")
      .ilike("title", `%${query}%`)
      .order("created_at", { ascending: false });

    if (error) {
      errorMsg = error.message;
    } else {
      postList = (posts ?? []) as PostCardPost[];
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Search Posts
          </h1>
          <Form action="/search" className="flex max-w-xl gap-3">
            <input
              name="q"
              defaultValue={query}
              placeholder="Enter a keyword to search..."
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700 dark:focus:ring-zinc-50/10"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              Search
            </button>
          </Form>
        </header>

        {errorMsg ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            <p className="font-medium">Search failed</p>
            <p className="mt-1 text-sm">{errorMsg}</p>
          </div>
        ) : !query ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-500 dark:text-zinc-400">
              Enter a keyword to search
            </p>
          </div>
        ) : postList.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-500 dark:text-zinc-400">
              No results found for <span className="font-semibold text-zinc-900 dark:text-zinc-50">&quot;{query}&quot;</span>
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
