import React from 'react';
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import {
  LAB_PRESETS,
  YOUTUBE_VIDEO_ID,
  YOUTUBE_WATCH_URL,
} from '../data/opticsContent';
import { LabPreset, Language } from '../types/optics';

interface VideoLessonSectionProps {
  lang: Language;
  activePresetId: string | null;
  onApplyPreset: (preset: LabPreset) => void;
}

export const VideoLessonSection: React.FC<VideoLessonSectionProps> = ({
  lang,
  activePresetId,
  onApplyPreset,
}) => {
  const isZh = lang === 'zh';

  return (
    <section
      id="video-lesson"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-t border-slate-200"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-slate-500">
            {isZh ? '原始課程影片 · STAG LAB 高中物理' : 'Source Video Lesson · STAG LAB'}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
            {isZh
              ? '為何惠更斯原理可以解釋折射定律？'
              : 'Why Huygens’ Principle Explains the Law of Refraction'}
          </h2>
        </div>

        <a
          href={YOUTUBE_WATCH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
        >
          <span>{isZh ? '在 YouTube 開啟原片' : 'Open on YouTube'}</span>
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
        {/* Left: Embedded 16:9 YouTube Video */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="aspect-video w-full bg-slate-900">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0`}
              title={
                isZh
                  ? '為何惠更斯原理可以解釋折射定律？ #高中物理 — STAG LAB'
                  : 'Why Huygens’ Principle Explains Refraction — STAG LAB'
              }
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-3.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">STAG LAB</span>
              <span aria-hidden="true">·</span>
              <span>{isZh ? '高中物理波動光學' : 'High School Wave Optics'}</span>
            </div>
            <span className="font-mono text-slate-500">youtube.com/watch?v={YOUTUBE_VIDEO_ID}</span>
          </div>
        </div>

        {/* Right: One-Click Lab Presets synced to the video's physical scenarios */}
        <div className="lg:col-span-5 flex flex-col rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-3 pb-3 border-b border-slate-100">
            <h3 className="font-display text-base font-bold text-slate-900">
              {isZh ? '影片對照實驗預設組' : 'Video-Aligned Lab Presets'}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {isZh
                ? '點選任一物理情境，立即將對應角度與折射率載入上方惠更斯波前模擬器。'
                : 'Select any scenario below to load its exact angle and refractive indices into the wavefront simulator above.'}
            </p>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-2.5">
            {LAB_PRESETS.map((preset) => {
              const active = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onApplyPreset(preset)}
                  className={`group flex flex-col items-start rounded-lg border px-3.5 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-sky-600 ${
                    active
                      ? 'border-sky-600 bg-sky-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {isZh ? preset.titleZh : preset.titleEn}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-sky-700 whitespace-nowrap shrink-0">
                      <SlidersHorizontal className="h-3 w-3" aria-hidden="true" />
                      <span>
                        θ₁={preset.params.theta1Deg}° · {preset.params.n1.toFixed(2)}→
                        {preset.params.n2.toFixed(2)}
                      </span>
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                    {isZh ? preset.summaryZh : preset.summaryEn}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
