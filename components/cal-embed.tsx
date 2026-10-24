"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const INITIAL_HEIGHT = 600;

// Cal.com booking page in an iframe that takes the height of its content. Cal's embed
// reports its size once the parent answers its "ready" message, the way embed.js does.
export const CalEmbed = ({ title, className }: { title: string; className?: string }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(INITIAL_HEIGHT);
  // Cal's own colours follow the site theme. Browsers paint an opaque backdrop behind an
  // iframe whose colour scheme differs from its document's, hence the fixed "light" below.
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const frame = frameRef.current;
      const data = event.data as { originator?: string; type?: string; data?: { iframeHeight?: number } };
      if (!frame || event.source !== frame.contentWindow || data?.originator !== "CAL") return;
      if (data.type === "__iframeReady") {
        frame.contentWindow?.postMessage({ originator: "CAL", method: "parentKnowsIframeReady", arg: {} }, "*");
        // Same instruction Cal's embed.js sends for a transparent page background.
        frame.contentWindow?.postMessage(
          { originator: "CAL", method: "ui", arg: { styles: { body: { background: "transparent" } } } },
          "*"
        );
      }
      if (data.type === "__dimensionChanged" && data.data?.iframeHeight) {
        setHeight(Math.ceil(data.data.iframeHeight));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // The theme is only known in the browser, so the iframe renders after mount.
  if (!mounted || !resolvedTheme) return <div style={{ height }} className={className} />;

  return (
    <iframe
      ref={frameRef}
      key={theme}
      title={title}
      src={`${site.bookingUrl}&theme=${theme}`}
      loading="lazy"
      // Cal's page always declares a light colour scheme, so the frame must too (even in dark mode).
      style={{ height, colorScheme: "light", background: "transparent" }}
      className={cn("block w-full transition-[height] duration-300 ease-out", className)}
    />
  );
};
