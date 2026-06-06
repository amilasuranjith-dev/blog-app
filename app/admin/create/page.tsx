"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function CreatePostPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [status, setStatus] = useState("draft");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setCoverImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be logged in to create a post.");
      }

      const slug = generateSlug(title) + "-" + Math.floor(Math.random() * 1000); // To avoid slug collisions simply
      const now = new Date().toISOString();

      let finalImageUrl = coverImageUrl || null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("post-images")
          .getPublicUrl(fileName);

        finalImageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("posts").insert({
        author_id: user.id,
        title,
        cover_image_url: finalImageUrl,
        content,
        is_premium: isPremium,
        status,
        slug,
        created_at: now,
        published_at: status === "published" ? now : null,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast.success("Post created successfully!");
      router.push("/admin");
      router.refresh(); // Refresh the router to update the admin list
    } catch (error: any) {
      toast.error(error.message || "Failed to save the post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header>
          <Link
            href="/admin"
            className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-6"
          >
            &larr; Back to Admin
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">Create New Post</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Write and publish a new post for your blog.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Future of Artificial Intelligence"
              className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="coverImage"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
            >
              Cover Image (Optional)
            </label>
            <input
              id="coverImage"
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleImageChange}
              className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 transition-colors file:mr-4 file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-900 hover:file:bg-zinc-200 dark:file:bg-zinc-800 dark:file:text-zinc-50 dark:hover:file:bg-zinc-700"
            />
            {coverImageUrl && (
              <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="h-48 w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/18181b/ffffff?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
            >
               Content
            </label>
            <textarea
              id="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              className="w-full min-h-[300px] resize-y rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 transition-colors"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:text-zinc-50 dark:bg-zinc-900 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 transition-colors"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex flex-col justify-center space-y-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                  />
                  <div className="block h-6 w-11 rounded-full bg-zinc-200 peer-checked:bg-amber-500 dark:bg-zinc-700 transition-colors"></div>
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
                </div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Premium Content
                </span>
              </label>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 pl-14">
                Only active subscribers can read the full content.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-zinc-900 px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving Post..." : "Save Post"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
