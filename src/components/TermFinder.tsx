import React, { useState } from 'react';
import { Calculator, Target, Zap, Hash, Layers } from 'lucide-react';
import { QuotientResolution } from '../types/math';
import { MathView } from './MathView';

interface TermFinderProps {
  resolution: QuotientResolution;
}

export const TermFinder: React.FC<TermFinderProps> = ({ resolution }) => {
  const { numTerms, spec, terms, isValid } = resolution;
  const [targetK, setTargetK] = useState<number>(Math.min(3, numTerms));

  const safeK = Math.max(1, Math.min(targetK, numTerms));
  const term = terms.find((t) => t.k === safeK) || terms[0];

  // Sign explanation
  const signExplanation =
    spec.denSign === '-'
      ? 'Como el divisor es (a - b), TODOS los términos son POSITIVOS (+).'
      : `Como el divisor es (a + b), el signo depende de la paridad de k: (-1)^{k-1} = (-1)^{${
          safeK - 1
        }} = ${term.sign} (${safeK % 2 === 1 ? 'k es impar ⇒ +' : 'k es par ⇒ -'}).`;

  // Central terms calculation
  const isOddTerms = numTerms % 2 === 1;
  const centralK1 = isOddTerms ? (numTerms + 1) / 2 : numTerms / 2;
  const centralK2 = isOddTerms ? null : numTerms / 2 + 1;

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 sm:p-6 backdrop-blur shadow-lg space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
        <div>
          <span className="text-xs uppercase font-semibold text-indigo-400 tracking-wider">
            Cálculo Directo de Término General
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            Calculadora del Término de Lugar k (Tₖ)
          </h2>
        </div>
        <div className="bg-slate-900 border border-slate-700/80 px-3 py-1 rounded-lg text-xs font-mono text-slate-300">
          Total de términos: <strong className="text-indigo-400">n = {numTerms}</strong>
        </div>
      </div>

      {/* Formula banner */}
      <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-xl p-4 sm:p-5 text-center">
        <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wide block mb-1">
          Fórmula Universal del Término de Lugar k
        </span>
        <div className="text-lg py-2">
          <MathView math="T_k = (\text{signo}) \\cdot a^{\\,n - k} \\cdot b^{\\,k - 1}" block />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-indigo-900/60 text-xs text-slate-300 text-left">
          <div>
            <strong className="text-indigo-300">1. Signo:</strong> Si divisor es (a - b) siempre +;
            si divisor es (a + b), (-1)^{'{k-1}'}.
          </div>
          <div>
            <strong className="text-indigo-300">2. Base a:</strong> Disminuye con exponente{' '}
            <code className="text-indigo-200 font-mono">n - k</code>.
          </div>
          <div>
            <strong className="text-indigo-300">3. Base b:</strong> Aumenta con exponente{' '}
            <code className="text-purple-200 font-mono">k - 1</code>.
          </div>
        </div>
      </div>

      {/* Selector of k */}
      <div className="bg-slate-900/70 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="text-xs font-medium text-slate-300">
            Selecciona la posición <strong className="text-white font-mono">k</strong> a calcular
            (1 ≤ k ≤ {numTerms}):
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Atajos útiles:</span>
            <button
              onClick={() => setTargetK(1)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded border border-slate-700 transition-colors"
            >
              T₁ (Primero)
            </button>
            <button
              onClick={() => setTargetK(centralK1)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded border border-slate-700 transition-colors"
            >
              T_{centralK1} (Central)
            </button>
            <button
              onClick={() => setTargetK(numTerms)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded border border-slate-700 transition-colors"
            >
              T_{numTerms} (Último)
            </button>
          </div>
        </div>

        {/* Range slider & Number input */}
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={numTerms}
            value={safeK}
            onChange={(e) => setTargetK(parseInt(e.target.value, 10))}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="w-16">
            <input
              type="number"
              min={1}
              max={numTerms}
              value={safeK}
              onChange={(e) => setTargetK(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 px-2 text-center text-sm font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Result Card for Tk */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-5 sm:p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Resultado para el Término T_{safeK}
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-0.5 bg-emerald-950/60 border border-emerald-700/60 rounded">
            T_{safeK} = {term.sign} {term.simplifiedLatex}
          </span>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2.5">
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                Regla de Signo Aplicada:
              </span>
              <p className="text-slate-200 mt-1 leading-relaxed">{signExplanation}</p>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                Exponente para Base a ({spec.baseA}):
              </span>
              <span className="font-mono text-indigo-300">
                n - k = {numTerms} - {safeK} = {term.expA}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                Exponente para Base b ({spec.baseB}):
              </span>
              <span className="font-mono text-purple-300">
                k - 1 = {safeK} - 1 = {term.expB}
              </span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2.5">
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                Sustitución en la Fórmula:
              </span>
              <div className="text-sm py-1">
                <MathView math={`T_{${safeK}} = ${term.substitutionLatex}`} />
              </div>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                Evaluación Intermedia:
              </span>
              <div className="text-sm py-1">
                <MathView math={`= ${term.intermediateLatex}`} />
              </div>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                Término Totalmente Simplificado:
              </span>
              <div className="text-base font-bold text-emerald-300 py-1">
                <MathView math={`= ${term.sign} ${term.simplifiedLatex}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Extra examination insights */}
        <div className="p-3.5 bg-indigo-950/30 border border-indigo-900/60 rounded-lg flex items-center justify-between text-xs text-slate-300">
          <span>
            💡 <strong>Término equidistante desde el final:</strong> Corresponde a{' '}
            <code className="text-indigo-300 font-mono">T'_{safeK} = T_{numTerms - safeK + 1}</code>
          </span>
          <span className="font-mono text-indigo-200">
            {terms[numTerms - safeK]
              ? `Valor: ${terms[numTerms - safeK].sign} ${terms[numTerms - safeK].simplifiedLatex}`
              : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
