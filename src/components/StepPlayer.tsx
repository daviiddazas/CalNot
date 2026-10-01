import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { QuotientResolution } from '../types/math';
import { MathView } from './MathView';

interface StepPlayerProps {
  resolution: QuotientResolution;
}

export const StepPlayer: React.FC<StepPlayerProps> = ({ resolution }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { numTerms, terms, spec, finalPolynomialLatex } = resolution;

  useEffect(() => {
    // Reset step when expression changes
    setCurrentStep(1);
    setIsPlaying(false);
  }, [resolution]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= numTerms) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, numTerms]);

  const activeTerm = terms.find((t) => t.k === currentStep) || terms[0];

  const handleNext = () => {
    if (currentStep < numTerms) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setIsPlaying(false);
  };

  // Build polynomial up to current step
  const partialPolynomial = terms
    .slice(0, currentStep)
    .map((t, idx) => (idx === 0 && t.sign === '+' ? t.simplifiedLatex : `${t.sign} ${t.simplifiedLatex}`))
    .join(' ');

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 sm:p-6 backdrop-blur shadow-lg space-y-6">
      {/* Title & Player Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
        <div>
          <span className="text-xs uppercase font-semibold text-indigo-400 tracking-wider">
            Modo Interactivo Guiado
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            Desarrollo Dinámico Término a Término
          </h2>
        </div>

        {/* Playback Button Deck */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-xl">
          <button
            onClick={handleReset}
            title="Volver al primer término"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrev}
            disabled={currentStep <= 1}
            title="Término anterior"
            className="p-2 text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent hover:bg-slate-800 rounded-lg transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-all shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Animar</span>
              </>
            )}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep >= numTerms}
            title="Término siguiente"
            className="p-2 text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent hover:bg-slate-800 rounded-lg transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Scrub Bar */}
      <div>
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-slate-400">Progreso del Cociente:</span>
          <span className="font-mono font-bold text-indigo-300">
            Término {currentStep} de {numTerms} ({Math.round((currentStep / numTerms) * 100)}%)
          </span>
        </div>

        {/* Steps scrubber pills */}
        <div className="grid grid-flow-col auto-cols-fr gap-1 sm:gap-2">
          {terms.map((t) => (
            <button
              key={t.k}
              onClick={() => {
                setCurrentStep(t.k);
                setIsPlaying(false);
              }}
              className={`py-2 px-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                t.k === currentStep
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                  : t.k < currentStep
                  ? 'bg-slate-900 border border-slate-700 text-indigo-300'
                  : 'bg-slate-900/40 border border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              T_{t.k}
            </button>
          ))}
        </div>
      </div>

      {/* Active Term Focus Stage */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-5 sm:p-6 shadow-inner space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg font-mono">
              Término T_{activeTerm.k}
            </span>
            <span className="text-xs text-slate-400">
              Lugar k = <strong className="text-white font-mono">{activeTerm.k}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-indigo-300">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>
                Exp. de a (n - k) = <strong>{activeTerm.expA}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-300">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                Exp. de b (k - 1) = <strong>{activeTerm.expB}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 3 Step Breakdown inside the Term */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Step A: Sign & Substitution */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
              Paso 1: Sustitución en T_k
            </span>
            <div className="text-sm py-2">
              <MathView math={activeTerm.substitutionLatex} />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Signo ({activeTerm.sign}) determinado por la posición k={activeTerm.k}.
            </p>
          </div>

          {/* Step B: Exponent Calculation */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
              Paso 2: Potencias Desarrolladas
            </span>
            <div className="text-sm py-2">
              <MathView math={activeTerm.intermediateLatex} />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Potencia de ({spec.baseA})^{activeTerm.expA} y ({spec.baseB})^{activeTerm.expB}.
            </p>
          </div>

          {/* Step C: Final Simplified Term */}
          <div className="bg-slate-950 p-4 rounded-lg border border-indigo-900/60 bg-gradient-to-br from-indigo-950/20 to-transparent">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase block mb-1">
              Paso 3: Monomio Reducido
            </span>
            <div className="text-base py-2 text-emerald-300 font-bold">
              <MathView math={`${activeTerm.sign} ${activeTerm.simplifiedLatex}`} />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Multiplicación de coeficientes y sumatoria de potencias.
            </p>
          </div>
        </div>

        {/* Law of Exponents Diagram */}
        <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-300">
            <strong>Ley de los Exponentes:</strong> A medida que avanzamos, la potencia de la primera
            base disminuye de {numTerms - 1} a 0, mientras que la potencia de la segunda base aumenta
            de 0 a {numTerms - 1}.
          </div>
          <div className="font-mono text-indigo-300 text-xs shrink-0">
            (a^{activeTerm.expA}) · (b^{activeTerm.expB})
          </div>
        </div>
      </div>

      {/* Partial Polynomial Accumulated */}
      <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-slate-400 uppercase font-semibold">
            Polinomio Construido Hasta T_{currentStep}:
          </span>
          {currentStep === numTerms && (
            <span className="text-xs font-bold text-emerald-400">
              ¡Desarrollo Completo!
            </span>
          )}
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm overflow-x-auto">
          <MathView
            math={
              partialPolynomial +
              (currentStep < numTerms ? ` + \\dots (${numTerms - currentStep} restantes)` : '')
            }
          />
        </div>
      </div>
    </div>
  );
};
