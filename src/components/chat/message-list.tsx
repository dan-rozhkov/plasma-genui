import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/hooks/use-chat-stream";
import type { Library } from "@openuidev/react-lang";
import { MessageBubble } from "./message-bubble";
import type { ViewMode } from "./view-mode-toggle";

interface MessageListProps {
  messages: ChatMessage[];
  library: Library;
  isStreaming: boolean;
  onSendMessage: (text: string) => void;
  viewMode: ViewMode;
}

export function MessageList({
  messages,
  library,
  isStreaming,
  onSendMessage,
  viewMode,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex w-full flex-col gap-4 py-6 pb-32">
      {messages.filter((msg) => msg.role === "assistant").map((msg, i, arr) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          library={library}
          isStreaming={isStreaming}
          isLastMessage={i === arr.length - 1}
          onSendMessage={onSendMessage}
          previewWidth="100%"
          viewMode={viewMode}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
