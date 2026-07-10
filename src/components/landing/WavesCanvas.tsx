"use client";

import { useEffect, useRef } from "react";

// Canvas layer of the hero: 5 glowing wave lines that react to the mouse.
// Colors come from the CSS vars defined in globals.css (spec §3).
// Fixes over the reference component (spec §S1 + prompt L2a):
// - prefers-reduced-motion → draw ONE static frame, no RAF loop
// - RAF pauses when the tab is hidden (visibilitychange)
// - RAF pauses when the hero leaves the viewport (IntersectionObserver)

type Point = { x: number; y: number };

interface WaveConfig {
  offset: number;
  amplitude: number;
  frequency: number;
  color: string;
  opacity: number;
}

function cssVarRgba(name: string, alpha: number, fallback: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hex = raw || fallback;
  const m = hex.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export default function WavesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const backgroundTop = cssVarRgba("--background", 1, "#ffffff");
    const backgroundBottom = cssVarRgba("--muted", 0.95, "#f1f5f9");
    const waves: WaveConfig[] = [
      { offset: 0, amplitude: 70, frequency: 0.003, color: cssVarRgba("--primary", 0.8, "#1d4ed8"), opacity: 0.45 },
      { offset: Math.PI / 2, amplitude: 90, frequency: 0.0026, color: cssVarRgba("--accent", 0.7, "#22d3ee"), opacity: 0.35 },
      { offset: Math.PI, amplitude: 60, frequency: 0.0034, color: cssVarRgba("--secondary", 0.65, "#0d9488"), opacity: 0.3 },
      { offset: Math.PI * 1.5, amplitude: 80, frequency: 0.0022, color: cssVarRgba("--primary", 0.25, "#1d4ed8"), opacity: 0.25 },
      { offset: Math.PI * 2, amplitude: 55, frequency: 0.004, color: cssVarRgba("--foreground", 0.2, "#0f172a"), opacity: 0.2 },
    ];

    const mouse: Point = { x: 0, y: 0 };
    const targetMouse: Point = { x: 0, y: 0 };
    const mouseInfluence = 70;
    const influenceRadius = 320;
    const smoothing = 0.1;

    let time = 0;
    let animationId = 0;
    let running = false;
    let inView = true;
    let cssW = 0;
    let cssH = 0;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = window.innerWidth;
      cssH = canvas.parentElement?.clientHeight ?? window.innerHeight;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const recenterMouse = () => {
      mouse.x = targetMouse.x = cssW / 2;
      mouse.y = targetMouse.y = cssH / 2;
    };

    const drawWave = (wave: WaveConfig) => {
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= cssW; x += 4) {
        const dx = x - mouse.x;
        const dy = cssH / 2 - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / influenceRadius);
        const mouseEffect =
          influence * mouseInfluence * Math.sin(time * 0.001 + x * 0.01 + wave.offset);
        const y =
          cssH / 2 +
          Math.sin(x * wave.frequency + time * 0.002 + wave.offset) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.4 + time * 0.003) * (wave.amplitude * 0.45) +
          mouseEffect;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = wave.color;
      ctx.globalAlpha = wave.opacity;
      ctx.shadowBlur = 35;
      ctx.shadowColor = wave.color;
      ctx.stroke();
      ctx.restore();
    };

    const drawFrame = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, cssH);
      gradient.addColorStop(0, backgroundTop);
      gradient.addColorStop(1, backgroundBottom);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      waves.forEach(drawWave);
    };

    const animate = () => {
      time += 1;
      mouse.x += (targetMouse.x - mouse.x) * smoothing;
      mouse.y += (targetMouse.y - mouse.y) * smoothing;
      drawFrame();
      animationId = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      animationId = window.requestAnimationFrame(animate);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(animationId);
    };
    const syncRunning = () => {
      if (document.hidden || !inView) stop();
      else start();
    };

    const handleResize = () => {
      resizeCanvas();
      recenterMouse();
      if (reduce) drawFrame();
    };
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    };
    const handleMouseLeave = () => recenterMouse();

    resizeCanvas();
    recenterMouse();

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", syncRunning);
    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        syncRunning();
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    if (reduce) {
      // Single static frame; no loop, no mouse reactivity.
      drawFrame();
    } else {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
      start();
    }

    return () => {
      stop();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", syncRunning);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
