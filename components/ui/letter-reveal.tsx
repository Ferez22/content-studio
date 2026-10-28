import React from "react";
import { cn } from "@/lib/utils";

// Each letter springs up from below a mask, one after the other. Pure CSS: words are
// overflow-hidden boxes, letters sit at translateY(110%) until `active`, and the spring
// easing overshoots slightly. Padding inside each box keeps the overshoot from clipping.
export const LetterReveal = ({
  text,
  active,
  className,
  stagger = 40,
}: {
  text: string;
  active: boolean;
  className?: string;
  stagger?: number;
}) => {
  let index = 0;
  return (
    <span className={cn("inline", className)}>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((word, wordIndex, words) => (
        <React.Fragment key={wordIndex}>
          <span aria-hidden="true" className="inline-flex overflow-hidden -my-[0.15em] py-[0.15em]">
            {[...word].map((letter) => {
              const delay = index++ * stagger;
              return (
                <span
                  key={delay}
                  className={cn(
                    "inline-block transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none motion-reduce:translate-y-0",
                    active ? "translate-y-0" : "translate-y-[110%]"
                  )}
                  style={{ transitionDelay: active ? `${delay}ms` : "0ms" }}
                >
                  {letter}
                </span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </span>
  );
};
