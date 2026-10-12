import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Compass,
  Code2,
  HelpCircle,
  Activity,
  Users,
  Bot,
  Presentation,
  ExternalLink,
  Loader2,
  LogIn,
  LogOut,
  ChevronDown,
  Layers,
  BookA,
  Gauge,
  Download,
  Github
} from 'lucide-react';
import { COURSE_MODULES } from '../data/courseData';
import { initAuth, googleSignIn, logout } from '../services/firebaseAuth';
import { exportModuleToGoogleSlides } from '../services/slidesExportService';
import { downloadModulePptx } from '../services/pptxExportService';

import type { UserAuthProfile } from '../types';

interface NavbarProps {
  activeModuleIndex: number;
  onSelectModule: (index: number) => void;
  activeTab: 'slides' | 'field' | 'lab' | 'calibration' | 'quiz' | 'spectra' | 'glossary' | 'instructor';
  onChangeTab: (tab: 'slides' | 'field' | 'lab' | 'calibration' | 'quiz' | 'spectra' | 'glossary' | 'instructor') => void;
  onOpenAITutor: () => void;
  onOpenGlossary?: () => void;
  onOpenOfflineModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModuleIndex,
  onSelectModule,
  activeTab,
  onChangeTab,
  onOpenAITutor,
  onOpenGlossary,
  onOpenOfflineModal
}) => {
  const [user, setUser] = useState<UserAuthProfile | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessUrl, setExportSuccessUrl] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [showModuleMenu, setShowModuleMenu] = useState(false);

  useEffect(() => {
    initAuth((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      alert('Google Sign-In failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const handleDownloadPptxNav = async () => {
    setIsExportingPptx(true);
    try {
      const mod = COURSE_MODULES[activeModuleIndex];
      if (mod) await downloadModulePptx(mod);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingPptx(false);
    }
  };
  const handleExportSlides = async () => {
    const currentModule = COURSE_MODULES[activeModuleIndex];
    if (!currentModule) return;

    setIsExporting(true);
    setExportSuccessUrl(null);
    setExportError(null);

    try {
      const url = await exportModuleToGoogleSlides(currentModule, () => {});
      setExportSuccessUrl(url);
    } catch (err: any) {
      setExportError(err.message || 'An unexpected error occurred during export.');
    } finally {
      setIsExporting(false);
    }
  };

  const currentModule = COURSE_MODULES[activeModuleIndex];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* Top Banner with University / Course Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-stone-100">
          {/* Logo & Course Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  GEO-MSc-704
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  MSc Geo-Information &amp; Spatial Management
                </span>
              </div>
              <h1 className="text-base font-bold text-stone-900 leading-tight">
                Principles of Field Spectroscopy
              </h1>
            </div>
          </div>

          {/* Right Action Tools: Google Slides Export, AI Tutor, User Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Direct PPTX Download Button */}
            <button
              id="download-pptx-nav-btn"
              onClick={handleDownloadPptxNav}
              disabled={isExportingPptx}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
              title="Download PowerPoint (.pptx) file for this module"
            >
              {isExportingPptx ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  <span>PPTX...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Get</span>
                  <span>.PPTX</span>
                </>
              )}
            </button>
            {/* Export to Google Slides Button */}
            <button
              id="export-slides-nav-btn"
              onClick={handleExportSlides}
              disabled={isExporting}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors disabled:opacity-60 cursor-pointer"
              title="Export current 30-slide lecture deck to Google Slides via Google Workspace API"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
                  <span>Building Slides...</span>
                </>
              ) : (
                <>
                  <Presentation className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden md:inline">Export to</span>
                  <span>Google Slides</span>
                </>
              )}
            </button>

            {/* GitHub & Offline Export Button */}
            {onOpenOfflineModal && (
              <button
                id="open-offline-modal-btn"
                onClick={onOpenOfflineModal}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer shadow-xs border border-stone-700"
                title="Deploy to GitHub & Pages, download PowerPoint decks, or host with Python"
              >
                <Github className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">GitHub /</span>
                <span>Export</span>
              </button>
            )}

            {/* Spectral Glossary Quick Action Button */}
            <button
              id="open-glossary-nav-btn"
              onClick={onOpenGlossary ? onOpenGlossary : () => onChangeTab('glossary')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Open searchable Spectral Glossary with radiometric and calibration definitions"
            >
              <BookA className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Spectral</span>
              <span>Glossary</span>
            </button>

            {/* AI Research Tutor Button */}
            <button
              id="open-ai-tutor-btn"
              onClick={onOpenAITutor}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-purple-700" />
              <span className="hidden sm:inline">AI Research</span>
              <span>Tutor</span>
            </button>

            {/* Google Authentication */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-stone-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full border border-stone-300 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs text-stone-700 font-medium hidden lg:inline max-w-[120px] truncate">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="p-1 text-stone-400 hover:text-stone-600 rounded"
                  title="Sign out of Google"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="google-signin-btn"
                onClick={handleSignIn}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-stone-600" />
                <span>Google Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Export Notification / Success Banner */}
        {exportSuccessUrl && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs px-3 py-2 my-2 rounded-lg flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Presentation className="w-4 h-4 text-emerald-700" />
              <span>
                <strong>Deck Ready!</strong> Module {currentModule.moduleNumber} presentation created in your Google Slides.
              </span>
            </span>
            <a
              href={exportSuccessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-700 text-white rounded font-medium hover:bg-emerald-800 transition-colors"
            >
              <span>Open in Google Slides</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {exportError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-3 py-2 my-2 rounded-lg flex items-center justify-between">
            <span>{exportError}</span>
            <button
              onClick={() => setExportError(null)}
              className="text-rose-600 hover:text-rose-800 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Secondary Bar: Module Selector & Views Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 gap-2">
          {/* Module Dropdown Selector */}
          <div className="relative">
            <button
              id="module-selector-dropdown-btn"
              onClick={() => setShowModuleMenu(!showModuleMenu)}
              className="flex items-center space-x-2 text-left bg-stone-50 hover:bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-800 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Module {currentModule.moduleNumber}: {currentModule.shortTitle}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {showModuleMenu && (
              <div className="absolute left-0 mt-1 w-80 md:w-96 bg-white border border-stone-200 rounded-xl shadow-xl py-1.5 z-50">
                <div className="px-3 py-1.5 border-b border-stone-100 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Course Modules (8 Units • 30+ Slides Each)
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-stone-50">
                  {COURSE_MODULES.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectModule(idx);
                        setShowModuleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-xs flex items-start space-x-2.5 hover:bg-stone-50 transition-colors ${
                        idx === activeModuleIndex ? 'bg-emerald-50 text-emerald-950 font-semibold' : 'text-stone-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        idx === activeModuleIndex ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {m.moduleNumber}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{m.title}</div>
                        <div className="text-[11px] text-stone-500 font-normal">
                          {m.slides.length} slides • {m.durationHours}h • {m.ectsCredits} ECTS
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Primary View Tabs */}
          <nav className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              id="tab-slides-btn"
              onClick={() => onChangeTab('slides')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'slides'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lecture Deck ({currentModule.slides.length})</span>
            </button>

            <button
              id="tab-field-btn"
              onClick={() => onChangeTab('field')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'field'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Field Exercise</span>
            </button>

            <button
              id="tab-lab-btn"
              onClick={() => onChangeTab('lab')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'lab'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Practical Lab (Python/R)</span>
            </button>

            <button
              id="tab-calibration-btn"
              onClick={() => onChangeTab('calibration')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'calibration'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Sensor Calibration</span>
            </button>

            <button
              id="tab-quiz-btn"
              onClick={() => onChangeTab('quiz')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Automated Quiz</span>
            </button>

            <button
              id="tab-spectra-btn"
              onClick={() => onChangeTab('spectra')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'spectra'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Spectra Explorer</span>
            </button>

            <button
              id="tab-glossary-btn"
              onClick={() => onChangeTab('glossary')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'glossary'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BookA className="w-3.5 h-3.5" />
              <span>Spectral Glossary</span>
            </button>

            <button
              id="tab-instructor-btn"
              onClick={() => onChangeTab('instructor')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'instructor'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Instructor Dashboard</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
