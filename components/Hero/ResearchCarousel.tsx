"use client";

import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import { useMotionValue, useAnimationFrame, animate, useReducedMotion } from "framer-motion";
import { CarouselWindow } from "./CarouselWindow";

// ─── Carousel items ────────────────────────────────────────────────────────────
const SHOWCASE_ITEMS = [
  { id: "dashboard", title: "Dashboard Overview" },
  { id: "workspace", title: "Research Workspace" },
  { id: "ai_results", title: "AI Research Results" },
  { id: "research_thread", title: "Research Thread" },
  { id: "analyze_url", title: "Analyze URL Mode" },
  { id: "insights", title: "Insights View" },
  { id: "create_view", title: "Create Workspace" },
  { id: "workspace_overview", title: "Workspaces Hub" },
];

const COUNT = SHOWCASE_ITEMS.length;
const STEP = 360 / COUNT; // 45° per card

// ─── Orbital math ──────────────────────────────────────────────────────────────
// angleRad — card's angular position around the ring.
//   0  = straight in front of camera (center)
//   π  = directly behind (back)
//
// All properties are derived continuously from cos/sin — no discrete
// "center / left / right" state. The cos² focus curve gives the center
// card a wide, prominent plateau that drops off sharply at the sides,
// which is what creates the Apple Cover Flow feel.
// ──────────────────────────────────────────────────────────────────────────────
function computeCard(
  angleRad: number,
  radiusX: number,
  radiusZ: number,
  time: number,
  reducedMotion: boolean,
) {
  // Normalize the continuous angleRad to [-PI, PI] to allow directional logic
  let normAngle = ((angleRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  if (normAngle > Math.PI) normAngle -= 2 * Math.PI;

  const sinA = Math.sin(normAngle);
  const cosA = Math.cos(normAngle);

  // True 3D orbital base position
  const tx = sinA * radiusX;
  const baseTz = (cosA - 1) * radiusZ;

  // Normalize depth from 0 (farthest back) to 1 (front center)
  const normZ = (cosA + 1) / 2;

  // Create an asymmetric, staggered focus handoff (creates a ~150ms gap).
  // The carousel rotates such that angles DECREASE over time.
  // Incoming card (normAngle > 0): moves from +45 deg down to 0.
  // Outgoing card (normAngle < 0): moves from 0 down to -45 deg.
  let focus = 0;
  if (normAngle >= 0) {
    // INCOMING: Delays its growth. Starts gaining focus at 28 deg (0.49 rad).
    focus = Math.max(0, 1 - (normAngle / 0.49)); 
  } else {
    // OUTGOING: Shrinks and moves backward FIRST. Loses focus by 15 deg (0.26 rad).
    focus = Math.max(0, 1 - (Math.abs(normAngle) / 0.26));
  }
  // SmoothStep for cinematic easing
  focus = focus * focus * (3 - 2 * focus);

  // Apply a staggered Z-depth pop so they exchange depth without overlapping.
  // The outgoing card moves backward (loses boost) before incoming moves forward.
  const tz = baseTz + (focus * 140);

  // Explicit scale-based transition from 0.90 (background) to 1.08 (spotlight)
  const scale = 0.90 + (focus * 0.18);

  // Opacity: solid in the front to prevent ghosting, fades out gracefully in the back
  const opacity = reducedMotion
    ? Math.max(0, 0.3 + focus * 0.7)
    : Math.min(1.0, normZ * 2.0);

  // Blur: Completely removed per user suggestion to mimic Apple's clean transitions.
  // We rely entirely on scale, brightness, and depth for a crisp, premium feel.
  const blurPx = 0;

  // Lighting transitions: Outgoing screenshots subtly reduce contrast and brightness 
  // (down to 85-90% as suggested) to simulate moving away into the background.
  // We use `focus` instead of `normZ` so they darken exactly as they step back.
  const brightness = 0.85 + (0.15 * focus); // 0.85 when unfocused, 1.0 when focused
  const contrast = 0.90 + (0.10 * focus);   // 0.90 when unfocused, 1.0 when focused
  const saturation = 85 + (15 * focus);     // 85% when unfocused, 100% when focused

  // Cylinder Rotation (Wheel effect):
  const rotY = reducedMotion ? 0 : -(normAngle * 180 / Math.PI) * 0.45;

  // Z-index: exactly matches true Z depth to guarantee perfect occlusion
  const zIndex = Math.round(tz);

  // Gentle float for the front card only
  const floatY = reducedMotion
    ? 0
    : Math.sin(time / 1400) * 8 * focus;

  const glowOpacity = focus * 0.55;

  return { tx, tz, scale, opacity, blurPx, brightness, saturation, contrast, rotY, zIndex, floatY, glowOpacity, focus };
}

// ─── Card DOM ref bundle — passed up from each CarouselCard to the parent ─────
interface CardRefs {
  card: HTMLDivElement | null;
  glow: HTMLDivElement | null;
}

// ─── ResearchCarousel ─────────────────────────────────────────────────────────
export function ResearchCarousel() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 420 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const angleDeg = useMotionValue(0);
  const parallaxRef = useRef({ rx: 0, ry: 0 });
  const parallaxTargetRef = useRef({ rx: 0, ry: 0 });
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);
  const snapAnim = useRef<ReturnType<typeof animate> | null>(null);

  // Refs to every card's DOM nodes — populated by CarouselCard on mount
  const cardRefsArray = useRef<CardRefs[]>(
    Array.from({ length: COUNT }, () => ({ card: null, glow: null }))
  );

  // Per-card last-rendered values for dead-band throttling
  const lastBlur = useRef<number[]>(new Array(COUNT).fill(-1));
  const lastBrightness = useRef<number[]>(new Array(COUNT).fill(-1));
  const lastSaturation = useRef<number[]>(new Array(COUNT).fill(-1));
  const lastContrast = useRef<number[]>(new Array(COUNT).fill(-1));
  const lastActive = useRef<boolean[]>(new Array(COUNT).fill(false));

  // ── True 3D Geometry ──────────────────────────────────────────────────────
  // We use a deep radiusZ so cards physically travel far backward in space.
  // CSS perspective naturally scales them down, creating a real 3D illusion
  // without relying on artificial flat scaling.
  const cardWidth = Math.min(500, dimensions.width * 0.65);
  const cardHeight = Math.round(cardWidth * (10 / 16));
  const radiusX = dimensions.width * 0.42; // Wide elliptical track
  const radiusZ = dimensions.width * 0.35; // Deep Z-axis track

  // ── ResizeObserver — measures outerRef, the true column width ─────────────
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const measure = () => setDimensions({ width: el.offsetWidth, height: el.offsetHeight });
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    measure();
    return () => obs.disconnect();
  }, []);

  // ── SINGLE SHARED RAF LOOP ───────────────────────────────────────────────
  useAnimationFrame((time, delta) => {
    const refs = cardRefsArray.current;
    const isRm = !!shouldReduceMotion;
    const isDrag = isDragging;
    const isHov = isHovered;

    // ── Auto-rotation ────────────────────────────────────────────────────
    if (!isDrag && !isHov && !isRm) {
      angleDeg.set(angleDeg.get() - (10.5 * delta) / 1000);
    }

    // ── Parallax tilt ────────────────────────────────────────────────────
    if (!isRm) {
      const stage = stageRef.current;
      if (stage) {
        const alpha = 1 - Math.pow(0.92, delta / 16);
        parallaxRef.current.rx += (parallaxTargetRef.current.rx - parallaxRef.current.rx) * alpha;
        parallaxRef.current.ry += (parallaxTargetRef.current.ry - parallaxRef.current.ry) * alpha;
        stage.style.transform = `rotateX(${parallaxRef.current.rx.toFixed(3)}deg) rotateY(${parallaxRef.current.ry.toFixed(3)}deg)`;
      }
    }

    const currentAngle = angleDeg.get();
    let frontIndex = 0;
    let bestFocus = -1;

    for (let i = 0; i < COUNT; i++) {
      const { card, glow } = refs[i];
      if (!card) continue;

      const angleRad = ((currentAngle + i * STEP) * Math.PI) / 180;
      const c = computeCard(angleRad, radiusX, radiusZ, time, isRm);

      card.style.transform = `translate3d(${c.tx.toFixed(2)}px, ${c.floatY.toFixed(2)}px, ${c.tz.toFixed(2)}px) scale(${c.scale.toFixed(4)}) rotateY(${c.rotY.toFixed(2)}deg)`;
      card.style.zIndex = String(c.zIndex);
      card.style.opacity = c.opacity.toFixed(4);

      // Filter dead-band
      const blurChanged = Math.abs(c.blurPx - lastBlur.current[i]) > 0.4;
      const brightChanged = Math.abs(c.brightness - lastBrightness.current[i]) > 0.008;
      const satChanged = Math.abs(c.saturation - lastSaturation.current[i]) > 1.0;
      const conChanged = Math.abs(c.contrast - lastContrast.current[i]) > 0.005;

      if (blurChanged || brightChanged || satChanged || conChanged) {
        lastBlur.current[i] = c.blurPx;
        lastBrightness.current[i] = c.brightness;
        lastSaturation.current[i] = c.saturation;
        lastContrast.current[i] = c.contrast;

        let filter = `brightness(${c.brightness.toFixed(3)}) saturate(${c.saturation.toFixed(1)}%) contrast(${c.contrast.toFixed(3)})`;
        if (c.blurPx > 0.4) filter = `blur(${c.blurPx.toFixed(1)}px) ` + filter;
        card.style.filter = filter;
      }

      if (glow) glow.style.opacity = c.glowOpacity.toFixed(4);

      const nowActive = c.focus > 0.85;
      if (nowActive !== lastActive.current[i]) {
        lastActive.current[i] = nowActive;
        card.style.pointerEvents = nowActive ? "auto" : "none";
        card.style.cursor = nowActive ? "pointer" : "default";
      }

      if (c.focus > bestFocus) { bestFocus = c.focus; frontIndex = i; }
    }

    if (frontIndex !== activeIndex) {
      setActiveIndex(frontIndex);
    }
  });

  // ── Mouse handlers ────────────────────────────────────────────────────────
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = outerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    parallaxTargetRef.current = { rx: ny * -3.5, ry: nx * 4.5 };
  }, []);

  const onMouseLeave = useCallback(() => {
    parallaxTargetRef.current = { rx: 0, ry: 0 };
    setIsHovered(false);
  }, []);

  // ── Pointer drag handlers ─────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (snapAnim.current) snapAnim.current.stop();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartAngle.current = angleDeg.get();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [angleDeg]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX.current;
    // Map drag distance to rotation: full column width = 280° rotation
    angleDeg.set(dragStartAngle.current + (dx / dimensions.width) * 280);
  }, [isDragging, dimensions.width, angleDeg]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    const cur = angleDeg.get();
    const target = Math.round(cur / STEP) * STEP;
    snapAnim.current = animate(angleDeg, target, {
      type: "spring", stiffness: 130, damping: 20, mass: 1.1,
    });
  }, [isDragging, angleDeg]);

  const onCardClick = useCallback((index: number) => {
    if (isDragging) return;
    if (snapAnim.current) snapAnim.current.stop();
    const snapped = Math.round(angleDeg.get() / STEP) * STEP;
    let diff = (index - activeIndex + COUNT) % COUNT;
    if (diff > COUNT / 2) diff -= COUNT;
    snapAnim.current = animate(angleDeg, snapped - diff * STEP, {
      type: "spring", stiffness: 170, damping: 24,
    });
  }, [isDragging, angleDeg, activeIndex]);

  const registerRefs = useCallback((index: number, refs: CardRefs) => {
    cardRefsArray.current[index] = refs;
  }, []);

  // Height: scales with card height + a small breathing margin
  const containerHeight = cardHeight + 32;

  return (
    /*
     * LAYOUT CONTRACT:
     *   - This div is w-full of the right column. It DOES NOT OVERFLOW its column.
     *   - overflow: hidden clips individual cards that travel beyond the column edge.
     *   - The CSS mask-image (on the inner perspective div) creates the soft edge
     *     dissolve effect without any DOM bleed into the left column.
     *   - Nothing here affects the Hero grid or flex layout.
     */
    <div
      ref={outerRef}
      className="relative w-full select-none"
      style={{ height: containerHeight }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={onMouseLeave}
    >
      {/*
       * Perspective root — fills outerRef exactly.
       * mask-image creates the soft left/right edge dissolve.
       * Cards that travel off-screen are masked, not clipped abruptly.
       */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: "1200px",
          perspectiveOrigin: "50% 48%",
          // Soft edge fade: fully opaque from 14%–86%, dissolves at edges
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
          overflow: "hidden",
        }}
      >
        {/*
         * Stage — exactly the size of the perspective root (inset: 0).
         * This is the ONLY element that receives the parallax tilt.
         * Its transform is set per-frame by the parallax loop.
         * It does NOT translate, scale, or otherwise move the container.
         */}
        <div
          ref={stageRef}
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="cursor-grab active:cursor-grabbing"
        >
          {/* Ambient orange depth bloom — purely decorative */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: "radial-gradient(ellipse 60% 55% at 50% 55%, rgba(235,69,17,0.04) 0%, transparent 70%)",
            }}
          />

          {SHOWCASE_ITEMS.map((item, index) => (
            <CarouselCard
              key={item.id}
              index={index}
              item={item}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              onRegisterRefs={registerRefs}
              onClick={() => onCardClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CarouselCard ─────────────────────────────────────────────────────────────
interface CarouselCardProps {
  index: number;
  item: { id: string; title: string };
  cardWidth: number;
  cardHeight: number;
  onRegisterRefs: (index: number, refs: CardRefs) => void;
  onClick: () => void;
}

const CarouselCard = memo(function CarouselCard({
  index, item, cardWidth, cardHeight, onRegisterRefs, onClick,
}: CarouselCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onRegisterRefs(index, { card: cardRef.current, glow: glowRef.current });
  }, [index, onRegisterRefs]);

  return (
    <div
      ref={cardRef}
      className="absolute rounded-xl"
      style={{
        width: cardWidth,
        height: cardHeight,
        // Center the card at the stage's 50%/50% point.
        // All translateX/Y/Z in the animation moves relative to this center.
        left: "50%",
        top: "50%",
        marginLeft: -(cardWidth / 2),
        marginTop: -(cardHeight / 2),
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
        opacity: 0, // avoid first-frame flash before RAF runs
      }}
      onClick={onClick}
    >
      {/* Orange ambient glow — only visible on the front card */}
      <div
        ref={glowRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: "-28px",
          borderRadius: "inherit",
          opacity: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 85% 75% at 50% 58%, rgba(235,69,17,0.22) 0%, rgba(235,69,17,0.06) 50%, transparent 70%)",
          filter: "blur(22px)",
        }}
      />

      {/* Card face — static shadow to eliminate per-frame paint */}
      <div
        className="w-full h-full relative rounded-xl overflow-hidden flex flex-col"
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(18,18,18,0.94)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.75), 0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        <CarouselWindow viewId={item.id} />

        {/* Diagonal glass sheen */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, transparent 55%, rgba(255,255,255,0.03) 100%)" }}
        />
        {/* Top-edge specular highlight */}
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.16), transparent)" }}
        />
      </div>
    </div>
  );
});
