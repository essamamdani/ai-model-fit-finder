export function buildFinderUrl(query) {
  const normalized = String(query ?? '').trim().slice(0, 500);
  if (normalized.length < 3) throw new Error('Describe what you need in at least 3 characters.');

  const destination = new URL('https://essamamdani.com/ai-models/hardware-fit');
  destination.searchParams.set('q', normalized);
  return destination.toString();
}
