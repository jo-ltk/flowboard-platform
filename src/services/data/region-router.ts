import { PrismaClient } from "@prisma/client";

// Cache for Prisma clients per region
const regionClients: Record<string, PrismaClient> = {};

const REGION_DB_URLS: Record<string, string> = {
  "us-east-1": process.env.DATABASE_URL_US_EAST_1 || process.env.DATABASE_URL || "",
  "eu-central-1": process.env.DATABASE_URL_EU_CENTRAL_1 || "",
};

export class RegionRouter {
  /**
   * Get a strict database connection for a specific region
   */
  static getClient(region: string = "us-east-1"): PrismaClient {
    if (regionClients[region]) {
      return regionClients[region];
    }

    const url = REGION_DB_URLS[region];
    if (!url) {
      throw new Error(`No database configured for region: ${region}`);
    }

    // In Prisma 7.x, client engine requires accelerateUrl
    const client = new PrismaClient({
      accelerateUrl: url,
    });

    if (process.env.NODE_ENV !== "production") {
      regionClients[region] = client;
    }

    return client;
  }

  /**
   * Determines the optimal region based on user's IP or preference
   * This would typically use a GeoIP service
   */
  static resolveRegion(ip?: string): string {
    // Mock logic: if IP starts with 192 (US) vs something else
    // Real implementation would use MaxMind or Edge headers
    return "us-east-1"; 
  }
}
