"use client";
import React, { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useTranslations } from "next-intl";
import {
  IconArrowUp,
  IconBrandGmail,
  IconBrandNotion,
  IconBrandOpenai,
  IconBrandSlack,
  IconCircleCheck,
  IconDatabase,
  IconFileTypePdf,
  IconMail,
  IconPlayerPlayFilled,
  IconRefresh,
  IconReportAnalytics,
} from "@tabler/icons-react";
import { HubspotIcon, SheetsIcon } from "@/icons";
import { cn } from "@/lib/utils";

// Every scene is drawn on a 1000 x 600 canvas with the robot at its centre.
const W = 1000;
const H = 600;
const CX = 500;
const CY = 300;
const ROBOT_R = 110;
const NODE_R = 44;
const SCENE_MS = 6500;

const scenes = ["integration", "agent", "automation"] as const;
type Scene = (typeof scenes)[number];

const pct = (x: number, y: number) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

// Straight spoke between the robot's edge and a node's edge.
const spoke = (x: number, y: number) => {
  const len = Math.hypot(x - CX, y - CY);
  const ux = (x - CX) / len;
  const uy = (y - CY) / len;
  return `M ${CX + ux * ROBOT_R} ${CY + uy * ROBOT_R} L ${x - ux * NODE_R} ${y - uy * NODE_R}`;
};

// Curve from a left node into the robot, and from the robot out to a right node.
const curveIn = (x: number, y: number) => {
  const nodeX = x + NODE_R;
  const robotX = CX - ROBOT_R;
  return `M ${nodeX} ${y} C ${nodeX + 130} ${y}, ${robotX - 110} ${CY}, ${robotX} ${CY}`;
};
const curveOut = (x: number, y: number) => {
  const nodeX = x - NODE_R;
  const robotX = CX + ROBOT_R;
  return `M ${robotX} ${CY} C ${robotX + 110} ${CY}, ${nodeX - 130} ${y}, ${nodeX} ${y}`;
};

const integrationNodes = [
  { x: 500, y: 82, label: "OpenAI", icon: <IconBrandOpenai className="size-1/2" /> },
  { x: 762, y: 190, label: "Slack", icon: <IconBrandSlack className="size-1/2 text-[#E01E5A]" /> },
  { x: 762, y: 410, label: "Notion", icon: <IconBrandNotion className="size-1/2" /> },
  { x: 500, y: 518, label: "Excel", icon: <SheetsIcon className="size-1/2" /> },
  { x: 238, y: 410, label: "HubSpot", icon: <HubspotIcon className="size-1/2" /> },
  { x: 238, y: 190, label: "Gmail", icon: <IconBrandGmail className="size-1/2 text-[#EA4335]" /> },
];

const agentInputIcons = [
  <span key="files" className="flex -space-x-1 *:size-5 md:*:size-6">
    <IconFileTypePdf className="text-red-500" />
    <SheetsIcon />
  </span>,
  <IconDatabase key="erp" className="size-1/2 text-indigo-500" />,
  <IconMail key="mail" className="size-1/2 text-blue-500" />,
];
const agentOutputIcons = [
  <IconReportAnalytics key="report" className="size-1/2 text-orange-500" />,
  <IconRefresh key="crm" className="size-1/2 text-blue-500" />,
  <IconCircleCheck key="ok" className="size-1/2 text-green-500" />,
];
const SIDE_YS = [130, 300, 470];

