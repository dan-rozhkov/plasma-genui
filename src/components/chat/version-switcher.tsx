import { Button } from "@/components/ui/button";

interface VersionSwitcherProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export function VersionSwitcher({
  current,
  total,
  onPrev,
  onNext,
}: VersionSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border bg-background/80 px-1 py-0.5 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onPrev}
        disabled={current === 0}
      >
        <ChevronLeftIcon />
      </Button>
      <span className="min-w-12 text-center text-sm text-muted-foreground tabular-nums">
        {current + 1} / {total}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onNext}
        disabled={current === total - 1}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
