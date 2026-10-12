import React from 'react';
import { ArrowUp, ArrowDown, Activity, Sparkles, X, Check } from 'lucide-react';

export interface ShiftDeltaSummary {
  maxDeltaWl: number;
  maxDeltaVal: number; // curr - base
  maxAbsDelta: number;
  meanDelta: number;
  regionName: string;
  nirDelta: number; // at ~800nm
  redDelta: number; // at ~670nm
  swirDelta: number; // at ~1450nm
}

export function computeShiftDelta(
  wavelengths: number[],
  currCurve: number[],
  baseCurve: number[]
): ShiftDeltaSummary | null {
  if (
    !currCurve ||
    !baseCurve ||
    currCurve.length === 0 ||
    baseCurve.length === 0 ||
    currCurve.length !== baseCurve.length
  ) {
    return null;
  }

  let maxAbs = 0;
  let maxWl = wavelengths[0];
  let maxVal = 0;
  let sumDelta = 0;

  let nirDelta = 0;
  let redDelta = 0;
  let swirDelta = 0;

  for (let i = 0; i < wavelengths.length; i++) {
    const wl = wavelengths[i];
    const diff = currCurve[i] - baseCurve[i];
    const absDiff = Math.abs(diff);
    sumDelta += diff;

    if (absDiff > maxAbs) {
      maxAbs = absDiff;
      maxWl = wl;
      maxVal = diff;
    }

    if (Math.abs(wl - 800) < 5) nirDelta = diff;
    if (Math.abs(wl - 670) < 5) redDelta = diff;
    if (Math.abs(wl - 1450) < 10) swirDelta = diff;
  }

  if (maxAbs < 0.005) {
    return null; // negligible change
  }

  // Determine optical domain name
  let regionName = 'Optical Spectrum';
  if (maxWl < 500) {
    regionName = 'Blue Pigment Absorption';
  } else if (maxWl < 600) {
    regionName = 'Green Reflectance Peak';
  } else if (maxWl < 690) {
    regionName = 'Red Chlorophyll Absorption';
  } else if (maxWl < 750) {
    regionName = 'Red Edge Inflection Slope';
  } else if (maxWl < 1300) {
    regionName = 'NIR Multiple Scattering Plateau';
  } else if (maxWl < 1850) {
    regionName = 'SWIR-1 Water & Dry Matter Basin';
  } else {
    regionName = 'SWIR-2 Liquid Water Absorption';
  }

  return {
    maxDeltaWl: maxWl,
    maxDeltaVal: maxVal,
    maxAbsDelta: maxAbs,
    meanDelta: sumDelta / wavelengths.length,
    regionName,
    nirDelta,
    redDelta,
    swirDelta
  };
}

export function generateDeltaMeshPath(
  wavelengths: number[],
  currCurve: number[],
  baseCurve: number[],
  minWl: number,
  maxWl: number,
  getX: (wl: number) => number,
  getY: (refl: number) => number
): string {
  const filteredIndices: number[] = [];
  for (let i = 0; i < wavelengths.length; i++) {
    const w = wavelengths[i];
    if (w >= minWl && w <= maxWl) {
      filteredIndices.push(i);
    }
  }

  if (filteredIndices.length < 2) return '';

  let path = '';
  // Forward along currCurve
  for (let i = 0; i < filteredIndices.length; i++) {
    const idx = filteredIndices[i];
    const x = getX(wavelengths[idx]);
    const y = getY(currCurve[idx]);
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }

  // Backward along baseCurve
  for (let i = filteredIndices.length - 1; i >= 0; i--) {
    const idx = filteredIndices[i];
    const x = getX(wavelengths[idx]);
    const y = getY(baseCurve[idx]);
    path += ` L ${x} ${y}`;
  }

  path += ' Z';
  return path;
}

interface RTMShiftAnimationOverlayProps {
  wavelengths: number[];
  currCanopyCurve: number[];
  baseCanopyCurve: number[] | null;
  minWl: number;
  maxWl: number;
  getX: (wl: number) => number;
  getY: (refl: number) => number;
  paramName?: string;
  onClearBaseline: () => void;
  onApplyBaselineAsCurrent: () => void;
}

export const RTMShiftAnimationSVGOverlay: React.FC<
  Omit<RTMShiftAnimationOverlayProps, 'onClearBaseline' | 'onApplyBaselineAsCurrent'>
