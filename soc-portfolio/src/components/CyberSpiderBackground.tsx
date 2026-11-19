"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface SpiderLeg {
  side: -1 | 1; // -1 = Left (-Y in local space), 1 = Right (+Y in local space)
  pairIndex: number; // 0 = Front, 1 = Mid-Front, 2 = Mid-Back, 3 = Rear
  hipLocalX: number; // Offset along body length (+X is forward)
  hipLocalY: number; // Offset along body width
  spreadAngle: number; // Radians off forward axis (+X)
  reach: number; // Natural rest distance of foot from hip
  femurLen: number;
  tibiaLen: number;
  footX: number;
  footY: number;
  targetFootX: number;
  targetFootY: number;
  stepStartX: number;
  stepStartY: number;
  isStepping: boolean;
  stepProgress: number;
  stepHeight: number;
}

interface SilkPoint {
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

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Target position (driven by mouse & scroll)
    const target = {
      x: width * 0.72,
      y: 160,
      userActive: false,
      lastInteractionTime: Date.now(),
    };

    // Spider state
    const spider = {
      x: width * 0.72,
      y: 140,
      vx: 0,
      vy: 0,
      angle: Math.PI / 2, // Facing downwards (+Y in screen space) initially
      angularVelocity: 0,
      speed: 0,
      maxSpeed: 4.8,
      bodyBob: 0,
      walkCycle: 0,
      idleTimer: 0,
      pedipalpTimer: 0,
      alertLevel: 0,
    };

    // Authentic 8-Leg Morphological Configuration:
    // Pair 0 (Front): Reaches forward-outward (~32° off head axis)
    // Pair 1 (Mid-Front): Reaches wide lateral-forward (~65° off head axis)
    // Pair 2 (Mid-Back): Reaches wide lateral-rear (~115° off head axis)
    // Pair 3 (Rear): Reaches far backward (~155° off head axis, trailing behind abdomen)
    const legConfigs = [
      { hipX: 8, hipY: 8.5, spreadAngle: 0.55, reach: 64, femur: 32, tibia: 36 },
      { hipX: 3, hipY: 9.5, spreadAngle: 1.15, reach: 72, femur: 35, tibia: 42 },
      { hipX: -2, hipY: 9.0, spreadAngle: 2.05, reach: 62, femur: 30, tibia: 38 },
      { hipX: -7, hipY: 8.0, spreadAngle: 2.75, reach: 76, femur: 36, tibia: 44 },
    ];

    const legs: SpiderLeg[] = [];

    for (let i = 0; i < 4; i++) {
      const cfg = legConfigs[i];

      // Left Leg (side = -1, spread angle goes negative/left)
      const leftInitAngle = spider.angle - cfg.spreadAngle;
      const leftHipX = spider.x + Math.cos(spider.angle) * cfg.hipX - Math.sin(spider.angle) * (-cfg.hipY);
      const leftHipY = spider.y + Math.sin(spider.angle) * cfg.hipX + Math.cos(spider.angle) * (-cfg.hipY);
      const leftFootX = leftHipX + Math.cos(leftInitAngle) * cfg.reach;
      const leftFootY = leftHipY + Math.sin(leftInitAngle) * cfg.reach;

      legs.push({
        side: -1,
        pairIndex: i,
        hipLocalX: cfg.hipX,
        hipLocalY: -cfg.hipY,
        spreadAngle: cfg.spreadAngle,
        reach: cfg.reach,
        femurLen: cfg.femur,
        tibiaLen: cfg.tibia,
        footX: leftFootX,
        footY: leftFootY,
        targetFootX: leftFootX,
        targetFootY: leftFootY,
        stepStartX: leftFootX,
        stepStartY: leftFootY,
        isStepping: false,
        stepProgress: 0,
        stepHeight: 0,
      });

      // Right Leg (side = 1, spread angle goes positive/right)
      const rightInitAngle = spider.angle + cfg.spreadAngle;
      const rightHipX = spider.x + Math.cos(spider.angle) * cfg.hipX - Math.sin(spider.angle) * cfg.hipY;
      const rightHipY = spider.y + Math.sin(spider.angle) * cfg.hipX + Math.cos(spider.angle) * cfg.hipY;
      const rightFootX = rightHipX + Math.cos(rightInitAngle) * cfg.reach;
      const rightFootY = rightHipY + Math.sin(rightInitAngle) * cfg.reach;

      legs.push({
        side: 1,
        pairIndex: i,
        hipLocalX: cfg.hipX,
        hipLocalY: cfg.hipY,
        spreadAngle: cfg.spreadAngle,
        reach: cfg.reach,
        femurLen: cfg.femur,
        tibiaLen: cfg.tibia,
        footX: rightFootX,
        footY: rightFootY,
        targetFootX: rightFootX,
        targetFootY: rightFootY,
        stepStartX: rightFootX,
        stepStartY: rightFootY,
        isStepping: false,
        stepProgress: 0,
        stepHeight: 0,
      });
    }

