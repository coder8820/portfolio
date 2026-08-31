"use client";

import { skillCategories } from "@/data/content";
import SectionHeading from "./SectionHeading";
import TerminalWindow from "./TerminalWindow";
import Reveal from "./Reveal";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <SectionHeading
        eyebrow="~/skills"
        title="Tool inventory"
        description="Signal strength reflects hands-on lab / project experience, not certification alone."
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {skillCategories.map((cat, idx) => (
          <Reveal key={cat.label} delay={(idx % 2) * 0.12}>
            <TerminalWindow title={cat.label}>
              <div className="space-y-4">
                {cat.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between font-mono text-xs mb-1.5">
                      <span className="text-text">{skill.name}</span>
                      <span className="text-dim">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-line rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-dim to-accent rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TerminalWindow>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
