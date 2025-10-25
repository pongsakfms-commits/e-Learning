import NodeCache from 'node-cache';

const ttl = Number(process.env.CACHE_TTL ?? '600');
const checkPeriod = Number(process.env.CACHE_CHECK_PERIOD ?? '120');

export const dashboardCache = new NodeCache({
  stdTTL: Number.isFinite(ttl) ? ttl : 600,
  checkperiod: Number.isFinite(checkPeriod) ? checkPeriod : 120,
  useClones: false,
});

export const generateCacheKey = (prefix: string, filters: Record<string, any>): string => {
  const sortedKeys = Object.keys(filters).sort();
  const keyParts = sortedKeys.map(key => `${key}=${filters[key] || ''}`);
  return `${prefix}:${keyParts.join(':')}`;
};
