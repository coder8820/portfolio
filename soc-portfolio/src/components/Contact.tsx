"use client";

import { useState } from "react";
import { profile } from "@/data/content";
import SectionHeading from "./SectionHeading";
import TerminalWindow from "./TerminalWindow";
import Reveal from "./Reveal";
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Send,
  Lock,
  Clock,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function GithubIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TryHackMeIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}

export default function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Form State
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("[HIRING] SOC Analyst / Blue Team Role");
  const [message, setMessage] = useState("");

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const generateEmailLink = (isGmail = false) => {
    const subject = encodeURIComponent(`${inquiryType} — From ${senderName || "Recruiter / Hiring Lead"}`);
    const body = encodeURIComponent(
      `Hello Kumail,\n\n${message || "I came across your portfolio and would like to connect regarding an opportunity."}\n\nBest regards,\n${senderName || "Sender"}\n${senderEmail || ""}`
    );

    if (isGmail) {
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}&su=${subject}&body=${body}`;
    }
    return `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const channels = [
    {
      icon: LinkedinIcon,
      label: "LinkedIn",
      value: "Kumail Abbas",
      subtext: "Connect & InMail",
      href: profile.linkedin,
      color: "text-blue border-blue/40 bg-blue/10",
    },
    {
      icon: TryHackMeIcon,
      label: "TryHackMe",
      value: "kumailAbbass",
      subtext: "View Live Security Rank",
      href: profile.tryhackme,
      color: "text-red border-red/40 bg-red/10",
    },
    {
      icon: GithubIcon,
      label: "GitHub",
      value: "coder8820",
      subtext: "Detection Repos & Rules",
      href: profile.github,
      color: "text-accent border-accent/40 bg-accent/10",
    },
  ];

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <SectionHeading
        eyebrow="~/contact"
        title="Contact & Inquiries"
        description="Hiring for a blue team or SOC role? Reach out — happy to walk through any project or schedule an interview."
      />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Channels, SLA & Readiness (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Primary Email Card */}
          <Reveal>
            <div className="panel rounded-md p-5 border border-accent/40 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-accent via-accent/60 to-transparent absolute top-0 left-0" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-accent/15 border border-accent/40 flex items-center justify-center text-accent">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-accent uppercase font-bold tracking-wider block">
                      DIRECT EMAIL ADDRESS
                    </span>
                    <h3 className="font-mono text-sm sm:text-base font-bold text-text truncate">
                      {profile.email}
                    </h3>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded-sm bg-accent/15 text-accent border border-accent/40 font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  ACTIVE
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-line/70 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex-1 font-mono text-xs px-3 py-2 rounded-sm border border-line bg-surface-light text-text hover:border-accent hover:text-accent font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check size={13} className="text-accent" />
                      <span className="text-accent">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>

                <a
                  href={generateEmailLink(true)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs px-3.5 py-2 rounded-sm bg-accent text-[#06120c] font-bold hover:bg-accent/90 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Gmail</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Social Security Channels */}
          <div className="grid sm:grid-cols-3 gap-3">
            {channels.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.label} delay={i * 0.08}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="panel rounded-md p-3.5 border border-line hover:border-accent/40 transition-all flex flex-col justify-between h-full group hover-lift block"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Icon size={16} className="text-muted group-hover:text-accent transition-colors" />
                        <ExternalLink size={11} className="text-dim group-hover:text-accent" />
                      </div>
                      <span className="font-mono text-[10px] text-dim uppercase tracking-wider block">
                        {c.label}
                      </span>
                      <h4 className="font-mono text-xs font-bold text-text mt-0.5 truncate group-hover:text-accent transition-colors">
                        {c.value}
                      </h4>
                    </div>
                    <span className="font-mono text-[9px] text-muted mt-2 border-t border-line/60 pt-1.5 block">
                      {c.subtext}
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>

          {/* Operational Readiness / SLA Matrix */}
          <Reveal delay={0.15}>
            <div className="panel rounded-md p-4 border border-line">
              <span className="font-mono text-[10px] text-dim uppercase tracking-wider font-bold block mb-3 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-accent" />
                <span>OPERATIONAL SLA & READINESS</span>
              </span>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-line/60 pb-1.5">
                  <span className="text-muted flex items-center gap-1.5">
                    <Clock size={12} className="text-dim" />
                    <span>Response Time SLA</span>
                  </span>
                  <span className="text-accent font-bold">&lt; 12 Hours</span>
                </div>

                <div className="flex items-center justify-between border-b border-line/60 pb-1.5">
                  <span className="text-muted flex items-center gap-1.5">
                    <Globe2 size={12} className="text-dim" />
                    <span>Timezone / Shift</span>
                  </span>
                  <span className="text-text font-semibold">UTC+5 (Follow-the-Sun)</span>
                </div>

                <div className="flex items-center justify-between border-b border-line/60 pb-1.5">
                  <span className="text-muted flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-dim" />
                    <span>Availability</span>
                  </span>
                  <span className="text-accent font-semibold">Immediate / Full-time</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted flex items-center gap-1.5">
                    <Sparkles size={12} className="text-dim" />
                    <span>Work Preference</span>
                  </span>
                  <span className="text-text font-semibold">Remote &amp; Relocation</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right Column: Direct Transmission Terminal (7 cols) */}
        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <TerminalWindow title="dispatch_terminal.sh — SECURE CHANNEL">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.open(generateEmailLink(true), "_blank");
                }}
                className="space-y-4 font-mono text-xs"
              >
                {/* Channel Status Header */}
                <div className="p-3 rounded-sm bg-surface-light border border-line flex items-center justify-between text-muted text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-text font-semibold">ENCRYPTED DISPATCH CONSOLE</span>
                  </span>
                  <span className="text-dim">PORT: 443 // TLS 1.3</span>
                </div>

                {/* Name & Email inputs in 2 columns */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-dim uppercase text-[10px] font-bold mb-1 tracking-wider">
                      &gt; YOUR NAME / COMPANY *
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Alex Mercer (Hiring Manager)"
                      className="w-full rounded-sm border border-line bg-surface-input px-3 py-2.5 text-xs text-text outline-none transition-colors placeholder:text-dim focus:border-accent focus:ring-1 focus:ring-accent/30 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-dim uppercase text-[10px] font-bold mb-1 tracking-wider">
                      &gt; YOUR EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="e.g. alex@company.com"
                      className="w-full rounded-sm border border-line bg-surface-input px-3 py-2.5 text-xs text-text outline-none transition-colors placeholder:text-dim focus:border-accent focus:ring-1 focus:ring-accent/30 font-mono"
                    />
                  </div>
                </div>

                {/* Inquiry Classification */}
                <div>
                  <label className="block text-dim uppercase text-[10px] font-bold mb-1 tracking-wider">
                    &gt; INQUIRY CLASSIFICATION
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full rounded-sm border border-line bg-surface-input px-3 py-2.5 text-xs text-text outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30 font-mono cursor-pointer"
                  >
                    <option value="[HIRING] SOC Analyst / Blue Team Role">
                      [HIRING] SOC Analyst / Blue Team Role (Tier-1 / Tier-2)
                    </option>
                    <option value="[INTERVIEW] Technical Interview / Screening">
                      [INTERVIEW] Technical Interview / Screening Invitation
                    </option>
                    <option value="[COLLAB] Detection Engineering & Threat Hunting">
                      [COLLAB] Detection Engineering &amp; Threat Hunting Lab
                    </option>
                    <option value="[CONSULT] Security Consultation / SIEM Tuning">
                      [CONSULT] Security Consultation &amp; SIEM Tuning
                    </option>
                    <option value="[GENERAL] Network Connection / Other">
                      [GENERAL] Network Connection &amp; General Inquiries
                    </option>
                  </select>
                </div>

                {/* Message Payload */}
                <div>
                  <label className="block text-dim uppercase text-[10px] font-bold mb-1 tracking-wider">
                    &gt; YOUR MESSAGE *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter role description, meeting proposal, or project details..."
                    className="w-full rounded-sm border border-line bg-surface-input px-3 py-2.5 text-xs text-text outline-none transition-colors placeholder:text-dim focus:border-accent focus:ring-1 focus:ring-accent/30 font-mono resize-none leading-relaxed"
                  />
                </div>

                {/* Transmission Action Buttons */}
                <div className="pt-2 border-t border-line/70 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-dim">
                    <Lock size={12} className="text-accent" />
                    <span>Direct encrypted delivery to Kumail Abbas</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={generateEmailLink(false)}
                      className="font-mono text-xs px-3 py-2 rounded-sm border border-line text-muted hover:text-text hover:border-line/80 transition-colors cursor-pointer"
                      title="Send via default OS mail client"
                    >
                      Default Mail
                    </a>

                    <button
                      type="submit"
                      className="font-mono text-xs px-4 py-2 rounded-sm bg-accent text-[#06120c] font-bold hover:bg-accent/90 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Send size={13} />
                      <span>Transmit via Gmail</span>
                    </button>
                  </div>
                </div>
              </form>
            </TerminalWindow>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
