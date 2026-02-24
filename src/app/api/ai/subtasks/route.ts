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
    console.log("[AI Subtasks] Calling breakDownTask with:", { title, description });
    let result;
    try {
      result = await aiService.breakDownTask(title, description || "");
      console.log("[AI Subtasks] Result:", result);
    } catch (aiError: any) {
      console.error("[AI Subtasks] AI service error:", aiError.message);
      result = { subtasks: [] };
    }

    // Coerce every entry to a plain string — handles both string and object responses from the AI
    let subtaskTitles: string[] = (result.subtasks || []).map((s: unknown) => {
      if (typeof s === "string") return s;
      if (s && typeof s === "object") {
        const obj = s as Record<string, unknown>;
        return String(obj.task ?? obj.title ?? obj.name ?? JSON.stringify(s));
      }
      return String(s);
    });

    // If AI fails, provide fallback subtasks based on the task title
    if (subtaskTitles.length === 0) {
      console.log("[AI Subtasks] AI returned empty, using fallback subtasks");
      const titleLower = title.toLowerCase();
      if (titleLower.includes("login") || titleLower.includes("auth")) {
        subtaskTitles = [
          "Set up authentication endpoint",
          "Add user validation logic",
          "Implement session handling",
          "Test authentication flow",
        ];
      } else if (titleLower.includes("api") || titleLower.includes("endpoint")) {
        subtaskTitles = [
          "Define API endpoint structure",
          "Implement request handling",
          "Add error responses",
          "Test endpoint functionality",
        ];
      } else if (titleLower.includes("report") || titleLower.includes("summary")) {
        subtaskTitles = [
          "Gather required data",
          "Format report structure",
          "Generate summary content",
          "Review and finalize",
        ];
      } else {
        subtaskTitles = [
          "Break down requirements",
          "Plan implementation steps",
          "Execute core functionality",
          "Test and validate",
        ];
      }
      console.log("[AI Subtasks] Using fallback subtasks:", subtaskTitles);
    }

    // 2. Persist subtasks to database
    const currentSubtasks = await db.subtask.findMany({
      where: { taskId },
      orderBy: { order: "desc" },
      take: 1,
    });

    const startOrder = (currentSubtasks[0]?.order ?? 0) + 1;

    const createdSubtasks = await Promise.all(
      subtaskTitles.map((sTitle, index) =>
        db.subtask.create({
          data: {
            title: sTitle,
            taskId,
            order: startOrder + index,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      subtasks: createdSubtasks,
    });
  } catch (error: any) {
    console.error("[AI Subtasks API] Error:", error);
    // Always return a `subtasks` key so the client never crashes on `data.subtasks.length`
    return NextResponse.json(
      {
        error: "AI Synthesis failed",
        details: error.message,
        subtasks: [],
      },
      { status: 500 }
    );
  }
}
