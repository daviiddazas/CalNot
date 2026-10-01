import {
  AlgebraicFactor,
  Monomial,
  QuotientCase,
  QuotientResolution,
  QuotientSpec,
  TermCalculation,
} from '../types/math';

/**
 * Normalizes unicode superscripts (², ³, ⁴, etc.) to standard caret notation (^2, ^3, etc.)
 */
export function normalizeSuperscripts(text: string): string {
  const map: Record<string, string> = {
    '⁰': '^0',
    '¹': '^1',
    '²': '^2',
    '³': '^3',
    '⁴': '^4',
    '⁵': '^5',
    '⁶': '^6',
    '⁷': '^7',
    '⁸': '^8',
    '⁹': '^9',
  };
  return text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (ch) => map[ch] || ch);
}

/**
 * Strips matching outer parentheses safely e.g. "(16x^4 - 81y^4)" -> "16x^4 - 81y^4"
 */
export function stripOuterParentheses(str: string): string {
  let s = str.trim();
  while (s.startsWith('(') && s.endsWith(')')) {
    let depth = 0;
    let matched = true;
    for (let i = 0; i < s.length - 1; i++) {
      if (s[i] === '(') depth++;
      else if (s[i] === ')') depth--;
      if (depth === 0) {
        matched = false;
        break;
      }
    }
    if (matched) {
      s = s.slice(1, -1).trim();
    } else {
      break;
    }
  }
  return s;
}

/**
 * Parses a single monomial string like "2x", "3y^2", "-4a^3b", "16", "x", "y^4"
 */
export function parseMonomial(input: string): Monomial {
  const clean = stripOuterParentheses(normalizeSuperscripts(input.trim()));
  if (!clean) {
    return {
      raw: '1',
      factor: { coefficient: 1, variables: {} },
    };
  }

  let str = clean;
  let sign = 1;
  if (str.startsWith('-')) {
    sign = -1;
    str = str.slice(1).trim();
  } else if (str.startsWith('+')) {
    str = str.slice(1).trim();
  }

  // Check if it is purely numeric
  if (/^\d+(\.\d+)?$/.test(str)) {
    const val = parseFloat(str) * sign;
    return {
      raw: clean,
      factor: { coefficient: val, variables: {} },
    };
  }

  // Extract leading coefficient if present
  const coeffMatch = str.match(/^(\d+(?:\.\d+)?)/);
  let coeff = 1;
  let rest = str;
  if (coeffMatch) {
    coeff = parseFloat(coeffMatch[1]);
    rest = str.slice(coeffMatch[1].length).trim();
  }
  coeff *= sign;

  // Parse variables and exponents e.g. "x^2 y^3", "x^4", "xy", "a^2"
  const variables: Record<string, number> = {};
  const varRegex = /([a-zA-Z])(?:\^\{?(\d+)\}?)?/g;
  let match: RegExpExecArray | null;

  while ((match = varRegex.exec(rest)) !== null) {
    const varName = match[1];
    const power = match[2] ? parseInt(match[2], 10) : 1;
    variables[varName] = (variables[varName] || 0) + power;
  }

  return {
    raw: clean,
    factor: { coefficient: coeff, variables },
  };
}

/**
 * Raises a monomial factor to a non-negative integer power k
 */
export function powerMonomial(m: Monomial, power: number): Monomial {
  if (power === 0) {
    return {
      raw: '1',
      factor: { coefficient: 1, variables: {} },
    };
  }

  const newCoeff = Math.pow(m.factor.coefficient, power);
  const newVars: Record<string, number> = {};
  for (const [v, p] of Object.entries(m.factor.variables)) {
    newVars[v] = p * power;
  }

  const raw = formatMonomialLatex({ coefficient: newCoeff, variables: newVars });
  return {
    raw,
    factor: { coefficient: newCoeff, variables: newVars },
  };
}

/**
 * Multiplies two monomial factors
 */
export function multiplyFactors(
  f1: AlgebraicFactor,
  f2: AlgebraicFactor,
  sign: 1 | -1 = 1
): AlgebraicFactor {
  const coeff = f1.coefficient * f2.coefficient * sign;
  const variables: Record<string, number> = { ...f1.variables };

  for (const [v, p] of Object.entries(f2.variables)) {
    variables[v] = (variables[v] || 0) + p;
  }

  return { coefficient: coeff, variables };
}

/**
 * Formats an algebraic factor into clean LaTeX
 */
