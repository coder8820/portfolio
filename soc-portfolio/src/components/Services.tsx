"use client";

import { services, Service } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import {
  Radar,
  Terminal,
  ShieldCheck,
  Activity,
  Lock,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCheck,
} from "lucide-react";

const iconMap = {
  Radar,
  Terminal,
  ShieldCheck,
  Activity,
  Lock,
  Cpu,
};

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <SectionHeading
          eyebrow="~/services"
          title="Defensive Security & SOC Capabilities"
          description="Enterprise-grade Blue Team services focused on active threat monitoring, SIEM detection engineering, host & packet forensics, and swift incident mitigation."
        />
        <div className="hidden md:flex items-center gap-2 font-mono text-xs text-muted pb-10">
          <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span>STATUS: ACCEPTING CLIENT ENGAGEMENTS</span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {services.map((service: Service, i: number) => {
          const Icon = iconMap[service.iconName] || ShieldAlert;
          return (
            <Reveal key={service.id} delay={i * 0.08}>
              <div className="panel panel-glass rounded-md p-6 h-full flex flex-col justify-between hover-lift relative overflow-hidden group border border-line/70 hover:border-accent/50 transition-all duration-300">
                {/* Top Subtle Gradient Line */}
                <div className="h-[2px] w-full bg-gradient-to-r from-accent/80 via-accent/40 to-transparent absolute top-0 left-0 group-hover:h-[3px] transition-all" />

                <div>
                  {/* Top Bar: Category & SLA */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-xs border border-accent/40 bg-accent/10 text-accent font-semibold">
                      {service.category}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-xs border border-line bg-surface text-dim">
                      {service.sla}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="p-2.5 rounded-md border border-accent/30 bg-accent/10 text-accent shrink-0 group-hover:scale-105 group-hover:shadow-[0_0_14px_rgba(57,255,140,0.25)] transition-all duration-300">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-mono text-base font-bold text-text group-hover:text-accent transition-colors leading-snug">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-muted leading-relaxed mb-5">
                    {service.shortDesc}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2 mb-6 border-t border-line/50 pt-4">
                    <span className="font-mono text-[10px] uppercase text-dim tracking-wider block mb-2 font-semibold">
                      KEY DELIVERABLES:
                    </span>
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-text/90 leading-tight">
                        <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Chips & CTA */}
                <div className="pt-4 border-t border-line/50 mt-auto">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {service.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] px-2 py-0.5 rounded-xs bg-surface-light border border-line text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-accent font-semibold group-hover:translate-x-1 transition-transform"
                  >
                    <span>Request Engagement</span>
                    <ArrowRight size={13} className="text-accent" />
                  </a>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Engagement Guarantee / Operational SLA Banner */}
      <Reveal delay={0.3}>
        <div className="panel panel-glass rounded-md p-6 sm:p-8 border border-accent/30 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-accent">
                <ShieldCheck size={16} />
                <span className="tracking-wider uppercase font-semibold">
                  OPERATIONAL COMMITMENT // DEFENSE EXCELLENCE
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-text">
                Need Dedicated Security Monitoring or SIEM Architecture?
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-2xl">
                Whether deploying a ground-up Wazuh or QRadar cluster, tuning high-volume log pipelines, or hunting undetected adversary activity across endpoints, every engagement is executed with meticulous documentation and verified MITRE ATT&CK alignment.
              </p>

              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-dim">
                <span className="flex items-center gap-1.5 text-text">
                  <CheckCheck size={14} className="text-accent" />
                  <span>Zero-False-Positive Target</span>
                </span>
                <span className="flex items-center gap-1.5 text-text">
                  <Zap size={14} className="text-accent" />
                  <span>&lt;30s Triage Speed</span>
                </span>
                <span className="flex items-center gap-1.5 text-text">
                  <ShieldAlert size={14} className="text-accent" />
                  <span>Detailed Root-Cause PCAP</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end items-start lg:items-end">
              <a
                href="#contact"
                className="w-full sm:w-auto text-center px-5 py-2.5 rounded-sm bg-accent text-[#06120c] font-mono font-bold text-xs hover:bg-accent/90 shadow-[0_0_15px_rgba(57,255,140,0.25)] transition-all cursor-pointer"
              >
                ./initiate-consultation.sh
              </a>
              <a
                href={services[0]?.technologies[0] ? "#skills" : "#about"}
                className="w-full sm:w-auto text-center px-5 py-2.5 rounded-sm border border-line bg-surface text-muted font-mono text-xs hover:text-accent hover:border-accent/40 transition-colors cursor-pointer"
              >
                Review Technical Lab &rarr;
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
