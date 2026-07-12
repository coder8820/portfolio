import { projects, Severity } from "@/data/content";
import SectionHeading from "./SectionHeading";

const sevStyle: Record<Severity, string> = {
  critical: "text-red border-red/40 bg-red/10",
  high: "text-amber border-amber/40 bg-amber/10",
  medium: "text-blue border-blue/40 bg-blue/10",
  info: "text-muted border-line bg-white/5",
};

const statusStyle: Record<string, string> = {
  Deployed: "text-accent",
  Completed: "text-accent",
  "In Progress": "text-amber",
};

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <SectionHeading
        eyebrow="~/projects"
        title="Incident reports"
        description="Selected hands-on projects, logged in SOC ticket format."
      />

      <div className="grid md:grid-cols-2 gap-5">
        {projects.map((p) => (
          <article
            key={p.id}
            className="panel rounded-md overflow-hidden flex flex-col"
          >
            <div className="panel-header px-5 py-3 flex items-center justify-between">
              <span className="font-mono text-[11px] text-dim">{p.id}</span>
              <span
                className={`font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-sm border ${sevStyle[p.severityLabel]}`}
              >
                {p.severityLabel}
              </span>
            </div>

            <div className="p-5 flex flex-col gap-4 flex-1">
              <div>
                <h3 className="font-mono font-bold text-text text-base sm:text-lg">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">
                  {p.summary}
                </p>
              </div>

              <dl className="text-xs font-mono space-y-2 border-t border-line pt-3">
                <div>
                  <dt className="text-dim uppercase text-[10px] tracking-wide mb-0.5">
                    Problem
                  </dt>
                  <dd className="text-muted leading-relaxed">{p.problem}</dd>
                </div>
                <div>
                  <dt className="text-dim uppercase text-[10px] tracking-wide mb-0.5">
                    Approach
                  </dt>
                  <dd className="text-muted leading-relaxed">{p.approach}</dd>
                </div>
                <div>
                  <dt className="text-dim uppercase text-[10px] tracking-wide mb-0.5">
                    Outcome
                  </dt>
                  <dd className="text-accent leading-relaxed">{p.outcome}</dd>
                </div>
              </dl>

              <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {p.tools.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-1 rounded-sm bg-white/5 border border-line text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-5 py-2.5 border-t border-line bg-black/20 flex items-center justify-between font-mono text-[11px]">
              <span className="text-dim">status</span>
              <span className={statusStyle[p.status]}>{p.status}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
