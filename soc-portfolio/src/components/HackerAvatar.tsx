"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
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
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Active if hovered OR toggled via click
  const isOverridden = isHovered || isLocked;

  // 3D Tilt Physics using Framer Motion springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), {
    damping: 22,
    stiffness: 280,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), {
    damping: 22,
    stiffness: 280,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleToggle = () => {
    setIsLocked((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main Avatar Container with 3D Perspective & Organic Floating Animation */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          y: [-3, 3, -3],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          perspective: 1000,
        }}
        className="profile-ring relative mb-4 select-none cursor-pointer"
      >
        {/* Outer Pulsing Aura Ring */}
        <div
          className={`profile-ring-glow transition-all duration-500 ${
            isOverridden
              ? "!shadow-[0_0_45px_rgba(57,255,140,0.45)] !scale-105"
              : "!shadow-[0_0_35px_rgba(57,255,140,0.25)]"
          }`}
        />

        {/* Outer Rotating Reticle Ring */}
        <svg
          className="absolute -inset-2.5 sm:-inset-3.5 w-[calc(100%+20px)] sm:w-[calc(100%+28px)] h-[calc(100%+20px)] sm:h-[calc(100%+28px)] pointer-events-none transition-colors duration-500 text-accent/50 animate-[spin_10s_linear_infinite]"
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
          className="absolute -inset-1 sm:-inset-1.5 w-[calc(100%+8px)] sm:w-[calc(100%+12px)] h-[calc(100%+8px)] sm:h-[calc(100%+12px)] pointer-events-none transition-colors duration-500 text-accent/40 animate-[spin_14s_linear_infinite_reverse]"
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

        {/* Clickable & 3D Tilt Interactive Profile Circle */}
        <motion.div
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            }
          }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className={`relative z-10 w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 transition-all duration-300 group bg-black/90 ${
            isOverridden
              ? "border-accent shadow-[0_0_32px_rgba(57,255,140,0.45)] ring-2 ring-accent/40"
              : "border-accent/40 hover:border-accent shadow-[0_0_20px_rgba(57,255,140,0.2)]"
          }`}
          title="Kumail Abbas — Click to toggle cyber tactical visor"
        >
          {/* Base Image: mypic.jpg */}
          <motion.div
            initial={false}
            animate={{
              opacity: isOverridden ? 0 : 1,
              scale: isOverridden ? 1.08 : 1,
              filter: isOverridden
                ? "blur(4px) brightness(1.2)"
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
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </motion.div>

          {/* Alternate Hacker Image: mypic2.png */}
          <motion.div
            initial={false}
            animate={{
              opacity: isOverridden ? 1 : 0,
              scale: isOverridden ? 1 : 0.92,
              filter: isOverridden
                ? "blur(0px) brightness(1)"
                : "blur(4px) brightness(0.8)",
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

          {/* Holographic Angle Sheen / Light Glare on Mouse Move */}
          <motion.div
            style={{
              opacity: isHovered ? 0.35 : 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 55%)",
            }}
            className="absolute inset-0 pointer-events-none z-25 transition-opacity duration-300"
          />

          {/* CRT Scanline Glitch Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.55)_50%)] bg-[length:100%_3px] pointer-events-none z-20 opacity-30 group-hover:opacity-60 transition-opacity" />

          {/* Laser Sweep Scanline (Spanning the avatar continuously) */}
          <div className="absolute inset-0 w-full h-12 bg-gradient-to-b from-transparent via-accent/30 to-transparent pointer-events-none z-20 opacity-60 animate-[laserSweep_2s_easeInOut_infinite]" />

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
                className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/40 to-transparent pointer-events-none z-30"
              />
            )}
          </AnimatePresence>

          {/* Cyber HUD Corner Crosshairs */}
          <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t-2 border-l-2 border-accent/70 pointer-events-none z-30" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t-2 border-r-2 border-accent/70 pointer-events-none z-30" />
          <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b-2 border-l-2 border-accent/70 pointer-events-none z-30" />
          <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b-2 border-r-2 border-accent/70 pointer-events-none z-30" />
        </motion.div>

        {/* Scanning Eye HUD at bottom of image */}
        <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap">
          <CyberScanningEye />
        </div>
      </motion.div>
    </div>
  );
}
