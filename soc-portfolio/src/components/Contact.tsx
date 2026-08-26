import { profile } from "@/data/content";
import SectionHeading from "./SectionHeading";
import TerminalWindow from "./TerminalWindow";
import { Mail, Code2, Briefcase, Flag } from "lucide-react";

const channels = [
  { icon: Mail, label: "Email", value: profile.email, href: `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}` },
  { icon: Code2, label: "GitHub", value: "View repos", href: profile.github },
  { icon: Briefcase, label: "LinkedIn", value: "Connect", href: profile.linkedin },
  { icon: Flag, label: "TryHackMe", value: "View profile", href: profile.tryhackme },
];
// this is a list of contact channels that will be displayed in the contact section. Each channel has an icon, label, value, and href.
export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <SectionHeading
        eyebrow="~/contact"
        title="Open a channel"
        description="Hiring for a blue team or SOC role? Reach out — happy to walk through any project in detail."
      />

      <TerminalWindow title="contact.sh">
        <div className="grid sm:grid-cols-2 gap-4">
          {channels.map((c) => {
            const Icon = c.icon;
            return (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 rounded-sm border border-line px-4 py-3 hover:border-accent-dim hover:bg-surface-tint transition-colors group"
            >
              <Icon size={18} className="text-accent shrink-0" />
              <div className="min-w-0">
                <div className="font-mono text-[11px] text-dim uppercase tracking-wide">
                  {c.label}
                </div>
                <div className="text-sm text-text truncate group-hover:text-accent transition-colors">
                  {c.value}
                </div>
              </div>
            </a>
            );
          })}
        </div>
      </TerminalWindow>
    </section>
  );
}
