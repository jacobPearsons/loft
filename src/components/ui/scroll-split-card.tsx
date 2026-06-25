"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ScrollSplitCardItem {
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  icon?: React.ReactNode;
  href?: string;
  content?: React.ReactNode;
}

interface ScrollSplitCardProps {
  className?: string;
  imageSrc?: string;
  cards: ScrollSplitCardItem[];
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function ScrollSplitCard({
  className,
  imageSrc,
  cards,
  containerRef: externalContainerRef,
}: ScrollSplitCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const container = externalContainerRef as React.RefObject<HTMLElement> | undefined;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    ...(container ? { container } : {}),
    offset: ["start start", "end end"],
  });

  const leftX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -48, -24]);
  const rightX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 48, 24]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);

  const rotateY = useTransform(scrollYProgress, [0.4, 0.8], [0, 180]);

  const borderRadiusLeft = useTransform(scrollYProgress, [0, 0.2], ["16px 0px 0px 16px", "16px 16px 16px 16px"]);
  const borderRadiusMiddle = useTransform(scrollYProgress, [0, 0.2], ["0px 0px 0px 0px", "16px 16px 16px 16px"]);
  const borderRadiusRight = useTransform(scrollYProgress, [0, 0.2], ["0px 16px 16px 0px", "16px 16px 16px 16px"]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.2]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.4]);
  const boxShadow = useMotionTemplate`inset 0 1px 1px rgba(255, 255, 255, ${borderOpacity}), inset 0 -24px 48px rgba(0, 0, 0, ${shadowOpacity}), 0 25px 50px -12px rgba(0, 0, 0, ${shadowOpacity})`;

  const cardsY = useTransform(scrollYProgress, [0.8, 1], [0, -200]);
  const router = useRouter();

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[500vh] w-full", className)}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden [perspective:1200px]">
        <motion.div
          style={{ scale, y: cardsY, transformStyle: "preserve-3d" }}
          className="flex h-[280px] sm:h-[400px] w-full max-w-5xl px-4 relative"
        >
          {cards.slice(0, 3).map((card, i) => (
            <motion.div
              key={i}
              className={cn("relative h-full flex-1", card.href && "cursor-pointer")}
              onClick={() => card.href && router.push(card.href)}
              style={{
                x: i === 0 ? leftX : i === 2 ? rightX : 0,
                rotateY,
                zIndex: i,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front Side: Image or Gradient */}
              <motion.div
                className={cn(
                  "absolute inset-0 overflow-hidden [backface-visibility:hidden]",
                  !imageSrc && "bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950"
                )}
                style={{
                  zIndex: 2,
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                }}
              >
                {imageSrc ? (
                  <div
                    className="absolute inset-0 h-full w-[300%]"
                    style={{
                      left: `${-100 * i}%`,
                      backgroundImage: `url(${imageSrc})`,
                      backgroundSize: "100% 100%",
                      backgroundPosition: "center",
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={cn(
                        "h-16 w-16 sm:h-24 sm:w-24 rounded-full opacity-[0.04]",
                        i === 0 ? "bg-emerald-400" : i === 1 ? "bg-blue-400" : "bg-purple-400"
                      )}
                    />
                  </div>
                )}
              </motion.div>

              {/* Back Side: Content Card */}
              <motion.div
                className={cn(
                  "absolute inset-0 overflow-hidden flex flex-col [backface-visibility:hidden] will-change-transform",
                  "border border-white/5 bg-gradient-to-br from-white/10 to-transparent",
                  "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-24px_48px_rgba(0,0,0,0.2)]"
                )}
                style={{
                  backgroundColor: card.bgColor,
                  color: card.textColor,
                  transform: "rotateY(180deg)",
                  zIndex: 1,
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage: `url("https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png?width=256&height=256")`,
                    backgroundRepeat: "repeat",
                  }}
                />

                {card.content ? (
                  <div className="relative z-10 flex flex-col h-full p-5 sm:p-7">
                    {card.content}
                  </div>
                ) : card.href ? (
                  <Link href={card.href} className="relative z-10 flex flex-col h-full p-5 sm:p-7">
                    <div className="mb-auto mt-2 sm:mt-6">{card.icon}</div>
                    <h3 className="mb-1 text-base sm:text-2xl font-medium leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm opacity-80">{card.description}</p>
                  </Link>
                ) : (
                  <div className="relative z-10 flex flex-col h-full p-5 sm:p-7">
                    <div className="mb-auto">{card.icon}</div>
                    <h3 className="mb-2 sm:mb-4 text-base sm:text-2xl font-medium leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm opacity-80">{card.description}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
