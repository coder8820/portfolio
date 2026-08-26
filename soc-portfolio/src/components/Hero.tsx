"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { profile } from "@/data/content";
import TerminalWindow from "./TerminalWindow";
import { ArrowDown, FileDown } from "lucide-react";

export default function Hero() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [done, setDone] = useState(false);

  const LINES = useMemo(() => [
    { prompt: "whoami", output: profile.name },
    { prompt: "cat role.txt", output: profile.role },
    { prompt: "cat mission.txt", output: profile.tagline },
  ], []);

  useEffect(() => {
    if (visibleLines >= LINES.length) {
      const timer = window.setTimeout(() => setDone(true), 0);
      return () => window.clearTimeout(timer);
    }

    const current = LINES[visibleLines];
    const full = `${current.prompt}`;

    if (charCount < full.length) {
      const t = window.setTimeout(() => setCharCount((c) => c + 1), 28);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      setVisibleLines((v) => v + 1);
      setCharCount(0);
    }, 350);
    return () => window.clearTimeout(t);
  }, [charCount, visibleLines, LINES]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-fade" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 relative">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <TerminalWindow title="session — boot.sh">
              <div className="font-mono text-sm sm:text-base leading-relaxed min-h-[220px]">
                {LINES.slice(0, visibleLines + (charCount > 0 ? 1 : 0)).map(
                  (line, i) => {
                    const isCurrent = i === visibleLines;
                    const promptText = isCurrent
                      ? line.prompt.slice(0, charCount)
                      : line.prompt;
                    const showOutput = !isCurrent || charCount >= line.prompt.length;
                    return (
                      <div key={i} className="mb-3">
                        <div className="flex items-center gap-2 text-muted">
                          <span className="text-accent">┌──</span>
                          <span className="text-blue">analyst@soc</span>
                          <span className="text-dim">:</span>
                          <span className="text-accent">~$</span>
                          <span className="text-text">
                            {promptText}
                            {isCurrent && !done && (
                              <span className="blink-cursor" />
                            )}
                          </span>
                        </div>
                        {showOutput && (
                          <div className="pl-4 mt-1 text-accent">
                            {i === 0 && (
                              <span className="text-lg sm:text-xl font-bold">
                                {line.output}
                              </span>
                            )}
                            {i !== 0 && <span>{line.output}</span>}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
                {done && (
                  <div className="flex items-center gap-2 text-muted">
                    <span className="text-accent">┌──</span>
                    <span className="text-blue">analyst@soc</span>
                    <span className="text-dim">:</span>
                    <span className="text-accent">~$</span>
                    <span className="blink-cursor" />
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-line">
                <a
                  href={profile.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-sm bg-accent text-[#06120c] px-4 py-2 text-sm font-semibold hover:bg-accent/90 transition-colors"
                >
                  <FileDown size={16} />
                  Download CV
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-sm border border-line px-4 py-2 text-sm font-mono text-muted hover:text-accent hover:border-accent-dim transition-colors"
                >
                  ./view-projects
                </a>
              </div>
            </TerminalWindow>

            <p className="mt-6 max-w-xl text-sm sm:text-base text-muted leading-relaxed">
              {profile.summary}
            </p>
          </div>

          <div className="lg:col-span-2 space-y-5">
            {/* Live Monitoring Feed */}
            <div className="panel rounded-md overflow-hidden">
              <div className="panel-header flex items-center gap-2 px-4 py-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
                <span className="ml-3 text-[11px] font-mono text-muted tracking-wide">
                  live_monitoring.view
                </span>
                <div className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-accent">
                  <span className="crt-dot inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  LIVE
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/monitoring-image.gif"
                  alt="SOC analyst monitoring multiple screens"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 px-4 pb-3 flex items-center justify-between font-mono text-[10px] text-dim pointer-events-none">
                  <span>NODE: soc-dashboard-01</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Threat Level Card */}
            <div className="panel rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] text-dim uppercase tracking-wider">
                  Threat Assessment
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm border border-amber/40 bg-amber/10 text-amber">
                  ELEVATED
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Network", status: "Monitored", color: "text-accent" },
                  { label: "Endpoints", status: "Protected", color: "text-accent" },
                  { label: "SIEM", status: "Active", color: "text-blue" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between font-mono text-xs">
                    <span className="text-muted">{item.label}</span>
                    <span className={item.color}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex justify-center">
          <a
            href="#about"
            aria-label="Scroll to about section"
            className="text-dim hover:text-accent transition-colors animate-bounce"
          >
            <ArrowDown size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
