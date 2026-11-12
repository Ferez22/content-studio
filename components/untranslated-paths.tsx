"use client";
import { createContext, useContext } from "react";

/** Per locale, the locale-less paths of blog posts and case studies that have no version in that locale. */
const UntranslatedPaths = createContext<Record<string, string[]>>({});

export const UntranslatedPathsProvider = ({
  value,
  children,
}: {
  value: Record<string, string[]>;
  children: React.ReactNode;
}) => <UntranslatedPaths.Provider value={value}>{children}</UntranslatedPaths.Provider>;

export const useUntranslatedPaths = () => useContext(UntranslatedPaths);