> = ({
  wavelengths,
  currCanopyCurve,
  baseCanopyCurve,
  minWl,
  maxWl,
  getX,
  getY,
  paramName
}) => {
  if (!baseCanopyCurve) return null;

  const delta = computeShiftDelta(wavelengths, currCanopyCurve, baseCanopyCurve);
  if (!delta || delta.maxAbsDelta < 0.008) return null;

  const meshPath = generateDeltaMeshPath(
    wavelengths,
    currCanopyCurve,
    baseCanopyCurve,
    minWl,
    maxWl,
    getX,
    getY
  );

  const isIncrease = delta.maxDeltaVal > 0;
  const fillColor = isIncrease ? '#10b981' : '#f59e0b';
  const strokeColor = isIncrease ? '#059669' : '#d97706';

  // Wavelength peak coordinate
  const peakWl = delta.maxDeltaWl;
  const isPeakInDomain = peakWl >= minWl && peakWl <= maxWl;
  const peakIndex = wavelengths.indexOf(peakWl);
  const peakCurrY = peakIndex !== -1 ? getY(currCanopyCurve[peakIndex]) : 0;
  const peakBaseY = peakIndex !== -1 ? getY(baseCanopyCurve[peakIndex]) : 0;
  const peakX = getX(peakWl);

  return (
    <g className="rtm-shift-animation-group pointer-events-none select-none">
      <defs>
        {/* Animated diagonal pattern for shifting delta */}
        <pattern
          id="shift-delta-stripes"
          width="12"
          height="12"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="12"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeOpacity="0.25"
          />
        </pattern>
      </defs>

      {/* 1. Pre-Slide Baseline Curve (Ghost Trail) */}
      <path
        d={wavelengths
          .filter((w) => w >= minWl && w <= maxWl)
          .reduce((acc, w, i) => {
            const idx = wavelengths.indexOf(w);
            const x = getX(w);
            const y = getY(baseCanopyCurve[idx]);
            return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
          }, '')}
        fill="none"
        stroke="#64748b"
        strokeWidth="2.2"
        strokeDasharray="6 4"
        strokeOpacity="0.8"
      />

      {/* 2. Shaded Dynamic Delta Area between curves */}
      {meshPath && (
        <>
          <path
            d={meshPath}
            fill={fillColor}
            fillOpacity="0.18"
            className="transition-all duration-150"
          />
          <path
            d={meshPath}
            fill="url(#shift-delta-stripes)"
            className="transition-all duration-150"
          />
        </>
      )}

      {/* 3. Real-Time Dynamic Directional Indicator at Peak Shift */}
      {isPeakInDomain && peakIndex !== -1 && (
        <g className="animate-in fade-in zoom-in-95 duration-200">
          {/* Vertical Delta Connector Line */}
          <line
            x1={peakX}
            y1={peakBaseY}
            x2={peakX}
            y2={peakCurrY}
            stroke={strokeColor}
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* Pulse beacon at current point */}
          <circle
            cx={peakX}
            cy={peakCurrY}
            r="6"
            fill={strokeColor}
            fillOpacity="0.9"
          />
          <circle
            cx={peakX}
            cy={peakCurrY}
            r="12"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.8"
            className="animate-ping"
            opacity="0.6"
          />

          {/* Baseline anchor node */}
          <circle
            cx={peakX}
            cy={peakBaseY}
            r="3.5"
            fill="#64748b"
          />

          {/* Floating Shift Badge */}
          {(() => {
            const badgeY = Math.max(
              25,
              Math.min(peakCurrY - 26, peakBaseY - 26)
            );
            const badgeWidth = 145;
            const badgeX = Math.max(
              65,
              Math.min(peakX - badgeWidth / 2, getX(maxWl) - badgeWidth)
            );
            const deltaPercent = (delta.maxDeltaVal * 100).toFixed(1);
            const sign = delta.maxDeltaVal > 0 ? '+' : '';

            return (
              <g>
                <rect
                  x={badgeX}
                  y={badgeY}
                  width={badgeWidth}
                  height="26"
                  rx="6"
                  fill="#0f172a"
                  fillOpacity="0.94"
                  stroke={strokeColor}
                  strokeWidth="1.6"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
                />
                <text
                  x={badgeX + 8}
                  y={badgeY + 17}
                  fill={isIncrease ? '#34d399' : '#fbbf24'}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {isIncrease ? '▲' : '▼'} {sign}{deltaPercent}% @ {peakWl}nm
                </text>
                <text
                  x={badgeX + 115}
                  y={badgeY + 16}
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="sans-serif"
                >
                  Shift
                </text>
              </g>
            );
          })()}
        </g>
      )}
    </g>
  );
};

export const RTMShiftAnimationHUD: React.FC<RTMShiftAnimationOverlayProps> = ({
  wavelengths,
  currCanopyCurve,
  baseCanopyCurve,
  paramName,
  onClearBaseline,
  onApplyBaselineAsCurrent
}) => {
  if (!baseCanopyCurve) return null;

  const delta = computeShiftDelta(wavelengths, currCanopyCurve, baseCanopyCurve);
  if (!delta || delta.maxAbsDelta < 0.008) return null;

  const isIncrease = delta.maxDeltaVal > 0;
  const sign = delta.maxDeltaVal > 0 ? '+' : '';
  const peakPercent = (delta.maxDeltaVal * 100).toFixed(1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-stone-900 text-stone-100 rounded-lg border border-stone-700 shadow-md text-xs animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-bold text-white flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-Time Shift Feedback:</span>
        </span>
        <span className="bg-stone-800 text-stone-200 px-2 py-0.5 rounded font-mono font-semibold">
          {paramName || 'Parameter Adjustment'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Optical Response Summary */}
        <div className="flex items-center space-x-1.5 font-mono">
          <span className="text-stone-400 text-[11px]">{delta.regionName}:</span>
          <span
            className={`font-bold flex items-center space-x-0.5 ${
              isIncrease ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {isIncrease ? (
              <ArrowUp className="w-3.5 h-3.5" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5" />
            )}
            <span>
              {sign}{peakPercent}% at {delta.maxDeltaWl} nm
            </span>
          </span>
        </div>

        {/* Legend / Actions */}
        <div className="flex items-center space-x-2 border-l border-stone-700 pl-2">
          <span className="text-[11px] text-stone-400 flex items-center space-x-1">
            <span className="w-3 border-t border-dashed border-stone-400" />
            <span>Pre-slide trail</span>
          </span>

          <button
            type="button"
            onClick={onApplyBaselineAsCurrent}
            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 transition-colors cursor-pointer flex items-center space-x-1"
            title="Update baseline to current curve position"
          >
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Pin as Base</span>
          </button>

          <button
            type="button"
            onClick={onClearBaseline}
            className="p-1 rounded text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="Dismiss shift trail"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
