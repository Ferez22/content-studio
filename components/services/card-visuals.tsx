"use client";
import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  IconArrowUp,
  IconChevronDown,
  IconCloud,
  IconDeviceLaptop,
  IconHandStop,
  IconMicrophone,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { ToolLogo, type ToolSlug } from "@/icons/tool-logos";
import { LogoIcon } from "@/components/logo";
import { TeamInvite } from "@/components/team-invite";
import { AgentTeam } from "@/components/agent-team";
import { LayerStack, type LayerStackItem } from "@/components/layer-stack";
import { LeadSourcing } from "@/components/lead-sourcing";
import { IntegrationBeam } from "@/components/integration-beam";
import { cn } from "@/lib/utils";

// Small animated UIs for the service cards in the home category panel. Each one is drawn
// on a fixed 480 x 270 canvas and scaled to the card, animates only while on screen, and
// shows its final state for people who prefer reduced motion.

const W = 480;
const H = 270;

export type CardVisualKind =
  | "chat"
  | "team"
  | "agents"
  | "layers"
  | "sourcing"
  | "integration"
  | "voice"
  | "bars"
  | "cluster"
  | "shop"
  | "seo"
  | "crm"
  | "erp"
  | "mobile"
  | "cloud"
  | "scan";

type Ctx = { active: boolean; still: boolean };

// Scales the 480 x 270 drawing to fit its box (centred, so it also works in a square) and
// reports whether it should animate.
const Canvas = ({
  className,
  children,
}: {
  className?: string;
  children: (ctx: Ctx) => React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 0, x: 0, y: 0 });
  const inView = useInView(ref, { amount: 0.3 });
  const still = Boolean(useReducedMotion());
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const scale = Math.min(element.clientWidth / W, element.clientHeight / H);
      setFit({ scale, x: (element.clientWidth - W * scale) / 2, y: (element.clientHeight - H * scale) / 2 });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div
        className={cn("absolute left-0 top-0 origin-top-left", className)}
        style={{
          width: W,
          height: H,
          transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.scale})`,
          opacity: fit.scale ? 1 : 0,
        }}
      >
        {children({ active: inView && !still, still })}
      </div>
    </div>
  );
};

// Steps through 0..count-1 every `ms` while active, then holds `hold` ms and starts again.
// Without motion it sits on the last step.
const useStep = (count: number, ms: number, { active, still }: Ctx, hold = 2200) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (still || !active) return;
    const timer = window.setTimeout(
      () => setStep((value) => (value + 1) % count),
      step === count - 1 ? hold : ms
    );
    return () => window.clearTimeout(timer);
  }, [step, count, ms, hold, active, still]);
  return still ? count - 1 : step;
};

// Types `text` letter by letter while active.
const useTyping = (texts: string[], ctx: Ctx) => {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const text = texts[index % texts.length];
  useEffect(() => {
    if (ctx.still || !ctx.active) return;
    const done = length >= text.length;
    const timer = window.setTimeout(
      () => {
        if (done) {
          setIndex((value) => value + 1);
          setLength(0);
        } else setLength((value) => value + 1);
      },
      done ? 1800 : 45
    );
    return () => window.clearTimeout(timer);
  }, [length, text, ctx.active, ctx.still]);
  return ctx.still ? texts[0] : text.slice(0, length);
};

const dots =
  "bg-neutral-50 dark:bg-neutral-800 bg-[radial-gradient(var(--color-neutral-200)_1px,transparent_1px)] dark:bg-[radial-gradient(var(--color-neutral-700)_1px,transparent_1px)] [background-size:14px_14px]";

const Chip = ({ tool, size = 30, className }: { tool: ToolSlug; size?: number; className?: string }) => (
  <span
    className={cn("rounded-full bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center", className)}
    style={{ width: size, height: size }}
  >
    <ToolLogo tool={tool} className="size-[55%]" />
  </span>
);

const Cursor = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" className={cn("absolute size-5 drop-shadow transition-all duration-700 ease-in-out", className)} style={style}>
    <path d="M4 2l15 10-6.5 1.4L9.6 20z" fill="#111" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const CardVisual = ({ kind }: { kind: CardVisualKind }) => {
  const Visual = visuals[kind];
  return <Visual />;
};

// --- AI ---------------------------------------------------------------------------------

const ChatVisual = () => {
  const t = useTranslations("visuals.cards.chat");
  return (
    <Canvas className={cn(dots, "flex items-center justify-center")}>
      {(ctx) => <ChatComposer ctx={ctx} prompts={t.raw("prompts") as string[]} t={t} />}
    </Canvas>
  );
};

const ChatComposer = ({
  ctx,
  prompts,
  t,
}: {
  ctx: Ctx;
  prompts: string[];
  t: ReturnType<typeof useTranslations>;
}) => {
  const typed = useTyping(prompts, ctx);
  const models: ToolSlug[] = ["openai", "claude", "googlegemini", "meta", "perplexity"];
  return (
    <div className="w-[420px] rounded-2xl bg-[#1f1f21] text-neutral-300 ring-1 ring-white/10 shadow-xl">
      <div className="px-5 pt-5 h-[58px] text-[15px]">
        <span className="text-neutral-200">{typed}</span>
        <span className="inline-block w-[2px] h-[16px] -mb-[3px] ml-0.5 bg-blue-400 animate-pulse" />
      </div>
      <div className="flex items-center gap-2 px-4 pb-4">
        <IconPlus className="size-5 text-neutral-400" />
        <span className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[13px]">
          <IconHandStop className="size-4" />
          {t("approval")}
        </span>
        <span className="ml-auto flex items-center gap-1 text-[13px]">
          {t("auto")}
          <IconChevronDown className="size-3.5" />
        </span>
        <IconMicrophone className="size-4 text-neutral-400" />
        <span className={cn("size-8 rounded-lg flex items-center justify-center transition-colors", typed.length > 8 ? "bg-blue-500 text-white" : "bg-white/10")}>
          <IconArrowUp className="size-4" />
        </span>
      </div>
      <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-[13px]">
        <span className="flex -space-x-1">
          {models.map((model) => (
            <Chip key={model} tool={model} size={22} className="ring-[#1f1f21] ring-2" />
          ))}
        </span>
        {t("models")}
      </div>
    </div>
  );
};

// affectUI illustrations (components/team-invite, agent-team, layer-stack, lead-sourcing and
// integration-beam), drawn on the scaled canvas like the others.
// Free-license Unsplash portraits for the teammates.
const teammates = [
  "photo-1573497019940-1c28c88b4f3e",
  "photo-1611432579699-484f7990b127",
  "photo-1595211877493-41a4e5f236b3",
].map((id) => ({ src: `https://images.unsplash.com/${id}?w=160&h=160&fit=crop&crop=faces&q=70` })) as [
  { src: string },
  { src: string },
  { src: string },
];

