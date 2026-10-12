/**
 * Metadata, Tooltip Definitions, Reference Comparison Libraries, and Sensitivity Analysis Profiles
 * for the Radiative Transfer Model (RTM PROSPECT-D + 4SAIL) SpectraExplorer.
 */
import { interpolatePCHIP } from '../utils/spline';

export interface RTMParamTooltip {
  id: string;
  name: string;
  symbol: string;
  unit: string;
  typicalRange: string;
  physicalMechanism: string;
  affectedWavelengths: string;
  remoteSensingBands: string;
  directionEffect: string;
}

export const RTM_PARAMETER_TOOLTIPS: Record<string, RTMParamTooltip> = {
  leafChlorophyll: {
    id: 'leafChlorophyll',
    name: 'Leaf Chlorophyll Content (Chl a+b)',
    symbol: 'C_{ab}',
    unit: 'μg/cm²',
    typicalRange: '10 – 80 μg/cm² (crop default: 45)',
    physicalMechanism:
      'Dominant photosynthetic pigment. Strong electronic transition absorption in blue (Soret band ~435 nm) and red (Q-band ~675 nm). The unabsorbed green transmission creates the 550 nm reflectance peak. The absorption cutoff between 680 and 750 nm forms the sharp Red Edge inflection.',
    affectedWavelengths: '400–740 nm (Visible Blue, Green, Red) & Red Edge (680–740 nm)',
    remoteSensingBands: 'Sentinel-2 B4 (Red 665nm), B5 (Red Edge 705nm), B6 (740nm); Landsat 8/9 B4 (Red)',
    directionEffect:
      'Increasing Cab deepens the 675 nm absorption well, pushes the Red Edge Position (REP) toward longer wavelengths ("red-shift"), and sharpens vegetative indices like NDVI, EVI, and CI_Green.'
  },
  canopyCover: {
    id: 'canopyCover',
    name: 'Fractional Canopy Cover & Leaf Area Index (LAI)',
    symbol: 'f_{cover} \\ / \\ \\text{LAI}',
    unit: '% / m²/m²',
    typicalRange: '5% – 100% (LAI: 0.1 – 6.5 m²/m²)',
    physicalMechanism:
      'Governs fractional photon interception via Beer-Lambert-SAIL gap probability P0 = exp(-k·LAI). In dense canopies, multiple scattering between stacked foliar layers amplifies near-infrared (750–1100 nm) reflection far above single-leaf albedo, while soil background radiance is progressively extinguished.',
    affectedWavelengths: '750–1100 nm (NIR Multiple Scattering Plateau) & 400–700 nm (Soil-Veg Contrast)',
    remoteSensingBands: 'Sentinel-2 B8/B8A (NIR), Landsat 8/9 B5 (NIR), MODIS NIR',
    directionEffect:
      'Higher LAI / cover dramatically increases the NIR plateau (multiple scattering) while suppressing soil background visibility. Beyond LAI > 4, visible bands saturate while NIR/SWIR indices continue to respond.'
  },
  leafWaterContent: {
    id: 'leafWaterContent',
    name: 'Equivalent Water Thickness (EWT)',
    symbol: 'C_w',
    unit: 'cm or g/cm²',
    typicalRange: '0.005 – 0.045 cm (turgid: ~0.020, stressed: <0.010)',
    physicalMechanism:
      'Liquid water within foliar mesophyll cells. O-H covalent bond stretching and bending overtones produce deep diagnostic liquid water absorption troughs centered at 970 nm, 1200 nm, 1450 nm, and 1940 nm.',
    affectedWavelengths: '950–1000 nm, 1150–1250 nm, 1400–1500 nm, and 1900–2100 nm (SWIR)',
    remoteSensingBands: 'Sentinel-2 B11 (SWIR 1610nm), B12 (2190nm); Landsat 8/9 B6/B7 (SWIR)',
    directionEffect:
      'Higher Cw carves out deeper absorption valleys in the SWIR spectrum (lowering SWIR reflectance) and boosts water indices like NDWI and NDII. Stressed/desiccated foliage displays high SWIR peaks.'
  },
  dryMatterContent: {
    id: 'dryMatterContent',
    name: 'Leaf Dry Matter Content (Specific Leaf Weight)',
    symbol: 'C_m',
    unit: 'g/cm²',
    typicalRange: '0.002 – 0.025 g/cm² (herbaceous: ~0.005, sclerophyll: >0.015)',
    physicalMechanism:
      'Foliar structural biopolymers: cellulose, lignin, hemicellulose, and proteins. Dominates shortwave infrared absorption in dry or senescent foliage with harmonic overtone doublets near 1680 nm, 2100 nm, and 2300 nm.',
    affectedWavelengths: '1600–1800 nm & 2100–2350 nm (SWIR Lignin/Cellulose)',
    remoteSensingBands: 'Sentinel-2 B12 (2190nm), Landsat 8/9 B7 (SWIR-2)',
    directionEffect:
      'Higher Cm decreases SWIR reflectance in dry/senescent foliage and broadens absorption dips at 2100 nm and 2300 nm, key for Non-Photosynthetic Vegetation (NPV) and Cellulose Absorption Index (CAI).'
  },
  carotenoids: {
    id: 'carotenoids',
    name: 'Carotenoid Content (Carotenes & Xanthophylls)',
    symbol: 'C_{xc}',
    unit: 'μg/cm²',
    typicalRange: '2 – 25 μg/cm² (healthy: ~8, senescent: >15)',
    physicalMechanism:
      'Accessory photosynthetic pigments responsible for non-photochemical quenching (NPQ) and photoprotection. Conjugated polyene chains absorb photons strictly in the 400–500 nm blue-cyan region without absorbing in the red (600–700 nm).',
    affectedWavelengths: '400–520 nm (Blue-Cyan / Photoprotective Window)',
    remoteSensingBands: 'Sentinel-2 B1 (Coastal Aerosol 443nm), B2 (Blue 490nm)',
    directionEffect:
      'Elevated carotenoids relative to chlorophyll cause foliar yellowing/browning during senescence or severe photo-inhibition by suppressing blue reflection while red reflection remains unabsorbed.'
  },
  leafStructureN: {
    id: 'leafStructureN',
    name: 'Mesophyll Structural Parameter',
    symbol: 'N',
    unit: 'layers (unitless)',
    typicalRange: '1.0 – 2.5 (monocot: 1.0–1.3, dicot: 1.4–1.8, conifer needle: >2.2)',
    physicalMechanism:
      'Stokes optical formulation representing the effective number of compact cell wall layers separated by air cavities. Each refractive index boundary (n_cell ≈ 1.42 vs n_air = 1.00) causes Fresnel reflection and diffuse scattering within the leaf interior.',
    affectedWavelengths: '750–1300 nm (NIR Plateau Baseline) & Transmittance Ratio',
    remoteSensingBands: 'NIR bands across all optical sensors',
    directionEffect:
      'Higher N multiplies internal refractive reflections, raising single-leaf NIR reflectance and decreasing leaf transmittance, while thickening the optical scattering pathlength.'
  },
  canopyArchitecture: {
    id: 'canopyArchitecture',
    name: 'Canopy Leaf Angle Distribution (LAD)',
    symbol: '\\text{LAD}',
    unit: 'Planophile / Spherical / Erectophile',
    typicalRange: 'Planophile (horizontal), Spherical (uniform), Erectophile (vertical)',
    physicalMechanism:
      'Leaf orientation geometry dictates the extinction coefficient k_ext(θs) and photon penetration depth. Planophile canopies (horizontal leaves) maximize nadir sun interception; erectophile canopies (vertical leaves, like grasses) allow deeper light penetration into lower canopy strata.',
    affectedWavelengths: 'All wavelengths via canopy extinction coefficient k_ext and multiple scattering',
    remoteSensingBands: 'Multi-angular observations, CHRIS/PROBA, BRDF MODIS/VIIRS',
    directionEffect:
      'Planophile canopies exhibit higher nadir top-of-canopy reflectance and earlier saturation; erectophile canopies permit deeper illumination and reduce nadir shadow fractions.'
  },
  soilBrightness: {
    id: 'soilBrightness',
    name: 'Soil Background Brightness & Substrate Type',
    symbol: 'R_{soil} \\times \\text{Scale}',
    unit: 'Multiplier (0.5x – 1.5x)',
    typicalRange: '0.5x (Moist/Organic) – 1.5x (Bright Arid Sand)',
    physicalMechanism:
      'Represents the lower optical boundary condition in 4SAIL. For non-closed canopies (cover < 85%), direct beam sunlight illuminates soil gaps, and reflected soil radiance transmits upward through canopy voids.',
    affectedWavelengths: 'Visible to SWIR (broadband background baseline shifts)',
    remoteSensingBands: 'SAVI, MSAVI, and spectral mixture analysis (SMA) soil endmember',
    directionEffect:
      'Bright soil backgrounds artificially elevate red reflectance, which can distort NDVI in sparse vegetation. Using SAVI (Soil Adjusted Vegetation Index) dampens this soil brightness perturbation.'
  },
  solarZenithAngle: {
    id: 'solarZenithAngle',
    name: 'Solar Zenith Angle (Illumination Geometry)',
    symbol: '\\theta_s',
    unit: 'degrees (°)',
    typicalRange: '15° – 65° (nadir sun to oblique afternoon)',
    physicalMechanism:
      'Controls the incident solar optical pathlength through the canopy layer (1 / cos θs). Oblique sun angles increase the effective pathlength, enhancing interception by upper leaves and casting deeper self-shadowing.',
    affectedWavelengths: 'Entire optical spectrum (BRDF directional scale)',
    remoteSensingBands: 'BRDF corrections (Ross-Thick / Li-Sparse kernels)',
    directionEffect:
      'Steeper zenith angles (lower sun) increase mutual canopy shading and forward/backward scattering contrast (hotspot vs dark hotspot phenomena).'
  }
};

