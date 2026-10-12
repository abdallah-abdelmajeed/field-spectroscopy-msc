import React, { useState, useMemo, useCallback } from 'react';
import {
  SlidersHorizontal,
  Gauge,
  Thermometer,
  Clock,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Camera,
  Eye,
  Info,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Activity,
  Zap,
  HelpCircle
} from 'lucide-react';
import { MathRenderer } from './MathRenderer';

// Predefined target surface types with realistic spectral reflectance profiles (350 to 2500 nm, sampled every 10 nm)
interface TargetProfile {
  id: string;
  name: string;
  category: string;
  description: string;
  baseReflectance: (wl: number) => number;
}

const WAVELENGTHS: number[] = [];
for (let wl = 350; wl <= 2500; wl += 10) {
  WAVELENGTHS.push(wl);
}

// Atmospheric transmittance approximation with deep water vapor bands at 1350-1450 nm & 1800-1950 nm
function getAtmosphericTransmission(wl: number): number {
  if (wl >= 1350 && wl <= 1450) {
    const dist = Math.abs(wl - 1400);
    return Math.max(0.01, (dist / 50) * 0.15);
  }
  if (wl >= 1800 && wl <= 1950) {
    const dist = Math.abs(wl - 1875);
    return Math.max(0.01, (dist / 75) * 0.12);
  }
  if (wl < 400) return 0.65 + 0.3 * ((wl - 350) / 50);
  if (wl > 2400) return Math.max(0.1, 1.0 - ((wl - 2400) / 100) * 0.7);
  return 0.92;
}

// Relative extraterrestrial solar irradiance shape (peaks in blue-green ~500 nm, falls off in SWIR)
function getSolarIrradianceFactor(wl: number): number {
  const peak = 500;
  if (wl < peak) {
    return 0.5 + 0.5 * ((wl - 350) / 150);
  } else {
    return Math.max(0.12, Math.exp(-0.0011 * (wl - peak)));
  }
}

// Target Profiles
const TARGET_PROFILES: TargetProfile[] = [
  {
    id: 'vegetation',
    name: 'Green Vegetation Canopy',
    category: 'Canopy Ecology',
    description: 'Chlorophyll absorption at 450 & 680 nm, steep red edge (700–750 nm), NIR mesophyll plateau (~0.45), and water absorption dips at 970, 1200, 1450, 1950 nm.',
    baseReflectance: (wl: number) => {
      if (wl < 500) return 0.04 + 0.02 * ((wl - 350) / 150);
      if (wl < 550) return 0.06 + 0.06 * ((wl - 500) / 50); // Green peak ~0.12
      if (wl < 670) return 0.12 - 0.07 * ((wl - 550) / 120); // Chlorophyll dip ~0.05
      if (wl < 750) return 0.05 + 0.42 * Math.pow((wl - 670) / 80, 2); // Red edge jump to ~0.47
      if (wl < 1300) {
        // NIR plateau with subtle 970 & 1200 nm liquid water dips
        let r = 0.48;
        if (wl >= 940 && wl <= 1000) r -= 0.05 * (1 - Math.abs(wl - 970) / 30);
        if (wl >= 1160 && wl <= 1240) r -= 0.08 * (1 - Math.abs(wl - 1200) / 40);
        return Math.max(0.35, r);
      }
      if (wl < 1800) {
        // SWIR-1 water absorption zone
        let r = 0.28;
        if (wl >= 1400 && wl <= 1500) r -= 0.18 * (1 - Math.abs(wl - 1450) / 50);
        return Math.max(0.08, r);
      }
      // SWIR-2
      let r = 0.16;
      if (wl >= 1900 && wl <= 2000) r -= 0.12 * (1 - Math.abs(wl - 1950) / 50);
      return Math.max(0.04, r);
    }
  },
  {
    id: 'spectralon',
    name: '99% Spectralon Reference Panel',
    category: 'Optical Calibration',
    description: 'Sintered PTFE diffuse standard panel with flat ~99% hemispherical reflectance across VNIR and ~98.5% across SWIR.',
    baseReflectance: (wl: number) => {
      if (wl < 400) return 0.985 + 0.005 * ((wl - 350) / 50);
      if (wl > 2100) return 0.99 - 0.01 * ((wl - 2100) / 400);
      return 0.991;
    }
  },
  {
    id: 'kaolinite',
    name: 'Kaolinite Clay Mineral',
    category: 'Mineralogy & Geology',
    description: 'High overall brightness (~0.65–0.75) with characteristic diagnostic Al-OH doublet absorption at 2162 nm and 2208 nm.',
    baseReflectance: (wl: number) => {
      let r = 0.45 + 0.3 * Math.min(1, (wl - 350) / 650);
      // Hydroxyl doublet at 1412 nm
      if (wl >= 1390 && wl <= 1430) r -= 0.22 * (1 - Math.abs(wl - 1412) / 20);
      // Diagnostic doublet at 2162 nm & 2208 nm
      if (wl >= 2145 && wl <= 2175) r -= 0.25 * (1 - Math.abs(wl - 2162) / 17);
      if (wl >= 2195 && wl <= 2225) r -= 0.28 * (1 - Math.abs(wl - 2208) / 15);
      return Math.max(0.15, Math.min(0.85, r));
    }
  },
  {
    id: 'soil',
    name: 'Dry Agricultural Loam Soil',
    category: 'Pedology & Soil',
    description: 'Smooth monotonic spectral curve with ferric iron absorption slope below 550 nm and moderate clay hydration features.',
    baseReflectance: (wl: number) => {
      if (wl < 600) return 0.1 + 0.12 * Math.pow((wl - 350) / 250, 1.5);
      if (wl < 1400) return 0.22 + 0.15 * ((wl - 600) / 800);
      let r = 0.37 + 0.04 * ((wl - 1400) / 1100);
      if (wl >= 2180 && wl <= 2230) r -= 0.06 * (1 - Math.abs(wl - 2205) / 25);
      return Math.max(0.08, r);
    }
  },
  {
    id: 'water',
    name: 'Clear Open Water Surface',
    category: 'Hydrology & Aquatic',
    description: 'Moderate scattering in blue-green (0.04–0.06) dropping to near-zero reflectance beyond 700 nm due to liquid water absorption.',
    baseReflectance: (wl: number) => {
      if (wl < 450) return 0.045;
      if (wl < 560) return 0.055;
      if (wl < 700) return 0.055 - 0.045 * ((wl - 560) / 140);
      return 0.006;
    }
  }
];

