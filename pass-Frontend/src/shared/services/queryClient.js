// ─── Factory ──────────────────────────────────────────────────────────────────
const DEFAULT_TTL_MS = 5 * 60 * 1_000; // 5 Minutes
/**
 * Creates a query client that wraps an Axios instance.
 * Inherits all interceptors, tracking, and base URL automatically.
 */
export function createQueryClient(axiosInstance) {
  // ── Internal state ──────────────────────────────────────────────────────────
  const queryCache = new Map();
  const inFlightQueries = new Map();
  const tagToKeys = new Map();
  // ── Key building (used by cache + dedupe) ───────────────────────────────────
  const normalizeValue = (value) => {
    if (Array.isArray(value)) return value.map(normalizeValue);
    if (value && typeof value === "object") {
      const sorted = {};
      Object.keys(value)
        .sort()
        .forEach((key) => {
          sorted[key] = normalizeValue(value[key]);
        });
      return sorted;
    }
    return value;
  };
  const toStableString = (value) => JSON.stringify(normalizeValue(value ?? {}));
  const buildQueryKey = ({ method = "GET", url, params, headers }) =>
    [
      method.toUpperCase(),
      url,
      toStableString(params),
      toStableString(headers),
    ].join("::");
  // ── Tag bookkeeping ─────────────────────────────────────────────────────────
  const linkCacheKeyToTags = (cacheKey, tags = []) => {
    tags.forEach((tag) => {
      if (!tag) return;
      if (!tagToKeys.has(tag)) tagToKeys.set(tag, new Set());
      tagToKeys.get(tag).add(cacheKey);
    });
  };
  const unlinkCacheKeyFromTags = (cacheKey, tags) => {
    tags.forEach((tag) => {
      const bucket = tagToKeys.get(tag);
      if (!bucket) return;
      bucket.delete(cacheKey);
      if (!bucket.size) tagToKeys.delete(tag);
    });
  };
  const clearCacheKey = (cacheKey) => {
    const entry = queryCache.get(cacheKey);
    if (!entry) return;
    unlinkCacheKeyFromTags(cacheKey, Array.from(entry.tags));
    queryCache.delete(cacheKey);
  };
  // ── Public cache helpers ────────────────────────────────────────────────────
  const invalidateQueryCacheByTags = (tags = []) => {
    tags.forEach((tag) => {
      const keys = tagToKeys.get(tag);
      if (!keys) return;
      Array.from(keys).forEach(clearCacheKey);
      tagToKeys.delete(tag);
    });
  };
  const invalidateAllQueryCache = () => {
    queryCache.clear();
    inFlightQueries.clear();
    tagToKeys.clear();
  };
  // ── Invalidation wrapper for mutations ──────────────────────────────────────
  const withInvalidation = (promise, options = {}) => {
    return promise.then((response) => {
      if (options.invalidateAll) invalidateAllQueryCache();
      if (options.invalidateTags?.length) {
        invalidateQueryCacheByTags(options.invalidateTags);
      }
      return response;
    });
  };
  // ── Query methods ───────────────────────────────────────────────────────────
  /**
   * Performs a GET request with caching and deduplication support.
   *
   * @example
   * ```ts
   * // Cached for 1 minute, tagged as "users"
   * const res = await queryGet<User[]>('/users', { params: { status: 'active' } }, {
   *   cache: true,
   *   ttlMs: 60_000,
   *   tags: ['users']
   * })
   * ```
   */
  function queryGet(url, config = {}, options = {}) {
    // Note: Change `options.cache ?? false` to `options.cache ?? true`
    // if you want caching turned ON by default for every GET request.
    const cache = Boolean(options.cache ?? false);
    const force = Boolean(options.force ?? false);
    const dedupe = cache && options.dedupe !== false;
    const ttlMs = Number(options.ttlMs ?? DEFAULT_TTL_MS);
    const tags = options.tags ?? [];
    const queryKey = buildQueryKey({
      method: "GET",
      url,
      params: config?.params,
      headers: config?.headers,
    });
    const now = Date.now();
    const existing = queryCache.get(queryKey);
    // 1. Return cached response if valid & not forced
    if (!force && cache && existing && existing.expiresAt > now) {
      return Promise.resolve(existing.response);
    }
    // 2. Return in-flight promise if dedupe is enabled (prevents identical concurrent network calls)
    if (dedupe && inFlightQueries.has(queryKey)) {
      return inFlightQueries.get(queryKey);
    }
    // 3. Make the actual network request
    const requestPromise = axiosInstance
      .get(url, config)
      .then((response) => {
        if (cache) {
          clearCacheKey(queryKey); // clear old data/tags before replacing
          queryCache.set(queryKey, {
            response,
            expiresAt: Date.now() + Math.max(0, ttlMs),
            tags: new Set(tags),
          });
          linkCacheKeyToTags(queryKey, tags);
        }
        return response;
      })
      .finally(() => {
        // Cleanup dedupe state regardless of success/failure
        if (dedupe) inFlightQueries.delete(queryKey);
      });
    // Save promise to inFlight map for deduplication
    if (dedupe) {
      inFlightQueries.set(queryKey, requestPromise);
    }
    return requestPromise;
  }
  /**
   * Performs a POST request.
   *
   * @example
   * ```ts
   * // Triggers targeted invalidation, wiping any cached GET requests using the "users" tag
   * const res = await queryPost<User>('/users', { name: 'Alice' }, {}, { invalidateTags: ['users'] })
   * ```
   */
  function queryPost(url, data, config = {}, options = {}) {
    return withInvalidation(axiosInstance.post(url, data, config), options);
  }
  /**
   * Performs a PUT request.
   */
  function queryPut(url, data, config = {}, options = {}) {
    return withInvalidation(axiosInstance.put(url, data, config), options);
  }
  /**
   * Performs a PATCH request.
   */
  function queryPatch(url, data, config = {}, options = {}) {
    return withInvalidation(axiosInstance.patch(url, data, config), options);
  }
  /**
   * Performs a DELETE request.
   */
  function queryDelete(url, config = {}, options = {}) {
    return withInvalidation(axiosInstance.delete(url, config), options);
  }
  return {
    queryGet,
    queryPost,
    queryPut,
    queryPatch,
    queryDelete,
    invalidateQueryCacheByTags,
    invalidateAllQueryCache,
  };
}