export const HeroWorkflow = () => {
  const t = useTranslations("home.workflow");
  const reduceMotion = useReducedMotion();
  const [scene, setScene] = useState<Scene>("integration");
  const next = () => setScene((s) => scenes[(scenes.indexOf(s) + 1) % scenes.length]);

  // Pointer position drives a slight 3D tilt and a glow that follows the cursor.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 120, damping: 20 });
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX} ${glowY}, rgba(30, 64, 255, 0.12), transparent 70%)`;

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width);
    my.set((event.clientY - rect.top) / rect.height);
  };
  const onPointerLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="group/workflow relative my-10 md:my-20 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden"
    >
      {/* Faint grid and a cursor-following glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 [background-size:48px_48px] [background-image:linear-gradient(to_right,var(--color-neutral-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-200)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,var(--color-neutral-800)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-800)_1px,transparent_1px)] mask-radial-from-40% opacity-70"
      />
      <motion.div aria-hidden="true" className="absolute inset-0" style={{ background: glow }} />

      <div className="relative z-10 flex flex-col items-center pt-6 md:pt-8 px-4">
        <div role="tablist" className="flex justify-center gap-1 md:gap-2">
          {scenes.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={scene === s}
              onClick={() => setScene(s)}
              className={cn(
                "relative overflow-hidden rounded-full px-2.5 md:px-4 py-1.5 text-[11px] md:text-sm font-semibold uppercase md:tracking-wide border transition-colors duration-200",
                scene === s
                  ? "bg-white dark:bg-neutral-950 border-[#1E40FF]/40 text-[#1E40FF] dark:text-blue-400 shadow-sm"
                  : "border-transparent text-neutral-500 hover:text-black dark:hover:text-white"
              )}
            >
              {t(`tabs.${s}`)}
              {scene === s && !reduceMotion && (
                <span
                  key={s}
                  aria-hidden="true"
                  onAnimationEnd={next}
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[#1E40FF] dark:bg-blue-400 group-hover/workflow:[animation-play-state:paused]"
                  style={{ animation: `progress-fill ${SCENE_MS}ms linear forwards` }}
                />
              )}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={scene}
            initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
            transition={{ duration: 0.25 }}
            className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 text-center"
          >
            {t(`captions.${scene}`)}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="relative z-10 [perspective:1400px] px-2 md:px-10 pb-6 md:pb-10">
        <motion.div
          style={reduceMotion ? undefined : { rotateX, rotateY }}
          className="relative w-full aspect-[10/6] max-w-5xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={scene}
              className="absolute inset-0"
              initial="hidden"
              animate="shown"
              exit="hidden"
            >
              {scene === "integration" && <IntegrationScene />}
              {scene === "agent" && (
                <AgentScene inputs={t.raw("inputs") as string[]} outputs={t.raw("outputs") as string[]} />
              )}
              {scene === "automation" && (
                <AutomationScene
                  trigger={t("trigger")}
                  triggerText={t("triggerText")}
                  action={t("action")}
                  actionText={t("actionText")}
                  loop={t("loop")}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <RobotCore alt={t("robotAlt")} />
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ---------- Robot ---------- */

const RobotCore = ({ alt }: { alt: string }) => {
  const reduceMotion = useReducedMotion();
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 aspect-square z-20"
      style={{ ...pct(CX, CY), width: `${((ROBOT_R * 2) / W) * 100}%` }}
    >
      <span
        aria-hidden="true"
        className="absolute -inset-3 rounded-full bg-[#1E40FF]/15 dark:bg-blue-500/20 animate-ping [animation-duration:3s]"
      />
      {/* The video's background is pure white, so a white disc hides its edges in both themes. */}
      <div className="relative size-full rounded-full bg-white ring-1 ring-neutral-200 dark:ring-neutral-700 shadow-2xl shadow-[#1E40FF]/20 overflow-hidden flex items-center justify-center">
        {reduceMotion ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/robot/robot-poster.webp" alt={alt} className="size-[92%] object-contain" />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/robot/robot-poster.webp"
            aria-label={alt}
            className="size-[92%] object-contain mix-blend-multiply"
          >
            <source src="/robot/robot.webm" type="video/webm" />
            <source src="/robot/robot.mp4" type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
};

/* ---------- Shared pieces ---------- */

const lineClass = "stroke-neutral-300 dark:stroke-neutral-700";
const dotClass = "fill-[#1E40FF] dark:fill-blue-400";

const Paths = ({ paths, delay = 0.25 }: { paths: string[]; delay?: number }) => (
  <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
    {paths.map((d, i) => (
      <g key={d}>
        <motion.path
          d={d}
          fill="none"
          strokeWidth={2}
          className={lineClass}
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: { pathLength: 1, opacity: 1, transition: { duration: 0.6, delay: delay + i * 0.06 } },
          }}
        />
        <circle r={5} className={dotClass}>
          <animateMotion dur={`${1.6 + (i % 3) * 0.35}s`} begin={`${0.6 + i * 0.2}s`} repeatCount="indefinite" path={d} />
        </circle>
      </g>
    ))}
  </svg>
);

// Nodes fly out from the robot to their place, and back in on exit.
const Node = ({
  x,
  y,
  index,
  label,
  sublabel,
  children,
  square = false,
}: {
  x: number;
  y: number;
  index: number;
  label?: string;
  sublabel?: string;
  children: React.ReactNode;
  square?: boolean;
}) => {
  const size = square ? 128 : NODE_R * 2;
  return (
    <motion.div
      variants={{
        hidden: { ...pct(CX, CY), opacity: 0, scale: 0.3 },
        shown: {
          ...pct(x, y),
          opacity: 1,
          scale: 1,
          transition: { type: "spring", stiffness: 180, damping: 18, delay: index * 0.06 },
        },
      }}
      // Never smaller than 36px, so icons stay legible on phones.
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 min-w-9"
      style={{ width: `${(size / W) * 100}%` }}
    >
      <motion.div
        whileHover={{ scale: 1.12 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className={cn(
          "aspect-square w-full flex flex-col items-center justify-center gap-1 bg-white dark:bg-neutral-950 border-2 border-neutral-200 dark:border-neutral-700 shadow-lg shadow-black/5 hover:border-[#1E40FF] dark:hover:border-blue-400 transition-colors duration-200 cursor-default",
          square ? "rounded-2xl" : "rounded-full"
        )}
      >
        {children}
        {square && label && (
          <span className="text-[10px] md:text-sm font-bold text-neutral-700 dark:text-neutral-200">{label}</span>
        )}
      </motion.div>
      {!square && label && (
        <p className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap text-xs font-medium text-neutral-600 dark:text-neutral-300">
          {label}
        </p>
      )}
      {square && sublabel && (
        <p className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap text-xs text-neutral-500 dark:text-neutral-400">
          {sublabel}
        </p>
      )}
    </motion.div>
  );
};

/* ---------- Scenes ---------- */

const IntegrationScene = () => (
  <>
    <Paths paths={integrationNodes.map((n) => spoke(n.x, n.y))} />
    {integrationNodes.map((n, i) => (
      <Node key={n.label} x={n.x} y={n.y} index={i} label={n.label}>
        {n.icon}
      </Node>
    ))}
  </>
);

const AgentScene = ({ inputs, outputs }: { inputs: string[]; outputs: string[] }) => {
  // Path direction sets the dots' direction: into the robot, then out of it.
  const paths = [...SIDE_YS.map((y) => curveIn(150, y)), ...SIDE_YS.map((y) => curveOut(850, y))];
  return (
    <>
      <Paths paths={paths} />
      {SIDE_YS.map((y, i) => (
        <Node key={`in-${i}`} x={150} y={y} index={i} label={inputs[i]}>
          {agentInputIcons[i]}
        </Node>
      ))}
      {SIDE_YS.map((y, i) => (
        <Node key={`out-${i}`} x={850} y={y} index={i + 3} label={outputs[i]}>
          {agentOutputIcons[i]}
        </Node>
      ))}
    </>
  );
};

const AutomationScene = ({
  trigger,
  triggerText,
  action,
  actionText,
  loop,
}: {
  trigger: string;
  triggerText: string;
  action: string;
  actionText: string;
  loop: string;
}) => {
  const forward = [`M 238 ${CY} L ${CX - ROBOT_R - 12} ${CY}`, `M ${CX + ROBOT_R + 12} ${CY} L 762 ${CY}`];
  const loopPath = `M 830 408 C 830 590, 170 590, 170 408`;
  return (
    <>
      <Paths paths={[...forward, loopPath]} />
      <motion.p
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: 0.6 } } }}
        className="absolute -translate-x-1/2 text-[10px] md:text-sm font-medium text-[#1E40FF] dark:text-blue-400"
        style={pct(CX, 572)}
      >
        {loop}
      </motion.p>
      <Node x={170} y={CY} index={0} label={trigger} sublabel={triggerText} square>
        <IconPlayerPlayFilled className="size-1/3 text-green-500" />
      </Node>
      <Node x={830} y={CY} index={1} label={action} sublabel={actionText} square>
        <IconArrowUp className="size-1/3 text-[#1E40FF] dark:text-blue-400" />
      </Node>
      <StatusDot x={170} y={205} className="bg-green-500" />
      <StatusDot x={598} y={212} className="bg-amber-400" />
      <StatusDot x={830} y={205} className="bg-[#1E40FF] dark:bg-blue-400" />
    </>
  );
};

const StatusDot = ({ x, y, className }: { x: number; y: number; className: string }) => (
  <motion.span
    variants={{ hidden: { opacity: 0, scale: 0 }, shown: { opacity: 1, scale: 1, transition: { delay: 0.5 } } }}
    className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
    style={pct(x, y)}
  >
    <span className={cn("block size-2.5 md:size-3.5 rounded-full animate-pulse", className)} />
  </motion.span>
);
