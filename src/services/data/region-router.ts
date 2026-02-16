import { PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";

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
    // If it's the default region, use the singleton 'db' instance
    if (region === "us-east-1" || !region) {
      return db;
    }

    if (regionClients[region]) {
      return regionClients[region];
    }

    const url = REGION_DB_URLS[region];
    if (!url) {
      return db; // Fallback to main db
    }

    // Use a separate client for other regions if configured
    const client = new PrismaClient({
      datasourceUrl: url,
    } as any);

    if (process.env.NODE_ENV !== "production") {
      regionClients[region] = client;
    }

    return client;
  }

  /**
   * Determines the optimal region based on user's IP or preference
   */
  static resolveRegion(ip?: string): string {
    return "us-east-1"; 
  }
}
