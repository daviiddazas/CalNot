import React from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { FactorizationResult } from '../types/factorization';
import { MathView } from './MathView';

interface FactorizationViewProps {
  result: FactorizationResult;
  onCopy: () => void;
  copied: boolean;
}

export const FactorizationView: React.FC<FactorizationViewProps> = ({
  result,
  onCopy,
  copied,
}) => {
  const {
    rawInput,
    isFraction,
    numeratorStr,
    denominatorStr,
    caseName,
    caseRuleFormula,
    baseA,
    baseB,
    exponentN,
    steps,
    factoredNumeratorLatex,
    cancellationLatex,
    finalResultLatex,
    pedagogicalNote,
    verificationLatex,
  } = result;

  return (
    <div className="space-y-6">
      {/* 1. Identification Box */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-950/70 border border-indigo-700/60 rounded-xl text-indigo-400">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block">
                Solución por Factorización
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {caseName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-950/70 border border-emerald-700/70 text-emerald-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Factorización Exacta</span>
            </span>
            <button
              onClick={onCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-xs text-slate-200 font-semibold rounded-lg border border-slate-700 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Solución</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Formula Rule Banner */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase block mb-1">
              Fórmula y Regla del Caso de Factorización:
            </span>
            <div className="text-base text-indigo-200">
              <MathView math={caseRuleFormula} />
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 font-mono">
            {exponentN ? `Potencia n = ${exponentN}` : 'Grado 2'} · Bases identif.:{' '}
            <strong className="text-white">A = {baseA}</strong>,{' '}
            <strong className="text-white">B = {baseB}</strong>
          </div>
        </div>

        {/* Summary grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 uppercase font-semibold block mb-1">
              Expresión Original a Factorizar / Simplificar:
            </span>
            <div className="text-sm text-white py-1">
              <MathView
                math={
                  isFraction
                    ? `\\frac{${numeratorStr}}{${denominatorStr || '1'}}`
                    : numeratorStr
                }
              />
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
            <span className="text-emerald-400 uppercase font-semibold block mb-1">
              Resultado de la Factorización:
            </span>
            <div className="text-sm text-white py-1">
              <MathView math={factoredNumeratorLatex} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Step-by-Step Factoring Process */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">📐</span>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Desglose Paso a Paso de la Factorización
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {steps.length} pasos detallados
          </span>
        </div>

        <div className="space-y-3.5">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-900/60 border border-indigo-700 text-indigo-300 text-xs font-bold flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-white">
                    {step.title}
                  </h4>
                </div>

                {step.highlight && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 font-mono">
                    {step.highlight}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line pl-8">
                {step.description}
              </p>

              <div className="ml-8 bg-slate-900/80 p-3 rounded-lg border border-slate-800 overflow-x-auto text-left">
                <MathView math={step.mathLatex} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Final Result Box with Cancellation Highlight */}
      <section className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-900/70 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              {isFraction ? 'Resultado Simplificado por Factorización' : 'Polinomio Factorizado Totalmente'}
            </h3>
          </div>
          <span className="text-xs text-indigo-300 font-medium">Solución Final</span>
        </div>

        {/* Big Final Display */}
        <div className="bg-slate-950 p-5 rounded-xl border border-indigo-800/80 text-center">
          <span className="text-xs text-slate-400 block mb-1">
            {isFraction ? 'Cociente después de simplificar factores idénticos:' : 'Producto de factores irreducibles:'}
          </span>
          <div className="text-lg sm:text-xl py-2 font-bold text-emerald-300">
            <MathView math={finalResultLatex} block />
          </div>
        </div>

        {/* Pedagogical Note */}
        <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
          <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Fundamento Pedagógico:</strong>{' '}
            {pedagogicalNote}
          </div>
        </div>

        {/* Verification Check */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Comprobación por multiplicación de factores:</span>
          </span>
          <div className="font-mono text-slate-200">
            <MathView math={verificationLatex} />
          </div>
        </div>
      </section>
    </div>
  );
};
