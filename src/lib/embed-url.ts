// Instructors paste whatever URL is in their browser bar — a YouTube "watch"
// or "shorts" page, not an /embed/ URL. Those pages send an X-Frame-Options
// header that blocks iframing outright ("refused to connect"), where the
// /embed/ path is built to allow it. Vimeo has the same watch-vs-player
// split. Anything else (CodeSandbox, Figma, etc.) is assumed to already be
// embed-ready, since those services' own "Share > Embed" flow hands you an
// iframe-safe URL directly — there's no reliable way to convert a general
// page URL for services we don't special-case.
export function toEmbeddableUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  const host = parsed.hostname.replace(/^www\./, '');

  if (host === 'youtube.com') {
    const id = parsed.pathname.startsWith('/shorts/')
      ? parsed.pathname.split('/')[2]
      : parsed.searchParams.get('v');
    if (id) return `https://www.youtube.com/embed/${id}`;
  }
  if (host === 'youtu.be') {
    const id = parsed.pathname.slice(1);
    if (id) return `https://www.youtube.com/embed/${id}`;
  }
  if (host === 'vimeo.com') {
    const id = parsed.pathname.slice(1).split('/')[0];
    if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
  }

  return url;
}
