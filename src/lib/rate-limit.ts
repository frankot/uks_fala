/**
 * Fixed-window per-key rate limiter held in module memory.
 *
 * Deliberately not Redis: this site runs small enough that a per-instance limit
 * is worth far more than nothing, and it costs no infrastructure. The tradeoff
 * is that serverless spreads requests across instances, so a determined
 * attacker gets `limit × instances` rather than `limit`. If abuse ever becomes
 * real, swap the body of `rateLimit` for Upstash — the signature is the whole
 * contract and no caller changes.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Bound the map so a flood of distinct IPs cannot grow it without limit. */
const MAX_KEYS = 10_000;

function prune(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the window resets — surfaced as the Retry-After header. */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_KEYS) prune(now);
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      ok: false,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return { ok: true, retryAfter: 0 };
}

/**
 * Client IP from the proxy headers Vercel sets. Falls back to a constant so a
 * missing header collapses every caller into one shared bucket rather than
 * silently disabling the limit.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
