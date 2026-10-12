import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Printer,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Presentation,
  Compass,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import type { CourseModule } from '../types';
import { generateModulePDF, renderFormulaToHtml } from '../services/pdfExportService';
import { MathRenderer } from './MathRenderer';

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: CourseModule;
  initialMode?: 'all' | 'slides' | 'protocol';
}

export const PDFExportModal: React.FC<PDFExportModalProps> = ({
  isOpen,
  onClose,
  module,
  initialMode = 'all'
}) => {
  const [includeSlides, setIncludeSlides] = useState(initialMode !== 'protocol');
  const [includeProtocol, setIncludeProtocol] = useState(initialMode !== 'slides');
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    if (!printAreaRef.current) return;
    setIsGenerating(true);
    setGenerationSuccess(false);
    setErrorMsg(null);
    setProgressMsg('Initializing PDF document renderer...');
    setProgressPercent(10);

    try {
      await generateModulePDF(printAreaRef.current, module, {
        includeSlides,
        includeProtocol,
        includeSpeakerNotes,
        onProgress: (msg, pct) => {
          setProgressMsg(msg);
          setProgressPercent(pct);
        }
      });
      setGenerationSuccess(true);
    } catch (err: any) {
      console.error('PDF Generation error:', err);
      setErrorMsg(err.message || 'PDF generation encountered an error. You can also use the Browser Print / PDF button.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Export Formatted Academic PDF Dossier
              </h3>
              <p className="text-xs text-stone-300">
                Module {module.moduleNumber}: {module.title} • LaTeX Equations &amp; Diagrams Preserved
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options & Action Bar */}
        <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
              Content Options:
            </span>
            <label className="flex items-center space-x-1.5 cursor-pointer font-medium text-stone-800">
              <input
                type="checkbox"
                checked={includeSlides}
                onChange={(e) => setIncludeSlides(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-500"
              />
              <span>Lecture Slides ({module.slides.length})</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer font-medium text-stone-800">
              <input
                type="checkbox"
                checked={includeProtocol}
                onChange={(e) => setIncludeProtocol(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-500"
              />
              <span>Field Protocol Protocol &amp; Log Sheet</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer font-medium text-stone-800">
              <input
                type="checkbox"
                checked={includeSpeakerNotes}
                onChange={(e) => setIncludeSpeakerNotes(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-500"
              />
              <span>Include Faculty Speaker Notes</span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg font-medium transition-colors cursor-pointer"
              title="Print directly or save via browser PDF print engine with vector fonts"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Browser Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating || (!includeSlides && !includeProtocol)}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF ({progressPercent}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Formatted PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Alert */}
        {isGenerating && (
          <div className="bg-emerald-50 px-6 py-2 border-b border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-emerald-700 animate-spin" />
              <span>{progressMsg}</span>
            </div>
            <span className="font-bold">{progressPercent}%</span>
          </div>
        )}

        {generationSuccess && (
          <div className="bg-emerald-100 px-6 py-2 border-b border-emerald-300 flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>PDF generated and downloaded successfully! All LaTeX formulas and diagrams were encoded.</span>
            </div>
            <button onClick={() => setGenerationSuccess(false)} className="text-emerald-800 hover:underline">
              Dismiss
            </button>
          </div>
        )}

                {errorMsg && (
          <div className="bg-rose-50 px-6 py-2.5 border-b border-rose-200 flex items-center justify-between text-xs text-rose-950">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded font-medium cursor-pointer"
              >
                Use Browser Print / PDF
              </button>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-stone-500 hover:text-stone-700 ml-2 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        {/* Document Preview Canvas (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-200/60">
          <div
            ref={printAreaRef}
            id="pdf-document-container"
            className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-md border border-stone-300 space-y-8 text-stone-900 font-sans"
          >
            {/* Document Header Page */}
            <div className="border-b-2 border-emerald-800 pb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  GEO-MSc-704 Field Spectroscopy Curriculum
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  Module {module.moduleNumber} of 8 • {module.ectsCredits} ECTS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {module.title}
              </h1>
              <p className="text-sm font-medium text-stone-600">
                {module.subtitle}
              </p>
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 leading-relaxed">
                <strong>Course Abstract: </strong> {module.abstract}
              </div>
              <div className="pt-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                  Core Learning Competencies:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {module.coreCompetencies.map((comp, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5"></span>
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 1: LECTURE SLIDES */}
            {includeSlides && (
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div className="flex items-center space-x-2 text-sm font-bold text-emerald-900 uppercase tracking-wider">
                    <Presentation className="w-4 h-4 text-emerald-700" />
                    <span>Part I: Complete Lecture Slides ({module.slides.length} Slides)</span>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    With Validated LaTeX Formulations &amp; Diagrams
                  </span>
                </div>

                <div className="space-y-6">
                  {module.slides.map((s, idx) => (
                    <div
                      key={s.id}
                      className="p-5 rounded-xl border border-stone-200 bg-white space-y-4 shadow-xs"
                    >
                      {/* Slide Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 uppercase tracking-wider">
                            {s.category}
                          </span>
                        </div>
                        <span className="text-xs text-stone-500">
                          Slide {idx + 1} of {module.slides.length}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900">
                        {s.title}
                      </h3>

                      {/* Key Takeaway Banner */}
                      <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-100 text-xs text-emerald-950 font-medium">
                        <strong>Key Scientific Takeaway: </strong> {s.keyTakeaway}
                      </div>

                      {/* Bullets */}
                      <ul className="space-y-1.5 text-xs text-stone-800 pl-2">
                        {s.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0 mt-1.5"></span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {/* LaTeX Mathematical Formulation */}
                      {s.mathFormula && (
                        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-600">
                            <span>Mathematical Formulation</span>
                            <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                              LaTeX KaTeX
                            </span>
                          </div>
                          <div className="py-2 text-center overflow-x-auto">
                            <MathRenderer formula={s.mathFormula} displayMode={true} />
                          </div>
                          {s.formulaExplanation && (
                            <p className="text-xs text-stone-600 italic border-t border-stone-200 pt-2">
                              {s.formulaExplanation}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Diagram Schematic / Description */}
                      {s.diagramDescription && (
                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1.5 text-xs">
                          <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-blue-900 text-[11px]">
                            <Layers className="w-3.5 h-3.5 text-blue-700" />
                            <span>Scientific Diagram &amp; Optical Schematic</span>
                          </div>
                          <p className="text-blue-950 leading-relaxed">
                            {s.diagramDescription}
                          </p>
                        </div>
                      )}

                      {/* Practical Field Note */}
                      {s.practicalFieldNote && (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950">
                          <strong>Field Spectrometer Practical Note: </strong>
                          <span>{s.practicalFieldNote}</span>
                        </div>
                      )}

                      {/* Speaker Notes */}
                      {includeSpeakerNotes && s.speakerNotes && (
                        <div className="p-3 bg-stone-100 rounded-lg text-xs text-stone-700 space-y-1">
                          <span className="font-bold text-stone-900 uppercase tracking-wider text-[10px] block">
                            Instructor Faculty Explanatory Notes:
                          </span>
                          <p className="italic text-stone-600 leading-relaxed">
                            {s.speakerNotes}
                          </p>
                        </div>
                      )}

                      {/* Academic References */}
                      {s.references && s.references.length > 0 && (
                        <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                          <span className="font-semibold">Academic References: </span>
                          <span>{s.references.join('; ')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: FIELD PROTOCOL */}
            {includeProtocol && (
              <div className="space-y-6 pt-6 border-t-2 border-emerald-800">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div className="flex items-center space-x-2 text-sm font-bold text-emerald-900 uppercase tracking-wider">
                    <Compass className="w-4 h-4 text-emerald-700" />
                    <span>Part II: Field Spectroscopy Practical Campaign Protocol</span>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    Aligned with CEOS WGCV Cal/Val Standards
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">
                      {module.fieldExercise.title}
                    </h2>
                    <div className="flex flex-wrap gap-4 pt-2 text-xs text-stone-600">
                      <div>
                        <strong>Duration: </strong> {module.fieldExercise.estimatedDuration}
                      </div>
                      <div>
                        <strong>Target Setting: </strong> {module.fieldExercise.targetEnvironment}
                      </div>
                    </div>
                  </div>

                  {/* Required Instrumentation */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-stone-700 block">
                      Required Field Instrumentation:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {module.fieldExercise.recommendedInstruments.map((inst, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-white border border-stone-300 rounded-md text-xs font-medium text-stone-800"
                        >
                          {inst}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pre-Trip Checklist */}
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-900 block">
                      Pre-Deployment Metrology &amp; Safety Checklist:
                    </span>
                    <ul className="space-y-1.5 text-xs text-amber-950">
                      {module.fieldExercise.safetyAndPreTripChecklist.map((chk, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <span>{chk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sequential Steps */}
                  <div className="space-y-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-stone-700 block">
                      Methodological Execution Steps:
                    </span>
                    {module.fieldExercise.fieldProtocolSteps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-4 bg-white rounded-xl border border-stone-200 space-y-2 text-xs"
                      >
                        <div className="flex items-start space-x-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {step.stepNumber}
                          </span>
                          <span className="font-bold text-stone-900 text-sm">
                            {step.action}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-7 pt-1">
                          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-950">
                            <strong className="block text-[10px] uppercase font-bold text-emerald-800">
                              Scientific Rationale
                            </strong>
                            <p>{step.scientificRationale}</p>
                          </div>
                          <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-100 text-rose-950">
                            <strong className="block text-[10px] uppercase font-bold text-rose-800">
                              Common Pitfall to Avoid
                            </strong>
                            <p>{step.commonErrorToAvoid}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Log Sheet Fields */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-stone-700 block">
                      Mandatory Field Log Sheet Metadata Fields:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {module.fieldExercise.dataRecordingSheetFields.map((f, i) => (
                        <div key={i} className="p-2 bg-white rounded border border-stone-200 font-medium">
                          • {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deliverable */}
                  <div className="p-4 bg-emerald-900 text-white rounded-xl space-y-1 text-xs">
                    <span className="font-bold text-emerald-300 uppercase tracking-wider block">
                      Student Deliverable Requirement:
                    </span>
                    <p className="text-emerald-100">{module.fieldExercise.fieldDeliverable}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
