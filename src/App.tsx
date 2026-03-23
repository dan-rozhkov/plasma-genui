import { useTranslation } from "react-i18next";
import { ChatPage } from "@/components/chat/chat-page";
import { plasmaLibrary, plasmaPromptOptions } from "@/components/genui/library";
import { mockProcessMessage } from "@/mock/stream";
import { processMessage } from "@/api/chat";
import type { ProcessMessageFn } from "@/hooks/use-chat-stream";

const systemPrompt = plasmaLibrary.prompt(plasmaPromptOptions);

const STARTER_PROMPTS = new Set([
  "Show me all components demo",
  "Show product info with tabs",
  "Show a table of team members",
  "Show me a status dashboard",
]);

const combinedProcessMessage: ProcessMessageFn = (params) => {
  const lastUserMessage = [...params.messages]
    .reverse()
    .find((m) => m.role === "user");
  const content = typeof lastUserMessage?.content === "string" ? lastUserMessage.content : "";

  if (STARTER_PROMPTS.has(content)) {
    return mockProcessMessage(params);
  }

  return processMessage({
    ...params,
    systemPrompt,
  });
};

function App() {
  const { t } = useTranslation();

  return (
    <ChatPage
      processMessage={combinedProcessMessage}
      library={plasmaLibrary}
      agentName="Plasma UI Demo"
      welcomeMessage={{
        title: t("welcome.title"),
        description: t("welcome.description"),
      }}
      conversationStarters={[
        { displayText: t("starters.allComponents"), prompt: "Show me all components demo" },
        { displayText: t("starters.productTabs"), prompt: "Show product info with tabs", device: "tablet" },
        { displayText: t("starters.dataTable"), prompt: "Show a table of team members" },
        { displayText: t("starters.dashboard"), prompt: "Show me a status dashboard" },
      ]}
    />
  );
}

export default App;
