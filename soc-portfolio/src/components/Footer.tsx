'use client';

import { profile } from '@/data/content';
import { Mail, ArrowUp, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

// inline SVGs — lucide-react no longer ships brand/logo icons
const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .32.21.67.8.56A10.52 10.52 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"/>
  </svg>
);

export default function Footer() {
  const [time, setTime] = useState<string>('');
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();

    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC',
        }) + ' UTC',
      );
      setUptime(Math.floor((Date.now() - startedAt) / 1000));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (secs: number) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-10 border-t border-line">
      {/* ===== live status strip ===== */}
      <div className="border-b border-line bg-black/20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 font-mono text-[10.5px] text-dim sm:px-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-accent">SYSTEM OPERATIONAL</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span>
              SESSION_UPTIME: <span className="text-muted">{formatUptime(uptime)}</span>
            </span>
            <span>
              UTC: <span className="text-muted">{time || '--:--:--'}</span>
            </span>
            <span className="flex items-center gap-1.5 text-muted">
              <ShieldCheck size={11} className="text-accent" />
              ENCRYPTED
            </span>
          </div>
        </div>
      </div>

      {/* ===== main footer content ===== */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          {/* left: identity */}
          <div className="text-center sm:text-left">
            <p className="font-mono text-sm font-semibold text-text">
              {profile.name}
            </p>
            <p className="mt-1 font-mono text-[11px] text-dim">
              © {new Date().getFullYear()} — all systems monitored.
            </p>
          </div>

          {/* middle: quick links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] text-muted">
            <a href="#projects" className="transition-colors hover:text-accent">
              projects
            </a>
            <a href="#certifications" className="transition-colors hover:text-accent">
              certifications
            </a>
            <a href="#skills" className="transition-colors hover:text-accent">
              skills
            </a>
            <a href="#contact" className="transition-colors hover:text-accent">
              contact
            </a>
          </nav>

          {/* right: social + back to top */}
          <div className="flex items-center gap-3">
            {profile.github && (
              
                <a href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:border-accent-dim hover:text-accent"
              >
                <GithubIcon />
              </a>
            )}
            {profile.linkedin && (
              
                <a href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:border-accent-dim hover:text-accent"
              >
                <LinkedinIcon />
              </a>
            )}
            {profile.email && (
              
               <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:border-accent-dim hover:text-accent"
              >
                <Mail size={14} />
              </a>
            )}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:border-accent-dim hover:text-accent"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* bottom tagline */}
        <div className="mt-8 border-t border-line pt-5 text-center font-mono text-[10.5px] text-dim">
          built with Next.js · deployed for defense, not offense
        </div>
      </div>
    </footer>
  );
}