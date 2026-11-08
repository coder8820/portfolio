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
  specialization: "SOC Operations & Threat Hunting",
  focus: "Detection Engineering & Packet Forensics",
  methodology: "MITRE ATT&CK & NIST Incident Response",
};

export const aboutStats = [
  {
    label: "Detection Rules & Decoders",
    value: "100+",
    subtext: "Wazuh, QRadar & Sigma Rules",
  },
  {
    label: "Lab Attack Scenarios",
    value: "50+",
    subtext: "Simulated & Defended",
  },
  {
    label: "Incident Case Studies",
    value: "05",
    subtext: "Documented in SOC Format",
  },
  {
    label: "Blue Team Commitment",
    value: "24/7",
    subtext: "Continuous Vigilance & Rigor",
  },
];

export const homelabNodes = [
  {
    category: "SIEM & Correlation Core",
    name: "Wazuh & Splunk Server",
    tech: "Wazuh 4.x · Splunk Enterprise · OpenSearch",
    role: "Centralized log ingestion, correlation searches, and custom alert rules.",
    status: "Online",
    statusColor: "text-accent border-accent/40 bg-accent/10",
  },
  {
    category: "Network Telemetry Sensor",
    name: "Suricata & Zeek Sensor",
    tech: "pfSense Firewall · Zeek · Wireshark · SPAN Port",
    role: "Real-time packet capture, network protocol analysis, and signature-based IDS/IPS inspection.",
    status: "Active",
    statusColor: "text-accent border-accent/40 bg-accent/10",
  },
  {
    category: "Monitored Endpoints",
    name: "Active Directory Lab",
    tech: "Windows Server 2022 · Sysmon v15 · Ubuntu 22.04 LTS",
    role: "Enterprise telemetry generation with advanced event log auditing (Event IDs 4688, 1, 3).",
    status: "Protected",
    statusColor: "text-blue border-blue/40 bg-blue/10",
  },
  {
    category: "Adversary Emulation Sandbox",
    name: "Threat Simulation Lab",
    tech: "Kali Linux · Atomic Red Team · Cowrie Honeypot",
    role: "Controlled MITRE ATT&CK technique execution to test detection efficacy and alert fidelity.",
    status: "Isolated",
    statusColor: "text-amber border-amber/40 bg-amber/10",
  },
];

export const defensePhilosophy = [
  {
    title: "Signal Over Noise",
    description:
      "A rule generating 100 false positives paralyzes an entire team. Every alert must carry enriched context, high fidelity, and clear triage steps.",
  },
  {
    title: "Packet-Level Verification",
    description:
      "Logs reveal what applications report; packet captures prove what crossed the wire. Rigorous forensics demands cross-validation at both layers.",
  },
  {
    title: "Adversary Lifecycle Mapping",
    description:
      "Detections are systematically categorized by MITRE ATT&CK tactics to expose blind spots and preempt lateral movement before impact.",
  },
];

export type Severity = "critical" | "high" | "medium" | "info";

export type Project = {
  id: string;
  title: string;
  severityLabel: Severity;
  status: "Deployed" | "In Progress" | "Completed";
  timeframe: string;
  duration: string;
  category: "Security Automation" | "Threat Intel" | "SIEM Engineering" | "Network Forensics" | "Offensive Audit";
  impactMetric: { label: string; value: string };
  mitreTactics: string[];
  summary: string;
  problem: string;
  approach: string;
  tools: string[];
  outcome: string;
  keyDeliverables?: string[];
  architecturePoints?: string[];
  link?: string;
};

