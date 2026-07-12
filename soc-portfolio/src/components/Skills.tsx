import { skillCategories } from "@/data/content";
import SectionHeading from "./SectionHeading";
import TerminalWindow from "./TerminalWindow";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <SectionHeading
        eyebrow="~/skills"
        title="Tool inventory"
        description="Signal strength reflects hands-on lab / project experience, not certification alone."
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {skillCategories.map((cat) => (
          <TerminalWindow key={cat.label} title={cat.label}>
            <div className="space-y-4">
              {cat.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between font-mono text-xs mb-1.5">
                    <span className="text-text">{skill.name}</span>
                    <span className="text-dim">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-line rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-dim to-accent rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TerminalWindow>
        ))}
      </div>
    </section>
  );
}
