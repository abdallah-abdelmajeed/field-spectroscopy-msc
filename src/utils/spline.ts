/**
 * Monotone Cubic Hermite Spline (PCHIP - Fritsch-Carlson / Brodlie algorithm)
 * Provides shape-preserving, C1-continuous smooth interpolation for spectral radiometry.
 * Ensures zero unphysical overshoot, no negative reflectance, and no jagged or broken polygonal lines.
 */

export interface SpectralDataPoint {
  wavelength: number;
  reflectance: number;
}

interface SplineCoefficients {
  x: number[];
  y: number[];
  d: number[]; // slopes at nodes
  h: number[]; // step sizes
  n: number;
}

/**
 * Precompute Monotone Cubic Hermite Spline derivatives
 */
export function buildPCHIP(points: SpectralDataPoint[]): SplineCoefficients | null {
  if (!points || points.length === 0) return null;

  // Filter and sort points by ascending wavelength
  const sorted = [...points]
    .filter((p) => !isNaN(p.wavelength) && !isNaN(p.reflectance))
    .sort((a, b) => a.wavelength - b.wavelength);

  // Remove duplicate wavelengths
  const uniquePoints: SpectralDataPoint[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (
      i === 0 ||
      Math.abs(sorted[i].wavelength - uniquePoints[uniquePoints.length - 1].wavelength) > 0.1
    ) {
      uniquePoints.push(sorted[i]);
    }
  }

  const n = uniquePoints.length;
  if (n === 0) return null;

  const x = uniquePoints.map((p) => p.wavelength);
  const y = uniquePoints.map((p) => p.reflectance);

  if (n === 1) {
    return { x, y, d: [0], h: [], n: 1 };
  }

  if (n === 2) {
    const slope = (y[1] - y[0]) / (x[1] - x[0]);
    return { x, y, d: [slope, slope], h: [x[1] - x[0]], n: 2 };
  }

  const h = new Array(n - 1);
  const delta = new Array(n - 1);
  for (let i = 0; i < n - 1; i++) {
    h[i] = x[i + 1] - x[i];
    delta[i] = (y[i + 1] - y[i]) / Math.max(1e-6, h[i]);
  }

  const d = new Array(n);
  // Interior points tangents using Fritsch-Carlson / Brodlie harmonic mean
  for (let i = 1; i < n - 1; i++) {
    if (delta[i - 1] * delta[i] <= 0) {
      // Local extremum: derivative must be zero to preserve monotonicity
      d[i] = 0;
    } else {
      const w1 = 2 * h[i] + h[i - 1];
      const w2 = h[i] + 2 * h[i - 1];
      d[i] = (w1 + w2) / (w1 / delta[i - 1] + w2 / delta[i]);
    }
  }

  // Endpoints: non-centered three-point formula with monotonicity limiter
  // Left endpoint
  const d0 = ((2 * h[0] + h[1]) * delta[0] - h[0] * delta[1]) / (h[0] + h[1]);
  if (d0 * delta[0] <= 0) {
    d[0] = 0;
  } else if (delta[0] * delta[1] <= 0 && Math.abs(d0) > Math.abs(3 * delta[0])) {
    d[0] = 3 * delta[0];
  } else {
    d[0] = d0;
  }

  // Right endpoint
  const dn =
    ((2 * h[n - 2] + h[n - 3]) * delta[n - 2] - h[n - 2] * delta[n - 3]) /
    (h[n - 2] + h[n - 3]);
  if (dn * delta[n - 2] <= 0) {
    d[n - 1] = 0;
  } else if (delta[n - 2] * delta[n - 3] <= 0 && Math.abs(dn) > Math.abs(3 * delta[n - 2])) {
    d[n - 1] = 3 * delta[n - 2];
  } else {
    d[n - 1] = dn;
  }

  return { x, y, d, h, n };
}

/**
 * Evaluate PCHIP spline at target wavelength
 */
export function evaluatePCHIP(spline: SplineCoefficients | null, targetWl: number): number {
  if (!spline) return 0;
  const { x, y, d, h, n } = spline;

  if (n === 1) return y[0];
  if (targetWl <= x[0]) return y[0];
  if (targetWl >= x[n - 1]) return y[n - 1];

  // Binary search for interval
  let low = 0;
  let high = n - 2;
  let idx = 0;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (targetWl >= x[mid] && targetWl <= x[mid + 1]) {
      idx = mid;
      break;
    } else if (targetWl < x[mid]) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  const hI = h[idx];
  const t = (targetWl - x[idx]) / hI;
  const t2 = t * t;
  const t3 = t2 * t;

  // Hermite basis functions
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  const val = h00 * y[idx] + h10 * hI * d[idx] + h01 * y[idx + 1] + h11 * hI * d[idx + 1];
  return Math.max(0, Math.min(1.0, val));
}

/**
 * High-performance evaluator with internal caching
 */
const splineCache = new WeakMap<SpectralDataPoint[], SplineCoefficients>();

export function interpolatePCHIP(points: SpectralDataPoint[], targetWl: number): number {
  if (!points || points.length === 0) return 0;
  let spline = splineCache.get(points);
  if (!spline) {
    const built = buildPCHIP(points);
    if (!built) return 0;
    spline = built;
    splineCache.set(points, spline);
  }
  return evaluatePCHIP(spline, targetWl);
}

/**
 * Generate a dense, completely continuous and smooth SVG path for reference spectral curves.
 * Evaluates the monotone cubic Hermite spline at 5 nm increments, matching RTM simulation fidelity.
 * Eliminates all broken polygonal elbows, sharp joints, and flat line artifacts.
 */
export function generateSmoothReferencePath(
  points: SpectralDataPoint[],
  minWl: number,
  maxWl: number,
  getX: (wl: number) => number,
  getY: (refl: number) => number,
  sampleStep: number = 5
): string {
  if (!points || points.length === 0) return '';

  const spline = buildPCHIP(points);
  if (!spline) return '';

  const clampedStart = Math.max(minWl, spline.x[0]);
  const clampedEnd = Math.min(maxWl, spline.x[spline.n - 1]);

  if (clampedStart > clampedEnd) return '';

  let path = '';
  let first = true;

  for (let wl = clampedStart; wl <= clampedEnd; wl += sampleStep) {
    const refl = evaluatePCHIP(spline, wl);
    const x = getX(wl);
    const y = getY(refl);

    if (first) {
      path += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      first = false;
    } else {
      path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }

  // Ensure last endpoint is explicitly included
  if (clampedEnd % sampleStep !== 0) {
    const refl = evaluatePCHIP(spline, clampedEnd);
    const x = getX(clampedEnd);
    const y = getY(refl);
    path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }

  return path;
}
