"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface ProfileSettingsProps {
  userId: string;
  email: string;
  initialFullName: string | null;
}

export default function ProfileSettings({ userId, email, initialFullName }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(initialFullName || "");
  const [savedName, setSavedName] = useState(initialFullName || "");
  const [isLoading, setIsLoading] = useState(false);

  // Generate initials for the avatar
  const getInitials = (name: string) => {
    if (!name) return email.charAt(0).toUpperCase();
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const handleSave = async () => {
    if (fullName.trim() === "") {
      toast.error("Name cannot be empty");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() })
        .eq("id", userId);

      if (error) throw error;
      
      setSavedName(fullName.trim());
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("[PROFILE_UPDATE_ERROR]", err);
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName(savedName);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900/80 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          User Profile
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      <div className="flex items-start gap-5">
        {/* Avatar Bubble */}
        <div className="flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-xl font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {getInitials(savedName)}
        </div>

        <div className="flex-1 min-w-0 pt-1">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                  placeholder="Your full name"
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={isLoading || fullName.trim() === savedName}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {savedName || "No name set"}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                {email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