// ============================================================================
// SENSITIVITY ANALYSIS PROFILES
// ============================================================================

export interface SensitiveRegion {
  startWl: number;
  endWl: number;
  label: string;
  severity: 'primary' | 'secondary';
  color: string;
  description: string;
}

export interface ParameterSensitivityProfile {
  paramKey: string;
  paramName: string;
  symbol: string;
  unit: string;
  regions: SensitiveRegion[];
  primaryFeature: string;
  governingEquation: string;
  satelliteImplications: string;
  pedagogicalTakeaway: string;
}

export const SENSITIVITY_PROFILES: Record<string, ParameterSensitivityProfile> = {
  leafChlorophyll: {
    paramKey: 'leafChlorophyll',
    paramName: 'Chlorophyll Content',
    symbol: 'C_{ab}',
    unit: 'μg/cm²',
    regions: [
      {
        startWl: 650,
        endWl: 750,
        label: 'Red Absorption Well & Red Edge Shift',
        severity: 'primary',
        color: '#ef4444',
        description: 'Chl-a absorption peak at 675 nm. The steep slope inflection point (Red Edge Position REP) shifts from 700 to 730 nm as Cab increases.'
      },
      {
        startWl: 410,
        endWl: 470,
        label: 'Blue Soret Absorption Band',
        severity: 'secondary',
        color: '#3b82f6',
        description: 'Strong electronic transition Chl-a/b absorption; quickly saturates even at low chlorophyll levels.'
      },
      {
        startWl: 530,
        endWl: 570,
        label: 'Green Reflectance Peak (550 nm)',
        severity: 'secondary',
        color: '#22c55e',
        description: 'Transmittance window between blue and red absorption. High chlorophyll slightly depresses the peak.'
      }
    ],
    primaryFeature: 'Red Edge Position (REP) Shift (690–740 nm)',
    governingEquation: 'k_{Cab}(\\lambda) = \\text{PROSPECT-D specific extinction coefficient}',
    satelliteImplications: 'Directly monitored by Sentinel-2 Red Edge bands B5 (705 nm), B6 (740 nm) and Chlorophyll Indices (CI_Green, CI_RedEdge).',
    pedagogicalTakeaway: 'Notice how changing Cab strongly modulates the Red Edge slope (690–740 nm) while leaving the NIR plateau above 800 nm virtually unchanged!'
  },
  canopyCover: {
    paramKey: 'canopyCover',
    paramName: 'Canopy Cover / LAI',
    symbol: 'f_{cover} \\ / \\ \\text{LAI}',
    unit: '% / m²/m²',
    regions: [
      {
        startWl: 750,
        endWl: 1100,
        label: 'NIR Multiple Scattering Amplification',
        severity: 'primary',
        color: '#10b981',
        description: 'In multi-layer canopies, transmitted and scattered NIR photons reflect off underlying foliage, boosting top-of-canopy reflectance up to 60%+.'
      },
      {
        startWl: 630,
        endWl: 690,
        label: 'Visible Red Canopy Extinction',
        severity: 'secondary',
        color: '#f97316',
        description: 'Direct soil reflection is masked as canopy closes, lowering overall top-of-canopy red reflectance.'
      }
    ],
    primaryFeature: 'NIR Multiple Scattering Plateau (750–1100 nm)',
    governingEquation: 'P_0 = \\exp(-k_{ext} \\cdot \\text{LAI}), \\quad R_{canopy} = R_{single} \\cdot (1 + \\gamma \\cdot \\text{LAI})',
    satelliteImplications: 'Basis for NDVI, EVI, and LAI inversion algorithms on Sentinel-2, Landsat, and MODIS.',
    pedagogicalTakeaway: 'Single leaves reflect ~45% in the NIR. Stacked canopy layers (high LAI) push top-of-canopy reflectance above 55–65% through multiple internal scattering!'
  },
  leafWaterContent: {
    paramKey: 'leafWaterContent',
    paramName: 'Leaf Water Content (EWT)',
    symbol: 'C_w',
    unit: 'cm',
    regions: [
      {
        startWl: 1400,
        endWl: 1520,
        label: '1450 nm Liquid Water Trough',
        severity: 'primary',
        color: '#0284c7',
        description: 'Strong vibrational overtone absorption of liquid water within leaf mesophyll.'
      },
      {
        startWl: 1900,
        endWl: 2050,
        label: '1940 nm Liquid Water Trough',
        severity: 'primary',
        color: '#0284c7',
        description: 'Fundamental combination water absorption band.'
      },
      {
        startWl: 950,
        endWl: 1000,
        label: '970 nm Weak Water Feature',
        severity: 'secondary',
        color: '#38bdf8',
        description: 'Weak liquid water absorption feature detectable in airborne imaging spectrometers (AVIRIS).'
      },
      {
        startWl: 1180,
        endWl: 1260,
        label: '1200 nm Water Feature',
        severity: 'secondary',
        color: '#38bdf8',
        description: 'Liquid water absorption feature exploited by the Normalized Difference Water Index (NDWI).'
      }
    ],
    primaryFeature: 'SWIR Water Absorption Depressions (1200, 1450, 1940 nm)',
    governingEquation: '\\alpha_w(\\lambda) = \\text{Water specific absorption coefficient in PROSPECT}',
    satelliteImplications: 'Directly captured by Sentinel-2 B11 (1610 nm) and B12 (2190 nm), and Landsat 8 B6/B7 for NDWI drought monitoring.',
    pedagogicalTakeaway: 'Watch the SWIR region (1400–2500 nm) sink as you increase Cw. Turgid crops have low SWIR reflectance; drought-stressed crops reflect brightly in the SWIR.'
  },
  dryMatterContent: {
    paramKey: 'dryMatterContent',
    paramName: 'Dry Matter Content',
    symbol: 'C_m',
    unit: 'g/cm²',
    regions: [
      {
        startWl: 1650,
        endWl: 1750,
        label: 'Cellulose/Lignin SWIR-1 Overtone',
        severity: 'primary',
        color: '#78716c',
        description: 'C-H vibrational overtones of plant structural polymers.'
      },
      {
        startWl: 2100,
        endWl: 2320,
        label: '2100 & 2300 nm Cellulose Doublet (CAI)',
        severity: 'primary',
        color: '#57534e',
        description: 'Diagnostic Cellulose Absorption Index (CAI) absorption features.'
      }
    ],
    primaryFeature: 'Cellulose and Lignin SWIR Absorption Bands (1680, 2100, 2300 nm)',
    governingEquation: 'k_{Cm}(\\lambda) = \\text{PROSPECT dry matter specific absorption}',
    satelliteImplications: 'WorldView-3 SWIR bands and PRISMA / EnMAP hyperspectral missions quantify crop residue cover.',
    pedagogicalTakeaway: 'Dry matter is masked in fresh leaves by liquid water, but dominates senescent crop residue and dry straw spectra.'
  },
  carotenoids: {
    paramKey: 'carotenoids',
    paramName: 'Carotenoids',
    symbol: 'C_{xc}',
    unit: 'μg/cm²',
    regions: [
      {
        startWl: 420,
        endWl: 510,
        label: '450–500 nm Carotenoid Absorption',
        severity: 'primary',
        color: '#eab308',
        description: 'Xanthophyll and beta-carotene light harvesting and photoprotection absorption.'
      }
    ],
    primaryFeature: 'Blue-to-Cyan Absorption (420–510 nm)',
    governingEquation: 'k_{Carot}(\\lambda) = \\text{PROSPECT carotenoid specific absorption}',
    satelliteImplications: 'Photochemical Reflectance Index (PRI = (R531 - R570)/(R531 + R570)) and Plant Senescence Reflectance Index (PSRI).',
    pedagogicalTakeaway: 'When chlorophyll drops while carotenoids remain high, the leaf yellows because red light is reflected while blue light is absorbed.'
  },
  leafStructureN: {
    paramKey: 'leafStructureN',
    paramName: 'Mesophyll Structure (N)',
    symbol: 'N',
    unit: 'layers',
    regions: [
      {
        startWl: 750,
        endWl: 1300,
        label: 'Single-Leaf NIR Scattering Ratio',
        severity: 'primary',
        color: '#059669',
        description: 'Number of air-cell wall boundaries determines diffuse internal scattering vs transmittance.'
      }
    ],
    primaryFeature: 'Single Leaf NIR Reflectance-to-Transmittance Partitioning',
    governingEquation: 'R_{leaf}(N, \\lambda), T_{leaf}(N, \\lambda) \\text{ from Stokes equations}',
    satelliteImplications: 'Distinguishes monocot grasses (low N ~ 1.1) from dicot broadleaves (N ~ 1.5) and thick needles (N > 2.2).',
    pedagogicalTakeaway: 'Increasing N boosts single-leaf NIR reflectance and reduces leaf transmittance by adding internal optical reflecting boundaries.'
  },
  soilBrightness: {
    paramKey: 'soilBrightness',
    paramName: 'Soil Substrate & Brightness',
    symbol: 'R_{soil}',
    unit: 'scale',
    regions: [
      {
        startWl: 400,
        endWl: 2500,
        label: 'Canopy Transmission Soil Gap Radiance',
        severity: 'primary',
        color: '#92400e',
        description: 'Direct and diffuse soil radiance transmitting through canopy gaps: R_total = R_veg + R_soil * P0^2.'
      }
    ],
    primaryFeature: 'Broadband Baseline Soil Transmission (Especially when Cover < 80%)',
    governingEquation: 'R_{transmitted} = R_{soil} \\cdot P_0^2',
    satelliteImplications: 'Necessitates Soil Adjusted Vegetation Index (SAVI = (NIR - Red)/(NIR + Red + L)*(1+L)).',
    pedagogicalTakeaway: 'In open crops, bright soil inflates visible red reflectance and deflates NDVI, showing why soil adjustment (SAVI) is crucial.'
  }
};