export const SensorCalibrationSimulator: React.FC<{ className?: string }> = ({ className = '' }) => {
  // Simulator State Parameters
  const [selectedTargetId, setSelectedTargetId] = useState<string>('vegetation');
  const [integrationTimeMs, setIntegrationTimeMs] = useState<number>(18); // 4 to 120 ms
  const [detectorTempC, setDetectorTempC] = useState<number>(22); // -15 to +45 deg C
  const [readoutNoiseRms, setReadoutNoiseRms] = useState<number>(28); // 5 to 100 DN
  const [baseDarkCurrent, setBaseDarkCurrent] = useState<number>(1800); // 500 to 8000 DN
  const [scansAveraged, setScansAveraged] = useState<number>(15); // 1 to 100
  const [darkCurrentSubtraction, setDarkCurrentSubtraction] = useState<boolean>(true);
  const [showAtmosphericBands, setShowAtmosphericBands] = useState<boolean>(true);
  const [displayMode, setDisplayMode] = useState<'reflectance' | 'raw_dn' | 'snr'>('reflectance');

  // Calibration Memory States
  const [hasAcquiredDark, setHasAcquiredDark] = useState<boolean>(true);
  const [hasAcquiredWhite, setHasAcquiredWhite] = useState<boolean>(true);
  const [isShutterClosing, setIsShutterClosing] = useState<boolean>(false);
  const [lastCalibratedTemp, setLastCalibratedTemp] = useState<number>(22);

  const activeTarget = useMemo(() => {
    return TARGET_PROFILES.find(t => t.id === selectedTargetId) || TARGET_PROFILES[0];
  }, [selectedTargetId]);

  // Optical gain constant for 16-bit ADC (65,535 DN max)
  const OPTICAL_GAIN = 2900;

  // Temperature dependence factor for dark current: increases ~7% per degree Celsius above 20°C
  const tempDriftFactor = useMemo(() => {
    const deltaT = detectorTempC - 20;
    return Math.max(0.2, Math.pow(1.07, deltaT));
  }, [detectorTempC]);

  // Dark current calculation
  const darkCurrentProfile = useMemo(() => {
    return WAVELENGTHS.map((wl, idx) => {
      // Base dark increases with integration time and temperature
      // SWIR detectors (>1000 nm InGaAs) typically have higher dark current than Silicon VNIR
      const detectorMultiplier = wl > 1000 ? 1.45 : 1.0;
      const pixelFpn = Math.sin(idx * 0.7) * 45; // Fixed pattern noise
      const dn =
        baseDarkCurrent * tempDriftFactor * (integrationTimeMs / 15) * detectorMultiplier + pixelFpn;
      return Math.max(200, Math.min(45000, dn));
    });
  }, [baseDarkCurrent, tempDriftFactor, integrationTimeMs]);

  // Calibrated reference white panel DN (Spectralon)
  const whiteRefDN = useMemo(() => {
    const spectralonTarget = TARGET_PROFILES.find(t => t.id === 'spectralon')!;
    return WAVELENGTHS.map((wl, idx) => {
      const atmo = getAtmosphericTransmission(wl);
      const solar = getSolarIrradianceFactor(wl);
      const refl = spectralonTarget.baseReflectance(wl);
      const dark = darkCurrentProfile[idx];

      const photoDN = refl * atmo * solar * (integrationTimeMs / 10) * OPTICAL_GAIN;
      const totalDN = photoDN + dark;
      return Math.min(65535, Math.max(0, totalDN));
    });
  }, [darkCurrentProfile, integrationTimeMs]);

  // Target measurement simulation
  const simulationResults = useMemo(() => {
    let peakDN = 0;
    let saturatedCount = 0;
    let sumVnirSNR = 0;
    let countVnir = 0;
    let sumSwirSNR = 0;
    let countSwir = 0;

    const data = WAVELENGTHS.map((wl, idx) => {
      const trueRefl = activeTarget.baseReflectance(wl);
      const atmo = getAtmosphericTransmission(wl);
      const solar = getSolarIrradianceFactor(wl);
      const dark = darkCurrentProfile[idx];

      // True photo-signal before noise
      const photoSignalDN = trueRefl * atmo * solar * (integrationTimeMs / 10) * OPTICAL_GAIN;
      const totalRawDN = photoSignalDN + dark;

      if (totalRawDN > peakDN) peakDN = totalRawDN;
      if (totalRawDN >= 65535) saturatedCount++;

      // Noise components (in DN RMS)
      const shotNoise = Math.sqrt(Math.max(1, photoSignalDN));
      const darkShotNoise = Math.sqrt(Math.max(1, dark));
      const singleScanNoise = Math.sqrt(
        shotNoise * shotNoise + darkShotNoise * darkShotNoise + readoutNoiseRms * readoutNoiseRms
      );
      // Noise reduction via N averaged scans: sigma / sqrt(N)
      const effectiveNoise = singleScanNoise / Math.sqrt(scansAveraged);

      // Add pseudo-random noise realization
      const noiseSeed = Math.sin(idx * 1337.7) * Math.cos(wl * 0.12);
      const simulatedRawDN = Math.min(65535, Math.max(0, totalRawDN + noiseSeed * effectiveNoise));

      // White panel with noise
      const whitePanelNoise = effectiveNoise * 1.2;
      const simulatedWhiteDN = Math.min(65535, Math.max(10, whiteRefDN[idx] + noiseSeed * 0.5 * whitePanelNoise));

      // Calculated Reflectance:
      // If dark subtraction is ON: (Raw - Dark) / (White - Dark)
      // If dark subtraction is OFF: Raw / White (creates severe baseline distortion!)
      let calcReflectance = 0;
      if (darkCurrentSubtraction) {
        const netSignal = Math.max(0, simulatedRawDN - dark);
        const netWhite = Math.max(1, simulatedWhiteDN - dark);
        calcReflectance = (netSignal / netWhite) * 0.99;
      } else {
        // Uncorrected dark current bias!
        calcReflectance = (simulatedRawDN / simulatedWhiteDN) * 0.99;
      }

      // Estimate SNR(λ) = PhotoSignal / EffectiveNoise
      const snr = photoSignalDN > 0 && effectiveNoise > 0 ? photoSignalDN / effectiveNoise : 1;

      if (wl >= 400 && wl <= 1000) {
        sumVnirSNR += snr;
        countVnir++;
      } else if (wl >= 1000 && wl <= 2400) {
        sumSwirSNR += snr;
        countSwir++;
      }

      return {
        wl,
        trueRefl,
        calcReflectance: Math.max(0, Math.min(1.5, calcReflectance)),
        rawDN: simulatedRawDN,
        whiteDN: simulatedWhiteDN,
        darkDN: dark,
        snr: Math.round(snr),
        effectiveNoise
      };
    });

    const avgVnirSNR = countVnir > 0 ? Math.round(sumVnirSNR / countVnir) : 0;
    const avgSwirSNR = countSwir > 0 ? Math.round(sumSwirSNR / countSwir) : 0;
    const maxWhiteDN = Math.max(...whiteRefDN);
    const dynamicRangePct = Math.round((maxWhiteDN / 65535) * 100);

    return {
      spectra: data,
      peakDN: Math.round(peakDN),
      maxWhiteDN: Math.round(maxWhiteDN),
      dynamicRangePct,
      isSaturated: maxWhiteDN >= 65530 || peakDN >= 65530,
      isUnderexposed: dynamicRangePct < 25,
      avgVnirSNR,
      avgSwirSNR,
      tempDriftDelta: Math.abs(detectorTempC - lastCalibratedTemp)
    };
  }, [
    activeTarget,
    darkCurrentProfile,
    whiteRefDN,
    integrationTimeMs,
    readoutNoiseRms,
    scansAveraged,
    darkCurrentSubtraction,
    detectorTempC,
    lastCalibratedTemp
  ]);

  // Auto-optimize integration time handler: target 85% dynamic range on Spectralon white reference
  const handleAutoOptimize = useCallback(() => {
    // We want maxWhiteDN ~ 55,000 DN
    // maxWhiteDN ~ (0.99 * 0.92 * 1.0 * (t_int / 10) * OPTICAL_GAIN) + dark
    const targetNetDN = 50000;
    const currentNetDN = (simulationResults.maxWhiteDN - baseDarkCurrent);
    if (currentNetDN > 100) {
      const scale = targetNetDN / currentNetDN;
      const newTime = Math.min(120, Math.max(5, Math.round(integrationTimeMs * scale)));
      setIntegrationTimeMs(newTime);
    } else {
      setIntegrationTimeMs(22);
    }
  }, [simulationResults.maxWhiteDN, baseDarkCurrent, integrationTimeMs]);

  // Acquire Dark Frame Handler
  const handleAcquireDark = () => {
    setIsShutterClosing(true);
    setTimeout(() => {
      setIsShutterClosing(false);
      setHasAcquiredDark(true);
      setLastCalibratedTemp(detectorTempC);
    }, 600);
  };

  // Educational Preset Loaders
  const loadPreset = (preset: 'optimal' | 'hot_uncooled' | 'noisy_underexposed' | 'saturated' | 'cryo') => {
    if (preset === 'optimal') {
      setIntegrationTimeMs(18);
      setDetectorTempC(20);
      setReadoutNoiseRms(20);
      setBaseDarkCurrent(1500);
      setScansAveraged(20);
      setDarkCurrentSubtraction(true);
      setLastCalibratedTemp(20);
    } else if (preset === 'hot_uncooled') {
      // Overheated in field, dark current not subtracted!
      setIntegrationTimeMs(28);
      setDetectorTempC(42);
      setReadoutNoiseRms(55);
      setBaseDarkCurrent(4500);
      setScansAveraged(3);
      setDarkCurrentSubtraction(false); // Common mistake!
      setLastCalibratedTemp(20);
    } else if (preset === 'noisy_underexposed') {
      setIntegrationTimeMs(4);
      setDetectorTempC(24);
      setReadoutNoiseRms(75);
      setBaseDarkCurrent(1200);
      setScansAveraged(1);
      setDarkCurrentSubtraction(true);
      setLastCalibratedTemp(24);
    } else if (preset === 'saturated') {
      setIntegrationTimeMs(95);
      setDetectorTempC(25);
      setReadoutNoiseRms(30);
      setBaseDarkCurrent(2000);
      setScansAveraged(15);
      setDarkCurrentSubtraction(true);
      setLastCalibratedTemp(25);
    } else if (preset === 'cryo') {
      setIntegrationTimeMs(22);
      setDetectorTempC(-10);
      setReadoutNoiseRms(10);
      setBaseDarkCurrent(600);
      setScansAveraged(50);
      setDarkCurrentSubtraction(true);
      setLastCalibratedTemp(-10);
    }
  };

  // SVG Dimension Math for responsive interactive plotting
  const svgWidth = 850;
  const svgHeight = 360;
  const margin = { top: 30, right: 35, bottom: 45, left: 65 };
  const plotWidth = svgWidth - margin.left - margin.right;
  const plotHeight = svgHeight - margin.top - margin.bottom;

  const wlMin = 350;
  const wlMax = 2500;
  const scaleX = (wl: number) => margin.left + ((wl - wlMin) / (wlMax - wlMin)) * plotWidth;

  // Render SVG plot path based on displayMode
  const { pathD, referencePathD, darkPathD, whitePathD, yMin, yMax, yAxisLabel } = useMemo(() => {
    if (displayMode === 'reflectance') {
      const y0 = 0.0;
      const y1 = 1.1;
      const scaleY = (val: number) => margin.top + plotHeight - ((val - y0) / (y1 - y0)) * plotHeight;

      let d = '';
      let refD = '';
      simulationResults.spectra.forEach((pt, i) => {
        const x = scaleX(pt.wl);
        const y = scaleY(pt.calcReflectance);
        const refY = scaleY(pt.trueRefl);
        if (i === 0) {
          d += `M ${x} ${y}`;
          refD += `M ${x} ${refY}`;
        } else {
          d += ` L ${x} ${y}`;
          refD += ` L ${x} ${refY}`;
        }
      });
      return {
        pathD: d,
        referencePathD: refD,
        darkPathD: '',
        whitePathD: '',
        yMin: y0,
        yMax: y1,
        yAxisLabel: 'Reflectance Factor (ρ)'
      };
    } else if (displayMode === 'raw_dn') {
      const y0 = 0;
      const y1 = 70000;
      const scaleY = (val: number) => margin.top + plotHeight - ((val - y0) / (y1 - y0)) * plotHeight;

      let targetD = '';
      let whiteD = '';
      let darkD = '';
      simulationResults.spectra.forEach((pt, i) => {
        const x = scaleX(pt.wl);
        const yTarget = scaleY(pt.rawDN);
        const yWhite = scaleY(pt.whiteDN);
        const yDark = scaleY(pt.darkDN);
        if (i === 0) {
          targetD += `M ${x} ${yTarget}`;
          whiteD += `M ${x} ${yWhite}`;
          darkD += `M ${x} ${yDark}`;
        } else {
          targetD += ` L ${x} ${yTarget}`;
          whiteD += ` L ${x} ${yWhite}`;
          darkD += ` L ${x} ${yDark}`;
        }
      });
      return {
        pathD: targetD,
        referencePathD: '',
        darkPathD: darkD,
        whitePathD: whiteD,
        yMin: y0,
        yMax: y1,
        yAxisLabel: 'Raw 16-bit Detector Signal (DN)'
      };
    } else {
      // SNR Mode
      const y0 = 0;
      const y1 = 800;
      const scaleY = (val: number) => margin.top + plotHeight - (Math.min(y1, val) / y1) * plotHeight;

      let d = '';
      simulationResults.spectra.forEach((pt, i) => {
        const x = scaleX(pt.wl);
        const y = scaleY(pt.snr);
        if (i === 0) {
          d += `M ${x} ${y}`;
        } else {
          d += ` L ${x} ${y}`;
        }
      });
      return {
        pathD: d,
        referencePathD: '',
        darkPathD: '',
        whitePathD: '',
        yMin: y0,
        yMax: y1,
        yAxisLabel: 'Signal-to-Noise Ratio (SNR : 1)'
      };
    }
  }, [displayMode, simulationResults.spectra]);

  return (
    <div id="sensor-calibration-simulator" className={`space-y-6 ${className}`}>
      {/* Top Banner & Calibration Status */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200">
                Interactive Instrumentation Lab
              </span>
              <span className="text-xs font-mono text-stone-500">
                ASD FieldSpec 4 / SVC GER Model
              </span>
            </div>
            <h3 className="text-2xl font-black text-stone-900 tracking-tight flex items-center space-x-2">
              <Gauge className="w-6 h-6 text-purple-700" />
              <span>Field Spectrometer Sensor Calibration &amp; Noise Simulator</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
              Experience the physical realities of field spectrometry: manipulate photodiode integration time, thermal dark current generation, readout noise, and scan averaging to understand sensor saturation, SNR degradation, and the vital role of calibration standards.
            </p>
          </div>

          {/* Quick Presets Dropdown/Pills */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mr-1">
              Field Presets:
            </span>
            <button
              onClick={() => loadPreset('optimal')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-colors cursor-pointer border border-emerald-300"
              title="Calibrated ASD FieldSpec standard"
            >
              Standard Calibrated
            </button>
            <button
              onClick={() => loadPreset('hot_uncooled')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors cursor-pointer border border-amber-300"
              title="Severe 42°C heat drift without dark subtraction"
            >
              Heat Drift (Uncorrected)
            </button>
            <button
              onClick={() => loadPreset('noisy_underexposed')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer border border-stone-300"
              title="Fast 4ms scan with high electronic noise"
            >
              Underexposed Fast Scan
            </button>
            <button
              onClick={() => loadPreset('saturated')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-100 hover:bg-red-200 text-red-900 transition-colors cursor-pointer border border-red-300"
              title="Excessive exposure saturating ADC ceiling"
            >
              Over-integrated (Clipped)
            </button>
          </div>
        </div>

        {/* Live Telemetry Health Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs">
          {/* Dynamic Range Status */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            simulationResults.isSaturated
              ? 'bg-red-50 border-red-200 text-red-950'
              : simulationResults.isUnderexposed
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Peak White Reference
              </span>
              <span className="text-base font-black">
                {simulationResults.dynamicRangePct}% ({simulationResults.maxWhiteDN.toLocaleString()} DN)
              </span>
            </div>
            {simulationResults.isSaturated ? (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            ) : simulationResults.isUnderexposed ? (
              <Info className="w-5 h-5 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
          </div>

          {/* VNIR Average SNR */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Mean VNIR SNR (400–1000 nm)
              </span>
              <span className="text-base font-black text-purple-900">
                {simulationResults.avgVnirSNR} : 1
              </span>
            </div>
            <TrendingUp className="w-5 h-5 text-purple-600 shrink-0" />
          </div>

          {/* SWIR Average SNR */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Mean SWIR SNR (1000–2400 nm)
              </span>
              <span className="text-base font-black text-purple-900">
                {simulationResults.avgSwirSNR} : 1
              </span>
            </div>
            <Activity className="w-5 h-5 text-purple-600 shrink-0" />
          </div>

          {/* Dark Current Baseline */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            simulationResults.tempDriftDelta > 5
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-stone-50 border-stone-200 text-stone-900'
          }`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Thermal Drift State
              </span>
              <span className="text-base font-black">
                {simulationResults.tempDriftDelta > 0 ? `+${simulationResults.tempDriftDelta}°C Drift` : 'Stable / Locked'}
              </span>
            </div>
            <Thermometer className="w-5 h-5 text-amber-600 shrink-0" />
          </div>
        </div>
      </div>

      {/* Main Grid: Controls Sidebar + Live Plot Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Physical Sensor Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs">
          {/* Target Material Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1.5">
              <Eye className="w-4 h-4 text-purple-700" />
              <span>Target Surface Material</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TARGET_PROFILES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTargetId(t.id)}
                  className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                    selectedTargetId === t.id
                      ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-xs ring-1 ring-purple-500'
                      : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-800'
                  }`}
                >
                  <div className="font-bold text-xs">{t.name}</div>
                  <div className="text-[10px] text-stone-500">{t.category}</div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-500 italic pt-1">
              {activeTarget.description}
            </p>
          </div>

          {/* Sensor Integration Time (Exposure) */}
          <div className="space-y-1.5 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-purple-700" />
                <span>Integration Time (t_int)</span>
              </label>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                  {integrationTimeMs} ms
                </span>
                <button
                  onClick={handleAutoOptimize}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                  title="Automatically optimize integration time to 85% dynamic range on white reference"
                >
                  Auto-Optimize
                </button>
              </div>
            </div>
            <input
              type="range"
              min={4}
              max={100}
              step={1}
              value={integrationTimeMs}
              onChange={e => setIntegrationTimeMs(Number(e.target.value))}
              className="w-full accent-purple-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>4 ms (Fast / Low Light)</span>
              <span>18 ms (Midday Sun)</span>
              <span>100 ms (Long / Deep Shade)</span>
            </div>
          </div>

          {/* Detector Temperature Slider */}
          <div className="space-y-1.5 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
                <Thermometer className="w-4 h-4 text-amber-700" />
                <span>Detector Temperature ($T$)</span>
              </label>
              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                detectorTempC > 35
                  ? 'bg-red-100 text-red-900'
                  : detectorTempC < 5
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-stone-100 text-stone-800'
              }`}>
                {detectorTempC > 0 ? `+${detectorTempC}` : detectorTempC} °C
              </span>
            </div>
            <input
              type="range"
              min={-15}
              max={45}
              step={1}
              value={detectorTempC}
              onChange={e => setDetectorTempC(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>-15°C (Peltier TEC)</span>
              <span>+20°C (Cal Temp)</span>
              <span>+45°C (Midday Heat)</span>
            </div>
          </div>

          {/* Number of Scans to Average */}
          <div className="space-y-1.5 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>Averaged Scans (N_scans)</span>
              </label>
              <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                {scansAveraged} scans (σ/√N = 1/{Math.sqrt(scansAveraged).toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={scansAveraged}
              onChange={e => setScansAveraged(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>1 (Raw Instant)</span>
              <span>10 (Field Standard)</span>
              <span>50 (Lab High SNR)</span>
            </div>
          </div>

          {/* Electronic Readout Noise */}
          <div className="space-y-1.5 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-purple-700" />
                <span>Readout Electronic Noise (σ_read)</span>
              </label>
              <span className="font-mono text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                {readoutNoiseRms} DN RMS
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={90}
              step={1}
              value={readoutNoiseRms}
              onChange={e => setReadoutNoiseRms(Number(e.target.value))}
              className="w-full accent-purple-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>5 DN (Cooled Low-Noise)</span>
              <span>30 DN (Typical)</span>
              <span>90 DN (Degraded)</span>
            </div>
          </div>

          {/* Calibration Action Toggles & Shutter Button */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-stone-900 block">
                  Dark Current Subtraction
                </span>
                <span className="text-[11px] text-stone-500">
                  Subtract DN_dark baseline from target &amp; reference
                </span>
              </div>
              <button
                onClick={() => setDarkCurrentSubtraction(!darkCurrentSubtraction)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  darkCurrentSubtraction ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    darkCurrentSubtraction ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAcquireDark}
                disabled={isShutterClosing}
                className="flex-1 inline-flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Camera className="w-3.5 h-3.5 text-stone-300" />
                <span>{isShutterClosing ? 'Closing Shutter...' : 'Acquire Dark Frame (Shutter Close)'}</span>
              </button>

              <button
                onClick={() => setShowAtmosphericBands(!showAtmosphericBands)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  showAtmosphericBands
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-stone-100 border-stone-200 text-stone-600'
                }`}
                title="Toggle atmospheric absorption water vapor band overlays"
              >
                Atmo Overlay
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: High-Resolution Real-Time Spectral Plot & Diagnostics (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          {/* Chart Mode Selector Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200">
            <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setDisplayMode('reflectance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  displayMode === 'reflectance'
                    ? 'bg-white text-purple-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Calibrated Reflectance ($\rho$)
              </button>

              <button
                onClick={() => setDisplayMode('raw_dn')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  displayMode === 'raw_dn'
                    ? 'bg-white text-purple-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Raw Signal (DN)
              </button>

              <button
                onClick={() => setDisplayMode('snr')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  displayMode === 'snr'
                    ? 'bg-white text-purple-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Spectral SNR ($\lambda$)
              </button>
            </div>

            {/* Saturation Warning Callout */}
            {simulationResults.isSaturated && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-red-100 text-red-800 text-xs font-bold animate-pulse border border-red-200">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Detector Saturated (&gt;65,535 DN)! Reduce Integration Time</span>
              </div>
            )}
            {!darkCurrentSubtraction && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Dark Current Subtraction OFF (Severe Bias)</span>
              </div>
            )}
          </div>

          {/* SVG Canvas Plot */}
          <div className="w-full overflow-x-auto bg-stone-950 rounded-xl p-2 sm:p-4 relative">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto max-h-[380px] select-none"
            >
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((fraction, i) => {
                const y = margin.top + plotHeight * fraction;
                return (
                  <g key={`grid-h-${i}`}>
                    <line
                      x1={margin.left}
                      y1={y}
                      x2={svgWidth - margin.right}
                      y2={y}
                      stroke="#292524"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={margin.left - 10}
                      y={y + 4}
                      fill="#78716c"
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {displayMode === 'reflectance'
                        ? (1.1 - fraction * 1.1).toFixed(2)
                        : displayMode === 'raw_dn'
                        ? Math.round(70000 - fraction * 70000).toLocaleString()
                        : Math.round(800 - fraction * 800)}
                    </text>
                  </g>
                );
              })}

              {/* Vertical Wavelength Grid Lines & Labels */}
              {[500, 800, 1100, 1400, 1700, 2000, 2300].map(wl => {
                const x = scaleX(wl);
                return (
                  <g key={`grid-v-${wl}`}>
                    <line
                      x1={x}
                      y1={margin.top}
                      x2={x}
                      y2={margin.top + plotHeight}
                      stroke="#292524"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={margin.top + plotHeight + 20}
                      fill="#78716c"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {wl} nm
                    </text>
                  </g>
                );
              })}

              {/* Atmospheric Absorption Band Overlays (1350–1450 nm & 1800–1950 nm) */}
              {showAtmosphericBands && (
                <>
                  <rect
                    x={scaleX(1350)}
                    y={margin.top}
                    width={scaleX(1450) - scaleX(1350)}
                    height={plotHeight}
                    fill="#b45309"
                    fillOpacity="0.18"
                  />
                  <text
                    x={(scaleX(1350) + scaleX(1450)) / 2}
                    y={margin.top + 18}
                    fill="#f59e0b"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    H₂O Absorption (1.4 μm)
                  </text>

                  <rect
                    x={scaleX(1800)}
                    y={margin.top}
                    width={scaleX(1950) - scaleX(1800)}
                    height={plotHeight}
                    fill="#b45309"
                    fillOpacity="0.18"
                  />
                  <text
                    x={(scaleX(1800) + scaleX(1950)) / 2}
                    y={margin.top + 18}
                    fill="#f59e0b"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    H₂O Absorption (1.9 μm)
                  </text>
                </>
              )}

              {/* ADC 16-bit Saturation Ceiling line in raw_dn mode */}
              {displayMode === 'raw_dn' && (
                <g>
                  <line
                    x1={margin.left}
                    y1={margin.top + plotHeight - (65535 / 70000) * plotHeight}
                    x2={svgWidth - margin.right}
                    y2={margin.top + plotHeight - (65535 / 70000) * plotHeight}
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="6 3"
                  />
                  <text
                    x={svgWidth - margin.right - 10}
                    y={margin.top + plotHeight - (65535 / 70000) * plotHeight - 6}
                    fill="#ef4444"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="end"
                  >
                    16-Bit Saturation Ceiling (65,535 DN)
                  </text>
                </g>
              )}

              {/* Curves Rendering */}
              {displayMode === 'reflectance' && referencePathD && (
                <path
                  d={referencePathD}
                  fill="none"
                  stroke="#78716c"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />
              )}

              {displayMode === 'raw_dn' && whitePathD && (
                <path d={whitePathD} fill="none" stroke="#f59e0b" strokeWidth="2" />
              )}

              {displayMode === 'raw_dn' && darkPathD && (
                <path d={darkPathD} fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="3 3" />
              )}

              {/* Main Measured Curve */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={
                    displayMode === 'reflectance'
                      ? '#10b981'
                      : displayMode === 'raw_dn'
                      ? '#a855f7'
                      : '#38bdf8'
                  }
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Axis Labels */}
              <text
                x={margin.left + plotWidth / 2}
                y={svgHeight - 10}
                fill="#a8a29e"
                fontSize="11"
                textAnchor="middle"
                fontWeight="bold"
              >
                Wavelength ($\lambda$, nm)
              </text>

              <text
                x={-(margin.top + plotHeight / 2)}
                y={18}
                fill="#a8a29e"
                fontSize="11"
                textAnchor="middle"
                fontWeight="bold"
                transform="rotate(-90)"
              >
                {yAxisLabel}
              </text>
            </svg>
          </div>

          {/* Interactive Legend & Technical Notes */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              {displayMode === 'reflectance' ? (
                <>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block"></span>
                    <span className="font-bold text-stone-900">Simulated Measured Reflectance (ρ̂)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-0.5 bg-stone-400 border-b border-dashed inline-block"></span>
                    <span className="text-stone-600">Ideal Ground Truth (ρ_true)</span>
                  </div>
                </>
              ) : displayMode === 'raw_dn' ? (
                <>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-0.5 bg-purple-500 rounded-full inline-block"></span>
                    <span className="font-bold text-stone-900">Target Raw Signal (DN_target)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-0.5 bg-amber-500 rounded-full inline-block"></span>
                    <span className="text-stone-900 font-semibold">White Panel Reference (DN_white)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-0.5 bg-stone-500 border-b border-dashed inline-block"></span>
                    <span className="text-stone-600">Dark Current (DN_dark)</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-0.5 bg-sky-500 rounded-full inline-block"></span>
                  <span className="font-bold text-stone-900">Wavelength-Resolved Signal-to-Noise Ratio (SNR)</span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-stone-500 font-mono">
              Target: <strong className="text-stone-800">{activeTarget.name}</strong>
            </div>
          </div>

          {/* Governing Physics Box for MSc Students */}
          <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-1.5 leading-relaxed">
            <div className="font-bold uppercase tracking-wider text-[10px] text-purple-900 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-purple-700" />
              <span>Governing Calibration &amp; Noise Formulation:</span>
            </div>
            <div className="overflow-x-auto py-1">
              <MathRenderer
                formula="\rho(\lambda) = \frac{DN_{\text{target}}(\lambda) - DN_{\text{dark}}(\lambda)}{DN_{\text{white}}(\lambda) - DN_{\text{dark}}(\lambda)} \times R_{\text{panel}}(\lambda), \quad \sigma_{\text{eff}} = \frac{\sqrt{\sigma_{\text{shot}}^2 + \sigma_{\text{dark}}^2 + \sigma_{\text{read}}^2}}{\sqrt{N_{\text{scans}}}}"
                displayMode={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
