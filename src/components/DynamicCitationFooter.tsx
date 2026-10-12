import React, { useState, useMemo } from 'react';
import {
  BookMarked,
  Database,
  FileCheck2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import type { CourseModule } from '../types';
import {
  getModuleCitations,
  formatAPA,
  formatBibTeX,
  CitationItem
} from '../data/citationsData';

interface DynamicCitationFooterProps {
  module: CourseModule;
  activeSlideIndex?: number;
  className?: string;
  defaultExpanded?: boolean;
}

export const DynamicCitationFooter: React.FC<DynamicCitationFooterProps> = ({
  module,
  activeSlideIndex,
  className = '',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'all' | 'libraries' | 'protocols' | 'papers'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Retrieve citations for this module
  const citationGroup = useMemo(() => {
    return getModuleCitations(module);
  }, [module]);

  // Flattened all citations
  const allCitations = useMemo(() => {
    return [
      ...citationGroup.spectralLibraries,
      ...citationGroup.fieldProtocols,
      ...citationGroup.academicLiterature
    ];
  }, [citationGroup]);

  // Filter citations based on activeTab and searchQuery
  const filteredCitations = useMemo(() => {
    let list: CitationItem[] = [];
    if (activeTab === 'all') {
      list = allCitations;
    } else if (activeTab === 'libraries') {
      list = citationGroup.spectralLibraries;
    } else if (activeTab === 'protocols') {
      list = citationGroup.fieldProtocols;
    } else if (activeTab === 'papers') {
      list = citationGroup.academicLiterature;
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.authors.toLowerCase().includes(q) ||
        item.authorityOrCurator.toLowerCase().includes(q) ||
        item.applicationNote.toLowerCase().includes(q) ||
        (item.spectralCoverageOrScope && item.spectralCoverageOrScope.toLowerCase().includes(q))
    );
  }, [allCitations, citationGroup, activeTab, searchQuery]);

  const handleCopySingle = (item: CitationItem) => {
    const apaText = formatAPA(item);
    navigator.clipboard.writeText(apaText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyBibTeXSingle = (item: CitationItem) => {
    const bib = formatBibTeX(item);
    navigator.clipboard.writeText(bib);
    setCopiedId(`bib_${item.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllAPA = () => {
    const fullText = allCitations
      .map((item, idx) => `${idx + 1}. ${formatAPA(item)}`)
      .join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleDownloadBibTeX = () => {
    const bibContent = allCitations.map(item => formatBibTeX(item)).join('\n\n');
    const blob = new Blob([bibContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `module_${module.moduleNumber}_spectral_references.bib`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTextAPA = () => {
    const header = `Field Spectroscopy & Cal/Val Reference List\nModule ${module.moduleNumber}: ${module.title}\nAPA 7th Edition Formatting\nGenerated on: ${new Date().toLocaleDateString()}\n\n${'='.repeat(70)}\n\n`;
    const body = allCitations.map((item, idx) => `[${idx + 1}] ${formatAPA(item)}\n    Application: ${item.applicationNote}\n    Curator/Authority: ${item.authorityOrCurator}\n`).join('\n');
    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `module_${module.moduleNumber}_references_APA7.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <footer
      id="dynamic-citation-footer"
      className={`mt-8 bg-stone-900 text-stone-200 rounded-2xl border border-stone-800 shadow-lg overflow-hidden ${className}`}
    >
      {/* Footer Collapsible Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-white tracking-tight">
                Module {module.moduleNumber} Citations, Spectral Libraries &amp; Field Protocols
              </h4>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                APA 7th Edition
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Authoritative standards for calibration, radiative transfer, and laboratory spectral libraries.
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleCopyAllAPA}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors cursor-pointer shadow-xs"
            title="Copy all citations formatted in APA 7th edition"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All APA</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadBibTeX}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
            title="Export all citations as BibTeX (.bib) file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">BibTeX</span>
          </button>

          <button
            onClick={handleDownloadTextAPA}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
            title="Export references as formatted text (.txt)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">.TXT</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-700 transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Collapse citation footer' : 'Expand citation footer'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content Panel */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-5 bg-stone-900/95">
          {/* Filter Bar & Search Box */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-4 border-b border-stone-800">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-800/80 text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <span>All References</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                  {allCitations.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('libraries')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'libraries'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-stone-800/80 text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Spectral Libraries</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                  {citationGroup.spectralLibraries.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('protocols')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'protocols'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-stone-800/80 text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Field Protocols &amp; Standards</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                  {citationGroup.fieldProtocols.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('papers')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'papers'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-stone-800/80 text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>Peer-Reviewed Papers</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                  {citationGroup.academicLiterature.length}
                </span>
              </button>
            </div>

            {/* In-Footer Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search references or authority..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Citations List Grid */}
          <div className="space-y-4">
            {filteredCitations.map(item => {
              const apaString = formatAPA(item);
              const isCopied = copiedId === item.id;
              const isBibCopied = copiedId === `bib_${item.id}`;

              const typeBadgeColor =
                item.type === 'spectral_library'
                  ? 'bg-purple-900/60 text-purple-300 border-purple-700/60'
                  : item.type === 'field_protocol'
                  ? 'bg-amber-900/60 text-amber-300 border-amber-700/60'
                  : 'bg-blue-900/60 text-blue-300 border-blue-700/60';

              const typeLabel =
                item.type === 'spectral_library'
                  ? 'Spectral Library'
                  : item.type === 'field_protocol'
                  ? 'Field Measurement Protocol'
                  : 'Journal Article';

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 hover:border-stone-700 transition-all space-y-2.5 text-xs group"
                >
                  {/* Item Badges & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md font-semibold border ${typeBadgeColor} text-[10px] uppercase tracking-wider`}>
                        {typeLabel}
                      </span>

                      <span className="px-2 py-0.5 rounded-md font-medium bg-stone-800 text-stone-300 border border-stone-700 text-[10px]">
                        Authority: <strong className="text-white">{item.authorityOrCurator}</strong>
                      </span>

                      {item.spectralCoverageOrScope && (
                        <span className="px-2 py-0.5 rounded-md font-mono bg-stone-900 text-stone-400 border border-stone-800 text-[10px]">
                          {item.spectralCoverageOrScope}
                        </span>
                      )}
                    </div>

                    {/* Copy Buttons */}
                    <div className="flex items-center space-x-1.5 opacity-90 group-hover:opacity-100">
                      <button
                        onClick={() => handleCopySingle(item)}
                        className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-medium transition-colors cursor-pointer border border-stone-700/80"
                        title="Copy APA 7th reference to clipboard"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied APA</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy APA</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopyBibTeXSingle(item)}
                        className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 text-[11px] font-mono transition-colors cursor-pointer border border-stone-700/80"
                        title="Copy BibTeX code to clipboard"
                      >
                        {isBibCopied ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <span>.bib</span>
                        )}
                      </button>

                      {item.doiOrUrl && (
                        <a
                          href={item.doiOrUrl.startsWith('http') ? item.doiOrUrl : `https://doi.org/${item.doiOrUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer border border-stone-700/80"
                          title="Open official DOI / repository link"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Formatted APA Citation Body */}
                  <div className="font-serif text-[13px] leading-relaxed text-stone-100 pl-3 border-l-2 border-emerald-600/80">
                    <span>{item.authors} ({item.year}). {item.title}. </span>
                    <em className="text-emerald-300">{item.source}</em>
                    {item.volumeIssuePages && <span>, {item.volumeIssuePages}.</span>}
                    {item.doiOrUrl && (
                      <span className="font-mono text-xs text-stone-400 block mt-0.5 break-all">
                        {item.doiOrUrl}
                      </span>
                    )}
                  </div>

                  {/* Field Application Note */}
                  <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800/80 text-[11px] text-stone-300 leading-relaxed">
                    <span className="font-bold text-emerald-400">Practical Application in Module {module.moduleNumber}: </span>
                    <span>{item.applicationNote}</span>
                  </div>
                </div>
              );
            })}

            {filteredCitations.length === 0 && (
              <div className="p-8 text-center bg-stone-950 rounded-xl border border-stone-800 text-stone-500 text-xs">
                No citations found matching "{searchQuery}". Try clearing your search query.
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
