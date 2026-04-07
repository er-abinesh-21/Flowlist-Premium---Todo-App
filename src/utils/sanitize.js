const MULTI_SPACE = /\s{2,}/g;
const HTML_TAGS = /<[^>]*>/g;

export function sanitizeText(value, maxLength = 160) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(HTML_TAGS, "")
    .replace(/[<>]/g, "")
    .replace(MULTI_SPACE, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeDescription(value, maxLength = 700) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(HTML_TAGS, "")
    .replace(/[<>]/g, "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeTags(value) {
  const rawTags = Array.isArray(value) ? value : String(value ?? "").split(",");

  const unique = new Set();

  rawTags.forEach((tag) => {
    const cleaned = sanitizeText(String(tag), 24).toLowerCase();
    if (cleaned) {
      unique.add(cleaned);
    }
  });

  return Array.from(unique).slice(0, 8);
}
