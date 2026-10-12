import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { Copy, Check, Code } from 'lucide-react';

interface MathRendererProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
  allowCopy?: boolean;
}

// Helper to sanitize LaTeX formulas for KaTeX
export function sanitizeLatex(formula: string): string {
  if (!formula) return '';
  let clean = formula.trim();

  // Strip wrapping $$ or $ or \[ \] or \( \)
  if (clean.startsWith('$$') && clean.endsWith('$$') && clean.length > 4) {
    clean = clean.slice(2, -2).trim();
  } else if (clean.startsWith('\\[') && clean.endsWith('\\]') && clean.length > 4) {
    clean = clean.slice(2, -2).trim();
  } else if (clean.startsWith('\\(') && clean.endsWith('\\)') && clean.length > 4) {
    clean = clean.slice(2, -2).trim();
  } else if (clean.startsWith('$') && clean.endsWith('$') && clean.length > 2) {
    clean = clean.slice(1, -1).trim();
  }

  // Auto-wrap subscripted commands without braces, e.g., E_\lambda -> E_{\lambda}
  clean = clean.replace(/_\\([a-zA-Z]+)/g, '_{\\$1}');

  return clean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  formula,
  displayMode = true,
  className = '',
  allowCopy = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const cleanedFormula = useMemo(() => sanitizeLatex(formula), [formula]);

  const { html, error } = useMemo(() => {
    try {
      const rendered = katex.renderToString(cleanedFormula, {
        displayMode,
        throwOnError: false,
        strict: false,
        trust: true,
        output: 'htmlAndMathml',
      });
      return { html: rendered, error: null };
    } catch (err: any) {
      return { html: '', error: err.message || 'Failed to render formula' };
    }
  }, [cleanedFormula, displayMode]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cleanedFormula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error || showRaw) {
    return (
      <div className={`relative group font-mono text-sm bg-stone-100 text-stone-800 p-3 rounded-lg overflow-x-auto ${className}`}>
        <code>{cleanedFormula}</code>
        {allowCopy && (
          <button
            onClick={handleCopy}
            title="Copy LaTeX"
            className="absolute top-2 right-2 p-1 text-stone-500 hover:text-stone-800 bg-white/80 rounded border border-stone-200"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`relative group my-1 ${className}`}>
      <div
        className={`overflow-x-auto py-1 text-stone-900 ${
          displayMode ? 'text-center font-medium flex justify-center items-center min-h-[44px]' : 'inline-block'
        }`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {allowCopy && displayMode && (
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-md border border-stone-200 shadow-xs text-xs text-stone-600">
          <button
            onClick={() => setShowRaw(!showRaw)}
            title="Toggle raw LaTeX"
            className="p-1 hover:text-purple-700"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopy}
            title="Copy LaTeX formula"
            className="p-1 hover:text-emerald-700 flex items-center space-x-1"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[10px] text-emerald-700 font-sans">Copied!</span>
              </>
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * InlineMath renders mathematical symbols, SI units, and short formulas inline
 */
export const InlineMath: React.FC<{
  math?: string | null;
  className?: string;
  fallback?: string;
}> = ({ math, className = '', fallback = '' }) => {
  if (!math) return fallback ? <span>{fallback}</span> : null;

  const cleaned = sanitizeLatex(math);

  try {
    const html = katex.renderToString(cleaned, {
      displayMode: false,
      throwOnError: false,
      strict: false,
      trust: true,
      output: 'htmlAndMathml',
    });

    return (
      <span
        className={`inline-math-item inline-flex items-center align-baseline ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <span className={`font-mono text-xs ${className}`}>{math}</span>;
  }
};

/**
 * MathText parses mixed text containing LaTeX delimiters:
 * $$...$$ or \[...\] for block math
 * $...$ or \(...\) for inline math
 * and automatically formats naked LaTeX variables/Greek letters (e.g. \theta, \lambda, \Phi_\lambda, E_\lambda)
 */
export const MathText: React.FC<{ text?: string | null; className?: string }> = ({ text, className = '' }) => {
  const parts = useMemo(() => {
    if (!text) return [];

    // Check if text has standard math delimiters
    const hasDelimiters = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+?\$|\\\(.*?\\\))/g.test(text);

    let preparedText = text;
    if (!hasDelimiters) {
      // Auto-wrap naked TeX commands (e.g. \Phi_\lambda, \theta_i, \lambda, \Omega, \mu, \sigma, etc.)
      preparedText = text.replace(
        /(\\[a-zA-Z]+(?:_\{?[a-zA-Z0-9\\]+\}?)?(?:\^\{?[a-zA-Z0-9\\]+\}?)?)/g,
        '$$$1$$'
      );
    }

    // Split by block math first: $$...$$ or \[...\]
    const blockRegex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g;
    const tokens: Array<{ type: 'text' | 'inline' | 'block'; content: string }> = [];

    const blockSegments = preparedText.split(blockRegex);
    for (const segment of blockSegments) {
      if (!segment) continue;

      if (
        (segment.startsWith('$$') && segment.endsWith('$$') && segment.length > 4) ||
        (segment.startsWith('\\[') && segment.endsWith('\\]'))
      ) {
        tokens.push({ type: 'block', content: segment });
      } else {
        // Look for inline math: $...$ or \(...\)
        const inlineRegex = /(\$[^\$\n]+?\$|\\\(.*?\\\))/g;
        const inlineSegments = segment.split(inlineRegex);
        for (const inlineSeg of inlineSegments) {
          if (!inlineSeg) continue;
          if (
            (inlineSeg.startsWith('$') && inlineSeg.endsWith('$') && inlineSeg.length > 2) ||
            (inlineSeg.startsWith('\\(') && inlineSeg.endsWith('\\)'))
          ) {
            tokens.push({ type: 'inline', content: inlineSeg });
          } else {
            tokens.push({ type: 'text', content: inlineSeg });
          }
        }
      }
    }

    return tokens;
  }, [text]);

  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (part.type === 'block') {
          return <MathRenderer key={index} formula={part.content} displayMode={true} />;
        }
        if (part.type === 'inline') {
          return <InlineMath key={index} math={part.content} />;
        }
        return <span key={index}>{part.content}</span>;
      })}
    </div>
  );
};
