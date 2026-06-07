import SubscribeButton from "@/components/SubscribeButton";

export const metadata = {
  title: "Subscribe | Premium Blog",
  description: "Get access to exclusive premium blog posts.",
};

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-md">
        
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Premium Subscription
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Unlock exclusive articles, deep dives, and early access to all our content.
          </p>
        </div>

        {/* Pricing Card Section */}
        <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-baseline justify-center gap-x-2">
            <span className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">$9.99</span>
            <span className="text-sm font-medium leading-6 text-zinc-500 dark:text-zinc-400">/month</span>
          </div>
          
          <ul className="mt-8 space-y-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <li className="flex gap-x-3 items-center">
              <svg className="h-5 w-5 flex-none text-zinc-900 dark:text-zinc-50" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Full access to all premium posts
            </li>
            <li className="flex gap-x-3 items-center">
              <svg className="h-5 w-5 flex-none text-zinc-900 dark:text-zinc-50" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Support the author directly
            </li>
            <li className="flex gap-x-3 items-center">
              <svg className="h-5 w-5 flex-none text-zinc-900 dark:text-zinc-50" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Cancel anytime, no questions asked
            </li>
          </ul>
        </div>

        {/* Action Section */}
        <div className="pt-2">
          <SubscribeButton />
        </div>
      </div>
    </div>
  );
}
