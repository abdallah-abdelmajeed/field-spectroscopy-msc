import React from 'react';
import {
  Activity,
  HelpCircle,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  SENSITIVITY_PROFILES,
  type ParameterSensitivityProfile,
  type SensitiveRegion
} from '../data/rtmMetadata';

interface RTMSensitivityPanelProps {
  activeParamKey: string;
  onSelectParam: (paramKey: string) => void;
  onCloseSensitivity: () => void;
}

export const RTMSensitivityPanel: React.FC<RTMSensitivityPanelProps> = ({
  activeParamKey,
  onSelectParam,
  onCloseSensitivity
}) => {
  const profile: ParameterSensitivityProfile =
    SENSITIVITY_PROFILES[activeParamKey] || SENSITIVITY_PROFILES['leafChlorophyll'];

  const availableParams = [
    { key: 'leafChlorophyll', label: 'Chlorophyll (Cab)', badge: '650–750 nm' },
    { key: 'canopyCover', label: 'Canopy Cover / LAI', badge: '750–1100 nm' },
    { key: 'leafWaterContent', label: 'Leaf Water (Cw)', badge: '1450, 1940 nm' },
    { key: 'dryMatterContent', label: 'Dry Matter (Cm)', badge: '1680, 2100 nm' },
    { key: 'carotenoids', label: 'Carotenoids (Cxc)', badge: '420–510 nm' },
    { key: 'leafStructureN', label: 'Structure (N)', badge: '750–1300 nm' },
    { key: 'soilBrightness', label: 'Soil Background', badge: 'Broadband' }
  ];

  return (
    <div
      id="rtm-sensitivity-panel"
      className="p-4 sm:p-5 bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-900 text-stone-100 rounded-2xl border border-emerald-800/60 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-emerald-800/40">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Sensitivity Analysis Mode Active
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-900/60 text-emerald-200 border border-emerald-700">
                Wavelength Highlight Enabled
              </span>
            </div>
            <h3 className="text-sm font-bold text-white leading-tight">
              Investigating: {profile.paramName} ({profile.symbol})
            </h3>
          </div>
        </div>

        <button
          onClick={onCloseSensitivity}
          className="self-start sm:self-auto px-2.5 py-1 text-xs font-semibold text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-800 rounded-lg border border-stone-700 transition-colors cursor-pointer"
        >
          Exit Sensitivity Mode
        </button>
      </div>

      {/* Parameter Selector Pills */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Sliders className="w-3 h-3 text-emerald-400" />
          <span>Select Model Parameter to Inspect Wavelength Sensitivity:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {availableParams.map((p) => (
            <button
              key={p.key}
              onClick={() => onSelectParam(p.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeParamKey === p.key
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-1 ring-emerald-400/40'
                  : 'bg-stone-800/90 text-stone-300 border-stone-700 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <span>{p.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono text-emerald-200">
                {p.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Diagnostic Region Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {profile.regions.map((region, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-stone-800/70 border border-stone-700/80 space-y-1 relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 bottom-0 w-1.5"
              style={{ backgroundColor: region.color }}
            />
            <div className="pl-2 flex items-center justify-between">
              <span className="text-xs font-bold text-white">{region.label}</span>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
                style={{ backgroundColor: `${region.color}25`, color: region.color }}
              >
                {region.startWl}–{region.endWl} nm
              </span>
            </div>
            <p className="pl-2 text-[11px] text-stone-300 leading-relaxed">
              {region.description}
            </p>
          </div>
        ))}
      </div>

      {/* Pedagogical Insight & Satellite Implications Footer */}
      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
            Primary Diagnostic Feature
          </span>
          <p className="text-stone-200 font-semibold text-[11px]">
            {profile.primaryFeature}
          </p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
            Satellite Band Linkages
          </span>
          <p className="text-stone-300 text-[11px] font-mono">
            {profile.satelliteImplications}
          </p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
            Physics Takeaway
          </span>
          <p className="text-emerald-200 text-[11px] leading-relaxed">
            {profile.pedagogicalTakeaway}
          </p>
        </div>
      </div>
    </div>
  );
};
