import type { CourseModule, Slide } from '../types';

function generateModule3Slides(): Slide[] {
  return [
    {
      id: 'm3_s1',
      slideNumber: 1,
      title: 'Principles of Metrological Traceability in Spectroscopy',
      category: 'QualityAssurance',
      keyTakeaway: 'Traceability establishes an unbroken chain of calibrated comparisons connecting field measurements back to international SI standards (NIST/NPL).',
      bullets: [
        'Metrological traceability: Property of a measurement result whereby the result can be related to a reference through a documented unbroken chain of calibrations, each contributing to the measurement uncertainty.',
        'Primary standards: National Metrology Institutes (e.g. NIST in USA, NPL in UK, PTB in Germany).',
        'Secondary/Transfer standards: Laboratory integrating spheres, calibrated FEL tungsten lamps, and certified Spectralon panels.'
      ],
      practicalFieldNote: 'Without NIST/NPL traceability, ground validation spectra cannot be accepted for satellite Cal/Val programs.',
      speakerNotes: 'Welcome to Module 3. We focus on sensor calibration, white reference integrity, and rigorous uncertainty propagation.',
      references: ['JCGM (2008). International Vocabulary of Metrology (VIM). Joint Committee for Guides in Metrology.']
    },
    {
      id: 'm3_s2',
      slideNumber: 2,
      title: 'Wavelength Calibration: Physics of Gas Emission Lines',
      category: 'Instrumentation',
      keyTakeaway: 'Wavelength calibration maps detector channel index numbers to absolute physical wavelengths using sharp atomic emission lines.',
      bullets: [
        'Gas discharge pencil lamps: Low-pressure Mercury-Argon (Hg-Ar), Neon, Krypton, or Xenon.',
        'Atoms excited by electric discharge emit photons at invariant, quantum-mechanically defined transition wavelengths.',
        'Mercury (Hg) primary lines: 404.66 nm, 435.84 nm, 546.07 nm, 576.96 nm, 579.07 nm.',
        'Argon (Ar) lines: Dense emission line clusters in the 690–900 nm region.'
      ],
      mathFormula: '\\lambda_c = a_0 + a_1 \\cdot x + a_2 \\cdot x^2 + a_3 \\cdot x^3',
      formulaExplanation: 'Polynomial dispersion function relating pixel position x to calibrated wavelength λ_c.',
      speakerNotes: 'Show the emission spectrum of a Hg-Ar lamp. Emphasize that these physical atomic transitions never drift over time.',
      references: ['Reader, J. et al. (1980). Wavelengths and Transition Probabilities for Atoms and Atomic Ions. NIST.']
    },
    {
      id: 'm3_s3',
      slideNumber: 3,
      title: 'Wavelength Calibration in the SWIR: Mylar & Rare Earth Filters',
      category: 'Instrumentation',
      keyTakeaway: 'Solid rare-earth oxide and polymer standards provide narrow absorption lines in the SWIR (1000–2500 nm) where gas lamps have sparse lines.',
      bullets: [
        'Holmium Oxide (Ho₂O₃) and Dysprosium Oxide: Certified absorption bands in the NIR and SWIR.',
        'Mylar film (polyester): Sharp C-H and ester vibrational absorption spikes at 1660 nm, 2135 nm, 2260 nm, and 2470 nm.',
        'Band-centroid fitting: Fitting a parabolic or Gaussian peak over the observed absorption minimum yields wavelength accuracy < 0.2 nm.'
      ],
      practicalFieldNote: 'Check wavelength stability annually or following any physical drop or high-vibration vehicle transport.',
      speakerNotes: 'Describe the practical procedure for placing a Mylar film over the entrance foreoptic under a stable halogen lamp.',
      references: ['MacArthur, A. et al. (2012). Calibration and characterization of field spectrometers. NERC FSF.']
    },
    {
      id: 'm3_s4',
      slideNumber: 4,
      title: 'Absolute Radiometric Calibration: Integrating Spheres',
      category: 'Instrumentation',
      keyTakeaway: 'Radiometric calibration determines absolute spectral responsivity, converting raw digital counts into physical radiance [W m⁻² sr⁻¹ nm⁻¹].',
      bullets: [
        'Calibration source: Large internally illuminated integrating sphere (e.g. 50 cm or 100 cm diameter).',
        'Illumination: Multiple regulated quartz-tungsten-halogen (QTH) lamps operating with power supplies stable to ±0.01% current.',
        'Exit port: Uniform diffuse radiance field across the entire exit aperture (spatial uniformity > 99%).'
      ],
      mathFormula: 'R_{\\text{cal}}(\\lambda) = \\frac{\\text{DN}_{\\text{sphere}}(\\lambda) - \\text{DN}_{\\text{dark}}(\\lambda)}{t_{\\text{int}} \\cdot L_{\\text{sphere}}(\\lambda)}',
      formulaExplanation: 'Instrument spectral responsivity calibration factor R_cal [counts / (W m⁻² sr⁻¹ nm⁻¹ · ms)].',
      speakerNotes: 'Explain why integrating spheres must be calibrated against NIST gold-standard blackbody cavity furnaces.',
      references: ['Walker, J. H. et al. (1987). Spectral Radiance Calibrations. NBS Special Publication 250-1.']
    },
    {
      id: 'm3_s5',
      slideNumber: 5,
      title: 'Irradiance Calibration: Calibrated Standard FEL Lamps',
      category: 'Instrumentation',
      keyTakeaway: 'Standard 1000-Watt FEL tungsten-halogen lamps provide calibrated spectral irradiance at an exact distance of 50.0 cm.',
      bullets: [
        'FEL lamps operate at ~3100 K color temperature inside a dark baffle tunnel to eliminate stray ambient wall reflections.',
        'Inverse-square law: Spectral irradiance scales inversely with the square of the distance from the lamp filament plane.',
        'Used to calibrate cosine receptor diffusers for downwelling solar irradiance measurement.'
      ],
      mathFormula: 'E(\\lambda, r_2) = E(\\lambda, r_1) \\cdot \\left(\\frac{r_1}{r_2}\\right)^2',
      formulaExplanation: 'Inverse-square distance relationship for point-source irradiance calibration.',
      speakerNotes: 'Point out that a 1 mm positioning error in lamp distance at 50 cm produces a 0.4% calibration error.',
      references: ['Yoon, H. W. et al. (2003). Realization of the NIST detector-based spectral irradiance scale. Metrologia.']
    },
    {
      id: 'm3_s6',
      slideNumber: 6,
      title: 'Dark Current Compensation: Methods and Drift',
      category: 'QualityAssurance',
      keyTakeaway: 'Dark current must be recorded with an optical shutter closed and subtracted from raw digital counts prior to any mathematical operations.',
      bullets: [
        'Electronic baseline: Even with zero incident photons, thermal energy excites electrons into detector wells.',
        'Integration time scaling: Dark current counts accumulate linearly with exposure time in silicon arrays.',
        'Dynamic drift: Internal instrument heating causes dark current to drift continuously during outdoor field campaigns.'
      ],
      practicalFieldNote: 'Always re-acquire dark current every 10–15 minutes, or whenever ambient temperature shifts noticeably.',
      speakerNotes: 'Emphasize that dark current subtraction is non-negotiable; forgetting it renders all reflectance math invalid.',
      references: ['MacArthur, A. (2007). A field procedure to compensate for temperature drift. NERC FSF.']
    },
    {
      id: 'm3_s7',
      slideNumber: 7,
      title: 'Non-Linearity Correction of Detector Electronics',
      category: 'Instrumentation',
      keyTakeaway: 'Real photodiode arrays exhibit non-linear count responses as charge approaches the full well capacity of the junction.',
      bullets: [
        'Ideal linear detector: Double the photon flux produces exactly double the digital numbers (DN).',
        'At high charge levels (> 80% full well), recombination rates increase, causing sub-linear response.',
        'Characterized using beam-addition techniques or calibrated flux attenuator wheels.',
        'Non-linearity correction polynomials linearize digital counts to < 0.1% departure across the dynamic range.'
      ],
      mathFormula: '\\text{DN}_{\\text{linear}} = \\sum_{k=0}^p c_k \\cdot (\\text{DN}_{\\text{raw}} - \\text{DN}_{\\text{dark}})^k',
      formulaExplanation: 'Polynomial linearization function mapping raw counts to idealized linear response.',
      speakerNotes: 'Show the departure from linearity at counts > 55,000 on a 16-bit ADC, explaining why 45,000 counts is the target optimization limit.',
      references: ['Saunders, R. D., & Shumaker, J. B. (1984). Automated radiometric linearity tester. Applied Optics.']
    },
    {
      id: 'm3_s8',
      slideNumber: 8,
      title: 'Spectralon® White Reference Reflectance Calibration Certificate',
      category: 'QualityAssurance',
      keyTakeaway: 'No white reference panel is 100% reflective; NIST calibration certificates provide exact spectral correction factors (98–99%).',
      bullets: [
        'A panel assumed to be 100% introduces a systematic 1% to 2% underestimation of true target reflectance if uncorrected.',
        'Calibration certificates provide 8°/hemispherical reflectance factors at 50 nm intervals from 250 to 2500 nm.',
        'Interpolation: Cubic spline interpolation maps certificate values onto the 1 nm instrument channels.'
      ],
      mathFormula: '\\rho_{\\text{target}}(\\lambda) = \\frac{\\text{DN}_{\\text{target}}(\\lambda) - \\text{DN}_{\\text{dark}}(\\lambda)}{\\text{DN}_{\\text{ref}}(\\lambda) - \\text{DN}_{\\text{dark}}(\\lambda)} \\cdot R_{\\text{certificate}}(\\lambda)',
      formulaExplanation: 'Proper application of the NIST-traceable Spectralon calibration vector R_certificate.',
      practicalFieldNote: 'Store the active calibration certificate file in the field laptop and verify matching panel serial numbers.',
      speakerNotes: 'Walk students through reading a genuine Labsphere calibration certificate and extracting the tabular data.',
      references: ['Labsphere Inc. (2018). Spectralon Reflectance Standards Technical Guide.']
    },
    {
      id: 'm3_s9',
      slideNumber: 9,
      title: 'Spectralon Degradation: UV Solarization & Soil Dust Contamination',
      category: 'QualityAssurance',
      keyTakeaway: 'Field use inevitably degrades Spectralon panels; annual recalibration is essential for data credibility.',
      bullets: [
        'UV Solarization: Extended exposure to intense outdoor solar UV radiation breaks polymer bonds, causing yellowing and UV absorption.',
        'Dust and Organic Particulates: Windblown fine dust lodges permanently into the microscopic porous PTFE matrix.',
        'Hydrocarbon Stains: Touching the panel with oily fingers introduces C-H absorption troughs in the SWIR (1200, 1720, 2300 nm).'
      ],
      practicalFieldNote: 'Never blow dust off a panel with your mouth (saliva droplets ruin the surface); use clean dry nitrogen or a photographic air bulb.',
      speakerNotes: 'Show before-and-after spectral curves of an abused field panel versus a pristine reference.',
      references: ['MacArthur, A. et al. (2012). NERC FSF Technical Report.']
    },
    {
      id: 'm3_s10',
      slideNumber: 10,
      title: 'Spectralon Resurfacing & Cleaning Protocol',
      category: 'QualityAssurance',
      keyTakeaway: 'Spectralon panels can be restored to near-factory reflectance by gentle wet-sanding under deionized water.',
      bullets: [
        'Equipment: Waterproof 220–400 grit silicon carbide emery sandpaper, glass plate, deionized water.',
        'Procedure: Place sandpaper on flat glass, wet thoroughly, sand panel in a figure-eight pattern under gentle pressure.',
        'Bakeout: Dry in a clean vacuum oven at 80°C for 8–12 hours to drive off residual water and volatile organics.',
        'Post-sanding: Must be recalibrated or cross-calibrated against a secondary master laboratory panel.'
      ],
      practicalFieldNote: 'Perform cleaning only in a clean laboratory environment, never in the field hotel or tent.',
      speakerNotes: 'Describe the Labsphere recommended sanding procedure step-by-step.',
      references: ['Labsphere Inc. (2015). Care and Handling of Spectralon Diffuse Reflectance Targets.']
    },
    {
      id: 'm3_s11',
      slideNumber: 11,
      title: 'Secondary Field Panels vs. Master Laboratory Standards',
      category: 'QualityAssurance',
      keyTakeaway: 'Protect master calibration standards by using dedicated secondary panels in the field and reserving pristine masters for lab checks.',
      bullets: [
        'Golden Master Panel: Kept permanently in a dark, desiccated laboratory cabinet, never taken into the field.',
        'Field Working Panels: Deployed in outdoor campaigns and subjected to dust, sun, and transport.',
        'Cross-calibration: Measure field working panels against the golden master in the lab before and after every field campaign.',
        'Tracking drift: Generates an empirical degradation vector that can retroactively correct field data.'
      ],
      speakerNotes: 'Instill this institutional discipline: field working standards will get dirty; master standards must remain untouched.',
      references: ['Milton, E. J. et al. (2009). Progress in field spectroscopy. Remote Sensing of Environment.']
    },
    {
      id: 'm3_s12',
      slideNumber: 12,
      title: 'White Reference Non-Lambertian Behavior at High Zenith Angles',
      category: 'Physics',
      keyTakeaway: 'Spectralon is not perfectly Lambertian; its reflectance factor increases significantly when solar zenith angles exceed 50°–60°.',
      bullets: [
        'At normal incidence (θ_i < 30°), Spectralon is isotropic within ±0.5%.',
        'At grazing angles (θ_i > 60°), forward specular scattering emerges, and measured apparent reflectance rises by 2% to 6%.',
        'If an operator uses a Spectralon panel at 16:00 in winter (θ_s = 65°), target reflectance is artificially suppressed by up to 5%.'
      ],
      mathFormula: 'R(\\theta_i, 0; \\text{nadir}) = 1.0 + c_1 \\cdot \\theta_i^2 + c_2 \\cdot \\theta_i^4',
      formulaExplanation: 'Empirical model for non-Lambertian Spectralon departure as a function of solar incidence angle.',
      speakerNotes: 'Show the BRDF scattering polar plot of Spectralon measured by sandmeier et al. using a laboratory goniometer.',
      references: ['Sandmeier, S. et al. (1998). Physical mechanisms in hyperspectral BRDF data of grass and watercress. Remote Sensing of Environment.']
    },
    {
      id: 'm3_s13',
      slideNumber: 13,
      title: 'Cosine Receptor Characterization: Directional Response Error',
      category: 'Instrumentation',
      keyTakeaway: 'Cosine diffusers measure irradiance by capturing photons according to Lambert\'s cosine law; departures cause cosine error.',
      bullets: [
        'Ideal cosine receptor: Responsivity scales perfectly with cos(θ_i).',
        'Real PTFE diffusers: Under-respond at high zenith angles (θ_i > 60°) due to surface reflection and rim shading.',
        'Cosine error: f₂(θ) = (Signal(θ) / [Signal(0) · cos θ]) - 1.0.',
        'High-grade cosine receptors maintain total cosine error f₂ < 3% up to 70° zenith angle.'
      ],
      mathFormula: 'f_2 = \\int_0^{\\pi/2} \\left| \\frac{S(\\theta)}{S(0)\\cos\\theta} - 1 \\right| \\sin(2\\theta) \\, d\\theta',
      formulaExplanation: 'CIE directional response index quantifying total cosine error.',
      speakerNotes: 'Show the polar response curve of a cosine diffuser against the theoretical cosine circle.',
      references: ['CIE (1987). Methods of Characterizing the Performance of Radiometers and Photometers. Publication CIE 69.']
    },
    {
      id: 'm3_s14',
      slideNumber: 14,
      title: 'Single-Beam Time-Drift Uncertainty',
      category: 'QualityAssurance',
      keyTakeaway: 'In single-beam field radiometry, the time elapsed between white reference and target scans is a primary uncertainty driver.',
      bullets: [
        'Atmospheric optical depth and solar position change continuously.',
        'At solar noon in summer, solar zenith angle changes slowly (< 0.1° per minute).',
        'In mid-morning or late afternoon, solar zenith angle changes by > 0.5° per minute, altering irradiance by ~1% every 2 minutes.',
        'Rule of thumb: Complete target measurements within 3 to 5 minutes of white reference acquisition under clear skies.'
      ],
      practicalFieldNote: 'Set an automatic timer on the field computer to alert the team when 5 minutes have elapsed since the last WR scan.',
      speakerNotes: 'Demonstrate how an uncorrected 5-minute delay creates a false spectral slope across the entire measurement.',
      references: ['Milton, E. J. (1987). Principles of field spectroscopy. International Journal of Remote Sensing.']
    },
    {
      id: 'm3_s15',
      slideNumber: 15,
      title: 'Dual-Beam Inter-Calibration Protocols',
      category: 'Instrumentation',
      keyTakeaway: 'Dual-beam systems require frequent cross-calibration of the reference and target sensors to track inter-channel drift.',
      bullets: [
        'Dual-beam eliminates solar temporal drift by recording WR and target simultaneously.',
        'However, if the two spectrometers drift differentially in temperature or responsivity, a systematic cross-channel error occurs.',
        'Protocol: Every 30–60 minutes, place both optical heads over the same white reference panel to calculate the cross-calibration vector G(λ).'
      ],
      mathFormula: 'G(\\lambda) = \\frac{L_1^{\\text{WR}}(\\lambda)}{L_2^{\\text{WR}}(\\lambda)}, \\quad \\rho_{\\text{target}}(\\lambda) = \\frac{L_1^{\\text{target}}(\\lambda)}{L_2^{\\text{WR}}(\\lambda) \\cdot G(\\lambda)} \\cdot \\rho_{\\text{ref}}(\\lambda)',
      formulaExplanation: 'Cross-calibration gain vector G(λ) continuously normalizes inter-channel differences.',
      speakerNotes: 'Emphasize that dual-beam is not magic: it trades temporal solar uncertainty for inter-channel calibration uncertainty.',
      references: ['MacArthur, A. et al. (2014). Remote Sensing of Environment.']
    },
    {
      id: 'm3_s16',
      slideNumber: 16,
      title: 'GUM Framework: Guide to the Expression of Uncertainty in Measurement',
      category: 'QualityAssurance',
      keyTakeaway: 'Scientific measurements must be accompanied by an uncertainty statement compliant with international metrological standards.',
      bullets: [
        'JCGM 100:2008 (GUM): Defines standardized methodologies for evaluating and expressing measurement uncertainty.',
        'Type A Evaluation: Evaluated by statistical analysis of series of observations (e.g. sample standard deviation of repeated scans).',
        'Type B Evaluation: Evaluated by scientific judgment, manufacturer certificates, calibration standards, or published literature.'
      ],
      mathFormula: 'u_c^2(y) = \\sum_{i=1}^N \\left(\\frac{\\partial f}{\\partial x_i}\\right)^2 u^2(x_i) + 2\\sum_{i=1}^{N-1}\\sum_{j=i+1}^N \\frac{\\partial f}{\\partial x_i}\\frac{\\partial f}{\\partial x_j} u(x_i, x_j)',
      formulaExplanation: 'Law of propagation of uncertainty for combined standard uncertainty u_c(y).',
      speakerNotes: 'Introduce the GUM methodology. Remote sensing papers that state "reflectance = 0.42" without ± uncertainty are methodologically deficient.',
      references: ['JCGM (2008). Evaluation of measurement data — Guide to the expression of uncertainty in measurement. JCGM 100:2008.']
    },
    {
      id: 'm3_s17',
      slideNumber: 17,
      title: 'Building a Field Spectroscopy Uncertainty Budget',
      category: 'QualityAssurance',
      keyTakeaway: 'A complete uncertainty budget aggregates all independent noise and systematic error components into a combined uncertainty curve.',
      bullets: [
        'Component 1: Spectralon certificate uncertainty (u_ref ≈ 0.5%).',
        'Component 2: White reference aging/contamination (u_panel ≈ 1.0%).',
        'Component 3: Instrument noise / SNR (u_noise ≈ 0.2% in VNIR, 1.5% in SWIR).',
        'Component 4: Solar irradiance temporal drift (u_sun ≈ 0.5–2.0%).',
        'Component 5: Zenith/nadir pointing tilt error (u_tilt ≈ 0.8%).'
      ],
      practicalFieldNote: 'Total combined relative reflectance uncertainty typically ranges from 1.5% to 3.0% under optimal clear-sky conditions.',
      speakerNotes: 'Walk students through a spreadsheet table totaling the individual variance terms in quadrature.',
      references: ['Fox, N. et al. (2003). Traceability in remote sensing: The QE6 project. SPIE Proceedings.']
    },
    {
      id: 'm3_s18',
      slideNumber: 18,
      title: 'Wavelength Uncertainty vs. Band-Depth Retrieval Error',
      category: 'Mathematics',
      keyTakeaway: 'A tiny 1 nm wavelength shift creates massive errors when calculating narrow absorption band depths in minerals and pigments.',
      bullets: [
        'Kaolinite Al-OH doublet at 2206 nm has a half-width of only ~12 nm.',
        'A 1.0 nm wavelength calibration error produces an apparent 5% to 10% error in calculated band absorption depth.',
        'In vegetation, red edge inflection point (REIP) shifts of 2–3 nm indicate heavy metal stress or nitrogen deficiency; wavelength stability < 0.5 nm is mandatory.'
      ],
      speakerNotes: 'Show the derivative of a sharp absorption peak: slope is steepest on the wings, where wavelength shifts generate maximum error.',
      references: ['Van der Meer, F. (2004). Analysis of spectral absorption features in hyperspectral imagery. International Journal of Applied Earth Observation.']
    },
    {
      id: 'm3_s19',
      slideNumber: 19,
      title: 'Radiometric Calibration Transfer Standards: Portable Field Lamps',
      category: 'Instrumentation',
      keyTakeaway: 'Portable field calibration lamps allow on-site verification of instrument responsivity during remote field expeditions.',
      bullets: [
        'Compact stabilized QTH light sources with precision DC constant-current power regulation.',
        'Mounted directly to the foreoptic barrel to provide a repeatable radiant flux baseline.',
        'Enables detection of sudden optical component failure (e.g. fractured fiber strand or misaligned order-sorting filter) while still in the field.'
      ],
      practicalFieldNote: 'Run a portable lamp check at the field base camp every morning before setting off to remote field sites.',
      speakerNotes: 'Describe the NERC FSF field validation lamp kits.',
      references: ['NERC FSF (2020). Calibration Equipment and Field Validation Manual.']
    },
    {
      id: 'm3_s20',
      slideNumber: 20,
      title: 'Inter-Comparison Campaigns & Round-Robin Experiments',
      category: 'QualityAssurance',
      keyTakeaway: 'Round-robin experiments comparing multiple spectrometers over identical targets reveal inter-instrument biases of 2% to 8%.',
      bullets: [
        'ESA and CEOS regularly conduct field spectroradiometer inter-comparison campaigns (e.g. RadCalNet, FICE).',
        'Different instruments (ASD vs SVC vs PSR) measuring the same Spectralon panel simultaneously frequently differ by 2–4% in the SWIR.',
        'Major causes: Differing slit functions, stray light rejection, fiber cable geometries, and manufacturer calibration algorithms.'
      ],
      speakerNotes: 'Discuss results from the CEOS WGCV inter-comparison campaigns over dry lake salt flats.',
      references: ['Anderson, K. et al. (2011). Field spectroradiometer inter-calibration: Methods and challenges. Remote Sensing of Environment.']
    },
    {
      id: 'm3_s21',
      slideNumber: 21,
      title: 'CEOS WGCV Field Spectrometry Protocol',
      category: 'QualityAssurance',
      keyTakeaway: 'The Committee on Earth Observation Satellites defines the global standard for ground validation of spaceborne missions.',
      bullets: [
        'Protocol requirements: Traceable calibration certificates < 1 year old; clear sky criteria (AOD < 0.2); SZA < 50°.',
        'Sampling footprint documentation: Drone imagery of target site, high-precision RTK GNSS coordinates (±2 cm).',
        'Uncertainty statement: Every published spectral curve must report a combined standard uncertainty vector u(λ).'
      ],
      practicalFieldNote: 'Review the CEOS WGCV checklist prior to any satellite under-flight field validation campaign.',
      speakerNotes: 'Show the official CEOS document and review its mandatory field log parameters.',
      references: ['CEOS WGCV (2014). Quality Assurance Framework for Earth Observation: Field Spectrometry Protocol.']
    },
    {
      id: 'm3_s22',
      slideNumber: 22,
      title: 'RadCalNet: Automated Ground Calibration Networks',
      category: 'CaseStudy',
      keyTakeaway: 'RadCalNet provides automated, continuous in situ surface reflectance measurements for autonomous satellite vicarious calibration.',
      bullets: [
        'Global network of automated instrumented sites: Railroad Valley (USA), La Crau (France), Baotou (China), Gobabeb (Namibia).',
        'Autonomous nadir-viewing multi-channel spectroradiometers taking measurements every 30 minutes.',
        'Combined with co-located CIMEL sun photometers (AERONET) measuring atmospheric optical depth and water vapor column.',
        'Provides top-of-atmosphere (TOA) and surface reflectance with documented uncertainty < 3% for Sentinel-2, Landsat-8/9, PlanetScope.'
      ],
      speakerNotes: 'Display the live RadCalNet web portal and inspect a real-time calibrated reflectance curve from Railroad Valley.',
      references: ['Bouvet, M. et al. (2019). RadCalNet: A radiometric calibration network for Earth observing imagers. Remote Sensing, 11(20), 2401.']
    },
    {
      id: 'm3_s23',
      slideNumber: 23,
      title: 'Vicarious Calibration of Earth Observation Satellites',
      category: 'CaseStudy',
      keyTakeaway: 'Vicarious calibration uses ground field spectroscopy over bright, homogeneous targets to validate satellite onboard sensors.',
      bullets: [
        'Satellite sensors degrade in orbit due to cosmic radiation, solar UV darkening of lenses, and outgassing contamination.',
        'Reflectance-based method: Measure ground surface reflectance with field spectroradiometers during satellite overpass.',
        'Atmospheric radiative transfer: Input ground spectra and AERONET aerosol/gas data into MODTRAN to predict Top-of-Atmosphere (TOA) radiance.',
        'Compare predicted TOA radiance against satellite digital counts to update sensor calibration gain coefficients.'
      ],
      mathFormula: 'L_{\\text{TOA}}(\\lambda) = L_{\\text{path}}(\\lambda) + \\frac{\\rho_{\\text{ground}}(\\lambda) \\cdot E_{\\text{solar}}(\\lambda) \\cdot T_{\\downarrow}(\\lambda) \\cdot T_{\\uparrow}(\\lambda)}{\\pi \\cdot [1 - s(\\lambda) \\cdot \\rho_{\\text{ground}}(\\lambda)]}',
      formulaExplanation: 'Simplified radiative transfer equation linking surface reflectance to satellite TOA radiance.',
      speakerNotes: 'Explain how field spectroscopy was critical for re-calibrating Landsat-7 ETM+ and Landsat-8 OLI after launch.',
      references: ['Thome, K. et al. (2004). Vicarious calibration of SPOT-4 HRVIR, Landsat-7 ETM+, and TERRA ASTER. IEEE TGRS.']
    },
    {
      id: 'm3_s24',
      slideNumber: 24,
      title: 'Spectrometer Field Validation Checklist',
      category: 'QualityAssurance',
      keyTakeaway: 'Rigorous pre-flight and pre-field checklist execution prevents costly data invalidation in retrospective analysis.',
      bullets: [
        'Phase 1 (Laboratory): Inspect fiber bundle, confirm wavelength alignment with Hg-Ar or Mylar, verify Peltier cooling lock.',
        'Phase 2 (Departure): Clean Spectralon panels, charge all lithium batteries, verify calibration files loaded in software.',
        'Phase 3 (On-Site): Level tripod, orient station to solar azimuth, run auto-integration, record 100% white reference check.',
        'Phase 4 (Post-Campaign): Inspect raw data for detector splice jumps, saturation flags, and SNR degradation.'
      ],
      practicalFieldNote: 'Laminate this 4-phase checklist and keep it permanently inside the spectrometer rugged transport case.',
      speakerNotes: 'Distribute the laminated checklist template to students.',
      references: ['NERC FSF (2020). Operational Field Guide.']
    },
    {
      id: 'm3_s25',
      slideNumber: 25,
      title: 'Signal Clipping & Saturated Band Masking',
      category: 'Processing',
      keyTakeaway: 'Saturated channels distort spectral shape and create spurious absorption artifacts in downstream derivative analysis.',
      bullets: [
        'Saturation occurs when ADC counts hit maximum (e.g. 65,535 counts in 16-bit).',
        'Partial saturation: Even at 63,000 counts, photodiode amplifiers may leave the linear regime.',
        'Automated masking: Flag and set all spectral channels with DN > 0.90 · DN_max to NaN.',
        'Never interpolate through saturated bands; flag them explicitly in the metadata record.'
      ],
      practicalFieldNote: 'If bright cloud borders momentarily illuminate the panel during WR acquisition, the entire subsequent dataset is ruined.',
      speakerNotes: 'Show a spectrum where one channel was saturated and how it created a massive spike when computing NDVI.',
      references: ['Analytical Spectral Devices (2012). RS3 User Guide.']
    },
    {
      id: 'm3_s26',
      slideNumber: 26,
      title: 'Spectral Interpolation: Splines vs. Linear vs. PCHIP',
      category: 'Mathematics',
      keyTakeaway: 'Interpolating irregular or missing spectral channels requires shape-preserving algorithms to prevent artificial oscillations.',
      bullets: [
        'Linear interpolation: Fast and robust, but introduces sharp non-physical slope breaks at tie points.',
        'Cubic spline: Smooth curves, but susceptible to Runge\'s phenomenon (overshooting and spurious wiggles) near steep absorption edges.',
        'PCHIP (Piecewise Cubic Hermite Interpolating Polynomial): Preserves monotonicity and avoids artificial overshoot.'
      ],
      mathFormula: 'y(x) = h_{00}(t)y_k + h_{10}(t)d_k + h_{01}(t)y_{k+1} + h_{11}(t)d_{k+1}',
      formulaExplanation: 'Hermite basis formulation preserving monotonic derivative transitions.',
      speakerNotes: 'Demonstrate how a cubic spline creates a false absorption feature near the steep red edge if tie points are sparse.',
      references: ['Fritsch, F. N., & Carlson, R. E. (1980). Monotone piecewise cubic interpolation. SIAM Journal on Numerical Analysis.']
    },
    {
      id: 'm3_s27',
      slideNumber: 27,
      title: 'Atmospheric Noise Truncation Protocols',
      category: 'Processing',
      keyTakeaway: 'Channels in deep atmospheric water vapor absorption bands (1350–1450 nm and 1800–1980 nm) must be masked out.',
      bullets: [
        'Zero incident solar irradiance means dividing target counts by zero or near-zero reference counts.',
        'Produces extreme random division spikes with noise reaching ±1000% reflectance.',
        'Academic standard: Truncate and mask out: 1350–1460 nm and 1790–1990 nm prior to publication or modeling.',
        'Truncate noisy ends below 380 nm and above 2450 nm where detector responsivity is low.'
      ],
      practicalFieldNote: 'Never present field reflectance curves showing noisy spiky grass in the 1400 nm and 1900 nm troughs.',
      speakerNotes: 'Explain why keeping these water vapor bands in statistical models (PLSR/Random Forest) leads to catastrophic overfitting.',
      references: ['Milton, E. J. et al. (2009). Remote Sensing of Environment.']
    },
    {
      id: 'm3_s28',
      slideNumber: 28,
      title: 'Laboratory Cross-Calibration Experiment Design',
      category: 'CaseStudy',
      keyTakeaway: 'A structured laboratory experiment determines the relative spectral responsivity ratio between two field instruments.',
      bullets: [
        'Set up a stabilized 1000W QTH lamp illuminating a pristine 10" master Spectralon panel.',
        'Mount both instruments on identical viewing jigs with optical axes aligned at 45° incidence, 0° nadir viewing.',
        'Acquire 50 scans per instrument, swap physical positions, and repeat to eliminate spatial illumination gradients.',
        'Calculates cross-instrument transfer matrix with relative standard uncertainty < 0.3%.'
      ],
      speakerNotes: 'Present the experimental layout diagram and show student-collected cross-calibration curves.',
      references: ['MacArthur, A. et al. (2012). NERC FSF Technical Report.']
    },
    {
      id: 'm3_s29',
      slideNumber: 29,
      title: 'Calibration Record Keeping and Audit Trails',
      category: 'QualityAssurance',
      keyTakeaway: 'Reproducible geospatial science requires permanent digital audit trails linking raw scans to specific calibration files.',
      bullets: [
        'Metadata requirements: Spectrometer serial number, fiber optic bundle ID, foreoptic serial number.',
        'White reference panel serial number and calibration certificate issue date.',
        'Internal instrument operating firmware version and dark current subtraction timestamp.',
        'Without these records, historic field data cannot be re-calibrated when standards improve.'
      ],
      practicalFieldNote: 'Store calibration files alongside raw spectral files in read-only data repositories.',
      speakerNotes: 'Remind students of the FAIR data principles: Findable, Accessible, Interoperable, Reusable.',
      references: ['Wilkinson, M. D. et al. (2016). The FAIR Guiding Principles for scientific data management. Scientific Data, 3, 160018.']
    },
    {
      id: 'm3_s30',
      slideNumber: 30,
      title: 'Module 3 Synthesis: Toward Rigorous Field Protocols',
      category: 'QualityAssurance',
      keyTakeaway: 'Calibration and uncertainty quantification transform raw digital numbers into defensible scientific measurements.',
      bullets: [
        'Module 3 synthesized: NIST traceability, wavelength validation (Hg-Ar, Mylar), radiometric calibration, Spectralon care, and GUM uncertainty budgets.',
        'In Module 4, we step outdoors into dynamic environments: solar zenith windows, BRDF sampling geometry, footprint calculations, and field metadata.',
        'Laboratory practical: Computing GUM uncertainty propagation curves and building automated Spectralon contamination detectors.'
      ],
      speakerNotes: 'Conclude calibration module, invite questions on the uncertainty budget, and preview Field Exercise 3.',
      references: ['Milton, E. J. et al. (2009). Progress in field spectroscopy. Remote Sensing of Environment, 113, S92-S109.']
    }
  ];
}