// ============================================================================
// REFERENCE COMPARISON DATASETS (FOR COMPARE OVERLAY)
// ============================================================================

export interface ReferenceDatasetItem {
  id: string;
  name: string;
  type: 'Measured Foliage' | 'Canopy Field' | 'Substrate' | 'Calibration Standard';
  description: string;
  source: string;
  color: string;
  dataPoints: { wavelength: number; reflectance: number }[];
}

export const REFERENCE_COMPARISON_DATASETS: ReferenceDatasetItem[] = [
  {
    id: 'usgs_deciduous_leaf',
    name: 'USGS Deciduous Green Leaf (Quercus robur)',
    type: 'Measured Foliage',
    description: 'Laboratory ASD spectrometer measurement of a fresh sunlit deciduous oak leaf. Exhibits optimal chlorophyll absorption at 675 nm and classical Red Edge.',
    source: 'USGS Spectral Library Splib07a',
    color: '#9333ea', // purple
    dataPoints: [
      { wavelength: 400, reflectance: 0.045 },
      { wavelength: 450, reflectance: 0.042 },
      { wavelength: 500, reflectance: 0.065 },
      { wavelength: 550, reflectance: 0.145 },
      { wavelength: 600, reflectance: 0.082 },
      { wavelength: 650, reflectance: 0.052 },
      { wavelength: 675, reflectance: 0.038 },
      { wavelength: 700, reflectance: 0.125 },
      { wavelength: 720, reflectance: 0.320 },
      { wavelength: 750, reflectance: 0.485 },
      { wavelength: 800, reflectance: 0.525 },
      { wavelength: 850, reflectance: 0.530 },
      { wavelength: 900, reflectance: 0.522 },
      { wavelength: 970, reflectance: 0.470 },
      { wavelength: 1050, reflectance: 0.510 },
      { wavelength: 1150, reflectance: 0.480 },
      { wavelength: 1200, reflectance: 0.410 },
      { wavelength: 1250, reflectance: 0.440 },
      { wavelength: 1300, reflectance: 0.420 },
      { wavelength: 1350, reflectance: 0.350 },
      { wavelength: 1400, reflectance: 0.180 },
      { wavelength: 1450, reflectance: 0.080 },
      { wavelength: 1500, reflectance: 0.180 },
      { wavelength: 1550, reflectance: 0.280 },
      { wavelength: 1650, reflectance: 0.320 },
      { wavelength: 1750, reflectance: 0.290 },
      { wavelength: 1850, reflectance: 0.150 },
      { wavelength: 1900, reflectance: 0.070 },
      { wavelength: 1940, reflectance: 0.040 },
      { wavelength: 2020, reflectance: 0.120 },
      { wavelength: 2100, reflectance: 0.180 },
      { wavelength: 2200, reflectance: 0.160 },
      { wavelength: 2300, reflectance: 0.120 },
      { wavelength: 2400, reflectance: 0.080 },
      { wavelength: 2500, reflectance: 0.050 }
    ]
  },
  {
    id: 'usda_winter_wheat',
    name: 'Winter Wheat Field Canopy (Healthy)',
    type: 'Canopy Field',
    description: 'In-situ field spectrometer measurement of a dense vegetative winter wheat canopy (LAI ~ 3.8) measured with an ASD FieldSpec 4 under cloud-free direct solar illumination.',
    source: 'USDA Agricultural Research Service (ARS)',
    color: '#0284c7', // sky blue
    dataPoints: [
      { wavelength: 400, reflectance: 0.038 },
      { wavelength: 450, reflectance: 0.035 },
      { wavelength: 500, reflectance: 0.058 },
      { wavelength: 550, reflectance: 0.118 },
      { wavelength: 600, reflectance: 0.068 },
      { wavelength: 650, reflectance: 0.042 },
      { wavelength: 675, reflectance: 0.030 },
      { wavelength: 700, reflectance: 0.110 },
      { wavelength: 720, reflectance: 0.340 },
      { wavelength: 750, reflectance: 0.560 },
      { wavelength: 800, reflectance: 0.615 },
      { wavelength: 850, reflectance: 0.620 },
      { wavelength: 900, reflectance: 0.605 },
      { wavelength: 970, reflectance: 0.540 },
      { wavelength: 1050, reflectance: 0.580 },
      { wavelength: 1150, reflectance: 0.530 },
      { wavelength: 1200, reflectance: 0.460 },
      { wavelength: 1250, reflectance: 0.490 },
      { wavelength: 1300, reflectance: 0.470 },
      { wavelength: 1350, reflectance: 0.380 },
      { wavelength: 1400, reflectance: 0.200 },
      { wavelength: 1450, reflectance: 0.095 },
      { wavelength: 1500, reflectance: 0.210 },
      { wavelength: 1550, reflectance: 0.310 },
      { wavelength: 1650, reflectance: 0.350 },
      { wavelength: 1750, reflectance: 0.315 },
      { wavelength: 1850, reflectance: 0.170 },
      { wavelength: 1900, reflectance: 0.085 },
      { wavelength: 1940, reflectance: 0.055 },
      { wavelength: 2020, reflectance: 0.130 },
      { wavelength: 2100, reflectance: 0.195 },
      { wavelength: 2200, reflectance: 0.175 },
      { wavelength: 2300, reflectance: 0.130 },
      { wavelength: 2400, reflectance: 0.085 },
      { wavelength: 2500, reflectance: 0.055 }
    ]
  },
  {
    id: 'usgs_conifer_needle',
    name: 'Ponderosa Pine Needle Foliage (Pinus ponderosa)',
    type: 'Measured Foliage',
    description: 'Thick coniferous needle bundle showing high mesophyll N, subdued green peak (0.09), and lower NIR plateau (~0.38) due to internal needle self-shadowing and lignin/resin density.',
    source: 'USGS Spectral Library Version 7',
    color: '#15803d', // green
    dataPoints: [
      { wavelength: 400, reflectance: 0.035 },
      { wavelength: 450, reflectance: 0.032 },
      { wavelength: 500, reflectance: 0.048 },
      { wavelength: 550, reflectance: 0.092 },
      { wavelength: 600, reflectance: 0.058 },
      { wavelength: 650, reflectance: 0.040 },
      { wavelength: 675, reflectance: 0.032 },
      { wavelength: 700, reflectance: 0.088 },
      { wavelength: 720, reflectance: 0.220 },
      { wavelength: 750, reflectance: 0.360 },
      { wavelength: 800, reflectance: 0.385 },
      { wavelength: 850, reflectance: 0.390 },
      { wavelength: 900, reflectance: 0.380 },
      { wavelength: 970, reflectance: 0.340 },
      { wavelength: 1050, reflectance: 0.370 },
      { wavelength: 1150, reflectance: 0.340 },
      { wavelength: 1200, reflectance: 0.290 },
      { wavelength: 1250, reflectance: 0.310 },
      { wavelength: 1300, reflectance: 0.295 },
      { wavelength: 1350, reflectance: 0.240 },
      { wavelength: 1400, reflectance: 0.130 },
      { wavelength: 1450, reflectance: 0.065 },
      { wavelength: 1500, reflectance: 0.130 },
      { wavelength: 1550, reflectance: 0.210 },
      { wavelength: 1650, reflectance: 0.240 },
      { wavelength: 1750, reflectance: 0.215 },
      { wavelength: 1850, reflectance: 0.110 },
      { wavelength: 1900, reflectance: 0.055 },
      { wavelength: 1940, reflectance: 0.035 },
      { wavelength: 2020, reflectance: 0.085 },
      { wavelength: 2100, reflectance: 0.135 },
      { wavelength: 2200, reflectance: 0.120 },
      { wavelength: 2300, reflectance: 0.095 },
      { wavelength: 2400, reflectance: 0.065 },
      { wavelength: 2500, reflectance: 0.045 }
    ]
  },
  {
    id: 'drought_stressed_crop',
    name: 'Field-Measured Drought-Stressed Maize (Corn)',
    type: 'Canopy Field',
    description: 'Corn canopy under severe soil moisture deficit. Marked by lower chlorophyll, elevated red reflectance, lower NIR multiple scattering, and elevated SWIR reflectance (diminished water absorption troughs).',
    source: 'CIMMYT AgMIP Field Trials',
    color: '#d97706', // amber
    dataPoints: [
      { wavelength: 400, reflectance: 0.065 },
      { wavelength: 450, reflectance: 0.068 },
      { wavelength: 500, reflectance: 0.095 },
      { wavelength: 550, reflectance: 0.165 },
      { wavelength: 600, reflectance: 0.120 },
      { wavelength: 650, reflectance: 0.095 },
      { wavelength: 675, reflectance: 0.082 },
      { wavelength: 700, reflectance: 0.170 },
      { wavelength: 720, reflectance: 0.310 },
      { wavelength: 750, reflectance: 0.420 },
      { wavelength: 800, reflectance: 0.455 },
      { wavelength: 850, reflectance: 0.460 },
      { wavelength: 900, reflectance: 0.450 },
      { wavelength: 970, reflectance: 0.425 },
      { wavelength: 1050, reflectance: 0.450 },
      { wavelength: 1150, reflectance: 0.435 },
      { wavelength: 1200, reflectance: 0.395 },
      { wavelength: 1250, reflectance: 0.420 },
      { wavelength: 1300, reflectance: 0.410 },
      { wavelength: 1350, reflectance: 0.340 },
      { wavelength: 1400, reflectance: 0.260 },
      { wavelength: 1450, reflectance: 0.220 },
      { wavelength: 1500, reflectance: 0.300 },
      { wavelength: 1550, reflectance: 0.390 },
      { wavelength: 1650, reflectance: 0.430 },
      { wavelength: 1750, reflectance: 0.400 },
      { wavelength: 1850, reflectance: 0.280 },
      { wavelength: 1900, reflectance: 0.210 },
      { wavelength: 1940, reflectance: 0.180 },
      { wavelength: 2020, reflectance: 0.240 },
      { wavelength: 2100, reflectance: 0.320 },
      { wavelength: 2200, reflectance: 0.295 },
      { wavelength: 2300, reflectance: 0.230 },
      { wavelength: 2400, reflectance: 0.160 },
      { wavelength: 2500, reflectance: 0.110 }
    ]
  },
  {
    id: 'senescent_straw_npv',
    name: 'Senescent Crop Residue / Dry Straw (NPV)',
    type: 'Canopy Field',
    description: 'Post-harvest wheat residue. Demonstrates complete loss of the 680 nm chlorophyll absorption trough and pronounced cellulose/lignin absorption dips at 2100 nm and 2300 nm.',
    source: 'USDA Agricultural Research Service (ARS)',
    color: '#ca8a04', // yellow-brown
    dataPoints: [
      { wavelength: 400, reflectance: 0.12 },
      { wavelength: 450, reflectance: 0.15 },
      { wavelength: 500, reflectance: 0.20 },
      { wavelength: 550, reflectance: 0.26 },
      { wavelength: 600, reflectance: 0.32 },
      { wavelength: 650, reflectance: 0.38 },
      { wavelength: 675, reflectance: 0.40 },
      { wavelength: 700, reflectance: 0.43 },
      { wavelength: 750, reflectance: 0.47 },
      { wavelength: 800, reflectance: 0.50 },
      { wavelength: 900, reflectance: 0.53 },
      { wavelength: 1050, reflectance: 0.56 },
      { wavelength: 1200, reflectance: 0.58 },
      { wavelength: 1450, reflectance: 0.42 },
      { wavelength: 1650, reflectance: 0.59 },
      { wavelength: 1800, reflectance: 0.56 },
      { wavelength: 1940, reflectance: 0.38 },
      { wavelength: 2100, reflectance: 0.42 },
      { wavelength: 2150, reflectance: 0.52 },
      { wavelength: 2200, reflectance: 0.53 },
      { wavelength: 2300, reflectance: 0.39 },
      { wavelength: 2350, reflectance: 0.48 },
      { wavelength: 2450, reflectance: 0.35 },
      { wavelength: 2500, reflectance: 0.28 }
    ]
  },
  {
    id: 'agricultural_silt_loam',
    name: 'Agricultural Silt Loam Soil (Moist Topsoil)',
    type: 'Substrate',
    description: 'Temperate agricultural soil substrate. Shows smooth monotonic upward curve across visible-SWIR with weak soil water absorption at 1400 nm and 1900 nm.',
    source: 'JPL Soil Library / USDA-NRCS',
    color: '#854d0e', // dark amber
    dataPoints: [
      { wavelength: 400, reflectance: 0.08 },
      { wavelength: 450, reflectance: 0.10 },
      { wavelength: 500, reflectance: 0.12 },
      { wavelength: 550, reflectance: 0.15 },
      { wavelength: 600, reflectance: 0.18 },
      { wavelength: 650, reflectance: 0.21 },
      { wavelength: 700, reflectance: 0.23 },
      { wavelength: 800, reflectance: 0.26 },
      { wavelength: 900, reflectance: 0.27 },
      { wavelength: 1000, reflectance: 0.28 },
      { wavelength: 1200, reflectance: 0.31 },
      { wavelength: 1400, reflectance: 0.22 },
      { wavelength: 1600, reflectance: 0.34 },
      { wavelength: 1800, reflectance: 0.36 },
      { wavelength: 1900, reflectance: 0.24 },
      { wavelength: 2100, reflectance: 0.37 },
      { wavelength: 2200, reflectance: 0.35 },
      { wavelength: 2300, reflectance: 0.36 },
      { wavelength: 2400, reflectance: 0.34 },
      { wavelength: 2500, reflectance: 0.30 }
    ]
  },
  {
    id: 'dry_calcareous_sand',
    name: 'Dry Arid Sandy Calcareous Soil',
    type: 'Substrate',
    description: 'High-albedo arid mineral soil with carbonate absorption near 2340 nm. Serves as a high-contrast soil background for sparse vegetation modeling.',
    source: 'ICRISAT Arid Lands Spectral Library',
    color: '#b45309', // sand amber
    dataPoints: [
      { wavelength: 400, reflectance: 0.18 },
      { wavelength: 450, reflectance: 0.24 },
      { wavelength: 500, reflectance: 0.31 },
      { wavelength: 550, reflectance: 0.37 },
      { wavelength: 600, reflectance: 0.43 },
      { wavelength: 650, reflectance: 0.48 },
      { wavelength: 700, reflectance: 0.52 },
      { wavelength: 800, reflectance: 0.57 },
      { wavelength: 900, reflectance: 0.59 },
      { wavelength: 1000, reflectance: 0.61 },
      { wavelength: 1200, reflectance: 0.63 },
      { wavelength: 1400, reflectance: 0.52 },
      { wavelength: 1600, reflectance: 0.65 },
      { wavelength: 1800, reflectance: 0.66 },
      { wavelength: 1900, reflectance: 0.54 },
      { wavelength: 2100, reflectance: 0.68 },
      { wavelength: 2200, reflectance: 0.66 },
      { wavelength: 2340, reflectance: 0.58 },
      { wavelength: 2400, reflectance: 0.64 },
      { wavelength: 2500, reflectance: 0.58 }
    ]
  },
  {
    id: 'kaolinite_clay',
    name: 'Hydrothermal Kaolinite Clay Mineral',
    type: 'Substrate',
    description: 'High-purity kaolinite standard showing diagnostic Al-OH doublet at 2162 nm and 2208 nm in the SWIR-2 atmospheric window.',
    source: 'USGS Splib07a',
    color: '#06b6d4', // cyan
    dataPoints: [
      { wavelength: 400, reflectance: 0.72 },
      { wavelength: 500, reflectance: 0.78 },
      { wavelength: 600, reflectance: 0.82 },
      { wavelength: 700, reflectance: 0.85 },
      { wavelength: 800, reflectance: 0.87 },
      { wavelength: 900, reflectance: 0.88 },
      { wavelength: 1000, reflectance: 0.89 },
      { wavelength: 1200, reflectance: 0.89 },
      { wavelength: 1400, reflectance: 0.38 },
      { wavelength: 1412, reflectance: 0.32 },
      { wavelength: 1450, reflectance: 0.65 },
      { wavelength: 1600, reflectance: 0.88 },
      { wavelength: 1800, reflectance: 0.86 },
      { wavelength: 1900, reflectance: 0.55 },
      { wavelength: 2000, reflectance: 0.82 },
      { wavelength: 2162, reflectance: 0.48 },
      { wavelength: 2185, reflectance: 0.68 },
      { wavelength: 2208, reflectance: 0.39 },
      { wavelength: 2250, reflectance: 0.76 },
      { wavelength: 2350, reflectance: 0.78 },
      { wavelength: 2450, reflectance: 0.72 },
      { wavelength: 2500, reflectance: 0.64 }
    ]
  },
  {
    id: 'spectralon_standard',
    name: 'NIST Certified Spectralon 99% Diffuse Standard',
    type: 'Calibration Standard',
    description: 'Pure sintered PTFE Lambertian reflectance panel used for in-situ spectrometer white reference optimization.',
    source: 'Labsphere Inc.',
    color: '#64748b', // slate
    dataPoints: [
      { wavelength: 350, reflectance: 0.982 },
      { wavelength: 400, reflectance: 0.988 },
      { wavelength: 500, reflectance: 0.991 },
      { wavelength: 600, reflectance: 0.992 },
      { wavelength: 700, reflectance: 0.992 },
      { wavelength: 800, reflectance: 0.993 },
      { wavelength: 900, reflectance: 0.992 },
      { wavelength: 1000, reflectance: 0.991 },
      { wavelength: 1200, reflectance: 0.990 },
      { wavelength: 1400, reflectance: 0.988 },
      { wavelength: 1600, reflectance: 0.987 },
      { wavelength: 1800, reflectance: 0.984 },
      { wavelength: 2000, reflectance: 0.978 },
      { wavelength: 2150, reflectance: 0.952 },
      { wavelength: 2200, reflectance: 0.965 },
      { wavelength: 2300, reflectance: 0.960 },
      { wavelength: 2400, reflectance: 0.955 },
      { wavelength: 2500, reflectance: 0.948 }
    ]
  }
];

