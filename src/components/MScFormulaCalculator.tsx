/**
 * Interactive MSc Dimensional Analysis & Physics Calculator for Lecture Slides.
 * Enables students to verify physical units, test numerical boundary conditions,
 * and calculate real-world values for field spectroscopy optical equations.
 */
import React, { useState } from 'react';
import { Calculator, HelpCircle, CheckCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface MScFormulaCalculatorProps {
  formulaTitle?: string;
}

export const MScFormulaCalculator: React.FC<MScFormulaCalculatorProps> = () => {
  const [activeModel, setActiveModel] = useState<'fov' | 'wien' | 'snr' | 'beer'>('fov');

  // FOV Parameters
  const [fovDeg, setFovDeg] = useState<number>(25); // typical ASD pistol grip 25 deg or foreoptic 8 / 1 deg
  const [heightM, setHeightM] = useState<number>(1.2); // typical tripod or handheld height

  // Wien / Planck
  const [tempK, setTempK] = useState<number>(5778); // Sun 5778 K, Earth 298 K

  // SNR
  const [baseSnr, setBaseSnr] = useState<number>(150);
  const [scanCount, setScanCount] = useState<number>(10);

  // Beer-Lambert / Extinction
  const [extinctionK, setExtinctionK] = useState<number>(0.5); // typical spherical canopy k
  const [lai, setLai] = useState<number>(3.0); // LAI

  // Computations
  const fovRad = (fovDeg * Math.PI) / 180;
  const footprintDiameterM = 2 * heightM * Math.tan(fovRad / 2);
  const footprintAreaM2 = Math.PI * Math.pow(footprintDiameterM / 2, 2);

  const wienPeakUm = 2897.77 / tempK;
  const wienPeakNm = wienPeakUm * 1000;
  const stefanBoltzmannFlux = 5.670374e-8 * Math.pow(tempK, 4); // W/m^2

  const computedSnr = Math.round(baseSnr * Math.sqrt(scanCount));

  const beerTransmittance = Math.exp(-extinctionK * lai);

  return (
    <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 space-y-3 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-purple-200/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-purple-700" />
          <span className="font-bold uppercase tracking-wider text-purple-950 text-[11px]">
            MSc Dimensional Analysis &amp; Physics Calculator
          </span>
        </div>

        {/* Model Selector Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto">
          <button
            onClick={() => setActiveModel('fov')}
            className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors cursor-pointer ${
              activeModel === 'fov'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-white text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            Ground FOV Footprint
          </button>
          <button
            onClick={() => setActiveModel('wien')}
            className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors cursor-pointer ${
              activeModel === 'wien'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-white text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            Wien &amp; Planck Peak
          </button>
          <button
            onClick={() => setActiveModel('snr')}
            className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors cursor-pointer ${
              activeModel === 'snr'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-white text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            SNR Scaling (√N)
          </button>
          <button
            onClick={() => setActiveModel('beer')}
            className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors cursor-pointer ${
              activeModel === 'beer'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-white text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            Canopy Extinction
          </button>
        </div>
      </div>

      {/* MODEL 1: GROUND FOV FOOTPRINT */}
      {activeModel === 'fov' && (
        <div className="space-y-3">
          <div className="text-[11px] text-purple-950 leading-relaxed">
            <strong>Equation:</strong> <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-purple-200">D = 2 · H · tan(FOV / 2)</code>
            <span className="ml-2 text-stone-600">Calculates circular nadir footprint sampled on the canopy/soil surface.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-purple-200 space-y-2">
              <div className="flex justify-between font-medium text-stone-700">
                <span>Foreoptic Field of View (FOV):</span>
                <span className="font-mono font-bold text-purple-900">{fovDeg}°</span>
              </div>
              <input
                type="range"
                min={1}
                max={45}
                step={1}
                value={fovDeg}
                onChange={(e) => setFovDeg(Number(e.target.value))}
                className="w-full accent-purple-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>1° (Telescopic)</span>
                <span>8° (Narrow)</span>
                <span>25° (Bare Fiber)</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-purple-200 space-y-2">
              <div className="flex justify-between font-medium text-stone-700">
                <span>Sensor Height Above Canopy (H):</span>
                <span className="font-mono font-bold text-purple-900">{heightM.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min={0.2}
                max={5.0}
                step={0.1}
                value={heightM}
                onChange={(e) => setHeightM(Number(e.target.value))}
                className="w-full accent-purple-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>0.2 m (Macro)</span>
                <span>1.5 m (Handheld)</span>
                <span>5.0 m (Tower/Mast)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 bg-purple-100/90 rounded-lg text-center border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-900 block">Footprint Diameter (D)</span>
              <span className="text-base font-mono font-bold text-purple-950">
                {(footprintDiameterM * 100).toFixed(1)} cm
              </span>
              <span className="text-[10px] text-purple-800 block">({footprintDiameterM.toFixed(3)} meters)</span>
            </div>

            <div className="p-2.5 bg-purple-100/90 rounded-lg text-center border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-900 block">Sampled Surface Area</span>
              <span className="text-base font-mono font-bold text-purple-950">
                {(footprintAreaM2 * 10000).toFixed(1)} cm²
              </span>
              <span className="text-[10px] text-purple-800 block">({footprintAreaM2.toFixed(4)} m²)</span>
            </div>
          </div>
        </div>
      )}

      {/* MODEL 2: WIEN'S DISPLACEMENT & PLANCK PEAK */}
      {activeModel === 'wien' && (
        <div className="space-y-3">
          <div className="text-[11px] text-purple-950 leading-relaxed">
            <strong>Equation:</strong> <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-purple-200">λ_max = 2897.77 µm·K / T</code>
            <span className="ml-2 text-stone-600">Calculates maximum spectral radiant exitance peak wavelength.</span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-purple-200 space-y-2">
            <div className="flex justify-between font-medium text-stone-700">
              <span>Blackbody Temperature (T):</span>
              <span className="font-mono font-bold text-purple-900">{tempK} K ({tempK - 273}°C)</span>
            </div>
            <input
              type="range"
              min={250}
              max={6500}
              step={50}
              value={tempK}
              onChange={(e) => setTempK(Number(e.target.value))}
              className="w-full accent-purple-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>298 K (Earth Ambient)</span>
              <span>3200 K (Halogen Bulb)</span>
              <span>5778 K (Solar Photosphere)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 bg-purple-100/90 rounded-lg text-center border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-900 block">Peak Wavelength (λ_max)</span>
              <span className="text-base font-mono font-bold text-purple-950">
                {wienPeakNm < 1000 ? `${wienPeakNm.toFixed(0)} nm` : `${wienPeakUm.toFixed(2)} µm`}
              </span>
              <span className="text-[10px] text-purple-800 block">
                {wienPeakNm < 750 ? 'Visible Solar Window' : wienPeakNm < 2500 ? 'SWIR Range' : 'Thermal IR'}
              </span>
            </div>

            <div className="p-2.5 bg-purple-100/90 rounded-lg text-center border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-900 block">Total Exitance (σ·T⁴)</span>
              <span className="text-base font-mono font-bold text-purple-950">
                {stefanBoltzmannFlux > 1e6 ? `${(stefanBoltzmannFlux / 1e6).toFixed(2)} MW/m²` : `${stefanBoltzmannFlux.toFixed(0)} W/m²`}
              </span>
              <span className="text-[10px] text-purple-800 block">Stefan-Boltzmann Integral</span>
            </div>
          </div>
        </div>
      )}

      {/* MODEL 3: SNR SCALING */}
      {activeModel === 'snr' && (
        <div className="space-y-3">
          <div className="text-[11px] text-purple-950 leading-relaxed">
            <strong>Equation:</strong> <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-purple-200">SNR = SNR_single · √N_scans</code>
            <span className="ml-2 text-stone-600">Calculates noise variance reduction across multiple averaged spectral acquisitions.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-purple-200 space-y-2">
              <div className="flex justify-between font-medium text-stone-700">
                <span>Single-Scan Base SNR:</span>
                <span className="font-mono font-bold text-purple-900">{baseSnr} : 1</span>
              </div>
              <input
                type="range"
                min={50}
                max={400}
                step={10}
                value={baseSnr}
                onChange={(e) => setBaseSnr(Number(e.target.value))}
                className="w-full accent-purple-700 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-white rounded-lg border border-purple-200 space-y-2">
              <div className="flex justify-between font-medium text-stone-700">
                <span>Spectra Averaged (N):</span>
                <span className="font-mono font-bold text-purple-900">{scanCount} scans</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                step={1}
                value={scanCount}
                onChange={(e) => setScanCount(Number(e.target.value))}
                className="w-full accent-purple-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-2.5 bg-purple-100/90 rounded-lg text-center border border-purple-200">
            <span className="text-[10px] uppercase font-bold text-purple-900 block">Effective Averaged SNR</span>
            <span className="text-xl font-mono font-bold text-purple-950">
              {computedSnr} : 1
            </span>
            <span className="text-[10px] text-purple-800 block">
              +{(Math.sqrt(scanCount) * 100 - 100).toFixed(0)}% Noise Suppression over Single Scan
            </span>
          </div>
        </div>
      )}

      {/* MODEL 4: BEER-LAMBERT CANOPY EXTINCTION */}
      {activeModel === 'beer' && (
        <div className="space-y-3">
          <div className="text-[11px] text-purple-950 leading-relaxed">
            <strong>Equation:</strong> <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-purple-200">τ(θ) = exp(-k(θ) · LAI)</code>
            <span className="ml-2 text-stone-600">Calculates direct solar beam transmittance reaching the soil substrate.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-purple-200 space-y-2">
              <div className="flex justify-between font-medium text-stone-700">
                <span>Canopy Extinction Coeff (k):</span>
                <span className="font-mono font-bold text-purple-900">{extinctionK.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.2}
                max={1.0}
                step={0.05}
                value={extinctionK}
                onChange={(e) => setExtinctionK(Number(e.target.value))}
                className="w-full accent-purple-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>0.3 (Erectophile)</span>
                <span>0.5 (Spherical)</span>
                <span>0.9 (Planophile)</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-purple-200 space-y-2">
              <div className="flex justify-between font-medium text-stone-700">
                <span>Leaf Area Index (LAI):</span>
                <span className="font-mono font-bold text-purple-900">{lai.toFixed(1)} m²/m²</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={8.0}
                step={0.1}
                value={lai}
                onChange={(e) => setLai(Number(e.target.value))}
                className="w-full accent-purple-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 bg-purple-100/90 rounded-lg text-center border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-900 block">Canopy Interception (1 - τ)</span>
              <span className="text-base font-mono font-bold text-purple-950">
                {((1 - beerTransmittance) * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-purple-800 block">FAPAR Approximation</span>
            </div>

            <div className="p-2.5 bg-purple-100/90 rounded-lg text-center border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-900 block">Substrate Light Fraction (τ)</span>
              <span className="text-base font-mono font-bold text-purple-950">
                {(beerTransmittance * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-purple-800 block">Reaches Ground Surface</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