export const MODULE_3: CourseModule = {
  id: 'module_3',
  moduleNumber: 3,
  title: 'Sensor Calibration, White Reference (Spectralon) & Radiometric Validation',
  shortTitle: 'Calibration & Radiometric Validation',
  subtitle: 'NIST traceability, wavelength calibration (Hg-Ar, Mylar), integrating spheres, Spectralon panels, and GUM uncertainty budgets',
  durationHours: 4,
  ectsCredits: 1.5,
  abstract: 'Module 3 details laboratory metrological calibration and in-field radiometric validation procedures for field spectroradiometers. Students examine NIST-traceable standards, atomic emission line lamps (Hg-Ar) and polymer absorption standards (Mylar) for sub-nanometer wavelength calibration, and large integrating spheres for absolute spectral radiance responsivity mapping. The module investigates Spectralon sintered PTFE white reference physics, non-Lambertian departures at high solar zenith angles, degradation and cleaning protocols, cosine receptor characterization, and the construction of comprehensive measurement uncertainty budgets conforming to the ISO/BIPM Guide to the Expression of Uncertainty in Measurement (GUM).',
  coreCompetencies: [
    'Execute wavelength calibration and band-centroid fitting using gas emission lines (Hg-Ar) and Mylar absorption standards.',
    'Formulate absolute spectral radiance responsivity matrices from integrating sphere measurements.',
    'Identify Spectralon contamination, aging, and non-Lambertian BRDF departures at high solar zenith angles.',
    'Construct a comprehensive GUM-compliant uncertainty budget combining Type A and Type B error components.',
    'Apply automated data masking protocols to eliminate saturated channels and zero-SNR atmospheric water vapor absorption bands.'
  ],
  slides: generateModule3Slides(),
  fieldExercise: {
    title: 'Field Exercise 3: Evaluating White Reference Degradation, Cosine Errors & In-Situ Uncertainty Budgets',
    estimatedDuration: '3.5 hours',
    targetEnvironment: 'Open outdoor calibration testbed or level airfield apron',
    recommendedInstruments: ['ASD or SVC Spectroradiometer', 'Pristine Master 99% Spectralon Panel', 'Weathered / Field-aged Working Spectralon Panel', 'Cosine receptor foreoptic', 'Stable precision bubble mount and dark shield'],
    safetyAndPreTripChecklist: [
      'Clean hands and wear powder-free nitrile gloves when handling Spectralon panel cases.',
      'Inspect master and working panels under 365 nm UV lamp in lab to detect organic contamination prior to field deployment.',
      'Check that the spectrometer battery provides > 12.0 V to guarantee Peltier cooling stability.',
      'Verify that all calibration certificate files (.cal) match the specific serial numbers of the deployed panels.'
    ],
    fieldProtocolSteps: [
      {
        stepNumber: 1,
        action: 'Mount the spectrometer with bare fiber at 0° nadir viewing over the pristine Master Spectralon panel. Optimize integration time and acquire DC and WR.',
        scientificRationale: 'Establishes the clean reference baseline against an uncompromised NIST-traceable standard.',
        commonErrorToAvoid: 'Touching the white active surface with fingers or clothing during setup.'
      },
      {
        stepNumber: 2,
        action: 'Immediately swap the Master panel with the Field Working panel without altering the optical head position or illumination geometry, and record 10 scans.',
        scientificRationale: 'Directly quantifies the relative spectral degradation factor of the working panel across 350–2500 nm.',
        commonErrorToAvoid: 'Allowing more than 60 seconds to elapse between the master WR scan and the working panel scan.'
      },
      {
        stepNumber: 3,
        action: 'Attach the cosine receptor diffuser. Measure global downwelling irradiance as solar zenith angle shifts by recording scans every 15 minutes over 2 hours.',
        scientificRationale: 'Tests the cosine receptor directional response and quantifies the empirical departure from theoretical Lambertian cos(θ_s) behavior.',
        commonErrorToAvoid: 'Allowing the operator body to obstruct any portion of the 180° sky hemisphere.'
      },
      {
        stepNumber: 4,
        action: 'Deliberately introduce a 5° and 10° zenith tilt to the foreoptic mount and measure a homogeneous target.',
        scientificRationale: 'Quantifies the sensitivity of reflectance measurements to operator leveling errors.',
        commonErrorToAvoid: 'Tilting the sensor towards the operator rather than maintaining a clean azimuth orientation.'
      }
    ],
    dataRecordingSheetFields: [
      'Timestamp (UTC)',
      'Panel Tested (Master #SN / Working #SN)',
      'Solar Zenith Angle θ_s',
      'Relative Reflectance Ratio (Working / Master) at 450, 670, 800, 1600, 2200 nm',
      'Leveling Tilt Angle (0°, 5°, 10°)',
      'Measured Target Reflectance Departure (%)',
      'Calculated Combined Uncertainty (%)'
    ],
    fieldDeliverable: 'Submit a comprehensive calibration evaluation report featuring working panel degradation curves, cosine receptor response curves, and an empirical GUM uncertainty table.'
  },
  practicalLab: {
    title: 'Practical Lab 3: Wavelength Calibration, GUM Uncertainty Propagation & Saturated Band Masking in Python and R',
    softwareEnvironment: 'Hybrid (Python & R)',
    primaryPackages: ['numpy', 'scipy', 'matplotlib', 'pandas', 'hsdar (R)'],
    learningObjectives: [
      'Fit Gaussian and polynomial functions to Hg-Ar gas emission lines to derive spectrometer dispersion coefficients.',
      'Implement the GUM uncertainty propagation equation for field reflectance factor measurements.',
      'Develop automated filters to detect saturated channels and mask atmospheric water vapor bands (1350–1460 nm and 1790–1990 nm).',
      'Calculate Spectralon aging correction factors and apply them to historic raw field datasets.'
    ],
    sampleDataset: {
      name: 'Calibration_HgAr_Spectralon_Aging_LabData.csv',
      description: 'Laboratory dataset containing raw Mercury-Argon emission line profiles, Mylar absorption scans, and dual-panel Spectralon comparisons from 350 to 2500 nm.',
      spectralRange: '350 - 2500 nm',
      sensor: 'Laboratory Optical Bench & Monochromator System',
      bandsCount: 2151
    },
    codeSnippets: [
      {
        language: 'python',
        title: 'Python: GUM Uncertainty Propagation Engine for Field Reflectance Factor',
        description: 'Calculates the combined standard uncertainty u_c(rho) and expanded uncertainty (k=2, 95% confidence) combining Type A and Type B components.',
        code: `import numpy as np
import matplotlib.pyplot as plt

def compute_gum_reflectance_uncertainty(
    target_dn, ref_dn, dark_dn, 
    u_type_a_target, u_type_a_ref, 
    u_rel_certificate=0.005, 
    u_rel_aging=0.010, 
    u_rel_solar_drift=0.008
):
    """
    Computes combined standard uncertainty u_c(rho) and expanded uncertainty U_95 (k=2)
    according to JCGM 100:2008 (GUM) guide.
    """
    net_target = target_dn - dark_dn
    net_ref = ref_dn - dark_dn
    
    # Calculate baseline reflectance ratio
    rho_raw = net_target / net_ref
    
    # Sensitivity coefficients (partial derivatives)
    c_target = 1.0 / net_ref
    c_ref    = -net_target / (net_ref**2)
    
    # Type A variances from repeated scan statistics
    var_a_target = (c_target**2) * (u_type_a_target**2)
    var_a_ref    = (c_ref**2) * (u_type_a_ref**2)
    
    # Type B relative variances (expressed relative to rho)
    var_b_cert  = (rho_raw * u_rel_certificate)**2
    var_b_aging = (rho_raw * u_rel_aging)**2
    var_b_drift = (rho_raw * u_rel_solar_drift)**2
    
    # Total combined standard uncertainty in quadrature
    u_combined = np.sqrt(var_a_target + var_a_ref + var_b_cert + var_b_aging + var_b_drift)
    
    # Expanded uncertainty at 95% confidence level (coverage factor k = 2.0)
    U_95 = 2.0 * u_combined
    
    # Relative uncertainty percentage
    u_rel_percent = (u_combined / rho_raw) * 100.0
    
    return rho_raw, u_combined, U_95, u_rel_percent

# Demonstration with synthetic vegetation spectrum
wl = np.arange(400, 2401, 1)
ref_dn = np.full_like(wl, 42000.0, dtype=float)
target_dn = 15000.0 + 18000.0 / (1.0 + np.exp(-0.04 * (wl - 715))) # Sigmoid vegetation curve
dark_dn = np.full_like(wl, 1200.0, dtype=float)

# Simulated Type A standard deviations (Poisson shot noise + readout)
sd_t = np.sqrt(target_dn) * 1.5
sd_r = np.sqrt(ref_dn) * 1.2

rho, u_c, U95, u_rel = compute_gum_reflectance_uncertainty(target_dn, ref_dn, dark_dn, sd_t, sd_r)

print(f"Reflectance at 550 nm: {rho[150]:.4f} +/- {U95[150]:.4f} (Expanded 95% CI)")
print(f"Relative uncertainty at 550 nm: {u_rel[150]:.2f}%")
print(f"Reflectance at 800 nm: {rho[400]:.4f} +/- {U95[400]:.4f} (Expanded 95% CI)")
print(f"Relative uncertainty at 800 nm: {u_rel[400]:.2f}%")
`
      },
      {
        language: 'r',
        title: 'R Script: Automated Masking of Saturated Channels and Atmospheric Water Vapor Troughs',
        description: 'Identifies saturated channels and deep atmospheric absorption bands (1350–1460 nm and 1790–1990 nm), replacing them with clean NA values.',
        code: `# Principles of Field Spectroscopy: MSc Lab 3
# Automated Quality Masking for Field Spectra in R

apply_spectral_quality_mask <- function(wavelengths, reflectance_values, max_dn=65535, raw_dn=NULL) {
  cleaned_refl <- reflectance_values
  
  # 1. Mask deep atmospheric water vapor absorption bands
  h2o_band1 <- (wavelengths >= 1350 & wavelengths <= 1460)
  h2o_band2 <- (wavelengths >= 1790 & wavelengths <= 1990)
  
  # 2. Mask detector edge noise (sub-380 nm and post-2450 nm)
  uv_edge   <- (wavelengths < 380)
  swir_edge <- (wavelengths > 2450)
  
  # 3. Mask saturation if raw digital numbers are supplied
  saturation_mask <- rep(FALSE, length(wavelengths))
  if (!is.null(raw_dn)) {
    saturation_mask <- (raw_dn >= 0.90 * max_dn)
  }
  
  # Combine all quality flags
  invalid_mask <- h2o_band1 | h2o_band2 | uv_edge | swir_edge | saturation_mask
  
  cleaned_refl[invalid_mask] <- NA
  return(list(Cleaned=cleaned_refl, Mask=invalid_mask, SaturatedCount=sum(saturation_mask)))
}

# Test with synthetic spectrum
wl <- seq(350, 2500, by=1)
refl <- 0.2 + 0.3 * sin((wl - 350) / 300)
# Add noisy division spikes in atmospheric absorption bands
refl[wl >= 1350 & wl <= 1460] <- rnorm(sum(wl >= 1350 & wl <= 1460), mean=0.5, sd=2.0)
refl[wl >= 1790 & wl <= 1990] <- rnorm(sum(wl >= 1790 & wl <= 1990), mean=0.5, sd=3.0)

res <- apply_spectral_quality_mask(wl, refl)
cat("Total valid spectral channels remaining:", sum(!res$Mask), "out of", length(wl), "\\n")
`
      }
    ],
    studentTasks: [
      'Fit Gaussian profiles to the Hg-Ar 546.07 nm and 579.07 nm lines; calculate the spectrometer\'s optical resolution (FWHM) in the green spectral region.',
      'Implement the complete GUM uncertainty budget function in Python and generate a shaded 95% confidence interval ribbon plot around a field vegetation spectrum.',
      'Write an automated test that calculates the Spectralon degradation factor between master and working panels and applies a retroactive calibration correction.'
    ],
    expectedOutputSummary: 'Students produce verified Python and R scripts that perform atomic line wavelength validation, compute GUM-compliant uncertainty ribbons, and filter contaminated channels.'
  },
  quiz: {
    moduleNumber: 3,
    title: 'Module 3 Automated Assessment: Sensor Calibration & Uncertainty',
    passingScorePercent: 80,
    questions: [
      {
        id: 'm3_q1',
        question: 'What is the primary scientific reason for using Mercury-Argon (Hg-Ar) pencil lamps rather than tungsten-halogen lamps during wavelength calibration?',
        options: [
          'Tungsten lamps do not produce enough heat to excite silicon detectors.',
          'Hg-Ar lamps emit sharp, invariant atomic emission lines at discrete quantum wavelengths, whereas tungsten lamps emit continuous broadband blackbody radiation.',
          'Mercury lamps are certified by NIST to never consume electrical power.',
          'Argon gas molecules filter out stray light inside the monochromator.'
        ],
        correctOptionIndex: 1,
        explanation: 'Wavelength calibration requires discrete, highly localized reference lines. Atomic gas discharge lamps emit at invariant transition wavelengths, unlike continuous broadband thermal filament sources.',
        academicCitation: 'Reader, J. et al. (1980). NIST Wavelengths and Transition Probabilities.'
      },
      {
        id: 'm3_q2',
        question: 'According to JCGM 100:2008 (GUM), how is a "Type A" evaluation of measurement uncertainty determined?',
        options: [
          'From manufacturer calibration certificates and calibration handbooks.',
          'By statistical analysis of a series of repeated experimental observations.',
          'By consulting expert scientific judgment and historical peer-reviewed literature.',
          'By assuming an absolute 5% default margin of error.'
        ],
        correctOptionIndex: 1,
        explanation: 'The GUM defines Type A evaluations as those evaluated by statistical methods applied to valid series of observations (e.g., standard deviation of repeated scans, standard error of the mean).',
        academicCitation: 'JCGM 100:2008. Guide to the Expression of Uncertainty in Measurement.'
      },
      {
        id: 'm3_q3',
        question: 'What physical change occurs to a Spectralon white reference panel when it undergoes UV photochemical solarization after prolonged outdoor exposure?',
        options: [
          'It permanently converts into a transparent glass crystal.',
          'Polymer chain photolysis causes yellowing, creating an uncertified drop in blue and near-UV reflectance.',
          'Its thermal expansion coefficient increases by 500%.',
          'It develops sharp artificial emission lines at 1000 nm.'
        ],
        correctOptionIndex: 1,
        explanation: 'UV solarization degrades the PTFE polymer, causing discoloration (yellowing) that selectively absorbs UV and blue wavelengths (< 450 nm), destroying the 99% reflectance specification.',
        academicCitation: 'Labsphere Inc. (2018). Spectralon Reflectance Standards Technical Guide.'
      },
      {
        id: 'm3_q4',
        question: 'Why does apparent target reflectance appear artificially high (> 100% or spuriously inflated) if calculated using a contaminated or dirty white reference panel?',
        options: [
          'Because the spectrometer increases its detector bias voltage automatically.',
          'Because the dirty panel reflects fewer photons, making the denominator (DN_ref - DN_dark) artificially small in the reflectance ratio equation.',
          'Because dirty panels emit laser radiation when hit by sunlight.',
          'Because dust particles polarize the incident light beam into s-polarization.'
        ],
        correctOptionIndex: 1,
        explanation: 'Reflectance is computed as target counts divided by reference counts. If the reference panel is dirty, its reflected counts are lower than certified, making the denominator too small and inflating the calculated target reflectance.',
        academicCitation: 'MacArthur, A. et al. (2012). NERC FSF Technical Report.'
      },
      {
        id: 'm3_q5',
        question: 'Why are spectral channels in the 1350–1460 nm and 1790–1990 nm ranges routinely masked out (truncated) in published field spectroscopy datasets?',
        options: [
          'Because silicon detector chips melt when exposed to these wavelengths.',
          'Because international telecommunications treaties prohibit sharing these frequencies.',
          'Because atmospheric water vapor absorption is near 100%, causing near-zero solar photon flux and yielding division-by-zero noise spikes with zero SNR.',
          'Because leaves do not reflect any light in the shortwave infrared.'
        ],
        correctOptionIndex: 2,
        explanation: 'Near-total atmospheric absorption leaves almost zero photons reaching ground level. Dividing two near-zero noisy numbers produces wild, meaningless fluctuations with zero signal-to-noise ratio.',
        academicCitation: 'Milton, E. J. et al. (2009). Remote Sensing of Environment, 113, S92-S109.'
      }
    ]
  },
  keyReferences: [
    {
      authors: 'Joint Committee for Guides in Metrology (JCGM)',
      year: 2008,
      title: 'Evaluation of measurement data — Guide to the expression of uncertainty in measurement (GUM 1995 with minor corrections)',
      journalOrPublisher: 'BIPM, JCGM 100:2008',
      doiOrUrl: 'https://www.bipm.org/en/committees/jc/jcgm/publications'
    },
    {
      authors: 'MacArthur, A., MacLellan, C., & Malthus, T.',
      year: 2012,
      title: 'The calibration and characterization of field spectrometers',
      journalOrPublisher: 'NERC Field Spectroscopy Facility Guides, Edinburgh, UK'
    },
    {
      authors: 'Bouvet, M., Thome, K., Berthelot, B., Bialek, A., & Czapla-Myers, J.',
      year: 2019,
      title: 'RadCalNet: A radiometric calibration network for Earth observing imagers operating in the visible to shortwave infrared spectral range',
      journalOrPublisher: 'Remote Sensing, 11(20), 2401',
      doiOrUrl: '10.3390/rs11202401'
    }
  ]
};
