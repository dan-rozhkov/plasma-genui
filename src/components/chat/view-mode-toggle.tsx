import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type ViewMode = "preview" | "code";

interface ViewModeToggleProps {
  current: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ current, onChange }: ViewModeToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-0.5 rounded-lg border bg-background p-0.5">
      <button
        type="button"
        title={t("viewMode.preview")}
        onClick={() => onChange("preview")}
        className={cn(
          "rounded-md px-2 py-1.5",
          current === "preview"
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground",
        )}
      >
        <EyeIcon />
      </button>
      <button
        type="button"
        title={t("viewMode.code")}
        onClick={() => onChange("code")}
        className={cn(
          "rounded-md px-2 py-1.5",
          current === "code"
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground",
        )}
      >
        <CodeIcon />
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
