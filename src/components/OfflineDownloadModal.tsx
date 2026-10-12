import React, { useState } from 'react';
import {
  X,
  Download,
  Terminal,
  Server,
  Wifi,
  Laptop,
  Check,
  Copy,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  FolderArchive,
  ArrowRight,
  Presentation,
  CheckCircle2,
  Loader2,
  FileCode2,
  BookOpen,
  Github,
  GitBranch,
  Globe,
  ExternalLink
} from 'lucide-react';
import { COURSE_MODULES } from '../data/courseData';
import { downloadModulePptx } from '../services/pptxExportService';
import { downloadAllPptxAndScriptsZipDirect, ExportProgress } from '../services/clientZipService';

interface OfflineDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineDownloadModal: React.FC<OfflineDownloadModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'github' | 'pc' | 'pptx' | 'python' | 'lan'>('github');
  const [githubUser, setGithubUser] = useState('Abdelmajeed');
  const [githubRepo, setGithubRepo] = useState('field-spectroscopy-msc');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadingPptxModule, setDownloadingPptxModule] = useState<number | null>(null);
  const [isGeneratingAllZip, setIsGeneratingAllZip] = useState(false);
  const [zipProgress, setZipProgress] = useState<ExportProgress | null>(null);
  const [pptxSuccessMessage, setPptxSuccessMessage] = useState<string | null>(null);

  const gitPushCmds = `git remote add origin https://github.com/${githubUser}/${githubRepo}.git
git branch -M main
git push -u origin main`;
  const gitCloneCmds = `git clone https://github.com/${githubUser}/${githubRepo}.git
cd ${githubRepo}
pip install --user -r requirements.txt`;
  const ghPagesUrl = `https://${githubUser.toLowerCase()}.github.io/${githubRepo}/`;

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadModulePptx = async (modIndex: number) => {
    const mod = COURSE_MODULES[modIndex];
    if (!mod) return;
    setDownloadingPptxModule(mod.moduleNumber);
    setPptxSuccessMessage(null);
    try {
      await downloadModulePptx(mod);
      setPptxSuccessMessage(`Module ${mod.moduleNumber} (${mod.shortTitle}) PowerPoint downloaded successfully!`);
      setTimeout(() => setPptxSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to download PPTX:', err);
    } finally {
      setDownloadingPptxModule(null);
    }
  };

  const handleDownloadCompleteBundle = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsGeneratingAllZip(true);
    setPptxSuccessMessage(null);
    try {
      await downloadAllPptxAndScriptsZipDirect(COURSE_MODULES, (progress) => {
        setZipProgress(progress);
      });
      setPptxSuccessMessage('Complete Package ZIP (All 8 PPTX decks + Master 240-slide deck + Python scripts) downloaded!');
      setTimeout(() => setPptxSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Zip generation failed:', err);
      // Fallback to direct static link if memory generation fails
      const link = document.createElement('a');
      link.href = '/api/download/offline-package';
      link.download = 'field-spectroscopy-msc-offline.zip';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setIsGeneratingAllZip(false);
      setZipProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-stone-200 bg-linear-to-r from-stone-900 via-stone-800 to-emerald-950 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Offline & Python Hosting
              </span>
              <span className="text-xs text-stone-300 font-medium">
                Complete MSc Curriculum & Lab Platform
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center space-x-2">
              <Laptop className="w-5 h-5 text-emerald-400" />
              <span>Download Complete Package & Offline Host</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress or Success Alert */}
        {zipProgress && (
          <div className="bg-emerald-900 text-emerald-100 px-6 py-3 border-b border-emerald-700 flex flex-col space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                <span>{zipProgress.step}</span>
              </span>
              <span>{zipProgress.percent}%</span>
            </div>
            {zipProgress.details && (
              <span className="text-[11px] text-emerald-300">{zipProgress.details}</span>
            )}
            <div className="w-full bg-emerald-950 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${zipProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {pptxSuccessMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center space-x-2 text-xs font-medium text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{pptxSuccessMessage}</span>
          </div>
        )}

        {/* Quick Download Banner */}
        <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-stone-50 border-b border-emerald-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
              <FolderArchive className="w-4 h-4 text-emerald-700" />
              <span>Direct Standalone Package (.ZIP)</span>
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Includes full web app, all 8 PPTX decks, master 240-slide presentation, USGS libraries, and Python servers.
            </p>
          </div>
          <button
            onClick={handleDownloadCompleteBundle}
            disabled={isGeneratingAllZip}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer disabled:opacity-60 whitespace-nowrap"
          >
            {isGeneratingAllZip ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                <span>Assembling ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Complete Package (ZIP)</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6">
          <button
            onClick={() => setActiveTab('pc')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
              activeTab === 'pc'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>1. Run on PC (Offline)</span>
          </button>
          <button
            onClick={() => setActiveTab('pptx')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
              activeTab === 'pptx'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
            }`}
          >
            <Presentation className="w-4 h-4 text-amber-600" />
            <span>2. PowerPoint Decks (.PPTX)</span>
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
              activeTab === 'python'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>3. Host on Python (Flask/WSGI)</span>
          </button>
          <button
            onClick={() => setActiveTab('lan')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
              activeTab === 'lan'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>4. Local Network (Classroom LAN)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: GITHUB REPOSITORY & GITHUB PAGES */}
          {activeTab === 'github' && (
            <div className="space-y-6">
              {/* GitHub Header Hero */}
              <div className="bg-stone-900 text-white rounded-xl p-5 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-stone-800 rounded-lg text-emerald-400 border border-stone-700">
                      <Github className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-tight text-white flex items-center space-x-2">
                        <span>Yes, this app can be on GitHub!</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded">
                          100% Ready
                        </span>
                      </h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Full source code, 240 master slides, all 8 PowerPoint decks, and automated GitHub Pages workflow.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-stone-800 text-xs">
                  <div className="flex items-center space-x-2 text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Free 24/7 Hosting on GitHub Pages</span>
                  </div>
                  <div className="flex items-center space-x-2 text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Direct git clone on PythonAnywhere</span>
                  </div>
                  <div className="flex items-center space-x-2 text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Clean Code &gt; Download ZIP for anyone</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Push to GitHub Interactive Tool */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-300">
                    Step 1: Push to your GitHub Repository
                  </span>
                  <a
                    href="https://github.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Create new repo on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs text-stone-600">
                  Create a new blank repository at <a href="https://github.com/new" target="_blank" rel="noreferrer" className="underline font-medium text-stone-800">github.com/new</a> (e.g. named <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">field-spectroscopy-msc</code>). 
                  Leave &quot;Initialize with README&quot; unchecked.
                </p>

                {/* Username and Repo input fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Your GitHub Username:</label>
                    <input
                      type="text"
                      value={githubUser}
                      onChange={(e) => setGithubUser(e.target.value.trim() || 'Abdelmajeed')}
                      placeholder="e.g. Abdelmajeed"
                      className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 font-mono text-stone-800 text-xs focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Repository Name:</label>
                    <input
                      type="text"
                      value={githubRepo}
                      onChange={(e) => setGithubRepo(e.target.value.trim() || 'field-spectroscopy-msc')}
                      placeholder="e.g. field-spectroscopy-msc"
                      className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 font-mono text-stone-800 text-xs focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Git Push Commands */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-stone-700 font-medium">
                    <span>Run in your local terminal:</span>
                    <button
                      onClick={() => copyToClipboard(gitPushCmds, 'git-push-all')}
                      className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedKey === 'git-push-all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'git-push-all' ? 'Copied All Commands!' : 'Copy All Commands'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-stone-900 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto leading-relaxed border border-stone-800">
{}
                  </pre>
                </div>
              </div>

              {/* Step 2: GitHub Pages (Free 24/7 Web App) */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Step 2: Enable Free 24/7 Hosting (GitHub Pages)
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                    Workflow already included (.github/workflows/deploy.yml)
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We have pre-configured a continuous deployment workflow. When you push to GitHub, enable GitHub Pages:
                </p>
                <ol className="text-xs text-stone-700 space-y-2 list-decimal list-inside pl-1 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <li>Open your repo on GitHub: <a href={"https://github.com/" + githubUser + "/" + githubRepo} target="_blank" rel="noreferrer" className="underline font-mono text-emerald-800 font-bold">https://github.com/{githubUser}/{githubRepo}</a></li>
                  <li>Go to <strong>Settings</strong> &gt; <strong>Pages</strong> (on the left menu).</li>
                  <li>Under <strong>Build and deployment &gt; Source</strong>, choose <strong>GitHub Actions</strong>.</li>
                  <li>That&apos;s all! Within 60 seconds your app will be live worldwide at: <br />
                    <span className="font-mono text-emerald-700 font-bold bg-white px-2 py-1 rounded border border-emerald-200 inline-block mt-1 select-all">
                      https://{githubUser.toLowerCase()}.github.io/{githubRepo}/
                    </span>
                  </li>
                </ol>
              </div>

              {/* Step 3: Connect to PythonAnywhere via Git */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Step 3: Clone into PythonAnywhere (No File Uploads Needed!)
                  </span>
                  <a
                    href="https://www.pythonanywhere.com/user/Abdelmajeed/consoles/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Open PythonAnywhere Consoles</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Instead of struggling with manual zip uploading, open your <strong>Bash Console</strong> on PythonAnywhere and run:
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span className="font-medium">PythonAnywhere Bash Console commands:</span>
                    <button
                      onClick={() => copyToClipboard(gitCloneCmds, 'pa-git-clone')}
                      className="text-blue-700 hover:text-blue-900 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedKey === 'pa-git-clone' ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'pa-git-clone' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-stone-900 text-blue-300 font-mono text-xs rounded-lg overflow-x-auto leading-relaxed border border-stone-800">
{}
                  </pre>
                </div>
                <p className="text-xs text-stone-500">
                  Then in PythonAnywhere Web Tab, configure WSGI to load <code className="font-mono text-stone-700 bg-stone-100 px-1 py-0.5 rounded">from app_flask import app as application</code>.
                </p>
              </div>

              {/* Step 4: Anyone can download complete ZIP from GitHub */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 space-y-2">
                <h4 className="text-xs font-bold text-stone-800 flex items-center space-x-2">
                  <FolderArchive className="w-4 h-4 text-emerald-700" />
                  <span>Direct Download via GitHub Bypasses Browser Restrictions</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  On GitHub, clicking the green <strong>Code</strong> button &gt; <strong>Download ZIP</strong> delivers the pristine master repository, all 8 PowerPoint presentation files, the 240-slide master deck, and all simulation algorithms without any browser timeouts.
                </p>
              </div>
            </div>
          )}


          {/* TAB 1: RUN OFFLINE ON PC */}
          {activeTab === 'pc' && (
            <div className="space-y-6">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Zero-Cloud, Fully Autonomous Setup</span>
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  The application is engineered as a zero-dependency Progressive Web Application with pre-compiled 
                  analytical engines: PROSAIL radiative transfer model, USGS mineral and vegetation spectral signatures, 
                  Lambertian cosine calibrators, and the entire 240-slide curriculum.
                </p>
              </div>

              {/* Step by Step instructions */}
              <div className="space-y-4">
                <div className="border border-stone-200 rounded-xl p-4 space-y-2 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Step 1: Download &amp; Extract
                    </span>
                    <button
                      onClick={handleDownloadCompleteBundle}
                      disabled={isGeneratingAllZip}
                      className="text-xs text-emerald-800 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .ZIP</span>
                    </button>
                  </div>
                  <p className="text-xs text-stone-600">
                    Click the download button above or in the modal header. Extract the archive into any folder on your PC (e.g. <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">C:\SpectroscopyApp\</code>).
                  </p>
                </div>

                <div className="border border-stone-200 rounded-xl p-4 space-y-2 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Step 2: Windows 1-Click Launch
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">run_offline.bat</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Double-click <strong className="text-stone-900">run_offline.bat</strong> in the extracted folder. It automatically detects Python 3, starts the local server, and launches your default browser.
                  </p>
                </div>

                <div className="border border-stone-200 rounded-xl p-4 space-y-2 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Step 3: macOS / Linux Terminal Launch
                    </span>
                    <button
                      onClick={() => copyToClipboard('bash run_offline.sh', 'sh')}
                      className="text-xs text-stone-600 hover:text-stone-900 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedKey === 'sh' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'sh' ? 'Copied' : 'Copy Command'}</span>
                    </button>
                  </div>
                  <div className="bg-stone-900 text-stone-100 p-3 rounded-lg font-mono text-xs flex items-center justify-between">
                    <code>bash run_offline.sh</code>
                  </div>
                </div>

                <div className="border border-stone-200 rounded-xl p-4 space-y-2 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      Standard Python CLI
                    </span>
                    <button
                      onClick={() => copyToClipboard('python3 server.py', 'py-std')}
                      className="text-xs text-stone-600 hover:text-stone-900 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedKey === 'py-std' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'py-std' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="bg-stone-900 text-stone-100 p-3 rounded-lg font-mono text-xs flex items-center justify-between">
                    <code>python3 server.py 8000</code>
                  </div>
                  <p className="text-xs text-stone-500">
                    Then open <span className="font-semibold text-emerald-700">http://localhost:8000</span> in Chrome, Edge, Safari, or Firefox.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POWERPOINT DECKS (.PPTX) */}
          {activeTab === 'pptx' && (
            <div className="space-y-6">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-amber-950 flex items-center space-x-2">
                      <Presentation className="w-4 h-4 text-amber-600" />
                      <span>Ready-to-Present Academic Slides (.pptx)</span>
                    </h4>
                    <p className="text-xs text-amber-800 mt-1">
                      Direct client-side generation. Generates cleanly inside your browser with 16:9 widescreen layout, full speaker lecture notes, mathematical equations, and citations.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadCompleteBundle}
                    disabled={isGeneratingAllZip}
                    className="shrink-0 ml-3 inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-700 text-white font-bold text-xs hover:bg-amber-800 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All in 1 ZIP</span>
                  </button>
                </div>
              </div>

              {/* Module PPTX Grid */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Individual Module Presentations (30 Slides Each)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {COURSE_MODULES.map((mod, idx) => (
                    <div
                      key={mod.moduleNumber}
                      className="border border-stone-200 rounded-xl p-3.5 bg-stone-50/50 hover:bg-white hover:border-amber-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                          <Presentation className="w-3 h-3 text-amber-600" />
                          <span>Module {mod.moduleNumber}</span>
                          <span className="text-stone-400">•</span>
                          <span className="text-stone-500 font-normal">30 Slides</span>
                        </div>
                        <h6 className="text-xs font-bold text-stone-900 truncate mt-0.5">
                          {mod.shortTitle}
                        </h6>
                        <p className="text-[11px] text-stone-500 truncate">
                          {mod.title}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadModulePptx(idx)}
                        disabled={downloadingPptxModule === mod.moduleNumber}
                        className="shrink-0 inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer disabled:opacity-50"
                        title="Download PowerPoint (.pptx)"
                      >
                        {downloadingPptxModule === mod.moduleNumber ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-amber-300" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3 text-amber-400" />
                            <span>.PPTX</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PYTHON FLASK WSGI SERVER */}
          {activeTab === 'python' && (
            <div className="space-y-5">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
                  <Server className="w-4 h-4 text-emerald-700" />
                  <span>Production WSGI Hosting with Flask &amp; Gunicorn</span>
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Deploy to your department's internal Linux server, Docker container, or cloud virtual machine using the included <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">app_flask.py</code> WSGI entrypoint.
                </p>
              </div>

              <div className="space-y-3">
                <div className="border border-stone-200 rounded-xl p-4 space-y-2 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      1. Install Flask &amp; Gunicorn
                    </span>
                    <button
                      onClick={() => copyToClipboard('pip install -r requirements.txt', 'pip')}
                      className="text-xs text-stone-600 hover:text-stone-900 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedKey === 'pip' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'pip' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="bg-stone-900 text-stone-100 p-3 rounded-lg font-mono text-xs">
                    <code>pip install -r requirements.txt</code>
                  </div>
                </div>

                <div className="border border-stone-200 rounded-xl p-4 space-y-2 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      2. Run Production WSGI Server
                    </span>
                    <button
                      onClick={() => copyToClipboard('gunicorn -w 4 -b 0.0.0.0:8000 app_flask:app', 'gunicorn')}
                      className="text-xs text-stone-600 hover:text-stone-900 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedKey === 'gunicorn' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'gunicorn' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="bg-stone-900 text-stone-100 p-3 rounded-lg font-mono text-xs">
                    <code>gunicorn -w 4 -b 0.0.0.0:8000 app_flask:app</code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLASSROOM LAN SHARING */}
          {activeTab === 'lan' && (
            <div className="space-y-5">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-emerald-700" />
                  <span>Host for an Entire Classroom Without Internet</span>
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Run the Python server on an instructor's laptop connected to a local Wi-Fi router. 
                  Every student and field team member can connect simultaneously via their tablets, laptops, and smartphones.
                </p>
              </div>

              <div className="border border-stone-200 rounded-xl p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Host on all Local Network Interfaces (0.0.0.0)
                  </span>
                  <button
                    onClick={() => copyToClipboard('python3 server.py 8000', 'lan')}
                    className="text-xs text-stone-600 hover:text-stone-900 flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'lan' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'lan' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-stone-900 text-stone-100 p-3 rounded-lg font-mono text-xs">
                  <code>python3 server.py 8000</code>
                </div>
                <p className="text-xs text-stone-600">
                  Students connect to <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">http://&lt;INSTRUCTOR-IP&gt;:8000</code>. No login or authorization required.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-stone-500">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Includes 8 modules, 240 academic slides, and scientific datasets.</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadCompleteBundle}
              disabled={isGeneratingAllZip}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer flex items-center space-x-1.5 disabled:opacity-60"
            >
              {isGeneratingAllZip ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating ZIP...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full ZIP</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
