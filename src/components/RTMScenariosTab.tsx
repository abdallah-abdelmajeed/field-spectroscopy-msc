import React, { useState, useMemo } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Compass,
  Download,
  Droplets,
  Eye,
  EyeOff,
  FlaskConical,
  GitCompare,
  Info,
  Layers,
  Leaf,
  Maximize2,
  Plus,
  RefreshCw,
  Sliders,
  Sparkles,
  Sun,
  Target,
  Trash2,
  TreeDeciduous,
  TrendingUp,
  Zap
} from 'lucide-react';
import {
  RTM_SCENARIOS,
  type RTMScenario,
  type RTMScenarioStep,
  type WavelengthTarget
} from '../data/rtmScenariosData';
import {
  REFERENCE_COMPARISON_DATASETS,
  type ReferenceDatasetItem,
  type SpectralComparisonResult,
  computeSpectralComparison,
  interpolateReflectance
} from '../data/rtmMetadata';
import {
  simulateRTM,
  DEFAULT_RTM_PARAMS,
  type RTMParameters,
  type RTMSimulationResult
} from '../utils/rtmPhysics';
import { generateSmoothReferencePath } from '../utils/spline';

interface RTMScenariosTabProps {
  onLoadIntoSandbox: (params: RTMParameters) => void;
}

// Stage color palette for multi-simulation overlay
export const STAGE_PALETTE = [
  {
    stroke: '#d97706', // Amber-600
    fill: '#fef3c7',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    activeBg: 'bg-amber-600 text-white',
    border: 'border-amber-300',
    chipBorder: 'border-amber-400',
    ring: 'ring-amber-500/30',
    dot: 'bg-amber-500',
    name: 'Stage 1 (Initial)'
  },
  {
    stroke: '#2563eb', // Blue-600
    fill: '#dbeafe',
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    activeBg: 'bg-blue-600 text-white',
    border: 'border-blue-300',
    chipBorder: 'border-blue-400',
    ring: 'ring-blue-500/30',
    dot: 'bg-blue-500',
    name: 'Stage 2 (Transition)'
  },
  {
    stroke: '#059669', // Emerald-600
    fill: '#d1fae5',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    activeBg: 'bg-emerald-600 text-white',
    border: 'border-emerald-300',
    chipBorder: 'border-emerald-400',
    ring: 'ring-emerald-500/30',
    dot: 'bg-emerald-500',
    name: 'Stage 3 (Benchmark)'
  },
  {
    stroke: '#7c3aed', // Purple-600
    fill: '#ede9fe',
    text: 'text-purple-700',
    bg: 'bg-purple-50',
    activeBg: 'bg-purple-600 text-white',
    border: 'border-purple-300',
    chipBorder: 'border-purple-400',
    ring: 'ring-purple-500/30',
    dot: 'bg-purple-500',
    name: 'Stage 4 (Saturation / Extreme)'
  },
  {
    stroke: '#db2777', // Pink-600
    fill: '#fce7f3',
    text: 'text-pink-700',
    bg: 'bg-pink-50',
    activeBg: 'bg-pink-600 text-white',
    border: 'border-pink-300',
    chipBorder: 'border-pink-400',
    ring: 'ring-pink-500/30',
    dot: 'bg-pink-500',
    name: 'Stage 5'
  }
];

export interface PinnedScenarioItem {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  stepIndex: number;
  stepLabel: string;
  params: RTMParameters;
  simResult: RTMSimulationResult;
  color: string;
}

