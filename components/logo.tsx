"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import WavyText from "./wavy-text";
import { Link } from "@/i18n/navigation";
import React from "react";

export const Logo = ({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) => {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <motion.span
        whileHover={{ scale: 1.05 }}
        className={cn(
          "font-logo font-bold tracking-tight text-gray-900 dark:text-white transition-all duration-500 ease-out",
          compact ? "text-xl" : "text-2xl"
        )}
      >
        <WavyText text="Qartmina." />
      </motion.span>
    </Link>
  );
};

// The "Q." brand mark, drawn as text so it follows the wordmark font and theme colour.
export const LogoIcon = (props: React.SVGAttributes<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <text
        x="12"
        y="19"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="var(--font-garamond), Georgia, serif"
        fontWeight="700"
        fontSize="22"
      >
        Q.
      </text>
    </svg>
  );
};
