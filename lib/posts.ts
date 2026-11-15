import type { PostCardPost } from "@/components/PostCard";

export function stripHtml(html: string | null | undefined): string {
  if (!html) {
    return "";
  }
  return html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
}

/**
 * Strips dangerous tags, inline event handlers, and javascript:/data: URIs
 * from rich-text HTML before rendering with dangerouslySetInnerHTML.
 */
export function sanitizePostHtml(html: string | null | undefined): string {
  if (!html) {
    return "";
  }

  return html
    .replace(/<(script|style|iframe|object|embed|form|input|textarea|button|svg|math)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|input|textarea|button|svg|math)\b[^>]*\/?>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*(?:javascript|vbscript|data:text\/html):[\s\S]*?\2/gi, '$1=$2#$2');
}

/**
 * Strips HTML and truncates content for public post cards so full premium
 * article bodies are never serialized to unauthenticated clients.
 */
export function toPublicPostPreview(post: PostCardPost): PostCardPost {
  const plainText = stripHtml(post.content);
  const preview =
    plainText.length > 160 ? `${plainText.slice(0, 160).trim()}...` : plainText;

  return {
    ...post,
    content: preview || null,
  };
}