export const RTMScenariosTab: React.FC<RTMScenariosTabProps> = ({
  onLoadIntoSandbox
}) => {
  // Active selected scenario
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('lai_canopy_gradient');
  // Active step index within selected scenario
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  // Spectral wavelength range: full, vnir, or swir
  const [activeRange, setActiveRange] = useState<'full' | 'vnir' | 'swir'>('full');
  // Visualization toggles
  const [showResiduals, setShowResiduals] = useState<boolean>(true);
  const [showLeafSoilComponents, setShowLeafSoilComponents] = useState<boolean>(false);
  const [highlightedWl, setHighlightedWl] = useState<number | null>(null);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; wl: number } | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // --- MULTI-SIMULATION SCENARIO OVERLAY STATE ---
  const [isOverlayMode, setIsOverlayMode] = useState<boolean>(true); // Default true so students immediately see the multi-curve feature
  const [overlayStageIndices, setOverlayStageIndices] = useState<number[]>([0, 1, 2, 3]);
  const [showDynamicEnvelope, setShowDynamicEnvelope] = useState<boolean>(true);
  const [showSensitivityAnalysis, setShowSensitivityAnalysis] = useState<boolean>(true);
  const [pinnedScenarios, setPinnedScenarios] = useState<PinnedScenarioItem[]>([]);
  const [showAddPinDropdown, setShowAddPinDropdown] = useState<boolean>(false);

  // Active scenario object
  const currentScenario: RTMScenario = useMemo(() => {
    return (
      RTM_SCENARIOS.find((s) => s.id === selectedScenarioId) || RTM_SCENARIOS[0]
    );
  }, [selectedScenarioId]);

  // Safe active step
  const activeStep: RTMScenarioStep = useMemo(() => {
    const steps = currentScenario.steps;
    return steps[activeStepIndex] || steps[0];
  }, [currentScenario, activeStepIndex]);

  // Combined RTM parameters for current step
  const activeParams: RTMParameters = useMemo(() => {
    return {
      ...DEFAULT_RTM_PARAMS,
      ...activeStep.params
    };
  }, [activeStep]);

  // Run RTM physics simulation in real-time for active step
  const simResult: RTMSimulationResult = useMemo(() => {
    return simulateRTM(activeParams);
  }, [activeParams]);

  // Pre-calculate RTM simulations for ALL stages in the current scenario
  const allStageSimulations = useMemo(() => {
    return currentScenario.steps.map((step, idx) => {
      const params: RTMParameters = {
        ...DEFAULT_RTM_PARAMS,
        ...step.params
      };
      const sim = simulateRTM(params);
      const palette = STAGE_PALETTE[idx % STAGE_PALETTE.length];
      return {
        idx,
        step,
        params,
        sim,
        palette
      };
    });
  }, [currentScenario]);

  // Filter stages that are currently enabled in overlay
  const activeOverlaySimulations = useMemo(() => {
    return allStageSimulations.filter((s) => overlayStageIndices.includes(s.idx));
  }, [allStageSimulations, overlayStageIndices]);

  // Matched observed reference dataset
  const observedDataset: ReferenceDatasetItem = useMemo(() => {
    return (
      REFERENCE_COMPARISON_DATASETS.find(
        (d) => d.id === currentScenario.observedDatasetId
      ) || REFERENCE_COMPARISON_DATASETS[0]
    );
  }, [currentScenario]);

  // Compute quantitative fit metrics (RMSE, SAM, R², indices) for active step
  const comparisonMetrics: SpectralComparisonResult = useMemo(() => {
    return computeSpectralComparison(
      simResult.wavelengths,
      simResult.canopyReflectance,
      observedDataset
    );
  }, [simResult, observedDataset]);

  // Reset step index and overlay stages when switching scenarios
  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setActiveStepIndex(0);
    const targetScenario = RTM_SCENARIOS.find((s) => s.id === scenarioId);
    if (targetScenario) {
      setOverlayStageIndices(targetScenario.steps.map((_, i) => i));
    }
    setHighlightedWl(null);
  };

  // Jump to benchmark optimal match step
  const handleJumpToOptimalMatch = () => {
    setActiveStepIndex(currentScenario.optimalStepIndex);
  };

  // Toggle individual stage in overlay
  const handleToggleStageOverlay = (stageIdx: number) => {
    if (overlayStageIndices.includes(stageIdx)) {
      if (overlayStageIndices.length > 1) {
        setOverlayStageIndices(overlayStageIndices.filter((i) => i !== stageIdx));
      }
    } else {
      setOverlayStageIndices([...overlayStageIndices, stageIdx].sort((a, b) => a - b));
    }
  };

  // Select all stages in overlay
  const handleSelectAllStages = () => {
    setOverlayStageIndices(currentScenario.steps.map((_, i) => i));
  };

  // Select only the currently active stage
  const handleIsolateActiveStage = () => {
    setOverlayStageIndices([activeStepIndex]);
  };

  // Add a pinned comparison scenario/step
  const handlePinScenarioStep = (scenarioId: string, stepIdx: number) => {
    const sc = RTM_SCENARIOS.find((s) => s.id === scenarioId);
    if (!sc) return;
    const st = sc.steps[stepIdx] || sc.steps[0];
    const params: RTMParameters = {
      ...DEFAULT_RTM_PARAMS,
      ...st.params
    };
    const sim = simulateRTM(params);
    const pinColors = ['#0891b2', '#c026d3', '#ea580c', '#4338ca'];
    const newPin: PinnedScenarioItem = {
      id: `${scenarioId}_${stepIdx}_${Date.now()}`,
      scenarioId,
      scenarioTitle: sc.shortTitle,
      stepIndex: stepIdx,
      stepLabel: st.label,
      params,
      simResult: sim,
      color: pinColors[pinnedScenarios.length % pinColors.length]
    };
    setPinnedScenarios([...pinnedScenarios, newPin]);
    setShowAddPinDropdown(false);
  };

  const handleRemovePin = (id: string) => {
    setPinnedScenarios(pinnedScenarios.filter((p) => p.id !== id));
  };

  // Spectral wavelength domain boundaries
  const minWl = activeRange === 'swir' ? 1000 : 350;
  const maxWl = activeRange === 'vnir' ? 1000 : 2500;

  // SVG coordinate transformation system
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

  // Make smooth continuous SVG path for RTM simulation results
  const makeArrayPath = (wavelengths: number[], values: number[]) => {
    let path = '';
    let first = true;
    for (let i = 0; i < wavelengths.length; i++) {
      const wl = wavelengths[i];
      if (wl >= minWl && wl <= maxWl) {
        const x = getX(wl);
        const y = getY(values[i]);
        if (first) {
          path += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
          first = false;
        } else {
          path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        }
      }
    }
    return path;
  };

  // Make smooth continuous SVG path for observed reference dataset (PCHIP spline)
  const makeReferencePath = (dataset: ReferenceDatasetItem) => {
    return generateSmoothReferencePath(dataset.dataPoints, minWl, maxWl, getX, getY, 5);
  };

  // Shaded dynamic range envelope SVG polygon path across active overlay stages
  const envelopePath = useMemo(() => {
    if (!isOverlayMode || !showDynamicEnvelope || activeOverlaySimulations.length < 2) return '';
    const wavelengths = simResult.wavelengths;
    const topPoints: Array<{ x: number; y: number }> = [];
    const bottomPoints: Array<{ x: number; y: number }> = [];

    for (let i = 0; i < wavelengths.length; i++) {
      const wl = wavelengths[i];
      if (wl >= minWl && wl <= maxWl) {
        let minVal = 1.0;
        let maxVal = 0.0;
        for (const s of activeOverlaySimulations) {
          const v = s.sim.canopyReflectance[i];
          if (v < minVal) minVal = v;
          if (v > maxVal) maxVal = v;
        }
        topPoints.push({ x: getX(wl), y: getY(maxVal) });
        bottomPoints.push({ x: getX(wl), y: getY(minVal) });
      }
    }

    if (topPoints.length === 0) return '';
    let path = `M ${topPoints[0].x.toFixed(1)} ${topPoints[0].y.toFixed(1)}`;
    for (let i = 1; i < topPoints.length; i++) {
      path += ` L ${topPoints[i].x.toFixed(1)} ${topPoints[i].y.toFixed(1)}`;
    }
    for (let i = bottomPoints.length - 1; i >= 0; i--) {
      path += ` L ${bottomPoints[i].x.toFixed(1)} ${bottomPoints[i].y.toFixed(1)}`;
    }
    path += ' Z';
    return path;
  }, [isOverlayMode, showDynamicEnvelope, activeOverlaySimulations, minWl, maxWl, simResult]);

  // Compute quantitative incremental sensitivity metrics across stages
  const incrementalProgressionMetrics = useMemo(() => {
    if (allStageSimulations.length < 2) return null;
    const firstSim = allStageSimulations[0];
    const lastSim = allStageSimulations[allStageSimulations.length - 1];
    const wavelengths = firstSim.sim.wavelengths;

    let maxDelta = 0;
    let maxDeltaWl = 800;
    let maxDeltaSign = 1;

    for (let i = 0; i < wavelengths.length; i++) {
      const diff = lastSim.sim.canopyReflectance[i] - firstSim.sim.canopyReflectance[i];
      if (Math.abs(diff) > maxDelta) {
        maxDelta = Math.abs(diff);
        maxDeltaWl = wavelengths[i];
        maxDeltaSign = Math.sign(diff);
      }
    }

    // Band-specific deltas
    const getDeltaAt = (wl: number) => {
      const idx = wavelengths.indexOf(wl);
      if (idx === -1) return 0;
      return lastSim.sim.canopyReflectance[idx] - firstSim.sim.canopyReflectance[idx];
    };

    const deltaRed = getDeltaAt(675);
    const deltaNIR = getDeltaAt(800);
    const deltaSWIR1 = getDeltaAt(1610);
    const deltaSWIR2 = getDeltaAt(2200);

    // Red edge shift
    const repShift = lastSim.sim.indices.rep - firstSim.sim.indices.rep;
    // NDVI delta
    const ndviDelta = lastSim.sim.indices.ndvi - firstSim.sim.indices.ndvi;

    return {
      firstStep: firstSim.step,
      lastStep: lastSim.step,
      maxDelta,
      maxDeltaWl,
      maxDeltaSign,
      deltaRed,
      deltaNIR,
      deltaSWIR1,
      deltaSWIR2,
      repShift,
      ndviDelta,
      firstNdvi: firstSim.sim.indices.ndvi,
      lastNdvi: lastSim.sim.indices.ndvi
    };
  }, [allStageSimulations]);

  // Multi-curve hover inspection values calculation
  const hoverMultiValues = useMemo(() => {
    if (!hoverPoint) return null;
    const wl = hoverPoint.wl;
    const wavelengths = simResult.wavelengths;
    const idx = wavelengths.findIndex((w) => Math.abs(w - wl) <= 3);
    if (idx === -1) return null;

    const exactWl = wavelengths[idx];
    const obsVal = interpolateReflectance(observedDataset.dataPoints, exactWl);
    const activeSimVal = simResult.canopyReflectance[idx];

    // Stage values
    const stages = activeOverlaySimulations.map((s) => {
      const simVal = s.sim.canopyReflectance[idx];
      const residual = simVal - obsVal;
      return {
        idx: s.idx,
        label: s.step.label,
        badge: s.step.badge,
        palette: s.palette,
        simVal,
        residual,
        isCurrentActive: s.idx === activeStepIndex
      };
    });

    const baselineVal = stages[0]?.simVal ?? activeSimVal;
    const stageSpread =
      stages.length > 1
        ? Math.max(...stages.map((s) => s.simVal)) - Math.min(...stages.map((s) => s.simVal))
        : 0;

    // Pinned scenarios values
    const pinned = pinnedScenarios.map((p) => {
      const simVal = p.simResult.canopyReflectance[idx];
      return {
        id: p.id,
        label: `${p.scenarioTitle}: ${p.stepLabel}`,
        color: p.color,
        simVal,
        residual: simVal - obsVal
      };
    });

    return {
      wl: exactWl,
      obsVal,
      activeSimVal,
      stages,
      pinned,
      baselineVal,
      stageSpread
    };
  }, [
    hoverPoint,
    simResult,
    observedDataset,
    activeOverlaySimulations,
    activeStepIndex,
    pinnedScenarios
  ]);

  // Export comparison table as CSV file (supports both single and multi-simulation overlay)
  const handleExportCSV = () => {
    let csv = '';
    if (isOverlayMode && activeOverlaySimulations.length > 1) {
      // Header for multi-simulation overlay
      csv = 'Wavelength_nm';
      activeOverlaySimulations.forEach((s) => {
        const cleanName = s.step.label.replace(/[^a-zA-Z0-9_]/g, '_');
        csv += `,Sim_${cleanName}_Reflectance`;
      });
      pinnedScenarios.forEach((p) => {
        const cleanPin = `${p.scenarioTitle}_${p.stepLabel}`.replace(/[^a-zA-Z0-9_]/g, '_');
        csv += `,Pinned_${cleanPin}_Reflectance`;
      });
      csv += ',Observed_Field_Reflectance,Max_Delta_Stage_Spread\n';

      for (let i = 0; i < simResult.wavelengths.length; i++) {
        const wl = simResult.wavelengths[i];
        const obs = interpolateReflectance(observedDataset.dataPoints, wl);
        let row = `${wl}`;
        let minR = 1.0;
        let maxR = 0.0;
        activeOverlaySimulations.forEach((s) => {
          const val = s.sim.canopyReflectance[i];
          if (val < minR) minR = val;
          if (val > maxR) maxR = val;
          row += `,${val.toFixed(5)}`;
        });
        pinnedScenarios.forEach((p) => {
          const val = p.simResult.canopyReflectance[i];
          row += `,${val.toFixed(5)}`;
        });
        row += `,${obs.toFixed(5)},${(maxR - minR).toFixed(5)}\n`;
        csv += row;
      }
    } else {
      // Standard single-simulation format
      csv = 'Wavelength_nm,Simulated_Canopy_Reflectance,Observed_Field_Reflectance,Residual_Delta\n';
      for (let i = 0; i < simResult.wavelengths.length; i++) {
        const wl = simResult.wavelengths[i];
        const sim = simResult.canopyReflectance[i];
        const obs = interpolateReflectance(observedDataset.dataPoints, wl);
        const delta = sim - obs;
        csv += `${wl},${sim.toFixed(5)},${obs.toFixed(5)},${delta.toFixed(5)}\n`;
      }
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      isOverlayMode
        ? `RTM_Scenario_${currentScenario.id}_MultiStage_Overlay.csv`
        : `RTM_Scenario_${currentScenario.id}_Stage_${activeStep.stepNumber}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  // Map category icons
  const renderCategoryIcon = (category: RTMScenario['category']) => {
    switch (category) {
      case 'Vegetation Structure':
        return <TreeDeciduous className="w-4 h-4 text-emerald-600" />;
      case 'Pigment Dynamics':
        return <Leaf className="w-4 h-4 text-green-600" />;
      case 'Hydrological Stress':
        return <Droplets className="w-4 h-4 text-cyan-600" />;
      case 'Substrate Coupling':
        return <Sun className="w-4 h-4 text-amber-600" />;
      case 'Senescence & NPV':
        return <Sparkles className="w-4 h-4 text-rose-600" />;
      case 'Canopy Architecture':
        return <Compass className="w-4 h-4 text-indigo-600" />;
      default:
        return <Layers className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div id="rtm-scenarios-subtab" className="space-y-6">
      {/* Top Banner & Scenario Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                PROSPECT-D + 4SAIL
              </span>
              <span className="text-xs font-bold text-purple-800 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Calibrated Empirical Ground Truth
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-1 flex items-center space-x-2">
              <span>RTM Environmental Scenarios &amp; Empirical Validation</span>
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Explore physically modeled environmental progressions (canopy growth gradients, foliar chlorophyll shifts, drought water deficits, substrate contrast, and senescence). Directly validate simulated radiative transfer physics against in-situ field spectroradiometer measurements.
            </p>
          </div>

          {/* Quick Action: Transfer to Full Sandbox */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onLoadIntoSandbox(activeParams)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Transfer these active physical parameters into the Interactive RTM Sandbox for custom fine-tuning"
            >
              <Sliders className="w-4 h-4 text-emerald-300" />
              <span>Open in RTM Sandbox</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl border border-stone-300 transition-colors cursor-pointer"
              title="Download simulated vs observed data as CSV for lab report analysis"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>{downloadSuccess ? 'Exported!' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {/* Scenario Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RTM_SCENARIOS.map((scenario) => {
            const isSelected = scenario.id === selectedScenarioId;
            return (
              <button
                key={scenario.id}
                onClick={() => handleSelectScenario(scenario.id)}
                className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600/30'
                    : 'bg-stone-50/70 hover:bg-stone-100 text-stone-800 border-stone-200/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                        isSelected
                          ? 'bg-emerald-800 text-emerald-100'
                          : 'bg-stone-200/80 text-stone-700'
                      }`}
                    >
                      {scenario.category}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <h3
                    className={`text-xs font-bold leading-snug line-clamp-2 ${
                      isSelected ? 'text-white' : 'text-stone-900'
                    }`}
                  >
                    {scenario.title}
                  </h3>
                  <p
                    className={`text-[11px] mt-1 line-clamp-2 leading-tight ${
                      isSelected ? 'text-emerald-100/90' : 'text-stone-500'
                    }`}
                  >
                    {scenario.subtitle}
                  </p>
                </div>

                <div
                  className={`mt-2.5 pt-2 border-t text-[10px] flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-800/80 text-emerald-200'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <span className="truncate max-w-[170px]">
                    Obs: {scenario.observedDatasetLabel.split('(')[0]}
                  </span>
                  <span className="font-semibold shrink-0">
                    {scenario.steps.length} Stages
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Scenario Workspace: Stage Controller & Spectral Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Interactive Spectral Graph */}
        <div className="lg:col-span-8 space-y-4">
          {/* Chart Header & Controls */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center space-x-1.5">
                    {renderCategoryIcon(currentScenario.category)}
                    <span>{currentScenario.shortTitle}</span>
                  </span>
                  <span className="text-stone-400">•</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {activeStep.label}: {activeStep.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 mt-0.5">
                  {activeStep.conditionName}
                </h3>
              </div>

              {/* Range Selector & Plot Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Multi-Simulation Scenario Overlay Toggle */}
                <button
                  id="rtm-scenario-overlay-toggle-btn"
                  onClick={() => setIsOverlayMode(!isOverlayMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isOverlayMode
                      ? 'bg-purple-900 text-white border-purple-700 shadow-xs ring-2 ring-purple-500/30'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-300'
                  }`}
                  title="Toggle overlay of multiple simulation stages simultaneously on the spectral graph"
                >
                  <Layers className={`w-3.5 h-3.5 ${isOverlayMode ? 'text-purple-300' : 'text-stone-500'}`} />
                  <span>Overlay Stages</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isOverlayMode ? 'bg-purple-800 text-purple-100' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {isOverlayMode ? `${activeOverlaySimulations.length} Curves` : 'Off'}
                  </span>
                </button>

                {/* Range Switcher */}
                <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveRange('full')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      activeRange === 'full'
                        ? 'bg-white font-bold text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Full (350–2500)
                  </button>
                  <button
                    onClick={() => setActiveRange('vnir')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      activeRange === 'vnir'
                        ? 'bg-white font-bold text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    VNIR
                  </button>
                  <button
                    onClick={() => setActiveRange('swir')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      activeRange === 'swir'
                        ? 'bg-white font-bold text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    SWIR
                  </button>
                </div>

                {/* Residual Lines Toggle */}
                <button
                  onClick={() => setShowResiduals(!showResiduals)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center space-x-1.5 ${
                    showResiduals
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                  title="Toggle vertical residual error lines between simulated and observed curves"
                >
                  <Target className="w-3.5 h-3.5 text-rose-600" />
                  <span>Residuals</span>
                </button>

                {/* Single Leaf/Soil Components Toggle */}
                <button
                  onClick={() => setShowLeafSoilComponents(!showLeafSoilComponents)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center space-x-1.5 ${
                    showLeafSoilComponents
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                  title="Toggle single leaf albedo and underlying soil substrate curves"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-700" />
                  <span>Components</span>
                </button>
              </div>
            </div>

            {/* MULTI-SIMULATION OVERLAY CONTROLS BAR (When Overlay Mode is Active) */}
            {isOverlayMode && (
              <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 space-y-3 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                    <span className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center space-x-1">
                      <GitCompare className="w-3.5 h-3.5 text-purple-700" />
                      <span>Multi-Scenario Simulation Overlay:</span>
                    </span>
                    <span className="text-[11px] text-purple-800 font-medium">
                      Simulate and overlay multiple parameter stages to visually track curve shifts.
                    </span>
                  </div>

                  {/* Multi-overlay utility buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSelectAllStages}
                      className="px-2 py-1 bg-white hover:bg-purple-100 text-purple-900 text-[11px] font-bold rounded-md border border-purple-200 transition-colors cursor-pointer"
                      title="Show all scenario stages simultaneously"
                    >
                      All ({currentScenario.steps.length})
                    </button>
                    <button
                      onClick={handleIsolateActiveStage}
                      className="px-2 py-1 bg-white hover:bg-purple-100 text-purple-900 text-[11px] font-bold rounded-md border border-purple-200 transition-colors cursor-pointer"
                      title="Isolate only the active step on graph"
                    >
                      Isolate Active
                    </button>
                    <button
                      onClick={() => setShowDynamicEnvelope(!showDynamicEnvelope)}
                      className={`px-2 py-1 text-[11px] font-bold rounded-md border transition-colors cursor-pointer flex items-center space-x-1 ${
                        showDynamicEnvelope
                          ? 'bg-purple-700 text-white border-purple-700'
                          : 'bg-white text-purple-800 border-purple-200'
                      }`}
                      title="Toggle shaded dynamic sensitivity envelope between min and max stage curves"
                    >
                      <span>Envelope Shading</span>
                    </button>

                    {/* Add Cross-Scenario Pin Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowAddPinDropdown(!showAddPinDropdown)}
                        className="px-2 py-1 bg-white hover:bg-stone-100 text-stone-800 text-[11px] font-bold rounded-md border border-stone-300 transition-colors cursor-pointer flex items-center space-x-1"
                        title="Add a simulation curve from another scenario to compare"
                      >
                        <Plus className="w-3 h-3 text-emerald-600" />
                        <span>Compare Scenario...</span>
                        <ChevronDown className="w-3 h-3 text-stone-500" />
                      </button>

                      {showAddPinDropdown && (
                        <div className="absolute right-0 top-full mt-1.5 z-30 w-72 bg-white rounded-xl shadow-xl border border-stone-200 p-2 space-y-1 text-xs">
                          <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-2 py-1 border-b border-stone-100">
                            Overlay another scenario curve:
                          </div>
                          <div className="max-h-56 overflow-y-auto space-y-1">
                            {RTM_SCENARIOS.filter((s) => s.id !== currentScenario.id).map((sc) => (
                              <div key={sc.id} className="p-1.5 hover:bg-stone-50 rounded-lg">
                                <div className="font-bold text-stone-900 text-[11px]">{sc.shortTitle}</div>
                                <div className="grid grid-cols-2 gap-1 mt-1">
                                  {sc.steps.map((st, sidx) => (
                                    <button
                                      key={st.id}
                                      onClick={() => handlePinScenarioStep(sc.id, sidx)}
                                      className="text-left text-[10px] px-1.5 py-1 bg-stone-100 hover:bg-purple-100 hover:text-purple-900 rounded text-stone-700 truncate cursor-pointer font-medium"
                                      title={st.conditionName}
                                    >
                                      {st.label.split(':')[0]}: {st.badge}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stage Selection & Curve Swatches */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {allStageSimulations.map((s) => {
                    const isVisible = overlayStageIndices.includes(s.idx);
                    const isActive = s.idx === activeStepIndex;
                    return (
                      <div
                        key={s.step.id}
                        className={`p-2 rounded-lg border transition-all flex items-center justify-between text-xs ${
                          isActive
                            ? 'bg-white border-purple-500 shadow-xs ring-2 ring-purple-500/20'
                            : isVisible
                            ? 'bg-white/90 border-purple-200'
                            : 'bg-stone-100/60 border-stone-200 opacity-60'
                        }`}
                      >
                        <div
                          className="flex items-center space-x-2 truncate cursor-pointer flex-1 mr-1"
                          onClick={() => setActiveStepIndex(s.idx)}
                          title={`Click to set as primary active step (${s.step.conditionName})`}
                        >
                          <span
                            className="w-3.5 h-1 rounded-full shrink-0"
                            style={{ backgroundColor: s.palette.stroke }}
                          />
                          <div className="truncate">
                            <div className="flex items-center space-x-1 font-bold text-stone-900 truncate text-[11px]">
                              <span>Step {s.step.stepNumber}:</span>
                              <span className="truncate">{s.step.badge}</span>
                            </div>
                            <div className="text-[10px] text-stone-500 truncate">
                              {s.step.conditionName.split('(')[1]?.replace(')', '') || s.step.conditionName}
                            </div>
                          </div>
                        </div>

                        {/* Visibility Checkbox / Toggle */}
                        <div className="flex items-center space-x-1 shrink-0">
                          {isActive && (
                            <span className="text-[9px] font-bold px-1 rounded bg-purple-100 text-purple-800">
                              Active
                            </span>
                          )}
                          <button
                            onClick={() => handleToggleStageOverlay(s.idx)}
                            className={`p-1 rounded cursor-pointer transition-colors ${
                              isVisible
                                ? 'text-purple-700 hover:bg-purple-100'
                                : 'text-stone-400 hover:bg-stone-200'
                            }`}
                            title={isVisible ? 'Hide curve from graph' : 'Show curve on graph'}
                          >
                            {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pinned Scenarios Active List */}
                {pinnedScenarios.length > 0 && (
                  <div className="pt-2 border-t border-purple-200/80 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-purple-950 text-[11px]">Pinned External Scenarios:</span>
                    {pinnedScenarios.map((pin) => (
                      <span
                        key={pin.id}
                        className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-white border text-[11px] font-medium text-stone-800 shadow-2xs"
                        style={{ borderColor: pin.color }}
                      >
                        <span
                          className="w-2.5 h-0.5 rounded-full inline-block border-b-2 border-dashed"
                          style={{ borderColor: pin.color }}
                        />
                        <span>{pin.label}</span>
                        <button
                          onClick={() => handleRemovePin(pin.id)}
                          className="text-stone-400 hover:text-rose-600 cursor-pointer ml-1"
                          title="Remove pinned curve"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Environmental Condition Progression Stepper */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 uppercase tracking-wider flex items-center space-x-1">
                  <span>Environmental Condition Stages:</span>
                </span>
                <button
                  onClick={handleJumpToOptimalMatch}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 bg-emerald-100/60 hover:bg-emerald-100 px-2 py-0.5 rounded cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Jump to Field Benchmark Match (Stage {currentScenario.optimalStepIndex + 1})</span>
                </button>
              </div>

              {/* Step Navigation Pill Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentScenario.steps.map((step, idx) => {
                  const isActive = idx === activeStepIndex;
                  const isOptimal = idx === currentScenario.optimalStepIndex;
                  const isOverlayActive = overlayStageIndices.includes(idx);
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer relative ${
                        isActive
                          ? 'bg-emerald-800 text-white border-emerald-700 shadow-xs'
                          : 'bg-white hover:bg-stone-100/80 text-stone-800 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold ${
                            isActive ? 'text-emerald-200' : 'text-stone-500'
                          }`}
                        >
                          Step {step.stepNumber}
                        </span>
                        <div className="flex items-center space-x-1">
                          {isOverlayMode && isOverlayActive && (
                            <span
                              className="w-2 h-2 rounded-full inline-block"
                              style={{ backgroundColor: STAGE_PALETTE[idx % STAGE_PALETTE.length].stroke }}
                              title="Rendered on overlay plot"
                            />
                          )}
                          {isOptimal && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                isActive
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              Field Match
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={`text-xs font-bold mt-0.5 truncate ${
                          isActive ? 'text-white' : 'text-stone-900'
                        }`}
                      >
                        {step.label.split(':')[1] || step.label}
                      </div>
                      <div
                        className={`text-[10px] truncate mt-0.5 ${
                          isActive ? 'text-emerald-100' : 'text-stone-500'
                        }`}
                      >
                        {step.badge}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Step Description & Governing Mechanism */}
              <div className="p-3 bg-white rounded-lg border border-stone-200/80 text-xs text-stone-700 space-y-1">
                <p className="font-medium text-stone-900">
                  <span className="font-bold text-emerald-800">Condition:</span>{' '}
                  {activeStep.description}
                </p>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  <span className="font-bold text-stone-700">Physical Radiative Transfer Driver:</span>{' '}
                  {activeStep.keyMechanisms}
                </p>
              </div>
            </div>

            {/* Interactive SVG Spectral Plot */}
            <div className="relative overflow-x-auto select-none">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto"
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
                {/* Background Grid Lines */}
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

                {/* Atmospheric Mask Shading (1350–1450 nm & 1800–1950 nm) */}
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

                {/* Key Wavelengths Highlight Guides */}
                {currentScenario.keyWavelengthsToWatch.map((item, idx) => {
                  if (item.wl < minWl || item.wl > maxWl) return null;
                  const isTargeted = highlightedWl === item.wl;
                  return (
                    <g key={idx} className="cursor-pointer" onClick={() => setHighlightedWl(item.wl)}>
                      <line
                        x1={getX(item.wl)}
                        y1={padding.top}
                        x2={getX(item.wl)}
                        y2={svgHeight - padding.bottom}
                        stroke={isTargeted ? '#2563eb' : '#cbd5e1'}
                        strokeWidth={isTargeted ? '2' : '1'}
                        strokeDasharray={isTargeted ? 'none' : '3 3'}
                      />
                      <circle
                        cx={getX(item.wl)}
                        cy={padding.top + 6 + (idx % 3) * 16}
                        r={isTargeted ? 4.5 : 3.5}
                        fill={isTargeted ? '#2563eb' : '#64748b'}
                      />
                    </g>
                  );
                })}

                {/* Dynamic Parameter Sensitivity Shaded Envelope (when overlay mode is active) */}
                {isOverlayMode && showDynamicEnvelope && envelopePath && (
                  <path
                    d={envelopePath}
                    fill="#a855f7"
                    fillOpacity="0.12"
                    stroke="#a855f7"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                    strokeOpacity="0.3"
                  />
                )}

                {/* Optional Sub-Components: Single Leaf & Soil Background */}
                {showLeafSoilComponents && (
                  <>
                    <path
                      d={makeArrayPath(simResult.wavelengths, simResult.leafReflectance)}
                      fill="none"
                      stroke="#84cc16"
                      strokeWidth="1.6"
                      strokeDasharray="4 2"
                      opacity="0.75"
                    />
                    <path
                      d={makeArrayPath(simResult.wavelengths, simResult.soilReflectance)}
                      fill="none"
                      stroke="#92400e"
                      strokeWidth="1.6"
                      strokeDasharray="4 2"
                      opacity="0.75"
                    />
                  </>
                )}

                {/* OBSERVED REAL-WORLD GROUND TRUTH FIELD SPECTRUM */}
                <path
                  d={makeReferencePath(observedDataset)}
                  fill="none"
                  stroke={observedDataset.color || '#9333ea'}
                  strokeWidth="3.2"
                  strokeDasharray="6 3"
                  strokeLinecap="round"
                />

                {/* --- SIMULATION CURVES RENDERING --- */}
                {isOverlayMode ? (
                  <>
                    {/* Render Inactive Overlay Stages First */}
                    {activeOverlaySimulations
                      .filter((s) => s.idx !== activeStepIndex)
                      .map((s) => (
                        <g key={s.idx} className="cursor-pointer" onClick={() => setActiveStepIndex(s.idx)}>
                          <path
                            d={makeArrayPath(s.sim.wavelengths, s.sim.canopyReflectance)}
                            fill="none"
                            stroke={s.palette.stroke}
                            strokeWidth="2.4"
                            strokeOpacity="0.85"
                            strokeLinecap="round"
                          />
                        </g>
                      ))}

                    {/* Render Pinned External Scenario Curves */}
                    {pinnedScenarios.map((pin) => (
                      <path
                        key={pin.id}
                        d={makeArrayPath(pin.simResult.wavelengths, pin.simResult.canopyReflectance)}
                        fill="none"
                        stroke={pin.color}
                        strokeWidth="2.2"
                        strokeDasharray="4 2"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                    ))}

                    {/* Render Primary Active Step with Prominent Glow & Thick Stroke */}
                    {overlayStageIndices.includes(activeStepIndex) && (
                      <g>
                        <path
                          d={makeArrayPath(simResult.wavelengths, simResult.canopyReflectance)}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="6"
                          strokeLinecap="round"
                          opacity="0.9"
                        />
                        <path
                          d={makeArrayPath(simResult.wavelengths, simResult.canopyReflectance)}
                          fill="none"
                          stroke={STAGE_PALETTE[activeStepIndex % STAGE_PALETTE.length].stroke}
                          strokeWidth="3.6"
                          strokeLinecap="round"
                        />
                      </g>
                    )}
                  </>
                ) : (
                  /* Single Simulation Mode (Standard View) */
                  <path
                    d={makeArrayPath(simResult.wavelengths, simResult.canopyReflectance)}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                  />
                )}

                {/* RESIDUAL ERROR LINES (Active SIM vs OBS) */}
                {showResiduals && (
                  <g opacity="0.65">
                    {simResult.wavelengths
                      .filter((w, i) => i % 6 === 0 && w >= minWl && w <= maxWl)
                      .map((w, idx) => {
                        const simY = simResult.canopyReflectance[simResult.wavelengths.indexOf(w)];
                        const obsY = interpolateReflectance(observedDataset.dataPoints, w);
                        const delta = Math.abs(simY - obsY);
                        if (delta < 0.02) return null;
                        return (
                          <line
                            key={idx}
                            x1={getX(w)}
                            y1={getY(simY)}
                            x2={getX(w)}
                            y2={getY(obsY)}
                            stroke={delta > 0.08 ? '#dc2626' : '#ea580c'}
                            strokeWidth="1.4"
                            strokeDasharray="2 2"
                          />
                        );
                      })}
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

                {/* Interactive Hover Crosshair */}
                {hoverPoint && hoverMultiValues && (
                  <g>
                    <line
                      x1={hoverPoint.x}
                      y1={padding.top}
                      x2={hoverPoint.x}
                      y2={svgHeight - padding.bottom}
                      stroke="#475569"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                    {isOverlayMode ? (
                      hoverMultiValues.stages.map((st) => (
                        <circle
                          key={st.idx}
                          cx={hoverPoint.x}
                          cy={getY(st.simVal)}
                          r={st.isCurrentActive ? 5 : 3.5}
                          fill={st.palette.stroke}
                          stroke="#ffffff"
                          strokeWidth={st.isCurrentActive ? 2 : 1}
                        />
                      ))
                    ) : (
                      <circle
                        cx={hoverPoint.x}
                        cy={getY(hoverMultiValues.activeSimVal)}
                        r="4.5"
                        fill="#059669"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    )}
                    <circle
                      cx={hoverPoint.x}
                      cy={getY(hoverMultiValues.obsVal)}
                      r="4.5"
                      fill={observedDataset.color || '#9333ea'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </svg>

              {/* Synchronized Multi-Stage Hover Tooltip Overlay */}
              {hoverMultiValues && (
                <div className="absolute top-2 right-4 bg-stone-900/95 text-white p-3 rounded-xl shadow-2xl text-xs space-y-2 backdrop-blur-sm pointer-events-none border border-stone-700 min-w-[260px] max-w-[320px] z-20">
                  <div className="font-bold text-stone-200 border-b border-stone-700 pb-1 flex justify-between items-center">
                    <span className="text-sm font-mono text-emerald-400">λ = {hoverMultiValues.wl} nm</span>
                    <span className="text-[10px] text-stone-400 font-sans uppercase tracking-wider">
                      {hoverMultiValues.wl < 700 ? 'Visible' : hoverMultiValues.wl < 1100 ? 'NIR Plateau' : 'SWIR'}
                    </span>
                  </div>

                  {/* Multi-Stage Comparison Rows */}
                  {isOverlayMode ? (
                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-wider">
                        Simulated Stages Progression:
                      </div>
                      {hoverMultiValues.stages.map((st) => {
                        const deltaFromBase = st.simVal - hoverMultiValues.baselineVal;
                        return (
                          <div
                            key={st.idx}
                            className={`flex items-center justify-between px-1.5 py-0.5 rounded ${
                              st.isCurrentActive ? 'bg-stone-800 ring-1 ring-white/20' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-1.5 truncate mr-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: st.palette.stroke }}
                              />
                              <span className="font-sans truncate text-stone-200 text-[10px]">
                                {st.label.split(':')[0]}: {st.badge}
                              </span>
                            </div>
                            <div className="space-x-1 text-right shrink-0">
                              <span className="font-bold text-white">{st.simVal.toFixed(4)}</span>
                              {st.idx > 0 && (
                                <span
                                  className={`text-[10px] ${
                                    deltaFromBase > 0 ? 'text-emerald-400' : deltaFromBase < 0 ? 'text-rose-400' : 'text-stone-400'
                                  }`}
                                >
                                  ({deltaFromBase > 0 ? '+' : ''}
                                  {deltaFromBase.toFixed(3)})
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Stage Dynamic Spread Delta at this Wavelength */}
                      {hoverMultiValues.stages.length > 1 && (
                        <div className="flex justify-between items-center text-[10px] text-amber-300 border-t border-stone-800 pt-1">
                          <span className="font-sans">Stage Dynamic Spread (Δρ_max):</span>
                          <span className="font-bold">+{hoverMultiValues.stageSpread.toFixed(4)}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Single Stage Readout */
                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between items-center text-emerald-400">
                        <span>Simulated RTM (ρ̂):</span>
                        <span className="font-bold">{hoverMultiValues.activeSimVal.toFixed(4)}</span>
                      </div>
                    </div>
                  )}

                  {/* Observed Ground Truth Row */}
                  <div className="border-t border-stone-800 pt-1 font-mono text-[11px] flex justify-between items-center text-purple-300">
                    <span className="font-sans text-[10px]">Observed Field (ρ):</span>
                    <span className="font-bold">{hoverMultiValues.obsVal.toFixed(4)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Legend & Active Datasets */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-100 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                {isOverlayMode ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-stone-800 text-xs">Overlay Simulation Stages:</span>
                    {activeOverlaySimulations.map((s) => (
                      <div
                        key={s.idx}
                        className="flex items-center space-x-1.5 cursor-pointer hover:opacity-80"
                        onClick={() => setActiveStepIndex(s.idx)}
                      >
                        <span
                          className={`w-3.5 h-1 rounded-full inline-block ${
                            s.idx === activeStepIndex ? 'ring-1 ring-stone-900' : ''
                          }`}
                          style={{ backgroundColor: s.palette.stroke }}
                        />
                        <span className={`text-[11px] ${s.idx === activeStepIndex ? 'font-bold text-stone-900' : 'text-stone-600'}`}>
                          {s.step.label.split(':')[0]} ({s.step.badge})
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-1 bg-emerald-600 rounded-full inline-block"></span>
                    <span className="font-bold text-stone-900">
                      Simulated RTM Canopy ({activeStep.label})
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span
                    className="w-4 h-1 rounded-full inline-block border-b-2 border-dashed"
                    style={{ borderColor: observedDataset.color || '#9333ea' }}
                  ></span>
                  <span className="font-bold text-purple-950">
                    Observed: {observedDataset.name}
                  </span>
                </div>

                {showLeafSoilComponents && (
                  <>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-0.5 bg-lime-500 rounded-full inline-block"></span>
                      <span className="text-stone-600 text-[11px]">Single Leaf</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-0.5 bg-amber-700 rounded-full inline-block"></span>
                      <span className="text-stone-600 text-[11px]">Soil Substrate</span>
                    </div>
                  </>
                )}
              </div>

              <span className="text-[11px] text-stone-500 italic">
                Source: {observedDataset.source}
              </span>
            </div>
          </div>

          {/* INCREMENTAL PARAMETER PROGRESSION ANALYSIS PANEL */}
          {incrementalProgressionMetrics && (
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-stone-100">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-purple-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Incremental Parameter Progression &amp; Spectral Sensitivity Analysis
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {currentScenario.steps.length} Stages Compared
                </span>
              </div>

              {/* Peak Divergence Banner */}
              <div className="p-3 bg-gradient-to-r from-purple-50 via-emerald-50 to-blue-50 rounded-xl border border-purple-200/80 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-purple-950 uppercase tracking-wider">
                      Maximum Reflectance Sensitivity (Peak Dynamic Range):
                    </span>
                    <p className="text-xs text-stone-700 mt-0.5 leading-snug">
                      Shifting from <span className="font-bold text-stone-900">{incrementalProgressionMetrics.firstStep.badge}</span> to{' '}
                      <span className="font-bold text-stone-900">{incrementalProgressionMetrics.lastStep.badge}</span> causes greatest reflectance divergence at{' '}
                      <span className="font-mono font-bold text-purple-900">{incrementalProgressionMetrics.maxDeltaWl} nm</span>{' '}
                      with <span className="font-mono font-bold text-emerald-800">Δρ = {incrementalProgressionMetrics.maxDeltaSign > 0 ? '+' : '-'}{incrementalProgressionMetrics.maxDelta.toFixed(3)}</span>.
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center space-x-2 font-mono text-xs bg-white px-3 py-1.5 rounded-lg border border-purple-200 shadow-2xs">
                    <span className="text-stone-500 font-sans text-[11px]">NDVI Dynamic Shift:</span>
                    <span className="font-bold text-stone-900">{incrementalProgressionMetrics.firstNdvi.toFixed(2)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-bold text-emerald-700">{incrementalProgressionMetrics.lastNdvi.toFixed(2)}</span>
                    <span className="text-emerald-800 text-[11px] font-bold">
                      ({incrementalProgressionMetrics.ndviDelta > 0 ? '+' : ''}{incrementalProgressionMetrics.ndviDelta.toFixed(2)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Spectral Domain Incremental Impact Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {/* Visible Red (675 nm) */}
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/90 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                    <span>Visible Red (675 nm)</span>
                  </div>
                  <div className="text-base font-extrabold font-mono text-stone-900">
                    {incrementalProgressionMetrics.deltaRed > 0 ? '+' : ''}
                    {incrementalProgressionMetrics.deltaRed.toFixed(3)}
                  </div>
                  <div className="text-[10px] text-stone-500 leading-tight">
                    {Math.abs(incrementalProgressionMetrics.deltaRed) < 0.05
                      ? 'Saturates early due to high chlorophyll absorption'
                      : 'Sensitive to pigment depletion & substrate contrast'}
                  </div>
                </div>

                {/* Red Edge Shift (REP) */}
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/90 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                    <span>Red Edge Position (REP)</span>
                  </div>
                  <div className="text-base font-extrabold font-mono text-rose-700">
                    {incrementalProgressionMetrics.repShift > 0 ? '+' : ''}
                    {incrementalProgressionMetrics.repShift} nm
                  </div>
                  <div className="text-[10px] text-stone-500 leading-tight">
                    Inflection point displacement across stages
                  </div>
                </div>

                {/* NIR Plateau (800 nm) */}
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/90 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    <span>NIR Plateau (800 nm)</span>
                  </div>
                  <div className="text-base font-extrabold font-mono text-emerald-800">
                    {incrementalProgressionMetrics.deltaNIR > 0 ? '+' : ''}
                    {incrementalProgressionMetrics.deltaNIR.toFixed(3)}
                  </div>
                  <div className="text-[10px] text-stone-500 leading-tight">
                    Multiple foliar layer photon scattering
                  </div>
                </div>

                {/* SWIR-1 (1610 nm) */}
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/90 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                    <span>SWIR-1 (1610 nm)</span>
                  </div>
                  <div className="text-base font-extrabold font-mono text-blue-800">
                    {incrementalProgressionMetrics.deltaSWIR1 > 0 ? '+' : ''}
                    {incrementalProgressionMetrics.deltaSWIR1.toFixed(3)}
                  </div>
                  <div className="text-[10px] text-stone-500 leading-tight">
                    Canopy liquid water &amp; dry matter balance
                  </div>
                </div>
              </div>

              {/* Step-by-Step Parameter & Metric Progression Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-stone-200 rounded-lg overflow-hidden">
                  <thead className="bg-stone-100 text-[10px] font-bold text-stone-700 uppercase tracking-wider">
                    <tr>
                      <th className="p-2">Stage</th>
                      <th className="p-2">Biophysical Condition</th>
                      <th className="p-2">NDVI</th>
                      <th className="p-2">NDWI</th>
                      <th className="p-2">REP</th>
                      <th className="p-2">RMSE vs Field</th>
                      <th className="p-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-mono text-[11px]">
                    {allStageSimulations.map((s) => {
                      const isActive = s.idx === activeStepIndex;
                      const isOverlay = overlayStageIndices.includes(s.idx);
                      const fit = computeSpectralComparison(s.sim.wavelengths, s.sim.canopyReflectance, observedDataset);
                      return (
                        <tr
                          key={s.step.id}
                          className={`hover:bg-stone-50 transition-colors ${
                            isActive ? 'bg-emerald-50/70 font-semibold' : ''
                          }`}
                        >
                          <td className="p-2 font-sans font-bold flex items-center space-x-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: s.palette.stroke }}
                            />
                            <span>Step {s.step.stepNumber}</span>
                          </td>
                          <td className="p-2 font-sans text-stone-800">
                            <span className="font-semibold">{s.step.badge}:</span>{' '}
                            <span className="text-stone-600">{s.step.conditionName}</span>
                          </td>
                          <td className="p-2 text-emerald-800">{s.sim.indices.ndvi.toFixed(3)}</td>
                          <td className="p-2 text-blue-800">{s.sim.indices.ndwi.toFixed(3)}</td>
                          <td className="p-2 text-rose-800">{s.sim.indices.rep} nm</td>
                          <td className="p-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                fit.rmse < 0.035
                                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                                  : fit.rmse < 0.075
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {fit.rmse.toFixed(4)}
                            </span>
                          </td>
                          <td className="p-2 text-right font-sans">
                            <button
                              onClick={() => setActiveStepIndex(s.idx)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                isActive
                                  ? 'bg-emerald-800 text-white'
                                  : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                              }`}
                            >
                              {isActive ? 'Active' : 'Focus'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Diagnostic Wavelength Inspector Cards */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>Key Diagnostic Wavelengths for this Environmental Condition:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {currentScenario.keyWavelengthsToWatch.map((item, idx) => {
                const isSelected = highlightedWl === item.wl;
                const simVal = simResult.canopyReflectance[simResult.wavelengths.indexOf(item.wl)] || 0;
                const obsVal = interpolateReflectance(observedDataset.dataPoints, item.wl);
                const delta = Math.abs(simVal - obsVal);

                return (
                  <div
                    key={idx}
                    onClick={() => setHighlightedWl(item.wl)}
                    className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-stone-50/60 hover:bg-stone-100 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-blue-900">{item.name} ({item.wl} nm)</span>
                      <span className="text-[10px] text-stone-500 uppercase">{item.opticalDomain}</span>
                    </div>
                    <div className="text-[11px] text-stone-600 mt-1 leading-snug">
                      {item.diagnosticRelevance}
                    </div>
                    <div className="mt-1.5 pt-1 border-t border-stone-200/70 font-mono text-[10px] flex items-center justify-between text-stone-600">
                      <span>Sim: {simVal.toFixed(3)} | Obs: {obsVal.toFixed(3)}</span>
                      <span
                        className={`font-bold ${
                          delta < 0.03 ? 'text-emerald-700' : delta < 0.08 ? 'text-amber-700' : 'text-rose-700'
                        }`}
                      >
                        Δ = {delta.toFixed(3)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Goodness-of-Fit Metrics, Indices & Physics Interpretation */}
        <div className="lg:col-span-4 space-y-4">
          {/* Comparison Metrics Scoreboard */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center space-x-1.5">
                <BarChart2 className="w-4 h-4 text-purple-700" />
                <span>Goodness-of-Fit Diagnostics</span>
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  comparisonMetrics.rmse < 0.035
                    ? 'bg-emerald-100 text-emerald-800'
                    : comparisonMetrics.rmse < 0.075
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {comparisonMetrics.rmse < 0.035
                  ? 'Excellent Agreement'
                  : comparisonMetrics.rmse < 0.075
                  ? 'Moderate Agreement'
                  : 'Divergent Condition'}
              </span>
            </div>

            {/* Primary Statistical Metrics */}
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider font-sans block">
                  RMSE (Root Mean Sq)
                </span>
                <span className="text-base font-bold text-stone-900">
                  {comparisonMetrics.rmse.toFixed(4)}
                </span>
                <span className="text-[10px] text-stone-400 block font-sans">
                  Target &lt; 0.030
                </span>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider font-sans block">
                  SAM (Spectral Angle)
                </span>
                <span className="text-base font-bold text-purple-900">
                  {comparisonMetrics.samDegrees.toFixed(2)}°
                </span>
                <span className="text-[10px] text-stone-400 block font-sans">
                  Target &lt; 3.5°
                </span>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider font-sans block">
                  R² (Correlation)
                </span>
                <span className="text-base font-bold text-emerald-800">
                  {comparisonMetrics.r2.toFixed(3)}
                </span>
                <span className="text-[10px] text-stone-400 block font-sans">
                  Goodness of shape
                </span>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider font-sans block">
                  MAE (Mean Absolute)
                </span>
                <span className="text-base font-bold text-stone-800">
                  {comparisonMetrics.mae.toFixed(4)}
                </span>
                <span className="text-[10px] text-stone-400 block font-sans">
                  Average residual
                </span>
              </div>
            </div>

            {/* Vegetation Indices Side-by-Side Comparison */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                Optical Vegetation Indices:
              </span>

              <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-sans font-bold text-emerald-950">NDVI (800 / 680 nm):</span>
                  <div className="space-x-1.5">
                    <span className="text-emerald-800">Sim: {comparisonMetrics.simNdvi.toFixed(3)}</span>
                    <span className="text-stone-400">|</span>
                    <span className="text-purple-800">Obs: {comparisonMetrics.refNdvi.toFixed(3)}</span>
                    <span className="font-bold text-emerald-900">
                      (Δ {comparisonMetrics.deltaNdvi.toFixed(3)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono">
                  <span className="font-sans font-bold text-emerald-950">NDWI (860 / 1240 nm):</span>
                  <div className="space-x-1.5">
                    <span className="text-emerald-800">Sim: {comparisonMetrics.simNdwi.toFixed(3)}</span>
                    <span className="text-stone-400">|</span>
                    <span className="text-purple-800">Obs: {comparisonMetrics.refNdwi.toFixed(3)}</span>
                    <span className="font-bold text-emerald-900">
                      (Δ {comparisonMetrics.deltaNdwi.toFixed(3)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono">
                  <span className="font-sans font-bold text-emerald-950">Red Edge Position (REP):</span>
                  <div className="space-x-1.5">
                    <span className="font-bold text-stone-900">{simResult.indices.rep} nm</span>
                    <span className="text-[10px] text-stone-500 font-sans">
                      ({activeStep.expectedRepRange})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Theoretical Physics Interpretation & Governing Laws */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Biophysical Theory &amp; Governing Equations</span>
            </h4>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 leading-relaxed space-y-1.5">
              <span className="font-bold text-stone-900 block">
                Physical Mechanism Formulation:
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {currentScenario.hypothesizedPhysics}
              </p>
            </div>

            <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-1.5">
              <span className="font-bold text-purple-900 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                <span>Pedagogical Key Takeaway:</span>
              </span>
              <p className="text-[11px] text-purple-900 leading-relaxed">
                {currentScenario.pedagogicalTakeaway}
              </p>
            </div>

            <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-0.5">
              <span className="font-bold text-blue-900 block text-[11px]">
                Satellite Mission Bands Grounding:
              </span>
              <p className="text-[11px] text-blue-800 font-mono">
                {currentScenario.satelliteBands}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
