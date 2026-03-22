import { useMemo, useState, useCallback } from "react";
import type { Library } from "@openuidev/react-lang";
import { useChatStream, type ProcessMessageFn } from "@/hooks/use-chat-stream";
import { WelcomeScreen } from "./welcome-screen";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { VersionSwitcher } from "./version-switcher";
import { ThemeToggle } from "./theme-toggle";
import { DeviceSwitcher, DEVICE_WIDTHS, type DevicePreset } from "./device-switcher";
import { ViewModeToggle, type ViewMode } from "./view-mode-toggle";
import { cn } from "@/lib/utils";

interface ConversationStarter {
  displayText: string;
  prompt: string;
}

interface ChatPageProps {
  processMessage: ProcessMessageFn;
  library: Library;
  agentName: string;
  welcomeMessage: { title: string; description: string };
  conversationStarters: ConversationStarter[];
}

export function ChatPage({
  processMessage,
  library,
  welcomeMessage,
  conversationStarters,
}: ChatPageProps) {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    stop,
    isStreaming,
  } = useChatStream({ processMessage });

  const assistantMessages = useMemo(
    () => messages.filter((m) => m.role === "assistant"),
    [messages],
  );

  const total = assistantMessages.length;
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [darkMode, setDarkMode] = useState(false);
  const [device, setDevice] = useState<DevicePreset>("desktop");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const previewWidth = DEVICE_WIDTHS[device];

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  // -1 means "follow latest"; explicit selection sticks until new message arrives
  const currentIndex = selectedIndex === -1 || selectedIndex >= total
    ? total - 1
    : selectedIndex;
  const currentMessage = assistantMessages[currentIndex];

  return (
    <div className={cn("relative h-screen text-foreground", darkMode ? "dark bg-neutral-900" : "bg-neutral-100")}>
      {total === 0 ? (
        <div className="flex h-full flex-col items-center justify-center">
          <WelcomeScreen
            title={welcomeMessage.title}
            description={welcomeMessage.description}
            starters={conversationStarters}
            onStarterClick={(prompt) => sendMessage(prompt)}
          />
          <div className="w-full max-w-2xl px-4 pb-8">
            <div className="rounded-xl border bg-background p-2">
              <ChatInput
                input={input}
                setInput={setInput}
                onSend={() => sendMessage()}
                onStop={stop}
                isStreaming={isStreaming}
                large
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            {total > 1 && (
              <VersionSwitcher
                current={currentIndex}
                total={total}
                onPrev={() => setSelectedIndex(Math.max(0, currentIndex - 1))}
                onNext={() => setSelectedIndex(currentIndex + 1 >= total - 1 ? -1 : currentIndex + 1)}
              />
            )}
            <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
          </div>
          <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            <ViewModeToggle current={viewMode} onChange={setViewMode} />
            <DeviceSwitcher current={device} onChange={setDevice} />
          </div>
          <div className="h-full overflow-y-auto pb-32">
            {currentMessage && (
              <MessageBubble
                key={currentMessage.id}
                message={currentMessage}
                library={library}
                isStreaming={isStreaming}
                isLastMessage={currentIndex === total - 1}
                onSendMessage={(text) => sendMessage(text)}
                darkMode={darkMode}
                previewWidth={previewWidth}
                viewMode={viewMode}
              />
            )}
          </div>
          <div className={cn("pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-4", darkMode && "dark")}>
            <div className="pointer-events-auto w-full max-w-2xl px-4">
              <div className="rounded-xl border bg-background p-2">
                <ChatInput
                  input={input}
                  setInput={setInput}
                  onSend={() => sendMessage()}
                  onStop={stop}
                  isStreaming={isStreaming}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
