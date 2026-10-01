import {
  FactorizationCaseType,
  FactorizationResult,
  FactorizationStep,
} from '../types/factorization';
import {
  formatMonomialLatex,
  normalizeSuperscripts,
  parseMonomial,
  powerMonomial,
  stripOuterParentheses,
  multiplyFactors,
} from './algebra';

/**
 * Universal Factorization Solver
 * Solves single polynomials (e.g. 16x^4 - 81y^4, x^2 - 9, x^3 + 27, x^2 + 5x + 6)
 * OR algebraic fractions (e.g. (16x^4 - 81y^4)/(2x - 3y)) by factoring the numerator
 * and cancelling with the denominator using factoring theorems.
 */
export function solveByFactorization(rawInput: string): FactorizationResult {
  const cleanInput = normalizeSuperscripts(rawInput.trim());

  // Check if it's a fraction A / B
  let numStr = cleanInput;
  let denStr: string | undefined = undefined;
  let isFraction = false;

  const fracMatch = cleanInput.match(/\\frac\s*\{([^}]+)\}\s*\{([^}]+)\}/);
  if (fracMatch) {
    isFraction = true;
    numStr = stripOuterParentheses(fracMatch[1]);
    denStr = stripOuterParentheses(fracMatch[2]);
  } else if (cleanInput.includes('/')) {
    const parts = cleanInput.split('/');
    if (parts.length === 2 && parts[1].trim()) {
      isFraction = true;
      numStr = stripOuterParentheses(parts[0]);
      denStr = stripOuterParentheses(parts[1]);
    }
  }

  // Check if numerator is a trinomial: e.g. x^2 + 5x + 6, x^2 - 6x + 9
  const trinomialMatch = matchTrinomial(numStr);
  if (trinomialMatch) {
    return solveTrinomial(cleanInput, numStr, denStr, isFraction, trinomialMatch);
  }

  // Parse as binomial: A + B or A - B
  const binomial = splitBinomialTerms(numStr);
  if (binomial) {
    return solveBinomialFactorization(cleanInput, numStr, denStr, isFraction, binomial);
  }

  // Fallback for simple common factor or single term
  return solveGenericPolynomial(cleanInput, numStr, denStr, isFraction);
}

/**
 * Handles Trinomials: x^2 + bx + c or ax^2 + bx + c
 */
function matchTrinomial(str: string): { a: number; b: number; c: number; varName: string } | null {
  const clean = str.replace(/\s+/g, '');
  // Match e.g. x^2 + 5x + 6 or x^2 - 6x + 9 or 2x^2 + 7x + 3
  const regex = /^([+-]?\d*)?([a-zA-Z])\^2([+-]\d+)?\2([+-]\d+)$/;
  const match = clean.match(regex);
  if (!match) return null;

  const aRaw = match[1];
  let a = 1;
  if (aRaw === '-' || aRaw === '-1') a = -1;
  else if (aRaw && aRaw !== '+') a = parseInt(aRaw, 10);

  const varName = match[2];

  const bRaw = match[3];
  let b = 1;
  if (bRaw) {
    if (bRaw === '+') b = 1;
    else if (bRaw === '-') b = -1;
    else b = parseInt(bRaw, 10);
  }

  const cRaw = match[4];
  const c = parseInt(cRaw, 10);

  return { a, b, c, varName };
}

