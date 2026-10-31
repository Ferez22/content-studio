"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { IconArrowRight, IconX } from "@tabler/icons-react";
import { ToolLogo, toolLogos, type ToolSlug } from "@/icons/tool-logos";
import { cn } from "@/lib/utils";

// An interactive node graph: nodes pop in one by one, lines draw in after their ends, then
// light beams run along the lines on a loop while on screen. Click a node for a popover with
// its job, recent activity or possible technologies; everything not linked to it dims.
// Two layouts: wide from md, tall on phones. The graph itself (nodes, lines, layouts, beams)
// comes from a GraphSpec, the words from a messages namespace (title, label, stats, hint,
// close, stackLabel, legend.<beam kind>, nodes.<id>). Build and beams are CSS in globals.css
// ("Agent graph"); reduced motion shows the finished graph without beams.

type NodeId = string;
// you: dark tile; lead: big tile; agent: tile; tool: brand logo tile; box: a labelled
// diagram box with a few logos; zone: a dashed boundary (its rectangle in layout.zones).
export type Kind = "you" | "lead" | "agent" | "tool" | "box" | "zone";
export type BeamKind = "call" | "answer" | "needs" | "failed";
type Point = [number, number];
export type GraphNode = { id: NodeId; kind: Kind; icon: React.ComponentType<{ className?: string }> | ToolSlug; stack?: (ToolSlug | string)[] };
export type GraphEdge = { a: NodeId; b: NodeId; bx?: number };
export type GraphLayout = {
  width: number;
  height: number;
  at: Record<NodeId, Point>;
  // Size of `box` nodes in px, boundary rectangles of `zone` nodes, and where popovers
  // open: beside the node, or centred below or above it (narrow graphs).
  box?: [number, number];
  zones?: Record<NodeId, { x: number; y: number; w: number; h: number }>;
  popover?: "side" | "below";
};
export type GraphBeam = { edge: number; from: NodeId; kind: BeamKind; at: number };
export type GraphSpec = {
  nodes: GraphNode[];
  // Each line runs from `a` across to x (b.x + bx), then up or down into `b`.
  edges: GraphEdge[];
  layouts: { wide: GraphLayout; tall: GraphLayout };
  // One cycle, in ms from its start; `from` is the node the beam leaves. The first cycle
  // waits `build` ms for the graph to appear.
  beams: GraphBeam[];
  build: number;
  cycle: number;
};
type Copy = {
  name: string;
  role: string;
  badge: string;
  text: string;
  activity?: { node: NodeId; text: string; time?: string; failed?: boolean }[];
};





const beamColors: Record<BeamKind, string> = {
  call: "#1E40FF",
  answer: "#10b981",
  needs: "#f59e0b",
  failed: "#ef4444",
};

// Appearance order: the coordinator, you, the agents, then the tools; lines follow their ends.
const nodeDelay = (nodes: GraphNode[], id: NodeId) => nodes.findIndex((node) => node.id === id) * 140;
const edgeDelay = (nodes: GraphNode[], edge: GraphEdge) => Math.max(nodeDelay(nodes, edge.a), nodeDelay(nodes, edge.b)) + 250;

const route = (layout: GraphLayout, edge: GraphEdge): Point[] => {
  const [ax, ay] = layout.at[edge.a];
  const [bx, by] = layout.at[edge.b];
  const x = bx + (edge.bx ?? 0);
  return [
    [ax, ay],
    [x, ay],
    [x, by],
  ];
};

// A polyline with rounded corners.
const toPath = (input: Point[], radius = 14) => {
  const points = input.filter(
    (point, index) => index === 0 || point[0] !== input[index - 1][0] || point[1] !== input[index - 1][1]
  );
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let index = 1; index < points.length - 1; index++) {
    const [px, py] = points[index - 1];
    const [cx, cy] = points[index];
    const [nx, ny] = points[index + 1];
    const r = Math.min(radius, Math.hypot(cx - px, cy - py) / 2, Math.hypot(nx - cx, ny - cy) / 2);
    const inX = cx - Math.sign(cx - px) * r;
    const inY = cy - Math.sign(cy - py) * r;
    const outX = cx + Math.sign(nx - cx) * r;
    const outY = cy + Math.sign(ny - cy) * r;
    d += ` L ${inX} ${inY} Q ${cx} ${cy} ${outX} ${outY}`;
  }
  const last = points[points.length - 1];
  return `${d} L ${last[0]} ${last[1]}`;
};

