import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { Library } from "@openuidev/react-lang";
import { useChatStream, type ProcessMessageFn } from "@/hooks/use-chat-stream";
import type { ConversationStarter } from "./welcome-screen";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { Button } from "@/components/ui/button";
import { VersionSwitcher } from "./version-switcher";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { DeviceSwitcher, DEVICE_WIDTHS, type DevicePreset } from "./device-switcher";
import { ViewModeToggle, type ViewMode } from "./view-mode-toggle";
import { cn } from "@/lib/utils";

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
    setMessages,
    input,
    setInput,
    sendMessage,
    stop,
    isStreaming,
  } = useChatStream({ processMessage });

  const { t } = useTranslation();

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

  const goHome = useCallback(() => {
    stop();
    setMessages([]);
    setInput("");
    setSelectedIndex(-1);
    setDevice("desktop");
    setDarkMode(false);
    setViewMode("preview");
  }, [stop, setMessages, setInput]);

  // -1 means "follow latest"; explicit selection sticks until new message arrives
  const currentIndex = selectedIndex === -1 || selectedIndex >= total
    ? total - 1
    : selectedIndex;
  const currentMessage = assistantMessages[currentIndex];

  return (
    <div className={cn("relative h-screen text-foreground", darkMode ? "dark bg-neutral-900" : "bg-neutral-100")}>
      {total === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-4">
          <div className="absolute top-3 right-3 z-10">
            <LanguageSwitcher />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight">{welcomeMessage.title}</h2>
            <p className="mt-2 text-muted-foreground">{welcomeMessage.description}</p>
          </div>
          <div className="w-full max-w-2xl">
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
          <div className="flex flex-wrap justify-center gap-2">
            {conversationStarters.map((starter) => (
              <Button
                key={starter.prompt}
                variant="outline"
                onClick={() => {
                  if (starter.device) setDevice(starter.device as DevicePreset);
                  sendMessage(starter.prompt);
                }}
              >
                {starter.displayText}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-3 left-3 z-10 rounded-lg border bg-background/80 backdrop-blur-sm">
            <Button variant="ghost" size="sm" onClick={goHome} className="h-8 gap-1.5 px-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m15 18-6-6 6-6"/></svg>
              {t("chat.home")}
            </Button>
          </div>
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            {total > 1 && (
              <VersionSwitcher
                current={currentIndex}
                total={total}
                onPrev={() => setSelectedIndex(Math.max(0, currentIndex - 1))}
                onNext={() => setSelectedIndex(currentIndex + 1 >= total - 1 ? -1 : currentIndex + 1)}
              />
            )}
            <LanguageSwitcher />
          </div>
          <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            <ViewModeToggle current={viewMode} onChange={setViewMode} />
            <DeviceSwitcher current={device} onChange={setDevice} />
            <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
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
          <div className={cn("pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-4", darkMode && "dark")}>
            <div className="pointer-events-auto w-full max-w-2xl px-4">
              <div className="rounded-xl border bg-background p-2 shadow-[0_4px_30px_rgba(0,0,0,0.08)]">
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
