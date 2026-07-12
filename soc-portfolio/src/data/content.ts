// ─────────────────────────────────────────────────────────────
// SITE CONTENT — edit everything about the portfolio from here.
// Replace placeholder values (name, email, links) with your own.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Kumail Abbas",
  handle: "@yourhandle",
  role: "SOC Analyst / Blue Team",
  tagline:
    "Monitoring, detecting, and responding to threats — one log line at a time.",
  location: "Pakistan",
  email: "coder8820@gmail.com",
  github: "https://github.com/coder8820",
  linkedin: "https://www.linkedin.com/in/kumail-abbas-security/",
  tryhackme: "https://tryhackme.com/p/kumailAbbass?vccr=1",
  resumeUrl: "/resume.pdf", // drop your CV at public/resume.pdf
  summary:
    "Blue team–focused security analyst with hands-on experience building and tuning SIEM detections, hunting through logs, and analyzing network traffic. Comfortable across Wazuh, QRadar, Splunk, and packet-level tools — I like turning noisy data into clear, actionable alerts.",
};

export type Severity = "critical" | "high" | "medium" | "info";

export type Project = {
  id: string;
  title: string;
  severityLabel: Severity;
  status: "Deployed" | "In Progress" | "Completed";
  summary: string;
  problem: string;
  approach: string;
  tools: string[];
  outcome: string;
  link?: string;
};

export const projects: Project[] = [
  {
    id: "PRJ-001",
    title: "AI-Powered Phishing Email Analyzer",
    severityLabel: "high",
    status: "Completed",
    summary:
      "A tool that parses raw email headers and body content to flag phishing indicators using NLP-based classification.",
    problem:
      "Manual phishing triage is slow and inconsistent — analysts need a fast first-pass verdict before deep investigation.",
    approach:
      "Built a Python pipeline that extracts headers, URLs, and sender reputation signals, then scores each email with a lightweight ML/NLP model trained on phishing vs. legitimate samples.",
    tools: ["Python", "NLP", "Email headers (SPF/DKIM/DMARC)", "Flask"],
    outcome:
      "Reduced manual triage time per email from ~5 minutes to under 30 seconds, with a clear risk score analysts can act on.",
  },
  {
    id: "PRJ-002",
    title: "Honeypot Attack Dashboard",
    severityLabel: "high",
    status: "Deployed",
    summary:
      "A live dashboard visualizing attacker behavior captured from a deployed honeypot — source IPs, ports probed, and payloads.",
    problem:
      "Raw honeypot logs are hard to interpret in real time and easy to miss patterns in.",
    approach:
      "Deployed a honeypot to capture live attack traffic, then built a dashboard to visualize attacker geolocation, targeted ports/services, and repeated attack patterns over time.",
    tools: ["Honeypot (Cowrie/T-Pot)", "Python", "Dashboarding", "GeoIP"],
    outcome:
      "Surfaced recurring scan patterns and top attacker source regions, useful for building proactive detection rules.",
  },
  {
    id: "PRJ-003",
    title: "SIEM Detection Engineering — Wazuh & IBM QRadar",
    severityLabel: "critical",
    status: "Completed",
    summary:
      "Configured and tuned SIEM rules and dashboards across two platforms to detect suspicious activity with fewer false positives.",
    problem:
      "Out-of-the-box SIEM rules generate excessive noise, burying real threats in alert fatigue.",
    approach:
      "Deployed Wazuh agents across test endpoints, wrote custom detection rules and decoders, and built correlation searches and offenses in IBM QRadar for cross-referenced threat detection.",
    tools: ["Wazuh", "IBM QRadar", "Log correlation", "Custom detection rules"],
    outcome:
      "Built a working detection pipeline covering brute-force attempts, privilege escalation, and file integrity violations.",
  },
  {
    id: "PRJ-004",
    title: "Network Monitoring Labs — Wireshark & Nmap",
    severityLabel: "medium",
    status: "Completed",
    summary:
      "A series of hands-on labs analyzing live and captured network traffic to identify scanning, enumeration, and anomalous behavior.",
    problem:
      "Understanding attacker reconnaissance requires seeing it at the packet level, not just the alert level.",
    approach:
      "Used Nmap to simulate reconnaissance (port scans, service/version detection) against lab targets, then captured and dissected the resulting traffic in Wireshark to map attacker footprints.",
    tools: ["Wireshark", "Nmap", "TCP/IP fundamentals", "PCAP analysis"],
    outcome:
      "Documented traffic signatures for common scan types, used as a personal reference for faster detection during monitoring shifts.",
  },
  {
    id: "PRJ-005",
    title: "Kali Linux & Windows Log Analyzer",
    severityLabel: "medium",
    status: "Completed",
    summary:
      "A log analysis workflow for correlating Linux (Kali) and Windows event logs during simulated incident response exercises.",
    problem:
      "Cross-platform incidents require pulling signal from very differently structured log formats.",
    approach:
      "Collected Windows Event Logs (Security, System) and Linux auth/syslogs from lab VMs, normalized key fields, and built queries to trace a simulated attacker's actions across both systems.",
    tools: ["Kali Linux", "Windows Event Viewer", "Log parsing", "Python"],
    outcome:
      "Produced a timeline reconstruction of a simulated multi-stage attack across mixed OS environments.",
  },
];

export type SkillCategory = {
  label: string;
  skills: { name: string; level: number }[]; // level 0-100
};

export const skillCategories: SkillCategory[] = [
  {
    label: "Monitoring & Traffic Analysis",
    skills: [
      { name: "Wireshark", level: 85 },
      { name: "Nmap", level: 80 },
      { name: "Burp Suite", level: 70 },
    ],
  },
  {
    label: "SIEM & Detection",
    skills: [
      { name: "Splunk", level: 75 },
      { name: "Wazuh", level: 85 },
      { name: "IBM QRadar", level: 70 },
    ],
  },
  {
    label: "Languages & Scripting",
    skills: [
      { name: "Python", level: 80 },
      { name: "Bash", level: 75 },
      { name: "JavaScript", level: 65 },
    ],
  },
  {
    label: "Platforms",
    skills: [
      { name: "Kali Linux", level: 80 },
      { name: "Windows Server", level: 70 },
      { name: "Web Technologies", level: 65 },
    ],
  },
];

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  code: string;
  link?: string;
};

export const certifications: Certification[] = [
  {
    name: "AI Security",
    issuer: "TryHackMe",
    date: "2025",
    code: "CLR-THM-AI",
  },
  {
    name: "Cybersecurity Fundamentals",
    issuer: "Cisco Networking Academy",
    date: "2025",
    code: "CLR-CSCO-CF",
  },
];

export const threatFeed = [
  "Multiple failed SSH auth attempts detected — source flagged for monitoring",
  "New Wazuh FIM alert — unexpected change to system binary",
  "Suspicious outbound DNS query pattern under review",
  "Nmap scan signature identified in ingress traffic",
  "QRadar offense closed — false positive, rule tuned",
  "Phishing indicator matched against known sender pattern",
  "Honeypot session logged — credential brute-force attempt",
  "Windows Event ID 4625 spike correlated across 3 hosts",
];
