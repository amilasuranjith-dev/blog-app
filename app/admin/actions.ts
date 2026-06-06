"use server";

import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deletePost(id: string) {
  const supabase = await createClient();

  // Fetch the post first to see if it has a cover image
  const { data: post } = await supabase
    .from("posts")
    .select("cover_image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("posts").delete().eq("id", id);
  
  if (error) {
    throw new Error(error.message);
  }

  // If deletion was successful and there was an image, delete the image from storage
  if (post?.cover_image_url) {
    const filename = post.cover_image_url.split("/").pop();
    if (filename) {
      await supabase.storage.from("post-images").remove([filename]);
    }
  }
  
  revalidatePath("/admin");
}
