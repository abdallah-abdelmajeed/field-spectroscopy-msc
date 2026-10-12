/**
 * Radiative Transfer Model (RTM) Physics Simulation Engine
 * Based on the PROSPECT-D leaf optical model (Féret et al., 2017) 
 * coupled with the 4SAIL canopy reflectance model (Verhoef, 1984; Jacquemoud et al., 2009).
 */

export interface RTMParameters {
  leafChlorophyll: number; // Cab: 5 - 90 ug/cm^2
  canopyCover: number; // 0.05 - 1.0 (5% to 100%)
  leafWaterContent: number; // Cw: 0.005 - 0.050 cm (EWT)
  dryMatterContent: number; // Cm: 0.002 - 0.025 g/cm^2
  carotenoids: number; // Cxc: 2 - 25 ug/cm^2
  leafStructureN: number; // N: 1.0 - 2.5 (mesophyll cell layers)
  soilBrightness: number; // 0.5 - 1.5 multiplier
  soilType: 'loam' | 'dry_soil' | 'clay' | 'dark_organic';
  canopyArchitecture: 'planophile' | 'erectophile' | 'spherical';
  solarZenithAngle: number; // 15 - 65 degrees
}

export interface RTMSimulationResult {
  wavelengths: number[];
  canopyReflectance: number[];
  leafReflectance: number[];
  leafTransmittance: number[];
  soilReflectance: number[];
  indices: {
    ndvi: number;
    evi: number;
    ndwi: number;
    rep: number; // Red Edge Position in nm
    ciGreen: number; // Chlorophyll Index Green
    savi: number;
  };
}

export const DEFAULT_RTM_PARAMS: RTMParameters = {
  leafChlorophyll: 45,
  canopyCover: 0.85,
  leafWaterContent: 0.018,
  dryMatterContent: 0.009,
  carotenoids: 8.5,
  leafStructureN: 1.5,
  soilBrightness: 1.0,
  soilType: 'loam',
  canopyArchitecture: 'spherical',
  solarZenithAngle: 30
};

