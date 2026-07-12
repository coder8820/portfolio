import { certifications } from "@/data/content";
import SectionHeading from "./SectionHeading";
import { BadgeCheck } from "lucide-react";

export default function Certifications() {
  return (
    <section id="certifications" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <SectionHeading eyebrow="~/certifications" title="Clearance badges" />

      <div className="grid sm:grid-cols-2 gap-5">
        {certifications.map((cert) => (
          <div
            key={cert.code}
            className="panel rounded-md p-5 flex items-center gap-4"
          >
            <div className="shrink-0 w-12 h-12 rounded-sm bg-accent/10 border border-accent-dim/40 flex items-center justify-center">
              <BadgeCheck size={22} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-mono font-semibold text-text text-sm">
                {cert.name}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                {cert.issuer} — {cert.date}
              </p>
            </div>
            <span className="font-mono text-[10px] text-dim shrink-0">
              {cert.code}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
