import type { CourseModule, Slide } from '../types';

function generateModule4Slides(): Slide[] {
  return [
    {
      id: 'm4_s1',
      slideNumber: 1,
      title: 'Introduction to Field Sampling Design & Geometrical Protocols',
      category: 'Protocol',
      keyTakeaway: 'In situ optical radiometry is subject to dynamic outdoor environmental perturbations that require strict geometric and temporal sampling protocols.',
      bullets: [
        'Unlike laboratory benches, outdoor fields feature shifting solar angles, moving shadows, wind-induced canopy motion, and atmospheric aerosol variations.',
        'Scientific reproducibility demands standardized geometrical constraints on illumination and viewing.',
        'This module establishes the rules of engagement for outdoor data acquisition to ensure high-fidelity surface reflectance retrieval.'
      ],
      practicalFieldNote: 'Flawed field protocol produces corrupted spectral signatures that no downstream algorithm can salvage.',
      speakerNotes: 'Welcome to Module 4. Here we transition from instrument mechanics to the operational choreography of outdoor field campaigns.',
      references: ['Milton, E. J. et al. (2009). Progress in field spectroscopy. Remote Sensing of Environment, 113, S92-S109.']
    },
    {
      id: 'm4_s2',
      slideNumber: 2,
      title: 'The Solar Zenith Angle (SZA) Window: The ±2 Hour Golden Window',
      category: 'Protocol',
      keyTakeaway: 'Valid field spectroradiometry must be strictly confined to solar zenith angles θ_s < 45°–50° (within ±2 hours of local solar noon).',
      bullets: [
        'When θ_s > 50°, direct solar irradiance decreases rapidly, while optical air mass (AM) increases steeply.',
        'High SZA elongates surface shadows, exaggerating non-Lambertian BRDF cavity scattering and micro-topographic shading.',
        'High SZA causes forward specular scattering on Spectralon reference panels, introducing systematic calibration errors.',
        'Golden Rule: Restrict primary field campaigns to between 10:00 and 14:00 true local solar time.'
      ],
      mathFormula: '\\theta_s \\le 50^\\circ \\implies \\text{Air Mass } m \\le 1.55',
      formulaExplanation: 'Threshold ensuring high solar elevation and manageable atmospheric attenuation.',
      speakerNotes: 'Show the solar elevation chart and emphasize why trying to acquire field spectra at 8:00 AM or 17:00 PM yields uninterpretable BRDF data.',
      references: ['Curtiss, B., & Goetz, A. F. (1994). Field spectrometry: Techniques and instrumentation.']
    },
    {
      id: 'm4_s3',
      slideNumber: 3,
      title: 'Local Solar Time vs. Civil Clock Time',
      category: 'Mathematics',
      keyTakeaway: 'Civil clock time differs substantially from true local solar time due to time zones, Daylight Saving Time, and orbital eccentricity.',
      bullets: [
        'Civil noon (12:00 on your watch) rarely coincides with true solar noon (maximum solar elevation).',
        'Equation of Time (EoT): Accounts for Earth\'s orbital eccentricity and axial tilt (up to ±16 minutes shift).',
        'Longitude correction: 4 minutes of time per degree of longitude away from the time zone meridian.',
        'Always compute the exact solar noon timestamp using NOAA solar calculator algorithms before setting out.'
      ],
      mathFormula: '\\text{Solar Time} = \\text{Civil Time} + \\frac{4(\\text{Lon} - \\text{Lon}_{\\text{ref}})}{60} + \\frac{\\text{EoT}}{60} - \\text{DST}',
      formulaExplanation: 'Rigorous calculation of local solar time in hours.',
      speakerNotes: 'Walk students through calculating true solar noon for their exact university campus coordinates.',
      references: ['Reda, I., & Andreas, A. (2004). Solar position algorithm. Solar Energy.']
    },
    {
      id: 'm4_s4',
      slideNumber: 4,
      title: 'Bidirectional Reflectance & The Optical Hotspot',
      category: 'Physics',
      keyTakeaway: 'When the illumination angle and viewing angle coincide (exact retro-reflection), shadows vanish, producing the optical hotspot.',
      bullets: [
        'Hotspot (opposition surge): Sharp peak in reflected radiance when looking directly along the solar illumination vector.',
        'Physical causes: Complete disappearance of cast shadows behind foliage/soil particles + coherent backscatter.',
        'Canopy reflectance can double within 2°–5° of the exact retro-illumination direction.',
        'Avoid viewing geometries within 15° of the solar anti-solar point unless explicitly measuring hotspot parameters.'
      ],
      speakerNotes: 'Show aerial photos of the bright hotspot halo around an aircraft shadow over forests or crop canopies.',
      references: ['Kuusk, A. (1991). The hot spot effect of a plant canopy. In Photon-Vegetation Interactions, Springer.']
    },
    {
      id: 'm4_s5',
      slideNumber: 5,
      title: 'Viewing Geometry: Nadir vs. Off-Nadir Alignments',
      category: 'Protocol',
      keyTakeaway: 'Standard ground validation requires strict nadir viewing (θ_v = 0°); unintended tilts introduce multi-percent BRDF errors.',
      bullets: [
        'Nadir viewing (0° zenith) looks straight down, matching typical satellite near-nadir swaths (e.g. Landsat, Sentinel-2).',
        'A 5° tilt of the foreoptic towards the sun increases shadow exposure, artificially reducing apparent NIR reflectance.',
        'A 5° tilt away from the sun captures illuminated leaf facets, artificially boosting reflectance.',
        'Mandatory equipment: Two-axis bubble level mounted directly onto the foreoptic barrel.'
      ],
      practicalFieldNote: 'Never trust human hand leveling; handheld foreoptics consistently drift by 6° to 12° during scans.',
      speakerNotes: 'Demonstrate with a laser pointer mounted on a handheld grip how much hand tremor shifts the target footprint.',
      references: ['MacArthur, A. et al. (2014). Optimizing the use of field spectrometers. Remote Sensing of Environment.']
    },
    {
      id: 'm4_s6',
      slideNumber: 6,
      title: 'Calculating the Foreoptic Ground Footprint',
      category: 'Mathematics',
      keyTakeaway: 'The spatial sampling footprint is governed by sensor height, angular field of view, and viewing zenith angle.',
      bullets: [
        'For circular nadir foreoptics, the footprint is a circle of diameter D = 2 · h · tan(FOV / 2).',
        'Footprint area scales with the square of height: A = π · (h · tan(FOV / 2))².',
        'For off-nadir viewing (θ_v > 0°), the footprint elongates into an ellipse with major and minor axes governed by perspective projection.'
      ],
      mathFormula: 'D_{\\text{nadir}} = 2 \\cdot h \\cdot \\tan\\left(\\frac{\\text{FOV}}{2}\\right), \\quad a = h \\cdot \\frac{\\sin(\\text{FOV}/2)}{\\cos(\\theta_v + \\text{FOV}/2)}, \\; b = h \\cdot \\frac{\\sin(\\text{FOV}/2)}{\\cos(\\theta_v - \\text{FOV}/2)}',
      formulaExplanation: 'Circular nadir footprint and elliptical off-nadir footprint semimajor axes.',
      speakerNotes: 'Have students calculate footprint sizes for 1°, 8°, and 25° foreoptics held at heights of 1 m, 2 m, and 5 m.',
      references: ['Curtiss, B., & Goetz, A. F. (1994). Field spectrometry techniques.']
    },
    {
      id: 'm4_s7',
      slideNumber: 7,
      title: 'Target Footprint Sizing vs. Canopy Structural Scale',
      category: 'Protocol',
      keyTakeaway: 'The footprint diameter must be at least 3 to 5 times larger than individual canopy structural elements to achieve representative averaging.',
      bullets: [
        'If footprint is smaller than a single leaf or gap: Measurements fluctuate wildly between 100% sunlit leaf and 100% dark shadow gap.',
        'Representative Elementary Volume (REV): The minimum footprint size that yields a stable spatial average of canopy architecture.',
        'In row crops (e.g. maize, vineyards), footprint must span an integer number of crop rows and inter-row spaces to prevent row-phase bias.'
      ],
      practicalFieldNote: 'For 1 m tall agricultural crops, mount the 25° foreoptic at least 2.5 m above the top of the canopy.',
      speakerNotes: 'Draw the REV graph: variance is huge at small scale, drops to a stable plateau, then rises as regional landscape heterogeneity enters.',
      references: ['Milton, E. J. (1987). Principles of field spectroscopy. International Journal of Remote Sensing.']
    },
    {
      id: 'm4_s8',
      slideNumber: 8,
      title: 'Operator Exclusion Zone & Cast Shadows',
      category: 'Protocol',
      keyTakeaway: 'The field operator and metallic equipment must remain outside the direct solar line and diffuse field of view.',
      bullets: [
        'Direct cast shadow: An operator standing between the sun and the target casts an obvious dark shadow, ruining the scan.',
        'Diffuse sky obstruction: An operator standing near the target blocks a fraction of the 2π diffuse skylight, creating a subtle 2–5% blue deficit.',
        'Clothing reflection: A bright yellow, red, or white jacket reflects colored photons onto the target or reference panel.',
        'Standard rule: Operators must wear matte, non-reflective neutral gray or dark clothing and stand opposite or perpendicular to the solar azimuth.'
      ],
      practicalFieldNote: 'Operator must stand at least 1.5 to 2.0 meters back from the target, aligned perpendicular to the solar principal plane.',
      speakerNotes: 'Show the polar diagram of diffuse sky blockage caused by an operator standing 50 cm away from a Spectralon panel.',
      references: ['NERC FSF (2020). Best Practice Manual for Field Spectroradiometry.']
    },
    {
      id: 'm4_s9',
      slideNumber: 9,
      title: 'The Solar Principal Plane and Cross-Principal Plane',
      category: 'Mathematics',
      keyTakeaway: 'Anisotropy is maximum along the Solar Principal Plane and minimum along the Cross-Principal Plane.',
      bullets: [
        'Solar Principal Plane (SPP): Vertical plane containing the solar vector and the surface normal (azimuths φ = φ_s and φ = φ_s + 180°).',
        'Contains both the optical hotspot (retro-reflection) and forward specular scattering peak.',
        'Cross-Principal Plane (CPP): Vertical plane perpendicular to the SPP (azimuths φ = φ_s ± 90°).',
        'BRDF variation is most symmetric and minimal in the Cross-Principal Plane, making it ideal for directional calibration tests.'
      ],
      speakerNotes: 'Draw the 3D spherical coordinate geometry showing the SPP and CPP orientations relative to solar position.',
      references: ['Schaepman-Strub, G. et al. (2006). Remote Sensing of Environment, 103(1), 27-42.']
    },
    {
      id: 'm4_s10',
      slideNumber: 10,
      title: 'Spatial Heterogeneity & Sample Size Determination',
      category: 'Mathematics',
      keyTakeaway: 'The required number of field spectra depends statistically on target spatial variance and the desired margin of error.',
      bullets: [
        'Central Limit Theorem: The standard error of the mean decreases with the square root of sample size: SE = s / √N.',
        'For a 95% confidence interval with allowable relative margin of error E: N = (t_crit · CV / E)², where CV is coefficient of variation (s / x̄).',
        'In uniform wheat fields, N = 10–15 spectra may suffice; in heterogeneous rangelands, N = 50–100 spectra are required.'
      ],
      mathFormula: 'N = \\left( \\frac{z_{1-\\alpha/2} \\cdot \\text{CV}}{E} \\right)^2',
      formulaExplanation: 'Sample size formula for estimating population mean reflectance within relative tolerance E.',
      speakerNotes: 'Work through an example: If CV = 20% and we want mean reflectance estimated within 5% error, N = (1.96 * 0.20 / 0.05)^2 ≈ 62 samples.',
      references: ['Cochran, W. G. (1977). Sampling Techniques (3rd ed.). John Wiley & Sons.']
    },
    {
      id: 'm4_s11',
      slideNumber: 11,
      title: 'Sampling Strategies: Stratified Random vs. Systematic Grids',
      category: 'Protocol',
      keyTakeaway: 'Spatial sampling designs must avoid sampling bias to represent true landscape pixel compositions accurately.',
      bullets: [
        'Simple Random Sampling: Every ground point has an equal chance of selection; avoids spatial autocorrelation bias.',
        'Stratified Random Sampling: Divides heterogeneous field into homogeneous strata (e.g. hill crest, slope, hollow) and samples each proportionally.',
        'Systematic Regular Grid: Evenly spaced grid nodes; guarantees uniform spatial coverage across satellite pixel footprints.',
        'Cross-Transects (Star / X-shape): Rapid collection covering major directional gradients across a 30m × 30m pixel.'
      ],
      speakerNotes: 'Compare the four sampling diagrams and discuss when stratified random is superior to systematic grids.',
      references: ['McCoy, R. M. (2005). Field Methods in Remote Sensing. Guilford Press.']
    },
    {
      id: 'm4_s12',
      slideNumber: 12,
      title: 'Satellite Pixel Validation: Upscaling to Sentinel-2 and Landsat',
      category: 'CaseStudy',
      keyTakeaway: 'Validating a 10m Sentinel-2 or 30m Landsat pixel requires integrating multi-point ground spectra weighted by Point Spread Function (PSF).',
      bullets: [
        'A single point spectrometer footprint (0.5 m) covers < 0.25% of a 10m × 10m Sentinel-2 pixel area (100 m²).',
        'Point Spread Function (PSF): Satellite pixels are not square boxcars; the optical system weights central radiance higher than edges.',
        'Field sampling must distribute 20 to 50 spectral points across the satellite Elementary Sampling Unit (ESU) centered on high-precision GNSS coordinates.'
      ],
      mathFormula: '\\bar{\\rho}_{\\text{pixel}}(\\lambda) = \\frac{\\sum_{i=1}^N \\text{PSF}(x_i, y_i) \\cdot \\rho_i(\\lambda)}{\\sum_{i=1}^N \\text{PSF}(x_i, y_i)}',
      formulaExplanation: 'PSF-weighted spatial aggregation of point field spectra to satellite pixel scale.',
      speakerNotes: 'Show the Gaussian 2D PSF of Sentinel-2 MSI and how off-center ground targets contribute to adjacent pixels.',
      references: ['Baret, F. et al. (2006). VALERI: A network of sites and a methodology for the validation of medium spatial resolution land products.']
    },
    {
      id: 'm4_s13',
      slideNumber: 13,
      title: 'High-Precision GNSS Georeferencing in the Field',
      category: 'Protocol',
      keyTakeaway: 'Standard smartphone GPS (±5 m error) is unacceptable for validating 10m satellite pixels; RTK-GNSS (±2 cm) is mandatory.',
      bullets: [
        'A 5-meter positional error places the validation sample into an adjacent agricultural field or road boundary.',
        'Real-Time Kinematic (RTK) GNSS: Uses base-station carrier-phase differential corrections to achieve 1–2 cm horizontal precision.',
        'PPK (Post-Processed Kinematic): Logs raw satellite observables for post-survey processing when cell coverage is absent.',
        'Log GNSS coordinate at every spectral sampling station and record antenna height and horizontal dilution of precision (HDOP).'
      ],
      practicalFieldNote: 'Wait for RTK Fixed status before logging waypoint; never accept RTK Float or autonomous GPS fixes.',
      speakerNotes: 'Explain the difference between RTK Fixed (integer ambiguity resolved, cm accuracy) and RTK Float (decimeter uncertainty).',
      references: ['Hofmann-Wellenhof, B. et al. (2008). GNSS – Global Navigation Satellite Systems. Springer.']
    },
    {
      id: 'm4_s14',
      slideNumber: 14,
      title: 'Continuous Illumination Monitoring: Pyranometers & Sky Radiometers',
      category: 'QualityAssurance',
      keyTakeaway: 'Deploying a continuous solar pyranometer station concurrent with field scans detects sub-visual cloud transients.',
      bullets: [
        'A dedicated pyranometer logging global solar irradiance at 1-second intervals provides an objective atmospheric stability record.',
        'Irradiance coefficient of variation: CV_solar = σ(E) / μ(E) evaluated over 60-second sliding windows.',
        'Quality threshold: Flag and discard field spectral scans acquired when CV_solar > 0.5% over the measurement duration.'
      ],
      practicalFieldNote: 'Set the pyranometer logger on a small tripod in the center of the field site, connected via Bluetooth or SD card.',
      speakerNotes: 'Show how a passing thin cirrus cloud creates a 3% dip in pyranometer flux that is invisible to the naked eye.',
      references: ['MacArthur, A. et al. (2014). Remote Sensing of Environment.']
    },
    {
      id: 'm4_s15',
      slideNumber: 15,
      title: 'Aerosol Optical Depth (AOD) Tracking with Sun Photometers',
      category: 'Instrumentation',
      keyTakeaway: 'Handheld sun photometers (Microtops II) track instantaneous aerosol optical depth and total precipitable water column.',
      bullets: [
        'Microtops II: Five-channel handheld sun photometer pointed directly at the solar disk.',
        'Measures direct solar irradiance at 380, 440, 675, 870, and 936 nm.',
        'Retrieves AOD at 500 nm (τ₅₀₀) and water vapor column (W in cm) via Langley plot calibration.',
        'CEOS WGCV requirement: Field campaigns must log AOD < 0.20 to guarantee clear-sky calibration quality.'
      ],
      practicalFieldNote: 'Align the sun\'s image onto the Microtops alignment target with steady hands and take triplets of readings.',
      speakerNotes: 'Introduce the Microtops instrument and show how AERONET data can substitute if a fixed site is within 25 km.',
      references: ['Morys, M. et al. (2001). Design, calibration, and performance of Microtops II handheld sunphotometer. Journal of Geophysical Research.']
    },
    {
      id: 'm4_s16',
      slideNumber: 16,
      title: 'Environmental Covariates: Soil Moisture, Air Temp & Humidity',
      category: 'QualityAssurance',
      keyTakeaway: 'Spectra are meaningless without concurrent documentation of auxiliary biophysical and environmental covariates.',
      bullets: [
        'Soil moisture: Volumetric Water Content (VWC %) measured with TDR / FDR impedance probes in the top 5 cm.',
        'Surface temperature: Thermal infrared radiometer (e.g. Apogee IRT) measuring target kinetic temperature.',
        'Meteorological covariates: Air temperature, relative humidity, wind speed, barometric pressure logged with portable weather station.'
      ],
      practicalFieldNote: 'Surface soil drying during a 4-hour midday campaign increases soil reflectance at 1600 nm by up to 15%.',
      speakerNotes: 'Explain how neglecting soil moisture changes during a day can lead to false conclusions about vegetation growth.',
      references: ['McCoy, R. M. (2005). Field Methods in Remote Sensing.']
    },
    {
      id: 'm4_s17',
      slideNumber: 17,
      title: 'Vegetation Canopy Structural Metrics: LAI and Leaf Angle',
      category: 'Protocol',
      keyTakeaway: 'Canopy reflectance is strongly governed by Leaf Area Index (LAI) and Leaf Angle Distribution (LAD).',
      bullets: [
        'Leaf Area Index (LAI): Total one-sided leaf area per unit ground surface area [m² / m²].',
        'Measure LAI concurrently using digital hemispherical photography (DHP) or plant canopy analyzers (LI-COR LAI-2200C).',
        'Leaf Angle Distribution: Planophile (horizontal), erectophile (vertical), spherical, or plagiophile.',
        'Erectophile canopies (grasses) show deep photon penetration and high shadow fractions at low SZA.',
        'Planophile canopies (sunflower, clover) saturate reflectance at lower LAI values.'
      ],
      speakerNotes: 'Show photos of an erectophile grass canopy vs planophile clover and contrast their nadir reflectance spectra.',
      references: ['Jonckheere, I. et al. (2004). Review of methods for in situ leaf area index determination. Agricultural and Forest Meteorology.']
    },
    {
      id: 'm4_s18',
      slideNumber: 18,
      title: 'Leaf Sampling Protocols: Top-of-Canopy vs. Understory',
      category: 'Protocol',
      keyTakeaway: 'When collecting foliar contact probe spectra, sampling must follow standardized vertical canopy stratification.',
      bullets: [
        'Sunlit top-of-canopy leaves have higher nitrogen, higher chlorophyll a/b ratio, thicker cuticles, and more palisade parenchyma layers.',
        'Shade leaves have higher specific leaf area (SLA) and lower overall reflectance in the NIR.',
        'Protocol: Collect fully expanded, healthy leaves from the upper outer sunlit crown (sun leaves) using pole pruners.',
        'Wrap detached petioles in moist paper towels, seal in dark zip-bags on blue ice, and measure within 2 hours.'
      ],
      practicalFieldNote: 'Never let leaves wilt or dehydrate before contact probe measurement; cell collapse alters NIR scattering instantly.',
      speakerNotes: 'Discuss proper leaf preservation techniques for remote expeditions.',
      references: ['Doughty, C. E. et al. (2011). Foliar spectral traits in tropical trees. Remote Sensing of Environment.']
    },
    {
      id: 'm4_s19',
      slideNumber: 19,
      title: 'Soil Surface Preparation Protocols: Roughness and Crusts',
      category: 'Protocol',
      keyTakeaway: 'Surface crusts, tillage furrows, and gravel lag deposits dictate soil directional reflectance and micro-shadowing.',
      bullets: [
        'Micro-relief and surface roughness cast micro-shadows that reduce overall spectral reflectance (darkening effect).',
        'Biological soil crusts (biocrusts): Cyanobacteria, lichens, and mosses produce distinct chlorophyll absorption features on soil surfaces.',
        'Protocol: Document whether the soil surface is undisturbed, crusted, ploughed, or freshly raked.',
        'If collecting soil for laboratory spectroscopy, follow ISO 18400 sampling and dry sieving protocols (< 2 mm).'
      ],
      speakerNotes: 'Show how biological soil crusts in drylands produce a false "vegetation" signal due to cyanobacterial chlorophyll.',
      references: ['Ben-Dor, E. et al. (1999). Imaging spectrometry for soil applications. Remote Sensing of Environment.']
    },
    {
      id: 'm4_s20',
      slideNumber: 20,
      title: 'Aquatic and Water Surface Protocols: Above-Water Radiometry',
      category: 'Protocol',
      keyTakeaway: 'Water surface radiometry requires precise viewing angles (θ_v = 40°, φ_rel = 135°) to avoid direct sun glint.',
      bullets: [
        'Mobley (1999) protocol: Aim foreoptic at water surface at viewing zenith angle θ_v = 40° and relative azimuth angle Δφ = 135° from the sun.',
        'Measure water radiance L_t, sky radiance L_sky (at θ_sky = 40°), and downwelling irradiance E_s.',
        'Water-leaving radiance: L_w = L_t - ρ_sky · L_sky, where ρ_sky is the Fresnel surface reflectance factor (typically 0.028 for calm water).'
      ],
      mathFormula: 'R_{\\text{rs}}(\\lambda) = \\frac{L_w(\\lambda)}{E_s(\\lambda)} = \\frac{L_t(\\lambda) - \\rho_{\\text{sky}} L_{\\text{sky}}(\\lambda)}{E_s(\\lambda)}',
      formulaExplanation: 'Remote Sensing Reflectance (R_rs) [sr⁻¹] for aquatic optical applications.',
      speakerNotes: 'Point out why measuring water straight down (nadir) fails: severe sun glint blinds the spectrometer.',
      references: ['Mobley, C. D. (1999). Estimation of the remote-sensing reflectance from above-surface measurements. Applied Optics.']
    },
    {
      id: 'm4_s21',
      slideNumber: 21,
      title: 'Field Goniometers: Measuring Multi-Angular BRDF Outdoors',
      category: 'Instrumentation',
      keyTakeaway: 'Field goniometers rotate a spectrometer foreoptic across a hemispherical arc to map surface anisotropy in situ.',
      bullets: [
        'Examples: FIGIFIGO (Finnish Geodetic Institute), ASG (Airborne Spectrometer Goniometer), MUFIGO.',
        'Acquires reflected radiance across multiple view zenith angles (0° to 70°) and azimuth angles (0° to 360°).',
        'Requires rapid automated acquisition (< 10 minutes) before solar position shifts significantly.',
        'Provides empirical BRDF kernels used to calibrate MODIS and satellite BRDF/albedo products.'
      ],
      speakerNotes: 'Show video/photos of the FIGIFIGO goniometer operating over snow and peat bogs.',
      references: ['Suomalainen, J. et al. (2009). FIGIFIGO—A new Brazilian-Finnish field goniometer system. Sensors.']
    },
    {
      id: 'm4_s22',
      slideNumber: 22,
      title: 'Drone / UAV Pre-Survey Reconnaissance',
      category: 'CaseStudy',
      keyTakeaway: 'Deploying a high-resolution RGB drone before ground spectroscopy maps micro-spatial heterogeneity and guides sampling strata.',
      bullets: [
        'Fly a preliminary 15-minute drone orthophoto survey at 30 m altitude (GSD < 1 cm).',
        'Generate instant NDVI and elevation models to identify canopy gaps, bare soil patches, and vegetation vigor gradients.',
        'Delineate homogeneous strata and assign optimal GPS waypoints for ground spectrometer operators.'
      ],
      practicalFieldNote: 'Store the drone orthomosaic on field tablets for real-time navigation to sampling stations.',
      speakerNotes: 'Highlight how UAV reconnaissance prevents wasting field time on non-representative ground patches.',
      references: ['Anderson, K., & Gaston, K. J. (2013). Lightweight unmanned aerial vehicles will revolutionize spatial ecology. Frontiers in Ecology.']
    },
    {
      id: 'm4_s23',
      slideNumber: 23,
      title: 'Metadata Standards: ISO 19115-2 & FGDC Extensions',
      category: 'QualityAssurance',
      keyTakeaway: 'Data without standardized metadata is scientifically useless; ISO 19115-2 defines geospatial imagery and gridded data schemas.',
      bullets: [
        'ISO 19115-2: Geographic information — Metadata — Part 2: Extensions for acquisition and processing.',
        'Mandatory sections: Lineage, instrument identification, platform characteristics, acquisition geometry, environmental conditions.',
        'Machine-readable metadata: XML and JSON schemas enabling automated ingestion into global spectral repositories (SPECCHIO, ECOSTRESS).'
      ],
      speakerNotes: 'Review the hierarchical tree structure of an ISO 19115-2 metadata document.',
      references: ['ISO (2019). ISO 19115-2:2019 Geographic information — Metadata — Part 2. International Organization for Standardization.']
    },
    {
      id: 'm4_s24',
      slideNumber: 24,
      title: 'The NERC FSF Field Metadata Protocol',
      category: 'QualityAssurance',
      keyTakeaway: 'The Natural Environment Research Council Field Spectroscopy Facility defines the gold-standard operational field logging template.',
      bullets: [
        'Standard field sheet tracks 28 mandatory parameters per sampling station.',
        'Includes: Campaign code, site name, instrument serial number, foreoptic ID, white reference ID, target description.',
        'Optical parameters: Time (UTC), solar zenith, solar azimuth, sensor height, view zenith, view azimuth.',
        'Environmental logs: Sky clarity (oktas), cloud types, wind speed, relative humidity, air temperature.'
      ],
      practicalFieldNote: 'Complete every field sheet field in ink at the moment of acquisition; never reconstruct metadata from memory at the hotel.',
      speakerNotes: 'Distribute printable NERC FSF field sheets and review their layout.',
      references: ['NERC FSF (2020). Field Spectroscopy Protocol and Recording Template.']
    },
    {
      id: 'm4_s25',
      slideNumber: 25,
      title: 'Digital Field Logging Systems: Mobile Apps & Electronic Tablets',
      category: 'Instrumentation',
      keyTakeaway: 'Ruggedized field tablets with synchronized digital logging eliminate transcription errors and automatically tag GNSS and timestamps.',
      bullets: [
        'Digital tools: QField, ArcGIS Survey123, Fulcrum, or custom SPECCHIO mobile logging apps.',
        'Direct Bluetooth sensor integration: Auto-populates GPS coordinates, compass heading, and digital photo into the spectral database.',
        'Instant validation: Software validates that solar zenith is within bounds and alerts operator if time since last WR exceeds 5 minutes.'
      ],
      speakerNotes: 'Demonstrate how an electronic form ensures no required parameter is accidentally skipped.',
      references: ['Hueni, A. et al. (2009). The spectral database SPECCHIO for improved data sharing and data analysis. Computers & Geosciences.']
    },
    {
      id: 'm4_s26',
      slideNumber: 26,
      title: 'Target Site Photography: Contextual and Nadir Imagery',
      category: 'Protocol',
      keyTakeaway: 'Every spectral target must be paired with high-resolution nadir and oblique contextual photography.',
      bullets: [
        'Nadir target photo: Taken looking straight down with a scale bar / ruler and color calibration checker (e.g. Macbeth card) in frame.',
        'Allows automated digital image classification of fractional cover (green leaf %, brown litter %, bare soil %).',
        'Four-cardinal-direction contextual photos: North, East, South, West views from the station to document surrounding terrain.',
        'Sky condition photo: 180° fish-eye or wide-angle sky photo showing cloud cover status at time of scan.'
      ],
      practicalFieldNote: 'Position the scale bar on the edge of the target footprint, never inside the active field of view.',
      speakerNotes: 'Show how a photograph taken 5 years ago helped resolve an unexpected spectral anomaly in a long-term ecological study.',
      references: ['CEOS WGCV (2014). Field Spectrometry Protocol.']
    },
    {
      id: 'm4_s27',
      slideNumber: 27,
      title: 'Field Team Logistics, Roles and Safety Choreography',
      category: 'Protocol',
      keyTakeaway: 'A two-person field crew with distinct, synchronized roles operates 3x faster and with significantly fewer protocol errors.',
      bullets: [
        'Role 1 (Instrument Operator): Manages foreoptic pistol grip/boom, maintains nadir level, aims precisely, wears dark clothing.',
        'Role 2 (Data Logger & Navigator): Controls computer/tablet, monitors real-time spectrum, tracks time since last WR, logs environmental data.',
        'Communication: Verbal callouts ("Optimizing", "White Reference Acquired", "Scanning Target 1 of 5", "Save Complete").',
        'Field safety: Heat stress mitigation, hydration, snake/insect protection, and vehicle communications in remote terrains.'
      ],
      practicalFieldNote: 'Rotate roles every 2 hours to maintain sharp attention and prevent operator physical fatigue.',
      speakerNotes: 'Run a mock drill in the classroom simulating the two-person team verbal communication sequence.',
      references: ['NERC FSF (2020). Operational Field Guide.']
    },
    {
      id: 'm4_s28',
      slideNumber: 28,
      title: 'Post-Field Data QA/QC Triage Protocol',
      category: 'QualityAssurance',
      keyTakeaway: 'Execute systematic data triage immediately at the end of each field day while field conditions remain fresh in memory.',
      bullets: [
        'Step 1 (Integrity check): Verify file count matches field log sheets; confirm no corrupted or 0-byte files.',
        'Step 2 (Visual screening): Plot all spectra in batch; immediately flag and isolate outliers with spurious slopes or clipping.',
        'Step 3 (WR verification): Inspect WR check files; ensure maximum departure from 1.0 is < 1.5%.',
        'Step 4 (Backup redundancy): Implement the 3-2-1 backup rule: 3 copies, 2 different media (laptop + external SSD), 1 cloud/remote copy.'
      ],
      practicalFieldNote: 'Never wipe instrument memory cards until two verified backups have been completed and checked.',
      speakerNotes: 'Teach students the heartbreak of lost field data and how strict daily triage saves research projects.',
      references: ['Wilkinson, M. D. et al. (2016). Scientific Data, 3, 160018.']
    },
    {
      id: 'm4_s29',
      slideNumber: 29,
      title: 'Case Study: Golden Grassland Cal/Val Campaign in California',
      category: 'CaseStudy',
      keyTakeaway: 'The Jasper Ridge grassland field campaigns demonstrate how rigorous geometric protocols validate AVIRIS and PRISMA missions.',
      bullets: [
        'Target: Mediterranean annual grassland undergoing rapid summer dry-down.',
        'Protocol: 100m × 100m grid with 49 sampling stations; ASD FieldSpec on 2.5m boom arm; RTK GPS coordinates.',
        'Result: Characterized dry matter fraction (cellulose and lignin absorption at 2100 and 2300 nm) with R² = 0.89 against satellite retrievals.',
        'Key success factor: Strict adherence to SZA < 40° window eliminated senescent canopy shadowing artifacts.'
      ],
      speakerNotes: 'Show the Jasper Ridge spatial maps, hyperspectral image cubes, and the strong agreement with field spectra.',
      references: ['Gamon, J. A. et al. (1993). Functional patterns in an annual grassland during an AVIRIS overflight. Remote Sensing of Environment.']
    },
    {
      id: 'm4_s30',
      slideNumber: 30,
      title: 'Module 4 Synthesis & Preparing for Hyperspectral Imaging',
      category: 'Protocol',
      keyTakeaway: 'Flawless field protocols guarantee high-confidence ground truth data ready for scaling to UAV and satellite imaging platforms.',
      bullets: [
        'Module 4 synthesized: Solar zenith angle restrictions, BRDF avoidance, footprint calculations, operator exclusion, and ISO metadata.',
        'In Module 5, we transition from single-point spectrometers to 2D hyperspectral and multispectral imaging: pushbroom cameras, UAV payloads, and image cubes.',
        'Preparation for Field Exercise 4: Executing a full multi-point sampling grid over a heterogeneous vegetated parcel.'
      ],
      speakerNotes: 'Review the golden rules of field radiometry, answer questions on sampling geometry, and introduce Lab 4.',
      references: ['Milton, E. J. et al. (2009). Progress in field spectroscopy. Remote Sensing of Environment, 113, S92-S109.']
    }
  ];
}

