"use client";
import {
  IconAffiliate,
  IconBrain,
  IconClockPlay,
  IconCloud,
  IconDatabase,
  IconDeviceDesktop,
  IconFileSearch,
  IconLock,
  IconPlugConnected,
  IconServer,
  IconSparkles,
  IconStack2,
  IconVectorTriangle,
} from "@tabler/icons-react";
import { NodeGraph, type GraphBeam, type GraphEdge, type GraphNode, type GraphSpec } from "./node-graph";

// Hero of the CRM page: the architecture of a CRM with AI, drawn as a diagram. Labelled
// boxes inside "Your cloud", the client above, third-party services on the right. Each box
// shows a few logos; its popover lists the technologies it can be built with (we are
// stack-agnostic; names without a Simple Icons logo are listed as text). Beams follow one
// request through the server, the AI agent's retrieval (RAG) and the LLM, while background
// jobs sync the integrations (one timeout and retry). Copy under
// servicePages.crm-development.system.

const nodes: GraphNode[] = [
  {
    id: "cloud",
    kind: "zone",
    icon: IconCloud,
    stack: ["amazonwebservices", "googlecloud", "Azure", "cloudflare", "hetzner", "ovh", "digitalocean", "docker", "kubernetes"],
  },
  { id: "client", kind: "box", icon: IconDeviceDesktop, stack: ["react", "vuedotjs", "angular", "nextdotjs", "svelte", "flutter", "typescript"] },
  { id: "api", kind: "box", icon: IconServer, stack: ["nodedotjs", "python", "dotnet", "go", "django", "php", "laravel"] },
  { id: "auth", kind: "box", icon: IconLock, stack: ["keycloak", "auth0", "supabase"] },
  { id: "jobs", kind: "box", icon: IconClockPlay, stack: ["redis", "rabbitmq", "apachekafka", "celery"] },
  { id: "sql", kind: "box", icon: IconDatabase, stack: ["postgresql", "mysql", "mongodb", "supabase"] },
  { id: "agent", kind: "box", icon: IconSparkles, stack: ["langchain", "n8n", "LangGraph", "CrewAI", "OpenAI Agents SDK"] },
  { id: "rag", kind: "box", icon: IconFileSearch, stack: ["langchain", "LlamaIndex", "Haystack"] },
  { id: "vector", kind: "box", icon: IconVectorTriangle, stack: ["milvus", "elasticsearch", "opensearch", "pgvector", "Qdrant", "Pinecone", "Weaviate"] },
  { id: "graph", kind: "box", icon: IconAffiliate, stack: ["neo4j", "arangodb", "Memgraph"] },
  { id: "llm", kind: "box", icon: IconBrain, stack: ["openai", "claude", "googlegemini", "meta", "ollama", "huggingface", "Mistral"] },
  { id: "integrations", kind: "box", icon: IconPlugConnected, stack: ["gmail", "odoo", "hubspot", "slack", "whatsapp", "stripe"] },
];

const edges: GraphEdge[] = [
  { a: "client", b: "api" },
  { a: "auth", b: "api" },
  { a: "jobs", b: "api" },
  { a: "integrations", b: "jobs" },
  { a: "sql", b: "api", bx: -20 },
  { a: "agent", b: "api", bx: 20 },
  { a: "llm", b: "agent" },
  { a: "rag", b: "agent" },
  { a: "vector", b: "rag" },
  { a: "graph", b: "rag" },
];

// Three columns inside the cloud, third-party services in a fourth outside it.
const layouts: GraphSpec["layouts"] = {
  wide: {
    width: 560,
    height: 500,
    box: [112, 50],
    popover: "below",
    zones: { cloud: { x: 10, y: 112, w: 386, h: 368 } },
    at: {
      client: [200, 44],
      auth: [70, 156],
      api: [200, 156],
      jobs: [330, 156],
      integrations: [470, 156],
      sql: [70, 256],
      agent: [330, 256],
      llm: [470, 256],
      vector: [70, 356],
      rag: [200, 356],
      graph: [200, 446],
    },
  },
  tall: {
    width: 330,
    height: 570,
    box: [98, 50],
    popover: "below",
    zones: { cloud: { x: 4, y: 104, w: 322, h: 366 } },
    at: {
      client: [165, 40],
      integrations: [275, 40],
      auth: [55, 146],
      api: [165, 146],
      jobs: [275, 146],
      sql: [55, 246],
      agent: [275, 246],
      vector: [55, 346],
      rag: [165, 346],
      graph: [165, 436],
      llm: [275, 528],
    },
  },
};

const BUILD = 2600;
const CYCLE = 8400;
const beams: GraphBeam[] = [
  // A request: sign-in check, data, then the AI agent with retrieval and the LLM.
  { edge: 0, from: "client", kind: "call", at: 0 },
  { edge: 1, from: "api", kind: "call", at: 600 },
  { edge: 1, from: "auth", kind: "answer", at: 1100 },
  { edge: 4, from: "api", kind: "call", at: 1600 },
  { edge: 4, from: "sql", kind: "answer", at: 2200 },
  { edge: 5, from: "api", kind: "call", at: 2800 },
  { edge: 7, from: "agent", kind: "call", at: 3400 },
  { edge: 8, from: "rag", kind: "call", at: 4000 },
  { edge: 9, from: "rag", kind: "call", at: 4000 },
  { edge: 8, from: "vector", kind: "answer", at: 4600 },
  { edge: 9, from: "graph", kind: "answer", at: 4600 },
  { edge: 7, from: "rag", kind: "answer", at: 5200 },
  { edge: 6, from: "agent", kind: "call", at: 5800 },
  { edge: 6, from: "llm", kind: "answer", at: 6400 },
  { edge: 5, from: "agent", kind: "answer", at: 7000 },
  { edge: 0, from: "api", kind: "answer", at: 7600 },
  // In the background: syncing the integrations, with one retry.
  { edge: 3, from: "jobs", kind: "needs", at: 800 },
  { edge: 3, from: "integrations", kind: "failed", at: 1500 },
  { edge: 3, from: "jobs", kind: "needs", at: 2100 },
  { edge: 3, from: "integrations", kind: "answer", at: 2800 },
  { edge: 2, from: "jobs", kind: "needs", at: 3500 },
];

const spec: GraphSpec = { nodes, edges, layouts, beams, build: BUILD, cycle: CYCLE };

export const ArchitectureDiagram = () => (
  <NodeGraph spec={spec} namespace="servicePages.crm-development.system" icon={IconStack2} compact />
);
