
"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { motion, useReducedMotion } from "motion/react";

type TextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
type SegmentMode = "chars" | "words" | "lines";
type StaggerDirection = "forward" | "reverse" | "center";
type Direction = "top" | "bottom" | "left" | "right";
type Easing = [number, number, number, number];

type Segment = { text: string; index: number };
type Part =
  | { kind: "space"; text: string }
  | { kind: "animated"; segments: Segment[] };

type Row = { parts: Part[] };

export interface StaggeredTextProps
  extends Omit<
    useRender.ComponentProps<"p">,
    "children" | "onAnimationComplete" | "ref"
  > {
  ref?: React.Ref<HTMLElement>;
  text: string;
  as?: TextTag;
  segmentBy?: SegmentMode;
  /** Separador explícito de linhas. Por padrão, usa quebras de linha (\n). */
  separator?: string;
  /** Intervalo entre segmentos, em milissegundos. */
  delay?: number;
  /** Duração de cada animação, em segundos. */
  duration?: number;
  easing?: Easing;
  /** Proporção visível necessária para iniciar a animação (0 a 1). */
  threshold?: number;
  rootMargin?: string;
  direction?: Direction;
  distance?: number;
  blur?: boolean;
  blurAmount?: number;
  staggerDirection?: StaggerDirection;
  respectReducedMotion?: boolean;
  exitOnScrollOut?: boolean;
  trigger?: "inView" | "mount";
  onAnimationComplete?: () => void;
  onExitComplete?: () => void;
}

const visuallyHidden: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

function graphemes(text: string): string[] {
  if (typeof Intl.Segmenter === "function") {
    return Array.from(
      new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text),
      ({ segment }) => segment,
    );
  }
  return Array.from(text);
}

function splitText(text: string, mode: SegmentMode, separator?: string) {
  const lines = separator ? text.split(separator) : text.split(/\r?\n/);
  let count = 0;

  const rows: Row[] = lines.map((line) => {
    // Preserva a altura de linhas vazias em todos os modos.
    if (!line) return { parts: [{ kind: "space", text: "\u00a0" }] };

    if (mode === "lines") {
      return {
        parts: line
          ? [{ kind: "animated" as const, segments: [{ text: line, index: count++ }] }]
          : [{ kind: "space" as const, text: "\u00a0" }],
      };
    }

    const parts: Part[] = [];
    for (const piece of line.match(/\s+|\S+/gu) ?? []) {
      if (/^\s+$/u.test(piece)) {
        parts.push({ kind: "space", text: piece });
        continue;
      }

      const values = mode === "chars" ? graphemes(piece) : [piece];
      parts.push({
        kind: "animated",
        segments: values.map((value) => ({ text: value, index: count++ })),
      });
    }
    return { parts };
  });

  return { rows, count };
}

function staggerPosition(index: number, count: number, direction: StaggerDirection) {
  if (direction === "reverse") return count - 1 - index;
  if (direction === "center") return Math.floor(Math.abs(index - (count - 1) / 2));
  return index;
}

