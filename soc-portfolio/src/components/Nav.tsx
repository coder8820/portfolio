"use client";

import { useState, useEffect } from "react";
import { profile } from "@/data/content";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal, ShieldCheck, Radio } from "lucide-react";
import ContactPanel from "./ContactPanel";

interface NavLink {
  href: string;
  label: string;
  path: string;
}

const links: NavLink[] = [
  { href: "#about", label: "about", path: "~/about" },
  { href: "#skills", label: "skills", path: "~/skills" },
  { href: "#projects", label: "projects", path: "~/projects" },
  { href: "#certifications", label: "certs", path: "~/certs" },
  { href: "#contact", label: "contact", path: "~/contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  // Scroll spy to highlight active section & detect scroll depth
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionIds = ["about", "skills", "projects", "certifications", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(`#${id}`);
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-300 font-mono ${
        scrolled
          ? "bg-bg/90 backdrop-blur-md border-b border-line shadow-[0_4px_25px_rgba(0,0,0,0.25)]"
          : "bg-bg/80 backdrop-blur-sm border-b border-line/70"
      }`}
    >
      {/* Top Laser Scanline Animation on Navbar Border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-line/80 overflow-hidden pointer-events-none">
        <div className="h-full w-32 bg-gradient-to-r from-transparent via-accent to-transparent animate-[laserSweep_5s_easeInOut_infinite] opacity-60" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Hacker Terminal Prompt Brand Logo */}
        <a
          href="#"
          className="group flex items-center gap-2 text-xs sm:text-sm text-text font-bold tracking-tight select-none cursor-pointer"
        >
          <div className="w-7 h-7 rounded bg-surface border border-line group-hover:border-accent/60 flex items-center justify-center text-accent transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(57,255,140,0.25)]">
            <Terminal size={14} className="group-hover:scale-110 transition-transform" />
          </div>

          <div className="flex items-center">
            <span className="text-accent font-semibold">soc@</span>
            <span className="text-text group-hover:text-accent transition-colors">
              {profile.name.split(" ")[0].toLowerCase()}
            </span>
            <span className="text-dim mx-0.5">:~$</span>
            <span className="w-1.5 h-3.5 bg-accent/70 inline-block ml-0.5 animate-pulse" />
          </div>
        </a>

        {/* Desktop Animated Navigation Terminal */}
        <div className="hidden lg:flex items-center gap-1 bg-surface-light/80 p-1 rounded-lg border border-line/60">
          {links.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1 rounded text-xs transition-all duration-200 flex items-center gap-1 ${
                  isActive
                    ? "text-accent font-bold"
                    : "text-muted hover:text-text hover:bg-surface/50"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded bg-accent/15 border border-accent/40 shadow-[0_0_10px_rgba(57,255,140,0.15)] -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="text-accent/60 text-[10px]">&gt;</span>
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>

        {/* Medium Screen Nav Links */}
        <div className="hidden sm:flex lg:hidden items-center gap-4 text-xs">
          {links.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive ? "text-accent font-bold" : "text-muted hover:text-accent"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Controls: Live Status, Contact, Mobile Burger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live Telemetry Node Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded border border-line bg-surface text-[10px] text-muted">
            <Radio size={11} className="text-accent animate-pulse" />
            <span className="text-dim">NET:</span>
            <span className="text-accent font-semibold tracking-wider">DEFENSE_UP</span>
          </div>

          {/* Quick Contact Modal / Drawer */}
          <ContactPanel />


          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="flex h-8 w-8 sm:hidden items-center justify-center rounded border border-line bg-surface text-muted hover:text-accent hover:border-accent/40 transition-colors cursor-pointer"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle Navigation Console"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Terminal Navigation Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="sm:hidden border-t border-line bg-bg/95 backdrop-blur-md overflow-hidden"
          >
            {/* Terminal Drawer Header */}
            <div className="px-4 py-2 bg-surface-light border-b border-line flex items-center justify-between text-[10px] text-dim">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                <span>ROUTING_TABLE // SELECT_VECTOR</span>
              </span>
              <span className="text-accent font-semibold">ONLINE</span>
            </div>

            {/* Mobile Nav Links */}
            <div className="px-4 py-3 flex flex-col gap-1.5">
              {links.map((l, idx) => {
                const isActive = activeSection === l.href;
                return (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => setOpen(false)}
                    className={`px-3 py-2 rounded border flex items-center justify-between text-xs transition-all ${
                      isActive
                        ? "bg-accent/15 border-accent text-accent font-bold shadow-sm"
                        : "border-line/60 bg-surface/50 text-muted hover:text-accent hover:border-accent/30"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-accent">&gt;</span>
                      <span>{l.path}</span>
                    </span>
                    {isActive ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-accent text-[#06120c] font-bold">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] text-dim">[0{idx + 1}]</span>
                    )}
                  </motion.a>
                );
              })}
            </div>

            {/* Mobile Drawer Footer Status */}
            <div className="px-4 py-2.5 border-t border-line/60 bg-surface/30 flex items-center justify-between text-[10px] text-dim">
              <span className="flex items-center gap-1 text-accent">
                <ShieldCheck size={11} />
                <span>MITRE SOC DEFENSE</span>
              </span>
              <span>24/7 SURVEILLANCE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
