"use client";

import { useState } from "react";
import { profile } from "@/data/content";
import { Menu, X, ShieldHalf } from "lucide-react";
import ContactModal from "./ContactModal";

const links = [
  { href: "#about", label: "about" },
  { href: "#skills", label: "skills" },
  { href: "#projects", label: "projects" },
  { href: "#certifications", label: "certs" },
  { href: "#contact", label: "contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-bg/85 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-mono text-sm text-text">
          <ShieldHalf size={18} className="text-accent" />
          <span className="font-semibold">{profile.name.split(" ")[0].toLowerCase()}</span>
          <span className="text-dim">/soc</span>
        </a>

        <div className="hidden sm:flex items-center gap-6 font-mono text-sm">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-muted hover:text-accent transition-colors"
            >
              {l.label}
            </a>
          ))}
          <ContactModal />
        </div>

        <div className="flex items-center gap-3 sm:hidden">
          <ContactModal />
          <button
            className="text-muted"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="sm:hidden border-t border-line px-4 py-3 flex flex-col gap-3 font-mono text-sm bg-bg">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-muted hover:text-accent transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
