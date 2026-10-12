import React, { useState, useMemo } from 'react';
import {
  Activity,
  Layers,
  Info,
  Sliders,
  ZoomIn,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw,
  TreeDeciduous,
  Leaf,
  Sun,
  Droplets,
  ChevronDown,
  CheckCircle2,
  Layers as LayersIcon,
  Compass
} from 'lucide-react';
import { REFERENCE_SPECTRA, type ReferenceSpectrum } from '../data/courseData';
import {
  simulateRTM,
  DEFAULT_RTM_PARAMS,
  RTM_PRESETS,
  type RTMParameters,
  type RTMSimulationResult
} from '../utils/rtmPhysics';
import { RTMParamTooltipButton } from './RTMParamTooltip';
import { RTMSensitivityPanel } from './RTMSensitivityPanel';
import { RTMCompareOverlayPanel } from './RTMCompareOverlayPanel';
import {
  RTMShiftAnimationSVGOverlay,
  RTMShiftAnimationHUD
} from './RTMShiftAnimationOverlay';
import {
  REFERENCE_COMPARISON_DATASETS,
  SENSITIVITY_PROFILES,
  computeSpectralComparison,
  interpolateReflectance,
  type ReferenceDatasetItem,
  type SpectralComparisonResult
} from '../data/rtmMetadata';
import { generateSmoothReferencePath } from '../utils/spline';
import { RTMScenariosTab } from './RTMScenariosTab';

const RTM_PARAM_LABELS: Record<keyof RTMParameters, string> = {
  canopyCover: 'Canopy Cover & LAI',
  canopyArchitecture: 'Leaf Angle Distribution',
  soilType: 'Underlying Soil Substrate',
  soilBrightness: 'Soil Background Brightness',
  solarZenithAngle: 'Solar Zenith Angle (θs)',
  leafChlorophyll: 'Chlorophyll a+b (Cab)',
  carotenoids: 'Carotenoids (Cxc)',
  leafWaterContent: 'Equivalent Water Thickness (Cw)',
  dryMatterContent: 'Dry Matter Content (Cm)',
  leafStructureN: 'Mesophyll Structure (N)'
};