const tileSize: Record<Kind, number> = { you: 48, lead: 72, agent: 60, tool: 48, box: 44, zone: 20 };
const tileSizeTall: Record<Kind, number> = { you: 44, lead: 60, agent: 52, tool: 42, box: 44, zone: 20 };

const NodeIcon = ({ node, className }: { node: GraphNode; className?: string }) =>
  typeof node.icon === "string" ? (
    <ToolLogo tool={node.icon} className={className} />
  ) : (
    <node.icon className={className} />
  );

export const NodeGraph = ({
  spec,
  namespace,
  icon: TitleIcon,
  compact,
}: {
  spec: GraphSpec;
  namespace: string;
  icon: React.ComponentType<{ className?: string }>;
  // Smaller frame and text, for a graph that sits beside a hero.
  compact?: boolean;
}) => {
  const t = useTranslations(namespace);
  const copy = t.raw("nodes") as Record<NodeId, Copy>;
  const legend = t.raw("legend") as Partial<Record<BeamKind, string>>;
  return (
    <div className={cn("rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800", compact ? "p-2 md:p-3" : "p-3 md:p-6")}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-2 pb-3 md:pb-5">
        <p className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100">
          <TitleIcon className="size-5 text-[#1E40FF] dark:text-blue-400" />
          {t("title")}
        </p>
        <p className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
          {t.has("stats") && t("stats")}
          <span className="rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1 text-xs font-medium">
            {t("label")}
          </span>
        </p>
      </div>
      <div
        className={cn(
          "rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900",
          compact ? "px-2 pt-5 pb-3 md:px-3" : "px-2 pt-4 pb-5 md:px-6 md:pt-6"
        )}
      >
        <Graph spec={spec} namespace={namespace} layout="wide" copy={copy} className="hidden md:block" />
        <Graph spec={spec} namespace={namespace} layout="tall" copy={copy} className="md:hidden" />
        <p className={cn("text-center text-neutral-500 dark:text-neutral-400", compact ? "mt-3 text-xs" : "mt-4 text-sm")}>{t("hint")}</p>
        <ul className={cn("flex flex-wrap justify-center gap-y-2 text-neutral-500 dark:text-neutral-400", compact ? "mt-2 gap-x-4 text-xs" : "mt-3 gap-x-6 text-sm")}>
          {(Object.keys(legend) as BeamKind[]).map((kind) => (
            <li key={kind} className="flex items-center gap-2">
              <span className="h-0.5 w-5 rounded-full" style={{ background: beamColors[kind] }} />
              {legend[kind]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Graph = ({
  spec,
  namespace,
  layout: name,
  copy,
  className,
}: {
  spec: GraphSpec;
  namespace: string;
  layout: "wide" | "tall";
  copy: Record<NodeId, Copy>;
  className?: string;
}) => {
  const t = useTranslations(namespace);
  const { nodes, edges, beams, build: BUILD, cycle: CYCLE } = spec;
  const layout = spec.layouts[name];
  const sizes = name === "wide" ? tileSize : tileSizeTall;
  const box = layout.box ?? [112, 50];
  // Boxes keep the proportions of the layout when the graph is narrower than designed
  // (e.g. beside a hero on small laptops), and never grow past their size in px.
  const fit = (px: number) => `min(${px}px, ${(px / layout.width) * 100}cqw)`;
  const boxStyle = { width: fit(box[0]), height: fit(box[1]), gap: fit(6) };
  const ref = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const id = useId();
  const [played, setPlayed] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [open, setOpen] = useState<NodeId | null>(null);

  useEffect(() => {
    if (inView) setPlayed(true);
  }, [inView]);

  // Restart the beams every cycle while on screen.
  useEffect(() => {
    if (!played || !inView || reduced) return;
    const timer = window.setTimeout(() => setCycle((value) => value + 1), (cycle === 0 ? BUILD : 0) + CYCLE);
    return () => window.clearTimeout(timer);
  }, [played, inView, reduced, cycle]);

  // Close on Escape or a click outside the popover.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      ref.current?.querySelector<HTMLButtonElement>(`[data-node="${open}"]`)?.focus();
      setOpen(null);
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Element;
      if (popoverRef.current?.contains(target) || target.closest?.("[data-node]")) return;
      setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const touches = (index: number) => !open || edges[index].a === open || edges[index].b === open;
  const near = (node: NodeId) =>
    !open || node === open || edges.some((edge) => (edge.a === open && edge.b === node) || (edge.b === open && edge.a === node));
  const pct = (node: NodeId) => {
    const [x, y] = layout.at[node];
    return { x: (x / layout.width) * 100, y: (y / layout.height) * 100 };
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-label={t("title")}
      data-play={played || undefined}
      className={cn("agent-graph @container relative w-full", className)}
      style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
    >
      {nodes.map((node) => {
        const zone = node.kind === "zone" ? layout.zones?.[node.id] : undefined;
        if (!zone) return null;
        const isOpen = open === node.id;
        return (
          <div
            key={node.id}
            className="graph-node absolute"
            style={
              {
                left: `${(zone.x / layout.width) * 100}%`,
                top: `${(zone.y / layout.height) * 100}%`,
                width: `${(zone.w / layout.width) * 100}%`,
                height: `${(zone.h / layout.height) * 100}%`,
                "--delay": `${nodeDelay(nodes, node.id)}ms`,
              } as React.CSSProperties
            }
          >
            <div
              className={cn(
                "size-full rounded-2xl border border-dashed border-neutral-300 transition-opacity duration-300 dark:border-neutral-600",
                !near(node.id) && "opacity-30"
              )}
            >
              <button
                type="button"
                data-node={node.id}
                aria-label={`${copy[node.id].name}, ${copy[node.id].role}`}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls={isOpen ? `${id}-popover` : undefined}
                onClick={() => setOpen(isOpen ? null : node.id)}
                className={cn(
                  "absolute -top-3 left-3 flex cursor-pointer items-center gap-1 rounded-full border bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-600 transition-colors hover:border-neutral-400 dark:bg-neutral-900 dark:text-neutral-300",
                  isOpen ? "border-neutral-400" : "border-neutral-200 dark:border-neutral-700"
                )}
              >
                <NodeIcon node={node} className="size-3.5 text-[#1E40FF] dark:text-blue-400" />
                {copy[node.id].name}
              </button>
            </div>
          </div>
        );
      })}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
        fill="none"
      >
        {edges.map((edge, index) => (
          <path
            key={index}
            d={toPath(route(layout, edge))}
            pathLength={1}
            className="graph-edge stroke-neutral-200 dark:stroke-neutral-700 transition-opacity duration-300"
            strokeWidth={1.5}
            style={{ "--delay": `${edgeDelay(nodes, edge)}ms`, opacity: touches(index) ? 1 : 0.3 } as React.CSSProperties}
          />
        ))}
        {played && !reduced && (
          <g key={cycle}>
            {beams.map((beam, index) => {
              const edge = edges[beam.edge];
              return (
                <path
                  key={index}
                  d={toPath(route(layout, edge))}
                  pathLength={1}
                  className={cn("graph-beam", beam.from !== edge.a && "graph-beam-back")}
                  stroke={beamColors[beam.kind]}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  style={{
                    animationDelay: `${beam.at + (cycle === 0 ? BUILD : 0)}ms`,
                    filter: `drop-shadow(0 0 3px ${beamColors[beam.kind]})`,
                    opacity: touches(beam.edge) ? 1 : 0.3,
                  }}
                />
              );
            })}
          </g>
        )}
      </svg>

      {nodes.map((node) => {
        if (node.kind === "zone") return null;
        const { x, y } = pct(node.id);
        const size = sizes[node.kind];
        const isOpen = open === node.id;
        const label = copy[node.id];
        return (
          <div
            key={node.id}
            className="graph-node absolute size-0"
            style={{ left: `${x}%`, top: `${y}%`, "--delay": `${nodeDelay(nodes, node.id)}ms` } as React.CSSProperties}
          >
            <div className={cn("transition-opacity duration-300", !near(node.id) && "opacity-30")}>
            {(node.kind === "lead" || node.kind === "agent") && (
              <span
                aria-hidden="true"
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[1.25rem] bg-blue-50/70 dark:bg-blue-400/5"
                style={{ width: size + 16, height: size + 16 }}
              />
            )}
            <button
              type="button"
              data-node={node.id}
              aria-label={`${label.name}, ${label.role}`}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-controls={isOpen ? `${id}-popover` : undefined}
              onClick={() => setOpen(isOpen ? null : node.id)}
              className={cn(
                "absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-2xl border transition duration-200 hover:-translate-y-[calc(50%+2px)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40FF]",
                node.kind === "you"
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                  : "border-neutral-200 bg-white text-[#1E40FF] hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:border-neutral-500",
                // Brand logos keep a white tile in dark mode (Slack and Odoo are dark purple).
                node.kind === "tool" && "dark:bg-white dark:hover:border-neutral-300",
                node.kind === "box" && "flex-col rounded-xl",
                isOpen && "border-neutral-400 dark:border-neutral-400"
              )}
              style={node.kind === "box" ? boxStyle : { width: size, height: size }}
            >
              {node.kind === "box" ? (
                <>
                  <span
                    className="flex items-center gap-1 font-semibold leading-none whitespace-nowrap text-neutral-800 dark:text-neutral-100"
                    style={{ fontSize: fit(11) }}
                  >
                    <NodeIcon node={node} className="size-3.5 text-[#1E40FF] dark:text-blue-400" />
                    {label.name}
                  </span>
                  <span className="flex items-center gap-1">
                    {node.stack
                      ?.filter((tool): tool is ToolSlug => tool in toolLogos)
                      .slice(0, 4)
                      .map((tool) => (
                        // A white chip behind each logo keeps dark logos visible in dark mode.
                        <span key={tool} className="rounded-[3px] dark:bg-white dark:p-px" style={{ width: fit(16), height: fit(16) }}>
                          <ToolLogo tool={tool} className="size-full" />
                        </span>
                      ))}
                  </span>
                </>
              ) : (
                <NodeIcon node={node} className={node.kind === "lead" ? "size-8" : "size-6"} />
              )}
            </button>
            {node.kind !== "box" && (
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-1.5 text-center leading-tight dark:bg-neutral-900",
                  node.kind === "you" ? "-translate-y-full" : ""
                )}
                style={node.kind === "you" ? { top: -size / 2 - 6 } : { top: size / 2 + 6 }}
              >
                <span className="block text-xs md:text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {label.name}
                </span>
                {(node.kind === "agent" || node.kind === "lead") && (
                  <span className="block text-[11px] md:text-xs text-neutral-500 dark:text-neutral-400">{label.role}</span>
                )}
              </span>
            )}
            </div>
          </div>
        );
      })}

      {open && (
        <Popover
          ref={popoverRef}
          id={`${id}-popover`}
          node={nodes.find((node) => node.id === open)!}
          copy={copy}
          close={t("close")}
          failed={t("failedLabel")}
          stackLabel={t.has("stackLabel") ? t("stackLabel") : undefined}
          nodes={nodes}
          onClose={() => setOpen(null)}
          style={popoverPosition(nodes, name, layout, open, sizes)}
        />
      )}
    </div>
  );
};

// Next to the node on wide screens (on the side with more room), under or over it on phones.
const popoverPosition = (
  nodes: GraphNode[],
  name: "wide" | "tall",
  layout: GraphLayout,
  node: NodeId,
  sizes: Record<Kind, number>
): React.CSSProperties => {
  const kind = nodes.find((item) => item.id === node)!.kind;
  const zone = kind === "zone" ? layout.zones?.[node] : undefined;
  // Zones open from their label at the top left corner.
  const [x, y] = zone ? [zone.x + 60, zone.y] : layout.at[node];
  const half = kind === "box" ? (layout.box?.[1] ?? 50) / 2 : sizes[kind] / 2;
  // Room for the name under a tile; boxes and zones carry their name inside.
  const label = kind === "box" || kind === "zone" ? 10 : 48;
  const top = y / layout.height < 0.55;
  const yPct = (y / layout.height) * 100;
  if (name === "tall" || layout.popover === "below") {
    return top
      ? { left: 0, right: 0, top: `calc(${yPct}% + ${half + label}px)` }
      : { left: 0, right: 0, bottom: `calc(${100 - yPct}% + ${half + 12}px)` };
  }
  const xPct = (x / layout.width) * 100;
  const vertical = top ? { top: `calc(${yPct}% - 28px)` } : { bottom: `calc(${100 - yPct}% - 28px)` };
  return x <= layout.width / 2
    ? { ...vertical, left: `calc(${xPct}% + ${half + 16}px)` }
    : { ...vertical, right: `calc(${100 - xPct}% + ${half + 16}px)` };
};

const Popover = ({
  ref,
  id,
  node,
  copy,
  close,
  failed,
  stackLabel,
  nodes,
  onClose,
  style,
}: {
  ref: React.Ref<HTMLDivElement>;
  id: string;
  node: GraphNode;
  copy: Record<NodeId, Copy>;
  close: string;
  failed: string;
  stackLabel?: string;
  nodes: GraphNode[];
  onClose: () => void;
  style: React.CSSProperties;
}) => {
  const item = copy[node.id];
  const badge =
    node.kind === "tool"
      ? "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
      : item.badge === copy.you?.badge
        ? "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
        : "bg-blue-50 text-[#1E40FF] dark:bg-blue-400/10 dark:text-blue-400";
  return (
    <div
      ref={ref}
      id={id}
      role="dialog"
      aria-label={item.name}
      className="graph-popover absolute z-20 mx-auto w-auto max-w-sm rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 text-left md:w-80"
      style={style}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 text-[#1E40FF] dark:text-blue-400",
            node.kind === "tool" && "dark:bg-white"
          )}
        >
          <NodeIcon node={node} className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.role}</p>
        </div>
        <span className={cn("shrink-0 rounded-md px-2 py-0.5 text-xs font-medium", badge)}>{item.badge}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label={close}
          className="-mr-1 -mt-1 shrink-0 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        >
          <IconX className="size-4" />
        </button>
      </div>
      <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">{item.text}</p>
      {node.stack && (
        <div className="mt-3 border-t border-neutral-100 pt-3 dark:border-neutral-800">
          {stackLabel && <p className="text-xs text-neutral-500 dark:text-neutral-400">{stackLabel}</p>}
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {node.stack.map((tool) => {
              // Tools without a logo in Simple Icons are listed by name.
              const logo = tool in toolLogos ? (tool as ToolSlug) : null;
              return (
                <li
                  key={tool}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border border-neutral-200 py-1 pr-2 text-xs text-neutral-700 dark:border-neutral-700 dark:text-neutral-300",
                    logo ? "pl-1.5" : "pl-2"
                  )}
                >
                  {logo && (
                    <span className="rounded-sm dark:bg-white dark:p-0.5">
                      <ToolLogo tool={logo} className="size-3.5" />
                    </span>
                  )}
                  {logo ? toolLogos[logo].title : tool}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {item.activity && (
        <ul className="mt-3 divide-y divide-neutral-100 border-t border-neutral-100 dark:divide-neutral-800 dark:border-neutral-800">
          {item.activity.map((entry, index) => {
            const target = nodes.find((n) => n.id === entry.node)!;
            return (
              <li key={index} className="flex items-center gap-2 py-2 text-sm">
                <IconArrowRight className="size-3.5 shrink-0 text-neutral-400" />
                <span className={cn("shrink-0 rounded-sm", target.kind === "tool" && "dark:bg-white dark:p-0.5")}>
                  <NodeIcon node={target} className="size-4 text-[#1E40FF] dark:text-blue-400" />
                </span>
                <span className="min-w-0 flex-1 truncate text-neutral-600 dark:text-neutral-400">
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{copy[entry.node].name}</span>
                  {" · "}
                  {entry.text}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-xs tabular-nums",
                    entry.failed ? "font-medium text-red-500" : "text-neutral-400"
                  )}
                >
                  {entry.failed ? failed : entry.time}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
