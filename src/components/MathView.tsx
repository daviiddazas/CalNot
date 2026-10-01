import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return `<span class="text-rose-400 font-mono">${math}</span>`;
    }
  }, [math, block]);

  const defaultColor = className.includes('text-') ? '' : 'text-slate-100';

  if (block) {
    return (
      <div
        className={`overflow-x-auto py-1 text-center font-serif ${defaultColor} ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block font-serif ${defaultColor} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
