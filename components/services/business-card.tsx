"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconCircleCheckFilled,
  IconMail,
} from "@tabler/icons-react";
import { LogoIcon } from "@/components/logo";
import { cn } from "@/lib/utils";

// Fares's digital business card, drawn as a function of time so the same component shows the
// finished card (still) or the card building itself in an editor (in motion): a cursor adds
// each element, edits two of them and publishes. Every position is fixed on a 340 x 430 card.

const LOOP = 11.5;
const END = 10;
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);

// Cursor path in card coordinates: [time, x, y]; clicks happen on arrival.
const PATH: [number, number, number][] = [
  [0, 300, 500],
  [0.95, 72, 72],
  [1.6, 120, 150],
  [2.75, 120, 182],
  [4.0, 170, 262],
  [5.4, 170, 342],
  [6.25, 170, 400],
  [7.1, 112, 112],
  [8.1, 120, 150],
  [8.8, 170, 468],
  [10.2, 300, 500],
];
const CLICKS = [1.0, 1.7, 2.8, 4.05, 5.45, 6.3, 7.2, 8.2, 8.9];

const cursorAt = (t: number) => {
  for (let i = 1; i < PATH.length; i++) {
    const [t1, x1, y1] = PATH[i];
    const [t0, x0, y0] = PATH[i - 1];
    if (t <= t1) {
      // Travel during the last 0.45 s before each target, rest otherwise.
      const k = ease((t - (t1 - 0.45)) / 0.45);
      return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k };
    }
  }
  const [, x, y] = PATH[PATH.length - 1];
  return { x, y };
};

const typed = (text: string, t: number, start: number, perSecond: number) =>
  text.slice(0, Math.max(0, Math.floor((t - start) * perSecond)));