export const projects: Project[] = [
  {
    id: "PRJ-001",
    title: "AI-Powered Phishing Email Analyzer",
    severityLabel: "high",
    status: "Completed",
    timeframe: "Nov 2024",
    duration: "3 Weeks",
    category: "Security Automation",
    impactMetric: { label: "Triage SLA", value: "5m → <30s (90% faster)" },
    mitreTactics: ["T1566.001 (Spearphishing Link)", "T1566.002 (Attachment)", "T1204 (User Execution)"],
    summary:
      "Automated triage engine that parses raw headers, DKIM/SPF/DMARC auth, and body NLP signals to assign real-time risk scores.",
    problem:
      "Manual email header inspection creates severe triage bottlenecks in Tier-1 SOC shifts, delaying true malicious campaign discovery.",
    approach:
      "Engineered an automated Python ingest pipeline extracting RFC-822 headers, embedded URI reputations, and sender alignment (SPF/DKIM/DMARC), scoring each artifact via fine-tuned NLP heuristics.",
    tools: ["Python", "NLP / Scikit-learn", "Email RFC Headers (SPF/DKIM/DMARC)", "Flask REST API"],
    outcome:
      "Reduced per-incident triage cycle from ~5 minutes to under 30 seconds with an automated verdict scorecard for analysts.",
    keyDeliverables: [
      "Automated RFC 822 / 5322 header parser for hop delay & envelope verification",
      "SPF, DKIM, and DMARC alignment validation engine",
      "Suspicious URI extraction and domain age / WHOIS cross-reference",
      "Analyst verdict console with exportable JSON incident payload",
    ],
    architecturePoints: [
      "Input stream → Header Extraction Engine → Authentication Validator (SPF/DKIM)",
      "URL & Domain Rep Scoring via OSINT feeds → NLP Body Intent Classifier",
      "Risk Score Calculation (0-100) → Webhook Alert & JSON Dossier Generation",
    ],
  },
  {
    id: "PRJ-002",
    title: "Honeypot Attack Telemetry Dashboard",
    severityLabel: "high",
    status: "Deployed",
    timeframe: "Oct 2024",
    duration: "4 Weeks Live",
    category: "Threat Intel",
    impactMetric: { label: "Telemetry Captured", value: "14,000+ Attacker Probes" },
    mitreTactics: ["T1595.001 (Port Scanning)", "T1110.001 (Password Guessing)", "T1046 (Network Service Discovery)"],
    summary:
      "Live sensor array capturing unauthorized brute-force attempts and port enumeration to isolate adversary TTPs and GeoIP trends.",
    problem:
      "Raw syslog streams from perimeter honeypots are unmanageable in raw text form, masking adversary infrastructure patterns.",
    approach:
      "Deployed containerized Cowrie and Dionaea honeypot nodes in cloud DMZs, routing authenticated probe telemetry into a real-time GeoIP aggregation visualizer.",
    tools: ["Cowrie / T-Pot", "Python", "GeoIP MaxMind", "FastAPI", "Tailwind Dashboard"],
    outcome:
      "Uncovered recurring automated Mirai botnet scans and SSH dictionary sweeps, generating 40+ high-confidence IP blocklists.",
    keyDeliverables: [
      "24/7 active low-interaction SSH and Telnet honey-listeners",
      "Real-time IP geolocation and ASN mapping of attacker nodes",
      "Automated password dictionary attack frequency analysis",
      "Exportable CSV/STIX IoC feed for perimeter firewall blacklisting",
    ],
    architecturePoints: [
      "Isolated Cloud VPS DMZ → Cowrie Sensor (Port 22/2222) + Dionaea (SMB/FTP)",
      "Log Shipper (JSON Stream) → Python Normalizer & GeoIP Enricher",
      "Time-Series Database → Live Threat Map & Top Attacker Metric Cards",
    ],
  },
  {
    id: "PRJ-003",
    title: "SIEM Detection Engineering — Wazuh & QRadar",
    severityLabel: "critical",
    status: "Completed",
    timeframe: "Sep 2024",
    duration: "Ongoing Tuning",
    category: "SIEM Engineering",
    impactMetric: { label: "Alert Fidelity", value: "Zero False-Positive Target" },
    mitreTactics: ["T1003.001 (LSASS Memory)", "T1059.001 (PowerShell)", "T1078 (Valid Accounts)"],
    summary:
      "Cross-platform detection engineering pipeline combining Sysmon telemetry with custom Wazuh XML rules and QRadar offense correlation.",
    problem:
      "Default vendor alert rules flood analysts with non-actionable noise, creating alert fatigue and masking credential dumping attacks.",
    approach:
      "Configured Sysmon Event ID 1 (Process Create) and Event ID 10 (ProcessAccess) across Windows endpoints; tuned custom decoders and created correlation offenses in QRadar for chained adversary behavior.",
    tools: ["Wazuh EDR/SIEM", "IBM QRadar", "Sysmon v15", "Sigma Rules", "AQL (Ariel Query Language)"],
    outcome:
      "Built a production-tested detection pipeline catching LSASS dumping, unquoted service paths, and suspicious scheduled tasks with sub-second alert triggers.",
    keyDeliverables: [
      "15+ custom Wazuh XML decoders and high-fidelity detection rules",
      "QRadar AQL rules correlating parent-child process anomalies with privilege spikes",
      "Custom Sigma rule mappings for cross-SIEM deployment",
      "Standard Operating Procedure (SOP) runbooks for Tier-1 alert triage",
    ],
    architecturePoints: [
      "Endpoint Sysmon / Auditd → Wazuh Agent (TLS Encrypted Forwarding)",
      "Wazuh Manager Rule Engine (XML Decoders) → High-Fidelity Alert Indexing",
      "Syslog Forwarder → IBM QRadar SIEM (Offense Creation & AQL Correlation)",
    ],
  },
  {
    id: "PRJ-004",
    title: "Network Forensic Traffic Labs — Wireshark & Nmap",
    severityLabel: "medium",
    status: "Completed",
    timeframe: "Jul 2024",
    duration: "2 Weeks",
    category: "Network Forensics",
    impactMetric: { label: "Packet Forensics", value: "100% Signature Mapped" },
    mitreTactics: ["T1046 (Network Service Discovery)", "T1040 (Network Sniffing)", "T1071 (Application Layer Protocol)"],
    summary:
      "Full packet capture and traffic analysis laboratory mapping attacker reconnaissance signatures, TCP flags, and protocol anomalies.",
    problem:
      "Log-only visibility fails to uncover stealthy half-open SYN scans, anomalous TCP window sizes, or plain-text credential transmissions.",
    approach:
      "Simulated diverse adversary scanning strategies (SYN stealth, Xmas, NULL scans) using Nmap, capturing raw PCAPs in Wireshark to isolate distinct TCP/IP handshake anomalies.",
    tools: ["Wireshark", "Nmap", "TCPDump", "PCAP Dissectors", "Network Protocols (TCP/UDP/DNS)"],
    outcome:
      "Cataloged signature fingerprints for 8 reconnaissance tools, establishing clear display filter cheat-sheets for live monitoring shifts.",
    keyDeliverables: [
      "PCAP repository of simulated stealth scans and banner grabbing sessions",
      "Custom Wireshark display filter profiles for rapid incident inspection",
      "DNS exfiltration and anomalous beaconing packet detection guide",
      "TCP handshake flag breakdown documenting evasive scanner techniques",
    ],
    architecturePoints: [
      "Kali Attacking Node → Span Port / TAP → Virtual Target Network",
      "TCPDump background daemon capturing raw .pcapng files",
      "Wireshark Protocol Dissection & Follow Stream Analysis → Forensic Dossier",
    ],
  },
  {
    id: "PRJ-005",
    title: "Cross-Platform Log Correlator & IR Timeline",
    severityLabel: "medium",
    status: "Completed",
    timeframe: "Jun 2024",
    duration: "2.5 Weeks",
    category: "SIEM Engineering",
    impactMetric: { label: "MTTR Reduction", value: "Chronological Root Cause" },
    mitreTactics: ["T1070 (Indicator Removal)", "T1078 (Valid Accounts)", "T1053 (Scheduled Task/Job)"],
    summary:
      "Incident response framework normalizing mixed Windows Event Logs and Linux auth/syslogs to reconstruct precise multi-stage intrusion timelines.",
    problem:
      "Lateral movement spanning across Linux bastions and Windows Active Directory servers creates disjointed, fragmented investigation timelines.",
    approach:
      "Scripted a normalization parser merging Windows Security IDs (4624, 4672, 4720) with Linux auditd/auth.log events into a unified chronological UTC timeline.",
    tools: ["Python", "Windows Event Viewer", "Linux Auditd", "Regex", "Pandas"],
    outcome:
      "Successfully traced a simulated 5-step lateral movement exercise from initial SSH ingress to Active Directory domain escalation in under 10 minutes.",
    keyDeliverables: [
      "Python-driven log unification script parsing CSV, JSON, and EVTX extracts",
      "Automated event sequence timeline generator with MITRE tactic tags",
      "Root cause attribution matrix pinpointing the patient-zero host",
      "Post-incident executive debrief report template",
    ],
    architecturePoints: [
      "EVTX (Windows) + /var/log/auth.log (Linux) → Field Extraction Regex",
      "UTC Timestamp Synchronization & Host Entity Mapping",
      "Timeline Reconstruction Engine → Unified Graph & Forensic Chronology",
    ],
  },
  {
    id: "PRJ-006",
    title: "Web Application Security Vulnerability Auditor",
    severityLabel: "high",
    status: "Completed",
    timeframe: "May 2024",
    duration: "3 Weeks",
    category: "Offensive Audit",
    impactMetric: { label: "Coverage", value: "OWASP Top 10 Signatures" },
    mitreTactics: ["T1190 (Exploit Public-Facing Application)", "T1059.007 (JavaScript)", "T1505 (Server Software Component)"],
    summary:
      "Automated security auditor crawling web endpoints to detect SQL injection, reflective XSS, and security header misconfigurations.",
    problem:
      "Manual web application vulnerability audits on large internal test setups miss repetitive injection points and header hygiene gaps.",
    approach:
      "Constructed a multi-threaded Python scanner that spidered local test applications (DVWA/Juice Shop), tested parameterized input vectors, and validated response variations.",
    tools: ["Python", "Requests", "BeautifulSoup4", "Regex", "HTTP Security Headers", "DVWA Lab"],
    outcome:
      "Discovered and generated structured vulnerability reports with CVSS score estimations and remediation code samples for development teams.",
    keyDeliverables: [
      "Automated parameter crawler and boundary payload fuzzer",
      "Security header verification (CSP, HSTS, X-Content-Type-Options)",
      "Reflective XSS context detector with HTML encoding verification",
      "Markdown and JSON audit report generator with actionable remediations",
    ],
    architecturePoints: [
      "Target URL → Web Crawler & Link Graph Extraction → Parameter Identification",
      "Payload Injection Engine (SQLi error-based & XSS probes) → Response Diff Analyzer",
      "CVSS Risk Scoring Engine → Detailed Markdown Vulnerability Audit Report",
    ],
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
      { name: "C++", level: 60 },
    ],
  },
  {
    label: "Platforms",
    skills: [
      { name: "Kali Linux", level: 80 },
      { name: "Windows Server", level: 70 },
      { name: "Web Technologies", level: 65 },
      { name: "MacOS", level: 60 },
    ],
  },
];

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  code: string;
  image: string;
  category: "AI Security" | "Network Defense" | "Systems & Apps" | "Honors & Merit";
  skills: string[];
  badgeLevel: string;
  link?: string;
};

