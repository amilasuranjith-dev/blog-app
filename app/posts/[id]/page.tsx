import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PremiumBadge from "@/components/PremiumBadge";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch the post
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (postError || !post) {
    notFound();
  }

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();

  let hasActiveSubscription = false;

  if (user && post.is_premium) {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .gt("current_period_end", new Date().toISOString())
      .single();

    if (subscription) {
      hasActiveSubscription = true;
    }
  }

  const showFullContent = !post.is_premium || hasActiveSubscription;

  return (
    <article className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto w-full max-w-3xl space-y-10">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          &larr; Back to home
        </Link>

        <header className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.is_premium && (
              <span className="ml-4 inline-flex items-center rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                Premium
              </span>
            )}
          </div>
        </header>

        {post.cover_image_url && (
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none">
          {showFullContent ? (
            <div className="whitespace-pre-wrap">{post.content}</div>
          ) : (
            <div className="relative">
              <div className="whitespace-pre-wrap blur-[3px] opacity-60 select-none overflow-hidden max-h-40">
                {post.content.slice(0, 150)}...
              </div>
              <PremiumBadge />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
