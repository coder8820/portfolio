"use client";

import { useState, useEffect, useId } from "react";
import Image from "next/image";
import { certifications, Certification } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldCheck,
  Calendar,
  Building2,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  ArrowUpRight,
  Shield,
  FileCheck2,
} from "lucide-react";

const certCategories = [
  "ALL",
  "AI Security",
  "Network Defense",
  "Systems & Apps",
  "Honors & Merit",
] as const;

const INITIAL_VISIBLE_COUNT = 6; // Exactly 2 rows of 3 cards each

export default function Certifications() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

  // When category changes, reset expansion state
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setIsExpanded(false);
  };

  const filteredCerts =
    activeCategory === "ALL"
      ? certifications
      : certifications.filter((c) => c.category === activeCategory);

  const visibleCerts = isExpanded
    ? filteredCerts
    : filteredCerts.slice(0, INITIAL_VISIBLE_COUNT);

  const hasMore = filteredCerts.length > INITIAL_VISIBLE_COUNT;
  const remainingCount = filteredCerts.length - INITIAL_VISIBLE_COUNT;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section
      id="certifications"
      className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20"
    >
      <SectionHeading
        eyebrow="~/certifications"
        title="Security Clearances & Credentials"
        description="Verified cybersecurity accreditations, defensive engineering badges, and technical merit honors."
      />

      {/* Category Filter Pills & Telemetry Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
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
                onClick={() => handleCategoryChange(cat)}
                className={`font-mono text-xs px-3.5 py-1.5 rounded-md border whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-accent text-[#06120c] font-bold border-accent shadow-[0_0_15px_rgba(57,255,140,0.25)]"
                    : "bg-surface-light border-line text-muted hover:border-accent/40 hover:text-text"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-sm font-mono ${
                    isActive
                      ? "bg-[#06120c]/25 text-[#06120c] font-bold"
                      : "bg-surface text-dim border border-line"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Telemetry Counter */}
        <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-muted self-end sm:self-auto bg-surface-light px-3 py-1.5 rounded-md border border-line">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-dim">STATUS:</span>
          <span className="text-accent font-semibold">
            {visibleCerts.length}/{filteredCerts.length} DISPLAYED
          </span>
        </div>
      </div>

      {/* 3 Columns Per Row High-Tech Certificate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {visibleCerts.map((cert, idx) => (
            <motion.div
              key={cert.code}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, delay: (idx % 6) * 0.05 }}
              className="h-full"
            >
              <Reveal delay={(idx % 3) * 0.06}>
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
                  className="group relative rounded-lg border border-line bg-panel/90 backdrop-blur-sm overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,255,140,0.10)] flex flex-col justify-between h-full cursor-pointer hover-lift"
                >
                  {/* Subtle HUD Corner Accents */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-accent/0 group-hover:border-accent/80 transition-all duration-300 z-20 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-accent/0 group-hover:border-accent/80 transition-all duration-300 z-20 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-accent/0 group-hover:border-accent/80 transition-all duration-300 z-20 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-accent/0 group-hover:border-accent/80 transition-all duration-300 z-20 pointer-events-none" />

                  {/* Compact Visual Preview Container */}
                  <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-black/95 border-b border-line">
                    <Image
                      src={cert.image}
                      alt={`${cert.name} Cyber Credential Badge`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />

                    {/* Cyber Gradient Shadow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-black/45 pointer-events-none" />

                    {/* Laser Scanline Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/15 to-transparent h-10 w-full animate-[laserSweep_4s_easeInOut_infinite] pointer-events-none opacity-30 group-hover:opacity-80" />

                    {/* Top Overlay Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none z-10">
                      <span className="font-mono text-[9px] text-accent bg-[#06120c]/85 border border-accent/40 rounded px-2 py-0.5 font-bold tracking-wider backdrop-blur-md shadow-sm flex items-center gap-1">
                        <Shield size={9} className="text-accent" />
                        {cert.code}
                      </span>

                      <span className="inline-flex items-center gap-1 font-mono text-[8px] text-accent bg-[#06120c]/85 border border-accent/40 rounded px-1.5 py-0.5 font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        VERIFIED
                      </span>
                    </div>

                    {/* Middle Hover Prompt */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px] z-10 pointer-events-none">
                      <span className="font-mono text-[10px] font-bold text-accent bg-[#06120c]/90 px-2.5 py-1 rounded border border-accent/50 flex items-center gap-1.5 shadow-md">
                        <Eye size={11} />
                        <span>INSPECT</span>
                      </span>
                    </div>

                    {/* Bottom Badge Classification & Year */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
                      <span className="font-mono text-[9px] text-accent font-semibold px-1.5 py-0.2 rounded bg-accent/20 border border-accent/35 backdrop-blur-md">
                        {cert.badgeLevel}
                      </span>
                      <span className="font-mono text-[9px] text-dim bg-black/75 px-1.5 py-0.2 rounded border border-line backdrop-blur-md flex items-center gap-1">
                        <Calendar size={9} className="text-dim" />
                        {cert.date}
                      </span>
                    </div>
                  </div>

                  {/* Compact Card Body: Title, Issuer, Skills */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
                    <div>
                      {/* Category Tag */}
                      <span className="text-[9px] font-mono text-dim tracking-wider uppercase mb-0.5 block">
                        {`// ${cert.category}`}
                      </span>

                      {/* Certificate Name - Professional font scale */}
                      <h3 className="font-mono font-semibold text-text text-xs sm:text-sm leading-snug group-hover:text-accent transition-colors line-clamp-1">
                        {cert.name}
                      </h3>

                      {/* Issuer */}
                      <p className="mt-1 text-[11px] text-muted flex items-center gap-1.5">
                        <Building2 size={11} className="text-dim shrink-0" />
                        <span className="truncate">{cert.issuer}</span>
                      </p>
                    </div>

                    {/* Skills Chips - Clean & Minimal */}
                    <div className="pt-2 border-t border-line/50">
                      <div className="flex flex-wrap gap-1">
                        {cert.skills.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-light border border-line/60 text-muted group-hover:border-accent/25 transition-colors truncate max-w-[130px]"
                          >
                            #{skill}
                          </span>
                        ))}
                        {cert.skills.length > 2 && (
                          <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-surface-light text-dim">
                            +{cert.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Call to Action */}
                    <div className="pt-2 border-t border-line/50 flex items-center justify-between font-mono text-[10px] text-dim group-hover:text-accent transition-colors">
                      <span className="text-[10px] uppercase font-medium tracking-wider flex items-center gap-1">
                        <FileCheck2 size={11} className="text-accent" />
                        CLEARANCE RECORD
                      </span>
                      <ArrowUpRight
                        size={13}
                        className="text-dim group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      />
                    </div>
                  </div>
                </article>
              </Reveal>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* VIEW MORE / SHOW LESS TOGGLE BUTTON */}
      {hasMore && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-panel/70 border border-line">
          <div className="font-mono text-xs text-muted flex items-center gap-2 text-center sm:text-left">
            <span className="text-accent font-bold">&gt;_</span>
            <span>
              {isExpanded
                ? "Full clearance dossier expanded."
                : `Showing 6 of ${filteredCerts.length} credentials (2 lines of 3).`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full sm:w-auto font-mono text-xs font-bold px-6 py-2.5 rounded-lg border border-accent/50 bg-accent/10 text-accent hover:bg-accent hover:text-[#06120c] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(57,255,140,0.12)] hover:shadow-[0_0_25px_rgba(57,255,140,0.3)] active:scale-95"
          >
            {isExpanded ? (
              <>
                <span>COLLAPSE CREDENTIALS</span>
                <ChevronUp size={15} />
              </>
            ) : (
              <>
                <span>VIEW MORE CERTIFICATES (+{remainingCount})</span>
                <ChevronDown size={15} />
              </>
            )}
          </button>
        </div>
      )}

      {/* COMPACT & SCREEN-FITTED CREDENTIAL INSPECTION MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-hidden"
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

            {/* Modal Container: Max 2rem margin (p-8 on parent), tight & fitting on any screen without scroll */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-panel border-2 border-accent/40 rounded-lg shadow-2xl overflow-hidden flex flex-col z-10 font-mono max-h-[calc(100vh-4rem)]"
            >
              {/* Terminal Window Header */}
              <div className="px-3.5 sm:px-4 py-2 border-b border-line bg-panel-raised flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-red/80 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-amber/80 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-accent/80 inline-block" />
                  </div>
                  <span className="text-dim text-[11px] ml-1.5 font-mono truncate max-w-[200px]">
                    clearance_{selectedCert.code.toLowerCase()}.sig
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(selectedCert.code)}
                    className="flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border border-line bg-panel text-muted hover:border-accent hover:text-accent transition-colors cursor-pointer"
                    title="Copy Credential ID"
                  >
                    {copiedCode ? (
                      <>
                        <Check size={11} className="text-accent" />
                        <span className="text-accent">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    aria-label="Close credential view"
                    className="p-1 rounded text-dim hover:text-text hover:bg-panel-raised transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Compact Certificate Visual Display */}
              <div className="relative h-28 sm:h-32 w-full bg-black overflow-hidden border-b border-line shrink-0">
                <Image
                  src={selectedCert.image}
                  alt={selectedCert.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/30 to-black/50" />

                {/* Insignia Overlay */}
                <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-end justify-between gap-2">
                  <div className="truncate">
                    <span className="font-mono text-[9px] text-accent font-bold px-1.5 py-0.2 rounded bg-[#06120c]/90 border border-accent/40 shadow">
                      {selectedCert.code}
                    </span>
                    <h2
                      id={certModalId}
                      className="text-sm sm:text-base font-bold text-white mt-1 drop-shadow-md leading-tight truncate"
                    >
                      {selectedCert.name}
                    </h2>
                  </div>

                  <span className="inline-flex items-center gap-1 font-mono text-[9px] text-accent bg-[#06120c]/90 border border-accent/50 rounded px-2 py-0.5 font-bold shrink-0">
                    <ShieldCheck size={11} className="text-accent" />
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Modal Body Details - Tight & Compact */}
              <div className="p-3.5 space-y-2.5 text-xs text-text bg-panel overflow-y-auto">
                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 rounded bg-panel-raised border border-line">
                    <span className="text-[9px] text-dim uppercase block">ISSUER</span>
                    <span className="text-[11px] font-bold text-text mt-0.5 block truncate">
                      {selectedCert.issuer}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-panel-raised border border-line">
                    <span className="text-[9px] text-dim uppercase block">YEAR</span>
                    <span className="text-[11px] font-bold text-text mt-0.5 block flex items-center gap-1">
                      <Calendar size={10} className="text-accent" />
                      {selectedCert.date}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-panel-raised border border-line">
                    <span className="text-[9px] text-dim uppercase block">LEVEL</span>
                    <span className="text-[11px] font-bold text-accent mt-0.5 block truncate">
                      {selectedCert.badgeLevel}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-panel-raised border border-line">
                    <span className="text-[9px] text-dim uppercase block">DOMAIN</span>
                    <span className="text-[11px] font-bold text-text mt-0.5 block truncate">
                      {selectedCert.category}
                    </span>
                  </div>
                </div>

                {/* Verified Skills & Proficiencies */}
                <div>
                  <span className="text-[9px] text-dim uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1">
                    <Zap size={10} className="text-accent" />
                    <span>VERIFIED COMPETENCIES</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded bg-panel-raised border border-line text-[10px] font-mono text-text flex items-center gap-1"
                      >
                        <CheckCircle2 size={11} className="text-accent" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Compact Clearance Note */}
                <div className="p-2.5 rounded bg-accent/10 border border-accent/25 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-accent shrink-0" />
                    <span className="text-[10px] text-text font-sans">
                      Authenticated clearance for defensive SOC workflows & security engineering.
                    </span>
                  </div>
                  <span className="shrink-0 text-[9px] font-mono text-accent font-bold border border-accent/40 bg-accent/15 px-1.5 py-0.5 rounded">
                    AUTHENTIC
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-3.5 py-2 border-t border-line bg-panel-raised flex items-center justify-between shrink-0">
                <span className="text-dim text-[10px] font-mono">
                  Press <kbd className="px-1 py-0.2 rounded bg-panel border border-line text-text text-[9px]">ESC</kbd> to return
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="px-3 py-1 rounded bg-accent text-[#06120c] font-mono text-[11px] font-bold hover:bg-accent/90 transition-colors cursor-pointer shadow-sm"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