// Monotone Cubic Hermite Spline (PCHIP) interpolation helper for smooth, continuous reflectance
export function interpolateReflectance(
  dataPoints: { wavelength: number; reflectance: number }[],
  targetWl: number
): number {
  return interpolatePCHIP(dataPoints, targetWl);
}

// Side-by-side comparison metrics computation
export interface SpectralComparisonResult {
  rmse: number;
  samDegrees: number;
  mae: number;
  r2: number;
  simNdvi: number;
  refNdvi: number;
  deltaNdvi: number;
  simNdwi: number;
  refNdwi: number;
  deltaNdwi: number;
  maxResidualWl: number;
  maxResidualDelta: number;
}

export function computeSpectralComparison(
  simWavelengths: number[],
  simCanopy: number[],
  reference: ReferenceDatasetItem
): SpectralComparisonResult {
  let sumSqDiff = 0;
  let sumAbsDiff = 0;
  let dotProduct = 0;
  let normSimSq = 0;
  let normRefSq = 0;
  let maxDelta = -1;
  let maxWl = 700;

  const validCount = simWavelengths.length;

  // Track values for NDVI and NDWI
  let simR680 = 0.05, simR800 = 0.5, simR860 = 0.5, simR1240 = 0.4;
  let refR680 = 0.05, refR800 = 0.5, refR860 = 0.5, refR1240 = 0.4;

  for (let i = 0; i < validCount; i++) {
    const wl = simWavelengths[i];
    const ySim = simCanopy[i];
    const yRef = interpolateReflectance(reference.dataPoints, wl);

    const diff = ySim - yRef;
    sumSqDiff += diff * diff;
    sumAbsDiff += Math.abs(diff);

    if (Math.abs(diff) > maxDelta) {
      maxDelta = Math.abs(diff);
      maxWl = wl;
    }

    dotProduct += ySim * yRef;
    normSimSq += ySim * ySim;
    normRefSq += yRef * yRef;

    // Cache specific bands for indices
    if (Math.abs(wl - 680) < 5) {
      simR680 = ySim;
      refR680 = yRef;
    }
    if (Math.abs(wl - 800) < 5) {
      simR800 = ySim;
      refR800 = yRef;
    }
    if (Math.abs(wl - 860) < 5) {
      simR860 = ySim;
      refR860 = yRef;
    }
    if (Math.abs(wl - 1240) < 5) {
      simR1240 = ySim;
      refR1240 = yRef;
    }
  }

  const rmse = Math.sqrt(sumSqDiff / validCount);
  const mae = sumAbsDiff / validCount;

  // Spectral Angle Mapper (SAM) in radians: arccos( (x . y) / (|x| * |y|) )
  const denom = Math.sqrt(normSimSq) * Math.sqrt(normRefSq);
  const cosSam = denom > 0 ? Math.min(1.0, Math.max(-1.0, dotProduct / denom)) : 1.0;
  const samDegrees = (Math.acos(cosSam) * 180) / Math.PI;

  const simNdvi = (simR800 - simR680) / Math.max(0.001, simR800 + simR680);
  const refNdvi = (refR800 - refR680) / Math.max(0.001, refR800 + refR680);

  const simNdwi = (simR860 - simR1240) / Math.max(0.001, simR860 + simR1240);
  const refNdwi = (refR860 - refR1240) / Math.max(0.001, refR860 + refR1240);

  // Approximate correlation coefficient R^2
  const r2 = Math.pow(Math.max(0, cosSam), 2);

  return {
    rmse,
    samDegrees,
    mae,
    r2,
    simNdvi,
    refNdvi,
    deltaNdvi: Math.abs(simNdvi - refNdvi),
    simNdwi,
    refNdwi,
    deltaNdwi: Math.abs(simNdwi - refNdwi),
    maxResidualWl: maxWl,
    maxResidualDelta: maxDelta
  };
}
