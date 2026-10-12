import { type RTMParameters, DEFAULT_RTM_PARAMS } from '../utils/rtmPhysics';

export interface RTMScenarioStep {
  id: string;
  label: string;
  stepNumber: number;
  conditionName: string;
  badge: string;
  badgeColor: string;
  description: string;
  params: Partial<RTMParameters>;
  keyMechanisms: string;
  expectedNdviRange: string;
  expectedRepRange: string;
}

export interface WavelengthTarget {
  wl: number;
  name: string;
  opticalDomain: string;
  diagnosticRelevance: string;
}

export interface RTMScenario {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  category: 'Vegetation Structure' | 'Pigment Dynamics' | 'Hydrological Stress' | 'Substrate Coupling' | 'Senescence & NPV' | 'Canopy Architecture';
  icon: string;
  themeColor: string;
  description: string;
  hypothesizedPhysics: string;
  observedDatasetId: string;
  observedDatasetLabel: string;
  observedInstrument: string;
  optimalStepIndex: number; // The step index that most closely mirrors the observed benchmark
  steps: RTMScenarioStep[];
  keyWavelengthsToWatch: WavelengthTarget[];
  pedagogicalTakeaway: string;
  satelliteBands: string;
}

export const RTM_SCENARIOS: RTMScenario[] = [
  {
    id: 'lai_canopy_gradient',
    title: 'Canopy Density & LAI Gradient (Emergence to Closed Canopy)',
    shortTitle: 'LAI & Canopy Cover',
    subtitle: 'From sparse seedlings to dense multi-layer wheat canopy',
    category: 'Vegetation Structure',
    icon: 'TreeDeciduous',
    themeColor: 'emerald',
    description:
      'Investigates the non-linear relationship between Leaf Area Index (LAI) / Fractional Canopy Cover and spectral reflectance across the optical domain. Evaluates how multiple scattering between stacked leaf layers amplifies the near-infrared (NIR) plateau while visible red reflectance saturates.',
    hypothesizedPhysics:
      'Turbid medium radiative transfer (4SAIL) dictates that canopy gap fraction follows the Beer-Lambert law: P₀ = exp(-k·LAI). As LAI increases from 0.4 to 5.5, the NIR plateau (750–1100 nm) escalates from ~0.26 to ~0.65 via multiple photon scattering between stacked foliar layers, while visible red absorption saturates beyond LAI > 3.0.',
    observedDatasetId: 'usda_winter_wheat',
    observedDatasetLabel: 'USDA ARS Winter Wheat Field Canopy (Healthy, LAI ~ 3.8)',
    observedInstrument: 'ASD FieldSpec 4 Spectroradiometer (350–2500 nm in-situ field measurement)',
    optimalStepIndex: 2, // Stage 3 matches USDA winter wheat closely
    steps: [
      {
        id: 'lai_stage_1',
        stepNumber: 1,
        label: 'Stage 1: Emergence',
        conditionName: 'Sparse Seedlings (Cover 20%, LAI ~ 0.4)',
        badge: 'Sparse Foliage',
        badgeColor: 'amber',
        description:
          'Open crop field with emerging seedlings. Strong soil background reflectance dominates both visible and shortwave infrared wavelengths.',
        params: {
          canopyCover: 0.20,
          leafChlorophyll: 38,
          leafWaterContent: 0.018,
          dryMatterContent: 0.009,
          leafStructureN: 1.4,
          soilBrightness: 1.05,
          soilType: 'loam',
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Direct soil radiance transmits through large foliar gaps (P₀ ≈ 0.80). NIR reflectance is subdued (~0.28) because few leaf layers exist to scatter photons upward.',
        expectedNdviRange: '0.28 – 0.38',
        expectedRepRange: '698 – 704 nm'
      },
      {
        id: 'lai_stage_2',
        stepNumber: 2,
        label: 'Stage 2: Tillering',
        conditionName: 'Moderate Canopy (Cover 55%, LAI ~ 1.8)',
        badge: 'Rapid Vegetative',
        badgeColor: 'blue',
        description:
          'Rapid tillering and leaf area expansion. Foliar interception increases rapidly, reducing soil gap transmission.',
        params: {
          canopyCover: 0.55,
          leafChlorophyll: 42,
          leafWaterContent: 0.018,
          dryMatterContent: 0.009,
          leafStructureN: 1.45,
          soilBrightness: 1.0,
          soilType: 'loam',
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Significant jump in NIR reflectance (~0.44). Red absorption deepens as chlorophyll intercepts photosynthetic photons.',
        expectedNdviRange: '0.58 – 0.68',
        expectedRepRange: '708 – 714 nm'
      },
      {
        id: 'lai_stage_3',
        stepNumber: 3,
        label: 'Stage 3: Peak Canopy (Match)',
        conditionName: 'Optimal Closed Crop (Cover 85%, LAI ~ 3.8)',
        badge: 'Benchmark Match',
        badgeColor: 'emerald',
        description:
          'Dense vegetative wheat canopy at flag leaf / early heading. Closely replicates the USDA ARS ground-truth field spectroradiometer dataset.',
        params: {
          canopyCover: 0.85,
          leafChlorophyll: 48,
          leafWaterContent: 0.018,
          dryMatterContent: 0.009,
          leafStructureN: 1.50,
          soilBrightness: 1.0,
          soilType: 'loam',
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'NIR plateau reaches ~0.58–0.62 due to intense multi-layer scattering. Visible red drops below 0.04. Near-perfect convergence with observed USDA FieldSpec data.',
        expectedNdviRange: '0.82 – 0.88',
        expectedRepRange: '718 – 724 nm'
      },
      {
        id: 'lai_stage_4',
        stepNumber: 4,
        label: 'Stage 4: Dense Saturation',
        conditionName: 'Luxuriant Overgrowth (Cover 98%, LAI ~ 5.5)',
        badge: 'NIR Saturation',
        badgeColor: 'purple',
        description:
          'Extremely dense foliar canopy with complete ground closure. Demonstrates the asymptotic saturation of visible vegetation indices.',
        params: {
          canopyCover: 0.98,
          leafChlorophyll: 55,
          leafWaterContent: 0.020,
          dryMatterContent: 0.010,
          leafStructureN: 1.55,
          soilBrightness: 0.9,
          soilType: 'loam',
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Visible red reflectance is completely saturated (absorbed). NDVI reaches asymptote (~0.90), while Red Edge and SWIR indices continue responding.',
        expectedNdviRange: '0.88 – 0.92',
        expectedRepRange: '725 – 732 nm'
      }
    ],
    keyWavelengthsToWatch: [
      { wl: 675, name: 'Red Absorption Minima', opticalDomain: 'Visible Red', diagnosticRelevance: 'Chlorophyll-a absorption saturation' },
      { wl: 705, name: 'Red Edge Transition (B5)', opticalDomain: 'Red Edge', diagnosticRelevance: 'Inflection slope sensitivity to green biomass' },
      { wl: 800, name: 'NIR Scattering Plateau (B8)', opticalDomain: 'NIR', diagnosticRelevance: 'Multiple scattering escalation' },
      { wl: 1610, name: 'SWIR-1 Reflectance (B11)', opticalDomain: 'SWIR', diagnosticRelevance: 'Canopy water and dry matter balance' }
    ],
    pedagogicalTakeaway:
      'Notice how single-leaf NIR reflectance is ~0.45, yet the dense canopy reflects over ~0.60. This is empirical proof of multiple internal scattering within stacked foliage. Also note that NDVI saturates around LAI ~ 3.0, proving why broadband indices fail in dense forests.',
    satelliteBands: 'Sentinel-2 B4 (Red), B8/B8A (NIR), B5/B6 (Red Edge); Landsat 8/9 B4/B5'
  },
  {
    id: 'chlorophyll_nitrogen_shift',
    title: 'Foliar Chlorophyll & Nitrogen Deficiency Gradient',
    shortTitle: 'Chlorophyll & Nitrogen',
    subtitle: 'From severe chlorosis to high-nitrogen luxury feeding',
    category: 'Pigment Dynamics',
    icon: 'Leaf',
    themeColor: 'green',
    description:
      'Simulates the biochemical shift in leaf chlorophyll content (C_ab) from severe chlorosis/nitrogen starvation (10 μg/cm²) to luxury nitrogen status (75 μg/cm²). Compares against high-precision laboratory ASD spectrometer measurements of healthy deciduous leaves.',
    hypothesizedPhysics:
      'Chlorophyll a+b displays strong electronic absorption resonances in the blue (Soret band ~435 nm) and red (Q-band ~675 nm). Increasing C_ab widens the absorption well, shifting the Red Edge Position (REP) toward longer wavelengths ("red-shift") while leaving the NIR plateau (>800 nm) unaltered.',
    observedDatasetId: 'usgs_deciduous_leaf',
    observedDatasetLabel: 'USGS Deciduous Green Leaf (Quercus robur, Lab ASD Spec)',
    observedInstrument: 'ASD Lab Spectroradiometer with Halogen Contact Probe & NIST Spectralon Calibration',
    optimalStepIndex: 2, // Stage 3 matches healthy deciduous leaf
    steps: [
      {
        id: 'chl_stage_1',
        stepNumber: 1,
        label: 'Stage 1: Severe Chlorosis',
        conditionName: 'Acute Nitrogen Starvation (Cab = 10 μg/cm²)',
        badge: 'Chlorotic / Stressed',
        badgeColor: 'amber',
        description:
          'Leaves lack photosynthetic machinery. The 675 nm red absorption well is shallow, resulting in elevated red reflection and yellow foliage appearance.',
        params: {
          leafChlorophyll: 10,
          carotenoids: 14,
          canopyCover: 0.85,
          leafWaterContent: 0.018,
          dryMatterContent: 0.009,
          leafStructureN: 1.5,
          soilBrightness: 1.0,
          soilType: 'loam',
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Shallow 675 nm absorption. Carotenoid-to-chlorophyll ratio is high, causing yellow-green foliar appearance. REP is shifted down to ~693 nm.',
        expectedNdviRange: '0.52 – 0.60',
        expectedRepRange: '692 – 696 nm'
      },
      {
        id: 'chl_stage_2',
        stepNumber: 2,
        label: 'Stage 2: Mild Deficiency',
        conditionName: 'Moderate Nitrogen Deficit (Cab = 25 μg/cm²)',
        badge: 'Sub-Optimal',
        badgeColor: 'yellow',
        description:
          'Sub-optimal nitrogen nutrition. Chlorophyll is sufficient for basic photosynthesis but exhibits reduced Red Edge steepness.',
        params: {
          leafChlorophyll: 25,
          carotenoids: 10,
          canopyCover: 0.85,
          leafWaterContent: 0.018,
          dryMatterContent: 0.009,
          leafStructureN: 1.5,
          soilBrightness: 1.0,
          soilType: 'loam',
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Red reflectance drops to ~0.06. REP moves up to ~706 nm. Green peak at 550 nm is pronounced.',
        expectedNdviRange: '0.72 – 0.78',
        expectedRepRange: '704 – 708 nm'
      },
      {
        id: 'chl_stage_3',
        stepNumber: 3,
        label: 'Stage 3: Optimal Foliage (Match)',
        conditionName: 'Healthy Deciduous Foliage (Cab = 48 μg/cm²)',
        badge: 'Benchmark Match',
        badgeColor: 'emerald',
        description:
          'Optimal physiological chlorophyll level. Closely matches the USGS Quercus robur laboratory spectral benchmark.',
        params: {
          leafChlorophyll: 48,
          carotenoids: 8.5,
          canopyCover: 0.85,
          leafWaterContent: 0.018,
          dryMatterContent: 0.009,
          leafStructureN: 1.5,
          soilBrightness: 1.0,
          soilType: 'loam',
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Deep red trough at 675 nm (<0.04). Steep Red Edge inflection centered at ~718 nm. Near-zero difference from USGS empirical spectrum.',
        expectedNdviRange: '0.84 – 0.88',
        expectedRepRange: '716 – 722 nm'
      },
      {
        id: 'chl_stage_4',
        stepNumber: 4,
        label: 'Stage 4: Luxury Nitrogen',
        conditionName: 'Heavy Fertilization (Cab = 75 μg/cm²)',
        badge: 'Luxury Feeding',
        badgeColor: 'indigo',
        description:
          'Foliage saturated with photosynthetic chlorophyll. Maximum red absorption well depth and pronounced red-edge displacement.',
        params: {
          leafChlorophyll: 75,
          carotenoids: 7.0,
          canopyCover: 0.85,
          leafWaterContent: 0.018,
          dryMatterContent: 0.009,
          leafStructureN: 1.5,
          soilBrightness: 1.0,
          soilType: 'loam',
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Red absorption completely saturates. REP moves to ~730 nm. Notice that the NIR plateau (>800 nm) remains virtually identical to Stage 3.',
        expectedNdviRange: '0.88 – 0.92',
        expectedRepRange: '728 – 734 nm'
      }
    ],
    keyWavelengthsToWatch: [
      { wl: 550, name: 'Green Reflectance Peak', opticalDomain: 'Visible Green', diagnosticRelevance: 'Transmittance window between blue & red absorption' },
      { wl: 675, name: 'Chlorophyll-a Absorption Minimum', opticalDomain: 'Visible Red', diagnosticRelevance: 'Direct measure of foliar pigment concentration' },
      { wl: 705, name: 'Sentinel-2 Red Edge Band 5', opticalDomain: 'Red Edge', diagnosticRelevance: 'Critical for avoiding NDVI saturation' },
      { wl: 740, name: 'Sentinel-2 Red Edge Band 6', opticalDomain: 'Red Edge', diagnosticRelevance: 'Boundary of the NIR multiple scattering plateau' }
    ],
    pedagogicalTakeaway:
      'Critically examine the NIR plateau above 800 nm: across all 4 stages, the NIR reflectance is completely static! Chlorophyll pigments have zero absorption in the NIR. The entire signal change is confined to 400–740 nm, clearly illustrating the physical decoupling of pigment chemistry from canopy structure.',
    satelliteBands: 'Sentinel-2 B4 (Red), B5 (Red Edge 705), B6 (Red Edge 740); EnMAP & PRISMA hyperspectral'
  },
  {
    id: 'drought_water_deficit',
    title: 'Canopy Water Deficit & Drought Stress Progression',
    shortTitle: 'Drought & Water Deficit',
    subtitle: 'From well-watered turgidity to severe foliar dehydration',
    category: 'Hydrological Stress',
    icon: 'Droplets',
    themeColor: 'cyan',
    description:
      'Examines the optical impact of foliar dehydration (loss of Equivalent Water Thickness C_w) combined with canopy wilting. Compares simulated RTM spectra against real-world field spectrometer observations of drought-stressed maize crops.',
    hypothesizedPhysics:
      'Liquid water inside mesophyll cells exhibits pronounced vibrational absorption bands (O-H stretch and H-O-H bend) centered at 970 nm, 1200 nm, 1450 nm, and 1940 nm. As EWT drops from 0.024 cm to 0.005 cm, SWIR reflectance surges dramatically as water absorption collapses.',
    observedDatasetId: 'drought_stressed_crop',
    observedDatasetLabel: 'Field-Measured Drought-Stressed Maize (CIMMYT AgMIP Field Trials)',
    observedInstrument: 'ASD FieldSpec 3 Mobile Cart Rig (Measured during peak midday moisture stress)',
    optimalStepIndex: 3, // Stage 4 matches drought stressed crop
    steps: [
      {
        id: 'h2o_stage_1',
        stepNumber: 1,
        label: 'Stage 1: Well-Watered',
        conditionName: 'Turgid Healthy Foliage (Cw = 0.024 cm)',
        badge: 'Fully Hydrated',
        badgeColor: 'emerald',
        description:
          'Optimal root zone soil moisture. Leaves are turgid and fully expanded, displaying deep liquid water absorption troughs in the SWIR.',
        params: {
          leafWaterContent: 0.024,
          leafChlorophyll: 46,
          canopyCover: 0.85,
          dryMatterContent: 0.009,
          leafStructureN: 1.5,
          soilBrightness: 0.95,
          soilType: 'loam',
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Deep water troughs at 1200 nm, 1450 nm, and 1940 nm. SWIR-1 (1600 nm) reflectance stays below ~0.26.',
        expectedNdviRange: '0.82 – 0.86',
        expectedRepRange: '718 – 722 nm'
      },
      {
        id: 'h2o_stage_2',
        stepNumber: 2,
        label: 'Stage 2: Mild Water Stress',
        conditionName: 'Early Moisture Deficit (Cw = 0.016 cm)',
        badge: 'Early Warning',
        badgeColor: 'blue',
        description:
          'Stomata begin to close to prevent transpirational loss. Chlorophyll remains relatively unaffected, but SWIR absorption starts to diminish.',
        params: {
          leafWaterContent: 0.016,
          leafChlorophyll: 42,
          canopyCover: 0.80,
          dryMatterContent: 0.010,
          leafStructureN: 1.55,
          soilBrightness: 1.0,
          soilType: 'loam',
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Noticeable reduction in the 1200 nm and 1450 nm water bands. Visible bands show minimal difference, demonstrating why SWIR is the earliest stress indicator.',
        expectedNdviRange: '0.78 – 0.82',
        expectedRepRange: '714 – 718 nm'
      },
      {
        id: 'h2o_stage_3',
        stepNumber: 3,
        label: 'Stage 3: Moderate Drought',
        conditionName: 'Moderate Dehydration & Wilting (Cw = 0.010 cm)',
        badge: 'Mid Stress',
        badgeColor: 'amber',
        description:
          'Foliage suffers significant cellular desiccation. Leaf angle distribution shifts toward erectophile as leaves curl and wilt.',
        params: {
          leafWaterContent: 0.010,
          leafChlorophyll: 32,
          canopyCover: 0.72,
          dryMatterContent: 0.012,
          leafStructureN: 1.65,
          soilBrightness: 1.1,
          soilType: 'loam',
          canopyArchitecture: 'erectophile',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'SWIR reflectance rises sharply (1600 nm reaches ~0.34). Normalized Difference Water Index (NDWI) drops precipitously.',
        expectedNdviRange: '0.68 – 0.74',
        expectedRepRange: '708 – 714 nm'
      },
      {
        id: 'h2o_stage_4',
        stepNumber: 4,
        label: 'Stage 4: Severe Drought (Match)',
        conditionName: 'Severe Desiccation (Cw = 0.006 cm, Cab = 24)',
        badge: 'Benchmark Match',
        badgeColor: 'rose',
        description:
          'Critical drought conditions. Closely reproduces the empirical CIMMYT drought-stressed maize canopy spectral signature.',
        params: {
          leafWaterContent: 0.006,
          leafChlorophyll: 24,
          canopyCover: 0.65,
          dryMatterContent: 0.014,
          leafStructureN: 1.80,
          soilBrightness: 1.15,
          soilType: 'loam',
          canopyArchitecture: 'erectophile',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Water absorption troughs are largely flattened. SWIR-1 (1600 nm) reaches ~0.42 and SWIR-2 reaches ~0.32, closely tracking the observed CIMMYT trial.',
        expectedNdviRange: '0.60 – 0.66',
        expectedRepRange: '702 – 708 nm'
      }
    ],
    keyWavelengthsToWatch: [
      { wl: 970, name: 'Weak Water Overtone', opticalDomain: 'NIR/SWIR Boundary', diagnosticRelevance: 'Water Index (WI = R900/R970)' },
      { wl: 1200, name: 'Diagnostic Liquid Water Trough', opticalDomain: 'SWIR-1', diagnosticRelevance: 'NDII / NDWI liquid water absorption' },
      { wl: 1450, name: 'Primary Atmospheric/Foliar Water Feature', opticalDomain: 'SWIR Atmospheric Mask', diagnosticRelevance: 'Zero atmospheric transmission, strong laboratory foliar band' },
      { wl: 1610, name: 'Sentinel-2 Band 11 (SWIR-1)', opticalDomain: 'SWIR-1 Window', diagnosticRelevance: 'Optimal spaceborne canopy moisture estimation' }
    ],
    pedagogicalTakeaway:
      'Notice that in Stage 2, visible red and NDVI have barely changed, yet SWIR reflectance (1200–1650 nm) has already risen by 35%. This proves why satellite missions with SWIR channels (Sentinel-2 B11, Landsat 8 B6) detect agricultural drought weeks before visible canopy yellowing appears.',
    satelliteBands: 'Sentinel-2 B11 (SWIR-1 1610nm), B12 (SWIR-2 2190nm); Landsat 8/9 B6/B7; MODIS NDWI'
  },
  {
    id: 'soil_substrate_contrast',
    title: 'Soil Background Interference & Substrate Contrast',
    shortTitle: 'Soil Background & SAVI',
    subtitle: 'Evaluating substrate radiance coupling across bright sand vs dark loam',
    category: 'Substrate Coupling',
    icon: 'Sun',
    themeColor: 'amber',
    description:
      'Investigates the radiative coupling between underlying soil substrate and emerging vegetation canopies. Compares sparse-to-medium crops growing over bright calcareous sand versus dark organic loam to demonstrate why standard NDVI is sensitive to soil brightness, requiring SAVI correction.',
    hypothesizedPhysics:
      'In non-closed canopies (cover < 80%), canopy gap radiance transmits directly from the soil substrate: R_total ≈ R_veg·(1 - P₀²) + R_soil·P₀². Bright substrates inflate visible red reflectance, depressing NDVI relative to darker soils with identical canopy biomass.',
    observedDatasetId: 'agricultural_silt_loam',
    observedDatasetLabel: 'Agricultural Silt Loam Soil (Moist Topsoil Baseline, JPL/NRCS)',
    observedInstrument: 'Laboratory ASD Spectrometer with standard viewing geometry',
    optimalStepIndex: 1, // Stage 2 matches agricultural loam
    steps: [
      {
        id: 'soil_stage_1',
        stepNumber: 1,
        label: 'Stage 1: Bright Sand Substrate',
        conditionName: 'Sparse Crop (Cover 35%) over Bright Calcareous Sand',
        badge: 'High Albedo Soil',
        badgeColor: 'amber',
        description:
          'Emerging crop over bright arid mineral soil substrate. High soil albedo reflects strongly across visible red, artificially suppressing NDVI.',
        params: {
          canopyCover: 0.35,
          soilType: 'dry_soil',
          soilBrightness: 1.35,
          leafChlorophyll: 42,
          leafWaterContent: 0.018,
          dryMatterContent: 0.009,
          leafStructureN: 1.45,
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Soil red reflectance is high (~0.35). This raises the canopy red value, causing NDVI to compute as artificially low despite healthy leaf chlorophyll.',
        expectedNdviRange: '0.36 – 0.44',
        expectedRepRange: '702 – 708 nm'
      },
      {
        id: 'soil_stage_2',
        stepNumber: 2,
        label: 'Stage 2: Dark Loam Substrate (Match)',
        conditionName: 'Sparse Crop (Cover 35%) over Moist Silt Loam',
        badge: 'Benchmark Match',
        badgeColor: 'emerald',
        description:
          'Identical vegetation biomass and chlorophyll, but growing over dark fertile silt loam. Red reflectance is lower, boosting computed NDVI.',
        params: {
          canopyCover: 0.35,
          soilType: 'loam',
          soilBrightness: 0.90,
          leafChlorophyll: 42,
          leafWaterContent: 0.018,
          dryMatterContent: 0.009,
          leafStructureN: 1.45,
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Soil red reflectance is low (~0.15). The red background is dark, producing higher contrast and boosting NDVI by +0.12 compared to Stage 1!',
        expectedNdviRange: '0.48 – 0.56',
        expectedRepRange: '702 – 708 nm'
      },
      {
        id: 'soil_stage_3',
        stepNumber: 3,
        label: 'Stage 3: Moderate Canopy Closure',
        conditionName: 'Intermediate Crop (Cover 65%) over Silt Loam',
        badge: 'Partial Extinction',
        badgeColor: 'blue',
        description:
          'Canopy cover expands to 65%. Soil gap transmission decreases exponentially (P₀ ≈ 0.35), reducing substrate interference.',
        params: {
          canopyCover: 0.65,
          soilType: 'loam',
          soilBrightness: 1.0,
          leafChlorophyll: 45,
          leafWaterContent: 0.018,
          dryMatterContent: 0.009,
          leafStructureN: 1.5,
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Foliar canopy absorbs most incident red photons. Substrate reflectance begins to fade as a confounding variable.',
        expectedNdviRange: '0.70 – 0.76',
        expectedRepRange: '712 – 716 nm'
      },
      {
        id: 'soil_stage_4',
        stepNumber: 4,
        label: 'Stage 4: Canopy Optical Closure',
        conditionName: 'Full Ground Cover (Cover 95%) - Soil Independent',
        badge: 'Soil Decoupled',
        badgeColor: 'purple',
        description:
          'Nearly closed canopy. Foliage intercepts 95%+ of optical radiation, decoupling top-of-canopy reflectance from soil brightness completely.',
        params: {
          canopyCover: 0.95,
          soilType: 'loam',
          soilBrightness: 1.0,
          leafChlorophyll: 48,
          leafWaterContent: 0.018,
          dryMatterContent: 0.009,
          leafStructureN: 1.5,
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Substrate transmission is virtually zero (P₀² < 0.005). Whether the soil is bright sand or dark loam has zero effect on TOC reflectance.',
        expectedNdviRange: '0.85 – 0.90',
        expectedRepRange: '720 – 724 nm'
      }
    ],
    keyWavelengthsToWatch: [
      { wl: 660, name: 'Visible Red Soil Contrast', opticalDomain: 'Visible Red', diagnosticRelevance: 'Key determinant of soil line intercept and slope' },
      { wl: 830, name: 'NIR Transmission Reflection', opticalDomain: 'NIR', diagnosticRelevance: 'Substrate contribution to near-infrared canopy albedo' },
      { wl: 2200, name: 'SWIR-2 Mineral Features', opticalDomain: 'SWIR-2', diagnosticRelevance: 'Diagnostic clay/carbonate soil background signatures' }
    ],
    pedagogicalTakeaway:
      'Compare Stage 1 and Stage 2 carefully: the vegetation parameters are 100% identical, yet NDVI changes from 0.40 to 0.52 purely due to soil color! This demonstrates mathematically why Huete (1988) formulated SAVI = ((NIR - Red)/(NIR + Red + L)) * (1 + L) with L = 0.5 to suppress soil line variations.',
    satelliteBands: 'Sentinel-2 B4/B8 (SAVI calculation); Landsat 8/9 B4/B5'
  },
  {
    id: 'senescence_npv_transition',
    title: 'Autumn Foliage Senescence & Crop Residue Transition (NPV)',
    shortTitle: 'Senescence & NPV',
    subtitle: 'From active photosynthetic foliage to dry crop residue and straw',
    category: 'Senescence & NPV',
    icon: 'Sparkles',
    themeColor: 'rose',
    description:
      'Traces the physiological transition of green vegetation during autumn senescence and post-harvest crop residue drying. Evaluates the progressive breakdown of foliar chlorophyll, unmasking of carotenoids, water loss, and emergence of cellulose/lignin absorption doublets at 2100 nm and 2300 nm.',
    hypothesizedPhysics:
      'During senescence, chloroplasts break down and chlorophyll pigments degrade rapidly, eliminating the 675 nm absorption well and collapsing the Red Edge. Carotenoids persist longer, giving yellow coloration. Upon complete desiccation, foliar water troughs vanish, leaving Non-Photosynthetic Vegetation (NPV) characterized by diagnostic cellulose and lignin absorption doublets near 2100 nm and 2300 nm.',
    observedDatasetId: 'senescent_straw_npv',
    observedDatasetLabel: 'Senescent Crop Residue / Dry Straw (USDA ARS Field Measurement)',
    observedInstrument: 'ASD FieldSpec Spectroradiometer on post-harvest wheat stubble',
    optimalStepIndex: 3, // Stage 4 matches dry straw NPV
    steps: [
      {
        id: 'sen_stage_1',
        stepNumber: 1,
        label: 'Stage 1: Late-Season Green',
        conditionName: 'Mature Green Canopy (Cab = 42 μg/cm², Cw = 0.018 cm)',
        badge: 'Photosynthetic',
        badgeColor: 'emerald',
        description:
          'Mature canopy just prior to senescence onset. Photosynthetic machinery and leaf water are still largely intact.',
        params: {
          leafChlorophyll: 42,
          carotenoids: 8.0,
          leafWaterContent: 0.018,
          dryMatterContent: 0.009,
          canopyCover: 0.85,
          leafStructureN: 1.5,
          soilBrightness: 1.0,
          soilType: 'loam',
          canopyArchitecture: 'spherical',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Normal healthy vegetation curve: prominent green peak, deep red well, steep red edge, and liquid water troughs in the SWIR.',
        expectedNdviRange: '0.80 – 0.86',
        expectedRepRange: '716 – 720 nm'
      },
      {
        id: 'sen_stage_2',
        stepNumber: 2,
        label: 'Stage 2: Early Yellowing',
        conditionName: 'Chlorophyll Breakdown & Carotenoid Unmasking',
        badge: 'Autumn Yellowing',
        badgeColor: 'yellow',
        description:
          'Chlorophyll degrades to 16 μg/cm² while accessory carotenoids remain elevated (16 μg/cm²). Foliage yellows as blue light is absorbed while red light is reflected.',
        params: {
          leafChlorophyll: 16,
          carotenoids: 16.0,
          leafWaterContent: 0.012,
          dryMatterContent: 0.012,
          canopyCover: 0.78,
          leafStructureN: 1.7,
          soilBrightness: 1.0,
          soilType: 'loam',
          canopyArchitecture: 'planophile',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Red absorption well flattens. Red Edge inflection point collapses toward 700 nm. Plant Senescence Reflectance Index (PSRI) rises sharply.',
        expectedNdviRange: '0.62 – 0.68',
        expectedRepRange: '698 – 704 nm'
      },
      {
        id: 'sen_stage_3',
        stepNumber: 3,
        label: 'Stage 3: Advanced Brown Foliage',
        conditionName: 'Desiccating Brown Leaves (Cab = 6 μg/cm², Cw = 0.006 cm)',
        badge: 'Brown Foliage',
        badgeColor: 'amber',
        description:
          'Severe senescence. Foliage turns brown. Water content drops significantly, exposing dry structural matter.',
        params: {
          leafChlorophyll: 6,
          carotenoids: 10.0,
          leafWaterContent: 0.006,
          dryMatterContent: 0.018,
          canopyCover: 0.72,
          leafStructureN: 2.0,
          soilBrightness: 1.05,
          soilType: 'loam',
          canopyArchitecture: 'planophile',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Visible red absorption is nearly gone. SWIR water absorption has mostly evaporated, revealing dry matter absorption dips.',
        expectedNdviRange: '0.38 – 0.46',
        expectedRepRange: '688 – 694 nm'
      },
      {
        id: 'sen_stage_4',
        stepNumber: 4,
        label: 'Stage 4: Dry Straw NPV (Match)',
        conditionName: 'Desiccated Crop Residue / Dry Straw (NPV)',
        badge: 'Benchmark Match',
        badgeColor: 'rose',
        description:
          'Complete senescence. Dead, dry crop residue on ground. Closely matches USDA ARS dry straw spectral benchmark.',
        params: {
          leafChlorophyll: 2,
          carotenoids: 4.0,
          leafWaterContent: 0.002,
          dryMatterContent: 0.024,
          canopyCover: 0.70,
          leafStructureN: 2.2,
          soilBrightness: 1.10,
          soilType: 'loam',
          canopyArchitecture: 'planophile',
          solarZenithAngle: 30
        },
        keyMechanisms:
          'Red edge is completely gone. Monotonic upward slope across visible-NIR. Pronounced cellulose/lignin absorption dips at 2100 nm and 2300 nm, confirming Cellulose Absorption Index (CAI).',
        expectedNdviRange: '0.12 – 0.20',
        expectedRepRange: 'None (Monotonic)'
      }
    ],
    keyWavelengthsToWatch: [
      { wl: 675, name: 'Red Absorption Disappearance', opticalDomain: 'Visible Red', diagnosticRelevance: 'Indicates complete chlorophyll loss' },
      { wl: 700, name: 'Red Edge Collapse', opticalDomain: 'Red Edge', diagnosticRelevance: 'Loss of steep photosynthetic boundary' },
      { wl: 2100, name: 'Cellulose Diagnostic Dip (CAI)', opticalDomain: 'SWIR-2', diagnosticRelevance: 'Cellulose Absorption Index (CAI = 0.5*(R2000 + R2200) - R2100)' },
      { wl: 2300, name: 'Lignin Absorption Feature', opticalDomain: 'SWIR-2', diagnosticRelevance: 'Non-photosynthetic crop residue detection' }
    ],
    pedagogicalTakeaway:
      'Notice how Stage 4 (dry straw) completely loses the signature "vegetation step" at 700 nm. Instead, it looks remarkably like a mineral or soil curve, except for the diagnostic cellulose doublets at 2100 nm and 2300 nm. Hyperspectral missions use the Cellulose Absorption Index (CAI) to map conservation tillage and soil residue cover from space.',
    satelliteBands: 'PRISMA & EnMAP hyperspectral SWIR channels; WorldView-3 SWIR bands'
  },
  {
    id: 'canopy_architecture_sun_angle',
    title: 'Canopy Architecture & Sun Zenith Diurnal Dynamics',
    shortTitle: 'Architecture & Sun Angle',
    subtitle: 'Planophile broadleaf vs erectophile conifer across solar illumination angles',
    category: 'Canopy Architecture',
    icon: 'Compass',
    themeColor: 'indigo',
    description:
      'Investigates the directional optical interaction of Leaf Angle Distribution (LAD: Planophile vs Erectophile) under varying solar illumination angles (Solar Zenith Angle θ_s from 20° solar noon to 60° late afternoon). Compares model predictions against Ponderosa Pine needle foliage.',
    hypothesizedPhysics:
      'Canopy architecture dictates the bidirectional extinction coefficient k(θ_s). Planophile canopies intercept incoming light horizontally, providing high top-of-canopy NIR reflection at high sun angles. Erectophile foliage (vertical needles/grasses) allows light to penetrate deeper into the canopy, producing lower top-of-canopy NIR reflectance and greater sensitivity to sun angle.',
    observedDatasetId: 'usgs_conifer_needle',
    observedDatasetLabel: 'USGS Ponderosa Pine Needle Foliage (Pinus ponderosa)',
    observedInstrument: 'Laboratory ASD Spectrometer with directional goniometer viewing assembly',
    optimalStepIndex: 2, // Stage 3 matches conifer needles
    steps: [
      {
        id: 'arch_stage_1',
        stepNumber: 1,
        label: 'Stage 1: Planophile Noon',
        conditionName: 'Horizontal Broadleaf at Solar Noon (θs = 20°)',
        badge: 'High Albedo Broadleaf',
        badgeColor: 'blue',
        description:
          'Horizontal leaves facing directly toward the overhead sun. Maximum interception of direct sunlight by the top canopy layer.',
        params: {
          canopyArchitecture: 'planophile',
          solarZenithAngle: 20,
          canopyCover: 0.85,
          leafChlorophyll: 48,
          leafWaterContent: 0.018,
          dryMatterContent: 0.010,
          leafStructureN: 1.5,
          soilBrightness: 1.0,
          soilType: 'dark_organic'
        },
        keyMechanisms:
          'High top-of-canopy reflectance across the entire NIR spectrum (~0.58). Upper leaves capture most photons before they reach the ground.',
        expectedNdviRange: '0.84 – 0.88',
        expectedRepRange: '718 – 722 nm'
      },
      {
        id: 'arch_stage_2',
        stepNumber: 2,
        label: 'Stage 2: Planophile Oblique',
        conditionName: 'Horizontal Broadleaf at Late Afternoon (θs = 55°)',
        badge: 'Longer Pathlength',
        badgeColor: 'indigo',
        description:
          'Low solar elevation. Photons travel through a substantially longer optical pathlength (1/cos θs), increasing interception and self-shadowing.',
        params: {
          canopyArchitecture: 'planophile',
          solarZenithAngle: 55,
          canopyCover: 0.85,
          leafChlorophyll: 48,
          leafWaterContent: 0.018,
          dryMatterContent: 0.010,
          leafStructureN: 1.5,
          soilBrightness: 1.0,
          soilType: 'dark_organic'
        },
        keyMechanisms:
          'Increased mutual shading lowers visible reflectance slightly, while forward/backward scattering contrast increases.',
        expectedNdviRange: '0.86 – 0.90',
        expectedRepRange: '719 – 723 nm'
      },
      {
        id: 'arch_stage_3',
        stepNumber: 3,
        label: 'Stage 3: Erectophile Needles (Match)',
        conditionName: 'Vertical Needleleaf Architecture (N = 2.25, Erectophile)',
        badge: 'Benchmark Match',
        badgeColor: 'emerald',
        description:
          'Vertical needle canopy with thick mesophyll structure (N = 2.25) and dark organic understory. Closely reproduces the USGS Ponderosa Pine signature.',
        params: {
          canopyArchitecture: 'erectophile',
          solarZenithAngle: 35,
          canopyCover: 0.88,
          leafChlorophyll: 48,
          leafWaterContent: 0.020,
          dryMatterContent: 0.019,
          leafStructureN: 2.25,
          soilBrightness: 0.70,
          soilType: 'dark_organic'
        },
        keyMechanisms:
          'Vertical needles let photons penetrate deeply into inter-needle gaps, trapping light and dampening the NIR plateau (~0.38) compared to broadleaves.',
        expectedNdviRange: '0.78 – 0.84',
        expectedRepRange: '714 – 718 nm'
      },
      {
        id: 'arch_stage_4',
        stepNumber: 4,
        label: 'Stage 4: Low Sun Oblique',
        conditionName: 'Erectophile Canopy at Slanted Illumination (θs = 65°)',
        badge: 'Slanted Illumination',
        badgeColor: 'purple',
        description:
          'Low sun angle over vertical needles. The projected leaf area perpendicular to the solar beam increases, altering extinction characteristics.',
        params: {
          canopyArchitecture: 'erectophile',
          solarZenithAngle: 65,
          canopyCover: 0.88,
          leafChlorophyll: 48,
          leafWaterContent: 0.020,
          dryMatterContent: 0.019,
          leafStructureN: 2.25,
          soilBrightness: 0.70,
          soilType: 'dark_organic'
        },
        keyMechanisms:
          'Slanted illumination illuminates the vertical leaf faces directly, increasing TOC reflectance relative to high-sun erectophile geometry.',
        expectedNdviRange: '0.82 – 0.86',
        expectedRepRange: '716 – 720 nm'
      }
    ],
    keyWavelengthsToWatch: [
      { wl: 800, name: 'NIR Plateau Multi-Scattering', opticalDomain: 'NIR', diagnosticRelevance: 'Architecture-induced multiple scattering disparity' },
      { wl: 1050, name: 'NIR Canopy Volume Scattering', opticalDomain: 'NIR', diagnosticRelevance: 'Shows 20%+ reflectance difference between broadleaf & needleleaf' },
      { wl: 1650, name: 'SWIR-1 Lignin & Water Interception', opticalDomain: 'SWIR-1', diagnosticRelevance: 'Internal needle resin and dry matter absorption' }
    ],
    pedagogicalTakeaway:
      'Compare Stage 1 (Planophile broadleaf, NIR ~ 0.58) with Stage 3 (Erectophile conifer needle, NIR ~ 0.38) with identical leaf chlorophyll and cover! The ~20% drop in NIR reflection is caused entirely by 3D leaf geometry and internal light trapping, explaining why conifer forests appear much darker in satellite NIR imagery than deciduous woods.',
    satelliteBands: 'BRDF kernels on MODIS (MCD43A1) & Sentinel-3 OLCI'
  }
];
