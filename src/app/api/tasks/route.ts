import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Task } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, priority, status, projectId } = body;

    // Use provided projectId or fallback to first one
    let project = projectId ? { id: projectId } : await db.project.findFirst();
    
    if (!project) {
        // Create a default project if none exists (fallback)
        const workspace = await db.workspace.findFirst();
        if (workspace) {
            project = await db.project.create({
                data: {
                    name: "Default Project",
                    workspaceId: workspace.id
                }
            });
        } else {
             return NextResponse.json({ error: 'No workspace found' }, { status: 400 });
        }
    }

    const task = await db.task.create({
      data: {
        title,
        priority: (priority?.toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW') || 'MEDIUM',
        status: status || 'NOT_STARTED',
        projectId: project.id,
        assigneeId: 'user-id-placeholder'
      },
      include: {
          project: true
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Error creating task' }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get('projectId');
        
        const tasks = await db.task.findMany({
            where: projectId ? { projectId } : {},
            orderBy: { createdAt: 'desc' }
        });
        
        // Map Prisma tasks to our UI format
        const formattedTasks = tasks.map((task: Task) => ({
            id: task.id,
            title: task.title,
            status: task.status,
            priority: task.priority.toLowerCase(),
            time: 'Just now', // TODO: Format createdAt relative time
            assignee: 'You' // Placeholder
        }));

        return NextResponse.json(formattedTasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json({ error: 'Error fetching tasks' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
        }

        await db.task.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json({ error: 'Error deleting task' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, title, priority, status } = body;
        const oldTask = await db.task.findUnique({
            where: { id },
            select: { status: true }
        });

        const task = await db.task.update({
            where: { id },
            data: {
                title,
                priority: priority ? priority.toUpperCase() : undefined,
                status: status
            },
            include: {
                project: true
            }
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ error: 'Error updating task' }, { status: 500 });
    }
}
