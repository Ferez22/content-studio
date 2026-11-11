"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// A soft, slowly drifting field of brand blues with film grain, drawn with WebGL at one canvas
// pixel per CSS pixel (sharp grain, cheap shader) and 24 frames per second. The grain only
// shows where there is colour, so the page around stays clean. Paused when off screen or in a hidden tab. Reduced motion: one still frame. No WebGL: a static CSS gradient. Purely decorative: aria-hidden, no pointer events.

type Rgb = [number, number, number];
const hex = (value: string): Rgb => {
  const n = parseInt(value.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

// Royal blue (brand accent), sky blue (its dark twin) and a lavender close to the AI pillar.
const palettes = {
  light: { colors: ["#1E40FF", "#54a2ff", "#a78bfa"].map(hex), alpha: 0.5 },
  dark: { colors: ["#2f4bff", "#2f7fff", "#7c5cf0"].map(hex), alpha: 0.42 },
};

const VERTEX = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

// Three gaussian colour fields wander on slow sine paths through a gently warped space.
// The layout parameter moves their resting place: hero (right-heavy) or section (spread).
const FRAGMENT = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;
uniform float u_alpha;
uniform float u_layout;

float field(vec2 p, vec2 c, float r) { vec2 d = p - c; return exp(-dot(d, d) / r); }
// Hash without sine (Dave Hoskins): no diagonal banding, unlike the classic sin() hash.
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = u_time;

  p += 0.07 * vec2(
    sin(t * 0.30 + p.y * 4.0) + 0.5 * sin(t * 0.70 + p.y * 7.0 + 1.3),
    cos(t * 0.40 + p.x * 5.0) + 0.5 * cos(t * 0.90 + p.x * 8.0 + 2.1)
  );

  vec2 c1 = vec2(aspect * mix(0.58, 0.30, u_layout) + 0.10 * aspect * sin(t * 0.21), 0.55 + 0.12 * cos(t * 0.17));
  vec2 c2 = vec2(aspect * mix(0.80, 0.62, u_layout) + 0.08 * aspect * cos(t * 0.19 + 1.0), 0.42 + 0.14 * sin(t * 0.23 + 2.0));
  vec2 c3 = vec2(aspect * mix(0.95, 0.88, u_layout) + 0.06 * aspect * sin(t * 0.15 + 4.0), 0.78 + 0.10 * cos(t * 0.20 + 1.5));

  float w1 = field(p, c1, 0.10);
  float w2 = field(p, c2, 0.08);
  float w3 = field(p, c3, 0.07);
  float w = w1 + w2 + w3;

  vec3 color = (u_c1 * w1 + u_c2 * w2 + u_c3 * w3) / max(w, 1e-4);
  float a = clamp(w, 0.0, 1.0) * u_alpha;
  // Film grain, re-rolled 12 times a second, scaled by the colour so empty areas stay clean.
  float grain = hash(floor(gl_FragCoord.xy) + floor(t * 12.0) * vec2(17.0, 31.0)) - 0.5;
  a = clamp(a * (1.0 + grain * 0.45), 0.0, 1.0);
  color = clamp(color + grain * 0.08, 0.0, 1.0);
  gl_FragColor = vec4(color * a, a);
}
`;

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
};

export const AmbientTexture = ({
  className,
  layout = "hero",
  scale = 1,
}: {
  className?: string;
  /** hero: colour gathered on the right, behind the illustration side. section: spread wide. */
  layout?: "hero" | "section";
  /** Canvas resolution relative to its CSS size. */
  scale?: number;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) {
      wrap.dataset.fallback = "true";
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      wrap.dataset.fallback = "true";
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("u_res");
    const uTime = u("u_time");
    const uAlpha = u("u_alpha");
    const uColors = [u("u_c1"), u("u_c2"), u("u_c3")];
    gl.uniform1f(u("u_layout"), layout === "section" ? 1 : 0);

    const root = document.documentElement;
    const applyPalette = () => {
      const palette = root.classList.contains("dark") ? palettes.dark : palettes.light;
      palette.colors.forEach((c, i) => gl.uniform3f(uColors[i], c[0], c[1], c[2]));
      gl.uniform1f(uAlpha, palette.alpha);
    };
    applyPalette();

    const resize = () => {
      const width = Math.max(1, Math.round(wrap.clientWidth * scale));
      const height = Math.max(1, Math.round(wrap.clientHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(uRes, width, height);
      }
    };
    resize();

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = performance.now() - 8000; // start mid-drift, not at the resting pose
    let frame = 0;
    let last = 0;
    let visible = true;

    const draw = (now: number) => {
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < 1000 / 24) return;
      last = now;
      draw(now);
    };
    const run = () => {
      cancelAnimationFrame(frame);
      if (still.matches) draw(start + 8000);
      else if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      run();
    });
    observer.observe(wrap);
    const sizeObserver = new ResizeObserver(() => {
      resize();
      if (still.matches) draw(start + 8000);
    });
    sizeObserver.observe(wrap);
    const themeObserver = new MutationObserver(() => {
      applyPalette();
      if (still.matches) draw(start + 8000);
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("visibilitychange", run);
    still.addEventListener("change", run);
    run();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", run);
      still.removeEventListener("change", run);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [layout, scale]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn("ambient-texture pointer-events-none", className)}
      data-layout={layout}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
};
