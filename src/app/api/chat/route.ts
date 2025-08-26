/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/chat/route.ts

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// CORRECTED: Use the latest recommended model name
const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.GOOGLE_API_KEY || "";

// Helper function to stream the response
async function* streamResponse(stream: AsyncGenerator<any>) {
  for await (const chunk of stream) {
    const chunkText = chunk.text();
    // Use the SSE (Server-Sent Events) format
    yield `data: ${JSON.stringify({ text: chunkText })}\n\n`;
  }
}

export async function POST(req: Request) {
  // Add a check for the API key to provide a clearer error
  if (!API_KEY) {
    return new Response("Google AI API key not found in environment variables.", { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  try {
    const { history, message } = await req.json();

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: history || [],
    });

    const result = await chat.sendMessageStream(message);
    const stream = streamResponse(result.stream);

    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}