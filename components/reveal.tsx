"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";

// Fades and lifts its children into place the first time they scroll into view.
export const Reveal = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// A list whose items fade, lift and unblur into place one after another the first time
// the list scrolls into view. Wrap each child in RevealItem. Reduced motion: fade only.
const ease = [0.22, 1, 0.36, 1] as const;

const listTags = { ul: motion.ul, ol: motion.ol, div: motion.div };
const itemTags = { li: motion.li, div: motion.div };

export const RevealList = ({
  as = "ul",
  children,
  className,
  stagger = 0.09,
  delay = 0,
}: {
  as?: keyof typeof listTags;
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) => {
  const Tag = listTags[as];
  return (
    <Tag
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ shown: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      className={className}
    >
      {children}
    </Tag>
  );
};

export const RevealItem = ({
  as = "li",
  children,
  className,
}: {
  as?: keyof typeof itemTags;
  children: React.ReactNode;
  className?: string;
}) => {
  const Tag = itemTags[as];
  const still = useReducedMotion();
  return (
    <Tag
      variants={{
        hidden: still ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(8px)" },
        shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } },
      }}
      className={className}
    >
      {children}
    </Tag>
  );
};
