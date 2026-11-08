"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import CyberScanningEye from "./CyberScanningEye";

interface HackerAvatarProps {
  primarySrc?: string;
  secondarySrc?: string;
  name?: string;
}

export default function HackerAvatar({
  primarySrc = "/mypic.jpg",
  secondarySrc = "/mypic2.png",
  name = "Kumail Abbas — SOC Analyst",
}: HackerAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Active if hovered OR toggled via click
  const isOverridden = isHovered || isLocked;

  const handleToggle = () => {
    setIsLocked((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main Avatar Container */}
      <div className="profile-ring relative mb-4">
        {/* Outer Pulsing Aura Ring */}
        <div
          className={`profile-ring-glow transition-all duration-500 ${
            isOverridden
              ? "!shadow-[0_0_40px_rgba(57,255,140,0.35)]"
              : "!shadow-[0_0_35px_rgba(57,255,140,0.25)]"
          }`}
        />

        {/* Outer Rotating Reticle Ring */}
        <svg
          className="absolute -inset-2.5 sm:-inset-3 w-[calc(100%+20px)] sm:w-[calc(100%+24px)] h-[calc(100%+20px)] sm:h-[calc(100%+24px)] pointer-events-none transition-colors duration-500 text-accent/40 animate-[spin_12s_linear_infinite]"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 8 12 6"
          />
        </svg>

        {/* Counter Rotating Inner Reticle */}
        <svg
          className="absolute -inset-1 sm:-inset-1.5 w-[calc(100%+8px)] sm:w-[calc(100%+12px)] h-[calc(100%+8px)] sm:h-[calc(100%+12px)] pointer-events-none transition-colors duration-500 text-accent/30 animate-[spin_16s_linear_infinite_reverse]"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 6"
          />
        </svg>

        {/* Clickable & Hoverable Interactive Profile Circle */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            }
          }}
          className={`relative z-10 w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 transition-all duration-300 cursor-pointer select-none group bg-black/90 ${
            isOverridden
              ? "border-accent shadow-[0_0_28px_rgba(57,255,140,0.4)]"
              : "border-accent/40 hover:border-accent shadow-[0_0_20px_rgba(57,255,140,0.2)]"
          }`}
          title="Kumail Abbas"
        >
          {/* Base Image: mypic.jpg */}
          <motion.div
            initial={false}
            animate={{
              opacity: isOverridden ? 0 : 1,
              scale: isOverridden ? 1.06 : 1,
              filter: isOverridden
                ? "blur(3px) brightness(1.2)"
                : "blur(0px) brightness(1)",
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={primarySrc}
              alt={name}
              fill
              sizes="(max-width: 640px) 160px, 192px"
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Alternate Hacker Image: mypic2.png */}
          <motion.div
            initial={false}
            animate={{
              opacity: isOverridden ? 1 : 0,
              scale: isOverridden ? 1 : 0.94,
              filter: isOverridden
                ? "blur(0px) brightness(1)"
                : "blur(3px) brightness(0.8)",
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={secondarySrc}
              alt={name}
              fill
              sizes="(max-width: 640px) 160px, 192px"
              className="object-cover"
              priority
            />
          </motion.div>

          {/* CRT Scanline Glitch Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.55)_50%)] bg-[length:100%_3px] pointer-events-none z-20 opacity-30 group-hover:opacity-60 transition-opacity" />

          {/* Laser Sweep Scanline (Spanning the avatar) */}
          <div className="absolute inset-0 w-full h-12 bg-gradient-to-b from-transparent via-accent/25 to-transparent pointer-events-none z-20 opacity-50 animate-[laserSweep_2.2s_easeInOut_infinite]" />

          {/* Vignette Shadow Frame */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50 pointer-events-none z-20" />

          {/* Glitch Flash Wipe on Override State Change */}
          <AnimatePresence>
            {isOverridden && (
              <motion.div
                initial={{ opacity: 0.8, y: "-100%" }}
                animate={{ opacity: 0, y: "100%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/35 to-transparent pointer-events-none z-30"
              />
            )}
          </AnimatePresence>

          {/* Cyber HUD Corner Crosshairs */}
          <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t-2 border-l-2 border-accent/60 pointer-events-none z-30" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t-2 border-r-2 border-accent/60 pointer-events-none z-30" />
          <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b-2 border-l-2 border-accent/60 pointer-events-none z-30" />
          <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b-2 border-r-2 border-accent/60 pointer-events-none z-30" />
        </div>

        {/* Scanning Eye HUD at bottom of image */}
        <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap">
          <CyberScanningEye />
        </div>
      </div>
    </div>
  );
}
