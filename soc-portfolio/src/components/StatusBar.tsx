"use client";

import { useEffect, useState } from "react";

export default function StatusBar() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full border-b border-line bg-black/40 backdrop-blur text-[11px] sm:text-xs font-mono">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 flex items-center justify-between gap-4 text-dim">
        <div className="flex items-center gap-2 text-accent">
          <span className="crt-dot w-2 h-2 rounded-full bg-accent inline-block animate-pulse" />
          <span>STATUS: ONLINE</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-muted">
          <span>NODE: soc-portfolio-01</span>
          <span>UPTIME: {time || "--:--:--"}</span>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <span className="text-amber">THREAT LEVEL:</span>
          <span className="text-amber font-semibold">ELEVATED</span>
        </div>
      </div>
    </div>
  );
}
