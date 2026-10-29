"use client";
import {
  IconChartBar,
  IconChecks,
  IconFileSearch,
  IconPencil,
  IconTopologyStar3,
  IconUser,
} from "@tabler/icons-react";
import { NodeGraph, type GraphBeam, type GraphEdge, type GraphNode, type GraphSpec } from "./node-graph";

// Hero of the agent development page: a team of agents checking month-end invoices, with
// one failure and retry and one approval request per cycle. Copy under
// servicePages.ai-agents.graph.

const nodes: GraphNode[] = [
  { id: "coordinator", kind: "lead", icon: IconTopologyStar3 },
  { id: "you", kind: "you", icon: IconUser },
  { id: "reader", kind: "agent", icon: IconFileSearch },
  { id: "checker", kind: "agent", icon: IconChecks },
  { id: "writer", kind: "agent", icon: IconPencil },
  { id: "analyst", kind: "agent", icon: IconChartBar },
  { id: "gmail", kind: "tool", icon: "gmail" },
  { id: "odoo", kind: "tool", icon: "odoo" },
  { id: "slack", kind: "tool", icon: "slack" },
  { id: "sheets", kind: "tool", icon: "googlesheets" },
];

const edges: GraphEdge[] = [
  { a: "you", b: "coordinator" },
  { a: "reader", b: "coordinator", bx: -20 },
  { a: "checker", b: "coordinator", bx: 20 },
  { a: "writer", b: "coordinator", bx: -20 },
  { a: "analyst", b: "coordinator", bx: 20 },
  { a: "reader", b: "gmail" },
  { a: "checker", b: "odoo" },
  { a: "writer", b: "slack" },
  { a: "analyst", b: "sheets" },
];

const layouts: GraphSpec["layouts"] = {
  wide: {
    width: 1000,
    height: 560,
    at: {
      you: [500, 80],
      gmail: [110, 210],
      reader: [320, 210],
      checker: [680, 210],
      odoo: [890, 210],
      coordinator: [500, 330],
      slack: [110, 450],
      writer: [320, 450],
      analyst: [680, 450],
      sheets: [890, 450],
    },
  },
  tall: {
    width: 360,
    height: 660,
    at: {
      gmail: [70, 70],
      you: [180, 70],
      odoo: [290, 70],
      reader: [70, 210],
      checker: [290, 210],
      coordinator: [180, 340],
      writer: [70, 470],
      analyst: [290, 470],
      slack: [70, 600],
      sheets: [290, 600],
    },
  },
};

const BUILD = 2200;
const CYCLE = 9800;
const beams: GraphBeam[] = [
  { edge: 0, from: "you", kind: "call", at: 0 },
  { edge: 1, from: "coordinator", kind: "call", at: 700 },
  { edge: 5, from: "reader", kind: "call", at: 1400 },
  { edge: 5, from: "gmail", kind: "answer", at: 2100 },
  { edge: 1, from: "reader", kind: "answer", at: 2800 },
  { edge: 2, from: "coordinator", kind: "call", at: 2800 },
  { edge: 6, from: "checker", kind: "call", at: 3500 },
  { edge: 6, from: "odoo", kind: "failed", at: 4200 },
  { edge: 6, from: "checker", kind: "call", at: 4800 },
  { edge: 6, from: "odoo", kind: "answer", at: 5500 },
  { edge: 2, from: "checker", kind: "answer", at: 6200 },
  { edge: 3, from: "coordinator", kind: "call", at: 6200 },
  { edge: 4, from: "coordinator", kind: "call", at: 6200 },
  { edge: 7, from: "writer", kind: "needs", at: 6900 },
  { edge: 8, from: "analyst", kind: "call", at: 6900 },
  { edge: 8, from: "sheets", kind: "answer", at: 7600 },
  { edge: 4, from: "analyst", kind: "answer", at: 8300 },
  { edge: 0, from: "coordinator", kind: "needs", at: 9000 },
];

const spec: GraphSpec = { nodes, edges, layouts, beams, build: BUILD, cycle: CYCLE };

export const AgentGraph = () => (
  <NodeGraph spec={spec} namespace="servicePages.ai-agents.graph" icon={IconTopologyStar3} />
);
