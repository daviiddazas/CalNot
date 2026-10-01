import React, { useState } from 'react';
import { Sliders, Keyboard, Bookmark, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { QuotientSpec } from '../types/math';
import { parseAlgebraicQuotient, parseMonomial } from '../utils/algebra';
import { PRESET_EXAMPLES, PresetItem } from '../utils/presets';
import { MathView } from './MathView';

interface ExpressionInputProps {
  currentSpec: QuotientSpec;
  onSpecChange: (spec: QuotientSpec) => void;
}

export const ExpressionInput: React.FC<ExpressionInputProps> = ({
  currentSpec,
  onSpecChange,
}) => {
  const [mode, setMode] = useState<'visual' | 'text' | 'presets'>('visual');
  const [textInput, setTextInput] = useState<string>('(16x^4 - 81y^4)/(2x - 3y)');
  const [parseError, setParseError] = useState<string | null>(null);

  // Quick case selector for visual mode
  const handleQuickCase = (numSign: '+' | '-', denSign: '+' | '-', forceEvenOdd?: 'even' | 'odd') => {
    let newN = currentSpec.n;
    if (forceEvenOdd === 'even' && newN % 2 !== 0) newN = 4;
    if (forceEvenOdd === 'odd' && newN % 2 === 0) newN = 5;

    onSpecChange({
      ...currentSpec,
      numSign,
      denSign,
      n: newN,
      rawInput: `(${currentSpec.baseA}^${newN} ${numSign} ${currentSpec.baseB}^${newN})/(${currentSpec.baseA} ${denSign} ${currentSpec.baseB})`,
    });
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParseError(null);
    const res = parseAlgebraicQuotient(textInput);
    if (res.success && res.spec) {
      onSpecChange(res.spec);
    } else {
      setParseError(res.error || 'No se pudo normalizar la expresión');
    }
  };

  const handlePresetSelect = (preset: PresetItem) => {
    setTextInput(preset.spec.rawInput);
    onSpecChange(preset.spec);
    setParseError(null);
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 sm:p-6 backdrop-blur shadow-lg">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-700/60">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">
            Entrada de Expresión
          </span>
          <h2 className="text-base font-semibold text-white mt-0.5">
            Configurar Cociente Notable
          </h2>
        </div>

        {/* Clean segmented control */}
        <div className="flex items-center p-1 bg-slate-900/80 rounded-lg border border-slate-700/70">
          <button
            onClick={() => setMode('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === 'visual'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Constructor Visual</span>
          </button>
          <button
            onClick={() => setMode('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === 'text'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Entrada Libre</span>
          </button>
          <button
            onClick={() => setMode('presets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === 'presets'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Ejemplos</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Visual Builder */}
      {mode === 'visual' && (
        <div className="space-y-5">
          {/* Quick 4-case selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Selección Rápida de Casos Base:
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickCase('-', '-')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  currentSpec.numSign === '-' && currentSpec.denSign === '-'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                    : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-semibold text-emerald-400">Caso 1: (-) / (-)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Siempre válido (todo n)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickCase('-', '+', 'even')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  currentSpec.numSign === '-' && currentSpec.denSign === '+'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                    : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-semibold text-blue-400">Caso 2: (-) / (+)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Válido si n es PAR</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickCase('+', '+', 'odd')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  currentSpec.numSign === '+' && currentSpec.denSign === '+'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                    : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-semibold text-purple-400">Caso 3: (+) / (+)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Válido si n es IMPAR</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickCase('+', '-')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  currentSpec.numSign === '+' && currentSpec.denSign === '-'
                    ? 'border-rose-500 bg-rose-950/40 text-white ring-1 ring-rose-500'
                    : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-semibold text-rose-400">Caso 4: (+) / (-)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">NUNCA válido (deja residuo)</div>
              </button>
            </div>
          </div>

          {/* Parameters grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Base A */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Base del 1.ᵉʳ término (a)
              </label>
              <input
                type="text"
                value={currentSpec.baseA}
                onChange={(e) => {
                  const val = e.target.value.trim() || 'x';
                  onSpecChange({
                    ...currentSpec,
                    baseA: val,
                    parsedA: parseMonomial(val),
                  });
                }}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="ej. 2x, x^2, a"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Ejemplos: 2x, x, 3a², 4m</span>
            </div>

            {/* Base B */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Base del 2.º término (b)
              </label>
              <input
                type="text"
                value={currentSpec.baseB}
                onChange={(e) => {
                  const val = e.target.value.trim() || 'y';
                  onSpecChange({
                    ...currentSpec,
                    baseB: val,
                    parsedB: parseMonomial(val),
                  });
                }}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="ej. 3y, 2, y^3, 1"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Ejemplos: 3y, 2, y, 1</span>
            </div>

            {/* Exponent n Slider */}
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Exponente común / Términos (n):
                </label>
                <span className="text-xs font-bold font-mono px-2 py-0.5 bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 rounded">
                  n = {currentSpec.n} ({currentSpec.n % 2 === 0 ? 'PAR' : 'IMPAR'})
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={10}
                value={currentSpec.n}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  onSpecChange({
                    ...currentSpec,
                    n,
                  });
                }}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>
          </div>

          {/* Signs manual selector */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Signo Numerador:</span>
              <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 p-0.5">
                <button
                  type="button"
                  onClick={() => onSpecChange({ ...currentSpec, numSign: '-' })}
                  className={`px-3 py-1 text-xs font-bold rounded ${
                    currentSpec.numSign === '-'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  − (Resta)
                </button>
                <button
                  type="button"
                  onClick={() => onSpecChange({ ...currentSpec, numSign: '+' })}
                  className={`px-3 py-1 text-xs font-bold rounded ${
                    currentSpec.numSign === '+'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  + (Suma)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Signo Denominador:</span>
              <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 p-0.5">
                <button
                  type="button"
                  onClick={() => onSpecChange({ ...currentSpec, denSign: '-' })}
                  className={`px-3 py-1 text-xs font-bold rounded ${
                    currentSpec.denSign === '-'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  − (Resta)
                </button>
                <button
                  type="button"
                  onClick={() => onSpecChange({ ...currentSpec, denSign: '+' })}
                  className={`px-3 py-1 text-xs font-bold rounded ${
                    currentSpec.denSign === '+'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  + (Suma)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Freeform Text Input */}
      {mode === 'text' && (
        <form onSubmit={handleTextSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Escribe la expresión algebraica (se normalizarán automáticamente bases y exponente):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="ej. (16x^4 - 81y^4)/(2x - 3y) o (x^5 + 32)/(x + 2)"
                className="flex-1 bg-slate-900/90 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                <span>Analizar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Formatos soportados: <code className="text-indigo-300">(A ± B)/(a ± b)</code> o LaTeX{' '}
              <code className="text-indigo-300">\frac{'{A \\pm B}'}{'{a \\pm b}'}</code>.
            </p>
          </div>

          {parseError && (
            <div className="flex items-center gap-2 p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Quick presets pills for freeform */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Prueba rápida:</span>
            {[
              '(16x^4 - 81y^4)/(2x - 3y)',
              '(x^5 + 32)/(x + 2)',
              '(x^6 - y^6)/(x + y)',
              '(x^4 + y^4)/(x - y)',
              '(x^20 - y^30)/(x^4 - y^6)',
            ].map((expr) => (
              <button
                key={expr}
                type="button"
                onClick={() => {
                  setTextInput(expr);
                  const res = parseAlgebraicQuotient(expr);
                  if (res.success && res.spec) {
                    onSpecChange(res.spec);
                    setParseError(null);
                  }
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-300 font-mono text-[11px] rounded transition-colors"
              >
                {expr}
              </button>
            ))}
          </div>
        </form>
      )}

      {/* Mode 3: Presets Catalog */}
      {mode === 'presets' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
            {PRESET_EXAMPLES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handlePresetSelect(item)}
                className="text-left p-3.5 bg-slate-900/70 hover:bg-slate-900 border border-slate-700/80 hover:border-indigo-500 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live expression summary bar */}
      <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-xl">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Expresión Actual:
          </span>
          <div className="bg-slate-950 px-3 py-1 rounded border border-slate-800">
            <MathView
              math={`\\frac{(${currentSpec.baseA})^{${currentSpec.n}} ${currentSpec.numSign} (${currentSpec.baseB})^{${currentSpec.n}}}{(${currentSpec.baseA}) ${currentSpec.denSign} (${currentSpec.baseB})}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div>
            Base <span className="text-white font-mono">a = {currentSpec.baseA}</span>
          </div>
          <span aria-hidden="true">·</span>
          <div>
            Base <span className="text-white font-mono">b = {currentSpec.baseB}</span>
          </div>
          <span aria-hidden="true">·</span>
          <div>
            Exponente <span className="text-white font-mono">n = {currentSpec.n}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