function solveTrinomial(
  rawInput: string,
  numStr: string,
  denStr: string | undefined,
  isFraction: boolean,
  tri: { a: number; b: number; c: number; varName: string }
): FactorizationResult {
  const { a, b, c, varName } = tri;
  const steps: FactorizationStep[] = [];

  // Check if it's Trinomio Cuadrado Perfecto (TCP): b^2 = 4ac
  const isTCP = b * b === 4 * a * c;

  if (isTCP && a > 0 && c > 0) {
    const sqrtA = Math.round(Math.sqrt(a));
    const sqrtC = Math.round(Math.sqrt(c));
    const sign = b > 0 ? '+' : '-';
    const baseA = sqrtA === 1 ? varName : `${sqrtA}${varName}`;
    const baseB = `${sqrtC}`;
    const factored = `(${baseA} ${sign} ${baseB})^2`;

    steps.push({
      title: 'Paso 1: Extracción de raíces cuadradas de los extremos',
      description: `Verificamos los extremos del trinomio:\n• Raíz del primer término: \\sqrt{${a === 1 ? '' : a}${varName}^2} = ${baseA}\n• Raíz del tercer término: \\sqrt{${c}} = ${baseB}`,
      mathLatex: `\\sqrt{${a === 1 ? '' : a}${varName}^2} = ${baseA}, \\quad \\sqrt{${c}} = ${baseB}`,
    });

    steps.push({
      title: 'Paso 2: Comprobación del doble producto del medio',
      description: `El término central debe ser exactamente el doble producto de las dos raíces halladas: 2 \\cdot (${baseA}) \\cdot (${baseB}) = ${Math.abs(b)}${varName}. ¡Cumple la condición de Trinomio Cuadrado Perfecto!`,
      mathLatex: `2 \\cdot (${baseA}) \\cdot (${baseB}) = ${Math.abs(b)}${varName}`,
      highlight: 'Trinomio Cuadrado Perfecto verificado',
    });

    steps.push({
      title: 'Paso 3: Expresión en factor cuadrado',
      description: `Se agrupan las raíces separadas por el signo del término medio (${sign}) y se eleva todo al cuadrado:`,
      mathLatex: `${numStr} = (${baseA} ${sign} ${baseB})^2`,
    });

    let cancellationLatex: string | undefined = undefined;
    let finalResult = factored;

    if (isFraction && denStr) {
      const denClean = denStr.replace(/\s+/g, '');
      const expectedFactor = `${baseA}${sign}${baseB}`;
      if (denClean === expectedFactor || denClean === `(${expectedFactor})`) {
        cancellationLatex = `\\frac{(${baseA} ${sign} ${baseB})(${baseA} ${sign} ${baseB})}{${denStr}} = (${baseA} ${sign} ${baseB})`;
        finalResult = `${baseA} ${sign} ${baseB}`;
        steps.push({
          title: 'Paso 4: Simplificación con el denominador',
          description: `Cancelamos el factor común (${baseA} ${sign} ${baseB}) presente en el numerador y denominador:`,
          mathLatex: cancellationLatex,
        });
      }
    }

    return {
      rawInput,
      isFraction,
      numeratorStr: numStr,
      denominatorStr: denStr,
      caseKey: 'TRINOMIO_CUADRADO_PERFECTO',
      caseName: 'Trinomio Cuadrado Perfecto (TCP)',
      caseRuleFormula: 'a^2 \\pm 2ab + b^2 = (a \\pm b)^2',
      baseA,
      baseB,
      steps,
      factoredNumeratorLatex: factored,
      cancellationLatex,
      finalResultLatex: finalResult,
      pedagogicalNote: 'Un trinomio cuadrado perfecto es el desarrollo de un binomio al cuadrado.',
      verificationLatex: `(${baseA} ${sign} ${baseB})^2 = ${numStr}`,
    };
  }

  // Trinomio de la forma x^2 + bx + c (a = 1)
  if (a === 1) {
    // Find two numbers p, q such that p + q = b and p * q = c
    let p = 0, q = 0;
    let found = false;
    for (let testP = -Math.abs(c * 2); testP <= Math.abs(c * 2); testP++) {
      if (testP === 0) continue;
      if (c % testP === 0) {
        const testQ = c / testP;
        if (testP + testQ === b) {
          p = testP;
          q = testQ;
          found = true;
          break;
        }
      }
    }

    if (found) {
      const signP = p >= 0 ? `+ ${p}` : `- ${Math.abs(p)}`;
      const signQ = q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`;
      const factored = `(${varName} ${signP})(${varName} ${signQ})`;

      steps.push({
        title: 'Paso 1: Búsqueda de dos números clave (p y q)',
        description: `Buscamos dos números que cumplan simultáneamente:\n• Sumados den el coeficiente del medio: p + q = ${b}\n• Multiplicados den el término independiente: p \\cdot q = ${c}\nLos números encontrados son: p = ${p} y q = ${q}.`,
        mathLatex: `p + q = ${p} + (${q}) = ${b}, \\quad p \\cdot q = (${p})(${q}) = ${c}`,
      });

      steps.push({
        title: 'Paso 2: Construcción de los factores binomios',
        description: `Escribimos el producto de los dos binomios con la variable ${varName} y los valores hallados:`,
        mathLatex: `${numStr} = (${varName} ${signP})(${varName} ${signQ})`,
      });

      let cancellationLatex: string | undefined = undefined;
      let finalResult = factored;

      if (isFraction && denStr) {
        const denClean = denStr.replace(/\s+/g, '').replace(/^\(|\)$/g, '');
        if (denClean === `${varName}+${p}` || denClean === `${varName}${p}`) {
          cancellationLatex = `\\frac{(${varName} ${signP})(${varName} ${signQ})}{${denStr}} = (${varName} ${signQ})`;
          finalResult = `${varName} ${signQ}`;
        } else if (denClean === `${varName}+${q}` || denClean === `${varName}${q}`) {
          cancellationLatex = `\\frac{(${varName} ${signP})(${varName} ${signQ})}{${denStr}} = (${varName} ${signP})`;
          finalResult = `${varName} ${signP}`;
        }
        if (cancellationLatex) {
          steps.push({
            title: 'Paso 3: Cancelación del factor común en la fracción',
            description: `Cancelamos el binomio idéntico entre el numerador y el denominador:`,
            mathLatex: cancellationLatex,
          });
        }
      }

      return {
        rawInput,
        isFraction,
        numeratorStr: numStr,
        denominatorStr: denStr,
        caseKey: 'TRINOMIO_SIMPLE',
        caseName: 'Trinomio de la forma x² + bx + c',
        caseRuleFormula: 'x^2 + (p+q)x + pq = (x + p)(x + q)',
        baseA: `${varName} ${signP}`,
        baseB: `${varName} ${signQ}`,
        steps,
        factoredNumeratorLatex: factored,
        cancellationLatex,
        finalResultLatex: finalResult,
        pedagogicalNote: 'Se descompone en dos binomios con término común sumando y multiplicando los términos independientes.',
        verificationLatex: `(${varName} ${signP})(${varName} ${signQ}) = ${numStr}`,
      };
    }
  }

  return solveGenericPolynomial(rawInput, numStr, denStr, isFraction);
}

/**
 * Handles Binomials: A^2 - B^2, A^3 +- B^3, A^n +- B^n
 */
function solveBinomialFactorization(
  rawInput: string,
  numStr: string,
  denStr: string | undefined,
  isFraction: boolean,
  binom: { term1: string; sign: '+' | '-'; term2: string }
): FactorizationResult {
  const steps: FactorizationStep[] = [];
  const { term1, sign: numSign, term2 } = binom;

  const parsedA = parseMonomial(term1);
  const parsedB = parseMonomial(term2);

  // If denominator is present, parse denominator bases
  let denParsedA = parsedA;
  let denParsedB = parsedB;
  let denSign: '+' | '-' = '-';
  let denRawA = term1;
  let denRawB = term2;

  if (isFraction && denStr) {
    const denBinom = splitBinomialTerms(denStr);
    if (denBinom) {
      denSign = denBinom.sign;
      denRawA = denBinom.term1;
      denRawB = denBinom.term2;
      denParsedA = parseMonomial(denRawA);
      denParsedB = parseMonomial(denRawB);
    }
  }

  // Determine exponent n:
  // Check power ratios
  let n = 1;

  // From variables
  const numVarsA = Object.keys(parsedA.factor.variables);
  const denVarsA = Object.keys(denParsedA.factor.variables);
  if (numVarsA.length > 0 && denVarsA.length > 0 && numVarsA[0] === denVarsA[0]) {
    const v = numVarsA[0];
    const nPow = parsedA.factor.variables[v];
    const dPow = denParsedA.factor.variables[v];
    if (dPow > 0 && nPow % dPow === 0) {
      n = nPow / dPow;
    }
  } else if (numVarsA.length > 0) {
    const v = numVarsA[0];
    n = parsedA.factor.variables[v];
  }

  // From coefficients
  const cNumA = parsedA.factor.coefficient;
  const cDenA = denParsedA.factor.coefficient;
  if (cDenA > 1 && cNumA > 1) {
    const logVal = Math.round(Math.log(cNumA) / Math.log(cDenA));
    if (Math.pow(cDenA, logVal) === cNumA) {
      n = logVal;
    }
  } else if (cNumA > 1 && n === 1) {
    // Try to see if it's a perfect square (4, 9, 16, 25, 36, 49, 64, 81, 100) or cube (8, 27, 64, 125)
    const sqrtVal = Math.round(Math.sqrt(cNumA));
    const cbrtVal = Math.round(Math.cbrt(cNumA));
    if (sqrtVal * sqrtVal === cNumA) n = 2;
    else if (cbrtVal * cbrtVal * cbrtVal === cNumA) n = 3;
  }

  // Base representations
  const baseALatex = isFraction ? denRawA : formatBaseMonomial(parsedA, n);
  const baseBLatex = isFraction ? denRawB : formatBaseMonomial(parsedB, n);

  // CASE 1: DIFERENCIA DE CUADRADOS (n = 2, numSign = '-')
  if (n === 2 && numSign === '-') {
    const factored = `(${baseALatex} - ${baseBLatex})(${baseALatex} + ${baseBLatex})`;

    steps.push({
      title: 'Paso 1: Identificación del Caso de Factorización',
      description: `La expresión es una resta de dos términos que tienen raíz cuadrada exacta: **Diferencia de Cuadrados Perfectos**.`,
      mathLatex: `A^2 - B^2 = (A - B)(A + B)`,
      highlight: 'Caso IV: Diferencia de Cuadrados',
    });

    steps.push({
      title: 'Paso 2: Extracción de las raíces cuadradas',
      description: `Calculamos la raíz cuadrada de cada término:\n• Raíz de ${term1}: \\sqrt{${term1}} = ${baseALatex}\n• Raíz de ${term2}: \\sqrt{${term2}} = ${baseBLatex}`,
      mathLatex: `\\sqrt{${term1}} = ${baseALatex}, \\quad \\sqrt{${term2}} = ${baseBLatex}`,
    });

    steps.push({
      title: 'Paso 3: Expresión factorizada como producto de suma por diferencia',
      description: `Multiplicamos la resta de las raíces por la suma de las raíces:`,
      mathLatex: `${numStr} = (${baseALatex} - ${baseBLatex})(${baseALatex} + ${baseBLatex})`,
    });

    let cancellationLatex: string | undefined = undefined;
    let finalResult = factored;

    if (isFraction && denStr) {
      const denClean = denStr.replace(/\s+/g, '').replace(/^\(|\)$/g, '');
      const factorMinus = `${baseALatex}-${baseBLatex}`.replace(/\s+/g, '');
      const factorPlus = `${baseALatex}+${baseBLatex}`.replace(/\s+/g, '');

      if (denClean === factorMinus) {
        cancellationLatex = `\\frac{(${baseALatex} - ${baseBLatex})(${baseALatex} + ${baseBLatex})}{${denStr}} = ${baseALatex} + ${baseBLatex}`;
        finalResult = `${baseALatex} + ${baseBLatex}`;
      } else if (denClean === factorPlus) {
        cancellationLatex = `\\frac{(${baseALatex} - ${baseBLatex})(${baseALatex} + ${baseBLatex})}{${denStr}} = ${baseALatex} - ${baseBLatex}`;
        finalResult = `${baseALatex} - ${baseBLatex}`;
      }

      if (cancellationLatex) {
        steps.push({
          title: 'Paso 4: Cancelación de factor idéntico en la fracción',
          description: `Al simplificar la fracción, el binomio del divisor se cancela exactamente con uno de los factores del numerador:`,
          mathLatex: cancellationLatex,
        });
      }
    }

    return {
      rawInput,
      isFraction,
      numeratorStr: numStr,
      denominatorStr: denStr,
      caseKey: 'DIFERENCIA_CUADRADOS',
      caseName: 'Diferencia de Cuadrados Perfectos',
      caseRuleFormula: 'A^2 - B^2 = (A - B)(A + B)',
      baseA: baseALatex,
      baseB: baseBLatex,
      exponentN: 2,
      steps,
      factoredNumeratorLatex: factored,
      cancellationLatex,
      finalResultLatex: finalResult,
      pedagogicalNote: 'Toda diferencia de cuadrados se descompone en el producto de binomios conjugados (suma por su diferencia).',
      verificationLatex: `(${baseALatex} - ${baseBLatex})(${baseALatex} + ${baseBLatex}) = ${numStr}`,
    };
  }

  // CASE 2: SUMA O DIFERENCIA DE CUBOS (n = 3)
  if (n === 3) {
    const isSum = numSign === '+';
    const caseKey = isSum ? 'SUMA_CUBOS' : 'DIFERENCIA_CUBOS';
    const caseName = isSum ? 'Suma de Cubos Perfectos' : 'Diferencia de Cubos Perfectos';
    const sign1 = isSum ? '+' : '-';
    const sign2 = isSum ? '-' : '+';

    // Compute terms: A^2, AB, B^2
    const parsedBaseA = isFraction ? denParsedA : parseMonomial(baseALatex);
    const parsedBaseB = isFraction ? denParsedB : parseMonomial(baseBLatex);

    const a2 = formatMonomialLatex(powerMonomial(parsedBaseA, 2).factor);
    const ab = formatMonomialLatex(multiplyFactors(parsedBaseA.factor, parsedBaseB.factor));
    const b2 = formatMonomialLatex(powerMonomial(parsedBaseB, 2).factor);

    const trinomialFactor = `${a2} ${sign2} ${ab} + ${b2}`;
    const factored = `(${baseALatex} ${sign1} ${baseBLatex})(${trinomialFactor})`;

    steps.push({
      title: 'Paso 1: Identificación del Caso de Factorización',
      description: `Los dos términos son cubos perfectos separados por un signo (${numSign}). Corresponde a **${caseName}**.`,
      mathLatex: isSum
        ? 'A^3 + B^3 = (A + B)(A^2 - AB + B^2)'
        : 'A^3 - B^3 = (A - B)(A^2 + AB + B^2)',
      highlight: caseName,
    });

    steps.push({
      title: 'Paso 2: Extracción de las raíces cúbicas de cada término',
      description: `• Raíz cúbica de ${term1}: \\sqrt[3]{${term1}} = ${baseALatex}\n• Raíz cúbica de ${term2}: \\sqrt[3]{${term2}} = ${baseBLatex}`,
      mathLatex: `A = \\sqrt[3]{${term1}} = ${baseALatex}, \\quad B = \\sqrt[3]{${term2}} = ${baseBLatex}`,
    });

    steps.push({
      title: 'Paso 3: Construcción del factor trinomio (A² ∓ AB + B²)',
      description: `Calculamos cada componente del segundo factor:\n• A^2 = (${baseALatex})^2 = ${a2}\n• A \\cdot B = (${baseALatex})(${baseBLatex}) = ${ab}\n• B^2 = (${baseBLatex})^2 = ${b2}`,
      mathLatex: `(${baseALatex})^2 ${sign2} (${baseALatex})(${baseBLatex}) + (${baseBLatex})^2 = ${trinomialFactor}`,
    });

    steps.push({
      title: 'Paso 4: Expresión factorizada completa del numerador',
      description: `Multiplicamos el binomio de raíces por el trinomio resultante:`,
      mathLatex: `${numStr} = ${factored}`,
    });

    let cancellationLatex: string | undefined = undefined;
    let finalResult = factored;

    if (isFraction && denStr) {
      cancellationLatex = `\\frac{(${baseALatex} ${sign1} ${baseBLatex})(${trinomialFactor})}{(${baseALatex} ${sign1} ${baseBLatex})} = ${trinomialFactor}`;
      finalResult = trinomialFactor;
      steps.push({
        title: 'Paso 5: Cancelación de factores en la fracción algebraica',
        description: `Cancelamos el binomio común (${baseALatex} ${sign1} ${baseBLatex}) del divisor:`,
        mathLatex: cancellationLatex,
      });
    }

    return {
      rawInput,
      isFraction,
      numeratorStr: numStr,
      denominatorStr: denStr,
      caseKey,
      caseName,
      caseRuleFormula: isSum
        ? 'A^3 + B^3 = (A + B)(A^2 - AB + B^2)'
        : 'A^3 - B^3 = (A - B)(A^2 + AB + B^2)',
      baseA: baseALatex,
      baseB: baseBLatex,
      exponentN: 3,
      steps,
      factoredNumeratorLatex: factored,
      cancellationLatex,
      finalResultLatex: finalResult,
      pedagogicalNote:
        'La suma/diferencia de cubos se descompone en un binomio por un trinomio cuadrático irreducible.',
      verificationLatex: `${factored} = ${numStr}`,
    };
  }

  // CASE 3: SUMA O DIFERENCIA DE POTENCIAS IGUALES (CASO GENERAL n >= 4)
  // Ej: 16x^4 - 81y^4 = (2x - 3y)(8x^3 + 12x^2y + 18xy^2 + 27y^3)
  const isEven = n % 2 === 0;
  const parsedBaseA = isFraction ? denParsedA : parseMonomial(baseALatex);
  const parsedBaseB = isFraction ? denParsedB : parseMonomial(baseBLatex);

  // Generate polynomial quotient factor
  // For divisor (A - B): signs are all +
  // For divisor (A + B): signs alternate + - + -
  const divSign = isFraction && denStr ? denSign : numSign === '-' ? '-' : '+';
  const polyTerms: string[] = [];

  for (let k = 1; k <= n; k++) {
    const termSign = divSign === '-' ? '+' : k % 2 === 1 ? '+' : '-';
    const expA = n - k;
    const expB = k - 1;

    const powAFactor = powerMonomial(parsedBaseA, expA).factor;
    const powBFactor = powerMonomial(parsedBaseB, expB).factor;
    const multFactor = multiplyFactors(powAFactor, powBFactor);
    const simplified = formatMonomialLatex(multFactor, false);

    if (k === 1) {
      polyTerms.push(termSign === '-' ? `-${simplified}` : simplified);
    } else {
      polyTerms.push(`${termSign} ${simplified}`);
    }
  }

  const quotientPolyLatex = polyTerms.join(' ');
  const factored = `(${baseALatex} ${divSign} ${baseBLatex})(${quotientPolyLatex})`;

  steps.push({
    title: 'Paso 1: Identificación del Caso de Factorización',
    description: `Reescribimos la expresión reconociendo la potencia común n = ${n}:\n${numStr} = (${baseALatex})^${n} ${numSign} (${baseBLatex})^${n}.\nCorresponde al caso: **Factorización de Suma o Diferencia de Potencias Iguales (Caso X de Álgebra)**.`,
    mathLatex: `${numStr} = (${baseALatex})^{${n}} ${numSign} (${baseBLatex})^{${n}}`,
    highlight: `Caso X: Potencias Iguales (n = ${n})`,
  });

  steps.push({
    title: 'Paso 2: Extracción de las bases de la potencia',
    description: `Las bases que al elevarse a la potencia n = ${n} generan el binomio son:\n• Base primer término: A = ${baseALatex}\n• Base segundo término: B = ${baseBLatex}`,
    mathLatex: `A = ${baseALatex}, \\quad B = ${baseBLatex}, \\quad n = ${n}`,
  });

  steps.push({
    title: 'Paso 3: Construcción del factor cociente polinomial',
    description: `El segundo factor es un polinomio homogéneo de ${n} términos donde las potencias de (${baseALatex}) disminuyen desde ${
      n - 1
    } hasta 0 y las de (${baseBLatex}) aumentan desde 0 hasta ${n - 1}:`,
    mathLatex: quotientPolyLatex,
  });

  steps.push({
    title: 'Paso 4: Factorización completa en producto de factores',
    description: `El numerador queda descompuesto exactamente como:`,
    mathLatex: `${numStr} = (${baseALatex} ${divSign} ${baseBLatex})(${quotientPolyLatex})`,
  });

  let cancellationLatex: string | undefined = undefined;
  let finalResult = isFraction ? quotientPolyLatex : factored;

  if (isFraction && denStr) {
    cancellationLatex = `\\frac{(${baseALatex} ${divSign} ${baseBLatex})(${quotientPolyLatex})}{(${baseALatex} ${divSign} ${baseBLatex})} = ${quotientPolyLatex}`;
    steps.push({
      title: 'Paso 5: Cancelación y simplificación por división',
      description: `El factor común (${baseALatex} ${divSign} ${baseBLatex}) se cancela entre numerador y denominador, obteniendo el polinomio cociente:`,
      mathLatex: cancellationLatex,
    });
  }

  // Also note for difference of squares subfactor if n is multiple of 2
  if (n === 4 && numSign === '-') {
    const subSquares = `(${formatMonomialLatex(powerMonomial(parsedBaseA, 2).factor)} - ${formatMonomialLatex(
      powerMonomial(parsedBaseB, 2).factor
    )})(${formatMonomialLatex(powerMonomial(parsedBaseA, 2).factor)} + ${formatMonomialLatex(
      powerMonomial(parsedBaseB, 2).factor
    )})`;
    steps.push({
      title: 'Nota de Factorización Completa por Diferencia de Cuadrados',
      description: `También puede descomponerse sucesivamente por diferencia de cuadrados:\n${numStr} = ${subSquares} = (${baseALatex} - ${baseBLatex})(${baseALatex} + ${baseBLatex})(${formatMonomialLatex(
        powerMonomial(parsedBaseA, 2).factor
      )} + ${formatMonomialLatex(powerMonomial(parsedBaseB, 2).factor)})`,
      mathLatex: subSquares,
    });
  }

  return {
    rawInput,
    isFraction,
    numeratorStr: numStr,
    denominatorStr: denStr,
    caseKey:
      numSign === '-'
        ? divSign === '-'
          ? 'POTENCIAS_IGUALES_RESTA_RESTA'
          : 'POTENCIAS_IGUALES_RESTA_SUMA'
        : 'POTENCIAS_IGUALES_SUMA_SUMA',
    caseName: 'Suma o Diferencia de Potencias Iguales (Cociente Notable)',
    caseRuleFormula:
      numSign === '-'
        ? 'A^n - B^n = (A - B)(A^{n-1} + A^{n-2}B + \\dots + B^{n-1})'
        : 'A^n + B^n = (A + B)(A^{n-1} - A^{n-2}B + \\dots + B^{n-1})',
    baseA: baseALatex,
    baseB: baseBLatex,
    exponentN: n,
    steps,
    factoredNumeratorLatex: factored,
    cancellationLatex,
    finalResultLatex: finalResult,
    pedagogicalNote:
      'Al factorizar Aⁿ ± Bⁿ, el divisor se cancela exactamente por ser un factor primo del polinomio.',
    verificationLatex: `${factored} = ${numStr}`,
  };
}

/**
 * Splits binomial expression string into term1, sign, term2
 */
function splitBinomialTerms(str: string): { term1: string; sign: '+' | '-'; term2: string } | null {
  const trimmed = str.trim();
  let depth = 0;
  for (let i = 1; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (char === '(' || char === '{') depth++;
    else if (char === ')' || char === '}') depth--;
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

/**
 * Extracts base string given monomial and exponent n
 */
function formatBaseMonomial(m: ReturnType<typeof parseMonomial>, n: number): string {
  const coeff = m.factor.coefficient;
  let baseCoeff = 1;
  if (coeff > 1) {
    const root = Math.round(Math.pow(coeff, 1 / n));
    if (Math.pow(root, n) === coeff) {
      baseCoeff = root;
    } else {
      baseCoeff = coeff;
    }
  }

  const baseVars: Record<string, number> = {};
  for (const [v, p] of Object.entries(m.factor.variables)) {
    baseVars[v] = Math.max(1, Math.round(p / n));
  }

  return formatMonomialLatex({ coefficient: baseCoeff, variables: baseVars });
}

function solveGenericPolynomial(
  rawInput: string,
  numStr: string,
  denStr: string | undefined,
  isFraction: boolean
): FactorizationResult {
  return {
    rawInput,
    isFraction,
    numeratorStr: numStr,
    denominatorStr: denStr,
    caseKey: 'NO_FACTORIZABLE_EXACTO',
    caseName: 'Polinomio Algebraico General',
    caseRuleFormula: 'P(x) = Q(x) \\cdot D(x) + R(x)',
    baseA: numStr,
    baseB: denStr || '1',
    steps: [
      {
        title: 'Análisis de la expresión',
        description: `Se analiza la expresión ingresada: ${numStr}.`,
        mathLatex: numStr,
      },
    ],
    factoredNumeratorLatex: numStr,
    finalResultLatex: numStr,
    pedagogicalNote: 'Introduce un binomio o trinomio factorizable para ver el desglose paso a paso.',
    verificationLatex: numStr,
  };
}