/** Texto escalonado, polimórfico e compatível com o padrão render do Base UI. */
export function StaggeredText({
  text,
  as = "p",
  segmentBy = "words",
  separator,
  delay = 80,
  duration = 0.6,
  easing = [0.22, 1, 0.36, 1],
  threshold = 0.1,
  rootMargin = "0px",
  direction = "top",
  distance = 24,
  blur = true,
  blurAmount = 6,
  staggerDirection = "forward",
  respectReducedMotion = true,
  exitOnScrollOut = false,
  trigger = "inView",
  onAnimationComplete,
  onExitComplete,
  render,
  ref,
  ...rootProps
}: StaggeredTextProps) {
  const elementRef = React.useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = respectReducedMotion && !!prefersReducedMotion;
  const [inView, setInView] = React.useState(false);
  const hasBeenVisible = React.useRef(false);
  const observesViewport =
    trigger === "inView" &&
    !reduceMotion &&
    typeof IntersectionObserver !== "undefined";

  React.useEffect(() => {
    if (!observesViewport) return;

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          setInView(true);
          if (!exitOnScrollOut) observer.disconnect();
        } else if (exitOnScrollOut) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [observesViewport, exitOnScrollOut, threshold, rootMargin]);

  const { rows, count } = React.useMemo(
    () => splitText(text, segmentBy, separator),
    [text, segmentBy, separator],
  );

  const isVisible = !observesViewport || inView;
  React.useEffect(() => {
    if (isVisible) hasBeenVisible.current = true;
  }, [isVisible]);

  const lastIndex = React.useMemo(() => {
    let result = -1;
    let maxOrder = -1;
    for (let i = 0; i < count; i++) {
      const order = staggerPosition(i, count, staggerDirection);
      if (order >= maxOrder) {
        maxOrder = order;
        result = i;
      }
    }
    return result;
  }, [count, staggerDirection]);

  // Revelação refinada: primeiro surge um halo sutil e desfocado nas próximas
  // letras, depois cada uma ganha foco. O layout nunca se move.
  const travel = distance * (blur ? 0.35 : 1);
  const offsetX = direction === "left" ? -travel : direction === "right" ? travel : 0;
  const offsetY = direction === "top" ? -travel : direction === "bottom" ? travel : 0;
  const blurryFilter = `blur(${Math.max(0, blurAmount) * 1.65}px)`;
  const start = {
    opacity: 0,
    x: offsetX,
    y: offsetY,
    filter: blur ? blurryFilter : "blur(0px)",
  };
  const end = { opacity: 1, x: 0, y: 0, filter: "blur(0px)" };

  const renderSegment = ({ text: value, index }: Segment) => {
    const order = staggerPosition(index, count, staggerDirection);
    const revealAt = Math.max(0, order * delay) / 1000;
    const revealDuration = Math.max(0.01, duration);

    // Faz o preview começar até 180ms antes do momento individual da letra.
    // Assim, 2-3 letras à frente já ficam borradas sem que a frase inteira
    // apareça desfocada ao mesmo tempo.
    const maxPreview = blur ? Math.min(0.18, revealDuration * 0.32) : 0;
    const previewDuration = Math.min(revealAt, maxPreview);
    const beginAt = Math.max(0, revealAt - previewDuration);
    const totalDuration = revealDuration + previewDuration;
    const blurMarker = previewDuration / totalDuration;
    const clearMarker = blurMarker + (1 - blurMarker) * 0.72;

    const reveal = blur
      ? {
          opacity: [0, 0.56, 1, 1],
          x: [offsetX, offsetX, 0, 0],
          y: [offsetY, offsetY, 0, 0],
          filter: [blurryFilter, blurryFilter, "blur(0px)", "blur(0px)"],
        }
      : end;

    const target = reduceMotion ? end : isVisible ? reveal : start;
    const transition = reduceMotion
      ? { duration: 0 }
      : isVisible
        ? {
            delay: beginAt,
            duration: totalDuration,
            ease: easing,
            ...(blur ? { times: [0, blurMarker, clearMarker, 1] } : {}),
          }
        : { duration: Math.min(revealDuration, 0.32), ease: easing };

    return (
      <motion.span
        key={index}
        style={{
          display: "inline-block",
          position: "relative",
          transformOrigin: "50% 60%",
          whiteSpace: "pre",
        }}
        initial={reduceMotion ? false : start}
        animate={target}
        transition={transition}
        onAnimationComplete={() => {
          if (index !== lastIndex) return;
          if (isVisible) onAnimationComplete?.();
          else if (exitOnScrollOut && hasBeenVisible.current) onExitComplete?.();
        }}
      >
        {value}
      </motion.span>
    );
  };

  const accessibleText = separator ? text.split(separator).join("\n") : text;
  const element = useRender({
    defaultTagName: as,
    render,
    ref: [ref ?? null, elementRef],
    props: mergeProps<"p">(
      {
        style: { whiteSpace: "pre-wrap" },
        children: (
          <>
            <span style={visuallyHidden}>{accessibleText}</span>
            <span aria-hidden="true" key={`${segmentBy}:${separator ?? ""}:${text}`}>
              {rows.map((row, rowIndex) => (
                <span
                  key={rowIndex}
                  style={{ display: segmentBy === "lines" || rows.length > 1 ? "block" : "inline" }}
                >
                  {row.parts.map((part, partIndex) =>
                    part.kind === "space" ? (
                      <React.Fragment key={partIndex}>{part.text}</React.Fragment>
                    ) : (
                      <span
                        key={partIndex}
                        style={{ display: "inline-block", whiteSpace: "nowrap" }}
                      >
                        {part.segments.map(renderSegment)}
                      </span>
                    ),
                  )}
                </span>
              ))}
            </span>
          </>
        ),
      },
      rootProps,
    ),
  });

  return element;
}
