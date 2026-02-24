
import { db } from "./db";

export type AutomationTrigger = "TASK_CREATED" | "TASK_UPDATED" | "STATUS_CHANGED";

export async function triggerAutomation(
  triggerType: AutomationTrigger,
  workspaceId: string,
  context: {
    taskId: string;
    oldStatus?: string;
    newStatus?: string;
    taskTitle: string;
  }
) {
  console.log(`[AutomationEngine] Triggering ${triggerType} for workspace ${workspaceId}`);

  // 1. Fetch active rules for this workspace
  const rules = await db.automationRule.findMany({
    where: {
      workspaceId,
      isActive: true,
    },
  });

  for (const rule of rules) {
    try {
      // 2. Evaluate if the rule matches the trigger
      // For now, we use simple string matching to make the existing UI "real"
      let shouldExecute = false;

      const triggerText = rule.trigger.toLowerCase();
      
      if (triggerType === "STATUS_CHANGED" || triggerType === "TASK_UPDATED") {
        if (context.newStatus === "DONE" && (triggerText.includes("completed") || triggerText.includes("done"))) {
          shouldExecute = true;
        }
        if (context.newStatus === "IN_PROGRESS" && triggerText.includes("start")) {
          shouldExecute = true;
        }
      }

      if (triggerType === "TASK_CREATED" && triggerText.includes("create")) {
        shouldExecute = true;
      }

      if (shouldExecute) {
        console.log(`[AutomationEngine] Executing rule: ${rule.name}`);
        
        // 3. Execute the action
        // Basic action: Add a system comment
        const actionText = rule.action.toLowerCase();
        
        if (actionText.includes("comment") || actionText.includes("notify")) {
            await db.taskComment.create({
                data: {
                    content: `🤖 Automation: ${rule.action} (Triggered by ${rule.trigger})`,
                    taskId: context.taskId,
                    authorName: "FlowBot",
                    authorImage: "https://api.dicebear.com/7.x/bottts/svg?seed=FlowBot"
                }
            });
        }

        // 4. Record execution and Log Activity
        await db.automationExecution.create({
          data: {
            ruleId: rule.id,
            workspaceId,
            status: "SUCCESS"
          }
        });

        await db.activityLog.create({
            data: {
                action: "AUTOMATION_EXEC",
                entityType: "AUTOMATION_RULE",
                entityId: rule.id,
                workspaceId,
                metadata: {
                    ruleName: rule.name,
                    trigger: rule.trigger,
                    taskId: context.taskId
                }
            }
        });

        // 5. Update workspace usage
        await db.workspace.update({
            where: { id: workspaceId },
            data: { automationUsage: { increment: 1 } }
        });
      }
    } catch (err) {
      console.error(`[AutomationEngine] Rule execution failed: ${rule.id}`, err);
      await db.automationExecution.create({
        data: {
          ruleId: rule.id,
          workspaceId,
          status: "FAILED"
        }
      });
    }
  }
}
