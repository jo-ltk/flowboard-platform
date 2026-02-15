import { z } from "zod";
import { NextResponse } from "next/server";

export const workspaceSchema = z.object({
  name: z.string().min(3).max(50),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, "Slug must be lowercase and contain only letters, numbers, and hyphens"),
});

export const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

export const automationSchema = z.object({
  name: z.string().min(1),
  trigger: z.string(),
  action: z.string(),
});

/**
 * Validates request body against a Zod schema
 */
export async function validateRequest<T>(req: Request, schema: z.Schema<T>) {
  try {
    const body = await req.json();
    return { success: true, data: schema.parse(body) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: NextResponse.json({ 
          error: "Validation failed", 
          details: (error as any).errors.map((e: any) => ({ path: e.path, message: e.message }))
        }, { status: 400 }) 
      };
    }
    return { 
      success: false, 
      error: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) 
    };
  }
}
