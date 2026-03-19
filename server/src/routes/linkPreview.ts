import { Request, Response, Router } from "express";

const router = Router();

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (compatible; WeddingSiteLinkPreview/1.0; +https://example.com)";

const SUCCESS_CACHE_CONTROL = "public, max-age=900, s-maxage=3600, stale-while-revalidate=86400";
const ERROR_CACHE_CONTROL = "public, max-age=60, s-maxage=60";

const applyCacheHeaders = (res: Response, cacheControl: string) => {
  res.setHeader("Cache-Control", cacheControl);
  res.setHeader("Vary", "Accept-Encoding");
};

const decodeHtmlEntities = (value: string) => {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
};

const getTagAttr = (tag: string, attr: string) => {
  const match = tag.match(new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match?.[1]?.trim() ?? null;
};

const getMetaContent = (html: string, key: string) => {
  const metaTags = html.match(/<meta\s+[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    const property = getTagAttr(tag, "property")?.toLowerCase();
    const name = getTagAttr(tag, "name")?.toLowerCase();
    if (property !== key.toLowerCase() && name !== key.toLowerCase()) {
      continue;
    }

    const content = getTagAttr(tag, "content");
    if (content) {
      return decodeHtmlEntities(content);
    }
  }

  return null;
};

router.get("/link-preview", async (req: Request, res: Response) => {
  const rawUrl = String(req.query.url ?? "").trim();

  if (!rawUrl) {
    applyCacheHeaders(res, ERROR_CACHE_CONTROL);
    return res.status(400).json({ message: "Missing required query param: url" });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    applyCacheHeaders(res, ERROR_CACHE_CONTROL);
    return res.status(400).json({ message: "Invalid URL" });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    applyCacheHeaders(res, ERROR_CACHE_CONTROL);
    return res.status(400).json({ message: "URL must start with http:// or https://" });
  }

  const timeoutController = new AbortController();
  const timeout = setTimeout(() => timeoutController.abort(), 7000);

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": DEFAULT_USER_AGENT,
      },
      signal: timeoutController.signal,
    });

    if (!response.ok) {
      applyCacheHeaders(res, ERROR_CACHE_CONTROL);
      return res.status(502).json({ message: `Unable to read metadata (status ${response.status})` });
    }

    const html = await response.text();
    const title = getMetaContent(html, "og:title") ?? getMetaContent(html, "twitter:title") ?? html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? null;
    const description =
      getMetaContent(html, "og:description") ??
      getMetaContent(html, "twitter:description") ??
      getMetaContent(html, "description");
    const imageRaw = getMetaContent(html, "og:image") ?? getMetaContent(html, "twitter:image");

    let image: string | null = imageRaw;
    if (imageRaw) {
      try {
        image = new URL(imageRaw, parsedUrl.toString()).toString();
      } catch {
        image = imageRaw;
      }
    }
    
    applyCacheHeaders(res, SUCCESS_CACHE_CONTROL);
    return res.status(200).json({
      url: parsedUrl.toString(),
      title,
      description,
      image,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      applyCacheHeaders(res, ERROR_CACHE_CONTROL);
      return res.status(504).json({ message: "Metadata request timed out" });
    }
    applyCacheHeaders(res, ERROR_CACHE_CONTROL);
    return res.status(500).json({ message: "Failed to load metadata" });
  } finally {
    clearTimeout(timeout);
  }
});

export default router;