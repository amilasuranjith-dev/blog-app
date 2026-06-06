"use server";

import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  
  if (error) {
    throw new Error(error.message);
  }
  
  revalidatePath("/admin");
}