export const certifications: Certification[] = [
  {
    name: "AI Security",
    issuer: "TryHackMe",
    date: "2025",
    code: "CLR-THM-AI",
    image: "/cert-ai-security.jpg",
    category: "AI Security",
    skills: ["Adversarial AI", "LLM Red Teaming", "Model Hardening"],
    badgeLevel: "Specialist",
  },
  {
    name: "Cybersecurity Fundamentals",
    issuer: "Cisco Networking Academy",
    date: "2025",
    code: "CLR-CSCO-CF",
    image: "/cert-cyber-fundamentals.jpg",
    category: "Network Defense",
    skills: ["Network Security", "OSI Model Defense", "Threat Mitigation"],
    badgeLevel: "Enterprise",
  },
  {
    name: "Generative AI and Prompt Engineering",
    issuer: "iCodeGuru",
    date: "2026",
    code: "GEN-AI-01",
    image: "/cert-genai-prompt.jpg",
    category: "AI Security",
    skills: ["Prompt Injection Defense", "Jailbreak Mitigation", "LLM Architecture"],
    badgeLevel: "Advanced",
  },
  {
    name: "Mobile App Development (Flutter)",
    issuer: "Haza Institute of Technology",
    date: "2024",
    code: "MAD-01",
    image: "/cert-software-dev.jpg",
    category: "Systems & Apps",
    skills: ["Cross-Platform Architecture", "Client Security", "API Integration"],
    badgeLevel: "Certified",
  },
  {
    name: "Game App Development",
    issuer: "Haza Institute of Technology",
    date: "2025",
    code: "GAD-01",
    image: "/cert-software-dev.jpg",
    category: "Systems & Apps",
    skills: ["Game Physics & Logic", "C++ / Engine Architecture", "State Management"],
    badgeLevel: "Certified",
  },
  {
    name: "PEF Scholarship Award",
    issuer: "University of Baltistan",
    date: "2023",
    code: "PEF-SCH",
    image: "/cert-scholarship-award.jpg",
    category: "Honors & Merit",
    skills: ["Academic Excellence", "Merit Leadership", "Technical Distinction"],
    badgeLevel: "Distinction",
  },
  {
    name: "E-Commerce Training Certificate",
    issuer: "Global UGRAD",
    date: "2026",
    code: "ECOM-01",
    image: "/cert-scholarship-award.jpg",
    category: "Honors & Merit",
    skills: ["Digital Commerce Systems", "Global Systems", "Leadership Exchange"],
    badgeLevel: "Fellowship",
  },
  {
    name: "Defensive AI & Threat Hunting",
    issuer: "TryHackMe",
    date: "2026",
    code: "SEC-AI-01",
    image: "/cert-ai-security.jpg",
    category: "AI Security",
    skills: ["AI Threat Modeling", "Anomaly Detection", "SOC Automation"],
    badgeLevel: "Specialist",
  },
];

