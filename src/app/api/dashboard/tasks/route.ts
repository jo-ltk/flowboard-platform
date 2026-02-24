
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    const tasks = await db.task.findMany({
      where: {
        project: {
          workspaceId: workspaceId
        }
      },
      include: {
        project: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        subtasks: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            comments: true,
            subtasks: true,
          }
        }
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(tasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description || "",
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : "No date",
      assignee: t.assignee?.name || "Unassigned",
      assigneeId: t.assigneeId || null,
      assigneeEmail: t.assignee?.email || null,
      assigneeImage: t.assignee?.image || null,
      project: t.project.name,
      projectId: t.projectId,
      order: t.order,
      subtasks: t.subtasks,
      subtaskTotal: t._count.subtasks,
      subtaskCompleted: t.subtasks.filter(s => s.completed).length,
      commentCount: t._count.comments,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    })));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, status, priority, dueDate, projectId, assigneeId } = body;

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
        description: description || "",
        status: status || "NOT_STARTED",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: targetProjectId,
        assigneeId: assigneeId || null,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, image: true }
        }
      }
    });

    return NextResponse.json(task);
  } catch (error: any) {
    console.error("Task POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, status, priority, dueDate, projectId, assigneeId, order } = body;

    if (!id) throw new Error("Task ID is required for updates");

    // Build update payload — only include fields that are provided
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (projectId !== undefined) updateData.projectId = projectId;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId || null;
    if (order !== undefined) updateData.order = order;

    // Get old status for trigger comparison
    const oldTask = await db.task.findUnique({ 
        where: { id }, 
        select: { status: true } 
    });

    const task = await db.task.update({
      where: { id },
      data: updateData,
      include: {
        assignee: {
          select: { id: true, name: true, email: true, image: true }
        }
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    await db.task.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}
