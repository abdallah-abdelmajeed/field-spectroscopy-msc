import React, { useState, useRef, useEffect } from 'react';
import { Info, Sparkles, ExternalLink } from 'lucide-react';
import { RTM_PARAMETER_TOOLTIPS, type RTMParamTooltip } from '../data/rtmMetadata';

interface RTMParamTooltipProps {
  paramKey: string;
  onFocusSensitivity?: (paramKey: string) => void;
  isSensitivityActive?: boolean;
}

export const RTMParamTooltipButton: React.FC<RTMParamTooltipProps> = ({
  paramKey,
  onFocusSensitivity,
  isSensitivityActive
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipData: RTMParamTooltip | undefined = RTM_PARAMETER_TOOLTIPS[paramKey];

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (!tooltipData) return null;

  return (
    <div ref={containerRef} className="relative inline-block leading-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="p-1 rounded-md text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
        title={`View physical mechanism for ${tooltipData.name}`}
        aria-label={`Physical info for ${tooltipData.name}`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 left-0 sm:left-auto sm:right-0 mt-1 w-72 sm:w-80 p-3.5 bg-stone-900 text-stone-100 rounded-xl shadow-2xl border border-stone-700 text-xs animate-in fade-in zoom-in-95 duration-150"
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-800">
            <div>
              <div className="flex items-center space-x-1.5 font-bold text-white text-xs">
                <span>{tooltipData.name}</span>
              </div>
              <div className="flex items-center space-x-2 mt-0.5 text-[11px] font-mono text-emerald-400">
                <span>Symbol: {tooltipData.symbol}</span>
                <span>•</span>
                <span>Unit: {tooltipData.unit}</span>
              </div>
            </div>
            <span className="text-[10px] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded font-mono shrink-0">
              {tooltipData.typicalRange}
            </span>
          </div>

          {/* Physical Mechanism Body */}
          <div className="py-2.5 space-y-2 text-[11px] text-stone-300 leading-relaxed">
            <p>
              <strong className="text-stone-100 font-semibold">Physical Mechanism: </strong>
              {tooltipData.physicalMechanism}
            </p>

            <div className="p-2 bg-stone-800/80 rounded-lg space-y-1">
              <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                Affected Wavelengths:
              </div>
              <div className="text-stone-200 text-[11px] font-mono">
                {tooltipData.affectedWavelengths}
              </div>
            </div>

            <p className="text-[11px] text-stone-400">
              <strong className="text-stone-200 font-semibold">Directional Effect: </strong>
              {tooltipData.directionEffect}
            </p>
          </div>

          {/* Satellite Implications & Quick Sensitivity Action */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[10px]">
            <span className="text-stone-400 truncate max-w-[170px]" title={tooltipData.remoteSensingBands}>
              {tooltipData.remoteSensingBands}
            </span>

            {onFocusSensitivity && (
              <button
                type="button"
                onClick={() => {
                  onFocusSensitivity(paramKey);
                  setIsOpen(false);
                }}
                className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer shrink-0 ml-2"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Analyze Bands</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