const TeamVisual = () => (
  <Canvas className={cn(dots, "flex items-center justify-center")}>
    {() => (
      <div className="h-[262px] aspect-[3/2]">
        <TeamInvite avatars={teammates} />
      </div>
    )}
  </Canvas>
);

const AgentsVisual = () => {
  const t = useTranslations("visuals.cards.agents");
  const roles = t.raw("roles") as string[];
  const avatar = "/robot/robot-poster.webp";
  return (
    <Canvas className={cn(dots, "flex items-center justify-center")}>
      {() => (
        <div className="h-[262px] aspect-[3/2]">
          <AgentTeam
            prompt={t("prompt")}
            members={[
              { role: roles[0], avatar, tools: ["linkedin"] },
              { role: roles[1], avatar, tools: ["hubspot", "salesforce"] },
              { role: roles[2], avatar, tools: ["gmail", "slack"] },
            ]}
          />
        </div>
      )}
    </Canvas>
  );
};

const LayersVisual = () => {
  const t = useTranslations("visuals.cards");
  return (
    <Canvas className={cn(dots, "flex items-center justify-center")}>
      {() => (
        <div className="h-[262px] aspect-[3/2]">
          <LayerStack items={t.raw("layers") as LayerStackItem[]} />
        </div>
      )}
    </Canvas>
  );
};

const SourcingVisual = () => (
  <Canvas className={cn(dots, "flex items-center justify-center")}>
    {() => (
      <div className="h-[262px] aspect-[3/2]">
        <LeadSourcing />
      </div>
    )}
  </Canvas>
);

