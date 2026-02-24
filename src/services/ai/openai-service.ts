import OpenAI from "openai";

/**
 * We use the OpenAI client pointing to OpenRouter for maximum stability
 * and compatibility with Next.js streaming response patterns.
 */
const getOpenRouterClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing from env");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost",
      "X-Title": "FlowBoard",
    },
  });
};

const MODELS = {
  /**
   * Arcee AI Trinity Large - Primary model for all text-based AI tasks.
   * Used for chat, insights, priority prediction, task breakdown, and narrative reports.
   * Free tier available.
   */
  FAST: "arcee-ai/trinity-large-preview:free",
  /**
   * Nvidia Nemotron Nano - Vision model for image analysis.
   * Only used when user uploads an image for analysis.
   * Supports text + image inputs.
   */
  SMART: "nvidia/nemotron-nano-12b-v2-vl:free",
} as const;

/** Helper to robustly extract and parse JSON from AI responses */
function extractJson(content: string | null) {
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (e) {
    const match = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (match) {
      return JSON.parse(match[1]);
    }
    // Try finding the first '{' and last '}'
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(content.substring(firstBrace, lastBrace + 1));
    }
    throw new Error(`Failed to parse AI response as JSON.`);
  }
}

/** A chat message part — either plain text or a base64 image. */
export interface MessageContentPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

/** A chat message, supporting either simple string content or multimodal parts. */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string | MessageContentPart[];
}

