import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const subtasks = await db.subtask.findMany({
      where: { taskId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(subtasks);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, taskId } = body;

    if (!title || !taskId) {
      return NextResponse.json({ error: "Title and taskId are required" }, { status: 400 });
    }

    const count = await db.subtask.count({ where: { taskId } });

    const subtask = await db.subtask.create({
      data: {
        title,
        taskId,
        order: count,
      },
    });

    return NextResponse.json(subtask);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, completed, title } = body;

    if (!id) {
      return NextResponse.json({ error: "Subtask ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (completed !== undefined) updateData.completed = completed;
    if (title !== undefined) updateData.title = title;

    const subtask = await db.subtask.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(subtask);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Subtask ID is required" }, { status: 400 });
    }

    await db.subtask.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
