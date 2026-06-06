import Link from "next/link";
import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import DeletePostButton from "@/components/DeletePostButton";

export const dynamic = "force-dynamic";

export default async function AdminPostList() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, status, is_premium, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Manage Posts</h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Create, edit, and manage your blog posts.
            </p>
          </div>
          <Link
            href="/admin/create"
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors shrink-0"
          >
            Create New Post
          </Link>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            <p className="font-medium">Failed to load posts</p>
            <p className="mt-1 text-sm">{error.message}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">Title</th>
                    <th scope="col" className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">Status</th>
                    <th scope="col" className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">Premium</th>
                    <th scope="col" className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">Date</th>
                    <th scope="col" className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {posts?.map((post) => (
                    <tr key={post.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-xs md:max-w-md">
                          {post.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {post.is_premium ? (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
                            Premium
                          </span>
                        ) : (
                          <span className="text-zinc-500 dark:text-zinc-400 text-xs">Free</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-4">
                          <Link
                            href={`/admin/edit/${post.id}`}
                            className="text-zinc-900 hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300 font-medium text-sm transition-colors"
                          >
                            Edit
                          </Link>
                          <DeletePostButton id={post.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!posts || posts.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                        No posts found. Create your first post!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
