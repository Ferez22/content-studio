"use client";
import React, { createContext, useContext, useState } from "react";

// Card visuals stay still until their card is hovered or focused, then play. Outside a
// HoverPlay (service page heroes, the Services menu preview) they play as before.
// JS-driven visuals read usePlaying(); CSS animations are switched off by the
// [data-still] rule in globals.css.
const PlayingContext = createContext(true);

export const usePlaying = () => useContext(PlayingContext);

export const HoverPlay = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      className={className}
      data-still={playing ? undefined : ""}
      onPointerEnter={() => setPlaying(true)}
      onPointerLeave={() => setPlaying(false)}
      onFocus={() => setPlaying(true)}
      onBlur={() => setPlaying(false)}
    >
      <PlayingContext.Provider value={playing}>{children}</PlayingContext.Provider>
    </div>
  );
};
