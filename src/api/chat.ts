import type { ChatMessage } from "@/hooks/use-chat-stream";

const API_URL = import.meta.env.VITE_API_URL as string;

export async function processMessage({
  messages,
  systemPrompt,
  abortController,
}: {
  messages: ChatMessage[];
  systemPrompt: string;
  abortController: AbortController;
}): Promise<Response> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    }),
    signal: abortController.signal,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response;
}
