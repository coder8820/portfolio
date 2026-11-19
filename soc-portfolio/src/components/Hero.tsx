"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/content";
import TerminalWindow from "./TerminalWindow";
import HackerAvatar from "./HackerAvatar";
import {
  ArrowDown,
  FileDown,
  ShieldCheck,
  Radar,
  Radio,
  ExternalLink,
  Terminal,
} from "lucide-react";

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

  const LINES = useMemo(
    () => [
      { prompt: "whoami", output: `${profile.name} // ${profile.role}` },
      {
        prompt: "cat specialization.log",
        output: "SOC Operations · SIEM Detection Engineering · Network Packet Forensics",
      },
      { prompt: "cat mission.sig", output: profile.tagline },
    ],
    []
  );

  useEffect(() => {
    if (visibleLines >= LINES.length) {
      const timer = window.setTimeout(() => setDone(true), 0);
      return () => window.clearTimeout(timer);
    }

    const current = LINES[visibleLines];
    const full = `${current.prompt}`;

    if (charCount < full.length) {
      const t = window.setTimeout(() => setCharCount((c) => c + 1), 26);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      setVisibleLines((v) => v + 1);
      setCharCount(0);
    }, 320);
    return () => window.clearTimeout(t);
  }, [charCount, visibleLines, LINES]);

  return (
    <section className="relative overflow-hidden">
      {/* Cyber Background Engine: Holographic Threat Telemetry Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-40 mix-blend-screen"
          style={{
            backgroundImage: "url('/cyber-threat-mesh.jpg')",
            maskImage: "radial-gradient(ellipse 85% 75% at 50% 30%, black 30%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 30%, black 30%, transparent 85%)",
          }}
        />
        <div className="absolute inset-0 grid-fade" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 relative">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left Column: Command Center Terminal & Core Profile Dossier */}
          <motion.div
            className="lg:col-span-3"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {/* Top Operational Pill Bar */}
            <div className="flex flex-wrap items-center gap-2 mb-3 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-accent/40 bg-accent/10 text-accent font-semibold tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                DEFENSE CLEARANCE: TIER-1/2
              </span>
              <span className="px-2.5 py-1 rounded-sm border border-line bg-surface text-muted">
                {profile.location}
              </span>
            </div>

            <TerminalWindow title="session — analyst_init.sh" className="panel-glass">
              <div className="font-mono text-sm sm:text-base leading-relaxed min-h-[200px]">
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
                          <span className="text-blue">analyst@soc-core</span>
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
                              <span className="text-lg sm:text-xl font-bold tracking-tight">
                                {line.output}
                              </span>
                            )}
                            {i !== 0 && (
                              <span className="text-xs sm:text-sm text-text/90">
                                {line.output}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
                {done && (
                  <div className="flex items-center gap-2 text-muted">
                    <span className="text-accent">┌──</span>
                    <span className="text-blue">analyst@soc-core</span>
                    <span className="text-dim">:</span>
                    <span className="text-accent">~$</span>
                    <span className="blink-cursor" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-line/60">
                <a
                  href={profile.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-sm bg-accent text-[#06120c] px-4 py-2 text-xs sm:text-sm font-mono font-bold hover:bg-accent/90 shadow-[0_0_15px_rgba(57,255,140,0.25)] transition-all cursor-pointer"
                >
                  <FileDown size={15} />
                  Download CV [PDF]
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-sm border border-accent/40 bg-accent/10 px-4 py-2 text-xs sm:text-sm font-mono text-accent hover:border-accent hover:bg-accent/20 transition-colors"
                >
                  <Radar size={15} />
                  ./explore-services
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-sm border border-line px-3.5 py-2 text-xs sm:text-sm font-mono text-muted hover:text-accent hover:border-accent-dim transition-colors"
                >
                  <Terminal size={15} />
                  ./view-projects
                </a>
              </div>
            </TerminalWindow>

            {/* Quick KPI Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
              {[
                { label: "Rules & Decoders", value: "100+", hint: "Wazuh & Sigma" },
                { label: "Triage SLA", value: "<30s", hint: "90% Acceleration" },
                { label: "Probes Captured", value: "14k+", hint: "Live Telemetry" },
                { label: "ATT&CK Mapped", value: "100%", hint: "MITRE Matrix" },
              ].map((kpi, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-sm border border-line/70 bg-surface-light hover:border-accent/40 transition-colors"
                >
                  <span className="font-mono text-lg sm:text-xl font-bold text-accent block">
                    {kpi.value}
                  </span>
                  <span className="font-mono text-[10px] text-text font-semibold block leading-tight">
                    {kpi.label}
                  </span>
                  <span className="font-mono text-[9px] text-dim block mt-0.5">
                    {kpi.hint}
                  </span>
                </div>
              ))}
            </div>

            {/* Professional Summary */}
            <p className="mt-5 max-w-xl text-xs sm:text-sm text-muted leading-relaxed">
              {profile.summary}
            </p>
          </motion.div>

          {/* Right Column: Professional Profile Dossier Card & Live Telemetry HUD */}
          <motion.div
            className="lg:col-span-2 space-y-5"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {/* Primary Profile Card */}
            <div className="panel panel-glass rounded-md overflow-hidden border border-line/80 hover:border-accent/40 transition-all duration-300 shadow-xl">
              {/* Window Bar */}
              <div className="panel-header flex items-center justify-between px-4 py-2.5 border-b border-line/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent/80" />
                  <span className="ml-2 text-[10px] font-mono text-dim tracking-wider">
                    SEC-ID // KM-8820
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-accent font-semibold">
                  <span className="crt-dot inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  DEPLOYABLE
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col items-center p-6 sm:p-7 text-center">
                {/* 3D Interactive Cyber Avatar */}
                <HackerAvatar
                  primarySrc="/mypic.jpg"
                  secondarySrc="/mypic2.png"
                  name={`${profile.name} — ${profile.role}`}
                />

                {/* Verified Blue Team Badge */}
                <div className="mt-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-accent/40 bg-accent/10 text-accent font-mono text-[10px] font-semibold tracking-wide">
                  <ShieldCheck size={12} className="text-accent" />
                  <span>VERIFIED SOC PRACTITIONER</span>
                </div>

                {/* Name & Handle */}
                <div className="mt-3">
                  <h2 className="font-mono text-xl sm:text-2xl font-bold text-text tracking-tight">
                    {profile.name}
                  </h2>
                  <p className="font-mono text-xs text-dim mt-0.5">
                    {profile.handle}
                  </p>
                </div>

                {/* Role Pill */}
                <div className="mt-2.5 inline-block font-mono text-xs text-accent font-semibold px-3 py-1 rounded-sm border border-accent/30 bg-accent/5">
                  {profile.role}
                </div>

                {/* Specialty Chips */}
                <div className="mt-3.5 flex flex-wrap justify-center gap-1.5">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-xs border border-line bg-surface text-muted">
                    SIEM (Wazuh &amp; QRadar)
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-xs border border-line bg-surface text-muted">
                    Threat Hunting (Sysmon)
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-xs border border-line bg-surface text-muted">
                    Packet Forensics (Wireshark)
                  </span>
                </div>

                {/* Availability Callout */}
                <div className="mt-4 w-full p-2.5 rounded-sm border border-accent/25 bg-accent/5 flex items-center justify-center gap-2 text-[11px] font-mono text-accent">
                  <Radio size={12} className="text-accent animate-pulse" />
                  <span>Available for Full-time Roles &amp; Consulting</span>
                </div>

                {/* Direct Action Button */}
                <a
                  href="#contact"
                  className="mt-4 w-full text-center py-2 px-4 rounded-sm bg-accent text-[#06120c] font-mono font-bold text-xs hover:bg-accent/90 shadow-[0_0_12px_rgba(57,255,140,0.2)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Engage Analyst / Hire</span>
                  <ExternalLink size={12} />
                </a>

                {/* Social Links */}
                <div className="mt-4 flex items-center gap-2.5">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-8 h-8 rounded-sm border border-line bg-surface hover:border-accent hover:text-accent text-muted transition-all duration-200"
                    title="GitHub: coder8820"
                    aria-label="GitHub Profile"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-8 h-8 rounded-sm border border-line bg-surface hover:border-accent hover:text-accent text-muted transition-all duration-200"
                    title="LinkedIn: Kumail Abbas"
                    aria-label="LinkedIn Profile"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                  </a>
                  <a
                    href={profile.tryhackme}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-8 h-8 rounded-sm border border-line bg-surface hover:border-accent hover:text-accent text-muted transition-all duration-200"
                    title="TryHackMe: kumailAbbass"
                    aria-label="TryHackMe Profile"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                  </a>
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-center justify-center w-8 h-8 rounded-sm border border-line bg-surface hover:border-accent hover:text-accent text-muted transition-all duration-200"
                    title="Email: coder8820@gmail.com"
                    aria-label="Email"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Operational Telemetry HUD Card */}
            <div className="panel panel-glass rounded-md p-4 border border-line/70">
              <div className="flex items-center justify-between mb-3 border-b border-line/50 pb-2">
                <span className="font-mono text-[10px] text-dim uppercase tracking-wider font-semibold">
                  ACTIVE SENSOR TELEMETRY
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm border border-accent/40 bg-accent/10 text-accent font-semibold">
                  DEFCON 4 // NORMAL
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "SIEM Correlator", status: "Wazuh 4.x Ingesting", color: "text-accent" },
                  { label: "Packet Sensor", status: "Suricata & Zeek Online", color: "text-accent" },
                  { label: "Triage Queue", status: "0 Pending / 100% SLA", color: "text-blue" },
                  { label: "Framework", status: "MITRE ATT&CK v14 Mapped", color: "text-accent" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between font-mono text-xs">
                    <span className="text-muted text-[11px]">{item.label}</span>
                    <span className={`${item.color} font-medium text-[11px]`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
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