export const BusinessCard = ({ t, chrome }: { t: number; chrome: boolean }) => {
  const c = useTranslations("servicePages.video-motion.compare.card");
  const appear = (start: number, length = 0.3) => ease((t - start) / length);
  const photo = appear(1.05);
  const blob = ease((t - 7.3) / 0.5);
  const serif = t >= 8.25;
  const published = t >= 8.9;
  const chromeOn = chrome && !published;
  const chromeFade = chrome ? 1 - clamp((t - 9.0) / 0.4) : 0;
  const stamp = appear(9.05, 0.35);
  const outro = chrome ? 1 - clamp((t - 11.1) / 0.4) : 1;
  const cursor = cursorAt(t);
  const click = CLICKS.find((at) => t >= at && t < at + 0.35);
  const radius = `${16 + 32 * blob}% ${16 + 36 * blob}% ${16 + 29 * blob}% ${16 + 39 * blob}% / ${16 + 34 * blob}% ${16 + 29 * blob}% ${16 + 39 * blob}% ${16 + 34 * blob}%`;
  const socials = [IconBrandLinkedin, IconBrandGithub, IconBrandX, IconBrandInstagram];
  const contacts = [{ Icon: IconMail, text: c("email") }];
  // Dashed placeholders show where the next elements go while editing.
  const Slot = ({ show, className }: { show: boolean; className: string }) =>
    chrome && show ? (
      <span className={cn("absolute rounded-lg border border-dashed border-neutral-300 transition-opacity duration-300", className)} style={{ opacity: chromeFade }} />
    ) : null;

  return (
    <div className="relative mx-auto h-[540px] w-full overflow-hidden bg-[#eeeae3]" style={{ opacity: outro }}>
      <div className="absolute inset-x-0 top-0 h-28 bg-neutral-900">
        <span className="absolute -left-4 -top-4 font-logo text-[120px] leading-none text-white/[0.06] whitespace-nowrap">Qartmina</span>
      </div>
      <div className="absolute left-1/2 top-10 h-[430px] w-[340px] -translate-x-1/2 rounded-[30px] bg-[#fdfbf6] ring-1 ring-black/10 text-neutral-900">
        {chromeOn || chromeFade > 0 ? (
          <span className="absolute -top-3 left-5 flex items-center gap-1.5 rounded-full bg-[#1E40FF] px-2.5 py-1 text-[10px] font-semibold text-white" style={{ opacity: chromeFade }}>
            <span className="size-1.5 rounded-full bg-white animate-pulse" />
            {c("editing")}
          </span>
        ) : null}

        {/* Photo: added square, then edited into an organic shape */}
        <Slot show={photo < 1} className="left-[22px] top-[22px] size-[100px] rounded-2xl" />
        <div
          className="absolute left-[22px] top-[22px] size-[100px] overflow-hidden"
          style={{ borderRadius: radius, transform: `scale(${0.6 + 0.4 * photo})`, opacity: photo }}
        >
          <Image src="/team/fares-aouani-cherif.jpeg" alt={c("photoAlt")} fill sizes="100px" className="object-cover object-top" />
        </div>
        {chrome && t >= 7.2 && t < 7.95 && (
          <span className="absolute left-[18px] top-[18px] size-[108px] border border-[#1E40FF]">
            {["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"].map((corner) => (
              <span key={corner} className={cn("absolute size-2 bg-white border border-[#1E40FF]", corner)} />
            ))}
          </span>
        )}

        <span className="absolute right-[22px] top-[132px]" style={{ opacity: chrome ? stamp : 1, transform: `scale(${chrome ? 0.6 + 0.4 * stamp : 1})` }}>
          <LogoIcon className="size-10" />
        </span>

        <Slot show={t < 1.75} className="left-[22px] top-[136px] h-8 w-[200px]" />
        <p
          className={cn(
            "absolute left-[22px] top-[136px] text-[26px] leading-8 tracking-tight",
            serif ? "font-logo" : "font-sans font-semibold text-[22px]",
            chrome && t >= 8.2 && t < 8.6 && "bg-[#1E40FF]/15"
          )}
        >
          {chrome ? typed(c("name"), t, 1.75, 28) : c("name")}
        </p>

        <Slot show={t < 2.85} className="left-[22px] top-[174px] h-9 w-[190px]" />
        <p className="absolute left-[22px] top-[174px] text-[13px] leading-[18px] text-neutral-500">
          {chrome ? typed(c("title"), t, 2.85, 45) : c("title")}
          <br />
          {chrome ? typed(c("company"), t, 3.5, 30) : c("company")}
        </p>

        <Slot show={t < 4.1} className="left-[22px] top-[222px] h-[84px] w-[296px]" />
        <p className="absolute left-[22px] top-[222px] w-[296px] text-[13px] leading-[21px]">
          {chrome ? typed(c("bio"), t, 4.1, 150) : c("bio")}
        </p>

        <Slot show={t < 5.5} className="left-[67px] top-[318px] h-12 w-[206px] rounded-full" />
        <div className="absolute left-[67px] top-[320px] flex gap-[10px]">
          {socials.map((Icon, index) => {
            const k = chrome ? appear(5.5 + index * 0.15, 0.25) : 1;
            return (
              <span key={index} className="size-11 rounded-full border border-neutral-300 flex items-center justify-center" style={{ opacity: k, transform: `scale(${0.5 + 0.5 * k})` }}>
                <Icon className="size-5" />
              </span>
            );
          })}
        </div>

        <Slot show={t < 6.35} className="left-[22px] top-[382px] h-[38px] w-[296px]" />
        {contacts.map(({ Icon, text }, index) => {
          const k = chrome ? appear(6.35 + index * 0.2, 0.3) : 1;
          return (
            <div
              key={index}
              className="absolute left-[22px] w-[296px] flex items-center gap-3 border-t border-neutral-200 py-2.5 text-[13px]"
              style={{ top: 380 + index * 38, opacity: k, transform: `translateX(${(1 - k) * -16}px)` }}
            >
              <Icon className="size-4" />
              {text}
            </div>
          );
        })}

        {chrome && (
          <span
            className={cn(
              "absolute left-1/2 top-[450px] -translate-x-1/2 flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold transition-colors duration-300",
              published ? "bg-green-600 text-white" : "bg-black text-white"
            )}
            style={{ opacity: published ? 1 - clamp((t - 9.6) / 0.4) : 1 }}
          >
            {published && <IconCircleCheckFilled className="size-4" />}
            {published ? c("published") : c("publish")}
          </span>
        )}

        {chrome && (
          <span className="pointer-events-none absolute z-10" style={{ left: cursor.x, top: cursor.y }}>
            {click !== undefined && (
              <span className="absolute -left-4 -top-4 size-8 rounded-full bg-[#1E40FF]/25" style={{ transform: `scale(${0.4 + (t - click) * 2})`, opacity: 1 - (t - click) / 0.35 }} />
            )}
            <svg viewBox="0 0 24 24" className="relative size-5 drop-shadow">
              <path d="M4 2l15 10-6.5 1.4L9.6 20z" fill="#111" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
};

// The card building itself on a loop while on screen; the finished card without motion.
export const BuildingCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!inView || reduceMotion) return;
    let frame = 0;
    const start = performance.now() - t * 1000;
    const tick = (now: number) => {
      setT(((now - start) / 1000) % LOOP);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Resumes from the current time when it comes back on screen.
  }, [inView, reduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div ref={ref}>
      <BusinessCard t={reduceMotion ? END : t} chrome={!reduceMotion} />
    </div>
  );
};

export const StillCard = () => <BusinessCard t={END} chrome={false} />;
