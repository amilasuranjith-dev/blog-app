import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import SubscribeButton from "@/components/SubscribeButton";
import ProfileSettings from "@/components/ProfileSettings";

export const metadata = {
  title: "Dashboard | Premium Blog",
  description: "Manage your subscription and view premium content.",
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  
  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Redirect to login if user is not authenticated
  if (!user) {
    redirect("/auth/login");
  }

  // 3. Query subscriptions table for user's subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const isActive = subscription?.status === "active";

  // Query user profile for full_name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // 4. Fetch all published premium posts
  const { data: premiumPosts } = await supabase
    .from("posts")
    .select("id, title, created_at")
    .eq("is_premium", true)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Format the subscription end date if active
  let formattedDate = "";
  if (isActive && subscription.current_period_end) {
    formattedDate = new Date(subscription.current_period_end).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header section with Welcome message and Profile */}
        <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Subscriber Dashboard
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Welcome, <span className="font-medium text-zinc-900 dark:text-zinc-200">{user.email}</span>
            </p>
          </div>

          <div className="w-full md:w-80 flex-shrink-0">
            {/* Profile Settings Panel */}
            <ProfileSettings 
              userId={user.id} 
              email={user.email || ""}
              initialFullName={profile?.full_name || ""} 
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Subscription Status */}
          <section className="md:col-span-1 h-fit">
            
            {/* Subscription Status Panel */}
            <div className="bg-white dark:bg-zinc-900/80 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
                Your Subscription
              </h2>
              
              {isActive ? (
                <div className="space-y-4">
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Active Subscription
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Subscribed until {formattedDate}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center text-zinc-500 dark:text-zinc-400">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    No active subscription
                  </div>
                  <SubscribeButton />
                </div>
              )}
            </div>
          </section>

          {/* Premium Posts List */}
          <section className="md:col-span-2">
            <div className="bg-white dark:bg-zinc-900/80 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
                Premium Content Library
              </h2>
              
              {premiumPosts && premiumPosts.length > 0 ? (
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {premiumPosts.map((post) => (
                    <li key={post.id} className="py-4 first:pt-0 last:pb-0">
                      <Link 
                        href={`/posts/${post.id}`}
                        className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                      >
                        <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-500 flex-shrink-0">
                          {new Date(post.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-8 text-center bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                    No premium posts available right now. Check back later!
                  </p>
                </div>
              )}
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
}
