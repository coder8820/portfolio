import { threatFeed } from "@/data/content";
import TerminalWindow from "./TerminalWindow";
import { AlertTriangle } from "lucide-react";

const severities = ["critical", "high", "medium", "info"] as const;
const sevColor: Record<(typeof severities)[number], string> = {
  critical: "text-red border-red/40 bg-red/10",
  high: "text-amber border-amber/40 bg-amber/10",
  medium: "text-blue border-blue/40 bg-blue/10",
  info: "text-muted border-line bg-white/5",
};

export default function ThreatFeed() {
  const doubled = [...threatFeed, ...threatFeed];

  return (
    <TerminalWindow title="alert_feed.log — simulated">
      <div className="flex items-center gap-2 mb-4 text-[11px] font-mono text-dim">
        <AlertTriangle size={13} className="text-amber" />
        <span>
          Illustrative data for demo purposes — not a live SOC feed
        </span>
      </div>
      <div className="h-[280px] overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-panel to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-panel to-transparent z-10 pointer-events-none" />
        <div className="ticker-track">
          {doubled.map((line, i) => {
            const sev = severities[i % severities.length];
            return (
              <div
                key={i}
                className="flex items-start gap-2 font-mono text-xs py-2 border-b border-line/60"
              >
                <span
                  className={`shrink-0 px-1.5 py-0.5 rounded-sm border uppercase text-[9px] tracking-wide ${sevColor[sev]}`}
                >
                  {sev}
                </span>
                <span className="text-muted leading-snug">{line}</span>
              </div>
            );
          })}
        </div>
      </div>
    </TerminalWindow>
  );
}
