import React from 'react';
import {
  BookOpen,
  Award,
  Clock,
  Wrench,
  CheckCircle,
  X,
  FileText,
  Calendar,
  Layers
} from 'lucide-react';
import { COURSE_SYLLABUS_OVERVIEW, COURSE_MODULES } from '../data/courseData';

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (index: number) => void;
}

export const SyllabusModal: React.FC<SyllabusModalProps> = ({
  isOpen,
  onClose,
  onSelectModule
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300">
                {COURSE_SYLLABUS_OVERVIEW.courseCode} Curriculum
              </span>
              <h3 className="text-base font-bold">
                {COURSE_SYLLABUS_OVERVIEW.courseName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-800">
          {/* Key Syllabus Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="text-[10px] font-bold text-stone-500 uppercase">ECTS Credits</div>
              <div className="text-xl font-extrabold text-emerald-800 mt-0.5">
                {COURSE_SYLLABUS_OVERVIEW.totalEctsCredits} ECTS
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="text-[10px] font-bold text-stone-500 uppercase">Lectures &amp; Slides</div>
              <div className="text-xl font-extrabold text-stone-900 mt-0.5">
                {COURSE_SYLLABUS_OVERVIEW.totalSlidesCount} Slides (8 Units)
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="text-[10px] font-bold text-stone-500 uppercase">Field Campaigns</div>
              <div className="text-xl font-extrabold text-stone-900 mt-0.5">
                {COURSE_SYLLABUS_OVERVIEW.totalFieldExerciseHours} Hours
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="text-[10px] font-bold text-stone-500 uppercase">Python / R Labs</div>
              <div className="text-xl font-extrabold text-stone-900 mt-0.5">
                {COURSE_SYLLABUS_OVERVIEW.totalLabHours} Hours
              </div>
            </div>
          </div>

          {/* Standards & Instrument Platforms */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <div className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Accreditation &amp; International Scientific Standards</span>
            </div>
            <p className="text-emerald-950 leading-relaxed">
              Curriculum aligned with {COURSE_SYLLABUS_OVERVIEW.curriculumStandard}.
              Laboratory software ecosystem: <code className="font-mono bg-white px-1 py-0.5 rounded text-emerald-900">{COURSE_SYLLABUS_OVERVIEW.softwareEcosystem}</code>.
            </p>
            <div className="pt-2">
              <span className="font-bold text-emerald-900 block mb-1">Teaching Spectroradiometer Platforms:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                {COURSE_SYLLABUS_OVERVIEW.instrumentPlatforms.map((inst, i) => (
                  <li key={i} className="flex items-center space-x-1.5 text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Module-by-Module Syllabus Sequence */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] border-b border-stone-200 pb-2">
              Curriculum Schedule (8 Academic Modules)
            </h4>
            <div className="space-y-2">
              {COURSE_MODULES.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-3 bg-white rounded-xl border border-stone-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                        Module {m.moduleNumber}
                      </span>
                      <span className="font-bold text-stone-900">{m.title}</span>
                    </div>
                    <div className="text-stone-500 text-[11px] pl-1">
                      {m.slides.length} slides • {m.durationHours}h • Field: {m.fieldExercise.title}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectModule(idx);
                      onClose();
                    }}
                    className="px-3 py-1 bg-stone-100 hover:bg-emerald-800 hover:text-white rounded-lg text-stone-700 font-medium transition-colors shrink-0 cursor-pointer"
                  >
                    Open Module →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