export function formatMonomialLatex(
  factor: AlgebraicFactor,
  includePositiveSign: boolean = false
): string {
  const coeff = factor.coefficient;
  const varKeys = Object.keys(factor.variables)
    .filter((k) => factor.variables[k] > 0)
    .sort();

  if (varKeys.length === 0) {
    // Pure number
    if (coeff >= 0 && includePositiveSign) return `+${coeff}`;
    return `${coeff}`;
  }

  let result = '';
  if (coeff === 1) {
    result = includePositiveSign ? '+' : '';
  } else if (coeff === -1) {
    result = '-';
  } else if (coeff > 0) {
    result = includePositiveSign ? `+${coeff}` : `${coeff}`;
  } else {
    result = `${coeff}`;
  }

  for (const v of varKeys) {
    const pow = factor.variables[v];
    if (pow === 1) {
      result += v;
    } else {
      result += `${v}^{${pow}}`;
    }
  }

  return result || '0';
}

/**
 * Formats a base for display when raised to an exponent
 * e.g. 2x -> (2x), x -> x or (x)
 */
export function formatBaseLatex(m: Monomial, forceParens: boolean = true): string {
  const formatted = formatMonomialLatex(m.factor);
  const isSingleVar =
    m.factor.coefficient === 1 &&
    Object.keys(m.factor.variables).length === 1 &&
    Object.values(m.factor.variables)[0] === 1;

  if (forceParens) {
    return isSingleVar ? `(${formatted})` : `(${formatted})`;
  }
  return formatted;
}

/**
 * Determine the quotient case and its theoretical validity
 */
export function determineCase(
  numSign: '+' | '-',
  denSign: '+' | '-',
  n: number
): {
  identifiedCase: QuotientCase;
  caseName: string;
  caseFormula: string;
  isValid: boolean;
  validityCondition: string;
  remainderExplanation?: string;
  signPatternDescription: string;
} {
  const isEven = n % 2 === 0;

  if (numSign === '-' && denSign === '-') {
    return {
      identifiedCase: 'CASO_1',
      caseName: 'Caso 1: Diferencia entre Diferencia',
      caseFormula: '\\frac{a^n - b^n}{a - b}',
      isValid: true,
      validityCondition: `Es un cociente notable exacto para todo exponente entero positivo (aquí n = ${n} ≥ 1).`,
      signPatternDescription: 'Todos los términos del desarrollo tienen signo positivo (+).',
    };
  }

  if (numSign === '-' && denSign === '+') {
    if (isEven) {
      return {
        identifiedCase: 'CASO_2',
        caseName: 'Caso 2: Diferencia entre Suma (n Par)',
        caseFormula: '\\frac{a^n - b^n}{a + b}',
        isValid: true,
        validityCondition: `n = ${n} es PAR, por lo tanto es un cociente notable exacto.`,
        signPatternDescription: 'Los signos del desarrollo se alternan: (+, -, +, -, ..., -).',
      };
    } else {
      return {
        identifiedCase: 'CASO_2',
        caseName: 'Caso 2: Diferencia entre Suma (n Impar - No Válido)',
        caseFormula: '\\frac{a^n - b^n}{a + b}',
        isValid: false,
        validityCondition: `n = ${n} es IMPAR. NO es un cociente notable exacto.`,
        remainderExplanation: `Aplicando el Teorema del Resto (haciendo el divisor a + b = 0 ⇒ a = -b): R = (-b)^${n} - b^${n} = -b^${n} - b^${n} = -2b^${n} ≠ 0. Al dejar residuo no nulo, no genera un cociente notable exacto.`,
        signPatternDescription: 'No aplicable (deja residuo).',
      };
    }
  }

  if (numSign === '+' && denSign === '+') {
    if (!isEven) {
      return {
        identifiedCase: 'CASO_3',
        caseName: 'Caso 3: Suma entre Suma (n Impar)',
        caseFormula: '\\frac{a^n + b^n}{a + b}',
        isValid: true,
        validityCondition: `n = ${n} es IMPAR, por lo tanto es un cociente notable exacto.`,
        signPatternDescription: 'Los signos del desarrollo se alternan: (+, -, +, -, ..., +).',
      };
    } else {
      return {
        identifiedCase: 'CASO_3',
        caseName: 'Caso 3: Suma entre Suma (n Par - No Válido)',
        caseFormula: '\\frac{a^n + b^n}{a + b}',
        isValid: false,
        validityCondition: `n = ${n} es PAR. NO es un cociente notable exacto.`,
        remainderExplanation: `Aplicando el Teorema del Resto (haciendo el divisor a + b = 0 ⇒ a = -b): R = (-b)^${n} + b^${n} = b^${n} + b^${n} = 2b^${n} ≠ 0 (para n par, (-b)^n = b^n). Por tanto, la división deja residuo de 2b^${n} y no es exacta.`,
        signPatternDescription: 'No aplicable (deja residuo).',
      };
    }
  }

  // Case 4: numSign === '+' && denSign === '-'
  return {
    identifiedCase: 'CASO_4',
    caseName: 'Caso 4: Suma entre Diferencia (Nunca Válido)',
    caseFormula: '\\frac{a^n + b^n}{a - b}',
    isValid: false,
    validityCondition: `NO es cociente notable para ningún n entero positivo (aquí n = ${n}).`,
    remainderExplanation: `Aplicando el Teorema del Resto (haciendo divisor a - b = 0 ⇒ a = b): R = (b)^${n} + b^${n} = 2b^${n} ≠ 0 para todo n entero positivo. La división siempre deja residuo de 2b^${n} y nunca es exacta.`,
    signPatternDescription: 'No aplicable (deja residuo constante de 2b^n).',
  };
}

