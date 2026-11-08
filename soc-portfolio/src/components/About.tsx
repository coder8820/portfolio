"use client";

import { useState } from "react";
import { profile, aboutStats, homelabNodes, defensePhilosophy } from "@/data/content";
import SectionHeading from "./SectionHeading";
import TerminalWindow from "./TerminalWindow";
import Reveal from "./Reveal";
import {
  ShieldCheck,
  Radar,
  Terminal,
  Activity,
  Server,
  Network,
  Cpu,
  Lock,
  ExternalLink,
  Layers,
  CheckCircle2,
} from "lucide-react";

const focusAreas = [
  {
    icon: Radar,
    title: "SIEM & Detection Engineering",
    description:
      "Authoring custom rules, decoders, and correlation queries across Wazuh, QRadar, and Splunk to detect threats before damage occurs.",
    tools: ["Wazuh 4.x", "IBM QRadar", "Splunk", "Sigma Rules"],
    tag: "DEFENSE CORE",
  },
  {
    icon: Terminal,
    title: "Network Forensics & Packet Hunting",
    description:
      "Dissecting PCAP captures with Wireshark and Zeek to spot beaconing, port scans, DNS exfiltration, and anomalous handshakes.",
    tools: ["Wireshark", "Zeek (Bro)", "TCP/IP", "Nmap"],
    tag: "TRAFFIC ANALYSIS",
  },
  {
    icon: ShieldCheck,
    title: "Host Forensics & Incident Response",
    description:
      "Investigating Windows Event Logs (Sysmon) and Linux audit logs to uncover process ancestry, persistence, and privilege escalation.",
    tools: ["Sysmon", "Windows Events", "Triage", "NIST IR"],
    tag: "ENDPOINT HUNTING",
  },
  {
    icon: Activity,
    title: "Threat Intel & Security Automation",
    description:
      "Developing Python pipelines for phishing header parsing, IOC enrichment via VirusTotal and AlienVault, and triage automation.",
    tools: ["Python 3", "Bash Scripting", "REST APIs", "IOC Parsing"],
    tag: "AUTOMATION",
  },
];

