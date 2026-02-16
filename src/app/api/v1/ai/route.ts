import { NextRequest } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { successResponse, errorResponse, API_ERRORS } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { aiService } from "@/services/ai/openai-service";

export async function GET() {
  return successResponse({
    status: "operational",
    message: "FlowBoard AI API is online. Please use POST with a valid API key to interact.",
    documentation: "https://docs.flowboard.com/api/v1/ai"
  });
}

export async function POST(req: NextRequest) {
  const apiKey = await validateApiKey(req);
  if (!apiKey) return errorResponse(API_ERRORS.UNAUTHORIZED.code, API_ERRORS.UNAUTHORIZED.message, null, 401);

  const rateLimit = checkRateLimit(apiKey.key);
  if (!rateLimit.allowed) return errorResponse(API_ERRORS.RATE_LIMITED.code, API_ERRORS.RATE_LIMITED.message, null, 429);

  try {
    const body = await req.json();
    const { type, context } = body;

    // Route based on type
    if (type === "insight") {
        const result = await aiService.generateInsight(context);
        return successResponse(result);
    } 
    else if (type === "task-breakdown") {
        const { title, description } = context;
        const result = await aiService.breakDownTask(title, description);
        return successResponse(result);
    }
    else {
      return errorResponse(API_ERRORS.VALIDATION_ERROR.code, "Unsupported 'type'", null, 400);
    }

  } catch (error: any) {
    console.error("AI Route Error:", error);
    return errorResponse(API_ERRORS.INTERNAL_ERROR.code, error.message || "AI processing failed", null, 500);
  }
}
