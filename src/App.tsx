import React, { useState, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { CalculatorScreen } from './components/CalculatorScreen';
import { MathKeypad } from './components/MathKeypad';
import { FactorizationView } from './components/FactorizationView';
import { StepPlayer } from './components/StepPlayer';
import { TermFinder } from './components/TermFinder';
import { CasesTheory } from './components/CasesTheoryModal';
import { QuizSection } from './components/QuizSection';
import { solveByFactorization } from './utils/factorizationSolver';
import { parseAlgebraicQuotient, parseMonomial, solveNotableQuotient } from './utils/algebra';
import { formatResolutionAsMarkdown } from './utils/markdownExporter';
import { QuotientSpec } from './types/math';
import { CheckCircle2, FileText, Layers, Calculator, Play } from 'lucide-react';

const INITIAL_EXPRESSION = '(16x^4 - 81y^4)/(2x - 3y)';

const INITIAL_SPEC: QuotientSpec = {
  rawInput: INITIAL_EXPRESSION,
  baseA: '2x',
  baseB: '3y',
  parsedA: parseMonomial('2x'),
  parsedB: parseMonomial('3y'),
  numSign: '-',
  denSign: '-',
  n: 4,
};

export default function App() {
  const [expression, setExpression] = useState<string>(INITIAL_EXPRESSION);
  const [activeTab, setActiveTab] = useState<'calculadora' | 'teoria' | 'evaluacion'>('calculadora');
  const [subView, setSubView] = useState<'factorizacion' | 'cociente_notable' | 'termino_k'>('factorizacion');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // 1. Solve by Factorization Cases
  const factorizationResult = useMemo(() => {
    return solveByFactorization(expression || INITIAL_EXPRESSION);
  }, [expression]);

  // 2. Solve as Notable Quotient if it's a quotient fraction
  const quotientSpec = useMemo(() => {
    const parsed = parseAlgebraicQuotient(expression);
    if (parsed.success && parsed.spec) return parsed.spec;
    return INITIAL_SPEC;
  }, [expression]);

  const quotientResolution = useMemo(() => {
    return solveNotableQuotient(quotientSpec);
  }, [quotientSpec]);

  // Insert text at cursor in input
  const handleInsertText = (text: string) => {
    setErrorMessage(null);
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart ?? expression.length;
      const end = input.selectionEnd ?? expression.length;
      const nextText = expression.substring(0, start) + text + expression.substring(end);
      setExpression(nextText);

      setTimeout(() => {
        input.focus();
        const nextPos = start + text.length;
        input.setSelectionRange(nextPos, nextPos);
      }, 10);
    } else {
      setExpression((prev) => prev + text);
    }
  };

  // Backspace at cursor
  const handleBackspace = () => {
    setErrorMessage(null);
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart ?? expression.length;
      const end = input.selectionEnd ?? expression.length;
      if (start === end) {
        if (start > 0) {
          const nextText = expression.substring(0, start - 1) + expression.substring(end);
          setExpression(nextText);
          setTimeout(() => {
            input.focus();
            input.setSelectionRange(start - 1, start - 1);
          }, 10);
        }
      } else {
        const nextText = expression.substring(0, start) + expression.substring(end);
        setExpression(nextText);
        setTimeout(() => {
          input.focus();
          input.setSelectionRange(start, start);
        }, 10);
      }
    } else {
      setExpression((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    setExpression('');
    setErrorMessage(null);
    inputRef.current?.focus();
  };

  const handleInsertTemplate = () => {
    setErrorMessage(null);
    const template = '( ) / ( )';
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart ?? expression.length;
      const end = input.selectionEnd ?? expression.length;
      const nextText = expression.substring(0, start) + template + expression.substring(end);
      setExpression(nextText);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + 2, start + 2);
      }, 10);
    } else {
      setExpression(template);
    }
  };

  const handleSolve = () => {
    setErrorMessage(null);
    const clean = expression.trim();
    if (!clean) {
      setErrorMessage('Por favor ingresa una expresión para factorizar.');
      return;
    }

    setToastMessage('¡Expresión resuelta por casos de factorización!');
    setTimeout(() => setToastMessage(null), 2500);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSelectExample = (expr: string) => {
    setExpression(expr);
    setErrorMessage(null);
    setToastMessage('Ejercicio cargado');
    setTimeout(() => setToastMessage(null), 2000);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCopy = () => {
    let text = `📐 **RESOLUCIÓN POR CASOS DE FACTORIZACIÓN**\n---\n`;
    text += `* Expresión: ${factorizationResult.rawInput}\n`;
    text += `* Caso Aplicado: ${factorizationResult.caseName}\n`;
    text += `* Regla: $${factorizationResult.caseRuleFormula}$\n`;
    text += `* Factorización del Numerador: $${factorizationResult.factoredNumeratorLatex}$\n`;
    if (factorizationResult.isFraction && factorizationResult.cancellationLatex) {
      text += `* Simplificación de Fracción: $${factorizationResult.cancellationLatex}$\n`;
    }
    text += `* Resultado Final: $${factorizationResult.finalResultLatex}$\n`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setToastMessage('¡Solución copiada al portapapeles!');
      setTimeout(() => {
        setCopied(false);
        setToastMessage(null);
      }, 2500);
    });
  };

  const handleReset = () => {
    setExpression(INITIAL_EXPRESSION);
    setErrorMessage(null);
    setToastMessage('Valores restablecidos');
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCopyMarkdown={handleCopy}
        copied={copied}
        onReset={handleReset}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {activeTab === 'calculadora' && (
          <div className="space-y-8">
            {/* CALCULADORA PRINCIPAL: Pantalla + Teclado de Álgebra */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 sm:p-7 backdrop-blur shadow-2xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs uppercase font-semibold text-indigo-400 tracking-wider">
                    Calculadora de Álgebra y Factorización
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                    Solucionador por Casos de Factorización
                  </h1>
                </div>

                <div className="text-xs text-slate-400 hidden sm:block">
                  Factoriza polinomios o simplifica fracciones algebraicas paso a paso
                </div>
              </div>

              {/* Calculator Screen on Left, Keypad on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-6 space-y-4">
                  <CalculatorScreen
                    expression={expression}
                    onChangeExpression={(val) => {
                      setExpression(val);
                      setErrorMessage(null);
                    }}
                    inputRef={inputRef}
                    onSolve={handleSolve}
                    errorMessage={errorMessage}
                    onSelectExample={handleSelectExample}
                  />

                  <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center justify-between">
                    <span>
                      💡 <strong>Casos soportados:</strong> Diferencia de cuadrados, cubos, potencias iguales, trinomios y fracciones.
                    </span>
                    <button
                      onClick={handleSolve}
                      className="text-indigo-400 hover:text-indigo-300 font-bold underline shrink-0 ml-2"
                    >
                      Factorizar Ahora
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <MathKeypad
                    onInsertText={handleInsertText}
                    onBackspace={handleBackspace}
                    onClear={handleClear}
                    onSolve={handleSolve}
                    onInsertTemplate={handleInsertTemplate}
                  />
                </div>
              </div>
            </section>

            {/* SECCIÓN DE RESULTADOS CON CASOS DE FACTORIZACIÓN */}
            <div ref={resultRef} className="space-y-6 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    Solución Paso a Paso:
                  </span>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setSubView('factorizacion')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      subView === 'factorizacion'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Por Casos de Factorización</span>
                  </button>

                  {factorizationResult.isFraction && (
                    <button
                      onClick={() => setSubView('cociente_notable')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        subView === 'cociente_notable'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Cociente Notable Término a Término</span>
                    </button>
                  )}

                  {factorizationResult.isFraction && (
                    <button
                      onClick={() => setSubView('termino_k')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        subView === 'termino_k'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Cálculo de Término Tₖ</span>
                    </button>
                  )}
                </div>
              </div>

              {/* View 1: Solution by Factorization Cases (Requested by User) */}
              {subView === 'factorizacion' && (
                <FactorizationView
                  result={factorizationResult}
                  onCopy={handleCopy}
                  copied={copied}
                />
              )}

              {/* View 2: Step Player for Notable Quotients */}
              {subView === 'cociente_notable' && (
                <StepPlayer resolution={quotientResolution} />
              )}

              {/* View 3: Tk Finder */}
              {subView === 'termino_k' && (
                <TermFinder resolution={quotientResolution} />
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Compendio de Casos de Factorización */}
        {activeTab === 'teoria' && (
          <CasesTheory
            onSelectCaseExample={(expr) => {
              setExpression(expr);
              setActiveTab('calculadora');
              setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 150);
            }}
          />
        )}

        {/* Tab 3: Práctica interactiva */}
        {activeTab === 'evaluacion' && <QuizSection />}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-400 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MathNotables-Lab · Calculadora Paso a Paso por Casos de Factorización</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Diferencia de Cuadrados</span>
            <span aria-hidden="true">·</span>
            <span>Suma y Resta de Cubos</span>
            <span aria-hidden="true">·</span>
            <span>Potencias Iguales</span>
            <span aria-hidden="true">·</span>
            <span>Trinomios</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
