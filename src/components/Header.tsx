import React from 'react';
import { BookOpen, Copy, Check, RotateCcw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calculadora' | 'teoria' | 'evaluacion';
  setActiveTab: (tab: 'calculadora' | 'teoria' | 'evaluacion') => void;
  onCopyMarkdown: () => void;
  copied: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onCopyMarkdown,
  copied,
  onReset,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => setActiveTab('calculadora')}
          className="flex items-center gap-2 text-left"
        >
          <span className="text-xl">🧮</span>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-indigo-300 transition-colors block leading-tight">
              MathNotables-Lab
            </span>
            <span className="text-[10px] text-indigo-400 font-mono hidden sm:block">
              Calculadora Paso a Paso
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('calculadora')}
            className={`transition-colors pb-1 border-b-2 ${
              activeTab === 'calculadora'
                ? 'text-white border-indigo-400 font-semibold'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            Calculadora
          </button>
          <button
            onClick={() => setActiveTab('teoria')}
            className={`transition-colors pb-1 border-b-2 ${
              activeTab === 'teoria'
                ? 'text-white border-indigo-400 font-semibold'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            Los 4 Casos
          </button>
          <button
            onClick={() => setActiveTab('evaluacion')}
            className={`transition-colors pb-1 border-b-2 ${
              activeTab === 'evaluacion'
                ? 'text-white border-indigo-400 font-semibold'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            Práctica
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Restablecer expresión inicial"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copiar LaTeX</span>
                <span className="sm:hidden">Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
