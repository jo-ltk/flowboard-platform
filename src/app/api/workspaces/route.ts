
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const workspaces = await db.workspace.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        planType: true,
        aiTokenUsage: true,
        automationUsage: true,
        subscriptionStatus: true,
        subscriptionEndsAt: true,
        _count: {
          select: { memberships: true }
        }
      }
    });

    // Seed if empty (extremely optimized)
    if (workspaces.length === 0) {
      const seeds = [
        { name: "Design Studio", slug: "design-studio", planType: "starter" },
        { name: "Marketing Engine", slug: "marketing-engine", planType: "starter" },
        { name: "Global Enterprise", slug: "global-enterprise", planType: "enterprise" },
      ];

      const createdWorkspaces = await Promise.all(
        seeds.map(seed => 
          db.workspace.create({
            data: {
              name: seed.name,
              slug: seed.slug,
              planType: seed.planType,
              projects: {
                create: {
                  name: `${seed.name} Project`,
                  description: `Initial project for ${seed.name}`
                }
              }
            },
            include: {
              _count: {
                select: { projects: true }
              }
            }
          })
        )
      );

      return NextResponse.json(createdWorkspaces);
    }

    return NextResponse.json(workspaces);
  } catch (error: any) {
    console.error('[API Workspaces] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const slug = name.toLowerCase().replace(/ /g, "-") + "-" + Math.random().toString(36).substring(2, 5);

    const workspace = await db.workspace.create({
      data: {
        name,
        slug,
        planType: "starter"
      }
    });

    // Create a default project for the new workspace
    await db.project.create({
      data: {
        name: `${name} General`,
        workspaceId: workspace.id,
        description: "Standard operational hub"
      }
    });

    return NextResponse.json(workspace);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    // Check if it's the last workspace
    const count = await db.workspace.count();
    if (count <= 1) {
      return NextResponse.json({ error: "Cannot delete the only workspace" }, { status: 400 });
    }

    await db.workspace.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
