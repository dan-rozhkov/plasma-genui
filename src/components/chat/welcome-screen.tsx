import { Button } from "@/components/ui/button";

interface ConversationStarter {
  displayText: string;
  prompt: string;
}

interface WelcomeScreenProps {
  title: string;
  description: string;
  starters: ConversationStarter[];
  onStarterClick: (prompt: string) => void;
}

export function WelcomeScreen({
  title,
  description,
  starters,
  onStarterClick,
}: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {starters.map((starter) => (
          <Button
            key={starter.prompt}
            variant="outline"
            onClick={() => onStarterClick(starter.prompt)}
          >
            {starter.displayText}
          </Button>
        ))}
      </div>
    </div>
  );
}
