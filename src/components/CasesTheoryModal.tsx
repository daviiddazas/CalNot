import React from 'react';
import { BookOpen, CheckCircle, ShieldCheck } from 'lucide-react';
import { MathView } from './MathView';

interface CasesTheoryProps {
  onSelectCaseExample?: (expr: string) => void;
}

export const CasesTheory: React.FC<CasesTheoryProps> = ({ onSelectCaseExample }) => {
  const factorizationCases = [
    {
      id: 'caso4',
      name: 'Diferencia de Cuadrados Perfectos',
      rule: 'A^2 - B^2 = (A - B)(A + B)',
      description:
        'Se extrae la raíz cuadrada de ambos términos y se multiplica la resta de las raíces por la suma de las mismas (binomios conjugados).',
      example: '16x^4 - 81y^4 = (4x^2 - 9y^2)(4x^2 + 9y^2) = (2x - 3y)(2x + 3y)(4x^2 + 9y^2)',
      sampleExpr: '16x^4 - 81y^4',
    },
    {
      id: 'caso9_suma',
      name: 'Suma de Cubos Perfectos',
      rule: 'A^3 + B^3 = (A + B)(A^2 - AB + B^2)',
      description:
        'Se extrae la raíz cúbica de ambos términos. El primer factor es la suma de las raíces y el segundo factor es el cuadrado de la primera, menos el producto de ambas, más el cuadrado de la segunda.',
      example: '8x^3 + 27y^3 = (2x + 3y)(4x^2 - 6xy + 9y^2)',
      sampleExpr: '8x^3 + 27y^3',
    },
    {
      id: 'caso9_resta',
      name: 'Diferencia de Cubos Perfectos',
      rule: 'A^3 - B^3 = (A - B)(A^2 + AB + B^2)',
      description:
        'El primer factor es la resta de las raíces cúbicas y el segundo factor tiene todos sus signos positivos: cuadrado de la primera, más producto de ambas, más cuadrado de la segunda.',
      example: 'x^3 - 8 = (x - 2)(x^2 + 2x + 4)',
      sampleExpr: 'x^3 - 8',
    },
    {
      id: 'caso10',
      name: 'Suma o Diferencia de Potencias Iguales (n ≥ 4)',
      rule: 'A^n - B^n = (A - B)(A^{n-1} + A^{n-2}B + \\dots + B^{n-1})',
      description:
        'Se descompone en el binomio base multiplicado por un polinomio homogéneo de n términos cuyos exponentes descienden para A y ascienden para B.',
      example: 'x^5 - y^5 = (x - y)(x^4 + x^3y + x^2y^2 + xy^3 + y^4)',
      sampleExpr: 'x^5 - y^5',
    },
    {
      id: 'tcp',
      name: 'Trinomio Cuadrado Perfecto (TCP)',
      rule: 'A^2 \\pm 2AB + B^2 = (A \\pm B)^2',
      description:
        'Dos de los términos son cuadrados perfectos positivos y el tercer término es exactamente el doble producto de sus raíces cuadradas.',
      example: 'x^2 - 6x + 9 = (x - 3)^2',
      sampleExpr: 'x^2 - 6x + 9',
    },
    {
      id: 'trinomio_simple',
      name: 'Trinomio de la forma x² + bx + c',
      rule: 'x^2 + (p+q)x + pq = (x + p)(x + q)',
      description:
        'Se buscan dos números p y q que sumados den b y multiplicados den c.',
      example: 'x^2 + 5x + 6 = (x + 2)(x + 3)',
      sampleExpr: 'x^2 + 5x + 6',
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-semibold text-indigo-400 tracking-wider">
            Compendio de Álgebra
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
            Los Casos de Factorización y su Aplicación en Simplificación
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1 rounded-lg">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Álgebra de Baldor & Superior</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factorizationCases.map((c) => (
          <div
            key={c.id}
            className="bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm font-bold text-white">{c.name}</h3>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 mb-2.5 text-center">
                <MathView math={c.rule} />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                {c.description}
              </p>

              <div className="text-[11px] text-indigo-300 bg-indigo-950/30 p-2 rounded border border-indigo-900/50 font-mono">
                <span className="text-slate-400 block mb-0.5">Ejemplo:</span>
                <MathView math={c.example} />
              </div>
            </div>

            {onSelectCaseExample && (
              <button
                type="button"
                onClick={() => onSelectCaseExample(c.sampleExpr)}
                className="w-full mt-2 py-1.5 px-3 bg-indigo-950/60 hover:bg-indigo-900/80 active:bg-indigo-800 text-indigo-200 text-xs font-semibold rounded-lg border border-indigo-700/60 transition-colors"
              >
                Cargar en la calculadora: {c.sampleExpr}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
