"use client";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Swipeable row on phones (native scroll snapping) with position dots; a plain grid from md up.
export const SnapCarousel = ({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const slides = React.Children.toArray(children);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const slideWidth = track.scrollWidth / slides.length;
    setActive(Math.round(track.scrollLeft / slideWidth));
  };

  const goTo = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (track && slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        role="region"
        aria-label={label}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:mx-0 md:px-0"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="snap-start shrink-0 w-[82%] rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 md:w-auto md:rounded-none md:bg-transparent md:dark:bg-transparent md:border-0 md:p-0"
          >
            {slide}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-4 md:hidden">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            aria-label={`${index + 1} / ${slides.length}`}
            aria-current={active === index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              active === index
                ? "w-6 bg-[#1E40FF] dark:bg-blue-400"
                : "w-1.5 bg-neutral-300 dark:bg-neutral-700"
            )}
          />
        ))}
      </div>
    </div>
  );
};
