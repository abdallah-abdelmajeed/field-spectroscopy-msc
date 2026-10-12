/**
 * MSc Practical Laboratory Interactive Pipeline Sandbox & Algorithmic Guide.
 * Provides students with hands-on live spectral data processing execution,
 * noise simulation, detector splice correction, Savitzky-Golay smoothing,
 * continuum removal, and real-world troubleshooting diagnostics.
 */
import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Sparkles,
  Zap,
  Activity,
  Layers,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  RotateCcw,
  BarChart2,
  Workflow
} from 'lucide-react';
import { interpolatePCHIP } from '../utils/spline';
import { REFERENCE_COMPARISON_DATASETS } from '../data/rtmMetadata';

interface PracticalLabSandboxProps {
  moduleNumber: number;
}

export const PracticalLabSandbox: React.FC<PracticalLabSandboxProps> = ({ moduleNumber }) => {
  const [activeTab, setActiveTab] = useState<'interactive' | 'pipeline' | 'troubleshooting'>('interactive');

  // Simulation Controls
  const [targetDatasetId, setTargetDatasetId] = useState<string>('usgs_deciduous_leaf');
  const [scanAverages, setScanAverages] = useState<number>(10);
  const [detectorNoiseScale, setDetectorNoiseScale] = useState<number>(0.02);
  const [filterWindowSize, setFilterWindowSize] = useState<number>(9);
  const [hasSpliceOffset, setHasSpliceOffset] = useState<boolean>(true);
  const [applySpliceCorrection, setApplySpliceCorrection] = useState<boolean>(true);
  const [maskAtmosphere, setMaskAtmosphere] = useState<boolean>(true);
  const [showDerivative, setShowDerivative] = useState<boolean>(false);
  const [showContinuumRemoval, setShowContinuumRemoval] = useState<boolean>(false);

  // Selected reference data
  const baseDataset = useMemo(() => {
    return (
      REFERENCE_COMPARISON_DATASETS.find((d) => d.id === targetDatasetId) ||
      REFERENCE_COMPARISON_DATASETS[0]
    );
  }, [targetDatasetId]);

  // Generate simulated spectral points across 350 - 2500 nm (5 nm step)
  const simulationData = useMemo(() => {
    const minWl = 350;
    const maxWl = 2500;
    const step = 5;
    const count = Math.floor((maxWl - minWl) / step) + 1;

    const wavelengths: number[] = new Array(count);
    const trueReflectance: number[] = new Array(count);
    const noisyRaw: number[] = new Array(count);
    const processed: number[] = new Array(count);

    // Effective noise scaling drops with sqrt(N_scans)
    const effectiveNoise = detectorNoiseScale / Math.sqrt(scanAverages);

    // Pseudorandom repeatable noise seed
    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280 - 0.5;
    };

    for (let i = 0; i < count; i++) {
      const wl = minWl + i * step;
      wavelengths[i] = wl;

      const rClean = interpolatePCHIP(baseDataset.dataPoints, wl);
      trueReflectance[i] = rClean;

      // Noise is higher in UV (350-400 nm) and SWIR-2 (2300-2500 nm) due to lower grating throughput
      const throughputFactor =
        wl < 420 ? 2.5 : wl > 2300 ? 2.2 : wl > 1900 ? 1.4 : 1.0;
      const noise = pseudoRandom() * effectiveNoise * throughputFactor;

      // Splice step artifact: common in 3-detector spectrometers (VNIR 350-1000 nm, SWIR1 1001-1800 nm, SWIR2 1801-2500 nm)
      let spliceJump = 0;
      if (hasSpliceOffset && !applySpliceCorrection) {
        if (wl >= 1000 && wl < 1800) {
          spliceJump = 0.035; // Step jump at 1000 nm
        } else if (wl >= 1800) {
          spliceJump = 0.055; // Step jump at 1800 nm
        }
      }

      // Atmospheric water vapor attenuation noise
      const isWaterOpaque =
        (wl >= 1350 && wl <= 1420) || (wl >= 1810 && wl <= 1940);
      const atmNoise = isWaterOpaque ? pseudoRandom() * 0.15 : 0;

      const rawVal = Math.max(0, rClean + noise + spliceJump + atmNoise);
      noisyRaw[i] = rawVal;
    }

    // Apply Savitzky-Golay / Moving Window Filter to processed curve
    const halfWin = Math.floor(filterWindowSize / 2);
    for (let i = 0; i < count; i++) {
      let sum = 0;
      let weightSum = 0;
      for (let j = -halfWin; j <= halfWin; j++) {
        const idx = Math.min(count - 1, Math.max(0, i + j));
        // Quadratic weight approximation
        const weight = 1 - (j * j) / (halfWin * halfWin + 1);
        sum += noisyRaw[idx] * weight;
        weightSum += weight;
      }
      let smoothed = sum / weightSum;

      // Apply atmospheric mask if enabled
      const wl = wavelengths[i];
      if (maskAtmosphere && ((wl >= 1350 && wl <= 1420) || (wl >= 1810 && wl <= 1940))) {
        smoothed = NaN;
      }
      processed[i] = smoothed;
    }

    // First Derivative calculation (dR/dlambda)
    const derivative: number[] = new Array(count);
    for (let i = 0; i < count; i++) {
      const pNext = processed[Math.min(count - 1, i + 1)];
      const pPrev = processed[Math.max(0, i - 1)];
      if (isNaN(pNext) || isNaN(pPrev)) {
        derivative[i] = NaN;
      } else {
        derivative[i] = (pNext - pPrev) / 10;
      }
    }

    // Continuum Removal (Simplified upper convex hull approximation)
    const continuum: number[] = new Array(count);
    const continuumRemoved: number[] = new Array(count);
    let maxSoFar = 0;
    for (let i = 0; i < count; i++) {
      const val = isNaN(processed[i]) ? 0 : processed[i];
      maxSoFar = Math.max(maxSoFar, val);
      continuum[i] = Math.max(0.01, maxSoFar);
      continuumRemoved[i] = isNaN(processed[i]) ? NaN : processed[i] / continuum[i];
    }

    // Compute key indices
    const getRefl = (targetWl: number) => {
      const idx = Math.min(count - 1, Math.max(0, Math.round((targetWl - minWl) / step)));
      return isNaN(processed[idx]) ? trueReflectance[idx] : processed[idx];
    };

    const r680 = getRefl(680);
    const r800 = getRefl(800);
    const r860 = getRefl(860);
    const r1240 = getRefl(1240);

    const ndvi = (r800 - r680) / Math.max(0.001, r800 + r680);
    const ndwi = (r860 - r1240) / Math.max(0.001, r860 + r1240);

    // Red Edge Position (REP)
    let maxD = -999;
    let rep = 705;
    for (let w = 680; w <= 745; w += 5) {
      const idx = Math.round((w - minWl) / step);
      if (!isNaN(derivative[idx]) && derivative[idx] > maxD) {
        maxD = derivative[idx];
        rep = w;
      }
    }

    // Estimated Signal-to-Noise Ratio (SNR) in NIR
    const snr = Math.round(500 * Math.sqrt(scanAverages) * (1 / (detectorNoiseScale * 50)));

    return {
      wavelengths,
      trueReflectance,
      noisyRaw,
      processed,
      derivative,
      continuumRemoved,
      indices: { ndvi, ndwi, rep, snr }
    };
  }, [
    baseDataset,
    scanAverages,
    detectorNoiseScale,
    filterWindowSize,
    hasSpliceOffset,
    applySpliceCorrection,
    maskAtmosphere
  ]);

  // SVG dimensions
  const svgWidth = 720;
  const svgHeight = 260;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 15;
  const padBottom = 35;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const getX = (wl: number) => padLeft + ((wl - 350) / (2500 - 350)) * chartW;
  const getY = (val: number, maxVal = 1.0) => padTop + (1.0 - Math.min(maxVal, Math.max(0, val)) / maxVal) * chartH;

  // Build SVG paths
  const rawPath = useMemo(() => {
    let p = '';
    let started = false;
    for (let i = 0; i < simulationData.wavelengths.length; i++) {
      const wl = simulationData.wavelengths[i];
      const val = simulationData.noisyRaw[i];
      const x = getX(wl);
      const y = getY(val);
      if (!started) {
        p += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
        started = true;
      } else {
        p += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
    }
    return p;
  }, [simulationData]);

  const processedPath = useMemo(() => {
    let p = '';
    let isDrawing = false;
    for (let i = 0; i < simulationData.wavelengths.length; i++) {
      const wl = simulationData.wavelengths[i];
      const val = showDerivative
        ? simulationData.derivative[i] * 50 + 0.5 // scale derivative to fit
        : showContinuumRemoval
        ? simulationData.continuumRemoved[i]
        : simulationData.processed[i];

      if (isNaN(val)) {
        isDrawing = false;
        continue;
      }
      const x = getX(wl);
      const y = getY(val);
      if (!isDrawing) {
        p += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
        isDrawing = true;
      } else {
        p += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
    }
    return p;
  }, [simulationData, showDerivative, showContinuumRemoval]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-0">
      {/* Sandbox Sub-Header & Navigation Tabs */}
      <div className="px-5 py-3.5 bg-stone-50/80 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
            MSc Advanced Laboratory Companion &amp; Execution Sandbox
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors cursor-pointer ${
              activeTab === 'interactive'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 inline mr-1" />
            <span>Interactive Pipeline Runner</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 inline mr-1" />
            <span>Algorithmic Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors cursor-pointer ${
              activeTab === 'troubleshooting'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
            <span>Diagnostic Troubleshooting</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE PIPELINE RUNNER */}
      {activeTab === 'interactive' && (
        <div className="p-5 space-y-5">
          {/* Top Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
            {/* Target Material Selector */}
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">Input Spectral Target:</label>
              <select
                value={targetDatasetId}
                onChange={(e) => setTargetDatasetId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                {REFERENCE_COMPARISON_DATASETS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Scan Averages Slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-stone-700">
                <span>Scans Averaged (N):</span>
                <span className="font-mono text-emerald-800 font-bold">{scanAverages}</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={scanAverages}
                onChange={(e) => setScanAverages(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <span className="text-[10px] text-stone-500 block">
                SNR scales with √N scans (Noise: ±{(simulationData.indices.snr > 0 ? (1 / simulationData.indices.snr) * 100 : 0).toFixed(2)}%)
              </span>
            </div>

            {/* Savitzky-Golay Smoothing Window */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-stone-700">
                <span>Savitzky-Golay Window:</span>
                <span className="font-mono text-emerald-800 font-bold">{filterWindowSize} pts</span>
              </div>
              <input
                type="range"
                min={3}
                max={25}
                step={2}
                value={filterWindowSize}
                onChange={(e) => setFilterWindowSize(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <span className="text-[10px] text-stone-500 block">
                Preserves narrow absorption shapes while suppressing white noise
              </span>
            </div>

            {/* Splice Step & Corrections Toggles */}
            <div className="space-y-2">
              <span className="font-bold text-stone-700 block">Detector Artifacts:</span>
              <div className="flex flex-col space-y-1 text-[11px]">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSpliceOffset}
                    onChange={(e) => setHasSpliceOffset(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>Simulate 1000/1800 nm Splice Step</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applySpliceCorrection}
                    disabled={!hasSpliceOffset}
                    onChange={(e) => setApplySpliceCorrection(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-500 disabled:opacity-40"
                  />
                  <span className={!hasSpliceOffset ? 'text-stone-400' : 'text-emerald-900 font-semibold'}>
                    Apply Splice Matching Correction
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Visualization Modes & Quick Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-stone-600">Display Transform:</span>
              <button
                onClick={() => {
                  setShowDerivative(false);
                  setShowContinuumRemoval(false);
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  !showDerivative && !showContinuumRemoval
                    ? 'bg-stone-800 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Standard Reflectance
              </button>
              <button
                onClick={() => {
                  setShowDerivative(true);
                  setShowContinuumRemoval(false);
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  showDerivative
                    ? 'bg-purple-800 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                1st Derivative (dR/dλ)
              </button>
              <button
                onClick={() => {
                  setShowContinuumRemoval(true);
                  setShowDerivative(false);
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  showContinuumRemoval
                    ? 'bg-amber-800 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Continuum Removed [0–1]
              </button>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maskAtmosphere}
                  onChange={(e) => setMaskAtmosphere(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-500"
                />
                <span className="text-stone-700 font-medium">Mask Atmospheric Water Bands (1.4 &amp; 1.9 µm)</span>
              </label>
            </div>
          </div>

          {/* Interactive SVG Plot Canvas */}
          <div className="relative bg-stone-900 rounded-xl p-3 border border-stone-800 overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-stone-400 px-2 pb-1 border-b border-stone-800/80">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-0.5 bg-stone-500 inline-block"></span>
                  <span>Raw Noisy Measurement</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-1 bg-emerald-400 inline-block rounded-xs"></span>
                  <span className="text-emerald-300 font-semibold">
                    {showDerivative
                      ? 'Filtered Derivative (dR/dλ)'
                      : showContinuumRemoval
                      ? 'Continuum-Removed Spectrum'
                      : 'Calibrated & Splice-Corrected Spectrum'}
                  </span>
                </span>
              </div>
              <span className="font-mono text-stone-400">Range: 350 – 2500 nm</span>
            </div>

            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto select-none"
              style={{ maxHeight: '280px' }}
            >
              {/* Atmospheric Water Vapor Bands Background Shading */}
              <rect
                x={getX(1350)}
                y={padTop}
                width={getX(1420) - getX(1350)}
                height={chartH}
                fill="#38bdf8"
                opacity="0.12"
              />
              <text
                x={getX(1385)}
                y={padTop + 14}
                fill="#7dd3fc"
                fontSize="9"
                textAnchor="middle"
                fontFamily="monospace"
              >
                H₂O Band
              </text>

              <rect
                x={getX(1810)}
                y={padTop}
                width={getX(1940) - getX(1810)}
                height={chartH}
                fill="#38bdf8"
                opacity="0.12"
              />
              <text
                x={getX(1875)}
                y={padTop + 14}
                fill="#7dd3fc"
                fontSize="9"
                textAnchor="middle"
                fontFamily="monospace"
              >
                H₂O Band
              </text>

              {/* Grid Lines */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
                <g key={v}>
                  <line
                    x1={padLeft}
                    y1={getY(v)}
                    x2={svgWidth - padRight}
                    y2={getY(v)}
                    stroke="#334155"
                    strokeWidth="0.8"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padLeft - 6}
                    y={getY(v) + 3}
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {v.toFixed(1)}
                  </text>
                </g>
              ))}

              {[500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500].map((wl) => (
                <g key={wl}>
                  <line
                    x1={getX(wl)}
                    y1={padTop}
                    x2={getX(wl)}
                    y2={svgHeight - padBottom}
                    stroke="#334155"
                    strokeWidth="0.8"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={getX(wl)}
                    y={svgHeight - padBottom + 14}
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {wl}
                  </text>
                </g>
              ))}

              {/* Raw Noisy Path */}
              {!showDerivative && !showContinuumRemoval && (
                <path
                  d={rawPath}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="1.0"
                  opacity="0.75"
                />
              )}

              {/* Processed / Smoothed Spectrum Path */}
              <path
                d={processedPath}
                fill="none"
                stroke={
                  showDerivative
                    ? '#c084fc'
                    : showContinuumRemoval
                    ? '#fbbf24'
                    : '#34d399'
                }
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Axis Labels */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 6}
                fill="#cbd5e1"
                fontSize="10"
                textAnchor="middle"
                fontWeight="bold"
              >
                Wavelength (nm)
              </text>
              <text
                x={12}
                y={svgHeight / 2}
                fill="#cbd5e1"
                fontSize="10"
                textAnchor="middle"
                fontWeight="bold"
                transform={`rotate(-90 12 ${svgHeight / 2})`}
              >
                {showDerivative
                  ? 'First Derivative (Scaled)'
                  : showContinuumRemoval
                  ? 'Continuum-Removed Refl'
                  : 'Reflectance Factor (HDRF)'}
              </text>
            </svg>
          </div>

          {/* Scientific Metrics HUD Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-center">
              <span className="text-[11px] font-bold text-emerald-900 block uppercase tracking-wider">
                Normalized Difference (NDVI)
              </span>
              <span className="text-lg font-mono font-bold text-emerald-800">
                {simulationData.indices.ndvi.toFixed(3)}
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                (R800 - R680) / (R800 + R680)
              </span>
            </div>

            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-center">
              <span className="text-[11px] font-bold text-blue-900 block uppercase tracking-wider">
                Water Index (NDWI)
              </span>
              <span className="text-lg font-mono font-bold text-blue-800">
                {simulationData.indices.ndwi.toFixed(3)}
              </span>
              <span className="text-[10px] text-blue-700 block mt-0.5">
                (R860 - R1240) / (R860 + R1240)
              </span>
            </div>

            <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-200 text-center">
              <span className="text-[11px] font-bold text-purple-900 block uppercase tracking-wider">
                Red Edge Position (REP)
              </span>
              <span className="text-lg font-mono font-bold text-purple-800">
                {simulationData.indices.rep} nm
              </span>
              <span className="text-[10px] text-purple-700 block mt-0.5">
                Max First Derivative Inflection
              </span>
            </div>

            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-center">
              <span className="text-[11px] font-bold text-amber-900 block uppercase tracking-wider">
                Est. Sensor SNR (NIR)
              </span>
              <span className="text-lg font-mono font-bold text-amber-800">
                {simulationData.indices.snr} : 1
              </span>
              <span className="text-[10px] text-amber-700 block mt-0.5">
                Exceeds Lab Standard (&gt; 300:1)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALGORITHMIC ARCHITECTURE PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="p-6 space-y-6 text-xs text-stone-800">
          <div className="border-b border-stone-200 pb-3">
            <h3 className="text-sm font-bold text-stone-900">
              The 5-Stage Scientific Data Reduction Pipeline in Field Spectroscopy
            </h3>
            <p className="text-stone-600 mt-1">
              Every field spectrometer measurement must progress through these mathematical stages
              before being utilized in radiative transfer model inversion, machine learning, or satellite validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Stage 1 */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Dark Current Correction</span>
              </div>
              <div className="font-mono bg-white p-2 rounded border border-stone-200 text-[11px] text-stone-900 font-semibold">
                S_net(λ) = DN_tgt(λ) - DN_dark(λ)
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Thermal electron accumulation in the photodiode array generates digital numbers even without incident light.
                Dark current must be recorded at identical integration time and subtracted.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>White Reference Ratio</span>
              </div>
              <div className="font-mono bg-white p-2 rounded border border-stone-200 text-[11px] text-stone-900 font-semibold">
                R(λ) = [S_tgt(λ) / S_WR(λ)] · R_panel(λ)
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Converts raw digital numbers to physical reflectance by normalizing against a calibrated 99% diffuse PTFE Spectralon panel.
                Compensates for absolute solar spectral irradiance variations.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Detector Splice Correction</span>
              </div>
              <div className="font-mono bg-white p-2 rounded border border-stone-200 text-[11px] text-stone-900 font-semibold">
                k_step = R_VNIR(1000) / R_SWIR1(1000)
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Multi-detector instruments (Si photodiode VNIR, InGaAs SWIR-1, and extended InGaAs SWIR-2) have discrete optical fibers and temperature gradients,
                requiring boundary parabolic splice matching.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">
                  4
                </span>
                <span>Atmospheric Masking</span>
              </div>
              <div className="font-mono bg-white p-2 rounded border border-stone-200 text-[11px] text-stone-900 font-semibold">
                Mask: [1.35–1.42 µm], [1.81–1.94 µm]
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Total atmospheric column water vapor (CWV) renders the 1.4 µm and 1.9 µm absorption bands nearly opaque (transmittance ~ 0).
                Signal-to-noise approaches 0, producing extreme, unphysical noise spikes that must be filtered out.
              </p>
            </div>

            {/* Stage 5 */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">
                  5
                </span>
                <span>Feature Extraction</span>
              </div>
              <div className="font-mono bg-white p-2 rounded border border-stone-200 text-[11px] text-stone-900 font-semibold">
                R_cr(λ) = R(λ) / C(λ)
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Savitzky-Golay numerical derivatives isolate the Red Edge inflection point, while convex hull continuum removal isolates biochemical absorption depths
                (chlorophyll, lignin, cellulose, carotenoids, and water).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIAGNOSTIC TROUBLESHOOTING GUIDE */}
      {activeTab === 'troubleshooting' && (
        <div className="p-6 space-y-4 text-xs">
          <div className="border-b border-stone-200 pb-3">
            <h3 className="text-sm font-bold text-stone-900">
              MSc Diagnostic Troubleshooting Guide: Field &amp; Lab Pitfalls
            </h3>
            <p className="text-stone-600 mt-1">
              Common measurement defects encountered by research teams during ground-truthing campaigns and their rigorous scientific solutions.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 space-y-1.5">
              <div className="flex items-center space-x-2 text-rose-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                <span>Defect 1: Reflectance Exceeds 1.0 (100%) in Blue Wavelengths (350–450 nm)</span>
              </div>
              <p className="text-rose-950 leading-relaxed">
                <strong>Physical Mechanism:</strong> Stray diffuse sky blue light (Rayleigh scattering) illuminating the target when the operator cast a partial shadow on the white reference panel, or rapid solar irradiance change due to sub-visual cirrus clouds between White Reference and Target acquisition.
              </p>
              <div className="text-[11px] text-rose-800 bg-white/70 p-2 rounded border border-rose-200 font-medium">
                ✓ <strong>Corrective Protocol:</strong> Retake White Reference immediately. Ensure the operator stands opposite the solar azimuth to eliminate casting secondary diffuse shadows on the Spectralon panel.
              </div>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1.5">
              <div className="flex items-center space-x-2 text-amber-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Defect 2: Discontinuous Vertical Steps at 1000 nm and 1800 nm</span>
              </div>
              <p className="text-amber-950 leading-relaxed">
                <strong>Physical Mechanism:</strong> Temperature differential between the cooled InGaAs SWIR spectrometer modules (-10°C to -25°C) and the ambient Si photodiode array, or fiber bundle non-uniform illumination where VNIR and SWIR optical channels sample slightly different sub-angles within the pistol grip FOV.
              </p>
              <div className="text-[11px] text-amber-800 bg-white/70 p-2 rounded border border-amber-200 font-medium">
                ✓ <strong>Corrective Protocol:</strong> Apply splice matching in post-processing (e.g. `specdal.splice_correct()` or `hsdar::stitch()`), and allow the spectrometer at least 20–30 minutes of warm-up before field data logging.
              </div>
            </div>

            <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1.5">
              <div className="flex items-center space-x-2 text-blue-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-blue-700" />
                <span>Defect 3: Severe High-Frequency Noise in SWIR-2 (2100–2500 nm)</span>
              </div>
              <p className="text-blue-950 leading-relaxed">
                <strong>Physical Mechanism:</strong> Solar elevation angle is too low (Solar Zenith Angle θs &gt; 60°), where direct shortwave solar photons undergo excessive atmospheric path attenuation, coupled with low integration time and too few scan averages.
              </p>
              <div className="text-[11px] text-blue-800 bg-white/70 p-2 rounded border border-blue-200 font-medium">
                ✓ <strong>Corrective Protocol:</strong> Restrict quantitative environmental field spectroscopy to within ±2.5 hours of local solar noon (θs &lt; 50°). Increase integration time and scan averaging from 10 to 30–50 scans.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
