import { QuotientResolution } from '../types/math';

export function formatResolutionAsMarkdown(res: QuotientResolution): string {
  const {
    spec,
    standardFormLatex,
    identifiedCase,
    caseName,
    validityCondition,
    numTerms,
    theoreticalSchemeLatex,
    terms,
    finalPolynomialLatex,
    question,
    isValid,
    remainderExplanation,
  } = res;

  let termsList = '';
  for (const t of terms) {
    termsList += `   * $T_{${t.k}} = ${t.substitutionLatex} = ${t.intermediateLatex} = ${t.sign} ${t.simplifiedLatex}$\n`;
  }

  let text = `🧮 **SIMULADOR DE COCIENTES NOTABLES**
---
* **Expresión Ingresada:** ${spec.rawInput}
* **Forma Estándar Identificada:** $${standardFormLatex}$ con $a = ${spec.baseA}$, $b = ${spec.baseB}$, $n = ${spec.n}$
* **Caso Aplicado:** ${caseName}
* **Condición de Validez:** ${validityCondition}
* **Número de Términos:** $n = ${numTerms}$

`;

  if (!isValid && remainderExplanation) {
    text += `⚠️ **ANÁLISIS DE RESIDUO:**
${remainderExplanation}

`;
  }

  text += `📐 **DESGLOSE PASO A PASO**
1. **Esquema Teórico:**
   $$${theoreticalSchemeLatex}$$
2. **Cálculo Término a Término ($T_1$ a $T_{${numTerms}}$):**
${termsList}
✅ **RESULTADO FINAL RECOGIDO**
$$${finalPolynomialLatex}$$

🎯 **PREGUNTA COMPROBATORIA**
${question.prompt}
* Respuesta correcta: $${question.options[question.correctIndex]}$
* Explicación: ${question.explanation}
`;

  return text;
}
