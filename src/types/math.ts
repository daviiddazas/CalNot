export type QuotientCase = 'CASO_1' | 'CASO_2' | 'CASO_3' | 'CASO_4';

export interface AlgebraicFactor {
  coefficient: number; // e.g. 2
  variables: Record<string, number>; // e.g. { x: 1, y: 2 } for 2x y^2
}

export interface Monomial {
  raw: string;
  factor: AlgebraicFactor;
}

export interface QuotientSpec {
  rawInput: string;
  baseA: string;
  baseB: string;
  parsedA: Monomial;
  parsedB: Monomial;
  numSign: '+' | '-';
  denSign: '+' | '-';
  n: number;
}

export interface TermCalculation {
  k: number;
  sign: '+' | '-';
  expA: number; // n - k
  expB: number; // k - 1
  substitutionLatex: string;
  intermediateLatex: string;
  simplifiedLatex: string;
  rawText: string;
}

export interface QuotientResolution {
  spec: QuotientSpec;
  identifiedCase: QuotientCase;
  caseName: string;
  caseFormula: string;
  isValid: boolean;
  validityCondition: string;
  remainderExplanation?: string;
  numTerms: number;
  signPatternDescription: string;
  theoreticalSchemeLatex: string;
  terms: TermCalculation[];
  finalPolynomialLatex: string;
  standardFormLatex: string;
  question: {
    prompt: string;
    kTarget?: number;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface QuizQuestion {
  id: string;
  expression: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'validez' | 'caso' | 'terminos' | 'termino_k' | 'signos';
}
