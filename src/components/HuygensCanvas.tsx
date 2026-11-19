import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import {
  Language,
  OpticsMetrics,
  SimulationParams,
  SimulationStage,
  VisualLayers,
} from '../types/optics';
import { STAGE_GUIDES } from '../data/opticsContent';

interface HuygensCanvasProps {
  lang: Language;
  params: SimulationParams;
  metrics: OpticsMetrics;
  stage: SimulationStage;
  layers: VisualLayers;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onResetPlayback: () => void;
  onStageChange: (stage: SimulationStage) => void;
  onToggleLayer: (key: keyof VisualLayers) => void;
}

export const HuygensCanvas: React.FC<HuygensCanvasProps> = ({
  lang,
  params,
  metrics,
  stage,
  layers,
  isPlaying,
  onTogglePlay,
  onResetPlayback,
  onStageChange,
  onToggleLayer,
}) => {
  const isZh = lang === 'zh';
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Continuous phase [0..1) for traveling waves, plus proofSweep [0..1] for canonical Δt demonstration
  const phaseRef = useRef<number>(0.45);
  const sweepRef = useRef<number>(stage === 1 ? 0.0 : 1.0);
  const [stepCount, setStepCount] = useState(0);

  // Sync sweep target when user switches stage
  useEffect(() => {
    if (stage === 1) {
      sweepRef.current = 0.0;
    } else if (stage === 2) {
      sweepRef.current = 0.72;
    } else {
      sweepRef.current = 1.0;
    }
    setStepCount((c) => c + 1);
  }, [stage]);

  const handleStep = () => {
    phaseRef.current = (phaseRef.current + 0.12) % 1;
    sweepRef.current = sweepRef.current >= 0.99 ? 0.15 : Math.min(1, sweepRef.current + 0.2);
    setStepCount((c) => c + 1);
  };

  const handleLocalReset = () => {
    phaseRef.current = 0.25;
    sweepRef.current = stage === 1 ? 0 : 1;
    setStepCount((c) => c + 1);
    onResetPlayback();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let lastTime = performance.now();

    const drawArrowhead = (
      x: number,
      y: number,
      dx: number,
      dy: number,
      size: number,
      color: string
    ) => {
      const angle = Math.atan2(dy, dx);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-size, -size * 0.45);
      ctx.lineTo(-size, size * 0.45);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    const drawRightAngle = (
      vx: number,
      vy: number,
      ux: number,
      uy: number,
      wx: number,
      wy: number,
      size: number,
      color: string
    ) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(vx + ux * size, vy + uy * size);
      ctx.lineTo(vx + (ux + wx) * size, vy + (uy + wy) * size);
      ctx.lineTo(vx + wx * size, vy + wy * size);
      ctx.stroke();
      ctx.restore();
    };

    const renderFrame = (now: number) => {
      const dtSec = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (isPlaying) {
        phaseRef.current = (phaseRef.current + dtSec * 0.35 * params.speed) % 1;
        if (stage >= 2) {
          sweepRef.current = Math.min(1, sweepRef.current + dtSec * 0.55 * params.speed);
        }
      }

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const W = Math.max(320, rect.width);
      const H = Math.max(380, rect.height);

      if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      const y0 = H * 0.47;
      const x0 = W * 0.46;

      // Medium 1 & Medium 2 background shading proportional to refractive index
      const m1Alpha = Math.min(0.18, 0.03 + (params.n1 - 1) * 0.1);
      const m2Alpha = Math.min(0.24, 0.04 + (params.n2 - 1) * 0.12);

      ctx.fillStyle = `rgba(241, 245, 249, 0.85)`;
      ctx.fillRect(0, 0, W, y0);
      if (params.n1 > 1.02) {
        ctx.fillStyle = `rgba(14, 165, 233, ${m1Alpha})`;
        ctx.fillRect(0, 0, W, y0);
      }

      ctx.fillStyle = `rgba(226, 232, 240, 0.55)`;
      ctx.fillRect(0, y0, W, H - y0);
      if (params.n2 > 1.02) {
        ctx.fillStyle = `rgba(2, 132, 199, ${m2Alpha})`;
        ctx.fillRect(0, y0, W, H - y0);
      }

      // Subtle coordinate grid in both media
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
      ctx.lineWidth = 1;
      const gridStep = 36;
      for (let gx = x0 % gridStep; gx < W; gx += gridStep) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = y0 % gridStep; gy < H; gy += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      // Optical Interface line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.lineTo(W, y0);
      ctx.stroke();

      // Normal line (dashed)
      ctx.save();
      ctx.setLineDash([6, 5]);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x0, 18);
      ctx.lineTo(x0, H - 18);
      ctx.stroke();
      ctx.restore();

      // Medium Labels
      ctx.font = '600 12px "Plus Jakarta Sans", "Noto Sans TC", sans-serif';
      ctx.fillStyle = '#334155';
      ctx.textAlign = 'left';
      ctx.fillText(
        isZh
          ? `介質 1 · n₁ = ${params.n1.toFixed(2)}  (v₁ = ${metrics.v1Ratio.toFixed(2)}c)`
          : `Medium 1 · n₁ = ${params.n1.toFixed(2)}  (v₁ = ${metrics.v1Ratio.toFixed(2)}c)`,
        16,
        26
      );
      ctx.fillText(
        isZh
          ? `介質 2 · n₂ = ${params.n2.toFixed(2)}  (v₂ = ${metrics.v2Ratio.toFixed(2)}c)`
          : `Medium 2 · n₂ = ${params.n2.toFixed(2)}  (v₂ = ${metrics.v2Ratio.toFixed(2)}c)`,
        16,
        H - 16
      );

      // Normal label
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'left';
      ctx.fillText(isZh ? '法線 N' : 'Normal', x0 + 6, 28);

      // Compute exact canonical geometry for AB, BC, AC, AD
      const theta1 = metrics.theta1Rad;
      const sin1 = Math.sin(theta1);
      const cos1 = Math.cos(theta1);
      const sin2Ratio = metrics.sinTheta2; // (n1/n2) * sin1
      const isTIR = metrics.isTotalInternalReflection;

      const maxVert = Math.min(y0 - 44, H - y0 - 44);
      const maxHoriz = Math.min(W * 0.34, 240);
      // Scale AC so even when sin2Ratio > 1 (TIR), AD fits inside Medium 2
      const AC = Math.min(maxHoriz, maxVert / Math.max(1, sin2Ratio * 1.05));
      const xA = x0 - AC * 0.48;
      const xC = xA + AC;

      const Bx = xA + AC * cos1 * cos1;
      const By = y0 - AC * sin1 * cos1;
      const BC = AC * sin1;
      const AD = AC * sin2Ratio;

      // Propagation vectors
      const k1x = sin1;
      const k1y = cos1;
      // Tangent wavefront vector (A -> B)
      const w1x = cos1;
      const w1y = -sin1;
      const beamWidth = AC * cos1;

      // 1. Traveling Wavefronts (Continuous collimated beam clipped to beam rays through A and C)
      if (layers.showWavefronts) {
        const lambda1 = 38 / Math.pow(params.n1, 0.65);
        const speedScale = metrics.v2Ratio / metrics.v1Ratio; // v2 / v1 = n1 / n2
        const phaseDist = phaseRef.current * lambda1;

        ctx.save();
        // Clip Medium 1 beam corridor
        ctx.beginPath();
        const rayTopLen = Math.max(W, H) * 1.2;
        ctx.moveTo(xA - k1x * rayTopLen, y0 - k1y * rayTopLen);
        ctx.lineTo(xC - k1x * rayTopLen, y0 - k1y * rayTopLen);
        ctx.lineTo(xC, y0);
        ctx.lineTo(xA, y0);
        ctx.closePath();
        ctx.clip();

        ctx.strokeStyle = 'rgba(2, 132, 199, 0.52)';
        ctx.lineWidth = 2;

        const minK = -Math.ceil(rayTopLen / lambda1);
        const maxK = Math.ceil(BC / lambda1) + 2;

        for (let k = minK; k <= maxK; k++) {
          const s = k * lambda1 + phaseDist; // distance along k1 from wavefront passing through A
          const pLeftX = xA + s * k1x;
          const pLeftY = y0 + s * k1y;
          const pRightX = pLeftX + beamWidth * w1x;
          const pRightY = pLeftY + beamWidth * w1y;

          ctx.beginPath();
          ctx.moveTo(pLeftX, pLeftY);
          ctx.lineTo(pRightX, pRightY);
          ctx.stroke();
        }
        ctx.restore();

        // Medium 2 Refracted Wavefronts (or Reflected Wavefronts in Medium 1 when TIR)
        if (!isTIR && metrics.theta2Rad !== null) {
          const theta2 = metrics.theta2Rad;
          const k2x = Math.sin(theta2);
          const k2y = Math.cos(theta2);
          const w2x = Math.cos(theta2);
          const w2y = -Math.sin(theta2);
          const refrBeamWidth = AC * Math.cos(theta2);
          const lambda2 = lambda1 * speedScale;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(xA, y0);
          ctx.lineTo(xC, y0);
          ctx.lineTo(xC + k2x * rayTopLen, y0 + k2y * rayTopLen);
          ctx.lineTo(xA + k2x * rayTopLen, y0 + k2y * rayTopLen);
          ctx.closePath();
          ctx.clip();

          ctx.strokeStyle = 'rgba(5, 150, 105, 0.65)';
          ctx.lineWidth = 2;

          for (let k = -2; k <= Math.ceil(rayTopLen / lambda2) + 2; k++) {
            const s1 = k * lambda1 + phaseDist;
            const s2 = s1 * speedScale;
            const pLeftX = xA + s2 * k2x;
            const pLeftY = y0 + s2 * k2y;
            const pRightX = pLeftX + refrBeamWidth * w2x;
            const pRightY = pLeftY + refrBeamWidth * w2y;

            ctx.beginPath();
            ctx.moveTo(pLeftX, pLeftY);
            ctx.lineTo(pRightX, pRightY);
            ctx.stroke();
          }
          ctx.restore();
        } else if (isTIR) {
          // Reflected wavefronts back into Medium 1
          const krx = sin1;
          const kry = -cos1;
          const wrx = cos1;
          const wry = sin1;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(xA, y0);
          ctx.lineTo(xC, y0);
          ctx.lineTo(xC + krx * rayTopLen, y0 + kry * rayTopLen);
          ctx.lineTo(xA + krx * rayTopLen, y0 + kry * rayTopLen);
          ctx.closePath();
          ctx.clip();

          ctx.strokeStyle = 'rgba(217, 119, 6, 0.55)';
          ctx.lineWidth = 2;

          for (let k = -2; k <= Math.ceil(rayTopLen / lambda1) + 2; k++) {
            const s = k * lambda1 + phaseDist;
            const pLeftX = xA + s * krx;
            const pLeftY = y0 + s * kry;
            const pRightX = pLeftX + beamWidth * wrx;
            const pRightY = pLeftY + beamWidth * wry;

            ctx.beginPath();
            ctx.moveTo(pLeftX, pLeftY);
            ctx.lineTo(pRightX, pRightY);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // 2. Canonical Huygens Secondary Wavelets (during sweep t in [0..Delta t])
      const sweep = sweepRef.current; // 0..1
      const numWavelets = 7;

      if (layers.showWavelets && sweep > 0.01) {
        // Clip wavelets strictly to Medium 2 (below boundary) unless TIR where we also show Medium 1 reflection wavelets
        for (let i = 0; i < numWavelets - 1; i++) {
          const f = i / (numWavelets - 1); // 0 at A .. <1 near C
          const px = xA + f * AC;

          if (sweep > f) {
            const localProgress = (sweep - f) / (1 - 0); // elapsed fraction since wavefront hit P_i
            const r = AD * localProgress;

            if (r > 1.5) {
              // Secondary wavelet in Medium 2
              ctx.save();
              ctx.beginPath();
              ctx.rect(0, y0, W, H - y0);
              ctx.clip();

              ctx.beginPath();
              ctx.arc(px, y0, r, 0, Math.PI, false);
              ctx.strokeStyle =
                i === 0 ? 'rgba(217, 119, 6, 0.9)' : 'rgba(217, 119, 6, 0.42)';
              ctx.lineWidth = i === 0 ? 2.2 : 1.35;
              ctx.stroke();

              if (i === 0) {
                ctx.fillStyle = 'rgba(217, 119, 6, 0.08)';
                ctx.fill();
              }
              ctx.restore();

              // In TIR, also draw reflected wavelet semicircle in Medium 1 so students see reflected envelope
              if (isTIR) {
                const rRefl = BC * localProgress;
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, W, y0);
                ctx.clip();

                ctx.beginPath();
                ctx.arc(px, y0, rRefl, Math.PI, 0, false);
                ctx.strokeStyle =
                  i === 0 ? 'rgba(220, 38, 38, 0.72)' : 'rgba(220, 38, 38, 0.30)';
                ctx.lineWidth = i === 0 ? 1.8 : 1.1;
                ctx.stroke();
                ctx.restore();
              }
            }

            // Emitter dot on boundary
            ctx.beginPath();
            ctx.arc(px, y0, i === 0 ? 4 : 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#D97706';
            ctx.fill();
          }
        }
      }

      // 3. Rays & Angle Arcs
      if (layers.showRays) {
        const rayLen = Math.max(W, H) * 0.45;
        // Central incident ray hitting (x0, y0)
        const incStartX = x0 - k1x * rayLen;
        const incStartY = y0 - k1y * rayLen;

        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(incStartX, incStartY);
        ctx.lineTo(x0, y0);
        ctx.stroke();
        drawArrowhead(
          x0 - k1x * (rayLen * 0.45),
          y0 - k1y * (rayLen * 0.45),
          k1x,
          k1y,
          10,
          '#0284C7'
        );

        // Edge beam boundary rays passing through A and C (subtle guide lines)
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.45)';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(xA - k1x * rayLen, y0 - k1y * rayLen);
        ctx.lineTo(xA, y0);
        ctx.moveTo(xC - k1x * rayLen, y0 - k1y * rayLen);
        ctx.lineTo(xC, y0);
        ctx.stroke();
        ctx.restore();

        // Angle arc theta_1
        const arcR1 = 36;
        ctx.beginPath();
        ctx.arc(x0, y0, arcR1, -Math.PI / 2 - theta1, -Math.PI / 2, false);
        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.fillStyle = '#0369A1';
        ctx.textAlign = 'center';
        const t1LabelA = -Math.PI / 2 - theta1 / 2;
        ctx.fillText(
          `θ₁=${params.theta1Deg.toFixed(0)}°`,
          x0 + Math.cos(t1LabelA) * (arcR1 + 22),
          y0 + Math.sin(t1LabelA) * (arcR1 + 16)
        );

        if (!isTIR && metrics.theta2Rad !== null && metrics.theta2Deg !== null) {
          const theta2 = metrics.theta2Rad;
          const k2x = Math.sin(theta2);
          const k2y = Math.cos(theta2);

          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x0 + k2x * rayLen, y0 + k2y * rayLen);
          ctx.stroke();
          drawArrowhead(
            x0 + k2x * (rayLen * 0.48),
            y0 + k2y * (rayLen * 0.48),
            k2x,
            k2y,
            10,
            '#059669'
          );

          // Edge refracted guide rays through A and C
          ctx.save();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = 'rgba(5, 150, 105, 0.45)';
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(xA, y0);
          ctx.lineTo(xA + k2x * rayLen, y0 + k2y * rayLen);
          ctx.moveTo(xC, y0);
          ctx.lineTo(xC + k2x * rayLen, y0 + k2y * rayLen);
          ctx.stroke();
          ctx.restore();

          // Angle arc theta_2
          const arcR2 = 40;
          ctx.beginPath();
          ctx.arc(x0, y0, arcR2, Math.PI / 2 - theta2, Math.PI / 2, false);
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          ctx.fillStyle = '#047857';
          const t2LabelA = Math.PI / 2 - theta2 / 2;
          ctx.fillText(
            `θ₂=${metrics.theta2Deg.toFixed(1)}°`,
            x0 + Math.cos(t2LabelA) * (arcR2 + 24),
            y0 + Math.sin(t2LabelA) * (arcR2 + 18)
          );
        } else if (isTIR) {
          // Reflected ray in Medium 1
          const krx = sin1;
          const kry = -cos1;

          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x0 + krx * rayLen, y0 + kry * rayLen);
          ctx.stroke();
          drawArrowhead(
            x0 + krx * (rayLen * 0.48),
            y0 + kry * (rayLen * 0.48),
            krx,
            kry,
            10,
            '#DC2626'
          );

          ctx.fillStyle = '#B91C1C';
          ctx.font = '600 12px "Plus Jakarta Sans", "Noto Sans TC", sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(
            isZh
              ? `全反射發生 (θ₁ > θc = ${metrics.criticalAngleDeg?.toFixed(1)}°)`
              : `Total Internal Reflection (θ₁ > θc = ${metrics.criticalAngleDeg?.toFixed(1)}°)`,
            x0 + 18,
            y0 + 36
          );
        }
      }

      // 4. Geometric Proof Overlay: Triangles ABC & ADC
      if (layers.showGeometry) {
        // Wavefront AB (t = 0)
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(xA, y0);
        ctx.lineTo(Bx, By);
        ctx.stroke();

        // Segment BC (distance v1 * dt)
        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(Bx, By);
        ctx.lineTo(xC, y0);
        ctx.stroke();

        // Hypotenuse AC
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(xA, y0);
        ctx.lineTo(xC, y0);
        ctx.stroke();

        // Shaded triangle ABC
        ctx.fillStyle = 'rgba(2, 132, 199, 0.09)';
        ctx.beginPath();
        ctx.moveTo(xA, y0);
        ctx.lineTo(Bx, By);
        ctx.lineTo(xC, y0);
        ctx.closePath();
        ctx.fill();

        // Right angle marker at B
        drawRightAngle(Bx, By, -w1x, -w1y, k1x, k1y, 9, '#0F172A');

        // Moving intermediate wavefront at current sweep
        if (sweep > 0.02 && sweep < 0.99) {
          const sx = xA + sweep * AC;
          const bxNow = Bx + sweep * BC * k1x;
          const byNow = By + sweep * BC * k1y;
          ctx.strokeStyle = '#0EA5E9';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(sx, y0);
          ctx.lineTo(bxNow, byNow);
          ctx.stroke();
        }

        // Triangle ADC & tangent envelope CD when !isTIR and sweep > 0.1
        if (!isTIR && metrics.theta2Rad !== null && sweep > 0.1) {
          const theta2 = metrics.theta2Rad;
          const k2x = Math.sin(theta2);
          const k2y = Math.cos(theta2);
          const rNow = AD * sweep;
          const Dx = xA + rNow * k2x;
          const Dy = y0 + rNow * k2y;
          const cxNow = xA + AC * sweep;

          // Radius AD
          ctx.strokeStyle = '#D97706';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(xA, y0);
          ctx.lineTo(Dx, Dy);
          ctx.stroke();

          // Common tangent refracted wavefront DC
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.moveTo(Dx, Dy);
          ctx.lineTo(cxNow, y0);
          ctx.stroke();

          // Shaded triangle ADC
          ctx.fillStyle = 'rgba(5, 150, 105, 0.09)';
          ctx.beginPath();
          ctx.moveTo(xA, y0);
          ctx.lineTo(Dx, Dy);
          ctx.lineTo(cxNow, y0);
          ctx.closePath();
          ctx.fill();

          // Right angle marker at D
          const dcLen = Math.hypot(cxNow - Dx, y0 - Dy);
          if (dcLen > 14) {
            drawRightAngle(
              Dx,
              Dy,
              -k2x,
              -k2y,
              (cxNow - Dx) / dcLen,
              (y0 - Dy) / dcLen,
              9,
              '#047857'
            );
          }

          // Vertex D label
          ctx.beginPath();
          ctx.arc(Dx, Dy, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#059669';
          ctx.fill();

          ctx.font = '700 13px "JetBrains Mono", monospace';
          ctx.fillStyle = '#047857';
          ctx.textAlign = 'right';
          ctx.fillText('D', Dx - 8, Dy + 14);

          if (sweep >= 0.85) {
            ctx.font = '600 11px "JetBrains Mono", monospace';
            ctx.fillStyle = '#B45309';
            ctx.textAlign = 'right';
            ctx.fillText('v₂Δt', (xA + Dx) / 2 - 8, (y0 + Dy) / 2 + 4);
          }
        } else if (isTIR && sweep > 0.3) {
          // Show why AD > AC geometrically
          const rNow = AD * sweep;
          ctx.font = '600 11px "JetBrains Mono", monospace';
          ctx.fillStyle = '#B45309';
          ctx.textAlign = 'left';
          ctx.fillText(
            `v₂Δt (${(rNow / AC).toFixed(2)}×AC) > AC`,
            xA + 10,
            y0 + Math.min(rNow - 14, H - y0 - 36)
          );
        }

        // Labels for A, B, C and BC = v1 dt
        const drawVertex = (vx: number, vy: number, label: string, ox: number, oy: number) => {
          ctx.beginPath();
          ctx.arc(vx, vy, 4.2, 0, Math.PI * 2);
          ctx.fillStyle = '#0F172A';
          ctx.fill();
          ctx.font = '700 13px "JetBrains Mono", monospace';
          ctx.fillStyle = '#0F172A';
          ctx.textAlign = 'center';
          ctx.fillText(label, vx + ox, vy + oy);
        };

        drawVertex(xA, y0, 'A', -12, 15);
        drawVertex(Bx, By, 'B', 8, -10);
        drawVertex(xC, y0, 'C', 12, 15);

        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#0369A1';
        ctx.textAlign = 'left';
        ctx.fillText('v₁Δt', (Bx + xC) / 2 + 8, (By + y0) / 2 - 4);
      }

      ctx.restore();

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    };

    animationFrameId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, [params, metrics, stage, layers, isPlaying, isZh, stepCount]);

  return (
    <div className="flex flex-col border border-slate-200 bg-white rounded-xl overflow-hidden">
      {/* Stage Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/70 px-4 py-2.5">
        <div
          role="tablist"
          aria-label={isZh ? '學習階段選擇' : 'Learning stages'}
          className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-200/70 p-1"
        >
          {STAGE_GUIDES.map((guide) => {
            const active = stage === guide.stage;
            return (
              <button
                key={guide.stage}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onStageChange(guide.stage)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-sky-600 ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isZh ? guide.shortLabelZh : guide.shortLabelEn}
              </button>
            );
          })}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onTogglePlay}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-700 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? (isZh ? '暫停' : 'Pause') : isZh ? '播放' : 'Play'}</span>
          </button>
          <button
            type="button"
            onClick={handleStep}
            title={isZh ? '單步前進 Δt' : 'Step forward Δt'}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            <StepForward className="h-3.5 w-3.5" />
            <span>{isZh ? '步進' : 'Step'}</span>
          </button>
          <button
            type="button"
            onClick={handleLocalReset}
            title={isZh ? '重設波前位置' : 'Reset wavefronts'}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isZh ? '重播' : 'Restart'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative h-[430px] w-full sm:h-[490px] lg:h-[520px] bg-slate-50"
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          aria-label={
            isZh
              ? '惠更斯原理折射波前與次波圓動態模擬畫布'
              : "Interactive Huygens' principle wavefront and secondary wavelet canvas"
          }
        />
      </div>

      {/* Visual Layer Toggles & Clean Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              {
                key: 'showWavelets',
                labelZh: '次波圓 (Wavelets)',
                labelEn: 'Wavelets',
                dotColor: 'bg-amber-600',
              },
              {
                key: 'showWavefronts',
                labelZh: '平面波前',
                labelEn: 'Wavefronts',
                dotColor: 'bg-sky-600',
              },
              {
                key: 'showRays',
                labelZh: '光線與夾角',
                labelEn: 'Rays & Angles',
                dotColor: 'bg-emerald-600',
              },
              {
                key: 'showGeometry',
                labelZh: '幾何三角形 △ABC / △ADC',
                labelEn: 'Proof Triangles',
                dotColor: 'bg-slate-800',
              },
            ] as const
          ).map((item) => {
            const active = layers[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onToggleLayer(item.key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'border-slate-300 bg-slate-100 text-slate-900'
                    : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className={`h-2 w-2 rounded-xs ${item.dotColor}`} aria-hidden="true" />
                <span>{isZh ? item.labelZh : item.labelEn}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono tabular-nums">
          <span>{isZh ? '圖例' : 'Legend'}</span>
          <span aria-hidden="true">·</span>
          <span className="text-sky-700">{isZh ? '入射波' : 'Incident'}</span>
          <span aria-hidden="true">/</span>
          <span className="text-amber-700">{isZh ? '次波圓' : 'Wavelet'}</span>
          <span aria-hidden="true">/</span>
          <span className="text-emerald-700">{isZh ? '折射包絡線' : 'Envelope'}</span>
        </div>
      </div>
    </div>
  );
};
