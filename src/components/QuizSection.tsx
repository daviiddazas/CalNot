import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../utils/presets';
import { MathView } from './MathView';

export const QuizSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);
    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 sm:p-8 backdrop-blur shadow-lg text-center max-w-xl mx-auto space-y-5">
        <div className="w-16 h-16 bg-indigo-900/60 border border-indigo-700/60 rounded-full flex items-center justify-center mx-auto text-indigo-400">
          <Award className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-white">¡Evaluación de Cocientes Notables Completada!</h2>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-3xl font-extrabold text-indigo-400 font-mono">
            {score} / {QUIZ_QUESTIONS.length}
          </div>
          <p className="text-xs text-slate-400">
            Puntaje obtenido: <span className="text-white font-semibold">{percentage}%</span> de aciertos
          </p>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          {percentage >= 80
            ? '¡Excelente dominio de los 4 casos, la regla de signos y el cálculo del término general!'
            : 'Buen intento. Recuerda revisar la condición de paridad en los Casos 2 y 3 y el Teorema del Resto.'}
        </p>

        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Intentar la Prueba Nuevamente</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 sm:p-6 backdrop-blur shadow-lg space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
        <div>
          <span className="text-xs uppercase font-semibold text-indigo-400 tracking-wider">
            Autoevaluación de Aprendizaje
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            Pregunta {currentIndex + 1} de {QUIZ_QUESTIONS.length}
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">Puntaje actual:</span>
          <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
            {score} aciertos
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-5 sm:p-6 space-y-4">
        {/* Math expression display */}
        <div className="text-center py-2 bg-slate-950 p-4 rounded-lg border border-slate-800">
          <MathView math={currentQ.expression} block />
        </div>

        <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
          {currentQ.question}
        </p>

        {/* Options */}
        <div className="space-y-2.5 pt-2">
          {currentQ.options.map((opt, idx) => {
            const isCorrect = idx === currentQ.correctIndex;
            const isSelected = selectedOption === idx;

            let btnClass =
              'bg-slate-950/70 border-slate-800 hover:border-indigo-500 text-slate-200';
            if (answered) {
              if (isCorrect) {
                btnClass =
                  'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
              } else if (isSelected) {
                btnClass = 'bg-rose-950/70 border-rose-500 text-rose-200 ring-1 ring-rose-500';
              } else {
                btnClass = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={`w-full p-3.5 rounded-lg border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {answered && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                )}
                {answered && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback */}
        {answered && (
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              {selectedOption === currentQ.correctIndex ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase">
                    ¡Respuesta Correcta!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-rose-400 uppercase">
                    Respuesta Incorrecta
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {currentQ.explanation}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors"
              >
                <span>{currentIndex + 1 < QUIZ_QUESTIONS.length ? 'Siguiente Pregunta' : 'Ver Resultados'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
