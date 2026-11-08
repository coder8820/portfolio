"use client";

import { useState } from "react";

export default function CyberScanningEye() {
  const [locked, setLocked] = useState(false);

  return (
    <div
      onMouseEnter={() => setLocked(true)}
      onMouseLeave={() => setLocked(false)}
      className="group relative flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-panel border border-accent/40 shadow-[0_2px_10px_rgba(0,0,0,0.06),0_1px_3px_rgba(10,143,92,0.12)] dark:bg-[#070d0a]/95 dark:border-accent/40 dark:shadow-[0_0_18px_rgba(57,255,140,0.2)] transition-all duration-300 hover:border-accent hover:shadow-[0_4px_16px_rgba(10,143,92,0.22)] dark:hover:shadow-[0_0_24px_rgba(57,255,140,0.4)] select-none cursor-crosshair"
      title="Optical Threat Scanner // Hover to acquire target lock"
    >
      {/* Outer corner cyber brackets */}
      <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-accent pointer-events-none" />
      <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-accent pointer-events-none" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-accent pointer-events-none" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-accent pointer-events-none" />

      {/* Cyber Eye Viewport */}
      <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
        {/* Pulsing aperture background aura */}
        <div className="absolute inset-0 rounded-full bg-accent/20 dark:bg-accent/15 animate-ping opacity-25 pointer-events-none" />

        {/* Rotating outer aperture ring */}
        <svg
          className="absolute inset-0 w-full h-full text-accent/70 dark:text-accent/50 animate-[spin_10s_linear_infinite]"
          viewBox="0 0 40 40"
        >
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeDasharray="4 3 8 3"
          />
        </svg>

        {/* Counter-rotating inner reticle */}
        <svg
          className="absolute inset-1 w-full h-full text-accent/80 dark:text-accent/60 animate-[spin_6s_linear_infinite_reverse]"
          viewBox="0 0 36 36"
        >
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="2 4"
          />
        </svg>

        {/* Main Eye Graphics */}
        <div className="relative w-7 h-5 sm:w-8 sm:h-5.5 overflow-hidden flex items-center justify-center">
          <svg
            className="w-full h-full text-accent drop-shadow-sm dark:drop-shadow-[0_0_5px_var(--accent)]"
            viewBox="0 0 44 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Upper and Lower Cyber Eyelid Arcs */}
            <path
              d="M 3 13 C 13 2, 31 2, 41 13"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 3 13 C 13 24, 31 24, 41 13"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Corner Tech Nodes */}
            <circle cx="3" cy="13" r="1.6" fill="currentColor" />
            <circle cx="41" cy="13" r="1.6" fill="currentColor" />

            {/* Eyelid Crease Accents */}
            <path
              d="M 11 5 C 18 2.5, 26 2.5, 33 5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeOpacity="0.5"
              strokeDasharray="2 2"
            />
            <path
              d="M 11 21 C 18 23.5, 26 23.5, 33 21"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeOpacity="0.5"
              strokeDasharray="2 2"
            />
          </svg>

          {/* Animated Scanning Iris & Pupil */}
          <div className="absolute inset-0 flex items-center justify-center animate-[eyePupilScan_4.5s_easeInOut_infinite] pointer-events-none">
            {/* Iris */}
            <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full border-2 border-accent flex items-center justify-center bg-accent/25 shadow-sm dark:shadow-[0_0_6px_var(--accent)]">
              {/* Radial tick lines */}
              <div className="absolute inset-0.5 border border-dashed border-accent/80 rounded-full" />
              {/* Pupil Core */}
              <div className="w-2 h-2 rounded-full bg-accent flex items-center justify-center shadow-sm dark:shadow-[0_0_8px_var(--accent)]">
                {/* Center target laser dot */}
                <div className="w-0.5 h-0.5 rounded-full bg-panel dark:bg-[#0a0f0d]" />
              </div>
            </div>
          </div>

          {/* Vertical Laser Scanline */}
          <div className="absolute inset-y-0 w-0.5 bg-accent shadow-[0_0_6px_var(--accent)] dark:shadow-[0_0_8px_#39ff8c,0_0_14px_#39ff8c] animate-[laserSweep_2.2s_easeInOut_infinite] pointer-events-none" />

          {/* Faint CRT scanline overlay (dark mode only) */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_2px] pointer-events-none opacity-0 dark:opacity-30" />
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="h-6 w-[1px] bg-line/80 dark:bg-accent/20 mx-0.5" />

      {/* Professional Telemetry Readout */}
      <div className="flex flex-col text-left justify-center pr-1">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                locked ? "bg-red" : "bg-accent"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                locked ? "bg-red" : "bg-accent"
              }`}
            />
          </span>
          <span className="font-mono text-[10px] font-bold tracking-wider text-text uppercase">
            {locked ? "TARGET LOCKED" : "OCULAR MONITOR"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px] leading-none">
          <span className="text-muted tracking-tight">STATUS:</span>
          <span
            className={`px-1.5 py-0.5 rounded-sm font-semibold tracking-wider text-[8.5px] border ${
              locked
                ? "bg-red/10 border-red/40 text-red"
                : "bg-accent/10 border-accent/40 text-accent"
            }`}
          >
            {locked ? "VERIFIED" : "ACTIVE"}
          </span>
        </div>
      </div>
    </div>
  );
}
