
import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/services/ai/openai-service";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { taskId, title, description } = await req.json();

    if (!taskId || !title) {
      return NextResponse.json({ error: "Missing taskId or title" }, { status: 400 });
    }

    // 1. Generate subtasks using AI
    const result = await aiService.breakDownTask(title, description || "");
    const subtaskTitles = result.subtasks || [];

    if (subtaskTitles.length === 0) {
      return NextResponse.json({ error: "AI failed to generate subtasks" }, { status: 500 });
    }

    // 2. Persist subtasks to database
    // We'll get the current max order to append them
    const currentSubtasks = await db.subtask.findMany({
      where: { taskId },
      orderBy: { order: "desc" },
      take: 1,
    });
    
    let startOrder = (currentSubtasks[0]?.order || 0) + 1;

    const createdSubtasks = await Promise.all(
        subtaskTitles.map((sTitle: string, index: number) => 
            db.subtask.create({
                data: {
                    title: sTitle,
                    taskId,
                    order: startOrder + index
                }
            })
        )
    );

    return NextResponse.json({ 
        success: true, 
        subtasks: createdSubtasks 
    });
  } catch (error: any) {
    console.error("[AI Subtasks API] Error:", error);
    return NextResponse.json({ 
      error: "AI Synthesis failed",
      details: error.message 
    }, { status: 500 });
  }
}
