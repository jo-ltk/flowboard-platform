import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const tasks = await db.task.findMany({
      include: {
        project: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(tasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description || "",
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : "No date",
      assignee: "You", // Hardcoded for simplified view
      project: t.project.name
    })));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, projectId } = body;

    // Default to the first project if not provided
    let targetProjectId = projectId;
    if (!targetProjectId) {
      const firstProject = await db.project.findFirst();
      if (!firstProject) throw new Error("No projects found to add task to.");
      targetProjectId = firstProject.id;
    }

    const task = await db.task.create({
      data: {
        title,
        description: "Added from dashboard",
        projectId: targetProjectId,
        status: "TODO",
        priority: "MEDIUM"
      }
    });

    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
