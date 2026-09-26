import type { Project } from "@/interfaces/Content";
import { marked } from "marked";

/**
 * Fetches the raw markdown README from GitHub, falling back from language-specific
 * README (e.g. README.es.md) to default README.md.
 */
export async function fetchProjectReadme(project: Project, lang: string): Promise<string> {
  const { user, repository, branch } = project.github;
  const baseUrl = `https://raw.githubusercontent.com/${user}/${repository}/refs/heads/${branch}/`;

  let response: Response;
  try {
    response = await fetch(`${baseUrl}README.${lang}.md`);
    if (!response.ok) {
      throw new Error(`Failed to fetch README.${lang}.md: ${response.statusText}`);
    }
  } catch {
    response = await fetch(`${baseUrl}README.md`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch README.md for project "${project.id}": ${response.statusText}, ${response.url}`
      );
    }
  }

  return response.text();
}

/**
 * Converts GitHub-style admonitions blockquotes:
 * `> [!NOTE]` into styled blockquotes with icons and titles.
 */
export function transformAdmonitions(html: string): string {
  return html.replace(
    /<blockquote>\s*<p>\[!(NOTE|INFO|WARNING|TIP|IMPORTANT)\]\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (_match, type, content) => {
      const lower = type.toLowerCase();
      const capitalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
      return `<blockquote class="admonition admonition-${lower}">
      <header>
        <span class="admonition-icon"></span>
        <strong class="admonition-title">${capitalized}</strong>  
      </header>
      <span class="admonition-content">${content.trim()}</span>
    </blockquote>`;
    }
  );
}

/**
 * Rewrites relative <img> and <a> URLs in the rendered HTML to absolute GitHub URLs.
 */
export function resolveRelativeUrls(html: string, rawBaseUrl: string, publicBaseUrl: string): string {
  // Replace relative src in <img> tags
  const withAbsoluteImages = html.replace(
    /<img\s+([^>]*?src=["'])([^"']+)(["'][^>]*?)>/g,
    (match, beforeSrc, src, afterSrc) => {
      try {
        const absoluteUrl = new URL(src, rawBaseUrl).href;
        return `<img ${beforeSrc}${absoluteUrl}${afterSrc}>`;
      } catch {
        return match;
      }
    }
  );

  // Replace relative href in <a> tags
  return withAbsoluteImages.replace(
    /<a\s+([^>]*?href=["'])([^"']+)(["'][^>]*?)>/g,
    (match, beforeHref, href, afterHref) => {
      if (!href.startsWith("http") && !href.startsWith("#") && !href.startsWith("mailto:")) {
        try {
          const absoluteUrl = new URL(href, publicBaseUrl).href;
          return `<a ${beforeHref}${absoluteUrl}${afterHref}>`;
        } catch {
          return match;
        }
      }
      return match;
    }
  );
}

/**
 * Main coordinator: fetches, parses markdown, formats admonitions, and fixes relative URLs.
 */
export async function getProjectReadmeHtml(project: Project, lang: string): Promise<string> {
  const { user, repository, branch } = project.github;
  const rawBaseUrl = `https://raw.githubusercontent.com/${user}/${repository}/refs/heads/${branch}/`;
  const publicBaseUrl = `https://github.com/${user}/${repository}/blob/${branch}/`;

  const markdown = await fetchProjectReadme(project, lang);
  const parsedHtml = await marked.parse(markdown);
  const withAdmonitions = transformAdmonitions(parsedHtml);
  return resolveRelativeUrls(withAdmonitions, rawBaseUrl, publicBaseUrl);
}
