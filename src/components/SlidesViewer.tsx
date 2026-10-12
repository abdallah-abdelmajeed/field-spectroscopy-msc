import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  AlertTriangle,
  BookMarked,
  Presentation,
  Loader2,
  ExternalLink,
  Sigma,
  Lightbulb,
  CheckCircle2,
  Download,
  BookOpen,
  Search,
  List,
  Grid,
  Calculator,
  Compass,
  X
} from 'lucide-react';
import type { CourseModule, Slide } from '../types';
import { exportModuleToGoogleSlides } from '../services/slidesExportService';
import { downloadModulePptx } from '../services/pptxExportService';

import { MathRenderer, MathText } from './MathRenderer';
import { PDFExportModal } from './PDFExportModal';
import { MScLectureStudyGuide } from './MScLectureStudyGuide';
import { MScFormulaCalculator } from './MScFormulaCalculator';
import { DynamicCitationFooter } from './DynamicCitationFooter';

interface SlidesViewerProps {
  module: CourseModule;
}

export const SlidesViewer: React.FC<SlidesViewerProps> = ({ module }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // New MSc Lecture Features
  const [lectureMode, setLectureMode] = useState<'slides' | 'studyGuide'>('slides');
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [navCategory, setNavCategory] = useState('All');
  const [showFormulaCalc, setShowFormulaCalc] = useState(false);

  // Reset slide index when module changes
  useEffect(() => {
    setCurrentSlideIndex(0);
    setExportUrl(null);
    setExportError(null);
    setIsNavigatorOpen(false);
    setShowFormulaCalc(false);
  }, [module.id]);

  // Keyboard navigation (only in slides mode)
  useEffect(() => {
    if (lectureMode !== 'slides') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in search input
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(prev + 1, module.slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [module.slides.length, lectureMode]);

  const slide: Slide = module.slides[currentSlideIndex] || module.slides[0];

  const [exportProgressText, setExportProgressText] = useState<string>('');

  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const handleDownloadPptx = async () => {
    setIsExportingPptx(true);
    try {
      await downloadModulePptx(module);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingPptx(false);
    }
  };
  const handleExport = async () => {
    setIsExporting(true);
    setExportUrl(null);
    setExportError(null);
    setExportProgressText('Preparing Google Slides deck...');
    try {
      const url = await exportModuleToGoogleSlides(module, (prog) => {
        setExportProgressText(prog.message);
      });
      setExportUrl(url);
    } catch (err: any) {
      setExportError(err.message || 'Export failed.');
    } finally {
      setIsExporting(false);
    }
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

  // Categories list for navigator
  const categories = useMemo(() => {
    const set = new Set<string>();
    module.slides.forEach((s) => set.add(s.category));
    return ['All', ...Array.from(set)];
  }, [module.slides]);

  // Filtered slides for navigator
  const filteredNavSlides = useMemo(() => {
    return module.slides.filter((s) => {
      const matchCat = navCategory === 'All' || s.category === navCategory;
      const q = navSearch.toLowerCase().trim();
      if (!q) return matchCat;
      return (
        matchCat &&
        (s.title.toLowerCase().includes(q) ||
          s.keyTakeaway.toLowerCase().includes(q) ||
          (s.mathFormula && s.mathFormula.toLowerCase().includes(q)))
      );
    });
  }, [module.slides, navCategory, navSearch]);

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-stone-900 p-6 overflow-y-auto' : ''}`}>
      {/* Deck Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-stone-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
              Module {module.moduleNumber}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {module.durationHours} Hours • {module.ectsCredits} ECTS Credits
            </span>
          </div>
          <h2 className={`text-xl font-bold ${isFullscreen ? 'text-white' : 'text-stone-900'} mt-1`}>
            {module.title}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5 max-w-3xl line-clamp-1">
            {module.subtitle}
          </p>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* View Mode Toggle: Slides vs Study Guide */}
          <div className="flex items-center p-0.5 bg-stone-100 rounded-lg border border-stone-200">
            <button
              onClick={() => setLectureMode('slides')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                lectureMode === 'slides'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Presentation className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
              <span>Slides Deck</span>
            </button>
            <button
              onClick={() => setLectureMode('studyGuide')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                lectureMode === 'studyGuide'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
              <span>MSc Study Guide</span>
            </button>
          </div>

          {/* Direct PowerPoint .pptx Download Button */}
          <button
            onClick={handleDownloadPptx}
            disabled={isExportingPptx}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Download all 30 slides as a formatted Microsoft PowerPoint (.pptx) presentation file"
          >
            {isExportingPptx ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                <span>Exporting PPTX...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download .PPTX</span>
              </>
            )}
          </button>
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors cursor-pointer"
            title="Export all lecture slides as a formatted PDF with preserved LaTeX math and diagrams"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            title="Export all 30 slides into a new Google Slides presentation in your Drive"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting 30 Slides...</span>
              </>
            ) : (
              <>
                <Presentation className="w-3.5 h-3.5" />
                <span>Export Slides</span>
              </>
            )}
          </button>

          {lectureMode === 'slides' && (
            <button
              onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                showSpeakerNotes
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5 inline mr-1" />
              <span>Notes</span>
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 bg-white border border-stone-300 hover:bg-stone-50 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-stone-600" />}
          </button>
        </div>
      </div>

      {/* Export notification banner */}
      {exportUrl && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>
              <strong>Google Slides Deck Created!</strong> 30 slides with speaker notes and academic citations have been generated.
            </span>
          </div>
          <a
            href={exportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg transition-colors"
          >
            <span>Open in Google Slides</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {exportError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-900">
          <span>{exportError}</span>
          <button onClick={() => setExportError(null)} className="text-rose-600 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* RENDER STUDY GUIDE MODE OR SLIDES MODE */}
      {lectureMode === 'studyGuide' ? (
        <MScLectureStudyGuide
          module={module}
          onSelectSlideInDeck={(idx) => {
            setCurrentSlideIndex(idx);
            setLectureMode('slides');
          }}
        />
      ) : (
        <>
          {/* Slide Navigation Ribbons & Quick Search Drawer Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 px-3 bg-stone-100/80 rounded-xl border border-stone-200">
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
                Slide:
              </span>
              {module.slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`px-2 py-0.5 rounded-md text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    idx === currentSlideIndex
                      ? 'bg-emerald-800 text-white shadow-xs scale-105'
                      : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
                  }`}
                  title={`Slide ${idx + 1}: ${s.title}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsNavigatorOpen(!isNavigatorOpen)}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                isNavigatorOpen
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Slide Index &amp; Topics (30)</span>
            </button>
          </div>

          {/* Expandable Slide Navigator & Search Drawer */}
          {isNavigatorOpen && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Filter 30 slides by concept (e.g. Planck, SNR, FOV, Spectralon, BRDF)..."
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  {navSearch && (
                    <button
                      onClick={() => setNavSearch('')}
                      className="absolute right-2.5 top-1.5 text-stone-400 hover:text-stone-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNavCategory(c)}
                      className={`px-2 py-1 rounded text-[11px] font-medium shrink-0 transition-colors cursor-pointer ${
                        navCategory === c
                          ? 'bg-emerald-800 text-white'
                          : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                {filteredNavSlides.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentSlideIndex(s.slideNumber - 1);
                      setIsNavigatorOpen(false);
                    }}
                    className={`p-2.5 rounded-lg text-left text-xs border transition-all cursor-pointer flex flex-col justify-between ${
                      s.slideNumber - 1 === currentSlideIndex
                        ? 'bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-400'
                        : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900">Slide {s.slideNumber}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getCategoryColor(s.category)}`}>
                        {s.category}
                      </span>
                    </div>
                    <div className="text-stone-700 font-medium line-clamp-1 text-[11px]">
                      {s.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Spectral Glossary Active Hint */}
          <div className="flex items-center justify-between px-4 py-2 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-950">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>
                <strong>Spectral Glossary active:</strong> Highlight any technical term (e.g. <em>Radiance</em>, <em>Irradiance</em>, <em>BRDF</em>, <em>Spectralon</em>, <em>FWHM</em>) to view its definition popup.
              </span>
            </div>
          </div>

          {/* Main Slide Canvas */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
            {/* Slide Header Banner */}
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getCategoryColor(slide.category)}`}>
                  {slide.category}
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  Slide {slide.slideNumber} of {module.slides.length}
                </span>
              </div>

              <div className="text-xs text-stone-500 font-medium">
                Use <kbd className="px-1.5 py-0.5 bg-stone-200 rounded text-[10px] font-mono">←</kbd> / <kbd className="px-1.5 py-0.5 bg-stone-200 rounded text-[10px] font-mono">→</kbd> keys to navigate
              </div>
            </div>

            {/* Slide Content Body */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Slide Title */}
              <h3 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
                {slide.title}
              </h3>

              {/* Key Takeaway Pill Card */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-0.5">
                    Key Academic Takeaway
                  </div>
                  <div className="text-sm font-semibold text-emerald-950 leading-relaxed">
                    <MathText text={slide.keyTakeaway} />
                  </div>
                </div>
              </div>

              {/* Structured Bullets */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Core Principles &amp; Physics
                </div>
                <ul className="space-y-2.5">
                  {slide.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-sm text-stone-800 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-2"></span>
                      <div className="flex-1">
                        <MathText text={bullet} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mathematical Formula Card (if present) */}
              {slide.mathFormula && (
                <div className="p-4 sm:p-5 rounded-xl bg-purple-50/60 border border-purple-200/90 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-900">
                      <Sigma className="w-4 h-4 text-purple-700" />
                      <span>Governing Mathematical Physics Formulation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowFormulaCalc(!showFormulaCalc)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold text-xs rounded-md border border-purple-300 transition-colors cursor-pointer"
                        title="Open interactive dimensional analysis calculator"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>{showFormulaCalc ? 'Hide Calculator' : 'Physics Calculator'}</span>
                      </button>
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-purple-700 bg-purple-100/90 px-2 py-0.5 rounded border border-purple-200/60">
                        KaTeX
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-purple-100/80 shadow-xs">
                    <MathRenderer formula={slide.mathFormula} displayMode={true} />
                  </div>
                  {slide.formulaExplanation && (
                    <div className="text-xs text-stone-700 bg-white/70 p-3 rounded-lg border border-purple-100 leading-relaxed">
                      <span className="font-bold text-purple-950">Notation &amp; Physical Meaning: </span>
                      <MathText text={slide.formulaExplanation} className="inline" />
                    </div>
                  )}

                  {/* Interactive Formula Calculator Dropdown */}
                  {showFormulaCalc && (
                    <div className="pt-2">
                      <MScFormulaCalculator formulaTitle={slide.title} />
                    </div>
                  )}
                </div>
              )}

              {/* Practical Field Note Callout (if present) */}
              {slide.practicalFieldNote && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-0.5">
                      Critical In-Situ Field Note
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed font-medium">
                      {slide.practicalFieldNote}
                    </p>
                  </div>
                </div>
              )}

              {/* Academic References */}
              {slide.references && slide.references.length > 0 && (
                <div className="pt-4 border-t border-stone-100 flex items-start space-x-2 text-xs text-stone-500">
                  <BookMarked className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-700">Authoritative References: </span>
                    <span>{slide.references.join('; ')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Slide Footer Navigation Controls */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
                  setShowFormulaCalc(false);
                }}
                disabled={currentSlideIndex === 0}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Slide</span>
              </button>

              <span className="text-xs font-bold text-stone-600">
                {currentSlideIndex + 1} / {module.slides.length}
              </span>

              <button
                onClick={() => {
                  setCurrentSlideIndex((prev) => Math.min(prev + 1, module.slides.length - 1));
                  setShowFormulaCalc(false);
                }}
                disabled={currentSlideIndex === module.slides.length - 1}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Speaker Notes Drawer */}
          {showSpeakerNotes && (
            <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-stone-600">
                <FileText className="w-4 h-4 text-stone-500" />
                <span>Professor / Lecturer Speaking Script &amp; Pedagogical Commentary</span>
              </div>
              <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-line font-serif italic bg-white p-3.5 rounded-lg border border-stone-200">
                "{slide.speakerNotes}"
              </p>
            </div>
          )}
        </>
      )}

      {/* Dynamic Citation Footer: APA references, Spectral Libraries, and Field Protocols */}
      <DynamicCitationFooter module={module} activeSlideIndex={currentSlideIndex} />

      {/* Formatted PDF Export Modal */}
      <PDFExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        module={module}
        initialMode="slides"
      />
    </div>
  );
};
