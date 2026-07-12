"use client";

import { useEffect, useState, useMemo } from "react";
import { profile } from "@/data/content";
import TerminalWindow from "./TerminalWindow";
import ThreatFeed from "./ThreatFeed";
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
      setDone(true);
      return;
    }
    
    const current = LINES[visibleLines];
    const full = `${current.prompt}`;
    
    if (charCount < full.length) {
      const t = setTimeout(() => setCharCount((c) => c + 1), 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines((v) => v + 1);
        setCharCount(0);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [charCount, visibleLines, LINES.length]);

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

          <div className="lg:col-span-2">
            <ThreatFeed />
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
