import Image from "next/image";
import Link from "next/link";

export type PostCardPost = {
  id: string;
  title: string;
  content: string | null;
  cover_image_url: string | null;
  is_premium: boolean;
  status: string;
  slug: string | null;
  created_at: string;
};

type PostCardProps = {
  post: PostCardPost;
};

function getExcerpt(content: string | null) {
  if (!content) {
    return "No excerpt available.";
  }

  const normalizedContent = content.trim().replace(/\s+/g, " ");

  if (normalizedContent.length <= 120) {
    return normalizedContent;
  }

  return `${normalizedContent.slice(0, 120).trim()}...`;
}

function formatPublishedDate(date: string) {
  const publishedDate = new Date(date);

  if (Number.isNaN(publishedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(publishedDate);
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <article>
        <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-sm font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              No cover image
            </div>
          )}
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <time
              dateTime={post.created_at}
              className="text-sm text-zinc-500 dark:text-zinc-400"
            >
              {formatPublishedDate(post.created_at)}
            </time>

            {post.is_premium ? (
              <span className="rounded-full border border-amber-300/70 bg-gradient-to-r from-zinc-950 via-amber-950 to-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100 shadow-sm shadow-amber-900/20 dark:border-amber-200/30 dark:from-amber-200 dark:via-amber-100 dark:to-zinc-100 dark:text-zinc-950">
                Premium
              </span>
            ) : null}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950 transition group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
              {post.title}
            </h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {getExcerpt(post.content)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
