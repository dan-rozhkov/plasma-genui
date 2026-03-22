import { FullScreen } from "@openuidev/react-ui";
import { openAIAdapter } from "@openuidev/react-headless";
import type { Message } from "@openuidev/react-headless";
import { plasmaLibrary, plasmaPromptOptions } from "@/components/genui/library";

const systemPrompt = plasmaLibrary.prompt(plasmaPromptOptions);

async function processMessage({
  messages,
  abortController,
}: {
  threadId: string;
  messages: Message[];
  abortController: AbortController;
}): Promise<Response> {
  return fetch(import.meta.env.VITE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      systemPrompt,
    }),
    signal: abortController.signal,
  });
}

function App() {
  return (
    <FullScreen
      processMessage={processMessage}
      streamProtocol={openAIAdapter()}
      componentLibrary={plasmaLibrary}
      agentName="Plasma UI Demo"
      welcomeMessage={{
        title: "Plasma UI Generator",
        description:
          "Generate UI using Plasma Web components from Sber. Type a message or try an example.",
      }}
      conversationStarters={{
        variant: "short",
        options: [
          { displayText: "All components", prompt: "Show me all components demo" },
          { displayText: "Product tabs", prompt: "Show product info with tabs" },
          { displayText: "Data table", prompt: "Show a table of team members" },
          { displayText: "Dashboard", prompt: "Show me a status dashboard" },
        ],
      }}
    />
  );
}

export default App;
