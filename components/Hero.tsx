"use client";

import { motion } from "framer-motion";
import { Ship } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { HoverButton } from "./ui/hover-button";

function SparkLeft({
  className,
  delay = 0,
  width = 400,
  height = 100,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -150,
        y: -150,
      }}
      animate={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <Image
          src="/spark-left.svg"
          height={height}
          width={width}
          quality={100}
          alt="spark left"
        />
      </motion.div>
    </motion.div>
  );
}

function SparkRight({
  className,
  delay = 0,
  width = 400,
  height = 100,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 150,
        y: -150,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <Image
          src="/spark-left.svg"
          height={height}
          className="scale-x-[-1]"
          width={width}
          quality={100}
          alt="spark right"
        />
      </motion.div>
    </motion.div>
  );
}
function CenterArc({
  className,
  delay = 0,
  height,
  width,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: 1.5 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        style={{ width, height }}
        className="relative"
      >
        <Image
          width={width}
          height={height}
          src="/center-arc.svg"
          alt="spark left"
        />
      </motion.div>
    </motion.div>
  );
}

function SparkCenter({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: 1.5 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        className="relative"
      >
        <img src="/spark-center.svg" alt="center spark" />
      </motion.div>
    </motion.div>
  );
}

function Hero({}: {}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#00020F]">
      <div className="absolute inset-0" />
      <div className="absolute inset-0 overflow-hidden">
        <SparkLeft
          delay={0.6}
          width={611.215}
          height={537.565}
          className="left-[-5%] top-[0%] md:top-[0%] shrink-0 pointer-events-none"
        />

        <SparkCenter
          delay={0.3}
          className="absolute top-0 left-[25%] w-full h-full shrink-0 pointer-events-none"
        />
        <div className="flex items-center justify-center w-full h-full">
          <CenterArc
            delay={0.3}
            className="shrink-0 pointer-events-none top-[10%]"
            height={818}
            width={1440}
          />
        </div>

        <SparkRight
          delay={0.6}
          width={611.215}
          height={537.565}
          className="right-[-5%] top-[0%] md:top-[0%] shrink-0 pointer-events-none"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6 md:mb-8"
          >
            <span className="text-sm text-white/60 tracking-wide">
              Dream It, Build It,
            </span>
            <span className="text-sm text-white/80 tracking-wide">Ship It</span>
            <Ship className="h-3.5 w-3.5 text-white  " />
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                What are you
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-[#4D76FF] via-[#D5FFFF] to-[#1A4FFF] "
                )}
              >
                Shipping Today?
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              Connect with skilled ppl, form teams, and turn your ideas into
              real products. Explore daily updates of student-created projects
              and events
            </p>
            <HoverButton className="text-white">Start Building</HoverButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