export const RTM_PRESETS: Record<string, { name: string; category: string; description: string; params: Partial<RTMParameters> }> = {
  deciduous_forest: {
    name: 'Deciduous Forest',
    category: 'Vegetation',
    description: 'Dense closed broadleaf canopy (95% cover, LAI ~ 4.8), high chlorophyll (55 μg/cm²), high leaf water (0.025 cm), planophile leaves over dark organic forest soil.',
    params: {
      leafChlorophyll: 55,
      canopyCover: 0.95,
      leafWaterContent: 0.025,
      dryMatterContent: 0.010,
      carotenoids: 11,
      leafStructureN: 1.6,
      canopyArchitecture: 'planophile',
      soilType: 'dark_organic',
      soilBrightness: 0.8,
      solarZenithAngle: 30
    }
  },
  grassland: {
    name: 'Grassland / Savanna',
    category: 'Vegetation',
    description: 'Open monocot graminoid canopy (60% cover, LAI ~ 2.1), erectophile architecture, thin leaf mesophyll (N = 1.15), moderate chlorophyll (36 μg/cm²), silt loam soil.',
    params: {
      leafChlorophyll: 36,
      canopyCover: 0.60,
      leafWaterContent: 0.016,
      dryMatterContent: 0.007,
      carotenoids: 8.5,
      leafStructureN: 1.15,
      canopyArchitecture: 'erectophile',
      soilType: 'loam',
      soilBrightness: 1.05,
      solarZenithAngle: 30
    }
  },
  dry_soil: {
    name: 'Dry Soil (Bare Ground)',
    category: 'Soil & Substrate',
    description: 'Minimal vegetation cover (5%), dry arid mineral soil substrate (1.3x brightness), zero green peak, monotonic upward soil reflectance curve.',
    params: {
      leafChlorophyll: 20,
      canopyCover: 0.05,
      leafWaterContent: 0.010,
      dryMatterContent: 0.010,
      carotenoids: 5,
      leafStructureN: 1.4,
      canopyArchitecture: 'spherical',
      soilType: 'dry_soil',
      soilBrightness: 1.30,
      solarZenithAngle: 30
    }
  },
  coniferous_forest: {
    name: 'Coniferous Needle Forest',
    category: 'Vegetation',
    description: 'Dense needleleaf canopy (88% cover, LAI ~ 4.2), thick needle mesophyll (N = 2.25), high dry matter (0.019 g/cm²), erectophile architecture, dark organic floor, moderate NIR plateau.',
    params: {
      leafChlorophyll: 48,
      canopyCover: 0.88,
      leafWaterContent: 0.020,
      dryMatterContent: 0.019,
      carotenoids: 12,
      leafStructureN: 2.25,
      canopyArchitecture: 'erectophile',
      soilType: 'dark_organic',
      soilBrightness: 0.70,
      solarZenithAngle: 35
    }
  },
  healthy_crop: {
    name: 'Healthy Agricultural Crop (Wheat)',
    category: 'Vegetation',
    description: 'Optimal vegetative wheat crop (85% cover, LAI ~ 3.5), high chlorophyll (45 μg/cm²), spherical leaf angle distribution, turgid leaf water (0.018 cm), fertile loam soil.',
    params: {
      leafChlorophyll: 45,
      canopyCover: 0.85,
      leafWaterContent: 0.018,
      dryMatterContent: 0.009,
      carotenoids: 8.5,
      leafStructureN: 1.5,
      canopyArchitecture: 'spherical',
      soilType: 'loam',
      soilBrightness: 1.0,
      solarZenithAngle: 30
    }
  },
  water_stressed: {
    name: 'Drought-Stressed Foliage',
    category: 'Vegetation Stress',
    description: 'Severely depleted leaf water content (Cw = 0.007 cm), reduced chlorophyll (25 μg/cm²), prominent SWIR reflectance peaks due to loss of liquid water absorption.',
    params: {
      leafChlorophyll: 25,
      canopyCover: 0.65,
      leafWaterContent: 0.007,
      dryMatterContent: 0.014,
      carotenoids: 9.0,
      leafStructureN: 1.8,
      canopyArchitecture: 'erectophile',
      soilType: 'loam',
      soilBrightness: 1.15,
      solarZenithAngle: 30
    }
  },
  senescent_foliage: {
    name: 'Senescent / Autumn Foliage',
    category: 'Vegetation Stress',
    description: 'Degraded chlorophyll (12 μg/cm²), elevated carotenoids (18 μg/cm²), yellowing visible signature, collapsed Red Edge and high SWIR dry matter signature.',
    params: {
      leafChlorophyll: 12,
      canopyCover: 0.70,
      leafWaterContent: 0.010,
      dryMatterContent: 0.016,
      carotenoids: 18,
      leafStructureN: 2.1,
      canopyArchitecture: 'planophile',
      soilType: 'loam',
      soilBrightness: 1.0,
      solarZenithAngle: 35
    }
  },
  sparse_seedlings: {
    name: 'Early-Stage Crop (Sparse Seedlings)',
    category: 'Agricultural Stage',
    description: 'Low canopy cover (25%, LAI ~ 0.6), bright soil background dominating, moderate chlorophyll (35 μg/cm²), noticeable soil baseline throughout VNIR/SWIR.',
    params: {
      leafChlorophyll: 35,
      canopyCover: 0.25,
      leafWaterContent: 0.015,
      dryMatterContent: 0.006,
      carotenoids: 7.0,
      leafStructureN: 1.4,
      canopyArchitecture: 'spherical',
      soilType: 'dry_soil',
      soilBrightness: 1.20,
      solarZenithAngle: 25
    }
  },
  wetland_paddy: {
    name: 'Wetland / Irrigated Paddy',
    category: 'Vegetation',
    description: 'Lush irrigated rice canopy (92% cover), high leaf water (0.028 cm), planophile structure over dark saturated organic substrate (0.6x brightness).',
    params: {
      leafChlorophyll: 50,
      canopyCover: 0.92,
      leafWaterContent: 0.028,
      dryMatterContent: 0.008,
      carotenoids: 10,
      leafStructureN: 1.45,
      canopyArchitecture: 'planophile',
      soilType: 'dark_organic',
      soilBrightness: 0.60,
      solarZenithAngle: 25
    }
  }
};

