export type FactorizationCaseType =
  | 'DIFERENCIA_CUADRADOS' // A^2 - B^2 = (A - B)(A + B)
  | 'SUMA_CUBOS' // A^3 + B^3 = (A + B)(A^2 - AB + B^2)
  | 'DIFERENCIA_CUBOS' // A^3 - B^3 = (A - B)(A^2 + AB + B^2)
  | 'POTENCIAS_IGUALES_RESTA_RESTA' // A^n - B^n = (A - B)(A^{n-1} + ... + B^{n-1})
  | 'POTENCIAS_IGUALES_RESTA_SUMA' // A^n - B^n = (A + B)(A^{n-1} - ... - B^{n-1}) con n par
  | 'POTENCIAS_IGUALES_SUMA_SUMA' // A^n + B^n = (A + B)(A^{n-1} - ... + B^{n-1}) con n impar
  | 'TRINOMIO_CUADRADO_PERFECTO' // a^2 +- 2ab + b^2 = (a +- b)^2
  | 'TRINOMIO_SIMPLE' // x^2 + bx + c = (x + p)(x + q)
  | 'FACTOR_COMUN' // k(a + b)
  | 'NO_FACTORIZABLE_EXACTO';

export interface FactorizationStep {
  title: string;
  description: string;
  mathLatex: string;
  highlight?: string;
}

export interface FactorizationResult {
  rawInput: string;
  isFraction: boolean;
  numeratorStr: string;
  denominatorStr?: string;
  
  // Case details
  caseKey: FactorizationCaseType;
  caseName: string;
  caseRuleFormula: string;
  
  // Identified components
  baseA: string;
  baseB: string;
  exponentN?: number;
  
  // Steps of factorization
  steps: FactorizationStep[];
  
  // Factored form of the polynomial
  factoredNumeratorLatex: string;
  
  // If it's a fraction (quotient):
  cancellationLatex?: string;
  cancelledFactor?: string;
  
  // Final solution
  finalResultLatex: string;
  
  // Didactic summary
  pedagogicalNote: string;
  
  // Verification check
  verificationLatex: string;
}
