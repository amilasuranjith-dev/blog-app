"use client";

import { useTransition } from "react";
import { deletePost } from "@/app/admin/actions";
import toast from "react-hot-toast";

export default function DeletePostButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("Are you sure you want to delete this post?")) {
          startTransition(async () => {
            try {
              await deletePost(id);
              toast.success("Post deleted successfully!");
            } catch (error) {
              toast.error("Failed to delete post.");
            }
          });
        }
      }}
      disabled={isPending}
      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm transition-colors disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
