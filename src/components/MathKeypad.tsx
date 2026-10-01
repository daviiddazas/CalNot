import React from 'react';
import { Delete, RotateCcw, Divide, Sparkles, Check, ArrowRight } from 'lucide-react';

interface MathKeypadProps {
  onInsertText: (text: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSolve: () => void;
  onInsertTemplate: () => void;
}

export const MathKeypad: React.FC<MathKeypadProps> = ({
  onInsertText,
  onBackspace,
  onClear,
  onSolve,
  onInsertTemplate,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-xl select-none">
      {/* Top Helper Tools Row */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
        <button
          type="button"
          onClick={onClear}
          title="Limpiar toda la expresión"
          className="flex items-center justify-center gap-1 py-2 sm:py-2.5 px-2 bg-rose-950/40 hover:bg-rose-900/60 active:bg-rose-800 text-rose-300 font-bold text-xs rounded-xl border border-rose-800/60 transition-all active:scale-95 shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>AC</span>
        </button>

        <button
          type="button"
          onClick={onBackspace}
          title="Borrar carácter anterior"
          className="flex items-center justify-center gap-1 py-2 sm:py-2.5 px-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          <Delete className="w-3.5 h-3.5 text-slate-400" />
          <span>Borrar</span>
        </button>

        <button
          type="button"
          onClick={onInsertTemplate}
          title="Insertar plantilla: (A)/(B)"
          className="col-span-2 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2 bg-indigo-950/50 hover:bg-indigo-900/70 active:bg-indigo-800 text-indigo-300 font-semibold text-xs rounded-xl border border-indigo-700/60 transition-all active:scale-95 shadow-sm"
        >
          <span className="font-mono text-sm">( ) / ( )</span>
          <span className="hidden sm:inline text-[11px] text-indigo-200">Plantilla</span>
        </button>
      </div>

      {/* Main Grid: Variables, Numbers, Powers and Operators */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* Row 1: Quick Powers & Variables */}
        <button
          type="button"
          onClick={() => onInsertText('x')}
          className="py-2.5 sm:py-3 bg-slate-800/90 hover:bg-indigo-950/70 active:bg-indigo-900 text-indigo-300 font-bold font-mono text-base rounded-xl border border-slate-700/80 transition-all active:scale-95 shadow-sm"
        >
          x
        </button>
        <button
          type="button"
          onClick={() => onInsertText('y')}
          className="py-2.5 sm:py-3 bg-slate-800/90 hover:bg-indigo-950/70 active:bg-indigo-900 text-indigo-300 font-bold font-mono text-base rounded-xl border border-slate-700/80 transition-all active:scale-95 shadow-sm"
        >
          y
        </button>
        <button
          type="button"
          onClick={() => onInsertText('^')}
          title="Potencia genérica"
          className="py-2.5 sm:py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-amber-300 font-bold font-mono text-base rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          ^
        </button>
        <button
          type="button"
          onClick={() => onInsertText('(')}
          className="py-2.5 sm:py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-bold font-mono text-base rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          (
        </button>
        <button
          type="button"
          onClick={() => onInsertText(')')}
          className="py-2.5 sm:py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-bold font-mono text-base rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          )
        </button>

        {/* Row 2: Powers 2, 3 and Numbers 7, 8, 9 */}
        <button
          type="button"
          onClick={() => onInsertText('^2')}
          title="Elevar al cuadrado"
          className="py-2.5 sm:py-3 bg-indigo-950/30 hover:bg-indigo-900/50 active:bg-indigo-800 text-indigo-200 font-bold font-mono text-sm rounded-xl border border-indigo-900/50 transition-all active:scale-95 shadow-sm"
        >
          a²
        </button>
        <button
          type="button"
          onClick={() => onInsertText('7')}
          className="py-2.5 sm:py-3 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white font-bold font-mono text-base rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => onInsertText('8')}
          className="py-2.5 sm:py-3 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white font-bold font-mono text-base rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => onInsertText('9')}
          className="py-2.5 sm:py-3 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white font-bold font-mono text-base rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          9
        </button>
        <button
          type="button"
          onClick={() => onInsertText(' / ')}
          title="División"
          className="py-2.5 sm:py-3 bg-amber-950/40 hover:bg-amber-900/60 active:bg-amber-800 text-amber-300 font-bold font-mono text-lg rounded-xl border border-amber-800/60 transition-all active:scale-95 shadow-sm flex items-center justify-center"
        >
          <Divide className="w-5 h-5" />
        </button>

        {/* Row 3: Powers 3, 4 and Numbers 4, 5, 6 */}
        <button
          type="button"
          onClick={() => onInsertText('^3')}
          title="Elevar al cubo"
          className="py-2.5 sm:py-3 bg-indigo-950/30 hover:bg-indigo-900/50 active:bg-indigo-800 text-indigo-200 font-bold font-mono text-sm rounded-xl border border-indigo-900/50 transition-all active:scale-95 shadow-sm"
        >
          a³
        </button>
        <button
          type="button"
          onClick={() => onInsertText('4')}
          className="py-2.5 sm:py-3 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white font-bold font-mono text-base rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => onInsertText('5')}
          className="py-2.5 sm:py-3 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white font-bold font-mono text-base rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => onInsertText('6')}
          className="py-2.5 sm:py-3 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white font-bold font-mono text-base rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          6
        </button>
        <button
          type="button"
          onClick={() => onInsertText(' - ')}
          title="Resta"
          className="py-2.5 sm:py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-amber-300 font-bold font-mono text-xl rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          −
        </button>

        {/* Row 4: Power 4, 5 and Numbers 1, 2, 3 */}
        <button
          type="button"
          onClick={() => onInsertText('^4')}
          title="Elevar a la cuarta"
          className="py-2.5 sm:py-3 bg-indigo-950/30 hover:bg-indigo-900/50 active:bg-indigo-800 text-indigo-200 font-bold font-mono text-sm rounded-xl border border-indigo-900/50 transition-all active:scale-95 shadow-sm"
        >
          a⁴
        </button>
        <button
          type="button"
          onClick={() => onInsertText('1')}
          className="py-2.5 sm:py-3 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white font-bold font-mono text-base rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => onInsertText('2')}
          className="py-2.5 sm:py-3 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white font-bold font-mono text-base rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => onInsertText('3')}
          className="py-2.5 sm:py-3 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white font-bold font-mono text-base rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          3
        </button>
        <button
          type="button"
          onClick={() => onInsertText(' + ')}
          title="Suma"
          className="py-2.5 sm:py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-amber-300 font-bold font-mono text-xl rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          +
        </button>

        {/* Row 5: Variables a, b, 0, exponent 5, and = */}
        <button
          type="button"
          onClick={() => onInsertText('^5')}
          title="Elevar a la quinta"
          className="py-2.5 sm:py-3 bg-indigo-950/30 hover:bg-indigo-900/50 active:bg-indigo-800 text-indigo-200 font-bold font-mono text-sm rounded-xl border border-indigo-900/50 transition-all active:scale-95 shadow-sm"
        >
          a⁵
        </button>
        <button
          type="button"
          onClick={() => onInsertText('a')}
          className="py-2.5 sm:py-3 bg-slate-800/90 hover:bg-indigo-950/70 active:bg-indigo-900 text-purple-300 font-bold font-mono text-base rounded-xl border border-slate-700/80 transition-all active:scale-95 shadow-sm"
        >
          a
        </button>
        <button
          type="button"
          onClick={() => onInsertText('0')}
          className="py-2.5 sm:py-3 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white font-bold font-mono text-base rounded-xl border border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => onInsertText('b')}
          className="py-2.5 sm:py-3 bg-slate-800/90 hover:bg-indigo-950/70 active:bg-indigo-900 text-purple-300 font-bold font-mono text-base rounded-xl border border-slate-700/80 transition-all active:scale-95 shadow-sm"
        >
          b
        </button>
        <button
          type="button"
          onClick={onSolve}
          title="Resolver paso a paso"
          className="py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-extrabold font-mono text-xl rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center border border-indigo-400"
        >
          =
        </button>
      </div>

      {/* Big Action Button for clear CTA */}
      <button
        type="button"
        onClick={onSolve}
        className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 border border-indigo-400/40 transition-all"
      >
        <span>RESOLVER PASO A PASO</span>
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};