export const SpectraExplorer: React.FC = () => {
  // Main Navigation: Library Browser vs. RTM Simulation Tool vs. RTM Scenarios
  const [explorerMode, setExplorerMode] = useState<'library' | 'rtm' | 'scenarios'>('library');

  // Library mode state
  const [selectedSpectrumIds, setSelectedSpectrumIds] = useState<string[]>([
    'healthy_green_leaf',
    'kaolinite_mineral',
    'agricultural_loam_soil'
  ]);
  const [activeRange, setActiveRange] = useState<'full' | 'vnir' | 'swir'>('full');
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; wl: number } | null>(null);
  const [inspectedSpectrumId, setInspectedSpectrumId] = useState<string>('healthy_green_leaf');

  // RTM Simulation mode state
  const [rtmParams, setRtmParams] = useState<RTMParameters>(DEFAULT_RTM_PARAMS);
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('healthy_crop');
  const [showCanopyCurve, setShowCanopyCurve] = useState(true);
  const [showLeafCurve, setShowLeafCurve] = useState(true);
  const [showSoilCurve, setShowSoilCurve] = useState(true);
  const [showRefHealthyLeaf, setShowRefHealthyLeaf] = useState(false);

  // Compare Feature State
  const [isCompareActive, setIsCompareActive] = useState<boolean>(false);
  const [selectedReferenceId, setSelectedReferenceId] = useState<string>('usgs_deciduous_leaf');
  const [showCompareResiduals, setShowCompareResiduals] = useState<boolean>(false);

  // Sensitivity Analysis Mode State
  const [isSensitivityMode, setIsSensitivityMode] = useState<boolean>(false);
  const [activeSensitivityParam, setActiveSensitivityParam] = useState<string>('leafChlorophyll');

  // Real-Time Curve Shift Animation State
  const [enableShiftAnimation, setEnableShiftAnimation] = useState<boolean>(true);
  const [baseCanopyCurve, setBaseCanopyCurve] = useState<number[] | null>(null);
  const [activeShiftParamKey, setActiveShiftParamKey] = useState<keyof RTMParameters | null>(null);
  const [resetFeedbackMessage, setResetFeedbackMessage] = useState<string | null>(null);

  // Compute RTM Simulation in real-time
  const rtmResult: RTMSimulationResult = useMemo(() => {
    return simulateRTM(rtmParams);
  }, [rtmParams]);

  // Active Reference dataset for Compare feature
  const activeReferenceDataset: ReferenceDatasetItem = useMemo(() => {
    return (
      REFERENCE_COMPARISON_DATASETS.find((d) => d.id === selectedReferenceId) ||
      REFERENCE_COMPARISON_DATASETS[0]
    );
  }, [selectedReferenceId]);

  // Real-time comparison metrics
  const compareMetrics: SpectralComparisonResult = useMemo(() => {
    return computeSpectralComparison(
      rtmResult.wavelengths,
      rtmResult.canopyReflectance,
      activeReferenceDataset
    );
  }, [rtmResult, activeReferenceDataset]);

  const toggleSpectrum = (id: string) => {
    if (selectedSpectrumIds.includes(id)) {
      if (selectedSpectrumIds.length > 1) {
        setSelectedSpectrumIds(selectedSpectrumIds.filter((item) => item !== id));
      }
    } else {
      setSelectedSpectrumIds([...selectedSpectrumIds, id]);
    }
  };

  const handleSliderStart = (paramKey: keyof RTMParameters) => {
    if (!enableShiftAnimation) return;
    setActiveShiftParamKey(paramKey);
    // Lock baseline curve before dragging begins if not already set
    if (!baseCanopyCurve) {
      setBaseCanopyCurve([...rtmResult.canopyReflectance]);
    }
    if (isSensitivityMode) {
      setActiveSensitivityParam(paramKey);
    }
  };

  const handleUpdateRtmParam = <K extends keyof RTMParameters>(key: K, value: RTMParameters[K]) => {
    // If shift animation is enabled and base isn't captured yet, snapshot current canopy
    if (enableShiftAnimation && !baseCanopyCurve) {
      setBaseCanopyCurve([...rtmResult.canopyReflectance]);
      setActiveShiftParamKey(key);
    }
    setRtmParams((prev) => ({
      ...prev,
      [key]: value
    }));
    setSelectedPresetKey('custom');
    if (isSensitivityMode) {
      setActiveSensitivityParam(key);
    }
  };

  const handleClearShiftBaseline = () => {
    setBaseCanopyCurve(null);
    setActiveShiftParamKey(null);
  };

  const handleApplyShiftAsBaseline = () => {
    setBaseCanopyCurve([...rtmResult.canopyReflectance]);
  };

  const handleApplyPreset = (presetKey: string) => {
    setSelectedPresetKey(presetKey);
    const preset = RTM_PRESETS[presetKey];
    if (preset) {
      setRtmParams({ ...DEFAULT_RTM_PARAMS, ...preset.params });
      setBaseCanopyCurve(null);
      setActiveShiftParamKey(null);
    }
  };

  const handleResetToDefaults = () => {
    setRtmParams(DEFAULT_RTM_PARAMS);
    setSelectedPresetKey('healthy_crop');
    setBaseCanopyCurve(null);
    setActiveShiftParamKey(null);
    setResetFeedbackMessage(
      'Reverted all slider values to Base Vegetation Profile (Healthy Crop: LAI 3.8, Cab 45 μg/cm², Cw 0.018 cm)'
    );
    setTimeout(() => {
      setResetFeedbackMessage(null);
    }, 4500);
  };

  const handleResetRtm = handleResetToDefaults;

  // Spectral range domain
  const minWl = activeRange === 'swir' ? 1000 : 350;
  const maxWl = activeRange === 'vnir' ? 1000 : 2500;

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 360;
  const padding = { top: 30, right: 30, bottom: 45, left: 55 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const getX = (wl: number) => {
    return padding.left + ((wl - minWl) / (maxWl - minWl)) * plotWidth;
  };

  const getY = (refl: number) => {
    const clamped = Math.max(0, Math.min(1.0, refl));
    return padding.top + (1.0 - clamped) * plotHeight;
  };

  const getCurveColor = (cat: ReferenceSpectrum['category'], idx: number) => {
    switch (cat) {
      case 'Vegetation':
        return '#15803d'; // Emerald green
      case 'Mineral':
        return '#b45309'; // Amber/brown
      case 'Soil':
        return '#78350f'; // Dark warm brown
      case 'Manmade':
        return '#475569'; // Slate
      default:
        return ['#2563eb', '#9333ea', '#db2777'][idx % 3];
    }
  };

  // Convert ReferenceSpectrum data points to smooth C1-continuous spline SVG path
  const makePath = (spectrum: ReferenceSpectrum) => {
    return generateSmoothReferencePath(spectrum.dataPoints, minWl, maxWl, getX, getY, 5);
  };

  // Convert ReferenceDatasetItem data points to smooth C1-continuous spline SVG path for Compare
  const makeReferencePath = (dataset: ReferenceDatasetItem) => {
    return generateSmoothReferencePath(dataset.dataPoints, minWl, maxWl, getX, getY, 5);
  };

  // Convert RTM arrays to smooth SVG path
  const makeArrayPath = (wavelengths: number[], values: number[]) => {
    let path = '';
    let first = true;
    for (let i = 0; i < wavelengths.length; i++) {
      const wl = wavelengths[i];
      if (wl >= minWl && wl <= maxWl) {
        const x = getX(wl);
        const y = getY(values[i]);
        if (first) {
          path += `M ${x} ${y}`;
          first = false;
        } else {
          path += ` L ${x} ${y}`;
        }
      }
    }
    return path;
  };

  // Hover point values for RTM
  const rtmHoverValues = useMemo(() => {
    if (!hoverPoint) return null;
    const wl = hoverPoint.wl;
    const idx = rtmResult.wavelengths.findIndex((w) => Math.abs(w - wl) <= 3);
    if (idx === -1) return null;
    const refVal = interpolateReflectance(activeReferenceDataset.dataPoints, wl);
    return {
      wl: rtmResult.wavelengths[idx],
      canopy: rtmResult.canopyReflectance[idx],
      leaf: rtmResult.leafReflectance[idx],
      soil: rtmResult.soilReflectance[idx],
      ref: refVal
    };
  }, [hoverPoint, rtmResult, activeReferenceDataset]);

  // Selected inspected spectrum for library view
  const inspectedSpectrum =
    REFERENCE_SPECTRA.find((s) => s.id === inspectedSpectrumId) || REFERENCE_SPECTRA[0];

  return (
    <div className="space-y-6">
      {/* Explorer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-stone-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
              Interactive Radiometry
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Physical Modelling &amp; Calibrated Spectral Libraries
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            {explorerMode === 'library'
              ? 'Outdoor Spectral Library & Diagnostic Feature Explorer'
              : explorerMode === 'rtm'
              ? 'Interactive Radiative Transfer Model (PROSPECT-D + 4SAIL)'
              : 'RTM Environmental Scenarios: Simulated vs. Observed Field Data'}
          </h2>
        </div>

        {/* Mode Switcher */}
        <div className="flex flex-wrap items-center space-x-1.5 bg-stone-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setExplorerMode('library')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              explorerMode === 'library'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-stone-500" />
            <span>Spectral Library</span>
          </button>
          <button
            onClick={() => setExplorerMode('rtm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              explorerMode === 'rtm'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>RTM Simulation</span>
          </button>
          <button
            id="rtm-scenarios-mode-btn"
            onClick={() => setExplorerMode('scenarios')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              explorerMode === 'scenarios'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>RTM Scenarios</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                explorerMode === 'scenarios'
                  ? 'bg-purple-950 text-purple-200'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              Sim vs Obs
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================
          MODE 1: USGS & CEOS SPECTRAL LIBRARY BROWSER
         ======================================================== */}
      {explorerMode === 'library' && (
        <div className="space-y-6">
          {/* Range Zoom Buttons & Target Toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-500 mr-1 uppercase tracking-wider">
                Toggle Curves:
              </span>
              {REFERENCE_SPECTRA.map((spec, idx) => {
                const isSelected = selectedSpectrumIds.includes(spec.id);
                const color = getCurveColor(spec.category, idx);

                return (
                  <button
                    key={spec.id}
                    onClick={() => {
                      toggleSpectrum(spec.id);
                      setInspectedSpectrumId(spec.id);
                    }}
                    className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white shadow-xs'
                        : 'bg-stone-50 text-stone-400 border-stone-200 hover:bg-stone-100'
                    }`}
                    style={{
                      borderColor: isSelected ? color : undefined,
                      color: isSelected ? '#1c1917' : undefined
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: isSelected ? color : '#a8a29e' }}
                    ></span>
                    <span>{spec.name}</span>
                    {isSelected ? (
                      <Eye className="w-3.5 h-3.5 text-stone-500" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Range Zoom Buttons */}
            <div className="flex items-center space-x-1.5 bg-stone-100 p-1 rounded-lg shrink-0 self-start sm:self-auto">
              <span className="text-[11px] font-semibold text-stone-500 px-2 flex items-center space-x-1">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Range:</span>
              </span>
              <button
                onClick={() => setActiveRange('full')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeRange === 'full' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Full (350–2500 nm)
              </button>
              <button
                onClick={() => setActiveRange('vnir')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeRange === 'vnir' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                VNIR (350–1000 nm)
              </button>
              <button
                onClick={() => setActiveRange('swir')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeRange === 'swir' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                SWIR (1000–2500 nm)
              </button>
            </div>
          </div>

          {/* Interactive Spectral Chart Canvas */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div className="relative overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto select-none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const mouseX = e.clientX - rect.left;
                  const scale = svgWidth / rect.width;
                  const svgX = mouseX * scale;

                  if (svgX >= padding.left && svgX <= svgWidth - padding.right) {
                    const fraction = (svgX - padding.left) / plotWidth;
                    const wl = Math.round(minWl + fraction * (maxWl - minWl));
                    setHoverPoint({ x: svgX, y: e.clientY - rect.top, wl });
                  }
                }}
                onMouseLeave={() => setHoverPoint(null)}
              >
                {/* Grid lines */}
                <g stroke="#f5f5f4" strokeWidth="1">
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((refl) => (
                    <line
                      key={refl}
                      x1={padding.left}
                      y1={getY(refl)}
                      x2={svgWidth - padding.right}
                      y2={getY(refl)}
                    />
                  ))}
                </g>

                {/* Y-Axis Ticks & Labels */}
                {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0].map((refl) => (
                  <g key={refl}>
                    <line
                      x1={padding.left - 5}
                      y1={getY(refl)}
                      x2={padding.left}
                      y2={getY(refl)}
                      stroke="#a8a29e"
                    />
                    <text
                      x={padding.left - 10}
                      y={getY(refl) + 4}
                      fill="#78716c"
                      fontSize="11"
                      textAnchor="end"
                      fontFamily="sans-serif"
                    >
                      {refl.toFixed(1)}
                    </text>
                  </g>
                ))}
                <text
                  x={-padding.top - plotHeight / 2}
                  y={18}
                  fill="#57534e"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  transform="rotate(-90)"
                  fontFamily="sans-serif"
                >
                  Reflectance Factor (0.0 – 1.0)
                </text>

                {/* X-Axis Ticks & Labels */}
                {(() => {
                  const step = activeRange === 'vnir' ? 100 : activeRange === 'swir' ? 200 : 250;
                  const ticks = [];
                  for (let w = Math.ceil(minWl / step) * step; w <= maxWl; w += step) {
                    ticks.push(w);
                  }
                  return ticks.map((w) => (
                    <g key={w}>
                      <line
                        x1={getX(w)}
                        y1={svgHeight - padding.bottom}
                        x2={getX(w)}
                        y2={svgHeight - padding.bottom + 5}
                        stroke="#a8a29e"
                      />
                      <text
                        x={getX(w)}
                        y={svgHeight - padding.bottom + 18}
                        fill="#78716c"
                        fontSize="11"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {w} nm
                      </text>
                    </g>
                  ));
                })()}
                <text
                  x={padding.left + plotWidth / 2}
                  y={svgHeight - 10}
                  fill="#57534e"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  Wavelength (nm)
                </text>

                {/* Plotted Spectral Curves */}
                {REFERENCE_SPECTRA.map((spectrum, idx) => {
                  if (!selectedSpectrumIds.includes(spectrum.id)) return null;
                  const path = makePath(spectrum);
                  const color = getCurveColor(spectrum.category, idx);

                  return (
                    <path
                      key={spectrum.id}
                      d={path}
                      fill="none"
                      stroke={color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                })}

                {/* Interactive Hover Guide Line */}
                {hoverPoint && (
                  <g>
                    <line
                      x1={hoverPoint.x}
                      y1={padding.top}
                      x2={hoverPoint.x}
                      y2={svgHeight - padding.bottom}
                      stroke="#10b981"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <rect
                      x={hoverPoint.x - 35}
                      y={padding.top - 20}
                      width="70"
                      height="20"
                      rx="4"
                      fill="#065f46"
                    />
                    <text
                      x={hoverPoint.x}
                      y={padding.top - 6}
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {hoverPoint.wl} nm
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Diagnostic Feature Annotations */}
            <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-0.5">Vegetation Chlorophyll &amp; Red Edge</span>
                <p className="text-emerald-950 text-[11px]">
                  Strong absorption at 675 nm (Chl-a); sharp red edge slope from 700 to 750 nm reaching the NIR plateau.
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="font-bold text-amber-900 block mb-0.5">Clay Mineral Hydroxyl Doublet</span>
                <p className="text-amber-950 text-[11px]">
                  Diagnostic Kaolinite Al-OH combination doublet at 2162 nm and 2208 nm in the SWIR-2 window.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-0.5">Atmospheric Noise Mask</span>
                <p className="text-slate-600 text-[11px]">
                  1350–1450 nm &amp; 1800–1950 nm shaded regions suffer near-zero solar transmission due to tropospheric water vapor.
                </p>
              </div>
            </div>
          </div>

          {/* Inspected Spectrum Academic Details Panel */}
          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <Info className="w-4 h-4 text-emerald-700" />
                <span>Spectroscopic Material Diagnostics: {inspectedSpectrum.name}</span>
              </div>
              <span className="text-[11px] font-mono text-stone-500">
                Source: {inspectedSpectrum.source}
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {inspectedSpectrum.description}
            </p>
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
              <span className="font-bold text-stone-900">Key Diagnostic Absorption Features: </span>
              <span className="text-stone-700">{inspectedSpectrum.diagnosticFeatures}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 2: INTERACTIVE RADIATIVE TRANSFER MODEL (RTM)
         ======================================================== */}
      {explorerMode === 'rtm' && (
        <div className="space-y-6">
          {/* Presets & Controls Header */}
          <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Presets Dropdown & Reset */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center space-x-1.5 shrink-0">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Presets:</span>
                </span>

                <div className="relative min-w-[240px] sm:min-w-[280px]">
                  <select
                    id="rtm-presets-select"
                    value={selectedPresetKey}
                    onChange={(e) => handleApplyPreset(e.target.value)}
                    className="w-full pl-3 pr-8 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-900 rounded-lg border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 cursor-pointer appearance-none transition-colors"
                  >
                    {selectedPresetKey === 'custom' && (
                      <option value="custom">⚙️ Custom Configuration (Modified)</option>
                    )}
                    <optgroup label="Vegetation Canopies">
                      <option value="deciduous_forest">Deciduous Forest (Dense broadleaf, high LAI)</option>
                      <option value="grassland">Grassland / Savanna (Open erectophile grass)</option>
                      <option value="coniferous_forest">Coniferous Needle Forest (Thick mesophyll N)</option>
                      <option value="healthy_crop">Healthy Agricultural Crop (Wheat)</option>
                      <option value="wetland_paddy">Wetland / Irrigated Paddy (High water)</option>
                    </optgroup>
                    <optgroup label="Vegetation Stress &amp; Senescence">
                      <option value="water_stressed">Drought-Stressed Foliage (Low Cw, high SWIR)</option>
                      <option value="senescent_foliage">Senescent / Autumn Foliage (Chlorophyll degraded)</option>
                    </optgroup>
                    <optgroup label="Soil &amp; Substrates">
                      <option value="dry_soil">Dry Soil (Bare Ground, 5% cover)</option>
                    </optgroup>
                    <optgroup label="Agricultural Growth Stages">
                      <option value="sparse_seedlings">Early-Stage Crop (Sparse Seedlings, 25% cover)</option>
                    </optgroup>
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-2 pointer-events-none" />
                </div>

                <button
                  id="rtm-reset-to-defaults-header-btn"
                  onClick={handleResetToDefaults}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-stone-700 bg-white hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-400 border border-stone-300 transition-all shadow-2xs cursor-pointer"
                  title="Quickly revert all slider values to the base vegetation profile settings (Healthy Crop: LAI 3.8, Cab 45 μg/cm²)"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Reset to Defaults</span>
                </button>
              </div>

              {/* Mode Toggles: Sensitivity Analysis & Compare Overlay */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Sensitivity Analysis Mode Toggle */}
                <button
                  id="rtm-sensitivity-toggle-btn"
                  onClick={() => setIsSensitivityMode(!isSensitivityMode)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isSensitivityMode
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs ring-2 ring-emerald-500/30'
                      : 'bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100 border-emerald-300'
                  }`}
                  title="Toggle wavelength sensitivity highlighting for RTM parameters"
                >
                  <Activity className={`w-3.5 h-3.5 ${isSensitivityMode ? 'animate-pulse' : ''}`} />
                  <span>Sensitivity Analysis</span>
                  {isSensitivityMode && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  )}
                </button>

                {/* Compare Overlay Toggle */}
                <button
                  id="rtm-compare-toggle-btn"
                  onClick={() => setIsCompareActive(!isCompareActive)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isCompareActive
                      ? 'bg-purple-600 text-white border-purple-500 shadow-xs ring-2 ring-purple-500/30'
                      : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border-purple-300'
                  }`}
                  title="Overlay empirical reference spectrum on graph"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Compare Overlay</span>
                </button>

                {/* Scenarios Quick-Link Button */}
                <button
                  id="rtm-open-scenarios-btn"
                  onClick={() => setExplorerMode('scenarios')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-300 transition-all cursor-pointer"
                  title="Explore pre-set environmental scenarios (LAI gradients, Cab shifts, drought) and compare simulated vs. observed data"
                >
                  <Compass className="w-3.5 h-3.5 text-purple-700" />
                  <span>RTM Scenarios</span>
                </button>

                {/* Range Switcher */}
                <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-lg shrink-0">
                  <button
                    onClick={() => setActiveRange('full')}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      activeRange === 'full' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Full
                  </button>
                  <button
                    onClick={() => setActiveRange('vnir')}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      activeRange === 'vnir' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    VNIR
                  </button>
                  <button
                    onClick={() => setActiveRange('swir')}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      activeRange === 'swir' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    SWIR
                  </button>
                </div>
              </div>
            </div>

            {/* Active Preset Information Banner */}
            {selectedPresetKey !== 'custom' && RTM_PRESETS[selectedPresetKey] && (
              <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200/80 flex items-start space-x-2 text-xs text-emerald-950 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-900">
                    Active Profile: {RTM_PRESETS[selectedPresetKey].name}
                  </span>
                  <p className="text-[11px] text-emerald-800 leading-snug">
                    {RTM_PRESETS[selectedPresetKey].description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Real-Time Optical Vegetation Indices Scoreboard */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-1">
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                NDVI (Veg Index)
              </div>
              <div className="text-xl font-extrabold text-stone-900">
                {rtmResult.indices.ndvi.toFixed(3)}
              </div>
              <div className="text-[10px] text-stone-500">
                (R800 - R680) / (R800 + R680)
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-1">
              <div className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">
                EVI (Enhanced)
              </div>
              <div className="text-xl font-extrabold text-stone-900">
                {rtmResult.indices.evi.toFixed(3)}
              </div>
              <div className="text-[10px] text-stone-500">
                Canopy structure / high LAI
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-1">
              <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                NDWI (Water)
              </div>
              <div className="text-xl font-extrabold text-stone-900">
                {rtmResult.indices.ndwi.toFixed(3)}
              </div>
              <div className="text-[10px] text-stone-500">
                (R860 - R1240) / (R860 + R1240)
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-1">
              <div className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                REP (Red Edge)
              </div>
              <div className="text-xl font-extrabold text-stone-900">
                {rtmResult.indices.rep} nm
              </div>
              <div className="text-[10px] text-stone-500">
                Max 1st derivative slope
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-1">
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                SAVI (Soil Adjusted)
              </div>
              <div className="text-xl font-extrabold text-stone-900">
                {rtmResult.indices.savi.toFixed(3)}
              </div>
              <div className="text-[10px] text-stone-500">
                Background brightness tuned
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-1">
              <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                CI_Green (Chl)
              </div>
              <div className="text-xl font-extrabold text-stone-900">
                {rtmResult.indices.ciGreen.toFixed(2)}
              </div>
              <div className="text-[10px] text-stone-500">
                (R780 / R550) - 1.0
              </div>
            </div>
          </div>

          {/* Interactive RTM SVG Spectral Canvas */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
            {/* Curve Visibility Toggles */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-100 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mr-1">
                  Active Layers:
                </span>

                <button
                  onClick={() => setShowCanopyCurve(!showCanopyCurve)}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    showCanopyCurve
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs'
                      : 'bg-stone-50 text-stone-400 border-stone-200'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>4SAIL Top-of-Canopy</span>
                </button>

                <button
                  onClick={() => setShowLeafCurve(!showLeafCurve)}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    showLeafCurve
                      ? 'bg-lime-50 text-lime-900 border-lime-300 shadow-xs'
                      : 'bg-stone-50 text-stone-400 border-stone-200'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-lime-600" />
                  <span>PROSPECT Leaf</span>
                </button>

                <button
                  onClick={() => setShowSoilCurve(!showSoilCurve)}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    showSoilCurve
                      ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                      : 'bg-stone-50 text-stone-400 border-stone-200'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-800" />
                  <span>Soil Baseline</span>
                </button>

                {isCompareActive && (
                  <button
                    onClick={() => setIsCompareActive(false)}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border border-purple-300 bg-purple-50 text-purple-900 shadow-xs cursor-pointer"
                    title="Click to hide comparison reference curve"
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeReferenceDataset.color }} />
                    <span>Overlay: {activeReferenceDataset.name.split('(')[0].trim()}</span>
                  </button>
                )}

                <button
                  onClick={() => setShowRefHealthyLeaf(!showRefHealthyLeaf)}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    showRefHealthyLeaf
                      ? 'bg-stone-100 text-stone-900 border-stone-400 shadow-xs'
                      : 'bg-stone-50 text-stone-400 border-stone-200'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                  <span>USGS Ref Leaf</span>
                </button>

                {/* Real-time Curve Shift Animation Toggle */}
                <button
                  id="rtm-shift-anim-toggle-btn"
                  onClick={() => setEnableShiftAnimation(!enableShiftAnimation)}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    enableShiftAnimation
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                      : 'bg-stone-50 text-stone-400 border-stone-200 hover:bg-stone-100'
                  }`}
                  title="Toggle real-time reflectance curve shift animation and ghost baseline trail while sliding"
                >
                  <Activity
                    className={`w-3.5 h-3.5 ${
                      enableShiftAnimation ? 'text-emerald-600 animate-pulse' : 'text-stone-400'
                    }`}
                  />
                  <span>Live Shift Animation</span>
                  {baseCanopyCurve && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  )}
                </button>
              </div>

              {rtmHoverValues && (
                <div className="text-xs font-mono bg-stone-100 px-2.5 py-1 rounded-md text-stone-700 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>
                    λ: <strong className="text-emerald-800">{rtmHoverValues.wl} nm</strong>
                  </span>
                  <span>
                    Canopy: <strong>{(rtmHoverValues.canopy * 100).toFixed(1)}%</strong>
                  </span>
                  <span>
                    Leaf: <strong>{(rtmHoverValues.leaf * 100).toFixed(1)}%</strong>
                  </span>
                  {isCompareActive && (
                    <>
                      <span>
                        Ref: <strong className="text-purple-800">{(rtmHoverValues.ref * 100).toFixed(1)}%</strong>
                      </span>
                      <span>
                        Δ: <strong className={Math.abs(rtmHoverValues.canopy - rtmHoverValues.ref) > 0.05 ? "text-rose-600" : "text-emerald-700"}>
                          {((rtmHoverValues.canopy - rtmHoverValues.ref) * 100 > 0 ? '+' : '')}
                          {((rtmHoverValues.canopy - rtmHoverValues.ref) * 100).toFixed(1)}%
                        </strong>
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* REAL-TIME MODEL RESPONSE HUD BANNER */}
            {enableShiftAnimation && baseCanopyCurve && (
              <RTMShiftAnimationHUD
                wavelengths={rtmResult.wavelengths}
                currCanopyCurve={rtmResult.canopyReflectance}
                baseCanopyCurve={baseCanopyCurve}
                minWl={minWl}
                maxWl={maxWl}
                getX={getX}
                getY={getY}
                paramName={activeShiftParamKey ? RTM_PARAM_LABELS[activeShiftParamKey] : undefined}
                onClearBaseline={handleClearShiftBaseline}
                onApplyBaselineAsCurrent={handleApplyShiftAsBaseline}
              />
            )}

            {/* SVG Plot */}
            <div className="relative overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto select-none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const mouseX = e.clientX - rect.left;
                  const scale = svgWidth / rect.width;
                  const svgX = mouseX * scale;

                  if (svgX >= padding.left && svgX <= svgWidth - padding.right) {
                    const fraction = (svgX - padding.left) / plotWidth;
                    const wl = Math.round(minWl + fraction * (maxWl - minWl));
                    setHoverPoint({ x: svgX, y: e.clientY - rect.top, wl });
                  }
                }}
                onMouseLeave={() => setHoverPoint(null)}
              >
                {/* Grid lines */}
                <g stroke="#f5f5f4" strokeWidth="1">
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((refl) => (
                    <line
                      key={refl}
                      x1={padding.left}
                      y1={getY(refl)}
                      x2={svgWidth - padding.right}
                      y2={getY(refl)}
                    />
                  ))}
                </g>

                {/* Atmospheric Absorption Mask Shading */}
                {/* 1350 - 1450 nm */}
                {maxWl >= 1350 && minWl <= 1450 && (
                  <rect
                    x={Math.max(padding.left, getX(Math.max(1350, minWl)))}
                    y={padding.top}
                    width={Math.max(0, getX(Math.min(1450, maxWl)) - getX(Math.max(1350, minWl)))}
                    height={plotHeight}
                    fill="#f1f5f9"
                    opacity="0.8"
                  />
                )}
                {/* 1800 - 1950 nm */}
                {maxWl >= 1800 && minWl <= 1950 && (
                  <rect
                    x={Math.max(padding.left, getX(Math.max(1800, minWl)))}
                    y={padding.top}
                    width={Math.max(0, getX(Math.min(1950, maxWl)) - getX(Math.max(1800, minWl)))}
                    height={plotHeight}
                    fill="#f1f5f9"
                    opacity="0.8"
                  />
                )}

                {/* SENSITIVITY ANALYSIS: Wavelength Zone Highlighting */}
                {isSensitivityMode &&
                  SENSITIVITY_PROFILES[activeSensitivityParam]?.regions.map((region, idx) => {
                    const regMinWl = Math.max(minWl, region.startWl);
                    const regMaxWl = Math.min(maxWl, region.endWl);
                    if (regMinWl >= regMaxWl) return null;
                    const x1 = getX(regMinWl);
                    const x2 = getX(regMaxWl);
                    const bandWidth = Math.max(2, x2 - x1);

                    return (
                      <g key={idx}>
                        {/* Shaded sensitivity zone */}
                        <rect
                          x={x1}
                          y={padding.top}
                          width={bandWidth}
                          height={plotHeight}
                          fill={region.color}
                          fillOpacity="0.14"
                          stroke={region.color}
                          strokeWidth="1.5"
                          strokeDasharray="4 2"
                        />
                        {/* Wavelength zone badge label */}
                        {bandWidth > 30 && (
                          <g>
                            <rect
                              x={x1 + 3}
                              y={padding.top + 6 + (idx % 2) * 20}
                              width={Math.min(bandWidth - 6, 175)}
                              height="17"
                              rx="3"
                              fill={region.color}
                              fillOpacity="0.9"
                            />
                            <text
                              x={x1 + 7}
                              y={padding.top + 18 + (idx % 2) * 20}
                              fill="#ffffff"
                              fontSize="9.5"
                              fontWeight="bold"
                              fontFamily="sans-serif"
                            >
                              {region.label.length > 23 ? region.label.slice(0, 21) + '...' : region.label}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                {/* SENSITIVITY ANALYSIS: Dynamic Red Edge Position (REP) Marker */}
                {isSensitivityMode &&
                  activeSensitivityParam === 'leafChlorophyll' &&
                  rtmResult.indices.rep >= minWl &&
                  rtmResult.indices.rep <= maxWl && (
                    <g>
                      <line
                        x1={getX(rtmResult.indices.rep)}
                        y1={padding.top}
                        x2={getX(rtmResult.indices.rep)}
                        y2={svgHeight - padding.bottom}
                        stroke="#dc2626"
                        strokeWidth="2.2"
                        strokeDasharray="5 3"
                      />
                      <rect
                        x={getX(rtmResult.indices.rep) - 62}
                        y={svgHeight - padding.bottom - 24}
                        width="124"
                        height="18"
                        rx="4"
                        fill="#dc2626"
                      />
                      <text
                        x={getX(rtmResult.indices.rep)}
                        y={svgHeight - padding.bottom - 11}
                        fill="#ffffff"
                        fontSize="9.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        REP: {rtmResult.indices.rep} nm (Red Edge)
                      </text>
                    </g>
                  )}

                {/* Y-Axis Ticks & Labels */}
                {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0].map((refl) => (
                  <g key={refl}>
                    <line
                      x1={padding.left - 5}
                      y1={getY(refl)}
                      x2={padding.left}
                      y2={getY(refl)}
                      stroke="#a8a29e"
                    />
                    <text
                      x={padding.left - 10}
                      y={getY(refl) + 4}
                      fill="#78716c"
                      fontSize="11"
                      textAnchor="end"
                      fontFamily="sans-serif"
                    >
                      {refl.toFixed(1)}
                    </text>
                  </g>
                ))}
                <text
                  x={-padding.top - plotHeight / 2}
                  y={18}
                  fill="#57534e"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  transform="rotate(-90)"
                  fontFamily="sans-serif"
                >
                  Directional Reflectance Factor
                </text>

                {/* X-Axis Ticks & Labels */}
                {(() => {
                  const step = activeRange === 'vnir' ? 100 : activeRange === 'swir' ? 200 : 250;
                  const ticks = [];
                  for (let w = Math.ceil(minWl / step) * step; w <= maxWl; w += step) {
                    ticks.push(w);
                  }
                  return ticks.map((w) => (
                    <g key={w}>
                      <line
                        x1={getX(w)}
                        y1={svgHeight - padding.bottom}
                        x2={getX(w)}
                        y2={svgHeight - padding.bottom + 5}
                        stroke="#a8a29e"
                      />
                      <text
                        x={getX(w)}
                        y={svgHeight - padding.bottom + 18}
                        fill="#78716c"
                        fontSize="11"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {w} nm
                      </text>
                    </g>
                  ));
                })()}
                <text
                  x={padding.left + plotWidth / 2}
                  y={svgHeight - 10}
                  fill="#57534e"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  Wavelength (nm)
                </text>

                {/* Soil Background Curve */}
                {showSoilCurve && (
                  <path
                    d={makeArrayPath(rtmResult.wavelengths, rtmResult.soilReflectance)}
                    fill="none"
                    stroke="#92400e"
                    strokeWidth="1.8"
                    strokeDasharray="4 2"
                    opacity="0.65"
                  />
                )}

                {/* USGS Measured Reference Leaf */}
                {showRefHealthyLeaf && (
                  <path
                    d={makePath(
                      REFERENCE_SPECTRA.find((s) => s.id === 'healthy_green_leaf') ||
                        REFERENCE_SPECTRA[0]
                    )}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.8"
                  />
                )}

                {/* COMPARE FEATURE: Reference Dataset Overlay Curve */}
                {isCompareActive && (
                  <g>
                    <path
                      d={makeReferencePath(activeReferenceDataset)}
                      fill="none"
                      stroke={activeReferenceDataset.color}
                      strokeWidth="2.8"
                      strokeDasharray="6 3"
                      strokeLinecap="round"
                    />
                    {/* Highlight Residual Delta if enabled */}
                    {showCompareResiduals && (
                      <g opacity="0.65">
                        {rtmResult.wavelengths
                          .filter((w, i) => i % 5 === 0 && w >= minWl && w <= maxWl)
                          .map((w, idx) => {
                            const simY = rtmResult.canopyReflectance[rtmResult.wavelengths.indexOf(w)];
                            const refY = interpolateReflectance(activeReferenceDataset.dataPoints, w);
                            const delta = Math.abs(simY - refY);
                            if (delta < 0.05) return null;
                            return (
                              <line
                                key={idx}
                                x1={getX(w)}
                                y1={getY(simY)}
                                x2={getX(w)}
                                y2={getY(refY)}
                                stroke="#dc2626"
                                strokeWidth="1.4"
                                strokeDasharray="2 2"
                              />
                            );
                          })}
                      </g>
                    )}
                  </g>
                )}

                {/* PROSPECT-D Single Leaf Reflectance */}
                {showLeafCurve && (
                  <path
                    d={makeArrayPath(rtmResult.wavelengths, rtmResult.leafReflectance)}
                    fill="none"
                    stroke="#84cc16"
                    strokeWidth="2.2"
                    strokeDasharray="5 3"
                  />
                )}

                {/* REAL-TIME CURVE SHIFT ANIMATION OVERLAY */}
                {enableShiftAnimation && baseCanopyCurve && (
                  <RTMShiftAnimationSVGOverlay
                    wavelengths={rtmResult.wavelengths}
                    currCanopyCurve={rtmResult.canopyReflectance}
                    baseCanopyCurve={baseCanopyCurve}
                    minWl={minWl}
                    maxWl={maxWl}
                    getX={getX}
                    getY={getY}
                    paramName={activeShiftParamKey ? RTM_PARAM_LABELS[activeShiftParamKey] : undefined}
                  />
                )}

                {/* 4SAIL Top-of-Canopy Reflectance (Primary Curve) */}
                {showCanopyCurve && (
                  <path
                    d={makeArrayPath(rtmResult.wavelengths, rtmResult.canopyReflectance)}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Interactive Hover Guide Line */}
                {hoverPoint && (
                  <g>
                    <line
                      x1={hoverPoint.x}
                      y1={padding.top}
                      x2={hoverPoint.x}
                      y2={svgHeight - padding.bottom}
                      stroke="#059669"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <rect
                      x={hoverPoint.x - 45}
                      y={padding.top - 20}
                      width="90"
                      height="20"
                      rx="4"
                      fill="#064e3b"
                    />
                    <text
                      x={hoverPoint.x}
                      y={padding.top - 6}
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {hoverPoint.wl} nm
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* SENSITIVITY ANALYSIS INTERACTIVE CONTROL PANEL */}
          {isSensitivityMode && (
            <RTMSensitivityPanel
              activeParamKey={activeSensitivityParam}
              onSelectParam={setActiveSensitivityParam}
              onCloseSensitivity={() => setIsSensitivityMode(false)}
            />
          )}

          {/* EMPIRICAL COMPARE OVERLAY CONTROL PANEL */}
          {isCompareActive && (
            <RTMCompareOverlayPanel
              selectedReferenceId={selectedReferenceId}
              onSelectReference={setSelectedReferenceId}
              isCompareActive={isCompareActive}
              onToggleCompare={setIsCompareActive}
              metrics={compareMetrics}
              showResiduals={showCompareResiduals}
              onToggleResiduals={setShowCompareResiduals}
            />
          )}

          {/* RESET NOTIFICATION FEEDBACK TOAST */}
          {resetFeedbackMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{resetFeedbackMessage}</span>
              </div>
              <button
                onClick={() => setResetFeedbackMessage(null)}
                className="text-emerald-700 hover:text-emerald-950 text-xs font-bold px-2 py-0.5 rounded hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* MODEL PARAMETERS ACTION BAR WITH RESET TO DEFAULTS */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-800">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Model Parameter Controls
                  </span>
                  <span className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                    Coupled 4SAIL + PROSPECT-D
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Adjust any variable to observe simulated reflectance curves shift dynamically in real-time.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Shift Animation Toggle */}
              <button
                type="button"
                id="rtm-toggle-shift-animation-btn"
                onClick={() => setEnableShiftAnimation(!enableShiftAnimation)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  enableShiftAnimation
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                    : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
                }`}
                title="Toggle real-time reflectance curve shift animation and ghost baseline trail while sliding"
              >
                <Activity
                  className={`w-3.5 h-3.5 ${
                    enableShiftAnimation ? 'text-emerald-600 animate-pulse' : 'text-stone-400'
                  }`}
                />
                <span>Live Curve Shift Animation</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    enableShiftAnimation ? 'bg-emerald-600' : 'bg-stone-400'
                  }`}
                />
              </button>

              {/* Reset to Defaults Button */}
              <button
                type="button"
                id="rtm-reset-defaults-bar-btn"
                onClick={handleResetToDefaults}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-stone-700 hover:text-emerald-900 hover:bg-emerald-50 border border-stone-300 hover:border-emerald-400 shadow-2xs transition-all cursor-pointer"
                title="Quickly revert all slider values to the base vegetation profile settings (Healthy Crop: LAI 3.8, Cab 45 μg/cm²)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Reset to Defaults</span>
              </button>
            </div>
          </div>

          {/* Parameter Sliders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: Canopy Architecture & Geometry (4SAIL) */}
            <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center space-x-2">
                  <TreeDeciduous className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-bold text-stone-900">
                    Canopy Architecture &amp; Solar Geometry (4SAIL)
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Structural Scale
                  </span>
                  <button
                    onClick={handleResetToDefaults}
                    className="text-[11px] text-stone-500 hover:text-emerald-700 underline cursor-pointer"
                    title="Revert all parameters to base vegetation profile"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Canopy Cover & LAI */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-medium">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-stone-800 font-semibold">
                        Canopy Cover &amp; LAI:
                      </span>
                      <RTMParamTooltipButton
                        paramKey="canopyCover"
                        onFocusSensitivity={(k) => {
                          setIsSensitivityMode(true);
                          setActiveSensitivityParam(k);
                        }}
                        isSensitivityActive={isSensitivityMode}
                      />
                    </div>
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-stone-500 text-[11px]">
                        LAI: {(-2.0 * Math.log(1 - Math.min(0.995, rtmParams.canopyCover))).toFixed(1)} m²/m²
                      </span>
                      <span className="text-emerald-800 font-bold">
                        {(rtmParams.canopyCover * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="1.0"
                    step="0.01"
                    value={rtmParams.canopyCover}
                    onPointerDown={() => handleSliderStart('canopyCover')}
                    onTouchStart={() => handleSliderStart('canopyCover')}
                    onFocus={() => handleSliderStart('canopyCover')}
                    onChange={(e) => {
                      handleSliderStart('canopyCover');
                      handleUpdateRtmParam('canopyCover', parseFloat(e.target.value));
                    }}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>5% (Sparse Ground, LAI 0.1)</span>
                    <span>50% (Open Scrub, LAI 1.4)</span>
                    <span>100% (Continuous Closed Canopy, LAI &gt; 6)</span>
                  </div>
                </div>

                {/* Leaf Angle Distribution / Architecture */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-medium">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-stone-800 font-semibold">
                        Canopy Leaf Angle Distribution:
                      </span>
                      <RTMParamTooltipButton
                        paramKey="canopyArchitecture"
                        onFocusSensitivity={(k) => {
                          setIsSensitivityMode(true);
                          setActiveSensitivityParam(k);
                        }}
                        isSensitivityActive={isSensitivityMode}
                      />
                    </div>
                    <span className="font-mono text-emerald-800 font-bold capitalize">
                      {rtmParams.canopyArchitecture}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['planophile', 'spherical', 'erectophile'] as const).map((arch) => (
                      <button
                        key={arch}
                        onClick={() => {
                          handleSliderStart('canopyArchitecture');
                          handleUpdateRtmParam('canopyArchitecture', arch);
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border cursor-pointer transition-colors ${
                          rtmParams.canopyArchitecture === arch
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-400 shadow-xs'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {arch}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soil Substrate Type */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-medium">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-stone-800 font-semibold">
                        Underlying Soil Substrate:
                      </span>
                      <RTMParamTooltipButton
                        paramKey="soilType"
                        onFocusSensitivity={(k) => {
                          setIsSensitivityMode(true);
                          setActiveSensitivityParam(k);
                        }}
                        isSensitivityActive={isSensitivityMode}
                      />
                    </div>
                    <span className="font-mono text-amber-800 font-bold capitalize">
                      {rtmParams.soilType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(['loam', 'dry_soil', 'clay', 'dark_organic'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          handleSliderStart('soilType');
                          handleUpdateRtmParam('soilType', type);
                        }}
                        className={`py-1 px-1.5 rounded-lg text-[11px] font-semibold capitalize border cursor-pointer transition-colors ${
                          rtmParams.soilType === type
                            ? 'bg-amber-50 text-amber-900 border-amber-400 shadow-xs'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {type.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soil Brightness Multiplier */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-medium">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-stone-800 font-semibold">
                        Soil Background Brightness:
                      </span>
                      <RTMParamTooltipButton
                        paramKey="soilBrightness"
                        onFocusSensitivity={(k) => {
                          setIsSensitivityMode(true);
                          setActiveSensitivityParam(k);
                        }}
                        isSensitivityActive={isSensitivityMode}
                      />
                    </div>
                    <span className="font-mono text-emerald-800 font-bold">
                      {rtmParams.soilBrightness.toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={rtmParams.soilBrightness}
                    onPointerDown={() => handleSliderStart('soilBrightness')}
                    onTouchStart={() => handleSliderStart('soilBrightness')}
                    onFocus={() => handleSliderStart('soilBrightness')}
                    onChange={(e) => {
                      handleSliderStart('soilBrightness');
                      handleUpdateRtmParam('soilBrightness', parseFloat(e.target.value));
                    }}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>0.5x (Moist Organic)</span>
                    <span>1.0x (Standard)</span>
                    <span>1.5x (Bright Arid Sand)</span>
                  </div>
                </div>

                {/* Solar Zenith Angle */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-medium">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-stone-800 font-semibold">
                        Solar Zenith Angle (θs):
                      </span>
                      <RTMParamTooltipButton
                        paramKey="solarZenithAngle"
                        onFocusSensitivity={(k) => {
                          setIsSensitivityMode(true);
                          setActiveSensitivityParam(k);
                        }}
                        isSensitivityActive={isSensitivityMode}
                      />
                    </div>
                    <span className="font-mono text-emerald-800 font-bold">
                      {rtmParams.solarZenithAngle}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="65"
                    step="1"
                    value={rtmParams.solarZenithAngle}
                    onPointerDown={() => handleSliderStart('solarZenithAngle')}
                    onTouchStart={() => handleSliderStart('solarZenithAngle')}
                    onFocus={() => handleSliderStart('solarZenithAngle')}
                    onChange={(e) => {
                      handleSliderStart('solarZenithAngle');
                      handleUpdateRtmParam('solarZenithAngle', parseFloat(e.target.value));
                    }}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>15° (Sub-Solar Noon)</span>
                    <span>30° (Standard Optimal)</span>
                    <span>65° (Low Sun Angle)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Leaf Biochemistry & Structure (PROSPECT-D) */}
            <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center space-x-2">
                  <Leaf className="w-4 h-4 text-lime-700" />
                  <h3 className="text-sm font-bold text-stone-900">
                    Leaf Biochemistry &amp; Optical Properties (PROSPECT-D)
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-medium text-lime-800 bg-lime-50 px-2 py-0.5 rounded">
                    Foliar Scale
                  </span>
                  <button
                    onClick={handleResetToDefaults}
                    className="text-[11px] text-stone-500 hover:text-emerald-700 underline cursor-pointer"
                    title="Revert all parameters to base vegetation profile"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Chlorophyll Content */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-medium">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-stone-800 font-semibold">
                        Leaf Chlorophyll a+b (C_ab):
                      </span>
                      <RTMParamTooltipButton
                        paramKey="leafChlorophyll"
                        onFocusSensitivity={(k) => {
                          setIsSensitivityMode(true);
                          setActiveSensitivityParam(k);
                        }}
                        isSensitivityActive={isSensitivityMode}
                      />
                    </div>
                    <span className="font-mono text-lime-800 font-bold">
                      {rtmParams.leafChlorophyll.toFixed(1)} μg/cm²
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="90"
                    step="1"
                    value={rtmParams.leafChlorophyll}
                    onPointerDown={() => handleSliderStart('leafChlorophyll')}
                    onTouchStart={() => handleSliderStart('leafChlorophyll')}
                    onFocus={() => handleSliderStart('leafChlorophyll')}
                    onChange={(e) => {
                      handleSliderStart('leafChlorophyll');
                      handleUpdateRtmParam('leafChlorophyll', parseFloat(e.target.value));
                    }}
                    className="w-full accent-lime-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>5 (Senescent / Chlorotic)</span>
                    <span>45 (Healthy Crop)</span>
                    <span>90 (Dense Dark Foliage)</span>
                  </div>
                </div>

                {/* Carotenoids Content */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-medium">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-stone-800 font-semibold">
                        Carotenoids (C_xc):
                      </span>
                      <RTMParamTooltipButton
                        paramKey="carotenoids"
                        onFocusSensitivity={(k) => {
                          setIsSensitivityMode(true);
                          setActiveSensitivityParam(k);
                        }}
                        isSensitivityActive={isSensitivityMode}
                      />
                    </div>
                    <span className="font-mono text-lime-800 font-bold">
                      {rtmParams.carotenoids.toFixed(1)} μg/cm²
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="25"
                    step="0.5"
                    value={rtmParams.carotenoids}
                    onPointerDown={() => handleSliderStart('carotenoids')}
                    onTouchStart={() => handleSliderStart('carotenoids')}
                    onFocus={() => handleSliderStart('carotenoids')}
                    onChange={(e) => {
                      handleSliderStart('carotenoids');
                      handleUpdateRtmParam('carotenoids', parseFloat(e.target.value));
                    }}
                    className="w-full accent-lime-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>2 (Low)</span>
                    <span>8 (Typical)</span>
                    <span>25 (Senescent / Stress)</span>
                  </div>
                </div>

                {/* Equivalent Water Thickness */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-medium">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-stone-800 font-semibold">
                        Equivalent Water Thickness (C_w):
                      </span>
                      <RTMParamTooltipButton
                        paramKey="leafWaterContent"
                        onFocusSensitivity={(k) => {
                          setIsSensitivityMode(true);
                          setActiveSensitivityParam(k);
                        }}
                        isSensitivityActive={isSensitivityMode}
                      />
                    </div>
                    <span className="font-mono text-sky-800 font-bold">
                      {rtmParams.leafWaterContent.toFixed(4)} cm ({(rtmParams.leafWaterContent * 10000).toFixed(0)} μm)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.005"
                    max="0.050"
                    step="0.001"
                    value={rtmParams.leafWaterContent}
                    onPointerDown={() => handleSliderStart('leafWaterContent')}
                    onTouchStart={() => handleSliderStart('leafWaterContent')}
                    onFocus={() => handleSliderStart('leafWaterContent')}
                    onChange={(e) => {
                      handleSliderStart('leafWaterContent');
                      handleUpdateRtmParam('leafWaterContent', parseFloat(e.target.value));
                    }}
                    className="w-full accent-sky-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>0.005 cm (Drought Stressed)</span>
                    <span>0.020 cm (Turgid Crop)</span>
                    <span>0.050 cm (Fleshy Succulent)</span>
                  </div>
                </div>

                {/* Dry Matter Content */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-medium">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-stone-800 font-semibold">
                        Dry Matter Content (C_m):
                      </span>
                      <RTMParamTooltipButton
                        paramKey="dryMatterContent"
                        onFocusSensitivity={(k) => {
                          setIsSensitivityMode(true);
                          setActiveSensitivityParam(k);
                        }}
                        isSensitivityActive={isSensitivityMode}
                      />
                    </div>
                    <span className="font-mono text-stone-800 font-bold">
                      {rtmParams.dryMatterContent.toFixed(4)} g/cm²
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.002"
                    max="0.025"
                    step="0.001"
                    value={rtmParams.dryMatterContent}
                    onPointerDown={() => handleSliderStart('dryMatterContent')}
                    onTouchStart={() => handleSliderStart('dryMatterContent')}
                    onFocus={() => handleSliderStart('dryMatterContent')}
                    onChange={(e) => {
                      handleSliderStart('dryMatterContent');
                      handleUpdateRtmParam('dryMatterContent', parseFloat(e.target.value));
                    }}
                    className="w-full accent-stone-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>0.002 g/cm² (Thin Herbaceous)</span>
                    <span>0.009 g/cm² (Deciduous)</span>
                    <span>0.025 g/cm² (Thick Sclerophyll)</span>
                  </div>
                </div>

                {/* Leaf Structure N */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-medium">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-stone-800 font-semibold">
                        Mesophyll Structure Parameter (N):
                      </span>
                      <RTMParamTooltipButton
                        paramKey="leafStructureN"
                        onFocusSensitivity={(k) => {
                          setIsSensitivityMode(true);
                          setActiveSensitivityParam(k);
                        }}
                        isSensitivityActive={isSensitivityMode}
                      />
                    </div>
                    <span className="font-mono text-emerald-800 font-bold">
                      {rtmParams.leafStructureN.toFixed(2)} layers
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.5"
                    step="0.05"
                    value={rtmParams.leafStructureN}
                    onPointerDown={() => handleSliderStart('leafStructureN')}
                    onTouchStart={() => handleSliderStart('leafStructureN')}
                    onFocus={() => handleSliderStart('leafStructureN')}
                    onChange={(e) => {
                      handleSliderStart('leafStructureN');
                      handleUpdateRtmParam('leafStructureN', parseFloat(e.target.value));
                    }}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>1.0 (Monocot / Grass)</span>
                    <span>1.5 (Bifacial Dicot)</span>
                    <span>2.5 (Thick Needle)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Mechanics & Teaching Insights Guide */}
          <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-stone-700">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Physics Foundations: Radiative Transfer Across Optical Domains</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">1. Visible Spectrum &amp; Red Edge Shift</span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  As chlorophyll increases (Cab), the 675 nm absorption well deepens, causing the inflection point of the red edge (REP) to shift towards longer wavelengths ("red-shift").
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">2. Canopy Cover &amp; NIR Scattering</span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  As canopy cover approaches 100%, photon trapping through multiple intra-canopy scattering amplifies the 750–1100 nm NIR plateau far above a single leaf's reflectance.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">3. SWIR Liquid Water Depressions</span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Increasing equivalent water thickness (Cw) progressively carves out deep liquid water absorption troughs at 970 nm, 1200 nm, 1450 nm, and 1940 nm.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 3: RTM ENVIRONMENTAL SCENARIOS (SIM VS. OBSERVED)
         ======================================================== */}
      {explorerMode === 'scenarios' && (
        <RTMScenariosTab
          onLoadIntoSandbox={(params) => {
            setRtmParams(params);
            setSelectedPresetKey('custom');
            setExplorerMode('rtm');
          }}
        />
      )}
    </div>
  );
};
