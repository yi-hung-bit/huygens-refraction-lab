import React from 'react';
import { AlertTriangle, CheckCircle2, Globe } from 'lucide-react';
import {
  Language,
  OpticsMetrics,
  SimulationParams,
  SimulationStage,
} from '../types/optics';
import { MEDIUM_PRESETS, STAGE_GUIDES } from '../data/opticsContent';

interface ControlDeckProps {
  lang: Language;
  onToggleLanguage: (lang: Language) => void;
  params: SimulationParams;
  metrics: OpticsMetrics;
  stage: SimulationStage;
  onChangeParams: (next: Partial<SimulationParams>) => void;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  lang,
  onToggleLanguage,
  params,
  metrics,
  stage,
  onChangeParams,
}) => {
  const isZh = lang === 'zh';
  const activeStage = STAGE_GUIDES.find((s) => s.stage === stage) ?? STAGE_GUIDES[0];

  const lhs = params.n1 * metrics.sinTheta1;
  const rhs =
    !metrics.isTotalInternalReflection && metrics.theta2Rad !== null
      ? params.n2 * Math.sin(metrics.theta2Rad)
      : null;

  return (
    <aside className="flex flex-col border border-slate-200 bg-white rounded-xl overflow-hidden">
      {/* Workspace Toolbar: Title + Language Switch */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/70 px-5 py-3">
        <h2 className="font-display text-sm font-semibold text-slate-900 whitespace-nowrap">
          {isZh ? '實驗參數控制盤' : 'Parameter Controls'}
        </h2>
        <div
          role="group"
          aria-label={isZh ? '語言切換' : 'Language selector'}
          className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 p-0.5"
        >
          <Globe className="ml-1.5 h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          <button
            type="button"
            onClick={() => onToggleLanguage('zh')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              lang === 'zh'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            繁中
          </button>
          <button
            type="button"
            onClick={() => onToggleLanguage('en')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              lang === 'en'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Sliders Section */}
      <div className="divide-y divide-slate-100 px-5">
        {/* Incident Angle */}
        <div className="py-4">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <label
              htmlFor="slider-theta1"
              className="text-xs font-semibold text-slate-700"
            >
              {isZh ? '入射角 θ₁' : 'Incident Angle θ₁'}
            </label>
            <span className="font-mono text-sm font-semibold text-sky-700 tabular-nums">
              {params.theta1Deg.toFixed(0)}°
            </span>
          </div>
          <input
            id="slider-theta1"
            type="range"
            min={5}
            max={80}
            step={1}
            value={params.theta1Deg}
            onChange={(e) => onChangeParams({ theta1Deg: Number(e.target.value) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-sky-600"
          />
          <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-400 tabular-nums">
            <span>5°</span>
            <span>45°</span>
            <span>80°</span>
          </div>
        </div>

        {/* Medium 1 Refractive Index */}
        <div className="py-4">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <label
              htmlFor="slider-n1"
              className="text-xs font-semibold text-slate-700"
            >
              {isZh ? '介質 1 折射率 n₁' : 'Medium 1 Index n₁'}
            </label>
            <span className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
              {params.n1.toFixed(2)}
            </span>
          </div>
          <input
            id="slider-n1"
            type="range"
            min={1.0}
            max={2.42}
            step={0.01}
            value={params.n1}
            onChange={(e) => onChangeParams({ n1: Number(e.target.value) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-sky-600"
          />
          <div className="mt-2.5 grid grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1">
            {MEDIUM_PRESETS.map((m) => {
              const active = Math.abs(params.n1 - m.n) < 0.015;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangeParams({ n1: m.n })}
                  className={`rounded-md px-1.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap truncate ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isZh ? m.labelZh : m.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Medium 2 Refractive Index */}
        <div className="py-4">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <label
              htmlFor="slider-n2"
              className="text-xs font-semibold text-slate-700"
            >
              {isZh ? '介質 2 折射率 n₂' : 'Medium 2 Index n₂'}
            </label>
            <span className="font-mono text-sm font-semibold text-emerald-700 tabular-nums">
              {params.n2.toFixed(2)}
            </span>
          </div>
          <input
            id="slider-n2"
            type="range"
            min={1.0}
            max={2.42}
            step={0.01}
            value={params.n2}
            onChange={(e) => onChangeParams({ n2: Number(e.target.value) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-emerald-600"
          />
          <div className="mt-2.5 grid grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1">
            {MEDIUM_PRESETS.map((m) => {
              const active = Math.abs(params.n2 - m.n) < 0.015;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangeParams({ n2: m.n })}
                  className={`rounded-md px-1.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap truncate ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isZh ? m.labelZh : m.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Playback Speed */}
        <div className="py-3.5">
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <label
              htmlFor="slider-speed"
              className="text-xs font-semibold text-slate-700"
            >
              {isZh ? '波前推進倍率' : 'Wavefront Speed'}
            </label>
            <span className="font-mono text-xs font-medium text-slate-700 tabular-nums">
              {params.speed.toFixed(2)}×
            </span>
          </div>
          <input
            id="slider-speed"
            type="range"
            min={0.25}
            max={2.0}
            step={0.25}
            value={params.speed}
            onChange={(e) => onChangeParams({ speed: Number(e.target.value) })}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-slate-700"
          />
        </div>
      </div>

      {/* Live Physics Telemetry Readout (Flat, hairline-divided, tabular numerals) */}
      <div className="border-t border-slate-200 bg-slate-50/50 px-5 py-4">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-700">
            {isZh ? '即時物理量測值' : 'Live Optical Readouts'}
          </span>
          {metrics.isTotalInternalReflection ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isZh ? '發生全反射' : 'Total Internal Reflection'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isZh ? '折射包絡成立' : 'Refraction Valid'}</span>
            </span>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-200 pt-2.5 text-xs">
          <div className="flex items-baseline justify-between">
            <dt className="text-slate-500">{isZh ? '折射角 θ₂' : 'Refracted θ₂'}</dt>
            <dd className="font-mono font-semibold text-slate-900 tabular-nums">
              {metrics.theta2Deg !== null ? `${metrics.theta2Deg.toFixed(1)}°` : '—'}
            </dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="text-slate-500">{isZh ? '臨界角 θc' : 'Critical θc'}</dt>
            <dd className="font-mono font-semibold text-slate-900 tabular-nums">
              {metrics.criticalAngleDeg !== null
                ? `${metrics.criticalAngleDeg.toFixed(1)}°`
                : '—'}
            </dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="text-slate-500">{isZh ? '波速比 v₁/v₂' : 'Speed v₁/v₂'}</dt>
            <dd className="font-mono font-semibold text-slate-900 tabular-nums">
              {(metrics.v1Ratio / metrics.v2Ratio).toFixed(2)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="text-slate-500">{isZh ? '波長比 λ₁/λ₂' : 'Wave λ₁/λ₂'}</dt>
            <dd className="font-mono font-semibold text-slate-900 tabular-nums">
              {metrics.wavelengthRatio.toFixed(2)}
            </dd>
          </div>
        </dl>

        <div className="mt-3 border-t border-slate-200 pt-2.5 font-mono text-xs text-slate-700 tabular-nums flex items-center justify-between">
          <span>n₁ sin θ₁ = {lhs.toFixed(3)}</span>
          <span className="text-slate-400">·</span>
          <span>
            n₂ sin θ₂ = {rhs !== null ? rhs.toFixed(3) : isZh ? '無實解 (> n₂)' : 'No real θ₂'}
          </span>
        </div>
      </div>

      {/* Stage-Synced Concept Callout */}
      <div className="border-t border-slate-200 px-5 py-4 bg-white">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
          <span>{isZh ? activeStage.shortLabelZh : activeStage.shortLabelEn}</span>
          <span className="font-mono text-sky-700">{activeStage.formulaText}</span>
        </div>
        <h3 className="font-display text-sm font-semibold text-slate-900 mb-1.5">
          {isZh ? activeStage.titleZh : activeStage.titleEn}
        </h3>
        <p className="text-xs leading-relaxed text-slate-600">
          {isZh ? activeStage.descriptionZh : activeStage.descriptionEn}
        </p>
      </div>
    </aside>
  );
};
