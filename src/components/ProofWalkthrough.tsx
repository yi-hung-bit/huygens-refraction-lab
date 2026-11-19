import React, { useState } from 'react';
import { Language } from '../types/optics';
import { PROOF_STEPS } from '../data/opticsContent';

interface ProofWalkthroughProps {
  lang: Language;
}

export const ProofWalkthrough: React.FC<ProofWalkthroughProps> = ({ lang }) => {
  const isZh = lang === 'zh';
  const [activeStep, setActiveStep] = useState<number>(1);
  const current = PROOF_STEPS.find((s) => s.step === activeStep) ?? PROOF_STEPS[0];

  // Canonical geometric coordinates for clean SVG proof illustration (theta1 = 42 deg, theta2 = 26 deg)
  const A = { x: 110, y: 185 };
  const C = { x: 380, y: 185 };
  // AC = 270; theta1 = 42 deg => cos1 = 0.743, sin1 = 0.669
  // B = A + (AC cos^2, -AC sin cos) = (110 + 149.1, 185 - 134.2) = (259.1, 50.8)
  const B = { x: 259, y: 51 };
  // theta2 = 26 deg => sin2 = 0.438, cos2 = 0.899
  // D = A + (AC sin^2, AC sin cos) = (110 + 51.9, 185 + 106.4) = (162, 291)
  const D = { x: 162, y: 291 };
  const AD = Math.hypot(D.x - A.x, D.y - A.y); // ~118.4

  const isGroup = (g: string) => current.highlightGroup === g || current.highlightGroup === 'snell';

  return (
    <section
      id="derivation"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-t border-slate-200"
    >
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-medium text-slate-500">
          {isZh ? '幾何推導 · 司乃耳定律' : 'Geometric Proof · Snell’s Law'}
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
          {isZh
            ? '為什麼兩組直角三角形就能證明折射定律？'
            : 'How Two Right Triangles Derive the Law of Refraction'}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {isZh
            ? '點選下方四個推導步驟，觀察左側幾何圖形中波前 AB、次波半徑 AD 與共有斜邊 AC 如何一步步消去時間與長度，得出 n₁ sin θ₁ = n₂ sin θ₂。'
            : 'Select each step below to see how incident wavefront AB, wavelet radius AD, and shared hypotenuse AC cancel time Δt to yield n₁ sin θ₁ = n₂ sin θ₂.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
        {/* Left: Interactive SVG Proof Diagram */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
            <span>{isZh ? '等時區間 Δt 幾何分解圖' : 'Equal-Time Δt Geometric Decomposition'}</span>
            <span className="font-mono text-slate-700">△ABC ⊥ B · △ADC ⊥ D</span>
          </div>

          <div className="my-auto py-4">
            <svg
              viewBox="0 0 490 340"
              className="w-full h-auto"
              role="img"
              aria-label={
                isZh
                  ? '惠更斯原理推導司乃耳定律的直角三角形 △ABC 與 △ADC 示意圖'
                  : 'Right triangles ABC and ADC illustrating Huygens’ principle proof of Snell’s law'
              }
            >
              {/* Medium backgrounds */}
              <rect x="0" y="0" width="490" height="185" fill="#F8FAFC" />
              <rect x="0" y="185" width="490" height="155" fill="#EFF6FF" />

              {/* Medium labels */}
              <text x="16" y="24" fontSize="11" fill="#475569" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">
                {isZh ? '介質 1 (波速 v₁)' : 'Medium 1 (speed v₁)'}
              </text>
              <text x="16" y="324" fontSize="11" fill="#0369A1" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">
                {isZh ? '介質 2 (波速 v₂)' : 'Medium 2 (speed v₂)'}
              </text>

              {/* Triangle ABC fill */}
              <polygon
                points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
                fill={isGroup('incident') ? 'rgba(2, 132, 199, 0.14)' : 'rgba(2, 132, 199, 0.05)'}
              />

              {/* Triangle ADC fill */}
              <polygon
                points={`${A.x},${A.y} ${D.x},${D.y} ${C.x},${C.y}`}
                fill={isGroup('tangent') || isGroup('wavelet') ? 'rgba(5, 150, 105, 0.14)' : 'rgba(5, 150, 105, 0.05)'}
              />

              {/* Interface line */}
              <line x1="20" y1={A.y} x2="470" y2={A.y} stroke="#475569" strokeWidth="1.5" />

              {/* Normal at A */}
              <line
                x1={A.x}
                y1="25"
                x2={A.x}
                y2="320"
                stroke="#94A3B8"
                strokeWidth="1.2"
                strokeDasharray="5 4"
              />

              {/* Secondary Wavelet Semicircle at A */}
              <path
                d={`M ${A.x - AD} ${A.y} A ${AD} ${AD} 0 0 0 ${A.x + AD} ${A.y}`}
                fill="none"
                stroke="#D97706"
                strokeWidth={isGroup('wavelet') ? 2.5 : 1.5}
                strokeDasharray={isGroup('wavelet') ? undefined : '4 3'}
                opacity={isGroup('wavelet') || isGroup('tangent') ? 1 : 0.45}
              />

              {/* Shared Hypotenuse AC */}
              <line
                x1={A.x}
                y1={A.y}
                x2={C.x}
                y2={C.y}
                stroke="#0F172A"
                strokeWidth={current.step === 4 ? 3.2 : 2}
              />

              {/* Incident Wavefront AB */}
              <line
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="#0284C7"
                strokeWidth={isGroup('incident') ? 3 : 1.8}
              />

              {/* Segment BC = v1 dt */}
              <line
                x1={B.x}
                y1={B.y}
                x2={C.x}
                y2={C.y}
                stroke="#0284C7"
                strokeWidth={current.step === 2 || current.step === 4 ? 3 : 2}
                strokeDasharray={current.step === 1 ? '5 3' : undefined}
              />

              {/* Radius AD = v2 dt */}
              <line
                x1={A.x}
                y1={A.y}
                x2={D.x}
                y2={D.y}
                stroke="#D97706"
                strokeWidth={isGroup('wavelet') || current.step === 4 ? 3 : 2}
              />

              {/* Refracted Wavefront Tangent CD */}
              <line
                x1={D.x}
                y1={D.y}
                x2={C.x}
                y2={C.y}
                stroke="#059669"
                strokeWidth={isGroup('tangent') || current.step === 4 ? 3 : 1.8}
              />

              {/* Right angle mark at B */}
              <path
                d={`M ${B.x - 9} ${B.y + 8} L ${B.x - 1} ${B.y + 17} L ${B.x + 8} ${B.y + 9}`}
                fill="none"
                stroke="#0284C7"
                strokeWidth="1.5"
              />

              {/* Right angle mark at D */}
              <path
                d={`M ${D.x - 5} ${D.y - 10} L ${D.x + 5} ${D.y - 14} L ${D.x + 10} ${D.y - 5}`}
                fill="none"
                stroke="#059669"
                strokeWidth="1.5"
              />

              {/* Angle labels */}
              <text x={A.x + 42} y={A.y - 10} fontSize="13" fontWeight="700" fill="#0369A1" fontFamily="JetBrains Mono, monospace">
                θ₁
              </text>
              <text x={C.x - 66} y={C.y + 18} fontSize="13" fontWeight="700" fill="#047857" fontFamily="JetBrains Mono, monospace">
                θ₂
              </text>

              {/* Segment lengths */}
              <text x="330" y="112" fontSize="12" fontWeight="600" fill="#0369A1" fontFamily="JetBrains Mono, monospace">
                BC = v₁Δt
              </text>
              <text x="64" y="250" fontSize="12" fontWeight="600" fill="#B45309" fontFamily="JetBrains Mono, monospace">
                AD = v₂Δt
              </text>
              <text x="235" y="203" fontSize="11" fontWeight="600" fill="#334155" fontFamily="JetBrains Mono, monospace">
                {isZh ? '共有斜邊 AC' : 'Shared AC'}
              </text>

              {/* Vertex dots and labels */}
              {[
                { pt: A, label: 'A', dx: -14, dy: 4 },
                { pt: B, label: 'B', dx: 4, dy: -10 },
                { pt: C, label: 'C', dx: 12, dy: 4 },
                { pt: D, label: 'D', dx: -6, dy: 16 },
              ].map(({ pt, label, dx, dy }) => (
                <g key={label}>
                  <circle cx={pt.x} cy={pt.y} r="4.2" fill="#0F172A" />
                  <text
                    x={pt.x + dx}
                    y={pt.y + dy}
                    fontSize="13"
                    fontWeight="700"
                    fill="#0F172A"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="border-t border-slate-100 pt-3 font-mono text-xs font-semibold text-slate-800 text-center">
            {current.equation}
          </div>
        </div>

        {/* Right: 4 Clickable Derivation Steps */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-3">
          {PROOF_STEPS.map((item) => {
            const active = item.step === activeStep;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveStep(item.step)}
                className={`text-left rounded-xl border p-4 transition-colors focus-visible:outline-2 focus-visible:outline-sky-600 ${
                  active
                    ? 'border-sky-600 bg-sky-50/40'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1.5">
                  <span className="font-display text-sm font-bold text-slate-900">
                    {`0${item.step}. ${isZh ? item.titleZh : item.titleEn}`}
                  </span>
                  <span className="font-mono text-xs text-sky-700 whitespace-nowrap shrink-0">
                    {isZh ? `步驟 ${item.step}/4` : `Step ${item.step}/4`}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  {isZh ? item.explanationZh : item.explanationEn}
                </p>
                <p className="mt-2 font-mono text-xs font-semibold text-slate-800">
                  {item.equation}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
