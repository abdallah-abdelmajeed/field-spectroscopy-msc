import React from 'react';
import {
  Layers,
  Check,
  BarChart2,
  ChevronDown,
  Info,
  X,
  Target,
  Sparkles
} from 'lucide-react';
import {
  REFERENCE_COMPARISON_DATASETS,
  type ReferenceDatasetItem,
  type SpectralComparisonResult
} from '../data/rtmMetadata';

interface RTMCompareOverlayPanelProps {
  selectedReferenceId: string;
  onSelectReference: (id: string) => void;
  isCompareActive: boolean;
  onToggleCompare: (active: boolean) => void;
  metrics: SpectralComparisonResult | null;
  showResiduals: boolean;
  onToggleResiduals: (show: boolean) => void;
}

export const RTMCompareOverlayPanel: React.FC<RTMCompareOverlayPanelProps> = ({
  selectedReferenceId,
  onSelectReference,
  isCompareActive,
  onToggleCompare,
  metrics,
  showResiduals,
  onToggleResiduals
}) => {
  const currentRef =
    REFERENCE_COMPARISON_DATASETS.find((d) => d.id === selectedReferenceId) ||
    REFERENCE_COMPARISON_DATASETS[0];

  return (
    <div
      id="rtm-compare-panel"
      className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3.5"
    >
      {/* Top Header & Enable Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold transition-colors ${
              isCompareActive ? 'bg-purple-600 text-white' : 'bg-stone-100 text-stone-500'
            }`}
          >
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-2">
              <span>Spectral Overlay &amp; Empirical Validation</span>
              {isCompareActive && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  Overlay Active
                </span>
              )}
            </h3>
            <p className="text-[11px] text-stone-500">
              Overlay reference laboratory/field spectra against 4SAIL simulated canopy to assess model accuracy
            </p>
          </div>
        </div>

        {/* Master Toggle */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onToggleCompare(!isCompareActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center space-x-1.5 ${
              isCompareActive
                ? 'bg-purple-600 text-white shadow-xs hover:bg-purple-700'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isCompareActive ? 'Disable Compare Overlay' : 'Enable Compare Overlay'}</span>
          </button>
        </div>
      </div>

      {isCompareActive && (
        <div className="space-y-3 pt-1 animate-in fade-in duration-150">
          {/* Reference Dataset Dropdown Selector */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-7 space-y-1">
              <label className="text-xs font-semibold text-stone-700 flex items-center space-x-1">
                <span>Select Reference Empirical Dataset:</span>
              </label>
              <div className="relative">
                <select
                  value={selectedReferenceId}
                  onChange={(e) => onSelectReference(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-stone-50 text-stone-900 rounded-lg border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer appearance-none"
                >
                  {REFERENCE_COMPARISON_DATASETS.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.type}] {item.name} — {item.source}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="md:col-span-5 flex items-center justify-end space-x-3 pt-4 sm:pt-0">
              <label className="inline-flex items-center space-x-2 text-xs font-medium text-stone-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showResiduals}
                  onChange={(e) => onToggleResiduals(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-stone-300 accent-purple-600 cursor-pointer"
                />
                <span>Highlight Residual Differences (Δ &gt; 5%)</span>
              </label>
            </div>
          </div>

          {/* Active Reference Metadata Pill */}
          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-purple-950">
            <div className="space-y-0.5">
              <div className="font-bold flex items-center space-x-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: currentRef.color }}
                />
                <span>{currentRef.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-200/70 text-purple-900">
                  {currentRef.type}
                </span>
              </div>
              <p className="text-[11px] text-purple-900 leading-snug">
                {currentRef.description}
              </p>
            </div>
            <span className="text-[10px] font-mono text-purple-700 shrink-0 self-start sm:self-auto bg-white/70 px-2 py-0.5 rounded border border-purple-200">
              {currentRef.source}
            </span>
          </div>

          {/* Quantitative Validation Metrics Dashboard */}
          {metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
              {/* RMSE */}
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-0.5">
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  RMSE (Error)
                </div>
                <div className="text-base font-extrabold text-stone-900 font-mono">
                  {metrics.rmse.toFixed(4)}
                </div>
                <div className="text-[10px] text-stone-500">
                  {metrics.rmse < 0.05 ? 'High Accuracy (<0.05)' : 'Moderate Deviation'}
                </div>
              </div>

              {/* Spectral Angle Mapper (SAM) */}
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-0.5">
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  SAM Angle (θ)
                </div>
                <div className="text-base font-extrabold text-purple-900 font-mono">
                  {metrics.samDegrees.toFixed(2)}°
                </div>
                <div className="text-[10px] text-stone-500">
                  {metrics.samDegrees < 5 ? 'Excellent Shape Match' : 'Spectral Shape Differs'}
                </div>
              </div>

              {/* ΔNDVI */}
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-0.5">
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  ΔNDVI Divergence
                </div>
                <div className="text-base font-extrabold text-emerald-800 font-mono">
                  {metrics.deltaNdvi.toFixed(3)}
                </div>
                <div className="text-[10px] text-stone-500">
                  Sim: {metrics.simNdvi.toFixed(2)} vs Ref: {metrics.refNdvi.toFixed(2)}
                </div>
              </div>

              {/* ΔNDWI */}
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-0.5">
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  ΔNDWI (Water)
                </div>
                <div className="text-base font-extrabold text-sky-800 font-mono">
                  {metrics.deltaNdwi.toFixed(3)}
                </div>
                <div className="text-[10px] text-stone-500">
                  Sim: {metrics.simNdwi.toFixed(2)} vs Ref: {metrics.refNdwi.toFixed(2)}
                </div>
              </div>

              {/* Peak Residual Wavelength */}
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-0.5 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  Peak Residual
                </div>
                <div className="text-base font-extrabold text-rose-800 font-mono">
                  {(metrics.maxResidualDelta * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] text-stone-500">
                  Max at λ = {metrics.maxResidualWl} nm
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
