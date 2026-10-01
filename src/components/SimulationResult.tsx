import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Copy,
  Check,
  Calculator,
  ArrowRight,
  Info,
} from 'lucide-react';
import { QuotientResolution } from '../types/math';
import { MathView } from './MathView';

interface SimulationResultProps {
  resolution: QuotientResolution;
  onCopyMarkdown: () => void;
  copied: boolean;
}

export const SimulationResult: React.FC<SimulationResultProps> = ({
  resolution,
  onCopyMarkdown,
  copied,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [highlightedTerm, setHighlightedTerm] = useState<number | null>(null);

  const {
    spec,
    identifiedCase,
    caseName,
    isValid,
    validityCondition,
    remainderExplanation,
    numTerms,
    signPatternDescription,
    theoreticalSchemeLatex,
    terms,
    finalPolynomialLatex,
    standardFormLatex,
    question,
  } = resolution;

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);
  };

  const resetQuestion = () => {
    setSelectedOption(null);
    setHasAnswered(false);
  };

  // Case Badge & Styling
  const getCaseBadge = () => {
    if (!isValid) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/70 border border-rose-700/80 text-rose-300">
          <XCircle className="w-3.5 h-3.5" />
          <span>{caseName}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 border border-emerald-700/80 text-emerald-300">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>{caseName}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Box: SIMULADOR DE COCIENTES NOTABLES */}
      <section className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 sm:p-6 backdrop-blur shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧮</span>
            <h2 className="text-base font-bold text-white tracking-wide uppercase">
              Simulador de Cocientes Notables
            </h2>
          </div>
          <div>{getCaseBadge()}</div>
        </div>

        {/* Structured bullet list as specified */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 block mb-0.5">
                Expresión Ingresada:
              </span>
              <span className="font-mono text-white text-sm bg-slate-950/80 px-2 py-1 rounded inline-block">
                {spec.rawInput}
              </span>
            </div>

            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 block mb-0.5">
                Forma Estándar Identificada:
              </span>
              <div className="text-white py-1">
                <MathView math={standardFormLatex} />
              </div>
              <div className="text-xs text-indigo-300 font-mono mt-1">
                con a = {spec.baseA}, b = {spec.baseB}, n = {spec.n}
              </div>
            </div>

            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 block mb-0.5">
                Número de Términos:
              </span>
              <span className="font-mono text-white text-sm">
                n = {numTerms} {isValid && '(T₁ a T' + numTerms + ')'}
              </span>
            </div>
          </div>

          <div className="space-y-3 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 block mb-0.5">
                Caso Aplicado:
              </span>
              <span className="font-semibold text-white">{caseName}</span>
            </div>

            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 block mb-0.5">
                Condición de Validez:
              </span>
              <p
                className={`text-xs leading-relaxed ${
                  isValid ? 'text-emerald-300' : 'text-rose-300 font-medium'
                }`}
              >
                {validityCondition}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 block mb-0.5">
                Regla de Signos:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {signPatternDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Warning Callout when invalid (Caso 4 or parity restriction violated) */}
        {!isValid && remainderExplanation && (
          <div className="mt-4 p-4 bg-rose-950/40 border border-rose-800/80 rounded-lg text-rose-200 text-xs sm:text-sm flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-rose-300 block">
                Advertencia de No Validez / Residuo No Nulo
              </span>
              <p className="leading-relaxed">{remainderExplanation}</p>
            </div>
          </div>
        )}
      </section>

      {/* 2. Step-by-Step Breakdown: DESGLOSE PASO A PASO */}
      <section className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 sm:p-6 backdrop-blur shadow-lg">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="text-xl">📐</span>
            <h2 className="text-base font-bold text-white tracking-wide uppercase">
              Desglose Paso a Paso
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Fórmula del término general: <code className="text-indigo-300 font-mono">T_k = (signo) · a^(n-k) · b^(k-1)</code>
          </span>
        </div>

        {/* 1. Theoretical Scheme */}
        <div className="mb-6 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
          <h3 className="text-xs font-semibold uppercase text-indigo-400 mb-2">
            1. Esquema Teórico General:
          </h3>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
            <MathView math={theoreticalSchemeLatex} block />
          </div>
        </div>

        {/* 2. Term by Term Calculation */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase text-indigo-400">
              2. Cálculo Término a Término (T₁ a T{numTerms}):
            </h3>
            <span className="text-[11px] text-slate-400">
              Haz clic en cualquier término para resaltarlo
            </span>
          </div>

          <div className="space-y-2.5">
            {terms.map((term) => {
              const isHighlighted = highlightedTerm === term.k;
              return (
                <div
                  key={term.k}
                  onClick={() => setHighlightedTerm(isHighlighted ? null : term.k)}
                  className={`cursor-pointer p-3 sm:p-3.5 rounded-lg border transition-all ${
                    isHighlighted
                      ? 'bg-indigo-950/60 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-indigo-900/40 text-indigo-300 border border-indigo-700/50">
                        k = {term.k}
                      </span>
                      <span className="text-slate-400">
                        Signo: <strong className="text-white font-mono">{term.sign}</strong>
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">
                        Potencia de a: <span className="text-indigo-300 font-mono">n - k = {term.expA}</span>
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">
                        Potencia de b: <span className="text-purple-300 font-mono">k - 1 = {term.expB}</span>
                      </span>
                    </div>

                    <div className="text-xs font-mono font-semibold text-emerald-400">
                      T_{term.k} = {term.sign} {term.simplifiedLatex}
                    </div>
                  </div>

                  {/* Math calculation line */}
                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80 overflow-x-auto text-left">
                    <MathView
                      math={`T_{${term.k}} = ${term.substitutionLatex} = ${term.intermediateLatex} = ${term.sign} ${term.simplifiedLatex}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Final Polynomial: RESULTADO FINAL RECOGIDO */}
      <section className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 sm:p-6 backdrop-blur shadow-lg">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <h2 className="text-base font-bold text-white tracking-wide uppercase">
              Resultado Final Recogido
            </h2>
          </div>
          <button
            onClick={onCopyMarkdown}
            className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar Expresión'}</span>
          </button>
        </div>

        <div className="bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-inner">
          <span className="text-xs text-slate-500 font-semibold block mb-1">
            Polinomio Resultante Totalmente Simplificado:
          </span>
          <div className="text-lg py-2">
            <MathView math={finalPolynomialLatex} block />
          </div>
        </div>

        {/* Term Chips Inspector */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-400 block mb-2">
            Términos desglosados ({numTerms} en total):
          </span>
          <div className="flex flex-wrap gap-2">
            {terms.map((t) => (
              <button
                key={t.k}
                onClick={() => setHighlightedTerm(highlightedTerm === t.k ? null : t.k)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                  highlightedTerm === t.k
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-indigo-400 font-bold mr-1">T_{t.k}:</span>
                {t.sign} {t.simplifiedLatex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Checking Question: PREGUNTA COMPROBATORIA */}
      <section className="bg-indigo-950/30 border border-indigo-800/60 rounded-xl p-5 sm:p-6 backdrop-blur shadow-lg">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-indigo-900/50">
          <span className="text-xl">🎯</span>
          <h2 className="text-base font-bold text-white tracking-wide uppercase">
            Pregunta Comprobatoria Interactiva
          </h2>
        </div>

        <p className="text-sm font-medium text-slate-200 mb-4 leading-relaxed">
          {question.prompt}
        </p>

        {/* Options grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {question.options.map((opt, idx) => {
            const isCorrect = idx === question.correctIndex;
            const isSelected = selectedOption === idx;

            let btnStyle =
              'bg-slate-900/80 border-slate-700 hover:border-indigo-500 text-slate-200';
            if (hasAnswered) {
              if (isCorrect) {
                btnStyle =
                  'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
              } else if (isSelected) {
                btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200 ring-1 ring-rose-500';
              } else {
                btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={hasAnswered}
                className={`p-3.5 rounded-lg border text-left font-mono text-sm transition-all flex items-center justify-between ${btnStyle}`}
              >
                <MathView math={opt} />
                {hasAnswered && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback explanation */}
        {hasAnswered && (
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-lg space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              {selectedOption === question.correctIndex ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                    ¡Correcto! Excelente deducción
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    Respuesta Incorrecta
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {question.explanation}
            </p>
            <div className="pt-2">
              <button
                onClick={resetQuestion}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Intentar responder de nuevo
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
