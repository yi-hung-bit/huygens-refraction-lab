/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import { ControlDeck } from './components/ControlDeck';
import { ConceptCheck } from './components/ConceptCheck';
import { Header } from './components/Header';
import { HuygensCanvas } from './components/HuygensCanvas';
import { ProofWalkthrough } from './components/ProofWalkthrough';
import { VideoLessonSection } from './components/VideoLessonSection';
import { DEFAULT_PARAMS, YOUTUBE_WATCH_URL } from './data/opticsContent';
import {
  computeOpticsMetrics,
  LabPreset,
  Language,
  SimulationParams,
  SimulationStage,
  VisualLayers,
} from './types/optics';

const DEFAULT_LAYERS: VisualLayers = {
  showWavefronts: true,
  showWavelets: true,
  showRays: true,
  showGeometry: true,
};

export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [stage, setStage] = useState<SimulationStage>(3);
  const [layers, setLayers] = useState<VisualLayers>(DEFAULT_LAYERS);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activePresetId, setActivePresetId] = useState<string | null>('air-to-glass');

  const metrics = useMemo(() => computeOpticsMetrics(params), [params]);
  const isZh = lang === 'zh';

  const handleChangeParams = (next: Partial<SimulationParams>) => {
    setParams((prev) => ({ ...prev, ...next }));
    setActivePresetId(null);
  };

  const handleToggleLayer = (key: keyof VisualLayers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleResetLab = () => {
    setParams(DEFAULT_PARAMS);
    setStage(3);
    setLayers(DEFAULT_LAYERS);
    setIsPlaying(true);
    setActivePresetId('air-to-glass');
  };

  const handleApplyPreset = (preset: LabPreset) => {
    setParams(preset.params);
    setStage(preset.stage);
    setIsPlaying(true);
    setActivePresetId(preset.id);
    document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTestScenario = (scenarioParams: SimulationParams) => {
    setParams(scenarioParams);
    setStage(4);
    setLayers({
      showWavefronts: true,
      showWavelets: true,
      showRays: true,
      showGeometry: true,
    });
    setIsPlaying(true);
    setActivePresetId(null);
    document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header lang={lang} onReset={handleResetLab} />

      <main className="flex-1">
        {/* Primary Interactive Simulation Workspace */}
        <section
          id="simulator"
          className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8"
        >
          {/* Concise Hero Header */}
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{isZh ? '高中物理' : 'Wave Optics'}</span>
                <span aria-hidden="true">·</span>
                <span>{isZh ? '惠更斯原理與司乃耳定律' : 'Huygens’ Principle & Snell’s Law'}</span>
                <span aria-hidden="true">·</span>
                <span>STAG LAB</span>
              </div>
              <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
                {isZh
                  ? '為何惠更斯原理可以解釋折射定律？'
                  : 'How Huygens’ Principle Explains the Law of Refraction'}
              </h1>
            </div>

            <a
              href="#video-lesson"
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              {isZh ? '前往教學影片與預設實驗 →' : 'Jump to Video & Presets →'}
            </a>
          </div>

          {/* Two-Zone Sandbox Layout: Stage (65%) + Control Deck (35%) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-8">
              <HuygensCanvas
                lang={lang}
                params={params}
                metrics={metrics}
                stage={stage}
                layers={layers}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying((p) => !p)}
                onResetPlayback={() => setIsPlaying(true)}
                onStageChange={(nextStage) => setStage(nextStage)}
                onToggleLayer={handleToggleLayer}
              />
            </div>

            <div className="lg:col-span-4">
              <ControlDeck
                lang={lang}
                onToggleLanguage={setLang}
                params={params}
                metrics={metrics}
                stage={stage}
                onChangeParams={handleChangeParams}
              />
            </div>
          </div>
        </section>

        {/* Geometric Derivation Section */}
        <ProofWalkthrough lang={lang} />

        {/* Embedded YouTube Lesson + Presets */}
        <VideoLessonSection
          lang={lang}
          activePresetId={activePresetId}
          onApplyPreset={handleApplyPreset}
        />

        {/* Interactive Concept Check */}
        <ConceptCheck lang={lang} onTestScenario={handleTestScenario} />
      </main>

      {/* Quiet Attribution Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-xs text-slate-500 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700">
              {isZh ? '惠更斯折射實驗室' : 'Huygens Refraction Lab'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {isZh
                ? '依據 STAG LAB 高中物理教學影片製作之互動波前實驗平台'
                : 'Interactive wave-optics simulation companion to STAG LAB'}
            </span>
          </div>
          <a
            href={YOUTUBE_WATCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-600 hover:text-slate-900 hover:underline underline-offset-4"
          >
            {isZh ? '原始影片：YouTube (sDBAFWhPUZ4)' : 'Source Video: YouTube (sDBAFWhPUZ4)'}
          </a>
        </div>
      </footer>
    </div>
  );
}