/**
 * Builds the full step-by-step resolution of a notable quotient
 */
export function solveNotableQuotient(spec: QuotientSpec): QuotientResolution {
  const { n, numSign, denSign } = spec;
  const parsedA = spec.parsedA;
  const parsedB = spec.parsedB;

  const caseInfo = determineCase(numSign, denSign, n);

  const baseALatex = formatBaseLatex(parsedA, false);
  const baseBLatex = formatBaseLatex(parsedB, false);

  const standardFormLatex = `\\frac{(${baseALatex})^{${n}} ${numSign} (${baseBLatex})^{${n}}}{(${baseALatex}) ${denSign} (${baseBLatex})}`;

  // Theoretical scheme
  let theoreticalSchemeLatex = '';
  if (denSign === '-') {
    theoreticalSchemeLatex = `\\frac{a^n - b^n}{a - b} = a^{n-1} + a^{n-2}b + a^{n-3}b^2 + \\dots + b^{n-1}`;
  } else {
    theoreticalSchemeLatex = `\\frac{a^n ${numSign} b^n}{a + b} = a^{n-1} - a^{n-2}b + a^{n-3}b^2 - \\dots ${
      n % 2 === 0 ? '- b^{n-1}' : '+ b^{n-1}'
    }`;
  }

  const terms: TermCalculation[] = [];
  const simplifiedTermsLatex: string[] = [];

  for (let k = 1; k <= n; k++) {
    // Determine sign:
    // If denSign === '-', all signs are '+'
    // If denSign === '+', signs are alternating: k odd => '+', k even => '-'
    let termSign: '+' | '-' = '+';
    if (denSign === '+') {
      termSign = k % 2 === 1 ? '+' : '-';
    }

    const expA = n - k;
    const expB = k - 1;

    // Power representations
    const baseAParen = formatBaseLatex(parsedA, true);
    const baseBParen = formatBaseLatex(parsedB, true);

    const subLatex = `${termSign} (${baseALatex})^{${expA}} \\cdot (${baseBLatex})^{${expB}}`;

    // Compute powers
    const powAFactor = powerMonomial(parsedA, expA).factor;
    const powBFactor = powerMonomial(parsedB, expB).factor;

    const powALatex = formatMonomialLatex(powAFactor);
    const powBLatex = formatMonomialLatex(powBFactor);

    let intermediateLatex = '';
    if (expA === 0 && expB === 0) {
      intermediateLatex = `${termSign} (1) \\cdot (1)`;
    } else if (expA === 0) {
      intermediateLatex = `${termSign} (1) \\cdot (${powBLatex})`;
    } else if (expB === 0) {
      intermediateLatex = `${termSign} (${powALatex}) \\cdot (1)`;
    } else {
      intermediateLatex = `${termSign} (${powALatex}) \\cdot (${powBLatex})`;
    }

    // Multiply terms
    const finalFactor = multiplyFactors(powAFactor, powBFactor, 1);
    const simplifiedLatex = formatMonomialLatex(finalFactor, false);

    terms.push({
      k,
      sign: termSign,
      expA,
      expB,
      substitutionLatex: subLatex,
      intermediateLatex,
      simplifiedLatex,
      rawText: `${termSign} ${simplifiedLatex}`,
    });

    if (k === 1) {
      simplifiedTermsLatex.push(termSign === '-' ? `-${simplifiedLatex}` : simplifiedLatex);
    } else {
      simplifiedTermsLatex.push(`${termSign} ${simplifiedLatex}`);
    }
  }

  const finalPolynomialLatex = simplifiedTermsLatex.join(' ');

  // Create an engaging checking question tailored to this resolution
  const targetK = Math.min(Math.max(2, Math.floor(n / 2) + 1), n);
  const correctTerm = terms.find((t) => t.k === targetK) || terms[0];

  // Distractors
  const oppositeSign = correctTerm.sign === '+' ? '-' : '+';
  const distractor1 = `${oppositeSign} ${correctTerm.simplifiedLatex}`;
  const distractor2 = terms[targetK - 2]
    ? `${terms[targetK - 2].sign} ${terms[targetK - 2].simplifiedLatex}`
    : `+ ${correctTerm.simplifiedLatex}y`;
  const distractor3 = terms[targetK]
    ? `${terms[targetK].sign} ${terms[targetK].simplifiedLatex}`
    : `- ${correctTerm.simplifiedLatex}x`;

  const options = [
    `${correctTerm.sign} ${correctTerm.simplifiedLatex}`,
    distractor1,
    distractor2,
    distractor3,
  ].filter((v, idx, arr) => arr.indexOf(v) === idx);

  // Ensure 4 distinct options
  while (options.length < 4) {
    options.push(`+ ${targetK}${baseALatex}${baseBLatex}`);
  }

  // Shuffle options deterministically for stability
  const correctStr = `${correctTerm.sign} ${correctTerm.simplifiedLatex}`;
  const shuffled = [...options].sort((a, b) => a.localeCompare(b));
  const correctIndex = shuffled.indexOf(correctStr);

  const signRuleExplanation =
    denSign === '-'
      ? 'Como el divisor es (a - b), todos los términos son positivos (+).'
      : `Como el divisor es (a + b), el signo del término k=${targetK} viene dado por (-1)^{${
          targetK - 1
        }} = ${correctTerm.sign}.`;

  const question = {
    prompt: `¿Cuál es el valor exacto del término de lugar k = ${targetK} (T_{${targetK}}) calculado directamente con la fórmula general?`,
    kTarget: targetK,
    options: shuffled,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Aplicando la fórmula del término general: T_${targetK} = (signo) \\cdot (a)^{${
      n - targetK
    }} \\cdot (b)^{${targetK - 1}}. ${signRuleExplanation} Sustituyendo: ${
      correctTerm.substitutionLatex
    } = ${correctStr}.`,
  };

  return {
    spec,
    identifiedCase: caseInfo.identifiedCase,
    caseName: caseInfo.caseName,
    caseFormula: caseInfo.caseFormula,
    isValid: caseInfo.isValid,
    validityCondition: caseInfo.validityCondition,
    remainderExplanation: caseInfo.remainderExplanation,
    numTerms: n,
    signPatternDescription: caseInfo.signPatternDescription,
    theoreticalSchemeLatex,
    terms,
    finalPolynomialLatex,
    standardFormLatex,
    question,
  };
}

/**
 * Intelligent parser for user-entered algebraic expressions
 * Handles formats like:
 * - (16x^4 - 81y^4)/(2x - 3y)
 * - (x^5 + 32)/(x + 2)
 * - (x^6 - y^6)/(x + y)
 * - \frac{16x^4 - 81y^4}{2x - 3y}
 * - (x^20 - y^30)/(x^4 - y^6)
 */
export function parseAlgebraicQuotient(rawText: string): {
  success: boolean;
  spec?: QuotientSpec;
  error?: string;
} {
  let cleaned = normalizeSuperscripts(rawText.trim());
  // Strip LaTeX \frac{num}{den} if present
  const fracMatch = cleaned.match(/\\frac\s*\{([^}]+)\}\s*\{([^}]+)\}/);
  let numStr = '';
  let denStr = '';

  if (fracMatch) {
    numStr = stripOuterParentheses(fracMatch[1].trim());
    denStr = stripOuterParentheses(fracMatch[2].trim());
  } else {
    // Normal slash split
    const parts = cleaned.split('/');
    if (parts.length !== 2) {
      return {
        success: false,
        error:
          'Formato no reconocido. Por favor ingresa una división con barra "/" como (16x^4 - 81y^4)/(2x - 3y) o usa las teclas rápidas.',
      };
    }
    numStr = stripOuterParentheses(parts[0]);
    denStr = stripOuterParentheses(parts[1]);
  }

  // Identify sign in numerator: A + B or A - B
  // We need to split numerator by + or - (taking into account leading sign if any)
  const numSplit = splitBinomial(numStr);
  const denSplit = splitBinomial(denStr);

  if (!numSplit || !denSplit) {
    return {
      success: false,
      error:
        'Tanto el numerador como el denominador deben ser binomios de la forma A ± B y a ± b.',
    };
  }

  const { term1: numTerm1, sign: numSign, term2: numTerm2 } = numSplit;
  const { term1: denTerm1, sign: denSign, term2: denTerm2 } = denSplit;

  const parsedDenA = parseMonomial(denTerm1);
  const parsedDenB = parseMonomial(denTerm2);
  const parsedNumA = parseMonomial(numTerm1);
  const parsedNumB = parseMonomial(numTerm2);

  // Determine exponent n:
  // Check power ratio of variables
  let nFromVars: number | null = null;

  // Check variables in A
  const denVarsA = Object.keys(parsedDenA.factor.variables);
  if (denVarsA.length > 0) {
    const v = denVarsA[0];
    const denPow = parsedDenA.factor.variables[v];
    const numPow = parsedNumA.factor.variables[v] || 0;
    if (denPow > 0 && numPow > 0 && numPow % denPow === 0) {
      nFromVars = numPow / denPow;
    }
  }

  // Check variables in B if needed
  if (!nFromVars) {
    const denVarsB = Object.keys(parsedDenB.factor.variables);
    if (denVarsB.length > 0) {
      const v = denVarsB[0];
      const denPow = parsedDenB.factor.variables[v];
      const numPow = parsedNumB.factor.variables[v] || 0;
      if (denPow > 0 && numPow > 0 && numPow % denPow === 0) {
        nFromVars = numPow / denPow;
      }
    }
  }

  // Check numeric coefficients if bases have numbers
  let nFromCoeff: number | null = null;
  const cDenA = parsedDenA.factor.coefficient;
  const cNumA = parsedNumA.factor.coefficient;

  if (cDenA > 1 && cNumA > 1) {
    const nLog = Math.round(Math.log(cNumA) / Math.log(cDenA));
    if (Math.pow(cDenA, nLog) === cNumA) {
      nFromCoeff = nLog;
    }
  }

  const cDenB = parsedDenB.factor.coefficient;
  const cNumB = parsedNumB.factor.coefficient;
  if (!nFromCoeff && cDenB > 1 && cNumB > 1) {
    const nLog = Math.round(Math.log(cNumB) / Math.log(cDenB));
    if (Math.pow(cDenB, nLog) === cNumB) {
      nFromCoeff = nLog;
    }
  }

  const n = nFromVars || nFromCoeff || 1;

  if (n < 1 || n > 20) {
    return {
      success: false,
      error: `Exponente calculado n = ${n} fuera de rango didáctico (debe ser 1 ≤ n ≤ 20). Revisa las potencias de los términos.`,
    };
  }

  // Verify consistency
  // DenA^n should match NumA
  const testA = powerMonomial(parsedDenA, n);
  const testB = powerMonomial(parsedDenB, n);

  const spec: QuotientSpec = {
    rawInput: rawText,
    baseA: denTerm1,
    baseB: denTerm2,
    parsedA: parsedDenA,
    parsedB: parsedDenB,
    numSign,
    denSign,
    n,
  };

  return {
    success: true,
    spec,
  };
}

/**
 * Splits a string like "16x^4 - 81y^4" into term1: "16x^4", sign: "-", term2: "81y^4"
 */
function splitBinomial(str: string): { term1: string; sign: '+' | '-'; term2: string } | null {
  const trimmed = str.trim();
  // Find index of '+' or '-' that is not inside braces or at the very beginning
  let depth = 0;
  for (let i = 1; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (char === '{' || char === '(') depth++;
    else if (char === '}' || char === ')') depth--;
    else if (depth === 0 && (char === '+' || char === '-')) {
      const term1 = trimmed.slice(0, i).trim();
      const sign = char as '+' | '-';
      const term2 = trimmed.slice(i + 1).trim();
      if (term1 && term2) {
        return { term1, sign, term2 };
      }
    }
  }
  return null;
}
