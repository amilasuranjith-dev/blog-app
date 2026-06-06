import Link from "next/link";

export default function PremiumBadge() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-zinc-50 via-zinc-50/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 pt-12">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 text-center max-w-sm w-full mx-4 flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
          <svg
            className="h-6 w-6 text-zinc-900 dark:text-zinc-50"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-2">Premium Content</h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
          Subscribe to unlock this post
        </p>
        <Link
          href="/subscribe"
          className="inline-flex w-full justify-center items-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all"
        >
          Subscribe Now
        </Link>
      </div>
    </div>
  );
}
