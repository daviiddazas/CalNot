import { QuizQuestion, QuotientSpec } from '../types/math';
import { parseMonomial } from './algebra';

export interface PresetItem {
  id: string;
  title: string;
  badge: string;
  category: 'caso1' | 'caso2' | 'caso3' | 'caso4' | 'avanzado';
  description: string;
  spec: QuotientSpec;
}

export const PRESET_EXAMPLES: PresetItem[] = [
  {
    id: 'guia_oficial',
    title: 'Ejemplo de la Guía: (16x⁴ - 81y⁴) / (2x - 3y)',
    badge: 'Caso 1 · Bases Compuestas',
    category: 'caso1',
    description: 'Bases compuestas a = 2x, b = 3y, n = 4. Todos los signos positivos.',
    spec: {
      rawInput: '(16x^4 - 81y^4)/(2x - 3y)',
      baseA: '2x',
      baseB: '3y',
      parsedA: parseMonomial('2x'),
      parsedB: parseMonomial('3y'),
      numSign: '-',
      denSign: '-',
      n: 4,
    },
  },
  {
    id: 'caso1_clasico',
    title: 'Caso 1: (x⁵ - y⁵) / (x - y)',
    badge: 'Caso 1 · n Impar',
    category: 'caso1',
    description: 'Forma fundamental con bases elementales. Desarrollo con 5 términos positivos.',
    spec: {
      rawInput: '(x^5 - y^5)/(x - y)',
      baseA: 'x',
      baseB: 'y',
      parsedA: parseMonomial('x'),
      parsedB: parseMonomial('y'),
      numSign: '-',
      denSign: '-',
      n: 5,
    },
  },
  {
    id: 'caso2_par_valido',
    title: 'Caso 2 Válido: (x⁶ - y⁶) / (x + y)',
    badge: 'Caso 2 · n Par (Válido)',
    category: 'caso2',
    description: 'n = 6 es par. División exacta con signos alternados (+, -, +, -, +, -).',
    spec: {
      rawInput: '(x^6 - y^6)/(x + y)',
      baseA: 'x',
      baseB: 'y',
      parsedA: parseMonomial('x'),
      parsedB: parseMonomial('y'),
      numSign: '-',
      denSign: '+',
      n: 6,
    },
  },
  {
    id: 'caso2_impar_invalido',
    title: 'Caso 2 Inválido: (x⁵ - y⁵) / (x + y)',
    badge: 'Caso 2 · n Impar (Residuo)',
    category: 'caso2',
    description: 'n = 5 es impar. No es cociente notable exacto, deja residuo R = -2y⁵.',
    spec: {
      rawInput: '(x^5 - y^5)/(x + y)',
      baseA: 'x',
      baseB: 'y',
      parsedA: parseMonomial('x'),
      parsedB: parseMonomial('y'),
      numSign: '-',
      denSign: '+',
      n: 5,
    },
  },
  {
    id: 'caso3_impar_valido',
    title: 'Caso 3 Válido: (x⁵ + 32) / (x + 2)',
    badge: 'Caso 3 · n Impar (Válido)',
    category: 'caso3',
    description: 'Constante numérica 32 = 2⁵. n = 5 es impar, desarrollo alternado que termina en positivo.',
    spec: {
      rawInput: '(x^5 + 32)/(x + 2)',
      baseA: 'x',
      baseB: '2',
      parsedA: parseMonomial('x'),
      parsedB: parseMonomial('2'),
      numSign: '+',
      denSign: '+',
      n: 5,
    },
  },
  {
    id: 'caso3_par_invalido',
    title: 'Caso 3 Inválido: (x⁴ + 16) / (x + 2)',
    badge: 'Caso 3 · n Par (Residuo)',
    category: 'caso3',
    description: 'n = 4 es par. Falla la condición de validez, genera residuo R = 2(2)⁴ = 32.',
    spec: {
      rawInput: '(x^4 + 16)/(x + 2)',
      baseA: 'x',
      baseB: '2',
      parsedA: parseMonomial('x'),
      parsedB: parseMonomial('2'),
      numSign: '+',
      denSign: '+',
      n: 4,
    },
  },
  {
    id: 'caso4_invalido',
    title: 'Caso 4: (x⁴ + y⁴) / (x - y)',
    badge: 'Caso 4 · Nunca Notable',
    category: 'caso4',
    description: 'Suma entre diferencia. NUNCA genera cociente notable exacto (R = 2y⁴ ≠ 0).',
    spec: {
      rawInput: '(x^4 + y^4)/(x - y)',
      baseA: 'x',
      baseB: 'y',
      parsedA: parseMonomial('x'),
      parsedB: parseMonomial('y'),
      numSign: '+',
      denSign: '-',
      n: 4,
    },
  },
  {
    id: 'avanzado_potencias',
    title: 'Exponentes Compuestos: (x²⁰ - y³⁰) / (x⁴ - y⁶)',
    badge: 'Avanzado · n = 5',
    category: 'avanzado',
    description: 'Bases con potencias internas a = x⁴, b = y⁶. Exponente común n = 20/4 = 30/6 = 5.',
    spec: {
      rawInput: '(x^20 - y^30)/(x^4 - y^6)',
      baseA: 'x^4',
      baseB: 'y^6',
      parsedA: parseMonomial('x^4'),
      parsedB: parseMonomial('y^6'),
      numSign: '-',
      denSign: '-',
      n: 5,
    },
  },
  {
    id: 'avanzado_coef_unidad',
    title: 'Coeficiente y Unidad: (64x⁶ - 1) / (2x - 1)',
    badge: 'Avanzado · n = 6',
    category: 'avanzado',
    description: 'Base primer término a = 2x, base segundo término b = 1, n = 6.',
    spec: {
      rawInput: '(64x^6 - 1)/(2x - 1)',
      baseA: '2x',
      baseB: '1',
      parsedA: parseMonomial('2x'),
      parsedB: parseMonomial('1'),
      numSign: '-',
      denSign: '-',
      n: 6,
    },
  },
  {
    id: 'suma_de_cubos',
    title: 'Suma de Cubos: (8x³ + 27y³) / (2x + 3y)',
    badge: 'Caso 3 · n = 3',
    category: 'caso3',
    description: 'Identidad fundamental de cubos con coeficientes 2 y 3. Produce 3 términos.',
    spec: {
      rawInput: '(8x^3 + 27y^3)/(2x + 3y)',
      baseA: '2x',
      baseB: '3y',
      parsedA: parseMonomial('2x'),
      parsedB: parseMonomial('3y'),
      numSign: '+',
      denSign: '+',
      n: 3,
    },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'caso',
    expression: '\\frac{a^{12} - b^{12}}{a + b}',
    question: '¿A qué caso de cociente notable corresponde y cuál es su validez?',
    options: [
      'Caso 2: Es cociente notable exacto porque el exponente n = 12 es par.',
      'Caso 1: Es cociente notable para cualquier valor de n.',
      'Caso 2: NO es cociente notable porque el divisor tiene signo más (+).',
      'Caso 4: Deja residuo constante.',
    ],
    correctIndex: 0,
    explanation:
      'La forma es (aⁿ - bⁿ)/(a + b). Corresponde al Caso 2 y es notable si y solo si n es par. Al ser n = 12 par, la división es exacta.',
  },
  {
    id: 'q2',
    category: 'validez',
    expression: '\\frac{x^7 + y^7}{x - y}',
    question: 'Al evaluar esta expresión según los criterios de cocientes notables, ¿qué se concluye?',
    options: [
      'Es un cociente notable de 7 términos.',
      'Corresponde al Caso 4 y NUNCA es un cociente notable exacto (deja residuo R = 2y⁷).',
      'Es un cociente notable válido solo si n es impar.',
      'Todos sus términos son negativos.',
    ],
    correctIndex: 1,
    explanation:
      'El Caso 4 (suma en numerador, resta en denominador) nunca es notable para ningún entero positivo, pues por el Teorema del Resto P(y) = y⁷ + y⁷ = 2y⁷ ≠ 0.',
  },
  {
    id: 'q3',
    category: 'terminos',
    expression: '\\frac{x^{28} - y^{35}}{x^4 - y^5}',
    question: '¿Cuántos términos tiene el cociente notable resultante?',
    options: [
      '63 términos',
      '9 términos',
      '7 términos',
      '4 términos',
    ],
    correctIndex: 2,
    explanation:
      'El número de términos n es igual a 28/4 = 35/5 = 7. El cociente tendrá exactamente 7 términos.',
  },
  {
    id: 'q4',
    category: 'signos',
    expression: '\\frac{m^9 + n^9}{m + n}',
    question: '¿Cuál es la regla de signos para el desarrollo de este cociente notable?',
    options: [
      'Todos los signos son positivos (+, +, +, ...)',
      'Todos los signos son negativos (-, -, -, ...)',
      'Los signos son alternados, empezando con positivo (+, -, +, -, ..., +)',
      'Los dos primeros son positivos y los restantes negativos.',
    ],
    correctIndex: 2,
    explanation:
      'En los casos con divisor (a + b) (Casos 2 y 3), los signos siempre se alternan: los de posición impar son positivos y los de posición par son negativos.',
  },
  {
    id: 'q5',
    category: 'termino_k',
    expression: '\\frac{x^8 - y^8}{x - y}',
    question: '¿Cuál es el término T₅ (quinto término) del desarrollo?',
    options: [
      '- x³ y⁴',
      '+ x³ y⁴',
      '+ x⁴ y³',
      '- x⁴ y³',
    ],
    correctIndex: 1,
    explanation:
      'Para T₅ con n=8, divisor (x-y) (todos positivos): T₅ = + x^(8-5) · y^(5-1) = + x³ y⁴.',
  },
  {
    id: 'q6',
    category: 'termino_k',
    expression: '\\frac{x^6 - y^6}{x + y}',
    question: '¿Cuál es el signo del término de lugar k = 4 (T₄)?',
    options: [
      'Positivo (+)',
      'Negativo (-)',
      'Cero (0)',
      'No tiene signo definido',
    ],
    correctIndex: 1,
    explanation:
      'Cuando el divisor es (a + b), el signo del término k viene dado por (-1)^(k-1). Para k = 4, (-1)³ = -1 (signo negativo).',
  },
];