// The beams are measured with offsetLeft/offsetWidth, which scaling does not affect; the canvas
// is wide enough (480px) to keep the tools side by side instead of stacked.
const IntegrationVisual = () => {
  const left = [
    { name: "Salesforce", logo: <ToolLogo tool="salesforce" className="size-full" /> },
    { name: "HubSpot", logo: <ToolLogo tool="hubspot" className="size-full" /> },
    { name: "Gmail", logo: <ToolLogo tool="gmail" className="size-full" /> },
  ];
  const right = [
    { name: "Odoo", logo: <ToolLogo tool="odoo" className="size-full" /> },
    { name: "Google Sheets", logo: <ToolLogo tool="googlesheets" className="size-full" /> },
    { name: "Slack", logo: <ToolLogo tool="slack" className="size-full" /> },
  ];
  return (
    <Canvas className={cn(dots, "flex items-center justify-center")}>
      {() => (
        <IntegrationBeam
          left={left}
          right={right}
          center={{ name: "Qartmina", logo: <LogoIcon className="size-full text-white" /> }}
          className="w-full"
        />
      )}
    </Canvas>
  );
};

const VoiceVisual = () => (
  <Canvas className={cn(dots, "flex items-center justify-center gap-[5px] px-12")}>
    {() => (
      <>
        {Array.from({ length: 34 }).map((_, index) => (
          <span
            key={index}
            className="card-wave w-[6px] rounded-full bg-[#1E40FF] dark:bg-blue-400"
            style={{
              height: `${30 + Math.round(Math.abs(Math.sin(index * 0.7)) * 55)}%`,
              animationDelay: `${(index % 8) * -0.12}s`,
            }}
          />
        ))}
      </>
    )}
  </Canvas>
);

// --- Data and automation ---------------------------------------------------------------

