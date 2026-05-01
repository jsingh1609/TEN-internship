"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

type AnimatedNumberProps = {
  value: number;
};

export function AnimatedNumber({ value }: AnimatedNumberProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString('en-US')
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}
