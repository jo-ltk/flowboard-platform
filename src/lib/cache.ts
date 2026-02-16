import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const memoryCache = new Map<string, { value: any; expiry: number }>();

export const cache = {
  /**
   * Get value from cache (Redis with Memory Fallback)
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        return await redis.get<T>(key);
      }
      throw new Error("Redis not configured");
    } catch (error) {
      // Fallback to memory cache
      const item = memoryCache.get(key);
      if (item && item.expiry > Date.now()) {
        return item.value as T;
      }
      if (item) memoryCache.delete(key); 
      return null;
    }
  },

  /**
   * Set value in cache with TTL (Time To Live) in seconds
   */
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        await redis.set(key, value, { ex: ttl });
      }
      // Always set to memory as backup/primary
      memoryCache.set(key, { 
        value, 
        expiry: Date.now() + (ttl * 1000) 
      });
    } catch (error) {
      console.error("Cache Set Error:", error);
       // Ensure memory cache is set even if Redis fails
       memoryCache.set(key, { 
        value, 
        expiry: Date.now() + (ttl * 1000) 
      });
    }
  },

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        await redis.del(key);
      }
      memoryCache.delete(key);
    } catch (error) {
       memoryCache.delete(key);
    }
  },

  /**
   * Specialized key generator for AI orchestration caching
   */
  generateAIKey(workspaceId: string, prompt: string, model: string): string {
    const hash = Buffer.from(prompt).toString("base64").substring(0, 32);
    return `ai_cache:${workspaceId}:${model}:${hash}`;
  }
};
