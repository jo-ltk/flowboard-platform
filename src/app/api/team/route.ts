import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET — List all team members for a workspace
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    const memberships = await db.membership.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { role: "asc" },
    });

    const members = memberships.map((m) => ({
      id: m.id,
      userId: m.user.id,
      name: m.user.name || "Unnamed",
      email: m.user.email || "",
      image: m.user.image || null,
      role: m.role,
    }));

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}

// POST — Add a new team member (by email)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceId, email, name, role } = body;

    if (!workspaceId || !email) {
      return NextResponse.json(
        { error: "Workspace ID and email are required" },
        { status: 400 }
      );
    }

    // Find or create user by email
    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
        },
      });
    }

    // Check if membership already exists
    const existingMembership = await db.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "This person is already a team member" },
        { status: 409 }
      );
    }

    // Create the membership
    const membership = await db.membership.create({
      data: {
        userId: user.id,
        workspaceId,
        role: role || "MEMBER",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: membership.id,
      userId: membership.user.id,
      name: membership.user.name || "Unnamed",
      email: membership.user.email || "",
      image: membership.user.image || null,
      role: membership.role,
    });
  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}

// PATCH — Update a team member's role
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { membershipId, role } = body;

    if (!membershipId || !role) {
      return NextResponse.json(
        { error: "Membership ID and role are required" },
        { status: 400 }
      );
    }

    const validRoles = ["OWNER", "ADMIN", "MEMBER", "GUEST"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
        { status: 400 }
      );
    }

    const membership = await db.membership.update({
      where: { id: membershipId },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: membership.id,
      userId: membership.user.id,
      name: membership.user.name || "Unnamed",
      email: membership.user.email || "",
      image: membership.user.image || null,
      role: membership.role,
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}

// DELETE — Remove a team member
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const membershipId = searchParams.get("id");

    if (!membershipId) {
      return NextResponse.json(
        { error: "Membership ID is required" },
        { status: 400 }
      );
    }

    await db.membership.delete({
      where: { id: membershipId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}