export const MODULE_4: CourseModule = {
  id: 'module_4',
  moduleNumber: 4,
  title: 'Rigorous Field Sampling Protocols, Geometry & Quality Assurance',
  shortTitle: 'Field Protocols & Sampling Geometry',
  subtitle: 'Solar zenith angle windows, BRDF hotspot avoidance, footprint geometry, operator exclusion, and ISO 19115-2 metadata',
  durationHours: 4,
  ectsCredits: 1.5,
  abstract: 'Module 4 bridges laboratory precision with the complex realities of outdoor field environments. MSc students master the geometry and physics of natural outdoor radiometry: restricting observations to the SZA < 45°–50° golden window, converting between civil time and true local solar time, and avoiding the optical retro-reflection hotspot. The module formulates sensor height and foreoptic footprint math, defines operator shadow/skylight exclusion zones, and establishes robust spatial sampling strategies (stratified random, regular grids, transects) for scaling up to Sentinel-2 and Landsat pixels. Students implement comprehensive metadata logging compliant with ISO 19115-2 and NERC FSF guidelines.',
  coreCompetencies: [
    'Calculate true local solar time, solar zenith angle, and determine allowable daily observation windows.',
    'Formulate foreoptic footprint geometries (circular nadir and elliptical off-nadir) and determine Representative Elementary Volumes (REV).',
    'Design and execute unbiased spatial sampling schemes (stratified random, systematic grid, transect) for satellite pixel validation.',
    'Establish operator positioning and non-reflective attire protocols to eliminate direct cast shadows and diffuse sky blockage.',
    'Compile comprehensive field campaign metadata compliant with ISO 19115-2 and CEOS WGCV standards.'
  ],
  slides: generateModule4Slides(),
  fieldExercise: {
    title: 'Field Exercise 4: Designing & Executing a Multi-Point Satellite Validation Grid with Standardized Metadata',
    estimatedDuration: '4 hours',
    targetEnvironment: 'Heterogeneous landscape patch (30m × 30m) matching a single Landsat or 3x3 Sentinel-2 pixel array',
    recommendedInstruments: ['Field Spectroradiometer with 25° foreoptic on 2m boom tripod', '99% Spectralon White Reference Panel', 'RTK-GNSS receiver with survey pole', 'Microtops II Sunphotometer or continuous logging solar pyranometer', 'Rugged digital field tablet with NERC FSF metadata logging forms'],
    safetyAndPreTripChecklist: [
      'Calculate true local solar noon and determine the start and end cutoff times for SZA ≤ 45°.',
      'Check meteorological forecast: Must be cloudless with forecast aerosol optical depth AOD < 0.2.',
      'All field crew must wear matte, non-reflective neutral dark or gray shirts (no bright white, yellow, or red clothing).',
      'Initialize RTK-GNSS base station and verify sub-3 cm fixed precision on site benchmark.'
    ],
    fieldProtocolSteps: [
      {
        stepNumber: 1,
        action: 'Survey a 30m × 30m grid aligned with UTM grid north, establishing 16 systematically spaced sampling stations (4×4 grid at 7.5m intervals).',
        scientificRationale: 'Replicates the spatial footprint of an Earth observation pixel and captures internal sub-pixel spatial heterogeneity.',
        commonErrorToAvoid: 'Choosing an arbitrary non-georeferenced plot boundary that cannot be matched to satellite image grids.'
      },
      {
        stepNumber: 2,
        action: 'Deploy a solar pyranometer logger at the center of the grid recording global irradiance at 1 Hz throughout the 4-hour window.',
        scientificRationale: 'Provides a continuous atmospheric stability baseline to screen and flag scans acquired during minor illumination transients.',
        commonErrorToAvoid: 'Setting the pyranometer in a location where trees or moving operators cast intermittent shadows.'
      },
      {
        stepNumber: 3,
        action: 'At each station, position the 2m boom arm perpendicular to the solar azimuth. Re-acquire Dark Current and White Reference if > 5 minutes have elapsed.',
        scientificRationale: 'Prevents operator body cast shadow and diffuse sky blockage while controlling for solar diurnal drift.',
        commonErrorToAvoid: 'Allowing the operator to stand directly south of the target, blocking the direct solar beam.'
      },
      {
        stepNumber: 4,
        action: 'Record 5 repeated target scans per station, take a nadir photograph with scale bar, log RTK-GNSS coordinates, and record soil moisture and LAI.',
        scientificRationale: 'Provides Type A variance statistics and concurrent biophysical covariates required for radiative transfer modeling.',
        commonErrorToAvoid: 'Failing to take the nadir photograph, preventing retrospective fractional cover analysis.'
      }
    ],
    dataRecordingSheetFields: [
      'Station ID (e.g. GRID_A1 to GRID_D4)',
      'Timestamp (UTC)',
      'RTK Easting / Northing / Orthometric Height (m)',
      'Solar Zenith Angle θ_s (deg)',
      'Solar Azimuth Angle φ_s (deg)',
      'Sensor Height Above Canopy h (m)',
      'Calculated Footprint Diameter (m)',
      'Station Mean Reflectance (Blue, Green, Red, NIR, SWIR1, SWIR2)',
      'Volumetric Soil Moisture (%)',
      'Sky Condition / Cloud Okta',
      'Operator Initials'
    ],
    fieldDeliverable: 'Submit a complete spatial dataset comprising calibrated station spectra, GIS shapefile with RTK coordinates and spectral attributes, pyranometer illumination stability log, and ISO 19115-2 compliant XML metadata.'
  },
  practicalLab: {
    title: 'Practical Lab 4: Spatial Statistics of Field Spectra, Point Spread Function (PSF) Weighting & SZA Modeling in Python and R',
    softwareEnvironment: 'Hybrid (Python & R)',
    primaryPackages: ['numpy', 'scipy', 'geopandas', 'shapely', 'matplotlib', 'hsdar (R)', 'raster (R)'],
    learningObjectives: [
      'Compute local solar time, solar declination, and solar zenith angle (SZA) across diurnal cycles.',
      'Analyze spatial autocorrelation (semivariograms) of field spectra across a 30m × 30m grid.',
      'Implement Point Spread Function (PSF) convolution to upscale point spectra to Sentinel-2 MSI pixel footprints.',
      'Generate ISO 19115-2 compliant XML metadata records from field log tables.'
    ],
    sampleDataset: {
      name: 'Field_Grid_30m_Validation_Data.csv',
      description: 'Tabular dataset of 16 spatial grid stations across an agricultural field, including RTK-GNSS coordinates, calibrated 2151-channel spectra, LAI, and soil moisture measurements.',
      spectralRange: '350 - 2500 nm',
      sensor: 'ASD FieldSpec 4 with 25° Bare Fiber on 2m Boom',
      bandsCount: 2151
    },
    codeSnippets: [
      {
        language: 'python',
        title: 'Python: Point Spread Function (PSF) Spatial Upscaling to Satellite Pixel',
        description: 'Simulates a 2D Gaussian Point Spread Function of a satellite sensor and computes the PSF-weighted average reflectance from 16 ground sampling points.',
        code: `import numpy as np
import matplotlib.pyplot as plt

def gaussian_2d_psf(x, y, x0=0, y0=0, fwhm=10.0):
    """Calculates 2D Gaussian Point Spread Function (PSF) weight."""
    sigma = fwhm / (2.0 * np.sqrt(2.0 * np.log(2.0)))
    return np.exp(-((x - x0)**2 + (y - y0)**2) / (2.0 * sigma**2))

def upscale_points_to_satellite_pixel(point_coords, point_spectra, pixel_center=(0, 0), pixel_fwhm=10.0):
    """
    point_coords: (N, 2) array of [X, Y] relative offsets from pixel center in meters
    point_spectra: (N, n_bands) array of ground reflectance curves
    """
    weights = []
    for (x, y) in point_coords:
        w = gaussian_2d_psf(x, y, x0=pixel_center[0], y0=pixel_center[1], fwhm=pixel_fwhm)
        weights.append(w)
    
    weights = np.array(weights)
    sum_weights = np.sum(weights)
    normalized_weights = weights / sum_weights
    
    # Weighted average spectrum
    upscaled_spectrum = np.dot(normalized_weights, point_spectra)
    return upscaled_spectrum, normalized_weights

# Simulate 16 grid points inside a 10m x 10m Sentinel-2 pixel
x_coords = np.linspace(-4, 4, 4)
y_coords = np.linspace(-4, 4, 4)
xx, yy = np.meshgrid(x_coords, y_coords)
coords = np.column_stack([xx.ravel(), yy.ravel()])

# Synthetic spectra: 2151 bands per point with random spatial variability
np.random.seed(42)
wl = np.arange(350, 2501, 1)
base_veg = 0.05 + 0.40 / (1.0 + np.exp(-0.04 * (wl - 715)))
point_spectra = []
for i in range(16):
    var = np.random.normal(1.0, 0.08) # +/-8% spatial canopy vigor variation
    point_spectra.append(base_veg * var)
point_spectra = np.array(point_spectra)

upscaled_refl, w_norm = upscale_points_to_satellite_pixel(coords, point_spectra, pixel_fwhm=10.0)

print(f"Total grid stations: {len(coords)}")
print(f"Center station weight: {w_norm[5]:.4f} vs Corner station weight: {w_norm[0]:.4f}")
print(f"Upscaled Pixel NIR Reflectance (800 nm): {upscaled_refl[wl == 800][0]:.4f}")
`
      },
      {
        language: 'r',
        title: 'R Script: Solar Zenith Angle (SZA) Diurnal Window Calculator',
        description: 'Computes solar declination, hour angle, and solar zenith angle across a 24-hour cycle to identify the compliant observation window (SZA < 45°).',
        code: `# Principles of Field Spectroscopy: MSc Lab 4
# Solar Zenith Angle Diurnal Calculator in R

compute_solar_zenith_arc <- function(lat_deg, lon_deg, day_of_year, tz_offset_hours) {
  hours <- seq(0, 24, by=0.1)
  
  # Solar declination angle delta (Spencer 1971 formulation)
  gamma <- 2 * pi * (day_of_year - 1) / 365
  delta <- 0.006918 - 0.399912 * cos(gamma) + 0.070257 * sin(gamma) -
           0.006758 * cos(2*gamma) + 0.000907 * sin(2*gamma) # in radians
           
  # Equation of Time in minutes
  eot <- 229.18 * (0.000075 + 0.001868 * cos(gamma) - 0.032077 * sin(gamma) -
                   0.014615 * cos(2*gamma) - 0.040849 * sin(2*gamma))
                   
  # Time correction factor
  time_offset <- eot + 4 * (lon_deg - 15 * tz_offset_hours)
  true_solar_time <- hours * 60 + time_offset # in minutes
  
  # Hour angle in radians
  hour_angle <- (true_solar_time / 4 - 180) * (pi / 180)
  
  lat_rad <- lat_deg * (pi / 180)
  cos_sza <- sin(lat_rad) * sin(delta) + cos(lat_rad) * cos(delta) * cos(hour_angle)
  cos_sza <- pmax(-1, pmin(1, cos_sza)) # clamp
  sza_deg <- acos(cos_sza) * (180 / pi)
  
  valid_window <- hours[sza_deg <= 45.0]
  
  cat("--- Solar Analysis for Lat:", lat_deg, "DOY:", day_of_year, "---\\n")
  cat("Minimum SZA at Solar Noon:", round(min(sza_deg), 1), "degrees\\n")
  if (length(valid_window) > 0) {
    cat("Compliant Window (SZA <= 45 deg):", round(min(valid_window), 2), "to", round(max(valid_window), 2), "Civil Hours\\n")
  } else {
    cat("WARNING: SZA does not reach <= 45 degrees on this day (Winter or High Latitude)!\\n")
  }
  return(data.frame(Hour=hours, SZA=sza_deg))
}

# Run for Mid-Latitude Site (e.g. 51.5°N London, DOY 172 Summer Solstice)
res <- compute_solar_zenith_arc(lat_deg=51.5, lon_deg=-0.12, day_of_year=172, tz_offset_hours=1)
`
      }
    ],
    studentTasks: [
      'Write a Python script that takes a user-specified latitude, longitude, and calendar date and outputs a colored Gantt chart showing the exact start and end times of the SZA ≤ 45° golden window.',
      'Compute the empirical semivariogram of NIR reflectance across the 16 grid stations; identify the spatial range of autocorrelation to determine REV.',
      'Generate a standardized ISO 19115-2 XML metadata file for the field grid dataset incorporating all sensor, geometric, and environmental variables.'
    ],
    expectedOutputSummary: 'Students produce Python and R scripts demonstrating solar geometry modeling, PSF-weighted pixel integration, semivariogram analysis, and schema-validated geospatial XML metadata output.'
  },
  quiz: {
    moduleNumber: 4,
    title: 'Module 4 Automated Assessment: Field Sampling Protocols & Geometry',
    passingScorePercent: 80,
    questions: [
      {
        id: 'm4_q1',
        question: 'Why must primary outdoor field spectroradiometry campaigns be restricted to solar zenith angles θ_s < 45°–50°?',
        options: [
          'Because spectrometers automatically power down when solar angles exceed 50°.',
          'Because at higher SZA, optical air mass increases, shadow fractions elongate, and non-Lambertian BRDF artifacts dominate the signal.',
          'Because the speed of light decreases when the sun approaches the horizon.',
          'Because silicon photodiode arrays lose quantum efficiency in the morning.'
        ],
        correctOptionIndex: 1,
        explanation: 'At SZA > 50°, long shadows dominate the canopy, diffuse light fraction increases sharply, and the assumption of near-Lambertian behavior breaks down completely.',
        academicCitation: 'Milton, E. J. et al. (2009). Remote Sensing of Environment, 113, S92-S109.'
      },
      {
        id: 'm4_q2',
        question: 'An operator measures a crop canopy from a sensor height of 2.0 meters above the leaves using a bare fiber optic cable with a 25° field of view. What is the approximate circular footprint diameter?',
        options: [
          '0.44 m',
          '0.89 m',
          '1.52 m',
          '2.00 m'
        ],
        correctOptionIndex: 1,
        explanation: 'Diameter D = 2 · h · tan(FOV / 2) = 2 · 2.0 · tan(12.5°) = 4.0 · 0.22169 = 0.8867 m ≈ 0.89 m (89 cm).',
        academicCitation: 'Curtiss, B., & Goetz, A. F. (1994). ISSSR Proceedings.'
      },
      {
        id: 'm4_q3',
        question: 'What is the "optical hotspot" phenomenon in canopy reflectance, and why must operators avoid it during standard nadir sampling?',
        options: [
          'A dangerous laser emission triggered when batteries overheat.',
          'A sharp peak in apparent reflectance caused by zero visible shadows when viewing directly along the solar illumination vector.',
          'A thermal infrared emission band caused by boiling leaf sap.',
          'An electronic clipping artifact in 16-bit analog-to-digital converters.'
        ],
        correctOptionIndex: 1,
        explanation: 'The hotspot (opposition surge) occurs in exact retro-reflection when shadows are hidden behind illuminated structures, creating an abrupt, non-representative surge in reflected radiance.',
        academicCitation: 'Kuusk, A. (1991). The hot spot effect of a plant canopy.'
      },
      {
        id: 'm4_q4',
        question: 'Why should field operators wear matte neutral dark or gray clothing and stand opposite or perpendicular to the solar azimuth?',
        options: [
          'To satisfy local occupational safety clothing regulations.',
          'To prevent colored light reflected from bright clothing from contaminating the target and to avoid blocking diffuse skylight or casting direct shadows.',
          'To reduce electromagnetic interference with the InGaAs detector cables.',
          'To keep the spectrometer battery cool through radiative emission.'
        ],
        correctOptionIndex: 1,
        explanation: 'Brightly colored clothing (e.g. red, yellow, or white) scatters colored photons onto the reference panel or target, while standing in the wrong azimuth position blocks diffuse skylight or casts direct shadows.',
        academicCitation: 'NERC FSF (2020). Best Practice Manual for Field Spectroradiometry.'
      },
      {
        id: 'm4_q5',
        question: 'When upscaling point spectrometer measurements to validate a 10-meter Sentinel-2 pixel, why is a Point Spread Function (PSF) weighted average preferred over a simple unweighted arithmetic mean?',
        options: [
          'Because satellite sensors use square pixel lenses with zero optical aberration.',
          'Because the optical transfer function of the satellite sensor gives higher sensitivity to photons arriving from the center of the pixel than from the edges.',
          'Because unweighted averages violate the law of conservation of mass.',
          'Because PSF weighting removes atmospheric water vapor absorption automatically.'
        ],
        correctOptionIndex: 1,
        explanation: 'Real satellite optical sensors possess a roughly 2D Gaussian Point Spread Function (PSF); radiance from the geographic center of the pixel contributes more heavily to the recorded digital count than radiance from the periphery.',
        academicCitation: 'Baret, F. et al. (2006). VALERI Network Methodology.'
      }
    ]
  },
  keyReferences: [
    {
      authors: 'Milton, E. J., Schaepman, M. E., Anderson, K., & Gao, B. C.',
      year: 2009,
      title: 'Progress in field spectroscopy',
      journalOrPublisher: 'Remote Sensing of Environment, 113, S92-S109',
      doiOrUrl: '10.1016/j.rse.2007.08.001'
    },
    {
      authors: 'MacArthur, A., Robinson, I., Rossini, M., Davis, N., & MacLellan, C.',
      year: 2014,
      title: 'A philosophy and approach to optimize the use of field spectrometers in remote sensing',
      journalOrPublisher: 'Remote Sensing of Environment',
      doiOrUrl: '10.1016/j.rse.2014.04.015'
    },
    {
      authors: 'Baret, F. et al.',
      year: 2006,
      title: 'VALERI: A network of sites and a methodology for the validation of medium spatial resolution land products',
      journalOrPublisher: 'Remote Sensing of Environment'
    }
  ]
};
