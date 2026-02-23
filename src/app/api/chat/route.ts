import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/services/ai/openai-service";
import { db } from "@/lib/db";
// import { auth } from "@/auth"; // Assuming auth is configured this way for NextAuth v5

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // Optional: Get user context if logged in
    // const session = await auth();
    // const userContext = session?.user ? { ...context, user: session.user } : null;

    const stream = await aiService.streamChat(messages, context);

    // Transforming the OpenAI stream into a ReadableStream for Next.js response
    const readableStream = new ReadableStream({
      async start(controller) {
        let fullToolCallArguments = "";
        let toolCallName = "";
        let hasSentContent = false;

        try {
          // @ts-ignore - OpenAI stream iteration
          for await (const chunk of stream) {
            // Log for debugging (only first choice)
            const choice = chunk.choices?.[0];
            if (!choice) continue;

            const delta = choice.delta;
            
            // Handle content
            const chunkText = (delta as any)?.content || "";
            if (chunkText) {
              hasSentContent = true;
              controller.enqueue(new TextEncoder().encode(chunkText));
            }

            // Handle Reasoning/Metadata (Optional: logging it for now)
            if ((delta as any)?.reasoning) {
               console.log("[AI Reasoning]:", (delta as any).reasoning);
            }

            // Handle tool calls
            const toolCalls = delta?.tool_calls;
            if (toolCalls && toolCalls.length > 0) {
              const toolCall = toolCalls[0];
              if (toolCall.function?.name) {
                toolCallName = toolCall.function.name;
              }
              if (toolCall.function?.arguments) {
                fullToolCallArguments += toolCall.function.arguments;
              }
            }
          }

          // Debug: Log what we received
          console.log("[AI Assistant] Stream complete. Tool call name:", toolCallName, "Arguments:", fullToolCallArguments ? fullToolCallArguments.substring(0, 100) + "..." : "(empty)", "Has content:", hasSentContent);

          // If a tool call was made, execute it after the stream chunks are processed
          if (toolCallName === "create_task" && fullToolCallArguments) {
            // If the AI didn't say anything, send a status update
            if (!hasSentContent) {
              controller.enqueue(new TextEncoder().encode("Architecting your request..."));
            }

            try {
              // Try to parse the JSON, with fallback handling for incomplete chunks
              let args;
              try {
                args = JSON.parse(fullToolCallArguments);
              } catch (parseErr) {
                // Try to find and extract JSON from the string if direct parsing fails
                console.warn("[AI Assistant] Direct parse failed, attempting extraction:", fullToolCallArguments.substring(0, 200));
                const jsonMatch = fullToolCallArguments.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  args = JSON.parse(jsonMatch[0]);
                } else {
                  // Even if we can't parse, try to create a basic task with what we have
                  console.error("[AI Assistant] Failed to parse JSON, raw args:", fullToolCallArguments);
                  controller.enqueue(new TextEncoder().encode("\n\n**System Notice:** AI response received but couldn't parse task data. Please try again or create the task manually."));
                  controller.close();
                  return;
                }
              }
              
              console.log("[AI Assistant] ARCHITECTING TASK:", args);

              // 1. Determine Target Project
              let project = null;
              
              // If AI provided a specific project ID, try to use it
              if (args.projectId) {
                project = await db.project.findUnique({ 
                  where: { id: args.projectId } 
                });
              }

              // If no specific project or ID was invalid, look for any project in the active workspace
              if (!project && context?.workspaceId) {
                console.log("[AI Assistant] Searching for project in workspace:", context.workspaceId);
                project = await db.project.findFirst({
                  where: { workspaceId: context.workspaceId }
                });
              }

              // Final fallback to the global first project if workspace lookup fails
              if (!project) {
                console.warn("[AI Assistant] Workspace mapping failed, falling back to global project lookup.");
                project = await db.project.findFirst();
              }
              
              if (project) {
                console.log(`[AI Assistant] target_project_id: ${project.id} (${project.name})`);
                
                // Validate date
                const dateVal = args.dueDate ? new Date(args.dueDate) : null;
                const finalDueDate = dateVal && !isNaN(dateVal.getTime()) ? dateVal : null;

                // Handle assignment
                let assigneeId = undefined;
                let description = args.description || "Automatically synthesized by FlowBoard AI";
                
                if (args.assignee) {
                  const user = await db.user.findFirst({
                    where: {
                      OR: [
                        { name: { contains: args.assignee, mode: 'insensitive' } },
                        { email: { contains: args.assignee, mode: 'insensitive' } }
                      ]
                    }
                  });
                  
                  if (user) {
                    assigneeId = user.id;
                    console.log(`[AI Assistant] Assignee matched: ${user.name} (${user.id})`);
                  } else {
                    console.warn(`[AI Assistant] No user found matching: ${args.assignee}`);
                    description = `[Assigned to: ${args.assignee}] ${description}`;
                  }
                }

                const newTask = await db.task.create({
                  data: {
                    title: args.title,
                    description: description,
                    priority: (args.priority?.toUpperCase() as any) || "MEDIUM",
                    status: "TODO",
                    projectId: project.id,
                    dueDate: finalDueDate,
                    assigneeId: assigneeId
                  }
                });
                console.log("[AI Assistant] SUCCESS: Task persisted with ID:", newTask.id);
                
                // Final confirmation injected into the chat stream
                controller.enqueue(new TextEncoder().encode(`\n\n**System Update:** Task successfully synchronized to project "${project.name}" in your active workspace.`));
              } else {
                console.error("[AI Assistant] FATAL: No project found in system.");
                controller.enqueue(new TextEncoder().encode("\n\n**System Error:** Communication breakdown. No workspace projects found to house this task."));
              }
            } catch (err) {
              console.error("[AI Assistant] Tool execution error:", err);
              controller.enqueue(new TextEncoder().encode("\n\n**System Error:** Failed to architect task metadata."));
            }
          }

          controller.close();
        } catch (streamError: any) {
          console.error("ReadableStream Error:", streamError);
          // Don't kill the controller if we already sent some data, just close it or error it out
          try { controller.error(streamError); } catch (e) {}
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Full Chat API Error Stack:", error);
    return NextResponse.json({ 
      error: "Communication breakdown. AI offline.",
      details: error.message
    }, { status: 500 });
  }
}
