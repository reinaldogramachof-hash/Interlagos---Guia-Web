const cache = new Map();

export const getCached = (key, ttlMs = 300000) => {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > ttlMs) {
    cache.delete(key);
    return null;
  }
  return item.data;
};

export const setCached = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const invalidateCache = (key) => {
  cache.delete(key);
};
