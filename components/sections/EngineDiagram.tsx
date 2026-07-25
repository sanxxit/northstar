"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { engine } from "@/lib/content";
import { iconMap } from "@/components/icon-map";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import styles from "./EngineDiagram.module.css";

const stages = engine.stages;
const N = stages.length;
const START = -90; // first node at top
const angleOf = (i: number) => START + i * (360 / N);
const pad = (i: number) => String(i + 1).padStart(2, "0");

export function EngineDiagram() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const vizRef = useRef<HTMLDivElement>(null);
  const cometRef = useRef<HTMLDivElement>(null);
  const patternsRef = useRef<HTMLElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const sizeRef = useRef(0);
  const activeRef = useRef(0);
  const runningRef = useRef(true);
  const rafRef = useRef(0);

  const [size, setSize] = useState(0);
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(true);
  const [reduce, setReduce] = useState(false);
  const [pointerFine, setPointerFine] = useState(false);

  // keep refs in sync with state for the imperative rAF loop
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    runningRef.current = running;
  }, [running]);
  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  // measure + reduced-motion
  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(rm);
    setPointerFine(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
    if (rm) setRunning(false);

    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => setSize(wrap.clientWidth));
    ro.observe(wrap);
    setSize(wrap.clientWidth);
    return () => ro.disconnect();
  }, []);

  // the comet + node-glow + brand-memory count loop
  useEffect(() => {
    if (reduce) {
      // static: give the non-active nodes a gentle resting glow
      nodeRefs.current.forEach((b, i) => {
        if (b && i !== activeRef.current) b.style.setProperty("--g", "0.4");
      });
      return;
    }

    const T = 14000; // ms per full revolution
    let elapsed = 0;
    let prev = performance.now();
    let lastP = 0;
    let patterns = 40;

    const frame = (now: number) => {
      const dt = now - prev;
      prev = now;
      if (runningRef.current) elapsed += dt;

      const wrap = wrapRef.current;
      const S = sizeRef.current;
      if (wrap && wrap.offsetParent !== null && S > 0) {
        const c = S / 2;
        const R = S * 0.41;
        const p = (elapsed % T) / T;
        const ang = START + p * 360;
        const rad = (ang * Math.PI) / 180;

        if (cometRef.current) {
          cometRef.current.style.left = `${c + R * Math.cos(rad)}px`;
          cometRef.current.style.top = `${c + R * Math.sin(rad)}px`;
        }

        for (let i = 0; i < N; i++) {
          const b = nodeRefs.current[i];
          if (!b) continue;
          if (i === activeRef.current) {
            b.style.setProperty("--g", "1");
            continue;
          }
          const d = Math.abs((((ang - angleOf(i)) % 360) + 540) % 360 - 180);
          b.style.setProperty("--g", Math.exp(-Math.pow(d / 24, 2)).toFixed(3));
        }

        if (p < lastP) {
          patterns = Math.min(patterns + 1, 240);
          if (patternsRef.current)
            patternsRef.current.textContent = String(patterns);
        }
        lastP = p;
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduce]);

  // subtle 3D tilt toward the cursor (desktop, motion allowed)
  const onVizMove = (e: React.MouseEvent) => {
    if (reduce || !pointerFine) return;
    const viz = vizRef.current;
    const wrap = wrapRef.current;
    if (!viz || !wrap) return;
    const r = viz.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    wrap.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(
      x * 6
    ).toFixed(2)}deg)`;
  };
  const onVizLeave = () => {
    if (wrapRef.current) wrapRef.current.style.transform = "rotateX(0) rotateY(0)";
  };

  // keyboard: arrow between nodes
  const onNodesKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const ni = (active + dir + N) % N;
    nodeRefs.current[ni]?.focus();
  };

  const [titleHead] = engine.title.split("Compounding forever.");
  const cur = stages[active];

  return (
    <section
      id="engine"
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
    >
      <div className="shell relative">
        {/* header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-accent-bright">{engine.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-tight md:text-5xl lg:text-6xl">
            {titleHead.trim()}
            <br />
            <span className="text-gradient">Compounding forever.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted">{engine.lead}</p>
        </Reveal>

        {/* ---------- desktop orbital visualization ---------- */}
        <div
          className={styles.viz}
          ref={vizRef}
          onMouseMove={onVizMove}
          onMouseLeave={onVizLeave}
        >
          <div className={styles.ringWrap} ref={wrapRef}>
            <div className={styles.coreGlow} aria-hidden />

            <svg className={styles.ringSvg} viewBox="0 0 100 100" aria-hidden>
              <defs>
                <linearGradient id="ns-sheen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity="0" />
                  <stop offset="50%" stopColor="#C7D2FE" stopOpacity=".9" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle className={styles.ringBase} cx="50" cy="50" r="41" />
              <circle className={styles.ringParticles} cx="50" cy="50" r="41" />
              <circle className={styles.ringSheen} cx="50" cy="50" r="41" />
            </svg>

            <div className={styles.core}>
              <span className={styles.coreLabel}>Brand memory</span>
              <span className={styles.coreNum}>
                <b ref={patternsRef}>40</b> <span>patterns</span>
              </span>
              <span className={styles.coreSub}>learned &amp; reused</span>
            </div>

            {!reduce && size > 0 && (
              <div className={styles.comet} ref={cometRef} aria-hidden />
            )}

            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div className={styles.nodes} style={{ opacity: size ? 1 : 0 }} onKeyDown={onNodesKey}>
              {stages.map((s, i) => {
                const Icon = iconMap[s.icon] ?? iconMap.Sparkles;
                const ang = (angleOf(i) * Math.PI) / 180;
                const c = size / 2;
                const R = size * 0.41;
                return (
                  <button
                    key={s.id}
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    className={cn(styles.node, active === i && styles.on)}
                    style={{ left: c + R * Math.cos(ang), top: c + R * Math.sin(ang) }}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-label={`Stage ${pad(i)}: ${s.label} — ${s.headline}`}
                  >
                    <span className={styles.nodeNum}>{pad(i)}</span>
                    <span className={styles.nodeIc}>
                      <Icon strokeWidth={1.6} aria-hidden />
                    </span>
                    <span className={styles.nodeName}>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* detail card (keyed so the flash replays on change) */}
          <div key={active} className={styles.detail}>
            <div className={styles.detailTop}>
              <span className={styles.detailNum}>{pad(active)}</span>
              <span className={styles.detailName}>{cur.label}</span>
            </div>
            <p className={styles.detailPromise}>{cur.headline}</p>
            <p className={styles.detailDesc}>{cur.line}</p>
          </div>

          {!reduce && (
            <button
              className={styles.pausebtn}
              onClick={() => setRunning((r) => !r)}
              aria-pressed={!running}
            >
              {running ? "Pause" : "Play"}
            </button>
          )}
        </div>

        {/* ---------- mobile vertical fallback ---------- */}
        <div className={styles.stack}>
          {stages.map((s, i) => {
            const Icon = iconMap[s.icon] ?? iconMap.Sparkles;
            return (
              <div className={styles.srow} key={s.id}>
                <div className={styles.snode} aria-hidden>
                  <Icon strokeWidth={1.6} />
                </div>
                <div className={styles.snum}>{pad(i)}</div>
                <p className={styles.sname}>{s.label}</p>
                <p className={styles.spromise}>{s.headline}</p>
                <p className={styles.sdesc}>{s.line}</p>
              </div>
            );
          })}
        </div>

        <p className={styles.caption}>
          <span className={styles.rot} aria-hidden>
            <RotateCcw className="h-4 w-4" />
          </span>
          Learn feeds back into Research — the loop compounds forever.
        </p>

        {/* channels + continuous-optimization statement */}
        <Reveal className="mt-14">
          <ul className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
            {engine.channels.map((ch) => (
              <li
                key={ch}
                className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                {ch}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-relaxed text-muted">
            {engine.optimize}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
