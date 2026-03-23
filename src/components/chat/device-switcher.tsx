import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type DevicePreset = "mobile" | "tablet" | "desktop";

interface DeviceSwitcherProps {
  current: DevicePreset;
  onChange: (device: DevicePreset) => void;
}

export const DEVICE_WIDTHS: Record<DevicePreset, string> = {
  mobile: "375px",
  tablet: "768px",
  desktop: "100%",
};

export function DeviceSwitcher({ current, onChange }: DeviceSwitcherProps) {
  const { t } = useTranslation();

  const devices: { key: DevicePreset; label: string; icon: ReactNode }[] = [
    { key: "mobile", label: t("device.mobile"), icon: <SmartphoneIcon /> },
    { key: "tablet", label: t("device.tablet"), icon: <TabletIcon /> },
    { key: "desktop", label: t("device.desktop"), icon: <MonitorIcon /> },
  ];
  return (
    <div className="flex items-center gap-0.5 rounded-lg border bg-background p-0.5">
      {devices.map(({ key, label, icon }) => (
        <button
          key={key}
          type="button"
          title={label}
          onClick={() => onChange(key)}
          className={cn(
            "rounded-md px-2 py-1.5",
            current === key
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground",
          )}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

function SmartphoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function TabletIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}
