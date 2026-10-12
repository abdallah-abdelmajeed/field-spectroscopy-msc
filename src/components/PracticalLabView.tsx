import React, { useState, useMemo } from 'react';
import {
  Code2,
  Database,
  CheckCircle,
  Copy,
  Check,
  Download,
  Terminal,
  FileCode,
  ListTodo,
  FileCheck,
  BookA,
  Sparkles,
  Zap,
  BookOpen
} from 'lucide-react';
import type { PracticalLab, CourseModule } from '../types';
import { downloadJupyterNotebook } from '../utils/jupyterGenerator';
import { PracticalLabSandbox } from './PracticalLabSandbox';
import { SensorCalibrationSimulator } from './SensorCalibrationSimulator';
import { DynamicCitationFooter } from './DynamicCitationFooter';
import { Gauge } from 'lucide-react';

interface PracticalLabViewProps {
  lab: PracticalLab;
  moduleNumber: number;
  module?: CourseModule;
}

export const PracticalLabView: React.FC<PracticalLabViewProps> = ({
  lab,
  moduleNumber,
  module
}) => {
  const [viewMode, setViewMode] = useState<'sandbox' | 'simulator' | 'code'>('sandbox');
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Resolved module for Jupyter download & citation references
  const resolvedModule: CourseModule = useMemo(() => {
    return (
      module || {
        id: `module_${moduleNumber}`,
        moduleNumber,
        title: lab.title,
        shortTitle: `Mod ${moduleNumber}`,
        subtitle: `Practical Laboratory for Module ${moduleNumber}`,
        durationHours: 4,
        ectsCredits: 1.5,
        abstract: '',
        coreCompetencies: [],
        slides: [],
        fieldExercise: {} as any,
        practicalLab: lab,
        quiz: {} as any,
        keyReferences: []
      }
    );
  }, [module, moduleNumber, lab]);

  const currentSnippet = lab.codeSnippets[activeSnippetIndex] || lab.codeSnippets[0];

  const handleCopyCode = () => {
    if (!currentSnippet) return;
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    if (!currentSnippet) return;
    const blob = new Blob([currentSnippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Module_${moduleNumber}_Lab_${currentSnippet.language}.${currentSnippet.language === 'python' ? 'py' : 'R'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJupyter = () => {
    downloadJupyterNotebook(resolvedModule, lab);
  };

  return (
    <div className="space-y-6">
      {/* Lab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-stone-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
              Module {moduleNumber} Laboratory
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {lab.softwareEnvironment}
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            {lab.title}
          </h2>
        </div>

        {/* Action Controls: Download Jupyter Notebook & Switch Modes */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadJupyter}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
            title="Download interactive, fully formatted Jupyter Notebook (.ipynb) with markdown explanations and Python code ready to run in Google Colab or VS Code"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Jupyter (.ipynb)</span>
          </button>

          <div className="flex items-center p-0.5 bg-stone-100 rounded-lg border border-stone-200">
            <button
              onClick={() => setViewMode('sandbox')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'sandbox'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
              <span>Execution Sandbox</span>
            </button>
            <button
              onClick={() => setViewMode('simulator')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'simulator'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Gauge className="w-3.5 h-3.5 inline mr-1 text-purple-600" />
              <span>Calibration Simulator</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'code'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
              <span>Code Scripts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Spectral Glossary Active Hint */}
      <div className="flex items-center justify-between px-4 py-2 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-950">
        <div className="flex items-center space-x-2">
          <BookA className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>
            <strong>Spectral Glossary active:</strong> Highlight any variable or parameter (e.g. <em>DN</em>, <em>Dark Current</em>, <em>SNR</em>, <em>HDRF</em>, <em>Integration Time</em>) to view its scientific definition popup.
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-1 text-[11px] text-stone-500">
          <span className="font-semibold">Packages:</span>
          {lab.primaryPackages.map((pkg, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded bg-white text-stone-700 border border-stone-200 font-mono text-[10px]"
            >
              {pkg}
            </span>
          ))}
        </div>
      </div>

      {/* Overview Grid: Objectives & Dataset */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Learning Objectives */}
        <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <span>Learning Objectives</span>
          </div>
          <ul className="space-y-2">
            {lab.learningObjectives.map((obj, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-stone-800 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5"></span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sample Dataset Specification */}
        <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Database className="w-4 h-4 text-emerald-700" />
            <span>Curated Sample Dataset</span>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-semibold text-stone-700">File: </span>
              <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-900 font-bold">
                {lab.sampleDataset.name}
              </code>
            </div>
            <p className="text-stone-600 leading-relaxed">
              {lab.sampleDataset.description}
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-100 text-[11px]">
              <div>
                <span className="text-stone-400 block">Spectral Range:</span>
                <span className="font-semibold text-stone-800">{lab.sampleDataset.spectralRange}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Sensor:</span>
                <span className="font-semibold text-stone-800">{lab.sampleDataset.sensor}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Band Channels:</span>
                <span className="font-semibold text-stone-800">{lab.sampleDataset.bandsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODE CONDITIONAL CONTENT */}
      {viewMode === 'sandbox' ? (
        <PracticalLabSandbox moduleNumber={moduleNumber} />
      ) : viewMode === 'simulator' ? (
        <SensorCalibrationSimulator />
      ) : (
        /* Interactive Code Snippets Viewer */
        <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-lg">
          {/* Code Bar Header */}
          <div className="px-5 py-3.5 bg-stone-950 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Language / Snippet Selector Tabs */}
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400 mr-1" />
              {lab.codeSnippets.map((snippet, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSnippetIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    idx === activeSnippetIndex
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700'
                  }`}
                >
                  {snippet.language === 'python' ? '🐍 Python Script' : '📊 R Script'}
                </button>
              ))}
            </div>

            {/* Action Tools: Copy, Download */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
                title="Copy code to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadCode}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
                title="Download standalone script file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {currentSnippet?.language === 'python' ? '.py' : '.R'}</span>
              </button>

              <button
                onClick={handleDownloadJupyter}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium bg-amber-700 hover:bg-amber-600 text-amber-100 transition-colors cursor-pointer"
                title="Download full Jupyter Notebook (.ipynb)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Jupyter (.ipynb)</span>
              </button>
            </div>
          </div>

          {/* Code Snippet Title & Description */}
          {currentSnippet && (
            <div className="px-5 py-3 bg-stone-900/90 border-b border-stone-800 text-xs">
              <div className="font-bold text-white mb-0.5">
                {currentSnippet.title}
              </div>
              <div className="text-stone-400 text-[11px]">
                {currentSnippet.description}
              </div>
            </div>
          )}

          {/* Code Editor Body */}
          <div className="p-5 overflow-x-auto font-mono text-xs text-stone-100 leading-relaxed max-h-[500px] overflow-y-auto">
            <pre>
              <code>{currentSnippet ? currentSnippet.code : '# No code snippet available'}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Student Hands-On Tasks Checklist */}
      <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-stone-600">
          <ListTodo className="w-4 h-4 text-emerald-700" />
          <span>Student Practical Assignments &amp; Coding Tasks</span>
        </div>
        <ol className="space-y-2 text-xs list-decimal list-inside text-stone-800">
          {lab.studentTasks.map((task, idx) => (
            <li key={idx} className="leading-relaxed pl-1">
              <span className="font-semibold text-stone-900">Task {idx + 1}: </span>
              <span>{task}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Expected Deliverable Summary */}
      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
        <div className="flex items-center space-x-2 font-bold uppercase tracking-wider text-emerald-900">
          <FileCheck className="w-4 h-4 text-emerald-700" />
          <span>Expected Submission Deliverable</span>
        </div>
        <p className="leading-relaxed">
          {lab.expectedOutputSummary}
        </p>
      </div>

      {/* Dynamic Citation Footer for Lab Standards and Spectral Libraries */}
      <DynamicCitationFooter module={resolvedModule} />
    </div>
  );
};

