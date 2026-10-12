import React, { useState } from 'react';
import {
  Compass,
  Clock,
  MapPin,
  Wrench,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
  Award,
  CheckSquare,
  Square,
  Printer,
  UploadCloud,
  FileText,
  Download
} from 'lucide-react';
import type { FieldExercise } from '../types';
import { COURSE_MODULES } from '../data/courseData';
import { FieldDataIngestion } from './FieldDataIngestion';
import { PDFExportModal } from './PDFExportModal';

interface FieldExerciseViewProps {
  exercise: FieldExercise;
  moduleNumber: number;
}

export const FieldExerciseView: React.FC<FieldExerciseViewProps> = ({
  exercise,
  moduleNumber
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [activeSubTab, setActiveSubTab] = useState<'protocol' | 'ingestion'>('protocol');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const currentModule = COURSE_MODULES[moduleNumber - 1] || COURSE_MODULES[0];

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-stone-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
              Module {moduleNumber} Field Campaign
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Portable Spectroradiometer Practical Protocol
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            {exercise.title}
          </h2>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors cursor-pointer shadow-xs"
            title="Export full field campaign protocol and metadata log sheets as a formatted PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Protocol PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation: Protocol vs. Data Ingestion */}
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSubTab('protocol')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeSubTab === 'protocol'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Field Protocol &amp; Pre-Trip Checklist</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ingestion')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeSubTab === 'ingestion'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-emerald-600" />
          <span>Spectral CSV Upload &amp; Metadata Validation</span>
        </button>
      </div>

      {/* Sub-Tab 1: Field Protocol Content */}
      {activeSubTab === 'protocol' && (
        <div className="space-y-6">
          {/* Meta Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Environment & Duration */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Duration &amp; Deployment Setting</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-stone-700 w-28 shrink-0">Duration:</span>
                  <span className="text-stone-900 font-medium">{exercise.estimatedDuration}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-stone-700 w-28 shrink-0">Environment:</span>
                  <span className="text-stone-900">{exercise.targetEnvironment}</span>
                </div>
              </div>
            </div>

            {/* Instruments Required */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <Wrench className="w-4 h-4 text-emerald-700" />
                <span>Required Field Instrumentation</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {exercise.recommendedInstruments.map((inst, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-stone-100 text-stone-800 rounded-md text-[11px] font-medium border border-stone-200"
                  >
                    {inst}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Safety & Pre-Trip Checklist (Interactive) */}
          <div className="p-5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Pre-Trip &amp; Metrology Readiness Checklist</span>
              </div>
              <span className="text-[11px] text-amber-800 font-medium">
                {Object.values(checkedItems).filter(Boolean).length} of {exercise.safetyAndPreTripChecklist.length} Verified
              </span>
            </div>
            <div className="space-y-2">
              {exercise.safetyAndPreTripChecklist.map((item, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`w-full text-left flex items-start space-x-2.5 p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                      isChecked
                        ? 'bg-amber-100/70 border-amber-300 text-amber-950 font-medium'
                        : 'bg-white border-amber-200/80 text-stone-800 hover:bg-amber-50'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    )}
                    <span className={isChecked ? 'line-through text-stone-500' : ''}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Protocol Sequence */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-stone-500">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Execution Protocol &amp; Scientific Methodology</span>
            </div>

            <div className="space-y-3">
              {exercise.fieldProtocolSteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3"
                >
                  {/* Step Header */}
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {step.stepNumber}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-stone-900 leading-snug">
                        {step.action}
                      </h4>
                    </div>
                  </div>

                  {/* Rationale & Pitfall Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs pl-9">
                    <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 space-y-1">
                      <div className="font-bold text-emerald-900 uppercase tracking-wider text-[10px]">
                        Scientific Rationale
                      </div>
                      <p className="text-emerald-950 leading-relaxed">
                        {step.scientificRationale}
                      </p>
                    </div>

                    <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100 space-y-1">
                      <div className="flex items-center space-x-1 font-bold text-rose-900 uppercase tracking-wider text-[10px]">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>Common Error to Avoid</span>
                      </div>
                      <p className="text-rose-950 leading-relaxed">
                        {step.commonErrorToAvoid}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Field Data Recording Sheet Template */}
          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-stone-600">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Standardized Field Log Sheet Parameters (CEOS WGCV / ISO 19115-2)</span>
            </div>
            <p className="text-xs text-stone-500">
              Record the following required metadata fields on the waterproof field log tablet for every acquisition:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {exercise.dataRecordingSheetFields.map((field, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs font-medium text-stone-800"
                >
                  • {field}
                </div>
              ))}
            </div>
          </div>

          {/* Field Deliverable Submission Requirements */}
          <div className="p-5 bg-emerald-900 text-white rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Award className="w-4 h-4 text-emerald-300" />
              <span>Student Submission Deliverable</span>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              {exercise.fieldDeliverable}
            </p>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Spectral Data & Metadata Ingestion Form */}
      {activeSubTab === 'ingestion' && (
        <FieldDataIngestion moduleNumber={moduleNumber} />
      )}

      {/* PDF Export Modal */}
      <PDFExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        module={currentModule}
        initialMode="protocol"
      />
    </div>
  );
};
