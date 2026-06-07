"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscribeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Redirect to login if unauthenticated
      if (response.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from the server");
      }
    } catch (err: any) {
      console.error("[SUBSCRIBE_ERROR]", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className="w-full relative flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-4 text-base font-medium text-white shadow-sm transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus:ring-white dark:focus:ring-offset-zinc-900"
      >
        {isLoading ? (
          <>
            <svg
              className="mr-3 -ml-1 h-5 w-5 animate-spin text-white dark:text-zinc-900"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Redirecting...
          </>
        ) : (
          "Subscribe Now — $9.99/month"
        )}
      </button>

      {/* Error Message Display */}
      {error && (
        <div className="w-full rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