export const aiService = {
  /**
   * Generate summarized insights
   */
  async generateInsight(context: any) {
    try {
      const openai = getOpenRouterClient();
      const response = await openai.chat.completions.create({
        model: MODELS.FAST,
        messages: [
          {
            role: "system",
            content:
              "You are an elite project management AI assistant for FlowBoard. Generate a strategic executive summary. Return valid JSON.",
          },
          {
            role: "user",
            content: `Analyze this project data: ${JSON.stringify(context)}`,
          },
        ],
      });

      const content = response.choices[0].message.content;
      return extractJson(content);
    } catch (error: any) {
      console.error("AI Insight Error:", error);
      throw new Error(`Failed to generate AI insight: ${error.message}`);
    }
  },

  /**
   * Generate a full narrative report
   */
  async generateNarrativeReport(context: any) {
    try {
      const openai = getOpenRouterClient();
      const response = await openai.chat.completions.create({
        model: MODELS.FAST,
        messages: [
          {
            role: "system",
            content: `You are an elite executive strategy consultant AI for FlowBoard.
            Generate a comprehensive narrative report for a workspace.
            The report must be professional, insightful, and strategic.

            Return ONLY a JSON object with this exact structure:
            {
              "summary": "2-3 paragraphs of strategic overview using rich, professional language.",
              "productivityDelta": number (between 5 and 25),
              "riskReduction": number (between 10 and 60),
              "timeSaved": number (between 5 and 30),
              "automationSavings": number (between 1000 and 10000),
              "topInsights": ["insight 1", "insight 2", "insight 3"]
            }`,
          },
          {
            role: "user",
            content: `Generate a narrative report for this workspace context: ${JSON.stringify(context)}`,
          },
        ],
      });

      const content = response.choices[0].message.content;
      return extractJson(content);
    } catch (error: any) {
      console.error("Narrative Report Error:", error);
      throw new Error(`Failed to generate narrative report: ${error.message}`);
    }
  },

  async breakDownTask(taskTitle: string, description: string) {
    try {
      const openai = getOpenRouterClient();
      const response = await openai.chat.completions.create({
        model: MODELS.FAST,
        messages: [
          {
            role: "system",
            content: `Break down the task into 3-5 actionable subtasks. Return JSON with a 'subtasks' array containing ONLY simple strings - each string should be a short, actionable subtask title (e.g., "Set up API endpoint", "Add authentication logic"). Do NOT include objects or additional fields.`,
          },
          {
            role: "user",
            content: `Task: ${taskTitle}\nContext: ${description}`,
          },
        ],
      });

      const content = response.choices[0].message.content;
      const result = extractJson(content) || { subtasks: [] };
      
      // Ensure subtasks is an array of strings
      if (Array.isArray(result.subtasks)) {
        result.subtasks = result.subtasks.map((s: any) => {
          if (typeof s === 'string') return s;
          if (typeof s === 'object' && s !== null) {
            // Handle object format: extract task or title field
            return s.task || s.title || s.name || String(s);
          }
          return String(s);
        });
      }
      
      return result;
    } catch (error: any) {
      console.error("AI Task Breakdown Error:", error);
      return { subtasks: [] };
    }
  },

  /**
   * Predict priority based on title and description
   */
  async predictPriority(title: string, description: string) {
    try {
        const openai = getOpenRouterClient();
        const response = await openai.chat.completions.create({
            model: MODELS.FAST,
            messages: [
                {
                    role: "system",
                    content: "Analyze the task and return a JSON object with 'priority' (HIGH, MEDIUM, or LOW) based on urgency and importance.",
                },
                {
                    role: "user",
                    content: `Task: ${title}\nContext: ${description}`,
                },
            ],
        });
        const content = response.choices[0].message.content;
        return extractJson(content) || { priority: "MEDIUM" };
    } catch (error: any) {
        console.error("AI Priority Error:", error);
        return { priority: "MEDIUM" };
    }
  },

  /**
   * Streaming chat for the assistant.
   * Messages may contain image content parts (base64 or URL) for vision analysis.
   */
  async streamChat(messages: ChatMessage[], context: any = null) {
    try {
      const openai = getOpenRouterClient();

      // Detect if any message contains an image — pick vision model if so
      const hasImage = messages.some(
        (m) =>
          Array.isArray(m.content) &&
          m.content.some((p) => p.type === "image_url")
      );
      const model = hasImage ? MODELS.SMART : MODELS.FAST;

      const systemPrompt = `You are FlowBoard AI, a premium intelligent workspace assistant.
      Your personality is strategic, design-forward, calm, and helpful.
      You help users manage projects, handle deadlines, and architect workflows.

      Design System Context: "Soft Editorial Pastel" (#FFFDF5 background, #364C84 primary).

      ${
        context
          ? `USER CONTEXT: ${JSON.stringify(context)}`
          : "USER IS A GUEST (Demo Mode). Encourage them to sign up to unlock full capabilities."
      }

      Keep responses concise, editorial, and helpful. Use markdown for structure.

      IMPORTANT — When a user shares an IMAGE:
      1. Carefully analyze what's in the image (screenshot, mockup, diagram, document, whiteboard, etc.)
      2. Extract ALL actionable items, tasks, features, bugs, or requirements visible.
      3. Immediately use the create_task tool for EACH distinct task you identify.
      4. Describe each task clearly with title, description, priority, and due date if visible.
      5. After creating tasks, summarize what you found and what tasks were created.

      You have tools to interact with the workspace. Use create_task whenever a user asks to create/save a task, OR when analyzing an image.`;

      const stream = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ],
        stream: true,
        tools: [
          {
            type: "function",
            function: {
              name: "create_task",
              description:
                "Create a new task in the workspace. Use this for explicit task requests AND when extracting tasks from an analyzed image.",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "The task title" },
                  description: {
                    type: "string",
                    description: "Detailed task description",
                  },
                  projectId: {
                    type: "string",
                    description:
                      "Optional ID of a specific project. Defaults to workspace's active project.",
                  },
                  priority: {
                    type: "string",
                    enum: ["LOW", "MEDIUM", "HIGH"],
                    description:
                      "Urgency: LOW (routine), MEDIUM (standard), HIGH (critical).",
                  },
                  dueDate: {
                    type: "string",
                    description:
                      "Deadline in any standard format (e.g., '2025-12-01', 'tomorrow', 'next Friday').",
                  },
                  assignee: {
                    type: "string",
                    description:
                      "Name or email of the person to assign this task to.",
                  },
                },
                required: ["title"],
              },
            },
          },
        ],
        tool_choice: "auto",
      } as any);

      return stream;
    } catch (error: any) {
      console.error("AI Streaming Error Details:", error);
      throw new Error(`Failed to start AI stream: ${error.message}`);
    }
  },
};
