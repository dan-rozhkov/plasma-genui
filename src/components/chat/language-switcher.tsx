import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isRu = i18n.language?.startsWith("ru");
  const next = isRu ? "en" : "ru";

  return (
    <div className="rounded-lg border bg-background/80 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => i18n.changeLanguage(next)}
        className="flex h-8 items-center px-2.5 text-xs font-medium"
      >
        {next.toUpperCase()}
      </button>
    </div>
  );
}
