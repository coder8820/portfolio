import { profile } from "@/data/content";
import SectionHeading from "./SectionHeading";
import TerminalWindow from "./TerminalWindow";
import { ShieldCheck, Radar, Terminal } from "lucide-react";

// this is focusArea
const focusAreas = [
  {
    icon: Radar,
    title: "Detection & Monitoring",
    text: "Building and tuning SIEM rules to catch real threats without drowning analysts in noise.",
  },
  {
    icon: Terminal,
    title: "Log & Traffic Analysis",
    text: "Reading packet captures and event logs like a story — reconstructing what actually happened.",
  },
  {
    icon: ShieldCheck,
    title: "Incident Response",
    text: "Triaging alerts, correlating cross-platform evidence, and documenting findings clearly.",
  },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <SectionHeading
        eyebrow="~/about"
        title="Analyst profile"
        description="A quick brief on who I am and where I focus."
      />

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <TerminalWindow title="whoami --verbose">
            <dl className="font-mono text-xs sm:text-sm space-y-3">
              <div className="flex justify-between border-b border-line pb-2">
                <dt className="text-dim">name</dt>
                <dd className="text-text">{profile.name}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <dt className="text-dim">role</dt>
                <dd className="text-accent">{profile.role}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <dt className="text-dim">location</dt>
                <dd className="text-text">{profile.location}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dim">status</dt>
                <dd className="text-amber">open to opportunities</dd>
              </div>
            </dl>
          </TerminalWindow>
        </div>

        <div className="lg:col-span-3 grid sm:grid-cols-1 gap-4">
          {focusAreas.map((area) => {
            const Icon = area.icon;
            return (
            <div
              key={area.title}
              className="panel rounded-md p-5 flex gap-4 items-start"
            >
              <div className="shrink-0 w-9 h-9 rounded-sm bg-accent/10 border border-accent-dim/40 flex items-center justify-center">
                <Icon size={17} className="text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-text font-mono text-sm">
                  {area.title}
                </h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  {area.text}
                </p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
