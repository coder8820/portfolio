import { profile } from "@/data/content";

export default function Footer() {
  return (
    <footer className="border-t border-line mt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-dim">
        <span>© {new Date().getFullYear()} {profile.name} — all systems monitored.</span>
        <span>built with Next.js · deployed for defense, not offense</span>
      </div>
    </footer>
  );
}
