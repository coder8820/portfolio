"use client";

import { useState, useEffect, useId } from "react";
import { projects, Project, Severity } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Zap,
  Shield,
  ArrowUpRight,
  X,
  CheckCircle2,
  Check,
  Copy,
  Layers,
  Cpu,
  ChevronRight,
  AlertTriangle,
  FolderGit2,
} from "lucide-react";

const sevStyle: Record<Severity, string> = {
  critical: "text-red border-red/40 bg-red/10",
  high: "text-amber border-amber/40 bg-amber/10",
  medium: "text-blue border-blue/40 bg-blue/10",
  info: "text-muted border-line bg-surface-light",
};

const statusStyle: Record<string, string> = {
  Deployed: "text-accent border-accent/40 bg-accent/10",
  Completed: "text-accent border-accent/40 bg-accent/10",
  "In Progress": "text-amber border-amber/40 bg-amber/10",
};

const categories = [
  "ALL",
  "SIEM Engineering",
  "Security Automation",
  "Threat Intel",
  "Network Forensics",
  "Offensive Audit",
] as const;

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState(false);
  const modalHeadingId = useId();

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  const filteredProjects =
    activeCategory === "ALL"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const handleCopyProject = (project: Project) => {
    const text = `Project: ${project.title} (${project.id})\nCategory: ${project.category}\nOutcome: ${project.outcome}\nTools: ${project.tools.join(", ")}`;
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <SectionHeading
        eyebrow="~/projects"
        title="Incident Reports & Engineering"
        description="Selected hands-on security engineering projects, logged in SOC case file format. Click any card to inspect full technical architecture and telemetry."
      />

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 no-scrollbar">
        {categories.map((cat) => {
          const count =
            cat === "ALL"
              ? projects.length
              : projects.filter((p) => p.category === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`font-mono text-xs px-3 py-1.5 rounded-sm border whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-accent text-[#06120c] font-bold border-accent shadow-sm"
                  : "bg-surface-light border-line text-muted hover:border-accent/40 hover:text-text"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-sm font-mono ${
                  isActive
                    ? "bg-[#06120c]/20 text-[#06120c] font-bold"
                    : "bg-surface text-dim border border-line"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Compact Cards Grid (Smaller, cleaner, and interactive) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((p, idx) => (
          <Reveal key={p.id} delay={(idx % 3) * 0.08}>
            <article
              role="button"
              tabIndex={0}
              onClick={() => setSelectedProject(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedProject(p);
                }
              }}
              className="panel rounded-md overflow-hidden flex flex-col h-full border border-line hover:border-accent/50 transition-all duration-200 group hover-lift cursor-pointer bg-panel relative"
            >
              {/* Card Top Banner: ID, Timeframe & Severity */}
              <div className="panel-header px-4 py-2.5 flex items-center justify-between border-b border-line bg-surface-muted/60">
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-accent font-bold">{p.id}</span>
                  <span className="text-line">/</span>
                  <span className="text-dim flex items-center gap-1 text-[10px]">
                    <Calendar size={11} className="text-dim" />
                    {p.timeframe}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm border font-semibold ${sevStyle[p.severityLabel]}`}
                  >
                    {p.severityLabel}
                  </span>
                </div>
              </div>

              {/* Card Main Body: Compact content */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                {/* Title */}
                <div>
                  <h3 className="font-mono font-bold text-text text-sm sm:text-base group-hover:text-accent transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <span className="font-mono text-[10px] text-dim block mt-0.5">
                    {p.category}
                  </span>
                </div>

                {/* Short Attractive Summary */}
                <p className="text-xs text-muted leading-relaxed line-clamp-2">
                  {p.summary}
                </p>

                {/* Key Metric & Time Pill */}
                <div className="mt-auto pt-2 border-t border-line/60 flex flex-col gap-2">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-dim flex items-center gap-1 text-[10px]">
                      <Clock size={11} className="text-dim" />
                      Duration:
                    </span>
                    <span className="text-text font-semibold text-[11px]">
                      {p.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm bg-accent/5 border border-accent/20 text-accent font-mono text-[10px] font-semibold">
                    <Zap size={11} className="shrink-0 text-accent" />
                    <span className="truncate">{p.impactMetric.value}</span>
                  </div>
                </div>

                {/* Compact Tech Chips (Top 3) */}
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  {p.tools.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-surface-light border border-line text-muted truncate max-w-[120px]"
                    >
                      {t}
                    </span>
                  ))}
                  {p.tools.length > 3 && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-surface-light text-dim">
                      +{p.tools.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Status & View Detail Button */}
              <div className="px-4 py-2.5 border-t border-line bg-surface-muted/40 flex items-center justify-between font-mono text-[11px]">
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-sm border font-semibold ${statusStyle[p.status]}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {p.status}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(p);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:text-accent-dim transition-colors cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* FULL PROJECT DETAIL MODAL (TECHNICAL DOSSIER) */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalHeadingId}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-surface-overlay backdrop-blur-md cursor-pointer"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-panel border-2 border-accent/40 rounded-md shadow-2xl overflow-hidden flex flex-col z-10 font-mono"
            >
              {/* Modal Terminal Header */}
              <div className="px-4 sm:px-6 py-3 border-b border-line bg-panel-raised flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-accent/80 inline-block" />
                  </div>
                  <span className="text-dim text-xs ml-2 font-mono">
                    case_file_{selectedProject.id.toLowerCase()}.sh --verbose
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyProject(selectedProject)}
                    className="flex items-center gap-1 font-mono text-[11px] px-2.5 py-1 rounded-sm border border-line bg-panel text-muted hover:border-accent hover:text-accent transition-colors cursor-pointer"
                    title="Copy case file summary"
                  >
                    {copiedId ? (
                      <>
                        <Check size={12} className="text-accent" />
                        <span className="text-accent">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    aria-label="Close modal"
                    className="p-1 rounded-sm text-dim hover:text-text hover:bg-panel-raised transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-text bg-panel">
                {/* Title & Metadata Header */}
                <div className="border-b border-line pb-5">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-accent font-bold px-2 py-0.5 rounded-sm bg-accent/10 border border-accent/30">
                      {selectedProject.id}
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm border font-semibold ${sevStyle[selectedProject.severityLabel]}`}
                    >
                      SEVERITY: {selectedProject.severityLabel}
                    </span>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded-sm border font-semibold ${statusStyle[selectedProject.status]}`}
                    >
                      {selectedProject.status}
                    </span>
                    <span className="font-mono text-[10px] text-dim ml-auto">
                      CATEGORY: {selectedProject.category}
                    </span>
                  </div>

                  <h2 id={modalHeadingId} className="text-lg sm:text-2xl font-bold font-mono text-text mt-1">
                    {selectedProject.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted font-sans leading-relaxed">
                    {selectedProject.summary}
                  </p>

                  {/* Operational Time & Benchmark Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-line/70">
                    <div className="p-2.5 rounded-sm bg-panel-raised border border-line">
                      <span className="text-[10px] text-dim block uppercase">TIMEFRAME</span>
                      <span className="text-xs font-bold text-text flex items-center gap-1 mt-0.5">
                        <Calendar size={12} className="text-accent" />
                        {selectedProject.timeframe}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-sm bg-panel-raised border border-line">
                      <span className="text-[10px] text-dim block uppercase">DURATION</span>
                      <span className="text-xs font-bold text-text flex items-center gap-1 mt-0.5">
                        <Clock size={12} className="text-amber" />
                        {selectedProject.duration}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-sm bg-panel-raised border border-line col-span-2">
                      <span className="text-[10px] text-dim block uppercase">PRIMARY IMPACT METRIC</span>
                      <span className="text-xs font-bold text-accent flex items-center gap-1 mt-0.5">
                        <Zap size={12} className="text-accent" />
                        {selectedProject.impactMetric.value}
                      </span>
                    </div>
                  </div>
                </div>

                {/* MITRE ATT&CK Mapping */}
                <div>
                  <span className="text-[10px] text-dim uppercase tracking-wider font-bold block mb-2 flex items-center gap-1.5">
                    <Shield size={12} className="text-accent" />
                    <span>MITRE ATT&amp;CK TTP COVERAGE</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.mitreTactics.map((tactic) => (
                      <span
                        key={tactic}
                        className="px-2.5 py-1 rounded-sm bg-panel-raised border border-line text-[11px] font-mono text-text flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red" />
                        {tactic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3-Pillar Security Deep Dive: Problem / Approach / Outcome */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Problem */}
                  <div className="p-4 rounded-sm bg-red/10 border border-red/30 flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-red flex items-center gap-1.5 mb-2">
                      <AlertTriangle size={12} />
                      <span>THE THREAT / PROBLEM</span>
                    </span>
                    <p className="text-[11px] text-text font-sans leading-relaxed flex-1">
                      {selectedProject.problem}
                    </p>
                  </div>

                  {/* Approach */}
                  <div className="p-4 rounded-sm bg-blue/10 border border-blue/30 flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-blue flex items-center gap-1.5 mb-2">
                      <Cpu size={12} />
                      <span>ENGINEERING APPROACH</span>
                    </span>
                    <p className="text-[11px] text-text font-sans leading-relaxed flex-1">
                      {selectedProject.approach}
                    </p>
                  </div>

                  {/* Outcome */}
                  <div className="p-4 rounded-sm bg-accent/10 border border-accent/40 flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-accent flex items-center gap-1.5 mb-2">
                      <CheckCircle2 size={12} />
                      <span>MEASURABLE OUTCOME</span>
                    </span>
                    <p className="text-[11px] text-text font-sans font-medium leading-relaxed flex-1">
                      {selectedProject.outcome}
                    </p>
                  </div>
                </div>

                {/* Architecture Pipeline Flow */}
                {selectedProject.architecturePoints && (
                  <div className="p-4 rounded-sm bg-panel-raised border border-line">
                    <span className="text-[10px] text-dim uppercase tracking-wider font-bold block mb-2.5 flex items-center gap-1.5">
                      <Layers size={13} className="text-accent" />
                      <span>DATA PIPELINE &amp; ARCHITECTURE FLOW</span>
                    </span>
                    <div className="space-y-2">
                      {selectedProject.architecturePoints.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] font-mono text-text">
                          <span className="text-accent font-bold shrink-0">0{i + 1}.</span>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Deliverables & Artifacts */}
                {selectedProject.keyDeliverables && (
                  <div>
                    <span className="text-[10px] text-dim uppercase tracking-wider font-bold block mb-2 flex items-center gap-1.5">
                      <FolderGit2 size={12} className="text-accent" />
                      <span>VERIFIABLE DELIVERABLES &amp; ARTIFACTS</span>
                    </span>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {selectedProject.keyDeliverables.map((item, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-sm bg-panel-raised border border-line flex items-start gap-2 text-[11px] text-text font-sans"
                        >
                          <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Complete Tooling Stack */}
                <div>
                  <span className="text-[10px] text-dim uppercase tracking-wider font-bold block mb-2">
                    DEPLOYED STACK &amp; PROTOCOLS
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tools.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-sm bg-panel-raised border border-line text-[11px] font-mono text-text font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3.5 border-t border-line bg-panel-raised flex flex-wrap items-center justify-between gap-3 shrink-0">
                <span className="text-dim text-[11px] font-mono">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-panel border border-line text-text">ESC</kbd> to return to case list
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="px-3 py-1.5 rounded-sm border border-line bg-panel text-muted hover:text-text font-mono text-xs transition-colors cursor-pointer"
                  >
                    Close Dossier
                  </button>

                  <a
                    href="#contact"
                    onClick={() => setSelectedProject(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm bg-accent text-[#06120c] font-mono text-xs font-bold hover:bg-accent/90 transition-colors cursor-pointer shadow-sm"
                  >
                    <span>Discuss In Interview</span>
                    <ChevronRight size={13} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
