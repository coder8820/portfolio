"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/data/content";
import TerminalWindow from "./TerminalWindow";
import { ArrowDown, FileDown } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

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
          <motion.div
            className="lg:col-span-3"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
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
          </motion.div>

          <motion.div
            className="lg:col-span-2 space-y-5"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {/* Profile Picture Card */}
            <div className="panel rounded-md overflow-hidden">
              <div className="panel-header flex items-center gap-2 px-4 py-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
                <span className="ml-3 text-[11px] font-mono text-muted tracking-wide">
                  analyst@soc:~
                </span>
                <div className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-accent">
                  <span className="crt-dot inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  ONLINE
                </div>
              </div>
              <div className="flex flex-col items-center p-6 sm:p-8">
                {/* Profile Image with Glow Ring */}
                <div className="profile-ring relative">
                  <div className="profile-ring-glow" />
                  <Image
                    src="/mypic.jpg"
                    alt="Kumail Abbas — SOC Analyst"
                    width={240}
                    height={240}
                    className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover border-2 border-accent/30"
                    priority
                  />
                </div>

                {/* Name + Role */}
                <div className="mt-5 text-center">
                  <h2 className="font-mono text-lg sm:text-xl font-bold text-text">
                    {profile.name}
                  </h2>
                  <p className="font-mono text-sm text-accent mt-1">
                    {profile.role}
                  </p>
                </div>

                {/* Status Tags */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="font-mono text-[10px] px-2.5 py-1 rounded-sm border border-accent/40 bg-accent/10 text-accent">
                    OPEN TO WORK
                  </span>
                  <span className="font-mono text-[10px] px-2.5 py-1 rounded-sm border border-blue/40 bg-blue/10 text-blue">
                    {profile.location}
                  </span>
                </div>

                {/* Social Links */}
                <div className="mt-5 flex items-center gap-3">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-9 h-9 rounded-sm border border-line bg-surface hover:border-accent-dim hover:text-accent text-muted transition-all duration-200"
                    aria-label="GitHub"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-9 h-9 rounded-sm border border-line bg-surface hover:border-accent-dim hover:text-accent text-muted transition-all duration-200"
                    aria-label="LinkedIn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                  </a>
                  <a
                    href={profile.tryhackme}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-9 h-9 rounded-sm border border-line bg-surface hover:border-accent-dim hover:text-accent text-muted transition-all duration-200"
                    aria-label="TryHackMe"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                  </a>
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-center justify-center w-9 h-9 rounded-sm border border-line bg-surface hover:border-accent-dim hover:text-accent text-muted transition-all duration-200"
                    aria-label="Email"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </a>
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
          </motion.div>
        </div>

        <motion.div
          className="mt-14 flex justify-center"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <a
            href="#about"
            aria-label="Scroll to about section"
            className="text-dim hover:text-accent transition-colors animate-bounce"
          >
            <ArrowDown size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
