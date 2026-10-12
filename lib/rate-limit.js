'use strict';

const buckets = new Map();

function prune(now) {
  for (const [key, hits] of buckets.entries()) {
    const next = hits.filter((t) => now - t < 15 * 60 * 1000);
    if (next.length) buckets.set(key, next);
    else buckets.delete(key);
  }
}

function rateLimit(key, max, windowMs) {
  const now = Date.now();
  if (buckets.size > 5000) prune(now);
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    const retryAfter = Math.ceil((windowMs - (now - hits[0])) / 1000);
    return { ok: false, retryAfter };
  }
  hits.push(now);
  buckets.set(key, hits);
  return { ok: true, remaining: max - hits.length };
}

function resetRateLimit(key) {
  if (key) buckets.delete(key);
  else buckets.clear();
}

module.exports = { rateLimit, resetRateLimit };
