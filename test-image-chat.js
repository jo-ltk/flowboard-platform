require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "localhost",
    "X-Title": "FlowBoard",
  },
});

async function testImageChat() {
  try {
    console.log('Testing OpenRouter API with image and forcing tool call...');
    console.log('API Key present:', !!process.env.OPENAI_API_KEY);
    
    // Create a simple test image (1x1 red pixel PNG as base64)
    const testImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    
    const stream = await openai.chat.completions.create({
      model: "nvidia/nemotron-nano-12b-v2-vl:free",
      messages: [
        { 
          role: "system", 
          content: `You are FlowBoard AI, a premium intelligent workspace assistant.
          You have tools to interact with the workspace. 
          
          ALWAYS use the create_task tool when the user asks you to create a task, even if the image is blank or unclear. 
          If you can't see anything in the image, create a task with a placeholder title like "Review uploaded image" and describe what you see (or don't see).`
        },
        { 
          role: "user", 
          content: [
            { type: "image_url", image_url: { url: testImageBase64 } },
            { type: "text", text: "Create a task for this image" }
          ]
        }
      ],
      stream: true,
      tools: [
        {
          type: "function",
          function: {
            name: "create_task",
            description: "Create a new task in the workspace.",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "The task title" },
                description: { type: "string", description: "Detailed task description" },
                priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"], description: "Urgency level" },
                dueDate: { type: "string", description: "Deadline in any standard format" },
                assignee: { type: "string", description: "Name or email of the person to assign" },
              },
              required: ["title"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "create_task" } },
    });

    let fullResponse = "";
    let toolCallName = "";
    let toolCallArguments = "";
    let hasToolCall = false;

    for await (const chunk of stream) {
      const choice = chunk.choices?.[0];
      if (!choice) continue;

      const delta = choice.delta;
      const content = delta?.content || "";
      if (content) {
        fullResponse += content;
        process.stdout.write(content);
      }

      // Handle tool calls
      const toolCalls = delta?.tool_calls;
      if (toolCalls && toolCalls.length > 0) {
        hasToolCall = true;
        const toolCall = toolCalls[0];
        if (toolCall.function?.name) {
          toolCallName = toolCall.function.name;
        }
        if (toolCall.function?.arguments) {
          toolCallArguments += toolCall.function.arguments;
        }
      }
    }

    console.log('\n\n--- Full Response ---');
    console.log(fullResponse);
    
    if (hasToolCall && toolCallName) {
      console.log('\n--- Tool Call Detected ---');
      console.log('Tool Name:', toolCallName);
      console.log('Raw Arguments:', toolCallArguments);
      
      // Try to parse the JSON
      try {
        const args = JSON.parse(toolCallArguments);
        console.log('✓ Parsed Args:', args);
      } catch (e) {
        console.log('✗ JSON Parse Error:', e.message);
        // Try regex extraction
        const match = toolCallArguments.match(/\{[\s\S]*\}/);
        if (match) {
          console.log('Trying regex extraction...');
          try {
            const args = JSON.parse(match[0]);
            console.log('✓ Extracted Parsed Args:', args);
          } catch (e2) {
            console.log('✗ Also failed to extract JSON:', e2.message);
          }
        }
      }
    } else {
      console.log('\n✗ No tool call was made');
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testImageChat();
