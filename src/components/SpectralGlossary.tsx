import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  Sigma,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  HelpCircle,
  X,
  Compass,
  FileCheck2,
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  SPECTRAL_GLOSSARY,
  GLOSSARY_CATEGORIES,
  searchGlossary
} from '../data/spectralGlossaryData';
import type { GlossaryTerm, GlossaryCategory } from '../types';
import { MathRenderer, MathText, InlineMath } from './MathRenderer';

interface SpectralGlossaryProps {
  initialTermId?: string;
  initialSearchQuery?: string;
  onSelectTerm?: (term: GlossaryTerm) => void;
  className?: string;
}

export const SpectralGlossary: React.FC<SpectralGlossaryProps> = ({
  initialTermId,
  initialSearchQuery = '',
  onSelectTerm,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'All'>('All');
  const [activeTermId, setActiveTermId] = useState<string>(
    initialTermId || SPECTRAL_GLOSSARY[0]?.id || 'radiance'
  );
  const [copied, setCopied] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  // Sync initial props if changed
  useEffect(() => {
    if (initialTermId) {
      setActiveTermId(initialTermId);
      // Auto-switch category if necessary
      const found = SPECTRAL_GLOSSARY.find((t) => t.id === initialTermId);
      if (found && selectedCategory !== 'All' && found.category !== selectedCategory) {
        setSelectedCategory('All');
      }
    }
  }, [initialTermId]);

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Filtered terms list
  const filteredTerms = useMemo(() => {
    return searchGlossary(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Currently active term object
  const activeTerm = useMemo(() => {
    const found = SPECTRAL_GLOSSARY.find((t) => t.id === activeTermId);
    if (found) return found;
    return filteredTerms[0] || SPECTRAL_GLOSSARY[0];
  }, [activeTermId, filteredTerms]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: SPECTRAL_GLOSSARY.length };
    GLOSSARY_CATEGORIES.forEach((cat) => {
      counts[cat] = SPECTRAL_GLOSSARY.filter((t) => t.category === cat).length;
    });
    return counts;
  }, []);

  // Quick jump alphabetic letters available
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    SPECTRAL_GLOSSARY.forEach((t) => {
      letters.add(t.term[0].toUpperCase());
    });
    return Array.from(letters).sort();
  }, []);

  const handleSelectTerm = (term: GlossaryTerm) => {
    setActiveTermId(term.id);
    onSelectTerm?.(term);
    // Scroll detail panel to top on mobile/tablet
    if (window.innerWidth < 1024 && detailPanelRef.current) {
      detailPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyCitation = () => {
    if (!activeTerm) return;
    const citationText = `[Spectral Glossary] ${activeTerm.term} (${activeTerm.symbol || ''}): ${activeTerm.shortDefinition} Standard: ${activeTerm.standardOrAuthority || 'CEOS WGCV'}`;
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Category Filtering Header */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Authoritative Reference Dictionary
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {SPECTRAL_GLOSSARY.length} Rigorous Scientific Terms • CEOS &amp; ISO Aligned
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-stone-900 mt-1">
              Spectral Glossary &amp; Radiometry Handbook
            </h2>
            <p className="text-xs md:text-sm text-stone-600 max-w-3xl mt-0.5">
              Instant definitions, SI units, governing equations, and in-situ field measurement implications.
              <span className="font-semibold text-emerald-900 ml-1">
                Tip: Highlight any term in lecture slides or lab content to view its definition popup immediately.
              </span>
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <div className="text-xs text-stone-400 font-semibold uppercase">Total Entries</div>
              <div className="text-lg font-black text-stone-900">{SPECTRAL_GLOSSARY.length}</div>
            </div>
            <div className="px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <div className="text-xs text-emerald-700 font-semibold uppercase">Categories</div>
              <div className="text-lg font-black text-emerald-950">{GLOSSARY_CATEGORIES.length}</div>
            </div>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by term (e.g., 'Radiance', 'Irradiance', 'BRDF', 'Spectralon'), formula, or concept... (Press '/' to search)"
            className="w-full pl-10 pr-10 py-2.5 bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-sm text-stone-900 placeholder:text-stone-400 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <span>All Terms ({categoryCounts['All']})</span>
          </button>

          {GLOSSARY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>{cat}</span>
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200/80 text-stone-700">
                {categoryCounts[cat] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* A-Z Quick Jump Index */}
        <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-stone-100 text-[11px]">
          <span className="text-stone-400 font-semibold mr-1 uppercase">A-Z Jump:</span>
          {availableLetters.map((letter) => (
            <button
              key={letter}
              onClick={() => {
                const termWithLetter = SPECTRAL_GLOSSARY.find(
                  (t) => t.term[0].toUpperCase() === letter
                );
                if (termWithLetter) {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  handleSelectTerm(termWithLetter);
                }
              }}
              className="w-6 h-6 rounded flex items-center justify-center font-bold text-stone-700 hover:bg-emerald-100 hover:text-emerald-900 transition-colors cursor-pointer"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Master/Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Matched Terms (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col max-h-[750px]">
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Matching Terms ({filteredTerms.length})
            </span>
            {searchQuery && (
              <span className="text-xs text-stone-500">
                filtering by: "{searchQuery}"
              </span>
            )}
          </div>

          <div className="overflow-y-auto divide-y divide-stone-100 flex-1 p-2 space-y-1">
            {filteredTerms.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <HelpCircle className="w-8 h-8 text-stone-400 mx-auto" />
                <div className="text-sm font-bold text-stone-800">No terms found</div>
                <p className="text-xs text-stone-500">
                  Try clearing your search query or selecting "All Terms".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-900 hover:bg-emerald-200 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredTerms.map((term) => {
                const isSelected = term.id === activeTerm?.id;
                return (
                  <button
                    key={term.id}
                    onClick={() => handleSelectTerm(term)}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col space-y-1.5 ${
                      isSelected
                        ? 'bg-emerald-50/90 border border-emerald-300/80 shadow-xs'
                        : 'hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-extrabold text-sm text-stone-900 flex items-center space-x-1.5">
                        <span>{term.term}</span>
                        {term.symbol && (
                          <span className="text-[11px] font-mono font-bold text-purple-800 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                            <InlineMath math={term.symbol} />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 shrink-0">
                        {term.category}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      <MathText text={term.shortDefinition} />
                    </div>

                    {term.units && (
                      <div className="text-[10px] text-stone-400 font-mono flex items-center space-x-1">
                        <span>Units:</span>
                        <span className="text-stone-700 font-medium">
                          <InlineMath math={term.units} />
                        </span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: In-Depth Technical Specification Panel (7 cols) */}
        <div
          ref={detailPanelRef}
          className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 md:p-8 space-y-6"
        >
          {activeTerm ? (
            <>
              {/* Term Header & Authority Metadata */}
              <div className="space-y-2 pb-4 border-b border-stone-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {activeTerm.category}
                  </span>

                  {activeTerm.standardOrAuthority && (
                    <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md border border-stone-200">
                      Standard: <strong className="text-stone-700">{activeTerm.standardOrAuthority}</strong>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 pt-1">
                  <h3 className="text-3xl font-black text-stone-900 tracking-tight">
                    {activeTerm.term}
                  </h3>

                  {activeTerm.symbol && (
                    <div className="flex items-center space-x-1 text-sm font-mono font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 shrink-0">
                      <span className="text-xs text-purple-500 font-normal mr-1">Symbol:</span>
                      <InlineMath math={activeTerm.symbol} />
                    </div>
                  )}
                </div>

                {activeTerm.units && (
                  <div className="text-xs text-stone-600 font-mono flex items-center space-x-1.5 pt-0.5">
                    <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                      SI Derived Units:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-100 font-semibold text-stone-900 border border-stone-200">
                      <InlineMath math={activeTerm.units} />
                    </span>
                  </div>
                )}
              </div>

              {/* Formal Academic & Scientific Definition */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Comprehensive Scientific Definition
                </div>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-800 leading-relaxed space-y-2">
                  <div className="font-semibold text-stone-900">
                    <MathText text={activeTerm.shortDefinition} />
                  </div>
                  <div className="text-stone-700 text-xs md:text-sm leading-relaxed">
                    <MathText text={activeTerm.fullDefinition} />
                  </div>
                </div>
              </div>

              {/* Governing Mathematical Formulation (if present) */}
              {activeTerm.mathFormula && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-950">
                      <Sigma className="w-4 h-4 text-purple-700" />
                      <span>Governing Mathematical Physics Formulation</span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      KaTeX Rendered
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-purple-50/50 border border-purple-200/80 space-y-3">
                    <div className="p-4 bg-white rounded-lg border border-purple-100 shadow-xs">
                      <MathRenderer formula={activeTerm.mathFormula} displayMode={true} />
                    </div>

                    {activeTerm.formulaExplanation && (
                      <div className="text-xs text-stone-700 bg-white/70 p-3 rounded-lg border border-purple-100 leading-relaxed">
                        <span className="font-bold text-purple-950">Notation &amp; Variable Meaning: </span>
                        <MathText text={activeTerm.formulaExplanation} className="inline" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* In-Situ Practical Field Implication Callout */}
              {activeTerm.fieldImplication && (
                <div className="p-4 sm:p-5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start space-x-3">
                  <Compass className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      In-Situ Field Measurement &amp; Sensor Calibration Implication
                    </div>
                    <div className="text-xs md:text-sm text-amber-950 leading-relaxed font-medium">
                      <MathText text={activeTerm.fieldImplication} />
                    </div>
                  </div>
                </div>
              )}

              {/* Real-World Field Campaign Example */}
              {activeTerm.keyExample && (
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-emerald-900">
                    <FileCheck2 className="w-4 h-4 text-emerald-700" />
                    <span>Real-World Protocol Scenario</span>
                  </div>
                  <div className="leading-relaxed font-medium">
                    <MathText text={activeTerm.keyExample} />
                  </div>
                </div>
              )}

              {/* Related Terms Cross-References */}
              {activeTerm.relatedTermIds && activeTerm.relatedTermIds.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Related Concepts &amp; Cross-References
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {activeTerm.relatedTermIds.map((relId) => {
                      const relTerm = SPECTRAL_GLOSSARY.find((t) => t.id === relId);
                      if (!relTerm) return null;
                      return (
                        <button
                          key={relId}
                          onClick={() => handleSelectTerm(relTerm)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 border border-stone-200 text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
                        >
                          <span>{relTerm.term}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footer Controls: Copy Citation */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <button
                  onClick={handleCopyCitation}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors cursor-pointer"
                  title="Copy formatted citation"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-emerald-800 font-bold">Citation Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-600" />
                      <span>Copy Standard Citation</span>
                    </>
                  )}
                </button>

                <div className="text-[11px] text-stone-400 font-mono">
                  Term ID: <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600 font-bold">{activeTerm.id}</code>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-stone-500">
              Select a term from the list to view its complete technical definition.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
