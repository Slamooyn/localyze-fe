"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// S2 — adapted from markdowns/reference/container-scroll-reference.tsx (spec §S2):
// hardware colors switched to brand navy (#172554 border, #0B1B3B bg), section
// height trimmed vs the reference (no empty scroll), and prefers-reduced-motion
// renders the card upright & static instead of the tilt animation.

export function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, layoutEffect: false });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.7, 0.9] : [1.05, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  if (reduce) {
    return (
      <div className="relative flex flex-col items-center justify-center p-2 py-16 md:p-16">
        <div className="mx-auto max-w-5xl text-center">{titleComponent}</div>
        <RevealCard static>{children}</RevealCard>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-[60rem] items-center justify-center p-2 md:h-[72rem] md:p-16"
    >
      <div className="relative w-full py-8 md:py-24" style={{ perspective: "1000px" }}>
        <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl text-center">
          {titleComponent}
        </motion.div>
        <RevealCard rotate={rotate} scale={scale}>
          {children}
        </RevealCard>
      </div>
    </div>
  );
}

function RevealCard({
  rotate,
  scale,
  static: isStatic = false,
  children,
}: {
  rotate?: MotionValue<number>;
  scale?: MotionValue<number>;
  static?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={
        isStatic
          ? undefined
          : {
              rotateX: rotate,
              scale,
              boxShadow:
                "0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a",
            }
      }
      className={`mx-auto h-[24rem] w-full max-w-5xl rounded-[30px] border-4 border-[#172554] bg-[#0B1B3B] p-2 sm:h-[28rem] md:h-[36rem] md:p-4 ${
        isStatic ? "mt-10 shadow-2xl" : "-mt-8"
      }`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#0B1B3B]">
        {children}
      </div>
    </motion.div>
  );
}
