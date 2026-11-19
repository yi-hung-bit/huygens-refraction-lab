import React from 'react';
import { Language } from '../types/optics';

interface HeaderProps {
  lang: Language;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, onReset }) => {
  const isZh = lang === 'zh';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#simulator"
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          {isZh ? '惠更斯折射實驗室' : 'Huygens Optics Lab'}
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label={isZh ? '頁面導覽' : 'Page navigation'}
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <a
            href="#simulator"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {isZh ? '波前模擬' : 'Simulation'}
          </a>
          <a
            href="#derivation"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {isZh ? '幾何推導' : 'Proof'}
          </a>
          <a
            href="#video-lesson"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {isZh ? '教學影片' : 'Video Lesson'}
          </a>
          <a
            href="#concept-check"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {isZh ? '觀念檢測' : 'Concept Check'}
          </a>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 whitespace-nowrap shrink-0"
          >
            {isZh ? '重設實驗' : 'Reset Lab'}
          </button>
        </div>
      </div>
    </header>
  );
};
