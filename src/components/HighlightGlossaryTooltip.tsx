import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ExternalLink, Copy, Check, X, Sparkles, Search } from 'lucide-react';
import { matchGlossaryTermByText, SPECTRAL_GLOSSARY } from '../data/spectralGlossaryData';
import type { GlossaryTerm } from '../types';
import { MathRenderer, MathText, InlineMath } from './MathRenderer';

interface HighlightGlossaryTooltipProps {
  onOpenFullGlossary: (termId?: string, searchFallback?: string) => void;
}

interface TooltipPosition {
  top: number;
  left: number;
  placement: 'above' | 'below';
}

export const HighlightGlossaryTooltip: React.FC<HighlightGlossaryTooltipProps> = ({
  onOpenFullGlossary,
}) => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [matchedTerm, setMatchedTerm] = useState<GlossaryTerm | null>(null);
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      // Small timeout to allow browser selection to finalize
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          return;
        }

        const rawText = selection.toString().trim();
        // Ignore if too short or excessively long (e.g., entire paragraphs)
        if (rawText.length < 2 || rawText.length > 55) {
          return;
        }

        // Avoid triggering if inside an input or textarea
        const activeElement = document.activeElement;
        if (
          activeElement &&
          (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')
        ) {
          return;
        }

        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        if (!range) return;

        const rect = range.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;

        // Try to match with our spectral glossary
        const term = matchGlossaryTermByText(rawText);

        // Determine placement (above or below selection)
        const spaceAbove = rect.top;
        const tooltipHeight = term ? 260 : 60;
        const placement = spaceAbove > tooltipHeight + 20 ? 'above' : 'below';

        const top =
          placement === 'above'
            ? rect.top + window.scrollY - 10
            : rect.bottom + window.scrollY + 10;

        // Center horizontally with viewport boundary clamping
        const idealLeft = rect.left + window.scrollX + rect.width / 2;
        const tooltipWidth = term ? 340 : 260;
        const minLeft = 16;
        const maxLeft = window.innerWidth - tooltipWidth - 16;
        const left = Math.max(minLeft, Math.min(idealLeft - tooltipWidth / 2, maxLeft));

        setSelectedText(rawText);
        setMatchedTerm(term);
        setPosition({ top, left, placement });
        setIsVisible(true);
      }, 100);
    };

    const handleMouseDown = (e: MouseEvent) => {
      // If clicking inside the tooltip, don't dismiss
      if (tooltipRef.current && tooltipRef.current.contains(e.target as Node)) {
        return;
      }
      // If clicking outside, close tooltip
      setIsVisible(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isVisible || !position) {
    return null;
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!matchedTerm) return;
    const textToCopy = `${matchedTerm.term}: ${matchedTerm.shortDefinition} ${
      matchedTerm.units ? `[Units: ${matchedTerm.units}]` : ''
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Case 1: Exact or recognized scientific term match
  if (matchedTerm) {
    return (
      <div
        ref={tooltipRef}
        id="spectral-glossary-highlight-popup"
        style={{
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: position.placement === 'above' ? 'translateY(-100%)' : 'translateY(0)',
        }}
        className="z-50 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-emerald-200/90 p-4 text-stone-900 animate-in fade-in zoom-in-95 duration-150 select-none"
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span className="uppercase tracking-wider text-[10px]">Spectral Glossary</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70">
              {matchedTerm.category}
            </span>
            <button
              onClick={() => setIsVisible(false)}
              className="text-stone-400 hover:text-stone-600 p-0.5 rounded transition-colors cursor-pointer"
              title="Close tooltip (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Term Title and Symbols */}
        <div className="mb-2">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="text-base font-black text-stone-900 tracking-tight">
              {matchedTerm.term}
            </h4>
            {matchedTerm.symbol && (
              <span className="text-xs font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                <InlineMath math={matchedTerm.symbol} />
              </span>
            )}
          </div>
          {matchedTerm.units && (
            <div className="text-[11px] text-stone-500 font-mono mt-0.5 flex items-center space-x-1">
              <span>SI Units:</span>
              <span className="text-stone-700 font-medium">
                <InlineMath math={matchedTerm.units} />
              </span>
            </div>
          )}
        </div>

        {/* Concise Scientific Definition */}
        <div className="text-xs text-stone-700 leading-relaxed mb-2.5">
          <MathText text={matchedTerm.shortDefinition} />
        </div>

        {/* Math formula (if available) */}
        {matchedTerm.mathFormula && (
          <div className="mb-2.5 p-2 bg-stone-50 rounded-lg border border-stone-200 text-xs overflow-x-auto">
            <MathRenderer formula={matchedTerm.mathFormula} displayMode={false} allowCopy={false} />
          </div>
        )}

        {/* In-Situ Field Takeaway */}
        {matchedTerm.fieldImplication && (
          <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-950 mb-3 leading-relaxed">
            <span className="font-bold text-amber-900">Field Takeaway: </span>
            <MathText text={matchedTerm.fieldImplication} className="inline" />
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            title="Copy definition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsVisible(false);
              onOpenFullGlossary(matchedTerm.id);
            }}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold transition-colors cursor-pointer"
          >
            <span>Full Entry</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Highlighted arbitrary technical phrase - offer instant lookup pill
  return (
    <div
      ref={tooltipRef}
      id="spectral-glossary-lookup-pill"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: position.placement === 'above' ? 'translateY(-100%)' : 'translateY(0)',
      }}
      className="z-50 bg-stone-900 text-white rounded-xl shadow-xl px-3 py-2 flex items-center space-x-2 text-xs border border-stone-700 animate-in fade-in zoom-in-95 duration-100 select-none"
    >
      <Search className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      <span className="text-stone-200">
        Look up <strong className="text-white font-semibold">"{selectedText.slice(0, 20)}"</strong> in Glossary
      </span>
      <button
        onClick={() => {
          setIsVisible(false);
          onOpenFullGlossary(undefined, selectedText);
        }}
        className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-medium text-[11px] ml-1 transition-colors cursor-pointer"
      >
        Search
      </button>
      <button
        onClick={() => setIsVisible(false)}
        className="text-stone-400 hover:text-white p-0.5 ml-0.5 rounded cursor-pointer"
        title="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
