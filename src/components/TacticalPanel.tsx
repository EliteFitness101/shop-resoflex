import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TacticalPanelProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  status?: string;
  children: ReactNode;
}

export function TacticalPanel({ label, status, children, className, ...rest }: TacticalPanelProps) {
  return (
    <div
      className={cn(
        "glass-panel shadow-panel relative rounded-lg overflow-hidden",
        className,
      )}
      {...rest}
    >
      {(label || status) && (
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gold/10">
          {label && <span className="text-telemetry">{label}</span>}
          {status && (
            <span className="text-telemetry flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-gold animate-pulse" />
              {status}
            </span>
          )}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
