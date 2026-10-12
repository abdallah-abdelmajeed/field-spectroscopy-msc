/**
 * MSc Lecture Notes & Comprehensive Study Guide View.
 * Provides students with an unbroken, publication-quality reading layout of all 30 slides,
 * complete with rendered LaTeX math, field notes, speaker commentary, and searchable index.
 */
import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  Sigma,
  AlertTriangle,
  Lightbulb,
  FileText,
  Printer,
  ChevronUp,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import type { CourseModule, Slide } from '../types';
import { MathRenderer, MathText } from './MathRenderer';
import { DynamicCitationFooter } from './DynamicCitationFooter';

interface MScLectureStudyGuideProps {
  module: CourseModule;
  onSelectSlideInDeck?: (index: number) => void;
}

export const MScLectureStudyGuide: React.FC<MScLectureStudyGuideProps> = ({
  module,
  onSelectSlideInDeck
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    module.slides.forEach((s) => set.add(s.category));
    return ['All', ...Array.from(set)];
  }, [module.slides]);

  // Filter slides
  const filteredSlides = useMemo(() => {
    return module.slides.filter((slide) => {
      const matchesCategory =
        selectedCategory === 'All' || slide.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesText =
        slide.title.toLowerCase().includes(q) ||
        slide.keyTakeaway.toLowerCase().includes(q) ||
        slide.bullets.some((b) => b.toLowerCase().includes(q)) ||
        (slide.mathFormula && slide.mathFormula.toLowerCase().includes(q)) ||
        (slide.practicalFieldNote && slide.practicalFieldNote.toLowerCase().includes(q));

      return matchesCategory && matchesText;
    });
  }, [module.slides, selectedCategory, searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  const getCategoryColor = (cat: Slide['category']) => {
    switch (cat) {
      case 'Physics':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Instrumentation':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Mathematics':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Protocol':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Processing':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'QualityAssurance':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'CaseStudy':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'RTM':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Database':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar & Search Controls */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                MSc Study Guide &amp; Full Lecture Text
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {module.slides.length} Continuous Slides &amp; Derivations
              </span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 mt-1">
              Module {module.moduleNumber}: {module.title}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Notes</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search across all 30 slides, formulas, and field protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0 ml-1 mr-0.5" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredSlides.length !== module.slides.length && (
          <div className="text-[11px] text-stone-500 pt-1">
            Showing {filteredSlides.length} of {module.slides.length} slides matching criteria.
          </div>
        )}
      </div>

      {/* Slides Continuous Stream */}
      <div className="space-y-6">
        {filteredSlides.map((slide, index) => (
          <div
            key={slide.id}
            id={`study-slide-${slide.slideNumber}`}
            className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 space-y-5 shadow-xs hover:border-emerald-300 transition-colors"
          >
            {/* Slide Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-stone-100">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Slide {slide.slideNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getCategoryColor(slide.category)}`}>
                    {slide.category}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight">
                  {slide.title}
                </h3>
              </div>

              {onSelectSlideInDeck && (
                <button
                  onClick={() => onSelectSlideInDeck(slide.slideNumber - 1)}
                  className="shrink-0 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                >
                  View in Carousel ↗
                </button>
              )}
            </div>

            {/* Key Takeaway */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start space-x-3">
              <Lightbulb className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-emerald-950 leading-relaxed">
                <span className="font-bold text-emerald-900 block mb-0.5 uppercase tracking-wider text-[10px]">
                  Key Takeaway
                </span>
                <MathText text={slide.keyTakeaway} />
              </div>
            </div>

            {/* Bullets */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Detailed Principles
              </span>
              <ul className="space-y-2">
                {slide.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start space-x-2.5 text-xs text-stone-800 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5"></span>
                    <div className="flex-1">
                      <MathText text={bullet} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mathematical Formula (if present) */}
            {slide.mathFormula && (
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200/90 space-y-2.5">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-900">
                  <Sigma className="w-4 h-4 text-purple-700" />
                  <span>Analytical Formulation</span>
                </div>
                <div className="p-3.5 bg-white rounded-lg border border-purple-100 shadow-xs">
                  <MathRenderer formula={slide.mathFormula} displayMode={true} />
                </div>
                {slide.formulaExplanation && (
                  <div className="text-xs text-stone-700 bg-white/70 p-2.5 rounded-lg border border-purple-100 leading-relaxed">
                    <span className="font-bold text-purple-950">Physical Notation: </span>
                    <MathText text={slide.formulaExplanation} className="inline" />
                  </div>
                )}
              </div>
            )}

            {/* Field Note (if present) */}
            {slide.practicalFieldNote && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start space-x-2.5 text-xs text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900 block mb-0.5 uppercase tracking-wider text-[10px]">
                    Field Protocol Diagnostic
                  </span>
                  <p className="font-medium leading-relaxed">{slide.practicalFieldNote}</p>
                </div>
              </div>
            )}

            {/* Speaker Notes */}
            {slide.speakerNotes && (
              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 text-xs text-stone-700">
                <span className="font-bold text-stone-600 block mb-1 uppercase tracking-wider text-[10px]">
                  Academic Commentary &amp; Theoretical Insight
                </span>
                <p className="italic font-serif leading-relaxed text-stone-800">
                  "{slide.speakerNotes}"
                </p>
              </div>
            )}

            {/* References */}
            {slide.references && slide.references.length > 0 && (
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                <span className="font-semibold text-stone-700">Primary References: </span>
                <span>{slide.references.join('; ')}</span>
              </div>
            )}
          </div>
        ))}

        {filteredSlides.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-stone-400" />
            <div className="font-semibold text-stone-700">No slides matched your search query</div>
            <div className="text-xs">Try clearing your search query or selecting "All" categories.</div>
          </div>
        )}
      </div>

      {/* Dynamic Citation Footer for Study Guide */}
      <DynamicCitationFooter module={module} />
    </div>
  );
};
