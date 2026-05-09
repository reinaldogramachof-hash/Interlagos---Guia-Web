export function readCache(key, ttlMs) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.savedAt || parsed.data === undefined) return null;
    if (ttlMs && Date.now() - parsed.savedAt > ttlMs) return null;

    return parsed.data;
  } catch {
    return null;
  }
}

export function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({
      savedAt: Date.now(),
      data,
    }));
  } catch {
    // localStorage pode falhar em modo privado/quota cheia; ignora.
  }
}

export async function cachedRequest({ key, ttlMs, request, onCache, onFresh }) {
  const cached = readCache(key, ttlMs);
  if (cached !== null) onCache?.(cached);

  const fresh = await request();
  writeCache(key, fresh);
  onFresh?.(fresh);
  return fresh;
}
