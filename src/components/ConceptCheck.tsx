import React, { useState } from 'react';
import { CheckCircle2, Play, RotateCcw, XCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/opticsContent';
import { Language, SimulationParams } from '../types/optics';

interface ConceptCheckProps {
  lang: Language;
  onTestScenario: (params: SimulationParams) => void;
}

export const ConceptCheck: React.FC<ConceptCheckProps> = ({ lang, onTestScenario }) => {
  const isZh = lang === 'zh';
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const answeredCount = Object.keys(answers).length;
  const correctCount = QUIZ_QUESTIONS.reduce((acc, q) => {
    return answers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const handleSelect = (questionId: string, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleResetQuiz = () => {
    setAnswers({});
  };

  return (
    <section
      id="concept-check"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-t border-slate-200"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-slate-500">
            {isZh ? '觀念即時檢測 · 高中物理波動光學' : 'Concept Check · Wave Optics Assessment'}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
            {isZh
              ? '檢驗你對惠更斯原理與折射機制的理解'
              : 'Test Your Mastery of Huygens’ Principle & Refraction'}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
            {isZh
              ? `答對 ${correctCount} / ${QUIZ_QUESTIONS.length} 題（已作答 ${answeredCount} 題）`
              : `Score: ${correctCount} / ${QUIZ_QUESTIONS.length} (${answeredCount} answered)`}
          </span>
          {answeredCount > 0 && (
            <button
              type="button"
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isZh ? '重新作答' : 'Reset Quiz'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {QUIZ_QUESTIONS.map((q, qIndex) => {
          const selected = answers[q.id];
          const hasAnswered = selected !== undefined;
          const isCorrect = selected === q.correctIndex;
          const options = isZh ? q.optionsZh : q.optionsEn;

          return (
            <article
              key={q.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5"
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="font-mono font-semibold text-slate-700">
                    {isZh ? `題目 0${qIndex + 1}` : `Question 0${qIndex + 1}`}
                  </span>
                  {hasAnswered && (
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        isCorrect ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>
                        {isCorrect
                          ? isZh
                            ? '觀念正確'
                            : 'Correct'
                          : isZh
                          ? '再想一想'
                          : 'Incorrect'}
                      </span>
                    </span>
                  )}
                </div>

                <h3 className="font-display text-sm font-bold leading-snug text-slate-900 mb-4">
                  {isZh ? q.promptZh : q.promptEn}
                </h3>

                <div className="flex flex-col gap-2">
                  {options.map((opt, idx) => {
                    const chosen = selected === idx;
                    const rightOpt = idx === q.correctIndex;

                    let styleClass =
                      'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';
                    if (hasAnswered) {
                      if (rightOpt) {
                        styleClass = 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-medium';
                      } else if (chosen && !rightOpt) {
                        styleClass = 'border-red-500 bg-red-50/60 text-red-900';
                      } else {
                        styleClass = 'border-slate-100 bg-slate-50/50 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelect(q.id, idx)}
                        className={`rounded-lg border px-3.5 py-2.5 text-left text-xs leading-relaxed transition-colors focus-visible:outline-2 focus-visible:outline-sky-600 ${styleClass}`}
                      >
                        <span className="mr-2 font-mono font-semibold">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {hasAnswered && (
                <div className="mt-4 border-t border-slate-100 pt-3.5">
                  <p className="text-xs leading-relaxed text-slate-600">
                    {isZh ? q.explanationZh : q.explanationEn}
                  </p>
                  <button
                    type="button"
                    onClick={() => onTestScenario(q.demoParams)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 whitespace-nowrap"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{isZh ? '在上方模擬器實測此情境' : 'Test this scenario in simulator'}</span>
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