export const threatFeed = [
  "Multiple failed RDP login attempts detected from external IP",
"Unusual PowerShell execution observed on endpoint",
"Potential ransomware behavior detected — rapid file encryption activity",
"High-severity CVE exploit attempt blocked by IPS",
"Abnormal SMB traffic detected between internal hosts",
"Suspicious privilege escalation attempt under investigation",
"Firewall blocked repeated connection attempts from blacklisted IP",
"Malicious URL detected in incoming email attachment",
"VPN login from unusual geographic location detected",
"Endpoint antivirus quarantined Trojan downloader",
"SQL injection attempt detected against web application",
"Cross-Site Scripting (XSS) payload identified in HTTP request",
"Possible command injection attempt blocked by WAF",
"Critical Linux audit log indicates unauthorized sudo usage",
"New administrator account created outside business hours",
"Large outbound data transfer detected — possible data exfiltration",
"DNS tunneling behavior suspected from internal workstation",
"Suspicious process injection detected in explorer.exe",
"Web shell signature identified on production server",
"Multiple account lockouts detected across Active Directory",
"Unauthorized USB storage device connected to workstation",
"Brute-force attack detected against VPN gateway",
"Unusual Azure sign-in risk flagged as high",
"AWS IAM policy modified without approved change request",
"Microsoft Defender detected credential dumping activity",
"LSASS memory access attempt detected and blocked",
"Beaconing traffic pattern consistent with C2 communication",
"Email attachment contained known malware hash",
"Excessive failed MFA attempts recorded for privileged account",
"Network IDS detected possible ARP spoofing attack",
"Unexpected service started on critical Windows server",
"Container runtime reported suspicious privileged execution",
"Kubernetes cluster detected unauthorized API access attempt",
"Reverse shell connection attempt identified and terminated",
"Unauthorized registry modification detected on endpoint",
"Possible insider threat — sensitive files accessed in bulk",
"TLS certificate mismatch detected during outbound connection",
"IOC match found against threat intelligence feed",
"Endpoint isolated after confirmed malware execution",
"WAF blocked repeated directory traversal attempts",
"Anomalous authentication pattern detected for service account",
"Cloud storage bucket exposed to public access",
"Security policy violation detected on managed endpoint",
"High CPU usage linked to suspected cryptomining process",
"Failed Kerberos authentication spike detected in domain",
"EDR detected suspicious persistence mechanism",
"Unauthorized scheduled task created on workstation",
"SIEM correlation rule triggered for lateral movement activity",
"Possible Pass-the-Hash attack indicators detected",
"Critical asset reported missing latest security patches"
];
