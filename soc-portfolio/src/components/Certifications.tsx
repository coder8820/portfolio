"use client";

import { useState, useEffect, useId } from "react";
import Image from "next/image";
import { certifications, Certification } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  ShieldCheck,
  Calendar,
  Building,
  CheckCircle2,
  X,
  ExternalLink,
  Award,
  Sparkles,
  Zap,
  Terminal,
  Copy,
  Check,
} from "lucide-react";

const certCategories = [
  "ALL",
  "AI Security",
  "Network Defense",
  "Systems & Apps",
  "Honors & Merit",
] as const;

export default function Certifications() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const certModalId = useId();

  // Escape key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCert]);

  const filteredCerts =
    activeCategory === "ALL"
      ? certifications
      : certifications.filter((c) => c.category === activeCategory);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section
      id="certifications"
      className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20"
    >
      <SectionHeading
        eyebrow="~/certifications"
        title="Security Clearances & Credentials"
        description="Verified cybersecurity accreditations, defensive engineering badges, and technical merit honors."
      />

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 no-scrollbar">
        {certCategories.map((cat) => {
          const count =
            cat === "ALL"
              ? certifications.length
              : certifications.filter((c) => c.category === cat).length;
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

      {/* High-Tech Certificate Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredCerts.map((cert, idx) => (
          <Reveal key={cert.code} delay={(idx % 4) * 0.08}>
            <article
              role="button"
              tabIndex={0}
              onClick={() => setSelectedCert(cert)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedCert(cert);
                }
              }}
              className="panel rounded-md overflow-hidden flex flex-col h-full border border-line hover:border-accent/50 transition-all duration-300 group hover-lift cursor-pointer bg-surface/90 relative"
            >
              {/* Top Cyber Hacking Image Container */}
              <div className="relative h-44 w-full overflow-hidden bg-black/90 border-b border-line">
                <Image
                  src={cert.image}
                  alt={`${cert.name} Cyber Credential Badge`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                {/* Cyber Gradient Shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-black/40 pointer-events-none" />

                {/* Laser Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/10 to-transparent h-10 w-full animate-[laserSweep_4s_easeInOut_infinite] pointer-events-none opacity-40 group-hover:opacity-80" />

                {/* Top Overlay Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                  <span className="font-mono text-[9px] text-accent bg-[#06120c]/85 border border-accent/40 rounded-sm px-2 py-0.5 font-bold tracking-wider backdrop-blur-sm shadow-sm">
                    {cert.code}
                  </span>

                  <span className="inline-flex items-center gap-1 font-mono text-[9px] text-accent bg-[#06120c]/85 border border-accent/40 rounded-sm px-2 py-0.5 font-bold uppercase backdrop-blur-sm shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    VERIFIED
                  </span>
                </div>

                {/* Bottom Badge Level */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="font-mono text-[10px] text-accent font-semibold px-1.5 py-0.5 rounded-sm bg-accent/15 border border-accent/30 backdrop-blur-sm">
                    {cert.badgeLevel}
                  </span>
                  <span className="font-mono text-[10px] text-dim bg-black/70 px-1.5 py-0.5 rounded-sm border border-line">
                    {cert.date}
                  </span>
                </div>
              </div>

              {/* Card Body: Title & Issuer */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-mono font-bold text-text text-sm sm:text-base leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {cert.name}
                  </h3>

                  <p className="mt-1.5 text-xs text-muted flex items-center gap-1.5 truncate">
                    <Building size={12} className="text-dim shrink-0" />
                    <span className="truncate">{cert.issuer}</span>
                  </p>
                </div>

                {/* Skills Chips */}
                <div className="pt-2 border-t border-line/60">
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-surface-light border border-line text-muted truncate max-w-[140px]"
                      >
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 2 && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-surface-light text-dim">
                        +{cert.skills.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-line/40 flex items-center justify-between font-mono text-[11px] text-dim group-hover:text-accent transition-colors">
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    INSPECT CLEARANCE
                  </span>
                  <BadgeCheck size={14} className="text-accent" />
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* FULL CREDENTIAL INSPECTION MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby={certModalId}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="fixed inset-0 bg-surface-overlay backdrop-blur-md cursor-pointer"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-panel border-2 border-accent/40 rounded-md shadow-2xl overflow-hidden flex flex-col z-10 font-mono"
            >
              {/* Terminal Window Header */}
              <div className="px-4 sm:px-6 py-3 border-b border-line bg-panel-raised flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-accent/80 inline-block" />
                  </div>
                  <span className="text-dim text-xs ml-2 font-mono">
                    clearance_credential_{selectedCert.code.toLowerCase()}.sh
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(selectedCert.code)}
                    className="flex items-center gap-1 font-mono text-[11px] px-2.5 py-1 rounded-sm border border-line bg-panel text-muted hover:border-accent hover:text-accent transition-colors cursor-pointer"
                    title="Copy Credential ID"
                  >
                    {copiedCode ? (
                      <>
                        <Check size={12} className="text-accent" />
                        <span className="text-accent">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    aria-label="Close credential view"
                    className="p-1 rounded-sm text-dim hover:text-text hover:bg-panel-raised transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Full-width Hacking Certificate Visual */}
              <div className="relative h-56 sm:h-64 w-full bg-black overflow-hidden border-b border-line">
                <Image
                  src={selectedCert.image}
                  alt={selectedCert.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-black/30" />

                {/* Insignia Overlay */}
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <div>
                    <span className="font-mono text-xs text-accent font-bold px-2 py-0.5 rounded-sm bg-[#06120c]/90 border border-accent/40">
                      {selectedCert.code}
                    </span>
                    <h2 id={certModalId} className="text-lg sm:text-2xl font-bold text-white mt-2 drop-shadow-md">
                      {selectedCert.name}
                    </h2>
                  </div>

                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-accent bg-[#06120c]/90 border border-accent/50 rounded-sm px-2.5 py-1 font-bold">
                    <ShieldCheck size={14} className="text-accent" />
                    CRYPTOGRAPHICALLY VERIFIED
                  </span>
                </div>
              </div>

              {/* Modal Body Details */}
              <div className="p-5 sm:p-6 space-y-5 text-xs text-text bg-panel">
                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-sm bg-panel-raised border border-line">
                    <span className="text-[10px] text-dim uppercase block">ISSUING AUTHORITY</span>
                    <span className="text-xs font-bold text-text mt-1 block truncate">
                      {selectedCert.issuer}
                    </span>
                  </div>

                  <div className="p-3 rounded-sm bg-panel-raised border border-line">
                    <span className="text-[10px] text-dim uppercase block">ISSUED YEAR</span>
                    <span className="text-xs font-bold text-text mt-1 block flex items-center gap-1">
                      <Calendar size={12} className="text-accent" />
                      {selectedCert.date}
                    </span>
                  </div>

                  <div className="p-3 rounded-sm bg-panel-raised border border-line">
                    <span className="text-[10px] text-dim uppercase block">CLASSIFICATION</span>
                    <span className="text-xs font-bold text-accent mt-1 block">
                      {selectedCert.badgeLevel}
                    </span>
                  </div>

                  <div className="p-3 rounded-sm bg-panel-raised border border-line">
                    <span className="text-[10px] text-dim uppercase block">DOMAIN</span>
                    <span className="text-xs font-bold text-text mt-1 block">
                      {selectedCert.category}
                    </span>
                  </div>
                </div>

                {/* Verified Skills & Proficiencies */}
                <div>
                  <span className="text-[10px] text-dim uppercase tracking-wider font-bold block mb-2.5 flex items-center gap-1.5">
                    <Zap size={12} className="text-accent" />
                    <span>VERIFIED CORE COMPETENCIES</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-sm bg-panel-raised border border-line text-xs font-mono text-text flex items-center gap-1.5"
                      >
                        <CheckCircle2 size={13} className="text-accent" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Clearance Note */}
                <div className="p-3.5 rounded-sm bg-accent/10 border border-accent/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-accent shrink-0" />
                    <span className="text-[11px] text-text font-sans">
                      Official credential authenticated for enterprise cybersecurity and defensive SOC deployments.
                    </span>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono text-accent font-bold border border-accent/40 bg-accent/15 px-2 py-0.5 rounded-sm">
                    SOC READY
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3.5 border-t border-line bg-panel-raised flex items-center justify-between shrink-0">
                <span className="text-dim text-[11px] font-mono">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-panel border border-line text-text">ESC</kbd> to return
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-1.5 rounded-sm bg-accent text-[#06120c] font-mono text-xs font-bold hover:bg-accent/90 transition-colors cursor-pointer shadow-sm"
                >
                  Close Clearance View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
