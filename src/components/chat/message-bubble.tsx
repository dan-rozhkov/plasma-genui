import { Renderer } from "@openuidev/react-lang";
import type { ActionEvent } from "@openuidev/react-lang";
import { BuiltinActionType } from "@openuidev/react-lang";
import type { Library } from "@openuidev/react-lang";
import type { ChatMessage } from "@/hooks/use-chat-stream";
import { cn } from "@/lib/utils";
import { PreviewFrame } from "./preview-frame";
import type { ViewMode } from "./view-mode-toggle";

interface MessageBubbleProps {
  message: ChatMessage;
  library: Library;
  isStreaming: boolean;
  isLastMessage: boolean;
  onSendMessage: (text: string) => void;
  darkMode?: boolean;
  previewWidth: string;
  viewMode: ViewMode;
}

export function MessageBubble({
  message,
  library,
  isStreaming,
  isLastMessage,
  onSendMessage,
  darkMode,
  previewWidth,
  viewMode,
}: MessageBubbleProps) {
  const handleAction = (event: ActionEvent) => {
    if (event.type === BuiltinActionType.ContinueConversation) {
      onSendMessage(event.humanFriendlyMessage);
    } else if (event.type === BuiltinActionType.OpenUrl) {
      window.open(event.params.url, "_blank", "noopener,noreferrer");
    }
  };

  const streaming = isStreaming && isLastMessage;

  if (viewMode === "code") {
    return (
      <div className="mx-auto h-full pt-14" style={{ width: previewWidth, maxWidth: "100%" }}>
        <pre className={cn(
          "h-full overflow-auto rounded-xl whitespace-pre-wrap break-words p-6 font-mono text-sm leading-relaxed",
          darkMode ? "bg-neutral-900 text-neutral-200" : "bg-neutral-50 text-neutral-800",
        )}>
          <code>{message.content || ""}</code>
        </pre>
      </div>
    );
  }

  return (
    <PreviewFrame width={previewWidth} darkMode={darkMode ?? false} glowing={streaming}>
      <div className="w-full min-w-0 p-8">
        <Renderer
          response={message.content}
          library={library}
          isStreaming={streaming}
          onAction={handleAction}
        />
      </div>
    </PreviewFrame>
  );
}
