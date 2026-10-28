import { useEffect, useSyncExternalStore } from "react";

// Sections can ask the navbar to step aside (it shrinks to a thin pill) while they are on
// screen, for full-screen moments. Several sections may ask at once: the navbar is minimal
// while at least one of them does.
const sources = new Set<string>();
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useMinimalNavbar = () =>
  useSyncExternalStore(subscribe, () => sources.size > 0, () => false);

export const useRequestMinimalNavbar = (id: string, active: boolean) => {
  useEffect(() => {
    if (!active) return;
    sources.add(id);
    listeners.forEach((listener) => listener());
    return () => {
      sources.delete(id);
      listeners.forEach((listener) => listener());
    };
  }, [id, active]);
};