// Base soil spectral reflectance at wavelength wl (nm)
function getSoilBaseReflectance(wl: number, type: RTMParameters['soilType'], brightness: number): number {
  let base = 0.15;
  if (type === 'dry_soil') {
    // Monotonically increasing with gentle slope
    base = 0.10 + 0.35 * (1 - Math.exp(-(wl - 350) / 1100));
  } else if (type === 'dark_organic') {
    // Low reflectance across visible and gentle rise
    base = 0.06 + 0.18 * (1 - Math.exp(-(wl - 350) / 1400));
  } else if (type === 'clay') {
    // Kaolinite / clay with 2200nm doublet depression
    base = 0.12 + 0.30 * (1 - Math.exp(-(wl - 350) / 950));
    if (wl >= 2150 && wl <= 2230) {
      base -= 0.08 * Math.exp(-Math.pow((wl - 2200) / 25, 2));
    }
  } else {
    // Typical agricultural loam
    base = 0.08 + 0.28 * (1 - Math.exp(-(wl - 350) / 1000));
  }

  // Atmospheric soil water absorption indentations around 1400 and 1900 nm
  const w1400 = 0.04 * Math.exp(-Math.pow((wl - 1420) / 45, 2));
  const w1900 = 0.06 * Math.exp(-Math.pow((wl - 1920) / 50, 2));
  base = Math.max(0.02, (base - w1400 - w1900) * brightness);
  return Math.min(0.85, base);
}

// Specific absorption coefficients k_i(wl) for leaf biochemical constituents
function getLeafAbsorptionCoefficients(wl: number) {
  // 1. Chlorophyll a+b peak absorption at ~435 nm (Soret band) and ~675 nm (Q-band)
  const kCab_blue = 0.065 * Math.exp(-Math.pow((wl - 435) / 36, 2));
  const kCab_uv = wl < 500 ? 0.035 * Math.exp(-Math.pow((wl - 390) / 45, 2)) : 0;
  // Q-band centered at 675 nm with asymmetric tail into red-edge
  const kCab_red =
    wl <= 675
      ? 0.082 * Math.exp(-Math.pow((wl - 675) / 34, 2))
      : 0.082 * Math.exp(-Math.pow((wl - 675) / 22, 2));
  // Continuous green/yellow transmission window (500 - 640 nm)
  const kCab_green =
    wl >= 500 && wl <= 640
      ? 0.0032 + 0.0028 * Math.exp(-Math.pow((wl - 550) / 45, 2))
      : 0;
  const kCab = kCab_blue + kCab_uv + kCab_red + kCab_green;

  // 2. Carotenoids (peak 450 - 485 nm, smooth falloff by 530 nm)
  const kCarot = wl < 530 ? 0.048 * Math.exp(-Math.pow((wl - 470) / 32, 2)) : 0;

  // 3. Liquid water absorption coefficients (peaking at 975, 1195, 1450, 1940, and 2450 nm)
  // Continuous physical water absorption background connecting NIR to SWIR
  const kw_base =
    wl >= 700 ? 0.010 + 0.045 * Math.pow((wl - 700) / 1800, 2) : 0.0008;
  const kw970 = 0.44 * Math.exp(-Math.pow((wl - 975) / 38, 2));
  const kw1200 = 1.35 * Math.exp(-Math.pow((wl - 1195) / 48, 2));
  const kw1450 = 28.0 * Math.exp(-Math.pow((wl - 1450) / 68, 2));
  const kw1940 = 82.0 * Math.exp(-Math.pow((wl - 1940) / 75, 2));
  const kw2450 = 24.0 * Math.exp(-Math.pow((wl - 2450) / 90, 2));
  const kWater = kw_base + kw970 + kw1200 + kw1450 + kw1940 + kw2450;

  // 4. Dry matter (cellulose, hemicellulose, lignin, protein)
  const kd_base = 0.004 + 0.005 * Math.max(0, (wl - 1000) / 1500);
  const kd1680 = 0.018 * Math.exp(-Math.pow((wl - 1680) / 85, 2));
  const kd2100 = 0.030 * Math.exp(-Math.pow((wl - 2120) / 65, 2));
  const kd2300 = 0.040 * Math.exp(-Math.pow((wl - 2310) / 75, 2));
  const kDry = kd_base + kd1680 + kd2100 + kd2300;

  return { kCab, kCarot, kWater, kDry };
}

