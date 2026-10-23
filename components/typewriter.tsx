"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const TYPE_MS = 55;
const DELETE_MS = 30;
const PAUSE_MS = 1100;

// Types a phrase, pauses, deletes it and moves to the next one, forever.
export const Typewriter = ({ phrases }: { phrases: string[] }) => {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(phrases[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const phrase = phrases[index];
    let delay = deleting ? DELETE_MS : TYPE_MS;
    if (!deleting && text === phrase) delay = PAUSE_MS;

    const timeout = setTimeout(() => {
      if (!deleting && text === phrase) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      } else {
        setText(deleting ? phrase.slice(0, text.length - 1) : phrase.slice(0, text.length + 1));
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, deleting, index, phrases, reduceMotion]);

  return (
    <span className="whitespace-nowrap">
      {text}
      <span
        aria-hidden="true"
        className="typewriter-caret inline-block w-[0.08em] h-[0.9em] -mb-[0.05em] ml-[0.04em] -mr-[0.12em] bg-[#1E40FF] dark:bg-blue-500 align-baseline"
      />
    </span>
  );
};
