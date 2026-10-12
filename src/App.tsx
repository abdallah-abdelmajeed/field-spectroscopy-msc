import React, { useState } from 'react';
import { COURSE_MODULES, COURSE_SYLLABUS_OVERVIEW } from './data/courseData';
import { Navbar } from './components/Navbar';
import { SlidesViewer } from './components/SlidesViewer';
import { FieldExerciseView } from './components/FieldExerciseView';
import { PracticalLabView } from './components/PracticalLabView';
import { QuizView } from './components/QuizView';
import { SpectraExplorer } from './components/SpectraExplorer';
import { InstructorDashboard } from './components/InstructorDashboard';
import { AITutorModal } from './components/AITutorModal';
import { SyllabusModal } from './components/SyllabusModal';
import { SpectralGlossary } from './components/SpectralGlossary';
import { SpectralGlossaryModal } from './components/SpectralGlossaryModal';
import { HighlightGlossaryTooltip } from './components/HighlightGlossaryTooltip';
import { SensorCalibrationSimulator } from './components/SensorCalibrationSimulator';
import { OfflineDownloadModal } from './components/OfflineDownloadModal';
import {
  BookOpen,
  Compass,
  Code2,
  HelpCircle,
  Activity,
  Users,
  Layers,
  ChevronRight,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'slides' | 'field' | 'lab' | 'calibration' | 'quiz' | 'spectra' | 'glossary' | 'instructor'>('slides');
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [glossaryTargetTermId, setGlossaryTargetTermId] = useState<string | undefined>();
  const [glossarySearchQuery, setGlossarySearchQuery] = useState<string | undefined>();

  const currentModule = COURSE_MODULES[activeModuleIndex] || COURSE_MODULES[0];

  const handleOpenGlossary = (termId?: string, query?: string) => {
    setGlossaryTargetTermId(termId);
    setGlossarySearchQuery(query);
    setIsGlossaryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-950">
      {/* Global Interactive Floating Tooltip for Highlighted Lecture & Lab Terms */}
      <HighlightGlossaryTooltip onOpenFullGlossary={handleOpenGlossary} />

      {/* Top Navbar with Module Switcher & Quick Export */}
      <Navbar
        activeModuleIndex={activeModuleIndex}
        onSelectModule={(idx) => setActiveModuleIndex(idx)}
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        onOpenAITutor={() => setIsAITutorOpen(true)}
        onOpenGlossary={() => handleOpenGlossary()}
        onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Module Header Strip */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-stone-200 shadow-xs mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Module {currentModule.moduleNumber} of 8
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {currentModule.durationHours} Teaching Hours • {currentModule.ectsCredits} ECTS Credits
              </span>
              <button
                onClick={() => setIsSyllabusOpen(true)}
                className="text-xs text-emerald-800 hover:text-emerald-900 font-bold hover:underline inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>View Full Syllabus</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-stone-900">
              {currentModule.title}
            </h1>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
              {currentModule.abstract}
            </p>
          </div>

          {/* Module Core Competencies Pill List */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 md:max-w-xs shrink-0 space-y-1.5">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Core Competencies
            </div>
            <ul className="space-y-1 text-xs text-stone-700">
              {currentModule.coreCompetencies.slice(0, 3).map((comp, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5"></span>
                  <span className="line-clamp-2">{comp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* View Router */}
        <div>
          {activeTab === 'slides' && (
            <SlidesViewer module={currentModule} />
          )}

          {activeTab === 'field' && (
            <FieldExerciseView
              exercise={currentModule.fieldExercise}
              moduleNumber={currentModule.moduleNumber}
            />
          )}

          {activeTab === 'lab' && (
            <PracticalLabView
              lab={currentModule.practicalLab}
              moduleNumber={currentModule.moduleNumber}
              module={currentModule}
            />
          )}

          {activeTab === 'calibration' && (
            <SensorCalibrationSimulator />
          )}

          {activeTab === 'quiz' && (
            <QuizView
              quiz={currentModule.quiz}
              moduleNumber={currentModule.moduleNumber}
            />
          )}

          {activeTab === 'spectra' && (
            <SpectraExplorer />
          )}

          {activeTab === 'glossary' && (
            <SpectralGlossary
              initialTermId={glossaryTargetTermId}
              initialSearchQuery={glossarySearchQuery}
            />
          )}

          {activeTab === 'instructor' && (
            <InstructorDashboard />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-emerald-800" />
            <span className="font-semibold text-stone-700">
              Principles of Field Spectroscopy (GEO-MSc-704)
            </span>
            <span>• Master of Science in Geo-Information &amp; Spatial Management</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleOpenGlossary()}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Spectral Glossary
            </button>
            <button
              onClick={() => setIsSyllabusOpen(true)}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Curriculum Syllabus
            </button>
            <button
              onClick={() => setIsAITutorOpen(true)}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              AI Spectroscopy Tutor
            </button>
            <span>Aligned with CEOS WGCV Cal/Val</span>
          </div>
        </div>
      </footer>

      {/* AI Research Tutor Modal */}
      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        activeModule={currentModule}
      />

      {/* Full Course Syllabus Modal */}
      <SyllabusModal
        isOpen={isSyllabusOpen}
        onClose={() => setIsSyllabusOpen(false)}
        onSelectModule={(idx) => {
          setActiveModuleIndex(idx);
          setActiveTab('slides');
        }}
      />

      {/* Searchable Spectral Glossary Modal */}
      <SpectralGlossaryModal
        isOpen={isGlossaryModalOpen}
        onClose={() => {
          setIsGlossaryModalOpen(false);
          setGlossaryTargetTermId(undefined);
          setGlossarySearchQuery(undefined);
        }}
        initialTermId={glossaryTargetTermId}
        initialSearchQuery={glossarySearchQuery}
      />

      {/* Offline Download & Python Web Hosting Modal */}
      <OfflineDownloadModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
      />
    </div>
  );
}
