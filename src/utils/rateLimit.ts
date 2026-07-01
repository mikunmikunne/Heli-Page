const ipCache = new Map<string, number[]>();

/**
 * Simple in-memory rate limiter
 * Default: Max 5 requests per 1 minute per IP
 */
export function isRateLimited(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = ipCache.get(ip) || [];
  
  // Filter out expired timestamps
  const activeTimestamps = timestamps.filter((timestamp) => now - timestamp < windowMs);
  
  if (activeTimestamps.length >= limit) {
    return true;
  }
  
  activeTimestamps.push(now);
  ipCache.set(ip, activeTimestamps);
  return false;
}
