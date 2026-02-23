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

async function testChat() {
  try {
    console.log('Testing OpenRouter API...');
    console.log('API Key present:', !!process.env.OPENAI_API_KEY);
    
    const stream = await openai.chat.completions.create({
      model: "nvidia/nemotron-nano-12b-v2-vl:free",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello, say hi!" }
      ],
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
      console.log('Chunk:', content);
    }
    console.log('\nFull response:', fullResponse);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testChat();