const BarsVisual = () => (
  <Canvas className={cn(dots, "flex items-end gap-3 px-12 pb-16 pt-8")}>
    {() => (
      <>
        {[45, 70, 55, 85, 65, 95, 75].map((height, index) => (
          <span
            key={index}
            className={cn(
              "card-bar flex-1 rounded-t-lg origin-bottom",
              index === 5 ? "bg-[#1E40FF] dark:bg-blue-400" : "bg-neutral-300 dark:bg-neutral-600"
            )}
            style={{ height: `${height}%`, animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </>
    )}
  </Canvas>
);

// --- Websites and e-commerce -----------------------------------------------------------

// The Qartmina mark with the platforms bouncing out around it, then slowly turning.
const ClusterVisual = () => {
  const bubbles: { tool: ToolSlug; x: number; y: number; size: number }[] = [
    { tool: "shopify", x: -78, y: -62, size: 62 },
    { tool: "stripe", x: 92, y: -40, size: 58 },
    { tool: "amboras", x: 70, y: 70, size: 54 },
    { tool: "woocommerce", x: -96, y: 52, size: 50 },
    { tool: "instagram", x: 4, y: -104, size: 38 },
  ];
  return (
    <Canvas className={dots}>
      {({ active, still }) => <Cluster bubbles={bubbles} shown={active || still} still={still} />}
    </Canvas>
  );
};

const Cluster = ({
  bubbles,
  shown,
  still,
}: {
  bubbles: { tool: ToolSlug; x: number; y: number; size: number }[];
  shown: boolean;
  still: boolean;
}) => {
  // Plays the entrance once, the first time it is seen.
  const [played, setPlayed] = useState(false);
  useEffect(() => {
    if (shown) setPlayed(true);
  }, [shown]);
  const on = played || still;
  return (
    <div className="absolute left-1/2 top-1/2">
      <div className={cn("absolute inset-0", on && !still && "cluster-spin")}>
        {bubbles.map((bubble, index) => (
          <span
            key={bubble.tool}
            className="absolute transition-[translate,scale,opacity] ease-[cubic-bezier(0.34,1.56,0.64,1)] duration-500"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: -bubble.size / 2,
              top: -bubble.size / 2,
              translate: on ? `${bubble.x}px ${bubble.y}px` : "0 0",
              scale: on ? "1" : "0.3",
              opacity: on ? 1 : 0,
              transitionDelay: `${0.2 + index * 0.06}s`,
            }}
          >
            <span className={cn("size-full rounded-full bg-white shadow-md ring-1 ring-black/5 flex items-center justify-center", on && !still && "cluster-spin-reverse")}>
              <ToolLogo tool={bubble.tool} className="size-1/2" />
            </span>
          </span>
        ))}
      </div>
      <span
        className="absolute -left-[56px] -top-[56px] size-[112px] rounded-full bg-white shadow-lg ring-1 ring-black/5 flex items-center justify-center text-black transition-[scale,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ scale: on ? "1" : "0.6", opacity: on ? 1 : 0 }}
      >
        <LogoIcon className="size-12" />
      </span>
    </div>
  );
};

// A store dashboard: sales ticking up, a chart drawing, new orders arriving.
const ShopVisual = () => {
  const t = useTranslations("visuals.cards.shop");
  return <Canvas className="bg-neutral-100">{(ctx) => <ShopDashboard ctx={ctx} t={t} />}</Canvas>;
};

const ShopDashboard = ({ ctx, t }: { ctx: Ctx; t: ReturnType<typeof useTranslations> }) => {
  const step = useStep(5, 1100, ctx, 1600);
  const nav = t.raw("nav") as string[];
  const sales = [1240, 1388, 1527, 1690, 1842][step];
  const orders = 31 + step;
  return (
    <div className="absolute inset-0 flex text-neutral-800">
      <div className="w-[118px] bg-[#1a1a1a] text-neutral-300 p-3 flex flex-col gap-1.5 text-[11.5px]">
        <span className="flex items-center gap-1.5 text-white font-semibold mb-2">
          <ToolLogo tool="shopify" className="size-4" />
          {t("store")}
        </span>
        {nav.map((item, index) => (
          <span key={item} className={cn("rounded-md px-2 py-1", index === 0 && "bg-white/10 text-white")}>
            {item}
          </span>
        ))}
      </div>
      <div className="flex-1 p-3.5 flex flex-col gap-2.5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: t("sales"), value: `€${sales.toLocaleString("en-US")}` },
            { label: t("orders"), value: String(orders) },
            { label: t("visitors"), value: String(812 + step * 23) },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white p-2 ring-1 ring-black/5">
              <p className="text-[10px] text-neutral-500">{stat.label}</p>
              <p className="text-[15px] font-bold tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="relative flex-1 rounded-lg bg-white ring-1 ring-black/5 overflow-hidden">
          <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[85%] w-full">
            <path d="M0 80 C 30 70, 50 75, 80 60 S 130 40, 160 48 S 220 20, 250 26 S 285 12, 300 8" fill="none" stroke="#008060" strokeWidth="2.5" className="shop-line" pathLength={1} />
          </svg>
          <span
            className={cn(
              "absolute right-2 top-2 flex items-center gap-1.5 rounded-full bg-[#008060] px-2.5 py-1 text-[10.5px] font-semibold text-white shadow transition-all duration-500",
              step % 2 === 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            )}
          >
            {t("newOrder", { number: 1040 + step })}
          </span>
        </div>
      </div>
    </div>
  );
};

// Organic search: the query types itself and your site climbs to the top result.
const SeoVisual = () => {
  const t = useTranslations("visuals.cards.seo");
  return <Canvas className={dots}>{(ctx) => <SearchResults ctx={ctx} t={t} />}</Canvas>;
};

const SearchResults = ({ ctx, t }: { ctx: Ctx; t: ReturnType<typeof useTranslations> }) => {
  const query = useTyping([t("query")], ctx);
  const rank = useStep(4, 900, ctx, 2400); // 0: 4th place ... 3: 1st
  const others = t.raw("results") as string[];
  const tags = t.raw("tags") as string[];
  const position = 3 - rank;
  const rowH = 34;
  return (
    <>
      <div className="absolute left-6 top-5 w-[262px] flex items-center gap-2 rounded-full bg-white px-3.5 py-2 shadow-sm ring-1 ring-black/10 text-[13px] text-neutral-800">
        <ToolLogo tool="google" className="size-4" />
        <span className="flex-1 truncate">{query}</span>
        <IconSearch className="size-4 text-neutral-400" />
      </div>
      <div className="absolute left-6 top-[68px] w-[262px]" style={{ height: rowH * 4 }}>
        {others.map((site, index) => {
          const slot = index < position ? index : index + 1;
          return (
            <div key={site} className="absolute inset-x-0 flex items-center gap-2 rounded-lg px-3 text-[12px] text-neutral-500 transition-[top] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ top: slot * rowH, height: rowH - 4 }}>
              <span className="size-4 rounded-full bg-neutral-200" />
              {site}
            </div>
          );
        })}
        <div
          className="absolute inset-x-0 flex items-center gap-2 rounded-lg bg-white px-3 shadow-sm ring-2 ring-[#1E40FF]/50 transition-[top] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ top: position * rowH, height: rowH - 4 }}
        >
          <span className="size-4 rounded-full bg-[#1E40FF]" />
          <span className="text-[12px] font-semibold text-neutral-900 truncate">{t("title")}</span>
          <span className="ml-auto text-[10.5px] font-bold text-[#1E40FF]">#{position + 1}</span>
        </div>
      </div>
      <div className="absolute right-5 top-6 flex flex-col items-end gap-2.5">
        {tags.map((tag, index) => (
          <span
            key={tag}
            className={cn(
              "card-float flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold shadow-sm ring-1 ring-black/10",
              index === 2 ? "bg-[#1E40FF] text-white text-[20px] px-4 py-2 font-display" : "bg-white text-neutral-800"
            )}
            style={{ animationDelay: `${index * -1.3}s` }}
          >
            {index === 0 && <ToolLogo tool="googlesearchconsole" className="size-3.5" />}
            {tag}
          </span>
        ))}
      </div>
    </>
  );
};

// --- Software ---------------------------------------------------------------------------

// Stage badge colours, by row (the stage names come from the messages).
const stageColors = [
  "bg-orange-100 text-orange-700",
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-neutral-100 text-neutral-600",
];
const wonColor = "bg-green-100 text-green-700";

// A deals table: the cursor moves to a deal, clicks, and it moves to Won.
const CrmVisual = () => {
  const t = useTranslations("visuals.cards.crm");
  return <Canvas className="bg-white">{(ctx) => <CrmTable ctx={ctx} t={t} />}</Canvas>;
};

const CrmTable = ({ ctx, t }: { ctx: Ctx; t: ReturnType<typeof useTranslations> }) => {
  const rows = t.raw("rows") as { name: string; stage: string; value: string }[];
  const columns = t.raw("columns") as string[];
  // 0: rest, 1: cursor on the deal, 2: clicked (Won)
  const step = useStep(3, 1100, ctx, 2000);
  const target = 1;
  return (
    <div className="absolute inset-0 flex text-neutral-800 text-[12px]">
      <div className="w-[44px] border-r border-neutral-200 bg-neutral-50 flex flex-col items-center gap-3 pt-4">
        {["#111", "#d4d4d4", "#d4d4d4", "#d4d4d4"].map((color, index) => (
          <span key={index} className="size-5 rounded-md" style={{ background: color }} />
        ))}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 px-4 py-3 font-semibold text-[13px]">
          {t("title")}
          <span className="ml-auto flex gap-1">
            <ToolLogo tool="hubspot" className="size-4" />
          </span>
        </div>
        <div className="grid grid-cols-[1.4fr_1fr_0.8fr] border-y border-neutral-200 bg-neutral-50 px-4 py-2 text-[11px] text-neutral-500">
          {columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {rows.map((row, index) => {
          const won = index === target && step === 2;
          const stage = won ? t("won") : row.stage;
          const colour = won ? wonColor : stageColors[index % stageColors.length];
          return (
            <div key={row.name} className={cn("grid grid-cols-[1.4fr_1fr_0.8fr] items-center border-b border-neutral-100 px-4 py-[9px] transition-colors", index === target && step >= 1 && "bg-blue-50")}>
              <span className="flex items-center gap-2 font-medium">
                <span className="size-5 rounded-md bg-neutral-800 text-white text-[10px] font-bold flex items-center justify-center">{row.name[0]}</span>
                {row.name}
              </span>
              <span>
                <span className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-colors", colour)}>{stage}</span>
              </span>
              <span className="tabular-nums">{row.value}</span>
            </div>
          );
        })}
      </div>
      <Cursor style={{ left: step === 0 ? 400 : 250, top: step === 0 ? 230 : 128 }} className={cn(step === 2 && "scale-90")} />
    </div>
  );
};

// Inventory: a low-stock item gets reordered and its stock fills back up.
const ErpVisual = () => {
  const t = useTranslations("visuals.cards.erp");
  return <Canvas className="bg-white">{(ctx) => <ErpTable ctx={ctx} t={t} />}</Canvas>;
};

const ErpTable = ({ ctx, t }: { ctx: Ctx; t: ReturnType<typeof useTranslations> }) => {
  const rows = t.raw("rows") as { name: string; status: string }[];
  const columns = t.raw("columns") as string[];
  const step = useStep(3, 1100, ctx, 2200);
  const levels = [78, step === 2 ? 82 : 14, 64];
  return (
    <div className="absolute inset-0 flex text-neutral-800 text-[12px]">
      <div className="w-[44px] border-r border-neutral-200 bg-[#714B67] flex flex-col items-center gap-3 pt-4">
        <ToolLogo tool="odoo" className="size-5 brightness-0 invert" />
        {[0, 1, 2].map((index) => (
          <span key={index} className="size-5 rounded-md bg-white/25" />
        ))}
      </div>
      <div className="flex-1">
        <div className="px-4 py-3 font-semibold text-[13px]">{t("title")}</div>
        <div className="grid grid-cols-[1.3fr_1fr_1fr] border-y border-neutral-200 bg-neutral-50 px-4 py-2 text-[11px] text-neutral-500">
          {columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {rows.map((row, index) => {
          const low = index === 1 && step < 2;
          return (
            <div key={row.name} className="grid grid-cols-[1.3fr_1fr_1fr] items-center border-b border-neutral-100 px-4 py-[11px]">
              <span className="font-medium">{row.name}</span>
              <span className="pr-4">
                <span className="block h-1.5 rounded-full bg-neutral-100">
                  <span className={cn("block h-full rounded-full transition-[width] duration-1000", low ? "bg-red-500" : "bg-green-500")} style={{ width: `${levels[index]}%` }} />
                </span>
              </span>
              <span>
                {index === 1 ? (
                  <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors", step === 2 ? "bg-green-100 text-green-700" : step === 1 ? "bg-[#714B67] text-white" : "bg-red-100 text-red-700")}>
                    {step === 2 ? t("ordered") : step === 1 ? t("reorder") : row.status}
                  </span>
                ) : (
                  <span className="rounded-md bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">{row.status}</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
      <Cursor style={{ left: step === 0 ? 420 : 395, top: step === 0 ? 240 : 150 }} />
    </div>
  );
};

// Two phones with a live app screen scrolling.
const MobileVisual = () => {
  const t = useTranslations("visuals.cards.mobile");
  return (
    <Canvas className={dots}>
      {() => (
        <>
          <Phone t={t} className="left-[118px] top-[26px] -rotate-6 opacity-90" />
          <Phone t={t} className="left-[232px] top-[18px] rotate-3" accent />
        </>
      )}
    </Canvas>
  );
};

const Phone = ({
  t,
  className,
  accent,
}: {
  t: ReturnType<typeof useTranslations>;
  className?: string;
  accent?: boolean;
}) => {
  const tabs = t.raw("tabs") as string[];
  return (
    <div className={cn("absolute w-[118px] h-[236px] rounded-[26px] bg-black p-[5px] shadow-xl", className)}>
      <div className="relative size-full overflow-hidden rounded-[21px] bg-white">
        <span className="absolute left-1/2 top-1.5 z-10 h-3.5 w-12 -translate-x-1/2 rounded-full bg-black" />
        <div className="phone-scroll px-2.5 pt-7">
          <p className="text-[9px] text-neutral-500">{t("greeting")}</p>
          <div className={cn("mt-1.5 rounded-xl p-2.5 text-white", accent ? "bg-[#1E40FF]" : "bg-neutral-900")}>
            <p className="text-[9.5px] font-semibold leading-tight">{t("card")}</p>
            <span className="mt-2 block h-1 rounded-full bg-white/30">
              <span className="block h-full w-2/3 rounded-full bg-white" />
            </span>
          </div>
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="mt-2 flex items-center gap-2 rounded-lg bg-neutral-100 p-1.5">
              <span className="size-6 rounded-md bg-neutral-300" />
              <span className="flex-1">
                <span className="block h-1.5 w-4/5 rounded-full bg-neutral-300" />
                <span className="mt-1 block h-1.5 w-1/2 rounded-full bg-neutral-200" />
              </span>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-neutral-100 bg-white py-1.5 text-[7.5px] text-neutral-500">
          {tabs.map((tab, index) => (
            <span key={tab} className={cn(index === 0 && "font-semibold text-black")}>
              {tab}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Data leaving your servers for the cloud.
const CloudVisual = () => {
  const t = useTranslations("visuals.cards.cloud");
  return <Canvas className={dots}>{(ctx) => <CloudMove ctx={ctx} t={t} />}</Canvas>;
};

const CloudMove = ({ ctx, t }: { ctx: Ctx; t: ReturnType<typeof useTranslations> }) => {
  const step = useStep(6, 650, ctx, 2000);
  const percent = [8, 27, 46, 68, 89, 100][step];
  return (
    <>
      <div className="absolute left-7 top-[70px] flex flex-col items-center gap-2">
        <span className="size-[88px] rounded-2xl bg-white shadow-sm ring-1 ring-black/10 flex items-center justify-center">
          <IconDeviceLaptop className="size-12 text-neutral-700" stroke={1.4} />
        </span>
        <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300">{t("from")}</span>
      </div>
      <div className="absolute left-[132px] top-[112px] w-[150px] h-1 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
        {[0, 1, 2].map((index) => (
          <span key={index} className="packet absolute top-0 h-full w-6 rounded-full bg-[#1E40FF] dark:bg-blue-400" style={{ animationDelay: `${index * 0.45}s` }} />
        ))}
      </div>
      <div className="absolute right-6 top-6 w-[180px] flex flex-col items-center">
        <IconCloud className="size-[120px] text-[#1E40FF]/15 dark:text-blue-400/20" fill="currentColor" stroke={0} />
        <div className="-mt-[82px] flex items-center gap-2">
          <Chip tool="amazonwebservices" size={38} />
          <span className="size-[38px] rounded-full bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center text-[10px] font-bold text-[#0078D4]">{t("azure")}</span>
          <Chip tool="googlecloud" size={38} />
        </div>
      </div>
      <div className="absolute left-7 right-7 bottom-6">
        <div className="flex justify-between text-[11.5px] font-semibold text-neutral-700 dark:text-neutral-200">
          <span>{percent === 100 ? t("done") : t("migrating", { percent })}</span>
          <span className="tabular-nums">{percent}%</span>
        </div>
        <span className="mt-1.5 block h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
          <span className="block h-full rounded-full bg-[#1E40FF] dark:bg-blue-400 transition-[width] duration-500" style={{ width: `${percent}%` }} />
        </span>
      </div>
    </>
  );
};

const ScanVisual = () => (
  <Canvas className={cn(dots, "flex flex-col justify-center gap-4 px-14")}>
    {() => (
      <>
        <span className="visual-scan absolute inset-x-0 h-16 -translate-y-1/2 bg-[#1E40FF]/10 border-y border-[#1E40FF]/30 dark:bg-blue-400/10 dark:border-blue-400/30" />
        {[80, 60, 72, 50].map((width, index) => (
          <div key={index} className="relative flex items-center gap-4">
            <span className={cn("size-4 rounded-full", index === 2 ? "bg-yellow-500" : "bg-green-500")} />
            <span className="h-3 rounded-full bg-neutral-300 dark:bg-neutral-600" style={{ width: `${width}%` }} />
          </div>
        ))}
      </>
    )}
  </Canvas>
);

const visuals: Record<CardVisualKind, React.ComponentType> = {
  chat: ChatVisual,
  team: TeamVisual,
  agents: AgentsVisual,
  layers: LayersVisual,
  sourcing: SourcingVisual,
  integration: IntegrationVisual,
  voice: VoiceVisual,
  bars: BarsVisual,
  cluster: ClusterVisual,
  shop: ShopVisual,
  seo: SeoVisual,
  crm: CrmVisual,
  erp: ErpVisual,
  mobile: MobileVisual,
  cloud: CloudVisual,
  scan: ScanVisual,
};