export default function About() {
  const [activeTab, setActiveTab] = useState<"topology" | "principles">("topology");

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <SectionHeading
        eyebrow="~/about"
        title="Analyst Profile & Operations"
        description="Defensive mindset, hands-on detection engineering, and dedicated virtual SOC homelab."
      />

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
        {aboutStats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="panel rounded-md p-4 sm:p-5 relative overflow-hidden group hover-lift h-full flex flex-col justify-between">
              <div className="h-[2px] w-full bg-gradient-to-r from-accent via-accent/60 to-transparent absolute top-0 left-0" />
              <div>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-accent tracking-tight block">
                  {stat.value}
                </span>
                <span className="font-mono text-xs font-semibold text-text mt-1 block">
                  {stat.label}
                </span>
              </div>
              <p className="font-mono text-[10px] sm:text-[11px] text-muted mt-2 border-t border-line/60 pt-2">
                {stat.subtext}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Main Row: Executive Dossier + Core Capabilities */}
      <div className="grid lg:grid-cols-5 gap-8 items-start mb-12">
        {/* Left Col: Dossier Terminal */}
        <Reveal className="lg:col-span-2">
          <TerminalWindow title="analyst_dossier.sh --verbose">
            <dl className="font-mono text-xs divide-y divide-accent/15">
              {/* Callsign */}
              <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] items-start gap-3 py-2.5 px-1.5 rounded-sm hover:bg-accent/5 transition-colors">
                <dt className="flex items-center gap-1.5 text-accent font-semibold tracking-wider text-[11px] uppercase shrink-0">
                  <span className="text-accent/60 text-[9px]">&gt;</span>
                  <span>callsign</span>
                </dt>
                <dd className="text-right sm:text-left text-xs sm:text-sm">
                  <span className="text-text font-bold">{profile.name}</span>
                  <span className="ml-2 text-[10px] text-accent border border-accent/40 bg-accent/10 px-1.5 py-0.2 rounded-xs font-mono font-semibold">
                    ID-8820
                  </span>
                </dd>
              </div>

              {/* Role */}
              <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] items-start gap-3 py-2.5 px-1.5 rounded-sm hover:bg-accent/5 transition-colors">
                <dt className="flex items-center gap-1.5 text-accent font-semibold tracking-wider text-[11px] uppercase shrink-0">
                  <span className="text-accent/60 text-[9px]">&gt;</span>
                  <span>role</span>
                </dt>
                <dd className="text-right sm:text-left">
                  <span className="inline-block px-2 py-0.5 rounded-sm border border-accent/50 bg-accent/15 text-accent font-bold text-xs">
                    {profile.role}
                  </span>
                </dd>
              </div>

              {/* Specialization */}
              <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] items-start gap-3 py-2.5 px-1.5 rounded-sm hover:bg-accent/5 transition-colors">
                <dt className="flex items-center gap-1.5 text-accent font-semibold tracking-wider text-[11px] uppercase shrink-0">
                  <span className="text-accent/60 text-[9px]">&gt;</span>
                  <span>specialization</span>
                </dt>
                <dd className="text-text font-semibold text-right sm:text-left leading-relaxed text-xs">
                  {profile.specialization}
                </dd>
              </div>

              {/* Framework / Methodology */}
              <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] items-start gap-3 py-2.5 px-1.5 rounded-sm hover:bg-accent/5 transition-colors">
                <dt className="flex items-center gap-1.5 text-accent font-semibold tracking-wider text-[11px] uppercase shrink-0">
                  <span className="text-accent/60 text-[9px]">&gt;</span>
                  <span>framework</span>
                </dt>
                <dd className="text-right sm:text-left leading-relaxed text-xs">
                  <span className="text-accent font-bold">MITRE ATT&CK</span>
                  <span className="text-dim mx-1.5">&amp;</span>
                  <span className="text-text font-semibold">NIST IR</span>
                </dd>
              </div>

              {/* Location */}
              <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] items-start gap-3 py-2.5 px-1.5 rounded-sm hover:bg-accent/5 transition-colors">
                <dt className="flex items-center gap-1.5 text-accent font-semibold tracking-wider text-[11px] uppercase shrink-0">
                  <span className="text-accent/60 text-[9px]">&gt;</span>
                  <span>location</span>
                </dt>
                <dd className="text-text text-right sm:text-left text-xs font-semibold flex items-center justify-end sm:justify-start gap-1.5">
                  <span className="text-accent">●</span>
                  <span>{profile.location}</span>
                  <span className="text-muted text-[10px] font-normal">(Remote / Relocate)</span>
                </dd>
              </div>

              {/* Status */}
              <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] items-center gap-3 py-2.5 px-1.5 rounded-sm hover:bg-accent/5 transition-colors">
                <dt className="flex items-center gap-1.5 text-accent font-semibold tracking-wider text-[11px] uppercase shrink-0">
                  <span className="text-accent/60 text-[9px]">&gt;</span>
                  <span>status</span>
                </dt>
                <dd className="text-right sm:text-left">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-accent/50 bg-accent/15 text-accent font-bold text-xs shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                    <span>Open to Work (Tier-1/2 SOC)</span>
                  </span>
                </dd>
              </div>
            </dl>

            {/* Philosophy Box */}
            <div className="mt-5 p-3 rounded-sm bg-surface-light border border-line">
              <div className="flex items-center gap-1.5 text-accent font-mono text-[11px] font-semibold mb-1">
                <Lock size={12} />
                <span>SECURITY PHILOSOPHY</span>
              </div>
              <p className="font-mono text-xs text-muted leading-relaxed">
                &ldquo;Alerts are merely telemetry; actionable context is defense. My focus is engineering detections that isolate genuine adversary signals without overwhelming analysts in noise.&rdquo;
              </p>
            </div>

            {/* Platform Badges */}
            <div className="mt-5 pt-4 border-t border-line flex flex-wrap gap-2">
              <a
                href={profile.tryhackme}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-accent/10 border border-accent/40 font-mono text-xs text-accent hover:bg-accent/20 transition-all"
              >
                <span>TryHackMe Profile</span>
                <ExternalLink size={12} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-blue/10 border border-blue/40 font-mono text-xs text-blue hover:bg-blue/20 transition-all"
              >
                <span>LinkedIn Network</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </TerminalWindow>
        </Reveal>

        {/* Right Col: 4 Defensive Pillars */}
        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
          {focusAreas.map((area, idx) => {
            const Icon = area.icon;
            return (
              <Reveal key={area.title} delay={idx * 0.1}>
                <div className="panel rounded-md p-5 flex flex-col justify-between h-full hover-lift group border border-line hover:border-accent/50 transition-all duration-200">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-sm bg-accent/10 border border-accent-dim/40 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                        <Icon size={18} />
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm border border-line bg-surface-light text-dim">
                        {area.tag}
                      </span>
                    </div>

                    <h3 className="font-semibold text-text font-mono text-sm leading-snug">
                      {area.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted leading-relaxed">
                      {area.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-line/60 flex flex-wrap gap-1.5">
                    {area.tools.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-surface-light border border-line text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Row 2: SOC Homelab & Defense Operations Architecture */}
      <Reveal delay={0.15}>
        <div className="panel rounded-md overflow-hidden border border-line">
          {/* Header Bar with Toggle Tabs */}
          <div className="panel-header px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-surface">
            <div className="flex items-center gap-2">
              <Server size={16} className="text-accent" />
              <span className="font-mono text-xs sm:text-sm font-bold text-text">
                homelab_operations.vlan — SOC Test Environment
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("topology")}
                className={`font-mono text-xs px-3 py-1 rounded-sm border transition-all ${
                  activeTab === "topology"
                    ? "bg-accent/15 border-accent text-accent font-semibold"
                    : "border-line text-muted hover:text-text hover:border-line/80"
                }`}
              >
                Lab Nodes (4)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("principles")}
                className={`font-mono text-xs px-3 py-1 rounded-sm border transition-all ${
                  activeTab === "principles"
                    ? "bg-accent/15 border-accent text-accent font-semibold"
                    : "border-line text-muted hover:text-text hover:border-line/80"
                }`}
              >
                Core Creed (3)
              </button>
            </div>
          </div>

          {/* Tab 1: Homelab Nodes */}
          {activeTab === "topology" && (
            <div className="p-5 sm:p-6">
              <p className="font-mono text-xs text-muted mb-5 leading-relaxed">
                Dedicated virtualized lab environment used for executing controlled adversary emulations (Atomic Red Team), generating authentic enterprise telemetry, and validating custom detection rules prior to deployment.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {homelabNodes.map((node) => (
                  <div
                    key={node.name}
                    className="p-4 rounded-sm bg-surface-light border border-line hover:border-accent/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[9px] text-dim uppercase tracking-wider truncate">
                          {node.category}
                        </span>
                        <span
                          className={`font-mono text-[9px] uppercase tracking-wide px-1.5 py-0.2 rounded-sm border ${node.statusColor}`}
                        >
                          {node.status}
                        </span>
                      </div>

                      <h4 className="font-mono text-xs font-bold text-text leading-tight">
                        {node.name}
                      </h4>

                      <p className="mt-2 text-[11px] text-muted leading-relaxed">
                        {node.role}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-line/60">
                      <span className="font-mono text-[9px] text-dim block uppercase mb-1">
                        Stack
                      </span>
                      <p className="font-mono text-[10px] text-accent/90 truncate">
                        {node.tech}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between text-[11px] font-mono text-dim">
                <span>Network: VLAN 10 (Prod Monitored) · VLAN 20 (Sim Isolated)</span>
                <span className="hidden sm:inline text-accent">● ZERO EXTERNAL LEAKAGE</span>
              </div>
            </div>
          )}

          {/* Tab 2: Core Creed / Defense Principles */}
          {activeTab === "principles" && (
            <div className="p-5 sm:p-6">
              <p className="font-mono text-xs text-muted mb-5 leading-relaxed">
                Guiding operational rules applied across my detection engineering workflows, ticket triaging, and packet-level forensic investigations.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                {defensePhilosophy.map((p, i) => (
                  <div
                    key={p.title}
                    className="p-4 rounded-sm bg-surface-light border border-line flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-accent mb-2">
                        <span className="text-dim">0{i + 1}.</span>
                        <span>{p.title}</span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-line/60 flex items-center gap-1.5 font-mono text-[10px] text-accent">
                      <CheckCircle2 size={12} />
                      <span>OPERATIONAL RULE</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
