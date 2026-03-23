import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  agentName: string;
  onNewChat: () => void;
}

export function ChatHeader({ agentName, onNewChat }: ChatHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <h1 className="text-lg font-semibold">{agentName}</h1>
      <Button variant="ghost" size="sm" onClick={onNewChat}>
        {t("chat.newChat")}
      </Button>
    </div>
  );
}
