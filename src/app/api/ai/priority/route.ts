
import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/services/ai/openai-service";

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    const result = await aiService.predictPriority(title, description || "");
    
    return NextResponse.json({ 
        priority: result.priority || "MEDIUM"
    });
  } catch (error: any) {
    console.error("[AI Priority API] Error:", error);
    return NextResponse.json({ 
      error: "AI Synthesis failed",
      details: error.message 
    }, { status: 500 });
  }
}
