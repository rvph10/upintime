import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Type for duration (number + time unit)
type TimeUnit = "ms" | "s" | "m" | "h" | "d";
type Duration = `${number} ${TimeUnit}`;

// Initialize Redis client for rate limiting
let redis: Redis | null = null;
const rateLimiters: Record<string, Ratelimit> = {};

/**
 * Parse duration string into the format expected by Upstash
 * @param durationStr Duration string in format "number unit" (e.g., "60 s")
 * @returns Tuple of [number, unit] or null if invalid
 */
function parseDuration(durationStr: string): Duration | null {
  const parts = durationStr.trim().split(/\s+/);
  if (parts.length !== 2) return null;

  const value = parseInt(parts[0], 10);
  const unit = parts[1] as TimeUnit;

  if (isNaN(value) || !["ms", "s", "m", "h", "d"].includes(unit)) {
    return null;
  }

  return `${value} ${unit}`;
}

/**
 * Initialize the rate limiter instance
 * @param identifier A unique name for this rate limiter
 * @param limit Number of requests allowed
 * @param durationStr Duration window (e.g., "60 s", "10 m", "1 h")
 * @returns Rate limiter instance or null if initialization failed
 */
export function getRateLimiter(
  identifier: string,
  limit: number,
  durationStr: string,
): Ratelimit | null {
  // Return existing instance if already created
  if (rateLimiters[identifier]) {
    return rateLimiters[identifier];
  }

  try {
    // Parse the duration string
    const duration = parseDuration(durationStr);
    if (!duration) {
      console.error(
        `Invalid duration format: "${durationStr}". Expected format: "number unit" (e.g., "60 s")`,
      );
      return null;
    }

    // Initialize Redis if not already done
    if (!redis) {
      // Skip if Redis credentials are not available
      if (
        !process.env.UPSTASH_REDIS_REST_URL ||
        !process.env.UPSTASH_REDIS_REST_TOKEN
      ) {
        console.warn(
          `Redis credentials not found. Rate limiting for "${identifier}" disabled.`,
        );
        return null;
      }

      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
    }

    // Create a new rate limiter
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, duration),
      prefix: `ratelimit:${identifier}:`,
      analytics: true,
    });

    // Store for reuse
    rateLimiters[identifier] = ratelimit;
    return ratelimit;
  } catch (error) {
    console.error(
      `Failed to initialize rate limiter for "${identifier}":`,
      error,
    );
    return null;
  }
}

/**
 * Apply rate limiting to a request
 * @param request The incoming request
 * @param identifier A unique name for this rate limiter
 * @param limit Number of requests allowed
 * @param durationStr Duration window (e.g., "60 s", "10 m", "1 h")
 * @returns Response if rate limit is exceeded, null otherwise
 */
export async function applyRateLimit(
  request: Request,
  identifier: string,
  limit: number,
  durationStr: string,
): Promise<NextResponse | null> {
  // Get the rate limiter
  const rateLimiter = getRateLimiter(identifier, limit, durationStr);
  if (!rateLimiter) {
    return null; // Continue processing if rate limiting is not available
  }

  try {
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";
    const key = `${identifier}:${ip}`;

    // Apply rate limiting
    const {
      success,
      limit: rateLimit,
      reset,
      remaining,
    } = await rateLimiter.limit(key);

    // If rate limit is exceeded, return 429 Too Many Requests
    if (!success) {
      return NextResponse.json(
        {
          error: "Too many requests, please try again later",
          resetInSeconds: Math.ceil((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      );
    }

    // Not rate limited, continue processing
    return null;
  } catch (error) {
    console.error(`Rate limiting error for "${identifier}":`, error);
    return null; // Continue processing if rate limiting fails
  }
}
