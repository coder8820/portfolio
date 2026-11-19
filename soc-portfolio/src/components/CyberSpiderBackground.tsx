"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface Leg {
  side: -1 | 1; // -1 for left, 1 for right
  index: number; // 0..3 front to back
  baseAngle: number;
  reach: number;
  footX: number;
  footY: number;
  targetFootX: number;
  targetFootY: number;
  isStepping: boolean;
  stepProgress: number;
  stepHeight: number;
}

interface WebPoint {
  x: number;
  y: number;
  alpha: number;
}

export default function CyberSpiderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse and scroll tracking
    const mouse = {
      x: width * 0.75,
      y: height * 0.25,
      targetX: width * 0.75,
      targetY: height * 0.25,
      hasMoved: false,
      lastMoveTime: Date.now(),
    };

    // Spider state
    const spider = {
      x: width * 0.8,
      y: 120,
      vx: 0,
      vy: 0,
      angle: Math.PI / 2, // Facing downwards initially
      angularVelocity: 0,
      targetAngle: Math.PI / 2,
      bodyRadius: 14,
      scale: 1,
      speed: 0,
      maxSpeed: 4.5,
      idleTimer: 0,
      pulse: 0,
    };

    // Configure 8 cyber legs
    const legs: Leg[] = [];
    const baseAnglesLeft = [-0.65, -0.25, 0.25, 0.75];
    const baseAnglesRight = [Math.PI + 0.65, Math.PI + 0.25, Math.PI - 0.25, Math.PI - 0.75];
    const reaches = [48, 54, 52, 46];

    for (let i = 0; i < 4; i++) {
      // Left legs
      legs.push({
        side: -1,
        index: i,
        baseAngle: baseAnglesLeft[i],
        reach: reaches[i],
        footX: spider.x + Math.cos(baseAnglesLeft[i]) * reaches[i],
        footY: spider.y + Math.sin(baseAnglesLeft[i]) * reaches[i],
        targetFootX: spider.x + Math.cos(baseAnglesLeft[i]) * reaches[i],
        targetFootY: spider.y + Math.sin(baseAnglesLeft[i]) * reaches[i],
        isStepping: false,
        stepProgress: 0,
        stepHeight: 0,
      });

      // Right legs
      legs.push({
        side: 1,
        index: i,
        baseAngle: baseAnglesRight[i],
        reach: reaches[i],
        footX: spider.x + Math.cos(baseAnglesRight[i]) * reaches[i],
        footY: spider.y + Math.sin(baseAnglesRight[i]) * reaches[i],
        targetFootX: spider.x + Math.cos(baseAnglesRight[i]) * reaches[i],
        targetFootY: spider.y + Math.sin(baseAnglesRight[i]) * reaches[i],
        isStepping: false,
        stepProgress: 0,
        stepHeight: 0,
      });
    }

    // Web silk trail
    const webTrail: WebPoint[] = [];
    const maxTrailPoints = 35;

    // Window resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse movement handler across viewport
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.hasMoved = true;
      mouse.lastMoveTime = Date.now();
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Scroll handler: moves spider smoothly towards lower sections as user scrolls down
    const handleScroll = () => {
      const scrollMax = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const scrollRatio = Math.min(1, Math.max(0, window.scrollY / scrollMax));

      // Target progresses down across viewport proportional to scroll depth
      if (!mouse.hasMoved || Date.now() - mouse.lastMoveTime > 2500) {
        mouse.targetY = 100 + scrollRatio * (height - 200);
        mouse.targetX =
          width * 0.5 + Math.sin(scrollRatio * Math.PI * 4) * (width * 0.35);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Leg step scheduling (alternating gait groups like natural spider locomotion)
    let gaitTimer = 0;

    // Main animation loop
    const render = () => {
      // Clear canvas with transparent clearRect
      ctx.clearRect(0, 0, width, height);

      const isLight = document.documentElement.classList.contains("light");
      const accentColor = isLight ? "rgba(10, 143, 92, " : "rgba(57, 255, 140, ";
      const coreColor = isLight ? "#0a8f5c" : "#39ff8c";
      const eyeRed = isLight ? "#d93025" : "#ff5c5c";
      const bodyColor = isLight ? "#1a2332" : "#0d1612";
      const bodyHighlight = isLight ? "#2a374a" : "#172720";
      const threadColor = isLight
        ? "rgba(10, 143, 92, 0.22)"
        : "rgba(57, 255, 140, 0.25)";

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Autonomous idle wander if user hasn't moved mouse in a bit
      spider.idleTimer += 0.015;
      spider.pulse += 0.04;

      let targetX = mouse.x;
      let targetY = mouse.y;

      if (!mouse.hasMoved || Date.now() - mouse.lastMoveTime > 3000) {
        // Organic gentle floating S-curve swimming motion down towards page content
        const scrollMax = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        );
        const scrollRatio = Math.min(1, Math.max(0, window.scrollY / scrollMax));
        const baseTargetY = 120 + scrollRatio * (height - 220);

        targetX =
          width * 0.5 +
          Math.sin(spider.idleTimer * 0.8) * (width * 0.38) +
          Math.cos(spider.idleTimer * 0.4) * 80;
        targetY =
          baseTargetY +
          Math.sin(spider.idleTimer * 1.2) * 90 +
          Math.cos(spider.idleTimer * 0.6) * 40;
      }

      // Distance and angle to target
      const dx = targetX - spider.x;
      const dy = targetY - spider.y;
      const dist = Math.hypot(dx, dy);

      // Angle wrapping and smooth orientation turning (slerp)
      const targetAngle = Math.atan2(dy, dx);
      let angleDiff = targetAngle - spider.angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      // Turning physics
      spider.angularVelocity = angleDiff * 0.08;
      spider.angle += spider.angularVelocity;

      // Forward locomotion physics (accelerates smoothly, slows down near target)
      const desiredSpeed = Math.min(spider.maxSpeed, Math.max(0.4, dist * 0.025));
      spider.speed += (desiredSpeed - spider.speed) * 0.06;

      if (dist > 18) {
        spider.vx = Math.cos(spider.angle) * spider.speed;
        spider.vy = Math.sin(spider.angle) * spider.speed;
      } else {
        spider.vx *= 0.88;
        spider.vy *= 0.88;
      }

      spider.x += spider.vx;
      spider.y += spider.vy;

      // Keep spider on-screen boundaries
      spider.x = Math.max(40, Math.min(width - 40, spider.x));
      spider.y = Math.max(40, Math.min(height - 40, spider.y));

      // Append web trail point
      if (Math.hypot(spider.vx, spider.vy) > 0.4 || webTrail.length === 0) {
        if (
          webTrail.length === 0 ||
          Math.hypot(
            spider.x - webTrail[webTrail.length - 1].x,
            spider.y - webTrail[webTrail.length - 1].y
          ) > 16
        ) {
          webTrail.push({ x: spider.x, y: spider.y, alpha: 1 });
          if (webTrail.length > maxTrailPoints) {
            webTrail.shift();
          }
        }
      }

      // Fade out trailing web points
      for (let i = 0; i < webTrail.length; i++) {
        webTrail[i].alpha -= 0.005;
      }
      while (webTrail.length > 0 && webTrail[0].alpha <= 0) {
        webTrail.shift();
      }

      // ----------------------------------------------------
      // DRAW 1: Glowing Digital Web Silk Trail
      // ----------------------------------------------------
      if (webTrail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(webTrail[0].x, webTrail[0].y);
        for (let i = 1; i < webTrail.length; i++) {
          ctx.lineTo(webTrail[i].x, webTrail[i].y);
        }
        ctx.strokeStyle = threadColor;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Small glowing telemetry data nodes along the silk line
        for (let i = 0; i < webTrail.length; i += 3) {
          const pt = webTrail[i];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `${accentColor}${pt.alpha * 0.6})`;
          ctx.fill();
        }
      }

      // ----------------------------------------------------
      // UPDATE 2: 8-Legged Inverse Kinematics Gait
      // ----------------------------------------------------
      gaitTimer += spider.speed * 0.05 + 0.02;

      legs.forEach((leg) => {
        // Ideal foot position relative to body angle & speed
        const bodyAngle = spider.angle;
        const offsetAngle = bodyAngle + leg.baseAngle;
        const forwardBias = (3 - leg.index) * 6; // Front legs reach further forward
        const idealFootX =
          spider.x +
          Math.cos(offsetAngle) * leg.reach +
          Math.cos(bodyAngle) * forwardBias;
        const idealFootY =
          spider.y +
          Math.sin(offsetAngle) * leg.reach +
          Math.sin(bodyAngle) * forwardBias;

        const footDistToIdeal = Math.hypot(
          leg.footX - idealFootX,
          leg.footY - idealFootY
        );

        // Group 1: Left 0, 2 & Right 1, 3
        // Group 2: Left 1, 3 & Right 0, 2
        const isGroupA = (leg.side === -1 && leg.index % 2 === 0) || (leg.side === 1 && leg.index % 2 === 1);
        const groupAllowed = isGroupA
          ? Math.sin(gaitTimer) > 0
          : Math.sin(gaitTimer) <= 0;

        // Trigger leg step if distance exceeds threshold and group is active
        if (!leg.isStepping && footDistToIdeal > 22 && groupAllowed) {
          leg.isStepping = true;
          leg.stepProgress = 0;
          // Step towards slightly in front of ideal position to anticipate movement
          leg.targetFootX = idealFootX + spider.vx * 7;
          leg.targetFootY = idealFootY + spider.vy * 7;
        }

        // Animate stepping arc
        if (leg.isStepping) {
          leg.stepProgress += 0.16;
          if (leg.stepProgress >= 1) {
            leg.isStepping = false;
            leg.footX = leg.targetFootX;
            leg.footY = leg.targetFootY;
            leg.stepHeight = 0;
          } else {
            // Interpolate position + parabola for leg lift height
            leg.footX += (leg.targetFootX - leg.footX) * 0.28;
            leg.footY += (leg.targetFootY - leg.footY) * 0.28;
            leg.stepHeight = Math.sin(leg.stepProgress * Math.PI) * 12;
          }
        }
      });

      // ----------------------------------------------------
      // DRAW 3: Render 8 Multi-Jointed Cyber Robotic Legs
      // ----------------------------------------------------
      legs.forEach((leg) => {
        // Attachment point on spider thorax
        const baseAngle = spider.angle + (leg.side === -1 ? -Math.PI / 2 : Math.PI / 2);
        const hipSpacing = (leg.index - 1.5) * 6.5;
        const hipX =
          spider.x +
          Math.cos(spider.angle) * hipSpacing +
          Math.cos(baseAngle) * (spider.bodyRadius * 0.85);
        const hipY =
          spider.y +
          Math.sin(spider.angle) * hipSpacing +
          Math.sin(baseAngle) * (spider.bodyRadius * 0.85);

        const footX = leg.footX;
        const footY = leg.footY - leg.stepHeight; // Lift height during step

        // Inverse Kinematics Elbow/Knee calculation
        const midX = (hipX + footX) / 2;
        const midY = (hipY + footY) / 2;
        const kneeOutDistance = (leg.side === -1 ? -1 : 1) * 16;
        const perpAngle = Math.atan2(footY - hipY, footX - hipX) + Math.PI / 2;

        const kneeX = midX + Math.cos(perpAngle) * kneeOutDistance;
        const kneeY = midY + Math.sin(perpAngle) * kneeOutDistance - leg.stepHeight * 0.6;

        // Shadow under foot when lifted
        if (leg.stepHeight > 0.5) {
          ctx.beginPath();
          ctx.ellipse(leg.footX, leg.footY, 3, 1.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = isLight ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.45)";
          ctx.fill();
        }

        // Draw upper leg (Coxa to Knee)
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.strokeStyle = isLight ? "#2a374a" : "#1e2e27";
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";
        ctx.stroke();

        // Glowing cyber joint accent on upper leg
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.strokeStyle = `${accentColor}0.35)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw lower leg (Knee to Foot)
        ctx.beginPath();
        ctx.moveTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.strokeStyle = isLight ? "#3d4e63" : "#2a3e35";
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Knee joint servo node
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = coreColor;
        ctx.fill();

        // Foot contact tip
        ctx.beginPath();
        ctx.arc(footX, footY, leg.isStepping ? 2.5 : 1.6, 0, Math.PI * 2);
        ctx.fillStyle = leg.isStepping ? coreColor : isLight ? "#5a6a7a" : "#6f8479";
        ctx.fill();
      });

      // ----------------------------------------------------
      // DRAW 4: Spider Cyber Body (Thorax, Abdomen & Visor)
      // ----------------------------------------------------
      ctx.save();
      ctx.translate(spider.x, spider.y);
      ctx.rotate(spider.angle);

      // Subtle pulsating ambient glow aura under spider
      const auraPulse = 0.25 + Math.sin(spider.pulse) * 0.12;
      const gradient = ctx.createRadialGradient(0, 0, 4, 0, 0, 36);
      gradient.addColorStop(0, `${accentColor}${auraPulse})`);
      gradient.addColorStop(1, `${accentColor}0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.fill();

      // Rear Abdomen (Teardrop cyber shield)
      ctx.beginPath();
      ctx.ellipse(-14, 0, 16, 11, 0, 0, Math.PI * 2);
      ctx.fillStyle = bodyColor;
      ctx.fill();
      ctx.strokeStyle = `${accentColor}0.5)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Cyber telemetry circuit lines on abdomen
      ctx.beginPath();
      ctx.moveTo(-22, -4);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-22, 4);
      ctx.moveTo(-14, 0);
      ctx.lineTo(-6, 0);
      ctx.strokeStyle = `${accentColor}0.7)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Central Cephalothorax (Head & Core Chassis)
      ctx.beginPath();
      ctx.ellipse(3, 0, 10, 8.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = bodyHighlight;
      ctx.fill();
      ctx.strokeStyle = isLight ? "#d1d9e0" : "#2a3e35";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Glowing Reactor Core in Center
      ctx.beginPath();
      ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = coreColor;
      ctx.shadowColor = coreColor;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset blur

      // Front Scanning Eyes (Red Ocular Sensor Array)
      const eyeOffsets = [
        { x: 10, y: -3.5, r: 1.6 },
        { x: 12, y: -1.2, r: 1.8 },
        { x: 12, y: 1.2, r: 1.8 },
        { x: 10, y: 3.5, r: 1.6 },
      ];

      eyeOffsets.forEach((eye) => {
        ctx.beginPath();
        ctx.arc(eye.x, eye.y, eye.r, 0, Math.PI * 2);
        ctx.fillStyle = eyeRed;
        ctx.shadowColor = eyeRed;
        ctx.shadowBlur = 5;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Front Chelicerae / Cyber Fangs
      ctx.beginPath();
      ctx.moveTo(11, -3);
      ctx.lineTo(16, -1.8);
      ctx.lineTo(14, -0.5);
      ctx.moveTo(11, 3);
      ctx.lineTo(16, 1.8);
      ctx.lineTo(14, 0.5);
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = 1.2;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-500 opacity-90"
      aria-hidden="true"
    />
  );
}
