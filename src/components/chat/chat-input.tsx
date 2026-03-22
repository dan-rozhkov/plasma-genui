import { useRef, useEffect, type KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  isStreaming: boolean;
  large?: boolean;
  darkMode?: boolean;
}

export function ChatInput({
  input,
  setInput,
  onSend,
  onStop,
  isStreaming,
  large,
  darkMode,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) onSend();
    }
  };

  return (
    <div>
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={large ? 2 : 1}
          className={cn("resize-none border-0 shadow-none focus-visible:ring-0 text-lg", large ? "min-h-14 max-h-48" : "min-h-10 max-h-40", darkMode && "bg-transparent")}
        />
        {isStreaming ? (
          <Button
            size="icon"
            variant="outline"
            onClick={onStop}
            className="shrink-0 rounded-full"
          >
            <StopIcon />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={onSend}
            disabled={!input.trim()}
            className="shrink-0 rounded-full"
          >
            <SendIcon />
          </Button>
        )}
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-4 w-4")}
    >
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  );
}
