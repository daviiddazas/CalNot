import React, { useMemo } from 'react';
import { MathView } from './MathView';
import { Sparkles, AlertCircle } from 'lucide-react';
import { normalizeSuperscripts } from '../utils/algebra';

interface CalculatorScreenProps {
  expression: string;
  onChangeExpression: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSolve: () => void;
  errorMessage: string | null;
  onSelectExample: (expr: string) => void;
}

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({
  expression,
  onChangeExpression,
  inputRef,
  onSolve,
  errorMessage,
  onSelectExample,
}) => {
  // Generate KaTeX preview safely for display
  const previewLatex = useMemo(() => {
    const clean = normalizeSuperscripts(expression.trim());
    if (!clean) return '\\text{Escribe tu expresión o polinomio}';

    // If user typed a fraction:
    if (clean.includes('/')) {
      const parts = clean.split('/');
      const num = parts[0].trim().replace(/^\(|\)$/g, '') || '\\dots';
      const den = parts[1]?.trim().replace(/^\(|\)$/g, '') || '\\dots';
      return `\\frac{${num}}{${den}}`;
    }

    return clean;
  }, [expression]);

  const examples = [
    { label: '16x^4 - 81y^4', badge: 'Diferencia de Cuadrados / Potencias' },
    { label: '(16x^4 - 81y^4)/(2x - 3y)', badge: 'Simplificar por Factorización' },
    { label: 'x^2 - 9', badge: 'Diferencia Cuadrados' },
    { label: '8x^3 + 27y^3', badge: 'Suma de Cubos' },
    { label: '(x^3 - 8)/(x - 2)', badge: 'Fracción Cubos' },
    { label: 'x^2 + 5x + 6', badge: 'Trinomio x² + bx + c' },
    { label: 'x^2 - 6x + 9', badge: 'Trinomio Cuadrado Perfecto' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-700/90 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur">
      {/* Screen Frame Display: Clean White as requested ("solo la pantalla de factorización sea blanca") */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden text-slate-900 ring-4 ring-indigo-500/10">
        {/* Subtle grid pattern for mathematical paper feeling */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Header inside Display */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-2 relative z-10 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 text-indigo-700 font-bold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
            <span>PANTALLA DE FACTORIZACIÓN</span>
          </div>
          <span className="text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded text-[10px]">
            Casos de Álgebra
          </span>
        </div>

        {/* Live LaTeX Mathematical Render Area with Crisp Black Math Typography */}
        <div className="min-h-[72px] flex items-center justify-center py-2 text-slate-950 relative z-10 overflow-x-auto bg-slate-50/80 rounded-xl border border-slate-200/80 px-3 shadow-inner my-1">
          <MathView
            math={previewLatex}
            block
            className="text-xl sm:text-2xl font-semibold text-slate-950"
          />
        </div>

        {/* Raw Text Input Line with Cursor */}
        <div className="mt-3 pt-2 border-t border-slate-200 relative z-10">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Expresión algebraica activa:
          </label>
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={expression}
              onChange={(e) => onChangeExpression(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSolve();
                }
              }}
              placeholder="Escribe ej: 16x^4 - 81y^4 o (x^3 - 8)/(x - 2)"
              className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl px-4 py-2.5 text-slate-900 font-mono text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/20 tracking-wide shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Error Callout if any */}
      {errorMessage && (
        <div className="mt-3 p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-200 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Example Chips for Factoring */}
      <div className="mt-3.5 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ejercicios para factorizar (toca para probar):</span>
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Binomios, Trinomios y Fracciones
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {examples.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => onSelectExample(ex.label)}
              className="group flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/80 hover:bg-indigo-950/80 active:bg-indigo-900 border border-slate-700/80 hover:border-indigo-500/80 rounded-lg text-xs font-mono text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm"
            >
              <span>{ex.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-900 text-indigo-400 rounded font-sans group-hover:bg-indigo-900/80">
                {ex.badge}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
