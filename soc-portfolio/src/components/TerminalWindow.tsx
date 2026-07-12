import { ReactNode } from "react";

export default function TerminalWindow({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`panel rounded-md overflow-hidden ${className}`}>
      <div className="panel-header flex items-center gap-2 px-4 py-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
        <span className="ml-3 text-[11px] font-mono text-muted tracking-wide">
          {title}
        </span>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