    // Trailing cyber silk trail
    const silkTrail: SilkPoint[] = [];
    const maxSilk = 45;

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const onMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      target.userActive = true;
      target.lastInteractionTime = Date.now();
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollRatio = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      // As user scrolls, spider journeys down smoothly from Home to Footer
      if (!target.userActive || Date.now() - target.lastInteractionTime > 2200) {
        target.y = 120 + scrollRatio * (height - 240);
        target.x = width * 0.5 + Math.sin(scrollRatio * Math.PI * 3.5) * (width * 0.38);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let gaitClock = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isLight = document.documentElement.classList.contains("light");

      // High-contrast cyber palette
      const accent = isLight ? "#0a8f5c" : "#39ff8c";
      const ocularRed = isLight ? "#d93025" : "#ff3333";
      const chitinDark = isLight ? "#1a2432" : "#070c0a";
      const chitinMid = isLight ? "#2a3748" : "#111b17";
      const chitinLight = isLight ? "#4a5d75" : "#243d32";
      const shadowColor = isLight ? "rgba(0, 0, 0, 0.14)" : "rgba(0, 0, 0, 0.65)";
      const silkLineColor = isLight ? "rgba(10, 143, 92, 0.22)" : "rgba(57, 255, 140, 0.24)";

      spider.idleTimer += 0.016;
      spider.pedipalpTimer += 0.09;

      let tx = target.x;
      let ty = target.y;

      // Autonomous wandering when mouse is idle
      if (!target.userActive || Date.now() - target.lastInteractionTime > 3200) {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const scrollRatio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        const baseY = 130 + scrollRatio * (height - 260);

        tx =
          width * 0.5 +
          Math.sin(spider.idleTimer * 0.75) * (width * 0.36) +
          Math.cos(spider.idleTimer * 0.35) * 70;
        ty =
          baseY +
          Math.sin(spider.idleTimer * 1.1) * 85 +
          Math.cos(spider.idleTimer * 0.5) * 45;
      }

      // Compute vector to target
      const dx = tx - spider.x;
      const dy = ty - spider.y;
      const dist = Math.hypot(dx, dy);

      // Alert stance when cursor is right near the spider
      const cursorDist = Math.hypot(target.x - spider.x, target.y - spider.y);
      if (cursorDist < 85 && target.userActive) {
        spider.alertLevel += (1 - spider.alertLevel) * 0.12;
      } else {
        spider.alertLevel += (0 - spider.alertLevel) * 0.06;
      }

      // Smooth realistic orientation (head facing target)
      const targetAngle = Math.atan2(dy, dx);
      let angleDiff = targetAngle - spider.angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      spider.angularVelocity = angleDiff * 0.075;
      spider.angle += spider.angularVelocity;

      // Crawling velocity (accelerates smoothly, slows when near target)
      const desiredSpeed = dist > 22 ? Math.min(spider.maxSpeed, Math.max(0.6, dist * 0.04)) : 0;
      spider.speed += (desiredSpeed - spider.speed) * 0.09;

      if (dist > 18) {
        spider.vx = Math.cos(spider.angle) * spider.speed;
        spider.vy = Math.sin(spider.angle) * spider.speed;
      } else {
        spider.vx *= 0.85;
        spider.vy *= 0.85;
      }

      spider.x += spider.vx;
      spider.y += spider.vy;

      // Keep within screen bounds
      spider.x = Math.max(50, Math.min(width - 50, spider.x));
      spider.y = Math.max(50, Math.min(height - 50, spider.y));

      // Body bobbing cadence with step cycle
      if (spider.speed > 0.3) {
        spider.walkCycle += spider.speed * 0.14;
        spider.bodyBob = Math.sin(spider.walkCycle * 2) * 1.6;
      } else {
        spider.bodyBob = Math.sin(spider.idleTimer * 2) * 0.5;
      }

      // Record trailing silk from rear spinnerets (along -X in local space, opposite to head)
      const spinneretX = spider.x - Math.cos(spider.angle) * 32;
      const spinneretY = spider.y - Math.sin(spider.angle) * 32;

      if (Math.hypot(spider.vx, spider.vy) > 0.4 || silkTrail.length === 0) {
        if (
          silkTrail.length === 0 ||
          Math.hypot(spinneretX - silkTrail[silkTrail.length - 1].x, spinneretY - silkTrail[silkTrail.length - 1].y) > 16
        ) {
          silkTrail.push({ x: spinneretX, y: spinneretY, alpha: 1 });
          if (silkTrail.length > maxSilk) {
            silkTrail.shift();
          }
        }
      }

      // Fade out silk
      for (let i = 0; i < silkTrail.length; i++) {
        silkTrail[i].alpha -= 0.0035;
      }
      while (silkTrail.length > 0 && silkTrail[0].alpha <= 0) {
        silkTrail.shift();
      }

      // ====================================================
      // 1. Draw Glowing Cyber Silk Line Behind Spider
      // ====================================================
      if (silkTrail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(silkTrail[0].x, silkTrail[0].y);
        for (let i = 1; i < silkTrail.length; i++) {
          ctx.lineTo(silkTrail[i].x, silkTrail[i].y);
        }
        ctx.strokeStyle = silkLineColor;
        ctx.lineWidth = 1.1;
        ctx.setLineDash([2, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Small glowing data nodes on silk
        for (let i = 0; i < silkTrail.length; i += 3) {
          const pt = silkTrail[i];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = accent;
          ctx.globalAlpha = pt.alpha * 0.6;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // ====================================================
      // 2. Biological Tetrapod Gait Step Scheduling
      // Set A: L0, R1, L2, R3
      // Set B: R0, L1, R2, L3
      // ====================================================
      gaitClock += spider.speed * 0.07 + 0.018;

      legs.forEach((leg) => {
        // Compute current hip position in world space
        // Local hip is at (hipLocalX, hipLocalY)
        const cosA = Math.cos(spider.angle);
        const sinA = Math.sin(spider.angle);
        const hipX = spider.x + cosA * leg.hipLocalX - sinA * leg.hipLocalY;
        const hipY = spider.y + sinA * leg.hipLocalX + cosA * leg.hipLocalY;

        // Ideal foot landing zone
        // Leg angle in world space: spider.angle + (leg.side === -1 ? -leg.spreadAngle : leg.spreadAngle)
        const legWorldAngle = spider.angle + (leg.side === -1 ? -leg.spreadAngle : leg.spreadAngle);
        const alertReachBonus = leg.pairIndex === 0 ? spider.alertLevel * 14 : 0;
        const idealFootX = hipX + Math.cos(legWorldAngle) * (leg.reach + alertReachBonus) + spider.vx * 7;
        const idealFootY = hipY + Math.sin(legWorldAngle) * (leg.reach + alertReachBonus) + spider.vy * 7;

        const distToIdeal = Math.hypot(leg.footX - idealFootX, leg.footY - idealFootY);

        // Alternating tetrapod group
        const isGroupA = (leg.side === -1 && leg.pairIndex % 2 === 0) || (leg.side === 1 && leg.pairIndex % 2 === 1);
        const canStep = isGroupA ? Math.sin(gaitClock) > 0 : Math.sin(gaitClock) <= 0;

        const stepThreshold = leg.pairIndex === 0 ? 20 : 25;
        if (!leg.isStepping && distToIdeal > stepThreshold && canStep) {
          leg.isStepping = true;
          leg.stepProgress = 0;
          leg.stepStartX = leg.footX;
          leg.stepStartY = leg.footY;
          leg.targetFootX = idealFootX + spider.vx * 6;
          leg.targetFootY = idealFootY + spider.vy * 6;
        }

        // Animate parabolic stepping arc
        if (leg.isStepping) {
          leg.stepProgress += 0.16;
          if (leg.stepProgress >= 1) {
            leg.isStepping = false;
            leg.footX = leg.targetFootX;
            leg.footY = leg.targetFootY;
            leg.stepHeight = 0;
          } else {
            const t = leg.stepProgress;
            const easeT = t * t * (3 - 2 * t);
            leg.footX = leg.stepStartX + (leg.targetFootX - leg.stepStartX) * easeT;
            leg.footY = leg.stepStartY + (leg.targetFootY - leg.stepStartY) * easeT;
            leg.stepHeight = Math.sin(t * Math.PI) * 15;
          }
        }
      });

      // ====================================================
      // 3. Body & Foot Shadows on Floor
      // ====================================================
      // Ambient shadow under abdomen and head
      ctx.beginPath();
      ctx.ellipse(spider.x + 2, spider.y + 5, 24, 15, spider.angle, 0, Math.PI * 2);
      ctx.fillStyle = shadowColor;
      ctx.filter = "blur(5px)";
      ctx.fill();
      ctx.filter = "none";

      // Shadow under each foot contact
      legs.forEach((leg) => {
        const shadowOffset = 2 + leg.stepHeight * 0.35;
        ctx.beginPath();
        ctx.ellipse(leg.footX + shadowOffset * 0.4, leg.footY + shadowOffset, 3, 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = shadowColor;
        ctx.fill();
      });

      // ====================================================
      // 4. Draw 8 High-Arched Articulated Spider Legs
      // Real joints: Coxa -> Femur (arches up) -> Patella/Knee (apex) -> Tibia -> Tarsus (foot)
      // ====================================================
      legs.forEach((leg) => {
        const cosA = Math.cos(spider.angle);
        const sinA = Math.sin(spider.angle);
        const hipX = spider.x + cosA * leg.hipLocalX - sinA * leg.hipLocalY;
        const hipY = spider.y + sinA * leg.hipLocalX + cosA * leg.hipLocalY;

        const footX = leg.footX;
        const footY = leg.footY - leg.stepHeight;

        // High arched knee apex in 3D:
        // Knee bends OUTWARD away from the body
        const legDx = footX - hipX;
        const legDy = footY - hipY;
        const legDist = Math.hypot(legDx, legDy);

        const midX = (hipX + footX) / 2;
        const midY = (hipY + footY) / 2;
        const perpAngle = Math.atan2(legDy, legDx) + (leg.side === -1 ? -Math.PI / 2 : Math.PI / 2);

        // Knee projects outward and reaches high in 3D
        const kneeOutArch = Math.max(12, 20 - legDist * 0.1);
        const kneeHeight = 11 + leg.stepHeight * 0.65;
        const kneeX = midX + Math.cos(perpAngle) * kneeOutArch;
        const kneeY = midY + Math.sin(perpAngle) * kneeOutArch - kneeHeight;

        // Segment 1: Coxa-Femur (Hip to High Knee Apex)
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.strokeStyle = chitinDark;
        ctx.lineWidth = 3.4;
        ctx.lineCap = "round";
        ctx.stroke();

        // Upper leg armor highlight
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.strokeStyle = chitinLight;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Segment 2: Tibia (High Knee to Lower Leg Joint)
        const lowerJointX = kneeX * 0.35 + footX * 0.65;
        const lowerJointY = kneeY * 0.35 + footY * 0.65;

        ctx.beginPath();
        ctx.moveTo(kneeX, kneeY);
        ctx.lineTo(lowerJointX, lowerJointY);
        ctx.strokeStyle = chitinMid;
        ctx.lineWidth = 2.4;
        ctx.stroke();

        // Segment 3: Tarsus (Claw Tip to Floor)
        ctx.beginPath();
        ctx.moveTo(lowerJointX, lowerJointY);
        ctx.lineTo(footX, footY);
        ctx.strokeStyle = chitinDark;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Knee Servo Joint (Glowing node at the high apex)
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = chitinLight;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();

        // Foot Claw Tip
        ctx.beginPath();
        ctx.arc(footX, footY, leg.isStepping ? 2.2 : 1.3, 0, Math.PI * 2);
        ctx.fillStyle = leg.isStepping ? accent : chitinLight;
        ctx.fill();
      });

      // ====================================================
      // 5. Draw Spider Body (Aligned strictly with heading angle)
      // Local +X = Forward (Head)
      // Local -X = Backward (Abdomen)
      // Local -Y = Left
      // Local +Y = Right
      // ====================================================
      ctx.save();
      ctx.translate(spider.x, spider.y + spider.bodyBob);
      ctx.rotate(spider.angle);

      // Ambient Cyber Core Glow
      const corePulse = 0.14 + Math.sin(spider.idleTimer * 3) * 0.06;
      const coreAura = ctx.createRadialGradient(-18, 0, 2, -18, 0, 36);
      coreAura.addColorStop(0, isLight ? `rgba(10, 143, 92, ${corePulse})` : `rgba(57, 255, 140, ${corePulse})`);
      coreAura.addColorStop(1, "transparent");
      ctx.fillStyle = coreAura;
      ctx.beginPath();
      ctx.arc(-18, 0, 36, 0, Math.PI * 2);
      ctx.fill();

      // ----------------------------------------------------
      // Opisthosoma (Posterior Abdomen - Large Egg/Teardrop at -X)
      // ----------------------------------------------------
      const abdomenX = -18;
      const abdomenRadiusX = 15;
      const abdomenRadiusY = 12;

      ctx.beginPath();
      ctx.ellipse(abdomenX, 0, abdomenRadiusX, abdomenRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = chitinDark;
      ctx.fill();
      ctx.strokeStyle = chitinLight;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Chitin Tergite Plates (Biological horizontal segments)
      for (let s = 1; s <= 4; s++) {
        const segX = abdomenX - 10 + s * 5;
        const segH = abdomenRadiusY * Math.sin((s / 5) * Math.PI) * 0.95;
        ctx.beginPath();
        ctx.ellipse(segX, 0, 2.5, segH, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isLight ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Abdomen Glowing Neural Reactor Core
      ctx.beginPath();
      ctx.ellipse(abdomenX + 2, 0, 6.5, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? "rgba(10, 143, 92, 0.28)" : "rgba(57, 255, 140, 0.32)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(abdomenX + 2, 0, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Rear Spinnerets (At the posterior tip, x = -32)
      ctx.beginPath();
      ctx.moveTo(abdomenX - abdomenRadiusX + 1, -2.5);
      ctx.lineTo(abdomenX - abdomenRadiusX - 3.5, 0);
      ctx.lineTo(abdomenX - abdomenRadiusX + 1, 2.5);
      ctx.fillStyle = chitinLight;
      ctx.fill();

      // ----------------------------------------------------
      // Pedicel (Narrow Waist Connecting Head and Abdomen)
      // ----------------------------------------------------
      ctx.beginPath();
      ctx.rect(-4, -3, 5, 6);
      ctx.fillStyle = chitinMid;
      ctx.fill();
      ctx.strokeStyle = chitinLight;
      ctx.lineWidth = 1;
      ctx.stroke();

      // ----------------------------------------------------
      // Prosoma (Cephalothorax / Head Carapace at +X)
      // ----------------------------------------------------
      const headCenterX = 5;
      const headRadiusX = 10;
      const headRadiusY = 9.5;

      ctx.beginPath();
      ctx.ellipse(headCenterX, 0, headRadiusX, headRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = chitinMid;
      ctx.fill();
      ctx.strokeStyle = chitinLight;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Central Cephalic Fovea Indentation
      ctx.beginPath();
      ctx.moveTo(headCenterX - 3, 0);
      ctx.lineTo(headCenterX + 3, 0);
      ctx.strokeStyle = chitinDark;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // ----------------------------------------------------
      // Pedipalps (Sensory Feelers projecting forward from head)
      // ----------------------------------------------------
      const palpWiggle = Math.sin(spider.pedipalpTimer) * 2;
      const palpBaseX = headCenterX + 8;
      const palpLeftY = -5;
      const palpRightY = 5;

      // Left Pedipalp
      ctx.beginPath();
      ctx.moveTo(palpBaseX, palpLeftY);
      ctx.lineTo(palpBaseX + 8, palpLeftY - 3 + palpWiggle * 0.4);
      ctx.lineTo(palpBaseX + 13, palpLeftY - 1 + palpWiggle);
      ctx.strokeStyle = chitinLight;
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(palpBaseX + 13, palpLeftY - 1 + palpWiggle, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();

      // Right Pedipalp
      ctx.beginPath();
      ctx.moveTo(palpBaseX, palpRightY);
      ctx.lineTo(palpBaseX + 8, palpRightY + 3 - palpWiggle * 0.4);
      ctx.lineTo(palpBaseX + 13, palpRightY + 1 - palpWiggle);
      ctx.strokeStyle = chitinLight;
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(palpBaseX + 13, palpRightY + 1 - palpWiggle, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();

      // ----------------------------------------------------
      // Chelicerae & Fangs (Projecting forward from mouth)
      // ----------------------------------------------------
      ctx.beginPath();
      ctx.moveTo(headCenterX + headRadiusX - 1, -3);
      ctx.lineTo(headCenterX + headRadiusX + 4.5, -1.8);
      ctx.lineTo(headCenterX + headRadiusX + 2, -0.4);
      ctx.moveTo(headCenterX + headRadiusX - 1, 3);
      ctx.lineTo(headCenterX + headRadiusX + 4.5, 1.8);
      ctx.lineTo(headCenterX + headRadiusX + 2, 0.4);
      ctx.strokeStyle = chitinDark;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // ----------------------------------------------------
      // True 8-Eye Ocular Turret (Facing forward towards +X)
      // 2 Anterior Median Eyes (Large main red optics)
      // 2 Anterior Lateral Eyes
      // 2 Posterior Median Eyes
      // 2 Posterior Lateral Eyes
      // ----------------------------------------------------
      const eyeBaseX = headCenterX + 6;

      // Anterior Median Eyes (AME) - Big scanning red optics
      ctx.beginPath();
      ctx.arc(eyeBaseX + 2.6, -2.0, 1.7, 0, Math.PI * 2);
      ctx.arc(eyeBaseX + 2.6, 2.0, 1.7, 0, Math.PI * 2);
      ctx.fillStyle = ocularRed;
      ctx.shadowColor = ocularRed;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Anterior Lateral Eyes (ALE)
      ctx.beginPath();
      ctx.arc(eyeBaseX + 1.6, -5.2, 1.2, 0, Math.PI * 2);
      ctx.arc(eyeBaseX + 1.6, 5.2, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = ocularRed;
      ctx.fill();

      // Posterior Median Eyes (PME)
      ctx.beginPath();
      ctx.arc(eyeBaseX - 1.4, -2.4, 1.1, 0, Math.PI * 2);
      ctx.arc(eyeBaseX - 1.4, 2.4, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();

      // Posterior Lateral Eyes (PLE)
      ctx.beginPath();
      ctx.arc(eyeBaseX - 2.0, -5.5, 1.0, 0, Math.PI * 2);
      ctx.arc(eyeBaseX - 2.0, 5.5, 1.0, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
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
