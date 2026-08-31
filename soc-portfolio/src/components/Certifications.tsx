"use client";

import { certifications } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { BadgeCheck, ExternalLink } from "lucide-react";

// Certifications component — presented as formal credential cards:
// accent bar, credential-id pill, static "Verified" status, and a
// hairline divider separating identity from issuing details.
export default function Certifications() {
  return (
    <section
      id="certifications"
      className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20"
    >
      <SectionHeading eyebrow="~/certifications" title="Clearance badges" />

      <div className="mt-10 grid sm:grid-cols-2 gap-5">
        {certifications.map((cert, idx) => (
          <Reveal key={cert.code} delay={(idx % 2) * 0.1}>
          <div
            className="relative panel rounded-md overflow-hidden transition-shadow duration-200 hover:shadow-md hover:border-accent/40 hover-lift"
          >
            {/* top accent bar */}
            <div className="h-[3px] w-full bg-gradient-to-r from-accent via-accent/60 to-transparent" />

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 w-10 h-10 rounded-sm bg-accent/10 border border-accent-dim/40 flex items-center justify-center">
                    <BadgeCheck size={18} className="text-accent" />
                  </div>
                  <h3 className="font-mono font-semibold text-text text-sm leading-tight truncate">
                    {cert.name}
                  </h3>
                </div>

                <span className="shrink-0 font-mono text-[10px] text-dim border border-accent-dim/30 rounded-sm px-1.5 py-0.5">
                  {cert.code}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-accent-dim/20 flex items-center justify-between gap-3">
                <p className="text-xs text-muted min-w-0 truncate">
                  {cert.issuer} <span className="text-dim">·</span> {cert.date}
                </p>

                <span className="shrink-0 inline-flex items-center gap-1 font-mono text-[10px] tracking-wide text-accent bg-accent/10 border border-accent-dim/30 rounded-sm px-1.5 py-0.5">
                  Verified
                </span>
              </div>

              {"url" in cert && (cert as { url?: string }).url && (
                
                  <a href={(cert as { url?: string }).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono text-accent hover:underline"
                >
                  View credential
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}