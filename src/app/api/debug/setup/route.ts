import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    console.log("[Setup API] Starting database initialization...");

    // 1. Ensure a Workspace exists
    let workspace = await db.workspace.findFirst();
    if (!workspace) {
      console.log("[Setup API] Creating default workspace...");
      workspace = await db.workspace.create({
        data: {
          name: "Main Workspace",
          slug: "main-workspace",
          planType: "pro",
        },
      });
    }

    // 2. Ensure a Project exists
    let project = await db.project.findFirst({
      where: { workspaceId: workspace.id }
    });

    if (!project) {
      console.log("[Setup API] Creating real project setup...");
      project = await db.project.create({
        data: {
          name: "FlowBoard Evolution",
          description: "Major architectural overhaul and aesthetic refinement of the FlowBoard platform.",
          workspaceId: workspace.id,
        },
      });
    }

    // 3. Ensure some Tasks exist
    const taskCount = await db.task.count({
      where: { projectId: project.id }
    });

    if (taskCount === 0) {
      console.log("[Setup API] Seeding real tasks...");
      await db.task.createMany({
        data: [
          {
            title: "Finalize core design system tokens",
            description: "Update typography, color palettes, and spacing variables.",
            status: "COMPLETED",
            priority: "HIGH",
            projectId: project.id,
          },
          {
            title: "Implement responsive dashboard sidebar",
            description: "Ensure smooth transitions and mobile-first layout.",
            status: "IN_PROGRESS",
            priority: "MEDIUM",
            projectId: project.id,
          },
          {
            title: "Connect upload functionality to real DB",
            description: "Allow users to upload project files and sync tasks.",
            status: "TODO",
            priority: "HIGH",
            projectId: project.id,
          }
        ]
      });
    }

    // 4. Activity Logs for flavor
    await db.activityLog.create({
      data: {
        action: "INITIALIZED_DB",
        entityType: "SYSTEM",
        entityId: "SYSTEM",
        workspaceId: workspace.id,
        metadata: { message: "Real project setup created." }
      }
    });

    return NextResponse.json({ 
      success: true, 
      workspaceId: workspace.id, 
      projectId: project.id,
      message: "Database successfully initialized with a real project setup." 
    });
  } catch (error: any) {
    console.error("[Setup API] Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