/**
 * Run PROSAIL simulation across 350 - 2500 nm range
 */
export function simulateRTM(params: RTMParameters): RTMSimulationResult {
  const step = 5;
  const minWl = 350;
  const maxWl = 2500;
  const count = Math.floor((maxWl - minWl) / step) + 1;

  const wavelengths: number[] = new Array(count);
  const canopyReflectance: number[] = new Array(count);
  const leafReflectance: number[] = new Array(count);
  const leafTransmittance: number[] = new Array(count);
  const soilReflectance: number[] = new Array(count);

  const solarZenithRad = (params.solarZenithAngle * Math.PI) / 180;
  const cosZenith = Math.max(0.2, Math.cos(solarZenithRad));

  // Canopy extinction coefficient based on architecture
  let gFactor = 0.5; // spherical
  if (params.canopyArchitecture === 'planophile') {
    gFactor = Math.cos(solarZenithRad); // horizontal leaves intercept more nadir light
  } else if (params.canopyArchitecture === 'erectophile') {
    gFactor = (2 / Math.PI) * Math.sin(solarZenithRad); // vertical leaves
  }
  const kExtinction = Math.max(0.3, gFactor / cosZenith);

  // Approximate LAI from canopy cover: Cover = 1 - exp(-k * LAI) => LAI = -ln(1 - cover) / k
  const effectiveCover = Math.min(0.99, Math.max(0.05, params.canopyCover));
  const simulatedLAI = -Math.log(1 - effectiveCover) / Math.max(0.5, kExtinction);

  // Optical constant parameters for PROSPECT Stokes plate model
  const r12 = 0.046; // Outer Fresnel boundary reflection
  const r21 = 0.492; // Inner diffuse boundary reflection
  const t12 = 1.0 - r12;
  const t21 = 1.0 - r21;
  const N = Math.max(1.0, params.leafStructureN);

  for (let i = 0; i < count; i++) {
    const wl = minWl + i * step;
    wavelengths[i] = wl;

    // 1. Soil background reflectance
    const rSoil = getSoilBaseReflectance(wl, params.soilType, params.soilBrightness);
    soilReflectance[i] = Number(rSoil.toFixed(4));

    // 2. Leaf optical properties via PROSPECT Stokes plate equations
    const { kCab, kCarot, kWater, kDry } = getLeafAbsorptionCoefficients(wl);

    // Total absorption coefficient k(lambda)
    const totalAbs =
      (params.leafChlorophyll * kCab +
        params.carotenoids * kCarot +
        params.leafWaterContent * kWater +
        params.dryMatterContent * kDry * 100) /
      N;

    // Transmittance through single elementary mesophyll layer: tau = exp(-k)
    const tau = Math.exp(-Math.max(0.00005, totalAbs));

    // Single plate Stokes equations (Jacquemoud & Baret 1990)
    const denom1 = 1.0 - r21 * r21 * tau * tau;
    const R1 = r12 + (t12 * t21 * r21 * tau * tau) / denom1;
    const T1 = (t12 * t21 * tau) / denom1;

    // Multiple scattering through N mesophyll plates
    let RN: number;
    let TN: number;

    if (Math.abs(R1 + T1 - 1.0) < 1e-4) {
      // Conservative scattering limit (zero absorption)
      RN = (N * R1) / (1.0 + (N - 1.0) * R1);
      TN = (1.0 - R1) / (1.0 + (N - 1.0) * R1);
    } else {
      // General absorbing medium (Stokes equations for non-integer N)
      const alpha = (1.0 + R1 * R1 - T1 * T1) / (2.0 * R1);
      const beta = (1.0 - R1 * R1 + T1 * T1) / (2.0 * T1);
      const da = Math.sqrt(Math.max(0, alpha * alpha - 1.0));
      const db = Math.sqrt(Math.max(0, beta * beta - 1.0));
      const a = alpha + da;
      const b = beta + db;

      const bN = Math.pow(b, N);
      const bNegN = Math.pow(b, -N);
      const denomN = Math.max(1e-6, a * a * bN - bNegN);
      RN = (a * (bN - bNegN)) / denomN;
      TN = (a * a - 1.0) / denomN;
    }

    // Natural structural cell wall Rayleigh/Mie scattering dispersion across 350-2500 nm
    const dispersion = 1.0 - 0.06 * ((wl - 800) / 1000);
    const finalRLeaf = Math.max(0.015, Math.min(0.70, RN * dispersion));
    const finalTLeaf = Math.max(0.010, Math.min(0.70, TN * dispersion));

    leafReflectance[i] = Number(finalRLeaf.toFixed(4));
    leafTransmittance[i] = Number(finalTLeaf.toFixed(4));

    // 3. Canopy Radiative Transfer (4SAIL analytical formulation)
    // Direct beam canopy transmission: P0 = exp(-kExt * LAI)
    const p0 = Math.exp(-kExtinction * simulatedLAI);

    // Diffuse attenuation coefficient m and infinite canopy reflectance rInf
    const absCanopy = Math.max(0.001, 1.0 - finalRLeaf - finalTLeaf);
    const diffCanopy = Math.max(0.001, 1.0 - finalRLeaf + finalTLeaf);
    const m = Math.sqrt(absCanopy * diffCanopy);
    const rInf = (1.0 - m) / (1.0 + m);

    // Canopy top-of-canopy reflectance (vegetation + soil transmitted + diffuse interaction)
    const rVeg = rInf * (1.0 - p0);
    const rSoilTrans = rSoil * p0 * p0;
    const rDiffuse = 2.0 * rInf * rSoil * p0 * (1.0 - p0);

    const rTotal = Math.max(0.01, Math.min(0.95, rVeg + rSoilTrans + rDiffuse));
    canopyReflectance[i] = Number(rTotal.toFixed(4));
  }

  // Calculate standard Vegetation Indices from simulated canopy spectrum
  const getReflAt = (targetWl: number): number => {
    const idx = Math.min(count - 1, Math.max(0, Math.round((targetWl - minWl) / step)));
    return canopyReflectance[idx];
  };

  const r480 = getReflAt(480);
  const r550 = getReflAt(550);
  const r680 = getReflAt(680);
  const r780 = getReflAt(780);
  const r800 = getReflAt(800);
  const r860 = getReflAt(860);
  const r970 = getReflAt(970);
  const r1240 = getReflAt(1240);

  // NDVI
  const ndvi = (r800 - r680) / Math.max(0.001, r800 + r680);

  // Enhanced Vegetation Index (EVI)
  const evi = 2.5 * (r800 - r680) / Math.max(0.01, r800 + 6.0 * r680 - 7.5 * r480 + 1.0);

  // Normalized Difference Water Index (NDWI - Gao 1996)
  const ndwi = (r860 - r1240) / Math.max(0.001, r860 + r1240);

  // Soil Adjusted Vegetation Index (SAVI, L = 0.5)
  const savi = ((r800 - r680) * 1.5) / Math.max(0.001, r800 + r680 + 0.5);

  // Green Chlorophyll Index (CI_green = R780/R550 - 1)
  const ciGreen = (r780 / Math.max(0.01, r550)) - 1.0;

  // Red Edge Position (REP): find wavelength between 680 and 750 nm with maximum first derivative
  let maxDeriv = -1;
  let repWl = 705;
  for (let w = 680; w <= 745; w += 5) {
    const rNext = getReflAt(w + 5);
    const rPrev = getReflAt(w - 5);
    const deriv = (rNext - rPrev) / 10;
    if (deriv > maxDeriv) {
      maxDeriv = deriv;
      repWl = w;
    }
  }

  return {
    wavelengths,
    canopyReflectance,
    leafReflectance,
    leafTransmittance,
    soilReflectance,
    indices: {
      ndvi: Number(Math.max(-1, Math.min(1, ndvi)).toFixed(3)),
      evi: Number(Math.max(-1, Math.min(1.5, evi)).toFixed(3)),
      ndwi: Number(Math.max(-1, Math.min(1, ndwi)).toFixed(3)),
      rep: repWl,
      ciGreen: Number(Math.max(0, ciGreen).toFixed(2)),
      savi: Number(Math.max(-1, Math.min(1, savi)).toFixed(3))
    }
  };
}
