import type { CourseModule, Slide } from '../types';

// Helper to generate 30 slides with rigorous content
function generateModule1Slides(): Slide[] {
  return [
    {
      id: 'm1_s1',
      slideNumber: 1,
      title: 'Introduction to Field Spectroscopy in Environmental Science',
      category: 'Physics',
      keyTakeaway: 'Field spectroscopy bridges laboratory optical physics, ground truth validation, and airborne/satellite Earth observation.',
      bullets: [
        'Definition: In situ measurement of solar spectral radiance and material spectral reflectance.',
        'Core purpose: Calibrating spaceborne sensors, validating atmospheric corrections, and quantifying surface biogeochemical traits.',
        'Distinction between laboratory spectrophotometry and field spectroradiometry under dynamic solar illumination.'
      ],
      practicalFieldNote: 'Natural outdoor measurements inherit solar zenith dynamics and atmospheric aerosol fluctuations.',
      speakerNotes: 'Welcome students. In this introductory lecture, we define field spectroscopy not merely as a measurement technique, but as the foundational ground-truth pillar of modern optical remote sensing.',
      references: ['Milton, E. J. (1987). Principles of field spectroscopy. International Journal of Remote Sensing, 8(12), 1807-1827.']
    },
    {
      id: 'm1_s2',
      slideNumber: 2,
      title: 'The Electromagnetic Spectrum & Optical Domain',
      category: 'Physics',
      keyTakeaway: 'Field spectroscopy operates primarily in the 350–2500 nm range: VNIR (350–1000 nm), SWIR-1 (1000–1800 nm), and SWIR-2 (1800–2500 nm).',
      bullets: [
        'Visible range (380–740 nm): Governed by electronic transitions in photosynthetic pigments and iron oxides.',
        'Near-Infrared (NIR 740–1000 nm): Dominated by internal leaf cellular scattering and mineral crystal lattice reflections.',
        'Shortwave-Infrared (SWIR 1000–2500 nm): Dominated by fundamental molecular vibrations, overtones, and combination bands (O-H, C-H, N-H, Al-OH).'
      ],
      mathFormula: 'c = \\lambda \\cdot \\nu \\quad \\text{and} \\quad E = h \\cdot \\nu = \\frac{h \\cdot c}{\\lambda}',
      formulaExplanation: 'Photon energy is inversely proportional to wavelength; SWIR photons have lower energy than VNIR photons.',
      speakerNotes: 'Emphasize the division of wavelengths. Each spectral region interacts with matter at distinct quantum energetic levels.',
      references: ['Clark, R. N. (1999). Spectroscopy of rocks and minerals, and principles of spectroscopy. Manual of Remote Sensing, 3, 3-58.']
    },
    {
      id: 'm1_s3',
      slideNumber: 3,
      title: 'Blackbody Radiation & Planck\'s Law',
      category: 'Physics',
      keyTakeaway: 'Planck\'s distribution defines ideal thermal radiative emission as a function of absolute temperature and wavelength.',
      bullets: [
        'Ideal blackbody: Perfect absorber and emitter of electromagnetic radiation at thermodynamic equilibrium.',
        'Solar effective surface temperature: ~5778 K, with spectral emission peaking around 500 nm (green visible light).',
        'Earth surface temperature: ~300 K, peaking in thermal infrared (8–14 µm), well outside optical field spectroscopy.'
      ],
      mathFormula: 'B_\\lambda(\\lambda, T) = \\frac{2hc^2}{\\lambda^5 \\left( e^{\\frac{hc}{\\lambda k_B T}} - 1 \\right)}',
      formulaExplanation: 'Spectral radiance emitted into normal hemisphere [W m⁻² sr⁻¹ nm⁻¹].',
      speakerNotes: 'Note why we neglect self-emission from targets below 2500 nm in normal environmental temperatures (< 50°C). Optical field spectroscopy measures reflected solar photons.',
      references: ['Planck, M. (1901). On the law of distribution of energy in the normal spectrum. Annalen der Physik, 4(553), 1-11.']
    },
    {
      id: 'm1_s4',
      slideNumber: 4,
      title: 'Wien\'s Displacement Law & Stefan-Boltzmann Law',
      category: 'Mathematics',
      keyTakeaway: 'The peak wavelength of emission shifts inversely with absolute temperature; total radiant emittance scales with T⁴.',
      bullets: [
        'Wien\'s displacement constant b ≈ 2897.77 µm·K.',
        'Solar peak: λ_max = 2898 / 5778 K ≈ 0.501 µm (501 nm).',
        'Stefan-Boltzmann law integrates Planck\'s equation across all wavelengths: M = σ·T⁴ (σ = 5.670374 × 10⁻⁸ W m⁻² K⁻⁴).'
      ],
      mathFormula: '\\lambda_{\\max} = \\frac{b}{T} \\quad \\text{and} \\quad M = \\sigma T^4',
      formulaExplanation: 'Explains the concentration of solar irradiance in the visible and near-infrared spectrum.',
      speakerNotes: 'Show the mathematical derivation connecting Wien\'s displacement to the derivative of Planck\'s function.',
      references: ['Siegel, R., & Howell, J. R. (2002). Thermal Radiation Heat Transfer. Taylor & Francis.']
    },
    {
      id: 'm1_s5',
      slideNumber: 5,
      title: 'Radiometric Quantities: Energy to Radiance',
      category: 'Physics',
      keyTakeaway: 'Understanding radiometric units is mandatory to avoid catastrophic calibration and unit-conversion errors.',
      bullets: [
        'Radiant Flux (Φ): Total radiant energy per unit time [Watts, W].',
        'Radiant Intensity (I): Radiant flux emitted per unit solid angle [W sr⁻¹].',
        'Irradiance (E): Radiant flux incident onto a surface per unit area [W m⁻²].',
        'Radiance (L): Radiant flux per unit projected surface area per unit solid angle [W m⁻² sr⁻¹].'
      ],
      mathFormula: 'L = \\frac{d^2\\Phi}{dA \\cos\\theta \\, d\\Omega}',
      formulaExplanation: 'Radiance is conserved along a ray path through non-attenuating media.',
      speakerNotes: 'Pay close attention to projected area (dA cos θ). Spectroradiometers measure spectral radiance entering their field-of-view foreoptic.',
      references: ['Nicodemus, F. E. et al. (1977). Geometrical Considerations and Nomenclature for Reflectance. NBS Monograph 160.']
    },
    {
      id: 'm1_s6',
      slideNumber: 6,
      title: 'Spectral Radiometry vs. Broadband Radiometry',
      category: 'Instrumentation',
      keyTakeaway: 'Spectral quantities are derivatives with respect to wavelength, expressed per unit wavelength interval (nm or µm).',
      bullets: [
        'Spectral Irradiance: E_λ(λ) [W m⁻² nm⁻¹].',
        'Spectral Radiance: L_λ(λ) [W m⁻² sr⁻¹ nm⁻¹].',
        'Broadband sensors (pyranometers) integrate over 300–3000 nm, losing molecular absorption fingerprinting.',
        'Spectroradiometers resolve radiation into hundreds or thousands of discrete contiguous spectral channels.'
      ],
      mathFormula: 'E = \\int_{\\lambda_1}^{\\lambda_2} E_\\lambda(\\lambda) \\, d\\lambda',
      formulaExplanation: 'Integration of spectral irradiance yields total broadband irradiance.',
      speakerNotes: 'Explain why a broadband pyranometer can indicate stable global solar flux while spectral irradiance changes due to changing water vapor.',
      references: ['Schaepman, M. E. (2007). Spectroradiometry—A review. Remote Sensing of Environment.']
    },
    {
      id: 'm1_s7',
      slideNumber: 7,
      title: 'Extraterrestrial Solar Spectrum: AM0 vs. AM1.5',
      category: 'Physics',
      keyTakeaway: 'Atmospheric path length attenuates extraterrestrial irradiance according to the optical Air Mass (AM).',
      bullets: [
        'AM0: Solar spectrum outside Earth\'s atmosphere (solar constant S₀ ≈ 1361 W m⁻²).',
        'AM1: Sun directly overhead at zenith (θ_s = 0°) at sea level.',
        'AM1.5: Standard solar reference spectrum for mid-latitudes (θ_s ≈ 48.2°), representing path length 1.5 times zenith.'
      ],
      mathFormula: 'AM \\approx \\frac{1}{\\cos\\theta_s + 0.50572(96.07995 - \\theta_s)^{-1.6364}}',
      formulaExplanation: 'Kasten-Young formulation accounts for Earth atmospheric curvature and refraction.',
      speakerNotes: 'Discuss why field spectroscopic campaigns should restrict measurements to AM < 1.5 to minimize excessive atmospheric attenuation.',
      references: ['Gueymard, C. A. (2004). The sun’s total and spectral irradiance for solar energy applications and solar radiation models. Solar Energy, 76(4), 423-453.']
    },
    {
      id: 'm1_s8',
      slideNumber: 8,
      title: 'Beer-Lambert-Bouguer Attenuation Law',
      category: 'Mathematics',
      keyTakeaway: 'Direct beam solar radiance decays exponentially through an absorbing and scattering atmospheric column.',
      bullets: [
        'Total atmospheric optical depth (τ_λ) is the sum of Rayleigh scattering, aerosol scattering, and molecular absorption.',
        'Transmittance: T_λ = exp(-m · τ_λ), where m is the relative optical air mass.',
        'Any spatial or temporal change in optical depth alters the downwelling spectral distribution incident on field targets.'
      ],
      mathFormula: 'E_{\\text{dir},\\lambda} = E_{0,\\lambda} \\cdot \\left(\\frac{d_0}{d}\\right)^2 \\cdot \\cos\\theta_s \\cdot \\exp\\left( -m \\cdot \\tau_\\lambda \\right)',
      formulaExplanation: 'Direct spectral irradiance on a horizontal ground surface.',
      speakerNotes: 'Highlight the solar distance correction factor (d0/d) squared for Earth-Sun elliptical orbital eccentricity.',
      references: ['Bouguer, P. (1729). Essai d’optique sur la gradation de la lumière.']
    },
    {
      id: 'm1_s9',
      slideNumber: 9,
      title: 'Atmospheric Transmission Windows in Optical Sensing',
      category: 'Physics',
      keyTakeaway: 'Outdoor spectroscopy is only viable inside atmospheric transmission windows where gases do not completely extinguish photons.',
      bullets: [
        'Window 1 (VNIR): 400–920 nm (high transmission, minor ozone absorption in Chappuis band 550–650 nm).',
        'Window 2 (SWIR-1): 1000–1350 nm (between water vapor bands).',
        'Window 3 (SWIR-2): 1500–1800 nm (clean window, optimal for mineral and cellulose absorption).',
        'Window 4 (SWIR-3): 2000–2400 nm (carbonate and clay mineral diagnostic absorption).'
      ],
      practicalFieldNote: 'Never report reflectance data inside the 1350–1450 nm and 1800–1980 nm bands due to zero signal-to-noise ratio.',
      speakerNotes: 'Show the transmission spectrum from MODTRAN/6S radiative transfer code to demonstrate the deep water vapor dips.',
      references: ['Berk, A. et al. (2014). MODTRAN 6: A summary of recent advances. SPIE Defense + Security.']
    },
    {
      id: 'm1_s10',
      slideNumber: 10,
      title: 'Major Atmospheric Absorption Species',
      category: 'Physics',
      keyTakeaway: 'Water vapor, carbon dioxide, ozone, and oxygen create localized diagnostic absorption notches in solar irradiance.',
      bullets: [
        'Water Vapor (H₂O): 720 nm, 820 nm, 940 nm, 1130 nm, 1400 nm, 1900 nm.',
        'Carbon Dioxide (CO₂): 2010 nm, 2060 nm (strong doublet in SWIR).',
        'Oxygen (O₂): Fraunhofer A-band at 760.4 nm, B-band at 687 nm.',
        'Ozone (O₃): Hartley band (< 340 nm), Huggins band (310–380 nm), Chappuis band (500–700 nm).'
      ],
      mathFormula: '\\tau_\\lambda = \\tau_{\\text{Rayleigh}} + \\tau_{\\text{Aerosol}} + \\tau_{\\text{H}_2\\text{O}} + \\tau_{\\text{CO}_2} + \\tau_{\\text{O}_3} + \\tau_{\\text{O}_2}',
      formulaExplanation: 'Total spectral optical depth is the linear sum of extinction components.',
      speakerNotes: 'Point out the Oxygen A-band at 760 nm. This band is widely used in satellite remote sensing to retrieve solar-induced chlorophyll fluorescence (SIF).',
      references: ['Gao, B. C., & Goetz, A. F. (1990). Column atmospheric water vapor and vegetation liquid water retrievals. Remote Sensing of Environment.']
    },
    {
      id: 'm1_s11',
      slideNumber: 11,
      title: 'Rayleigh Scattering: Molecular Physics',
      category: 'Physics',
      keyTakeaway: 'Elastic scattering by molecules much smaller than the wavelength scales with λ⁻⁴, dominating blue and UV wavelengths.',
      bullets: [
        'Discovered by Lord Rayleigh (1871); caused by polarizability of N₂ and O₂ molecules.',
        'Explains the blue color of cloudless daytime skies and the strong polarization of skylight at 90° from the sun.',
        'In field spectroscopy, Rayleigh scattering creates significant diffuse downwelling skylight in the 350–500 nm range.'
      ],
      mathFormula: '\\sigma_R(\\lambda) = \\frac{8\\pi^3 (n^2 - 1)^2}{3 N^2 \\lambda^4} \\left( \\frac{6 + 3\\delta}{6 - 7\\delta} \\right)',
      formulaExplanation: 'Rayleigh scattering cross-section per molecule, where n is refractive index and δ is depolarization factor.',
      speakerNotes: 'Point out why targets measured in shadows still receive significant blue illumination: diffuse Rayleigh skylight.',
      references: ['Rayleigh, Lord (1899). On the transmission of light through an atmosphere containing small particles. Philosophical Magazine.']
    },
    {
      id: 'm1_s12',
      slideNumber: 12,
      title: 'Mie Scattering: Aerosols and Particulates',
      category: 'Physics',
      keyTakeaway: 'Scattering by particles of size comparable to wavelength (aerosols, dust, pollen, smog) is strongly forward-peaked.',
      bullets: [
        'Wavelength dependency parameterized by Ångström turbidity law: τ_a(λ) = β · λ^(-α).',
        'Typical continental aerosol exponent α ≈ 1.3; lower α (~0.5) indicates coarse maritime or desert dust aerosols.',
        'High aerosol loading creates a bright aureole around the sun, increasing diffuse-to-direct irradiance ratio.'
      ],
      mathFormula: '\\tau_a(\\lambda) = \\beta \\cdot \\lambda^{-\\alpha}',
      formulaExplanation: 'Ångström power law for aerosol optical thickness extinction.',
      speakerNotes: 'A hazy day with identical total lux to a clear day has radically different spectral composition due to forward Mie scattering.',
      references: ['Ångström, A. (1929). On the atmospheric transmission of sun radiation and on dust in the air. Geografiska Annaler.']
    },
    {
      id: 'm1_s13',
      slideNumber: 13,
      title: 'Direct vs. Diffuse Solar Irradiance',
      category: 'Physics',
      keyTakeaway: 'Global solar irradiance on a horizontal surface is the sum of direct beam and hemispherical diffuse skylight.',
      bullets: [
        'Direct Irradiance (E_dir): Parallel collimated rays from the solar disk (subtending ~0.5°).',
        'Diffuse Irradiance (E_dif): Scattered skylight arriving from the entire 2π steradian upper hemisphere.',
        'The ratio E_dir / E_dif varies dramatically with wavelength, solar zenith angle, and aerosol optical depth.'
      ],
      mathFormula: 'E_{\\text{global}}(\\lambda) = E_{\\text{dir}}(\\lambda) \\cdot \\cos\\theta_s + E_{\\text{dif}}(\\lambda)',
      formulaExplanation: 'Fundamental balance of downwelling optical energy at ground level.',
      speakerNotes: 'Field measurements made under partly cloudy skies fail because the diffuse component fluctuates erratically.',
      references: ['Milton, E. J. et al. (2009). Progress in field spectroscopy. Remote Sensing of Environment, 113, S92-S109.']
    },
    {
      id: 'm1_s14',
      slideNumber: 14,
      title: 'The Concept of Surface Reflectance',
      category: 'Physics',
      keyTakeaway: 'Reflectance is an intrinsic material property independent of illumination intensity when measured correctly.',
      bullets: [
        'Radiance depends on solar position, cloud cover, and atmosphere; reflectance normalizes for incident irradiance.',
        'True hemispherical reflectance: Fraction of total incident flux reflected across all directions into the upper hemisphere.',
        'In outdoor field spectroscopy, we rarely measure hemispherical reflectance directly; we measure directional reflectance factors.'
      ],
      mathFormula: '\\rho(\\lambda) = \\frac{\\Phi_{\\text{reflected}}(\\lambda)}{\\Phi_{\\text{incident}}(\\lambda)} = \\frac{M(\\lambda)}{E(\\lambda)}',
      formulaExplanation: 'Dimensionless ratio bound between 0 and 1 (or 0% to 100%).',
      speakerNotes: 'Make sure students distinguish between reflected radiance [W/m²/sr/nm] and reflectance [dimensionless 0-1].',
      references: ['Nicodemus, F. E. (1970). Reflectance nomenclature and directional reflectance and emissivity. Applied Optics.']
    },
    {
      id: 'm1_s15',
      slideNumber: 15,
      title: 'Bidirectional Reflectance Distribution Function (BRDF)',
      category: 'Mathematics',
      keyTakeaway: 'BRDF describes the directional scattering behavior of a surface for a given incident and exitant beam geometry.',
      bullets: [
        'Formally defined by Nicodemus et al. (1977) as the ratio of differential reflected radiance to differential incident irradiance.',
        'Unit of BRDF: Inverse steradians [sr⁻¹].',
        'BRDF is a theoretical distribution function for infinitesimal beams; cannot be measured directly with finite solid angles.'
      ],
      mathFormula: 'f_r(\\theta_i, \\phi_i; \\theta_r, \\phi_r; \\lambda) = \\frac{d L_r(\\theta_i, \\phi_i; \\theta_r, \\phi_r; \\lambda)}{d E_i(\\theta_i, \\phi_i; \\lambda)} \\; [\\text{sr}^{-1}]',
      formulaExplanation: 'Directional dependency parameterized by incident zenith/azimuth (θi, φi) and reflected zenith/azimuth (θr, φr).',
      speakerNotes: 'Stress that BRDF is not dimensionless—it has units of 1/steradian. Its integral over the hemisphere produces directional-hemispherical reflectance.',
      references: ['Nicodemus, F. E. et al. (1977). Geometrical Considerations and Nomenclature for Reflectance. NBS Monograph 160.']
    },
    {
      id: 'm1_s16',
      slideNumber: 16,
      title: 'Schaepman-Strub Reflectance Nomenclature',
      category: 'Physics',
      keyTakeaway: 'Natural outdoor measurements yield Hemispherical-Conical Reflectance Factor (HCRF) rather than pure BRDF.',
      bullets: [
        'Schaepman-Strub et al. (2006) unified reflectance terminology for remote sensing.',
        'Illumination: Hemispherical (direct sun + diffuse skylight).',
        'Viewing: Conical (defined by the finite Field of View FOV solid angle of the spectrometer foreoptic).',
        'Standard field spectroscopy measurement is formally HCRF, denoted R(2π; θ_r, φ_r, ω_r; λ).'
      ],
      mathFormula: 'R(2\\pi; \\theta_r, \\phi_r, \\omega_r; \\lambda) = \\frac{\\int_{\\omega_r} L_r(\\theta, \\phi; \\lambda) \\cos\\theta \\, d\\Omega}{L_{\\text{ref}}(\\lambda) \\int_{\\omega_r} \\cos\\theta \\, d\\Omega}',
      formulaExplanation: 'HCRF is the ratio of target radiance to an ideal lossless Lambertian reflector under identical hemispherical illumination.',
      speakerNotes: 'This paper by Schaepman-Strub is mandatory reading. Misidentifying HCRF as BRF or BRDF is an immediate red flag in MSc research.',
      references: ['Schaepman-Strub, G. et al. (2006). Reflectance quantities in optical remote sensing—definitions and case studies. Remote Sensing of Environment, 103(1), 27-42.']
    },
    {
      id: 'm1_s17',
      slideNumber: 17,
      title: 'The Ideal Lambertian Surface',
      category: 'Physics',
      keyTakeaway: 'A Lambertian reflector scatters incident light isotropically; its reflected radiance is invariant with viewing angle.',
      bullets: [
        'Reflected radiance L is constant in all directions across the 2π hemisphere.',
        'Lambert\'s Cosine Law: Radiant intensity I(θ) varies with cos(θ), exactly offsetting the 1/cos(θ) foreshortening of projected area.',
        'Integration over the hemisphere proves that total radiant exitance M = π · L.'
      ],
      mathFormula: 'M = \\int_{2\\pi} L \\cos\\theta \\, d\\Omega = L \\int_0^{2\\pi} d\\phi \\int_0^{\\pi/2} \\cos\\theta \\sin\\theta \\, d\\theta = \\pi L',
      formulaExplanation: 'The factor π converts radiance [W m⁻² sr⁻¹] to hemispherical exitance [W m⁻²] for a Lambertian surface.',
      speakerNotes: 'Derive the integral on the board. Students often confuse 2π with π because they forget the cosine projection weighting.',
      references: ['Lambert, J. H. (1760). Photometria sive de mensura et gradibus luminis, colorum et umbrae.']
    },
    {
      id: 'm1_s18',
      slideNumber: 18,
      title: 'Solar Geometry: Solar Zenith & Azimuth Angles',
      category: 'Mathematics',
      keyTakeaway: 'The position of the sun dictates the incidence angle θ_s and solar azimuth φ_s, controlling shadow fractions and BRDF.',
      bullets: [
        'Solar Zenith Angle (θ_s): Angle between the local vertical (zenith) and the sun center.',
        'Solar Elevation Angle: α_s = 90° - θ_s.',
        'Solar Azimuth Angle (φ_s): Angular position of the sun measured clockwise from true north.',
        'Solar Noon: The moment the sun reaches maximum elevation (minimum zenith angle) for a specific longitude and day of year.'
      ],
      mathFormula: '\\cos\\theta_s = \\sin\\phi_{\\text{lat}} \\sin\\delta + \\cos\\phi_{\\text{lat}} \\cos\\delta \\cos h',
      formulaExplanation: 'Solar zenith angle calculation where δ is solar declination and h is local hour angle.',
      speakerNotes: 'Remind students to always compute true solar time rather than civil clock time (accounting for equation of time and longitude).',
      references: ['Reda, I., & Andreas, A. (2004). Solar position algorithm for solar radiation applications. Solar Energy, 76(5), 577-589.']
    },
    {
      id: 'm1_s19',
      slideNumber: 19,
      title: 'Snell\'s Law and Fresnel Equations',
      category: 'Physics',
      keyTakeaway: 'Specular reflections at air-water and air-leaf cuticle boundaries are governed by complex refractive indices.',
      bullets: [
        'Snell\'s Law: n₁ · sin(θ₁) = n₂ · sin(θ₂).',
        'Fresnel Reflection: Polarized reflection coefficients R_s (perpendicular) and R_p (parallel).',
        'Leaf wax cuticles produce strong polarized specular reflection in the forward scattering direction that contains no biochemical info.'
      ],
      mathFormula: 'R_s = \\left| \\frac{n_1 \\cos\\theta_i - n_2 \\cos\\theta_t}{n_1 \\cos\\theta_i + n_2 \\cos\\theta_t} \\right|^2, \\quad R_p = \\left| \\frac{n_1 \\cos\\theta_t - n_2 \\cos\\theta_i}{n_1 \\cos\\theta_t + n_2 \\cos\\theta_i} \\right|^2',
      formulaExplanation: 'Fresnel reflectance formulas for s-polarized and p-polarized incident light.',
      speakerNotes: 'Notice that cross-polarizing filters can remove waxy specular reflections, isolating the internal diffuse cellular signal.',
      references: ['Grant, L. (1987). Diffuse and specular characteristics of leaf reflectance. Remote Sensing of Environment.']
    },
    {
      id: 'm1_s20',
      slideNumber: 20,
      title: 'Molecular Electronic Transitions (UV-VNIR)',
      category: 'Physics',
      keyTakeaway: 'Absorption in the 350–700 nm region arises from valence electrons excited across quantized molecular orbitals.',
      bullets: [
        'Photosynthetic pigments: Chlorophyll a (absorption peaks at 430 & 662 nm), Chlorophyll b (453 & 642 nm).',
        'Carotenoids (lutein, β-carotene): Strong absorption in 400–500 nm.',
        'Anthocyanins: Protective pigments absorbing around 530–550 nm.',
        'Iron oxides in soils/minerals: Crystal field transitions in Hematite (Fe₂O₃) and Goethite (FeOOH) around 480–900 nm.'
      ],
      practicalFieldNote: 'Green leaf reflectance peak at ~550 nm is not high reflectance in absolute terms (~15%), but merely lower absorption relative to blue and red.',
      speakerNotes: 'Show the absorbance spectra of isolated pigments in acetone vs. in vivo intact leaves.',
      references: ['Gates, D. M. et al. (1965). Spectral properties of plants. Applied Optics, 4(1), 11-20.']
    },
    {
      id: 'm1_s21',
      slideNumber: 21,
      title: 'Vibrational Spectroscopy & Molecular Bonds (SWIR)',
      category: 'Physics',
      keyTakeaway: 'SWIR features (1000–2500 nm) are caused by overtones and combination modes of fundamental molecular vibrations.',
      bullets: [
        'Fundamental vibrational modes (stretch, bend, rock) occur in the mid-infrared (3–15 µm).',
        'Anharmonicity allows first overtones (2ν) and second overtones (3ν) to appear at higher frequencies (shorter wavelengths in SWIR).',
        'Key functional groups: O-H (water, hydroxyl in clays), C-H (lignin, cellulose, plastics), N-H (proteins), C-O (carbonates).'
      ],
      mathFormula: '\\nu_{\\text{osc}} = \\frac{1}{2\\pi c} \\sqrt{\\frac{k}{\\mu}}, \\quad \\mu = \\frac{m_1 m_2}{m_1 + m_2}',
      formulaExplanation: 'Harmonic oscillator frequency where k is bond spring constant and μ is reduced mass.',
      speakerNotes: 'Light atoms like Hydrogen (H) vibrating against O, C, or N yield high vibrational frequencies, placing overtones in the SWIR.',
      references: ['Coblentz, W. W. (1905). Investigations of Infra-Red Spectra. Carnegie Institution of Washington.']
    },
    {
      id: 'm1_s22',
      slideNumber: 22,
      title: 'Water Absorption Physics in Plants & Soils',
      category: 'Physics',
      keyTakeaway: 'Liquid water exhibits prominent absorption bands at 970 nm, 1200 nm, 1450 nm, and 1940 nm due to O-H symmetric and asymmetric stretching.',
      bullets: [
        'The 970 nm and 1200 nm bands are weak overtones, making them ideal for retrieving equivalent water thickness (EWT) in dense canopies.',
        'The 1450 nm and 1940 nm bands are strong combination bands (ν₁ + ν₃ and ν₂ + ν₃), saturating rapidly in hydrated vegetation.',
        'In desiccated vegetation, cellulose and lignin features become unmasked at 2100 nm and 2300 nm.'
      ],
      practicalFieldNote: 'Measure vegetation moisture during midday water deficit to capture dynamic canopy water status.',
      speakerNotes: 'Explain the Water Index (WI = R900 / R970) as a robust indicator of canopy hydration status.',
      references: ['Peñuelas, J. et al. (1993). The reflectance at the 950–970 nm region as an indicator of plant water status. International Journal of Remote Sensing.']
    },
    {
      id: 'm1_s23',
      slideNumber: 23,
      title: 'Mineral Spectroscopy & Diagnostic Absorption Features',
      category: 'Physics',
      keyTakeaway: 'Clay minerals, carbonates, and sulfates exhibit sharp diagnostic absorption doublet/singlet features in SWIR-2 (2000–2500 nm).',
      bullets: [
        'Kaolinite: Classic Al-OH doublet at 2160 nm and 2209 nm.',
        'Montmorillonite (Smectite): Single deep Al-OH feature at 2206 nm with strong hydration band at 1900 nm.',
        'Calcite (CaCO₃): Carbonate radical (CO₃²⁻) vibrational overtones at 2340 nm.',
        'Chlorite: Fe-OH / Mg-OH features at 2260 nm and 2350 nm.'
      ],
      practicalFieldNote: 'Diagnostic mineral features are narrow (~10–20 nm FWHM), requiring spectroradiometers with ≤ 3–8 nm spectral resolution.',
      speakerNotes: 'Show how field spectroscopy is utilized in exploration geology, planetary missions, and acid mine drainage monitoring.',
      references: ['Hunt, G. R. (1977). Spectral signatures of particulate minerals in the visible and near infrared. Geophysics, 42(3), 501-513.']
    },
    {
      id: 'm1_s24',
      slideNumber: 24,
      title: 'Vegetation Red Edge: Physics and Anatomy',
      category: 'Physics',
      keyTakeaway: 'The abrupt reflectance jump between 680 nm and 750 nm (the "Red Edge") is caused by the transition from chlorophyll absorption to internal scattering.',
      bullets: [
        'Chlorophyll absorbs > 90% of red photons (680 nm) for charge separation in photosystems I & II.',
        'At wavelengths > 700 nm, pigment absorption ceases, while refractive index discontinuities between air and mesophyll cell walls cause intense multiple scattering.',
        'Red edge inflection point (REIP) shifts to longer wavelengths as chlorophyll content increases (red edge shift).'
      ],
      mathFormula: '\\lambda_{\\text{REIP}} \\approx 700 + 40 \\cdot \\left( \\frac{\\frac{R_{670} + R_{780}}{2} - R_{700}}{R_{740} - R_{700}} \\right)',
      formulaExplanation: 'Guyot and Baret (1988) linear interpolation algorithm for red edge position.',
      speakerNotes: 'Emphasize that without multiple internal scattering, leaves would be transparent in the NIR. The NIR plateau reflectance is typically 40–50%.',
      references: ['Horler, D. N. H. et al. (1983). The red edge of plant leaf reflectance. International Journal of Remote Sensing, 4(2), 273-288.']
    },
    {
      id: 'm1_s25',
      slideNumber: 25,
      title: 'Soil Spectral Characteristics & Organic Matter',
      category: 'Physics',
      keyTakeaway: 'Soil reflectance is governed by moisture, iron oxide content, soil organic carbon (SOC), mineralogy, and surface roughness.',
      bullets: [
        'Dry, bare mineral soils exhibit monotonic increase in reflectance from 400 nm to 2200 nm.',
        'Soil Organic Carbon (SOC) flattens and darkens the entire spectrum, masking mineral absorption features when SOC > 2%.',
        'Moisture reduces overall reflectance across all wavelengths via internal total reflection within water films surrounding soil particles.'
      ],
      mathFormula: '\\rho_{\\text{wet}}(\\lambda) = \\frac{\\rho_{\\text{dry}}(\\lambda)}{n_w^2 \\cdot \\left[ 1 - \\rho_{\\text{dry}}(\\lambda) \\cdot \\left(1 - \\frac{1}{n_w^2}\\right) \\right]}',
      formulaExplanation: 'Lekner and Dorf (1988) model for darkening of moist materials.',
      speakerNotes: 'Soil roughness creates micro-shadows that decrease apparent reflectance; always rake or level soil surfaces or log roughness parameters.',
      references: ['Ben-Dor, E. et al. (1999). Imaging spectrometry for soil applications. Remote Sensing of Environment.']
    },
    {
      id: 'm1_s26',
      slideNumber: 26,
      title: 'Environmental Perturbations: Wind, Temperature & Humidity',
      category: 'QualityAssurance',
      keyTakeaway: 'Outdoor environmental noise directly modulates spectral measurements and must be systematically mitigated.',
      bullets: [
        'Wind moves canopy leaves, altering instantaneous leaf angle distribution (LAD) and shadow fraction between consecutive scans.',
        'Ambient temperature variations affect the dark current and band-gap energy of InGaAs detector arrays in the spectroradiometer.',
        'Rapidly changing relative humidity alters water vapor absorption in the path between target and foreoptic.'
      ],
      practicalFieldNote: 'Abort field scans when wind speeds exceed Beaufort scale 3 (> 5 m/s) or gusts displace canopies.',
      speakerNotes: 'Explain why laboratory measurements cannot simply be substituted for field spectra: canopies are dynamic living biophysical structures.',
      references: ['MacArthur, A. et al. (2014). Optimizing the use of field spectrometers. Remote Sensing of Environment.']
    },
    {
      id: 'm1_s27',
      slideNumber: 27,
      title: 'Illumination Stability & Cloud Perturbations',
      category: 'Protocol',
      keyTakeaway: 'Sub-visual cirrus clouds and passing cumulus fringes cause catastrophic calibration errors in single-beam spectrometers.',
      bullets: [
        'Single-beam instruments assume incident solar irradiance remains identical between White Reference and target scans.',
        'A 2% drop in solar irradiance between reference and target creates an apparent 2% artifact across all calculated target reflectance values.',
        'Cirrus clouds scatter selectively in the SWIR, creating spurious spectral slope distortions.'
      ],
      practicalFieldNote: 'Inspect the sky continuously. Wear polarized sunglasses to spot high-altitude ice-crystal cirrus clouds.',
      speakerNotes: 'Discuss why an optical pyranometer or dual-beam spectrometer setup is ideal for detecting subtle irradiance drift.',
      references: ['Milton, E. J. (1987). Principles of field spectroscopy. International Journal of Remote Sensing.']
    },
    {
      id: 'm1_s28',
      slideNumber: 28,
      title: 'Scale and Spatial Heterogeneity',
      category: 'CaseStudy',
      keyTakeaway: 'Field point spectra represent a localized footprint (cm to m) that must be scaled up to satellite pixel sizes (10 to 30 m).',
      bullets: [
        'A 25° field of view lens held 1 meter above the ground integrates a circular footprint of ~44 cm diameter.',
        'Natural ecosystems exhibit micro-topographic, soil moisture, and species composition gradients within a single Sentinel-2 or Landsat pixel.',
        'Spatial sampling design (random, regular grid, transect) is required to estimate the true mean and variance of a landscape element.'
      ],
      mathFormula: 'D = 2 \\cdot h \\cdot \\tan\\left(\\frac{\\text{FOV}}{2}\\right)',
      formulaExplanation: 'Footprint diameter D as a function of sensor height h and angular field of view FOV.',
      speakerNotes: 'Draw the expanding conical footprint on the board. Remind students that moving the sensor 2x higher covers 4x the area.',
      references: ['Curtiss, B., & Goetz, A. F. (1994). Field spectrometry: Techniques and instrumentation. Proceedings of the International Symposium on Spectral Sensing Research.']
    },
    {
      id: 'm1_s29',
      slideNumber: 29,
      title: 'Academic Standards: NERC FSF & Coblentz Society',
      category: 'QualityAssurance',
      keyTakeaway: 'Adherence to international metrological protocols guarantees scientific reproducibility and interoperability.',
      bullets: [
        'NERC Field Spectroscopy Facility (UK): Gold-standard operational guidelines for field radiometry, calibration tracking, and instrument loans.',
        'Coblentz Society: Established standards for infrared spectra collection, signal-to-noise thresholds, and wavelength accuracy.',
        'CEOS WGCV (Committee on Earth Observation Satellites - Working Group on Calibration and Validation): Global validation protocols.'
      ],
      practicalFieldNote: 'Always record full campaign metadata in accordance with CEOS WGCV field spectroradiometry guidelines.',
      speakerNotes: 'Introduce students to the NERC FSF calibration documentation and Coblentz spectral repository.',
      references: ['NERC FSF (2020). Operations and Best Practice Manual for Field Spectroradiometry. Natural Environment Research Council.']
    },
    {
      id: 'm1_s30',
      slideNumber: 30,
      title: 'Module 1 Synthesis & Looking Ahead to Point Spectrometers',
      category: 'Physics',
      keyTakeaway: 'Field spectroscopy relies on rigorous physics: Planck\'s law, Beer-Lambert attenuation, and Schaepman-Strub HCRF geometry.',
      bullets: [
        'Module 1 established: Optical radiation physics, atmospheric transmission windows, molecular absorption bands, and reflectance definitions.',
        'In Module 2, we open the hardware box: diffraction gratings, photodiode arrays, fiber optics, and instrument architecture (ASD, SVC, PSR+).',
        'Preparation for Field Exercise 1: Understanding solar angle limits and calculating foreoptic footprint geometries.'
      ],
      speakerNotes: 'Conclude the lecture, open the floor for questions, and preview the practical laboratory on solar spectrum modeling.',
      references: ['Milton, E. J., Schaepman, M. E., Anderson, K., & Gao, B. C. (2009). Progress in field spectroscopy. Remote Sensing of Environment, 113, S92-S109.']
    }
  ];
}

// Module 1 Definition
export const MODULE_1: CourseModule = {
  id: 'module_1',
  moduleNumber: 1,
  title: 'Physics of Optical Radiation, Radiometry & Atmospheric Transmission',
  shortTitle: 'Optical Physics & Radiometry',
  subtitle: 'Planck radiation, radiometric quantities, solar spectra, atmospheric windows, and reflectance nomenclature',
  durationHours: 4,
  ectsCredits: 1.5,
  abstract: 'This foundational module introduces MSc students to the core electromagnetic physics and radiative principles governing field spectroscopy. Students master Planck\'s law, Wien\'s displacement, blackbody emission, and the radiometric cascade from radiant flux to spectral radiance. The module investigates extraterrestrial solar irradiance (AM0 vs AM1.5), atmospheric attenuation mechanisms (Rayleigh and Mie scattering, gaseous absorption by H2O, CO2, O2, and O3), and the formal reflectance nomenclature defined by Schaepman-Strub et al., contrasting theoretical BRDF with field-measurable HCRF.',
  coreCompetencies: [
    'Derive and differentiate radiometric flux, irradiance, and radiance with correct SI units.',
    'Model atmospheric transmission windows and identify specific gas absorption bands (H2O, CO2, O2, O3).',
    'Calculate solar zenith angles, optical air mass, and ground-level direct vs diffuse solar irradiance.',
    'Differentiate between BRDF, BRF, and Hemispherical-Conical Reflectance Factor (HCRF).'
  ],
  slides: generateModule1Slides(),
  fieldExercise: {
    title: 'Field Exercise 1: Outdoor Solar Geometry, Illumination Stability & Diurnal Irradiance Tracking',
    estimatedDuration: '3 hours (Mid-morning to afternoon)',
    targetEnvironment: 'Open unobstructed university sports ground or agricultural field',
    recommendedInstruments: ['Handheld solar pyranometer / PAR quantum sensor', 'Calibrated reference tile or lux meter', 'Inclinometer / Sun compass', 'Weather logger (temperature, RH, wind)'],
    safetyAndPreTripChecklist: [
      'UV-protective sunglasses (UV400) and wide-brimmed field hat.',
      'Check meteorological forecast: Cloud cover must be < 10% (optimal clear sky day).',
      'Confirm local solar noon time via NOAA solar calculator.',
      'Calibrate handheld pyranometer zero level with light-tight cap.'
    ],
    fieldProtocolSteps: [
      {
        stepNumber: 1,
        action: 'Orient the observation station towards true South (Northern Hemisphere) and establish a level tripod mount.',
        scientificRationale: 'Prevents operator cast shadow from impinging on the measurement target throughout the diurnal arc.',
        commonErrorToAvoid: 'Using magnetic North without applying local magnetic declination correction.'
      },
      {
        stepNumber: 2,
        action: 'Measure global solar irradiance (E_global) on a horizontal plane every 15 minutes between 10:00 and 14:00 solar time.',
        scientificRationale: 'Captures the cosine response curve of solar zenith angle and tests atmospheric optical depth stability.',
        commonErrorToAvoid: 'Tilting the sensor off-horizontal; even a 2° tilt induces > 3% irradiance error.'
      },
      {
        stepNumber: 3,
        action: 'Use a shadow disk mounted on an articulated arm to obscure the direct solar disk, recording diffuse irradiance (E_dif).',
        scientificRationale: 'Permits empirical partitioning of direct beam (E_dir = (E_global - E_dif) / cos θ_s) and calculation of diffuse fraction.',
        commonErrorToAvoid: 'Obscuring too much of the circumsolar aureole skylight with an oversized shadow disk.'
      },
      {
        stepNumber: 4,
        action: 'Log sky conditions, relative humidity, ambient air temperature, and visible aerosol haze levels concurrently.',
        scientificRationale: 'Provides environmental covariates required to evaluate atmospheric stability.',
        commonErrorToAvoid: 'Failing to log sub-visual cirrus streaks passing near the solar disc.'
      }
    ],
    dataRecordingSheetFields: [
      'Timestamp (Local & UTC)',
      'Solar Zenith Angle θ_s (deg)',
      'Solar Azimuth Angle φ_s (deg)',
      'Global Irradiance E_global (W/m²)',
      'Diffuse Irradiance E_dif (W/m²)',
      'Calculated Direct Irradiance E_dir (W/m²)',
      'Direct-to-Diffuse Ratio',
      'Air Temperature (°C)',
      'Relative Humidity (%)',
      'Sky Condition Notes'
    ],
    fieldDeliverable: 'Submit a comprehensive 4-page scientific report plotting diurnal E_global, E_dif, and direct-to-diffuse ratio against theoretical clear-sky Bird/MODTRAN models, detailing sources of departure.'
  },
  practicalLab: {
    title: 'Practical Lab 1: Modeling Solar Spectrum, Atmospheric Extinction & BRF Calculations in Python and R',
    softwareEnvironment: 'Hybrid (Python & R)',
    primaryPackages: ['numpy', 'scipy', 'matplotlib', 'pandas', 'hsdar (R)', 'prospectr (R)'],
    learningObjectives: [
      'Implement Planck\'s law and integrate blackbody spectral exitance numerically.',
      'Simulate atmospheric extinction using the Beer-Lambert law with Rayleigh and Ångström aerosol optical depth.',
      'Compute Kasten-Young air mass and calculate top-of-canopy direct vs diffuse spectral ratios.',
      'Transform directional radiance measurements into Hemispherical-Conical Reflectance Factors (HCRF).'
    ],
    sampleDataset: {
      name: 'SMARTS2_AM1.5_Solar_Spectrum.csv',
      description: 'Reference extraterrestrial (ASTM G173-03 AM0) and terrestrial (AM1.5 direct and circumsolar) spectral irradiance from 350 to 2500 nm in 1 nm increments.',
      spectralRange: '350 - 2500 nm',
      sensor: 'SMARTS v2.9.2 Radiative Transfer Model Output',
      bandsCount: 2151
    },
    codeSnippets: [
      {
        language: 'python',
        title: 'Python: Planck Blackbody Function & Rayleigh Optical Depth Simulation',
        description: 'Computes spectral radiance of the sun at 5778K and models Rayleigh optical depth across optical wavelengths.',
        code: `import numpy as np
import matplotlib.pyplot as plt

# Fundamental physical constants (SI units)
h = 6.62607015e-34    # Planck constant [J s]
c = 2.99792458e8       # Speed of light [m/s]
k_B = 1.380649e-23     # Boltzmann constant [J/K]

def planck_radiance(wavelength_nm, temperature_k):
    """Calculate spectral radiance B_lambda [W m^-2 sr^-1 nm^-1] using Planck's law."""
    lam_m = wavelength_nm * 1e-9
    c1 = 2.0 * h * c**2
    c2 = (h * c) / (lam_m * k_B * temperature_k)
    # Convert from [W m^-2 sr^-1 m^-1] to [W m^-2 sr^-1 nm^-1] (multiply by 1e-9)
    B_lam = (c1 / (lam_m**5)) / (np.exp(c2) - 1.0) * 1e-9
    return B_lam

def rayleigh_optical_depth(wavelength_nm, surface_pressure_hpa=1013.25):
    """Estimate Rayleigh optical depth tau_R(lambda) using Bodhaine et al. formulation."""
    lam_um = wavelength_nm / 1000.0
    # Formula for standard sea-level atmosphere
    tau_R = 0.008569 * (lam_um**-4) * (1.0 + 0.0113 * (lam_um**-2) + 0.00013 * (lam_um**-4))
    # Scale by local atmospheric barometric pressure
    return tau_R * (surface_pressure_hpa / 1013.25)

# Generate wavelengths from 350 to 2500 nm
wavelengths = np.linspace(350, 2500, 1000)
solar_radiance = planck_radiance(wavelengths, temperature_k=5778)
tau_rayleigh = rayleigh_optical_depth(wavelengths)

print(f"Peak solar emission wavelength: {wavelengths[np.argmax(solar_radiance)]:.1f} nm")
print(f"Rayleigh optical depth at 450 nm (Blue): {rayleigh_optical_depth(450):.4f}")
print(f"Rayleigh optical depth at 850 nm (NIR):  {rayleigh_optical_depth(850):.4f}")
print(f"Rayleigh optical depth at 2200 nm (SWIR): {rayleigh_optical_depth(2200):.6f}")
`
      },
      {
        language: 'r',
        title: 'R Script: Computing HCRF from Raw Field Target and White Reference Scans',
        description: 'Imports raw target and Spectralon white reference digital numbers, applies dark current subtraction, and computes calibrated HCRF.',
        code: `# Principles of Field Spectroscopy: MSc Lab 1
# Computation of Hemispherical-Conical Reflectance Factor (HCRF)

compute_hcrf <- function(dn_target, dn_ref, dn_dark, panel_cal_factor) {
  # Subtract dark current from both measurements
  net_target <- dn_target - dn_dark
  net_ref    <- dn_ref - dn_dark
  
  # Ensure no division by zero or negative net reference counts
  net_ref[net_ref <= 0] <- NA
  
  # Calculate raw reflectance ratio
  raw_ratio <- net_target / net_ref
  
  # Calibrate by NIST-traceable Spectralon calibration certificate
  hcrf <- raw_ratio * panel_cal_factor
  return(hcrf)
}

# Example with synthetic field spectroradiometer scan (500 to 900 nm)
wavelengths <- seq(500, 900, by=1)
n_bands <- length(wavelengths)

# Simulated Digital Numbers (16-bit ADC: 0 - 65535 counts)
dn_dark   <- rep(1200, n_bands) + rnorm(n_bands, mean=0, sd=5)
dn_ref    <- 45000 - 0.01 * (wavelengths - 500)^2 + rnorm(n_bands, sd=30)
dn_target <- 15000 + 20000 * (1 / (1 + exp(-0.05 * (wavelengths - 710)))) + rnorm(n_bands, sd=25)
panel_cal <- rep(0.991, n_bands) # 99% Spectralon panel

leaf_hcrf <- compute_hcrf(dn_target, dn_ref, dn_dark, panel_cal)

cat("Calculated Mean Green Reflectance (550 nm):", round(leaf_hcrf[wavelengths == 550], 4), "\\n")
cat("Calculated Mean NIR Reflectance (800 nm):  ", round(leaf_hcrf[wavelengths == 800], 4), "\\n")
`
      }
    ],
    studentTasks: [
      'Plot the solar extraterrestrial spectrum vs Planck 5778K distribution; evaluate where deviations occur due to solar atmospheric absorption (Fraunhofer lines).',
      'Compute the total atmospheric transmittance from 350 to 2500 nm incorporating Rayleigh, aerosol (α=1.3, β=0.08), and a simplified water vapor absorption model.',
      'Implement an automated test detecting saturated or low-signal channels (< 5% dynamic range) to flag invalid spectral bands.'
    ],
    expectedOutputSummary: 'Students produce reproducible Jupyter/R Markdown notebooks showing calibrated spectral irradiance curves, optical depth breakdowns, and an annotated HCRF vegetation profile with labeled absorption features.'
  },
  quiz: {
    moduleNumber: 1,
    title: 'Module 1 Automated Assessment: Optical Physics & Radiometry',
    passingScorePercent: 80,
    questions: [
      {
        id: 'm1_q1',
        question: 'Which of the following radiometric quantities explicitly accounts for the projected surface area of the source and the solid angle of collection?',
        options: [
          'Radiant Flux (Φ) [W]',
          'Radiant Intensity (I) [W sr⁻¹]',
          'Irradiance (E) [W m⁻²]',
          'Radiance (L) [W m⁻² sr⁻¹]'
        ],
        correctOptionIndex: 3,
        explanation: 'Radiance L = d²Φ / (dA cosθ dΩ) is the flux per unit projected area per unit solid angle. It is the fundamental quantity measured by directional optical foreoptics.',
        academicCitation: 'Nicodemus, F. E. et al. (1977). NBS Monograph 160.'
      },
      {
        id: 'm1_q2',
        question: 'According to Schaepman-Strub et al. (2006), a field spectroradiometer measurement taken under natural open-sky illumination with a 25° foreoptic is formally classified as which quantity?',
        options: [
          'Bidirectional Reflectance Distribution Function (BRDF)',
          'Bidirectional Reflectance Factor (BRF)',
          'Hemispherical-Conical Reflectance Factor (HCRF)',
          'Bi-hemispherical Albedo'
        ],
        correctOptionIndex: 2,
        explanation: 'Natural outdoor illumination arrives from the entire upper hemisphere (sun + skylight), while a 25° foreoptic collects light in a conical solid angle, defining HCRF: R(2π; θr, φr, ωr; λ).',
        academicCitation: 'Schaepman-Strub, G. et al. (2006). Remote Sensing of Environment, 103(1), 27-42.'
      },
      {
        id: 'm1_q3',
        question: 'Why does Rayleigh scattering optical depth decrease drastically from the blue (400 nm) to shortwave infrared (2000 nm)?',
        options: [
          'Because molecular absorption increases at longer wavelengths.',
          'Because Rayleigh scattering cross-section is inversely proportional to the fourth power of wavelength (λ⁻⁴).',
          'Because photons lose kinetic energy as they propagate through the stratosphere.',
          'Because aerosol particles agglomerate into larger condensates in sunlight.'
        ],
        correctOptionIndex: 1,
        explanation: 'Lord Rayleigh derived that scattering by particles much smaller than wavelength scales with 1/λ⁴. Hence (400/2000)⁻⁴ = 0.2⁻⁴ = 625 times stronger scattering at 400 nm than at 2000 nm.',
        academicCitation: 'Rayleigh, Lord (1899). Philosophical Magazine, 47, 375-384.'
      },
      {
        id: 'm1_q4',
        question: 'What is the primary physical cause of the deep atmospheric transmission absorption troughs at 1400 nm and 1900 nm?',
        options: [
          'Electronic transitions in tropospheric ozone molecules.',
          'Vibrational-rotational absorption bands of gaseous water vapor (H₂O).',
          'Refractive index dispersion of ice crystals in cirrus clouds.',
          'Diffraction around pollen and fine organic particulates.'
        ],
        correctOptionIndex: 1,
        explanation: 'Water vapor molecules in the atmospheric path exhibit fundamental vibrational combination modes (ν₁ + ν₃ and ν₂ + ν₃) that almost completely extinguish solar photons around 1400 and 1900 nm.',
        academicCitation: 'Gao, B. C., & Goetz, A. F. (1990). Remote Sensing of Environment, 33(3), 145-154.'
      },
      {
        id: 'm1_q5',
        question: 'An operator measures a target with a spectroradiometer foreoptic held at a sensor height of 1.5 m above a flat grassland using an 8° FOV lens. What is the approximate circular footprint diameter on the ground?',
        options: [
          '0.11 m',
          '0.21 m',
          '0.45 m',
          '1.50 m'
        ],
        correctOptionIndex: 1,
        explanation: 'Diameter D = 2 · h · tan(FOV / 2) = 2 · 1.5 · tan(4°) ≈ 3.0 · 0.06992 = 0.2098 m ≈ 0.21 m (21 cm).',
        academicCitation: 'Curtiss, B., & Goetz, A. F. (1994). ISSSR Proceedings.'
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
      authors: 'Schaepman-Strub, G., Schaepman, M. E., Painter, T. H., Dangel, S., & Martonchik, J. V.',
      year: 2006,
      title: 'Reflectance quantities in optical remote sensing—definitions and case studies',
      journalOrPublisher: 'Remote Sensing of Environment, 103(1), 27-42',
      doiOrUrl: '10.1016/j.rse.2006.03.002'
    },
    {
      authors: 'Nicodemus, F. E., Richmond, J. C., Hsia, J. J., Ginsberg, I. W., & Limperis, T.',
      year: 1977,
      title: 'Geometrical Considerations and Nomenclature for Reflectance',
      journalOrPublisher: 'National Bureau of Standards Monograph 160, US Dept. of Commerce'
    },
    {
      authors: 'Clark, R. N.',
      year: 1999,
      title: 'Spectroscopy of rocks and minerals, and principles of spectroscopy',
      journalOrPublisher: 'Manual of Remote Sensing, Volume 3: Remote Sensing for the Earth Sciences, Wiley',
      doiOrUrl: 'http://speclab.cr.usgs.gov'
    }
  ]
};

// Now let's generate Module 2 Slides (Point Spectroradiometers)
function generateModule2Slides(): Slide[] {
  return [
    {
      id: 'm2_s1',
      slideNumber: 1,
      title: 'Fundamentals of Point Spectroradiometers & Architecture',
      category: 'Instrumentation',
      keyTakeaway: 'Point spectroradiometers integrate entrance optics, fiber guides, dispersive elements, and multi-detector arrays to record contiguous spectral signatures.',
      bullets: [
        'Point spectrometer: Measures spectral radiance or irradiance integrated over a single spatially averaged field of view.',
        'Contrasts with imaging spectrometers (hyperspectral cameras) which collect 2D spatial pixels simultaneously.',
        'High signal-to-noise ratio (SNR > 1000:1) and rapid integration times (10 to 100 ms) make point sensors the benchmark for ground validation.'
      ],
      practicalFieldNote: 'Point spectrometers are precision laboratory-grade optical instruments packaged for ruggedized field deployment.',
      speakerNotes: 'In Module 2, we study the physical hardware subsystems that convert incident photons into calibrated digital numbers.',
      references: ['Curtiss, B., & Goetz, A. F. (1994). Field spectrometry: Techniques and instrumentation.']
    },
    {
      id: 'm2_s2',
      slideNumber: 2,
      title: 'Anatomy of Benchmark Field Spectroradiometers',
      category: 'Instrumentation',
      keyTakeaway: 'The three leading commercial field instruments (ASD FieldSpec, SVC HR-1024, Spectral Evolution PSR+) share core tripartite architecture.',
      bullets: [
        'ASD FieldSpec 4 Hi-Res: Tri-detector architecture (VNIR Si-array + SWIR1 InGaAs + SWIR2 InGaAs), fiber optic cable with 57 quartz fibers.',
        'SVC HR-1024i: Internal high-resolution diffraction gratings, 1024 channels, dual internal cameras, GPS, and Bluetooth.',
        'Spectral Evolution PSR-3500 / PSR+: Direct-mount foreoptics without fiber cables, reducing mechanical fiber bend noise.'
      ],
      speakerNotes: 'Show physical instrument cutaway diagrams and compare the internal spectrometer optical benches.',
      references: ['MacArthur, A. et al. (2014). Optimizing the use of field spectrometers. Remote Sensing of Environment.']
    },
    {
      id: 'm2_s3',
      slideNumber: 3,
      title: 'The Entrance Optics: Foreoptics & Solid Angles',
      category: 'Instrumentation',
      keyTakeaway: 'Foreoptics define the instrument\'s angular field of view (FOV), determining the spatial footprint and optical throughput.',
      bullets: [
        'Bare Fiber: Typically ~25° full-angle cone (acceptance angle governed by numerical aperture of quartz fiber).',
        'Restrictor Lenses: 1°, 4°, 8°, 10° barrel lenses reduce the FOV for small targets or tall canopy towers.',
        'Cosine Receptor: Opal glass or PTFE diffuser with 180° (2π steradian) hemispherical collection for measuring downwelling irradiance.'
      ],
      mathFormula: 'NA = n \\cdot \\sin\\theta_a = \\sqrt{n_{\\text{core}}^2 - n_{\\text{cladding}}^2}',
      formulaExplanation: 'Numerical aperture (NA) of fiber optic cable dictates maximum acceptance half-angle θ_a.',
      speakerNotes: 'Warn students: Attaching a 1° or 8° foreoptic lens changes optical throughput and requires a new white reference calibration.',
      references: ['NERC FSF (2020). Best Practice Manual for Field Spectroradiometry.']
    },
    {
      id: 'm2_s4',
      slideNumber: 4,
      title: 'Fiber Optic Bundles: Transmission & Care',
      category: 'Instrumentation',
      keyTakeaway: 'Fiber optic cables are brittle silica glass bundles vulnerable to micro-fractures, bend-loss, and mode-scrambling defects.',
      bullets: [
        'Fiber construction: High-purity anhydrous fused silica (low-OH) core to minimize internal hydroxyl absorption at 1400 nm.',
        'Randomized bundle: Transmits light from the circular entrance slit to three separate internal spectrometer entrance slits.',
        'Mechanical bend attenuation: Bending the cable beyond minimum bend radius (> 15 cm) induces transient transmission loss and calibration drift.'
      ],
      practicalFieldNote: 'Never step on, twist, or clamp a spectrometer fiber cable. Secure the cable along the pistol grip with hook-and-loop straps.',
      speakerNotes: 'Demonstrate the fragile inner structure of a fiber cable. Broken strands permanently reduce throughput and degrade calibration.',
      references: ['Milton, E. J. (1987). Principles of field spectroscopy. International Journal of Remote Sensing.']
    },
    {
      id: 'm2_s5',
      slideNumber: 5,
      title: 'Contact Probes and Plant Probes with Internal Halogen Sources',
      category: 'Instrumentation',
      keyTakeaway: 'Contact probes eliminate outdoor solar fluctuations by providing constant artificial illumination under a sealed optical head.',
      bullets: [
        'Illumination: Low-noise quartz-tungsten-halogen (QTH) bulb operating at stabilized voltage.',
        'Leaf clip / Plant probe: Holds leaves gently against low-reflectance black (or white) background backing without solar influence.',
        'Advantage: Enables reliable spectral measurements under cloudy skies, indoors, or at night.',
        'Limitation: Measures contact leaf optical properties, not canopy structure or BRDF.'
      ],
      practicalFieldNote: 'The heat from high-intensity halogen contact probes can cause rapid desiccation of delicate leaves within seconds.',
      speakerNotes: 'Always measure leaves with contact probe clamped for no more than 3–5 seconds to prevent thermal scorch.',
      references: ['Doughty, C. E. et al. (2011). Foliar spectral traits in tropical trees. Remote Sensing of Environment.']
    },
    {
      id: 'm2_s6',
      slideNumber: 6,
      title: 'Dispersive Elements: Diffraction Gratings vs. Prisms',
      category: 'Physics',
      keyTakeaway: 'Reflective diffraction gratings disperse polychromatic light into angularly separated wavelengths via constructive interference.',
      bullets: [
        'Ruled vs. Holographic Gratings: Holographic gratings produce minimal stray light and eliminate ghost spectra.',
        'Linear dispersion: Spatial separation of wavelengths along the detector plane: dx/dλ = f · m / (d · cos θ_m).',
        'Diffraction orders: Order-sorting filters (long-pass or bandpass) are required to block overlapping second-order harmonics (e.g. 400 nm diffracted at 800 nm angle).'
      ],
      mathFormula: 'd \\cdot (\\sin\\alpha + \\sin\\beta) = m \\cdot \\lambda',
      formulaExplanation: 'Grating equation where d is groove spacing, α is incident angle, β is diffracted angle, and m is spectral order.',
      speakerNotes: 'Explain how diffraction order overlap can cause false signals in the NIR if filter transitions degrade.',
      references: ['Palmer, C. (2020). Diffraction Grating Handbook (8th ed.). Newport Corporation.']
    },
    {
      id: 'm2_s7',
      slideNumber: 7,
      title: 'Silicon Photodiode Arrays for VNIR Detection (350–1000 nm)',
      category: 'Instrumentation',
      keyTakeaway: 'Silicon detectors operate on the internal photoelectric effect with high quantum efficiency in the visible and near-infrared.',
      bullets: [
        '512-element or 1024-element linear silicon NMOS/CMOS photodiode array.',
        'Silicon bandgap energy Eg ≈ 1.12 eV at 300 K; limits long-wavelength detection cutoff to λ_cutoff = hc / Eg ≈ 1100 nm.',
        'Fixed grating with no moving parts: All VNIR channels are exposed and read out simultaneously in milliseconds.'
      ],
      mathFormula: '\\lambda_{\\text{cutoff}} = \\frac{hc}{E_g} \\approx \\frac{1.24}{\\text{Energy in eV}} \\, [\\mu\\text{m}]',
      formulaExplanation: 'Bandgap cutoff limits the operational wavelength range of semiconductor detectors.',
      speakerNotes: 'Show the quantum efficiency curve of silicon: peaks around 700–800 nm, drops sharply at 1000 nm.',
      references: ['Sze, S. M. (2007). Physics of Semiconductor Devices. Wiley.']
    },
    {
      id: 'm2_s8',
      slideNumber: 8,
      title: 'Indium Gallium Arsenide (InGaAs) Detectors for SWIR (1000–2500 nm)',
      category: 'Instrumentation',
      keyTakeaway: 'InGaAs semiconductor alloys provide the sensitivity required to detect low-energy shortwave infrared photons.',
      bullets: [
        'Standard InGaAs (In₀.₅₃Ga₀.₄₇As lattice-matched to InP substrate): Covers SWIR-1 (1000–1700 nm).',
        'Extended InGaAs: Graded ternary composition with lower bandgap (Eg ≈ 0.49 eV) covers SWIR-2 (1700–2500 nm).',
        'Requires Thermoelectric (Peltier) cooling to -10°C to -25°C to suppress thermal dark current generation.'
      ],
      practicalFieldNote: 'Allow the spectroradiometer 15–20 minutes warm-up time after powering on for the Peltier coolers to stabilize detector temperatures.',
      speakerNotes: 'Point out why older spectrometers used liquid nitrogen cooled detectors; modern thermoelectric coolers made portable field radiometry possible.',
      references: ['Rogalski, A. (2010). Infrared Detectors (2nd ed.). CRC Press.']
    },
    {
      id: 'm2_s9',
      slideNumber: 9,
      title: 'Scanning Monochromator vs. Fixed Photodiode Array',
      category: 'Instrumentation',
      keyTakeaway: 'Array spectrometers read all wavelengths concurrently; scanning grating instruments step sequentially with rotating galvanometers.',
      bullets: [
        'Array Spectrometer (e.g. ASD VNIR, SVC HR-1024): All spectral channels acquire simultaneously, freezing fast-moving cloud shadows.',
        'Scanning Grating (e.g. ASD SWIR1 & SWIR2): A high-speed oscillating galvanometer scans the spectrum across a single thermoelectrically cooled InGaAs point detector.',
        'Modern ASD FieldSpec 4 uses fast oscillating concave gratings: complete 350–2500 nm scan in 100 milliseconds.'
      ],
      speakerNotes: 'Contrast the mechanical vulnerability of rotating scanning gratings with solid-state array designs.',
      references: ['Curtiss, B., & Goetz, A. F. (1994). Field spectrometry techniques.']
    },
    {
      id: 'm2_s10',
      slideNumber: 10,
      title: 'Spectral Resolution vs. Spectral Sampling Interval',
      category: 'Mathematics',
      keyTakeaway: 'Resolution (FWHM) measures optical band-separation power; sampling interval is the wavelength spacing between reported data points.',
      bullets: [
        'Full Width at Half Maximum (FWHM): Width of the instrument response function (bandpass) at 50% peak transmittance.',
        'Sampling Interval: Wavelength step between adjacent digital output channels (e.g., interpolated to 1.0 nm).',
        'Nyquist sampling theorem: To avoid undersampling, spectral sampling interval must be at least FWHM / 2.'
      ],
      mathFormula: '\\Delta \\lambda_{\\text{FWHM}} \\ge 2 \\cdot \\delta\\lambda_{\\text{sampling}}',
      formulaExplanation: 'Criterion for resolving adjacent narrow spectral absorption features without aliasing.',
      speakerNotes: 'Caution students: Just because a vendor exports data with 1 nm increments does not mean the optical resolution is 1 nm! ASD is 3 nm in VNIR, 8–10 nm in SWIR.',
      references: ['CEOS WGCV (2014). Quality Assurance Framework for Earth Observation: Field Spectrometry Protocol.']
    },
    {
      id: 'm2_s11',
      slideNumber: 11,
      title: 'Instrument Response Function (IRF) & Slit Function',
      category: 'Physics',
      keyTakeaway: 'The instrument slit function convolves monochromatic spectral lines into Gaussian-shaped instrument bandpasses.',
      bullets: [
        'Input monochromatic Dirac delta function δ(λ - λ₀) is mapped onto the detector as a Gaussian response function.',
        'Determined experimentally using narrow gas emission lamps (Mercury-Argon, Neon, Krypton).',
        'Essential for resynthesizing satellite spectral bands (e.g. Sentinel-2 MSI, Landsat-9 OLI) from continuous field spectra.'
      ],
      mathFormula: 'S(\\lambda) = \\int_{-\\infty}^{+\\infty} L_{\\text{true}}(\\lambda\') \\cdot f_{\\text{slit}}(\\lambda - \\lambda\') \\, d\\lambda\'',
      formulaExplanation: 'Convolution integral describing the observed spectrum S(λ) through the spectrometer slit function.',
      speakerNotes: 'Walk students through the mathematical convolution of a hyperspectral curve with Sentinel-2 spectral response functions.',
      references: ['Barsi, J. A. et al. (2014). The spectral response functions of Landsat-8 Operational Land Imager. Remote Sensing.']
    },
    {
      id: 'm2_s12',
      slideNumber: 12,
      title: 'Analog-to-Digital Conversion (ADC) & Dynamic Range',
      category: 'Instrumentation',
      keyTakeaway: 'The ADC converts photo-generated analog voltage into discrete Digital Numbers (DN) with finite quantization resolution.',
      bullets: [
        '16-bit ADC provides 2¹⁶ = 65,536 discrete quantization levels (0 to 65535 counts).',
        'Dynamic range must accommodate both bright 99% Spectralon panels in full sun and dark water bodies (< 2% reflectance).',
        'Saturation: When incident photon flux generates voltage exceeding the maximum ADC reference voltage, counts peg at 65535.'
      ],
      mathFormula: '\\text{Dynamic Range [dB]} = 20 \\cdot \\log_{10}\\left(\\frac{\\text{Full Well Capacity}}{\\text{Readout Noise}}\\right)',
      formulaExplanation: 'Defines the ratio between the maximum detectable signal and the noise floor.',
      practicalFieldNote: 'Never record data with peak counts exceeding 85–90% of maximum ADC capacity to preserve headroom for solar bursts.',
      speakerNotes: 'Demonstrate what a clipped, flat-topped saturated spectrum looks like in software.',
      references: ['Holst, G. C. (2011). CCD Arrays, Cameras, and Displays. JCD Publishing.']
    },
    {
      id: 'm2_s13',
      slideNumber: 13,
      title: 'Integration Time Optimization',
      category: 'Protocol',
      keyTakeaway: 'Integration time (exposure time) must be dynamically optimized on the white reference panel before scanning targets.',
      bullets: [
        'Integration time governs the duration charges accumulate on the photodiode capacitors before readout.',
        'Too short: Low signal-to-noise ratio, dominated by quantization and readout noise.',
        'Too long: Signal saturation (> 65535 counts), corrupting reflectance ratios.',
        'Target optimum: Set integration time so peak white reference signal sits between 70% and 85% of saturation (~45,000 counts on 16-bit).'
      ],
      practicalFieldNote: 'Run auto-integration optimization whenever solar zenith angle changes by > 5° or cloud conditions shift.',
      speakerNotes: 'Show how integration time scales linearly with counts in VNIR array detectors.',
      references: ['ASD Inc. (2010). FieldSpec 4 User Manual. Analytical Spectral Devices.']
    },
    {
      id: 'm2_s14',
      slideNumber: 14,
      title: 'Detector Junction Steps / Jumps at 1000 nm & 1800 nm',
      category: 'Processing',
      keyTakeaway: 'Transitions between separate physical detectors create artificial discontinuities (splices) in raw spectral curves.',
      bullets: [
        'ASD FieldSpec employs three separate physical gratings/detectors: VNIR (350–1000 nm), SWIR-1 (1001–1800 nm), and SWIR-2 (1801–2500 nm).',
        'Fiber strands feeding the three spectrometers have slight spatial misalignments, seeing slightly different target footprints.',
        'Temperature shifts cause different dark current drifts between silicon and InGaAs arrays.',
        'Produces characteristic "steps" or "jumps" at exactly 1000 nm and 1800 nm.'
      ],
      practicalFieldNote: 'Splice correction algorithms mathematically adjust the SWIR1 and SWIR2 offsets to match the VNIR reference channel.',
      speakerNotes: 'Display an uncorrected vegetation spectrum showing a prominent 5% jump at 1000 nm. Explain splice correction.',
      references: ['Dorigo, W. et al. (2006). A new sensor for vegetation reflectance measurements. IEEE TGRS.']
    },
    {
      id: 'm2_s15',
      slideNumber: 15,
      title: 'Signal-to-Noise Ratio (SNR) Physics',
      category: 'Physics',
      keyTakeaway: 'SNR quantifies spectral measurement precision; it is wavelength-dependent and peaks in the VNIR, dropping in atmospheric absorption bands.',
      bullets: [
        'SNR = Mean Signal (S) / Standard Deviation of Noise (σ_N).',
        'Noise sources: Shot noise (Poisson statistics of photon arrival), Thermal dark noise, Readout noise, Digitization noise.',
        'Shot noise scales with the square root of signal: SNR_shot = S / √S = √S.'
      ],
      mathFormula: '\\text{SNR}(\\lambda) = \\frac{\\mu_S(\\lambda)}{\\sigma_N(\\lambda)} \\propto \\sqrt{N_{\\text{photons}}} \\propto \\sqrt{t_{\\text{integration}} \\cdot N_{\\text{scans}}}',
      formulaExplanation: 'SNR improves with the square root of the number of averaged scans.',
      speakerNotes: 'Explain why averaging 25 spectra improves SNR by a factor of 5 (√25 = 5), while averaging 100 scans improves it by 10.',
      references: ['Bevington, P. R., & Robinson, D. K. (2003). Data Reduction and Error Analysis for the Physical Sciences. McGraw-Hill.']
    },
    {
      id: 'm2_s16',
      slideNumber: 16,
      title: 'Spectral Averaging in Field Environments',
      category: 'Protocol',
      keyTakeaway: 'Averaging multiple consecutive scans suppresses random gaussian noise while preserving deterministic spectral signatures.',
      bullets: [
        'Standard operational protocol: Average 10 to 30 individual scans per stored sample spectrum.',
        'Dark current averaging: 25 to 50 scans for a noise-free dark offset subtraction.',
        'White reference averaging: 20 to 40 scans to ensure high-precision reference denominator.',
        'Target averaging: 15 to 30 scans balanced against target movement and solar drift.'
      ],
      practicalFieldNote: 'If wind causes canopy swaying, higher scan averaging blurs the signal across varying leaf angles.',
      speakerNotes: 'Teach the rule of diminishing returns: moving from 25 to 100 scans quadruples measurement time but only doubles SNR.',
      references: ['NERC FSF (2020). Standard Operating Procedures.']
    },
    {
      id: 'm2_s17',
      slideNumber: 17,
      title: 'Dark Current: Physics and Generation Mechanisms',
      category: 'Physics',
      keyTakeaway: 'Dark current is thermal electron-hole pair generation in the semiconductor depletion region occurring in complete darkness.',
      bullets: [
        'Dark current is strongly temperature dependent, doubling approximately every 6°C to 8°C in silicon and InGaAs.',
        'Dark current must be measured with an internal optical shutter closed and subtracted from every subsequent measurement.',
        'Uncorrected dark current drift introduces a systematic positive offset that distorts low-reflectance targets (e.g. water, shadow).'
      ],
      mathFormula: 'I_{\\text{dark}}(T) = A \\cdot T^2 \\cdot \\exp\\left(-\\frac{E_g}{2 k_B T}\\right)',
      formulaExplanation: 'Shockley-Read-Hall generation rate in semiconductor p-n junctions.',
      speakerNotes: 'Show the dark current count spectrum across the 2151 channels, highlighting the difference between cooled and uncooled detectors.',
      references: ['Sze, S. M. (2007). Physics of Semiconductor Devices.']
    },
    {
      id: 'm2_s18',
      slideNumber: 18,
      title: 'Stray Light & Optical Cross-Talk',
      category: 'Instrumentation',
      keyTakeaway: 'Scattered photons reflecting off internal spectrometer walls contaminate adjacent detector pixels, degrading spectral purity.',
      bullets: [
        'Stray light: Radiation of unwanted wavelength reaching a detector channel due to imperfect grating diffraction or wall scatter.',
        'Most severe in deep absorption bands (e.g. O₂ A-band at 760 nm or water bands) where true signal is near zero.',
        'Corrected using specialized stray light matrices calibrated with laser emission lines or cutoff filters.'
      ],
      speakerNotes: 'Explain how stray light leads to underestimation of deep absorption feature depths if not mathematically calibrated.',
      references: ['Zong, Y. et al. (2006). Simple method for stray-light correction on array spectroradiometers. Applied Optics, 45(6), 1111-1119.']
    },
    {
      id: 'm2_s19',
      slideNumber: 19,
      title: 'Temperature Sensitivity and Thermal Drift',
      category: 'QualityAssurance',
      keyTakeaway: 'Field ambient temperatures fluctuating from 15°C morning to 35°C afternoon induce internal mechanical and optical shifts.',
      bullets: [
        'Thermal expansion of optical bench alters diffraction grating angles and focal plane alignment (sub-nanometer wavelength drift).',
        'InGaAs detector responsivity shifts with temperature, especially near bandgap cutoff boundaries.',
        'Mitigation: Continuous monitoring of internal instrument thermistors and frequent white reference / dark current re-acquisitions.'
      ],
      practicalFieldNote: 'Keep the spectrometer body in the shade when operating in hot desert or summer environments.',
      speakerNotes: 'Highlight the built-in temperature logging in modern SVC and ASD instruments.',
      references: ['MacArthur, A. (2007). A field procedure to compensate for temperature drift in portable spectrometers. NERC FSF.']
    },
    {
      id: 'm2_s20',
      slideNumber: 20,
      title: 'Single-Beam vs. Dual-Beam Field Architecture',
      category: 'Instrumentation',
      keyTakeaway: 'Dual-beam instruments record target radiance and downwelling irradiance simultaneously, canceling temporal solar fluctuations.',
      bullets: [
        'Single-beam (Standard ASD/SVC): One optical head alternates sequentially between White Reference panel and target.',
        'Dual-beam (e.g. Dual ASD, PP-Systems, Unispec-DC): Two intercalibrated channels measure white reference / cosine diffuser and target at the exact same millisecond.',
        'Dual-beam eliminates error from moving clouds, but introduces complex inter-channel sensor cross-calibration challenges.'
      ],
      practicalFieldNote: 'In dual-beam setups, exchange fiber heads periodically over the reference panel to track inter-channel drift.',
      speakerNotes: 'Compare the operational trade-offs: single-beam is simpler and lighter; dual-beam is essential in variable temperate climates like the UK.',
      references: ['Milton, E. J. et al. (2009). Progress in field spectroscopy. Remote Sensing of Environment.']
    },
    {
      id: 'm2_s21',
      slideNumber: 21,
      title: 'Pistol Grips, Mounting Rigs and Tripods',
      category: 'Protocol',
      keyTakeaway: 'Rigid mechanical mounting eliminates operator hand-tremor, maintains nadir viewing geometry, and sets fixed sensor heights.',
      bullets: [
        'Handheld pistol grip: Convenient for rapid surveys, but prone to operator zenith tilt and operator shadow artifacts.',
        'Counterbalanced boom tripod: Holds foreoptic 2 to 3 meters away from the operator and metal legs, minimizing adjacency shadows.',
        'Integrated bubble levels and laser pointers: Ensure precise nadir alignment (θ_r = 0°) and target center verification.'
      ],
      practicalFieldNote: 'Always check the bubble level before triggering every scan. A 10° tilt completely invalidates BRDF assumptions.',
      speakerNotes: 'Show photos of well-designed field boom arms versus sloppy handheld operator practices.',
      references: ['NERC FSF (2020). Operations Manual.']
    },
    {
      id: 'm2_s22',
      slideNumber: 22,
      title: 'Spectralon® White Reference Reflectance Standards',
      category: 'QualityAssurance',
      keyTakeaway: 'Sintered polytetrafluoroethylene (PTFE) provides > 99% diffuse Lambertian reflectance from 350 to 1600 nm (> 95% to 2500 nm).',
      bullets: [
        'Manufactured by Labsphere: Porous, sintered thermoplastic with isotropic bulk volume scattering.',
        'High thermal and chemical stability; impervious to water (hydrophobic).',
        'Certified by NIST with a calibration certificate listing exact spectral reflectance factors at 50 nm intervals.'
      ],
      practicalFieldNote: 'Never touch the active white surface of a Spectralon panel with bare fingers or let dust accumulate.',
      speakerNotes: 'Explain the microscopic porous structure of PTFE that creates almost perfect diffuse scattering through multiple internal refractions.',
      references: ['Labsphere Inc. (2018). Spectralon Diffuse Reflectance Standards and Targets Technical Guide.']
    },
    {
      id: 'm2_s23',
      slideNumber: 23,
      title: 'White Reference Degradation and Contamination',
      category: 'QualityAssurance',
      keyTakeaway: 'Panel contamination by skin oils, dust, and UV photochemical yellowing degrades short-wavelength reflectance.',
      bullets: [
        'Hydrocarbon contamination (fingerprints, volatile organics) creates deep C-H absorption bands in the SWIR (1200, 1720, 2300 nm).',
        'UV solarization causes yellowing, dropping blue/UV reflectance from 99% down to 92%.',
        'A contaminated reference panel makes targets appear artificially high in reflectance (apparent reflectance > 100%).'
      ],
      practicalFieldNote: 'Store reference panels in clean desiccated cases and clean annually with waterproof emery sandpaper under deionized water.',
      speakerNotes: 'Demonstrate how to re-sand and clean a Spectralon panel according to Labsphere instructions.',
      references: ['MacArthur, A. et al. (2012). The calibration and characterization of field spectrometers. NERC FSF.']
    },
    {
      id: 'm2_s24',
      slideNumber: 24,
      title: 'Spectral Transmittance & Absorbance Measurement Modes',
      category: 'Instrumentation',
      keyTakeaway: 'Spectroradiometers can measure transmittance (T) and absorbance (A) in addition to reflectance using specialized accessories.',
      bullets: [
        'Transmittance: Attaching an integrating sphere allows measurement of total directional-hemispherical transmittance of single leaves.',
        'Absorbance: A = 1 - R - T (by conservation of energy in non-scattering systems).',
        'Essential for calibrating leaf radiative transfer models like PROSPECT which require both leaf reflectance (ρ) and transmittance (τ).'
      ],
      mathFormula: 'A(\\lambda) + R(\\lambda) + T(\\lambda) = 1.0',
      formulaExplanation: 'First law of thermodynamics applied to radiant energy conservation.',
      speakerNotes: 'Explain why measuring only leaf reflectance is insufficient to parameterize PROSPECT; leaf transmittance is equally critical.',
      references: ['Jacquemoud, S., & Ustin, S. L. (2019). Leaf Optical Properties. Cambridge University Press.']
    },
    {
      id: 'm2_s25',
      slideNumber: 25,
      title: 'Integrating Spheres in Field Spectroscopy',
      category: 'Instrumentation',
      keyTakeaway: 'Integrating spheres collect all scattered light across the entire 4π or 2π hemisphere, enabling pure hemispherical measurements.',
      bullets: [
        'Hollow sphere coated internally with highly reflective diffuse Spectralon or Zenith coating.',
        'Multiple internal diffuse reflections homogenize radiation uniformly over the inner wall area.',
        'Measures directional-hemispherical reflectance factor (DHRF) and directional-hemispherical transmittance factor (DHTF).'
      ],
      speakerNotes: 'Discuss field-portable integrating spheres (e.g. ASD RTS-3ZC, SVC LC-RP Pro).',
      references: ['Labsphere Inc. (2015). Integrating Sphere Theory and Applications.']
    },
    {
      id: 'm2_s26',
      slideNumber: 26,
      title: 'Calibration Files & Raw Digital Numbers to Radiance',
      category: 'Processing',
      keyTakeaway: 'Conversion from raw digital numbers to physical spectral radiance requires the instrument calibration coefficient file.',
      bullets: [
        'Each instrument possesses a factory-calibrated responsivity vector: R_cal(λ) [DN / (W m⁻² sr⁻¹ nm⁻¹)].',
        'Radiance: L(λ) = (DN(λ) - DN_dark(λ)) / (t_int · R_cal(λ)).',
        'When computing relative reflectance against a white reference, R_cal(λ) cancels out in the ratio, which is why reflectance is robust against absolute calibration drift.'
      ],
      mathFormula: '\\rho(\\lambda) = \\frac{L_{\\text{target}}(\\lambda)}{L_{\\text{ref}}(\\lambda)} \\cdot \\rho_{\\text{ref}}(\\lambda) = \\frac{\\frac{\\text{DN}_{\\text{t}} - \\text{DN}_{\\text{d}}}{t_{\\text{int,t}} \\cdot R_{\\text{cal}}}}{\\frac{\\text{DN}_{\\text{r}} - \\text{DN}_{\\text{d}}}{t_{\\text{int,r}} \\cdot R_{\\text{cal}}}} \\cdot \\rho_{\\text{ref}}(\\lambda)',
      formulaExplanation: 'Cancellation of absolute responsivity R_cal in the reflectance ratio calculation.',
      speakerNotes: 'Point out why reflectance can be measured accurately in the field even if absolute radiometric calibration has decayed by 10%.',
      references: ['Milton, E. J. (1987). International Journal of Remote Sensing.']
    },
    {
      id: 'm2_s27',
      slideNumber: 27,
      title: 'Power Systems, Battery Care & Thermal Management',
      category: 'QualityAssurance',
      keyTakeaway: 'Stable battery voltage is crucial to avoid baseline electronic shifts in Peltier cooling and InGaAs detector amplifiers.',
      bullets: [
        'Lithium iron phosphate (LiFePO4) or high-capacity lithium-ion field battery packs.',
        'Voltage drops below operating threshold induce subtle noise spikes and premature instrument shutdown.',
        'Always carry at least two fully charged spare batteries and an in-field 12V DC vehicle charging adapter.'
      ],
      practicalFieldNote: 'Cold weather (< 5°C) reduces lithium battery capacity by up to 40%; keep spare batteries inside thermal jackets.',
      speakerNotes: 'Share field horror stories of spending two hours hiking to a remote field site only to find dead batteries.',
      references: ['NERC FSF (2020). Operational Field Guide.']
    },
    {
      id: 'm2_s28',
      slideNumber: 28,
      title: 'Software Interfaces: RS3, SVC PC, and SAMS',
      category: 'Instrumentation',
      keyTakeaway: 'Instrument control software handles auto-integration, dark current acquisition, spectral logging, and real-time QA displays.',
      bullets: [
        'ASD RS3 / Indico Pro: Real-time graphical display of DN, radiance, and reflectance; automated splice correction.',
        'SVC PC Software: Manages Bluetooth telemetry, automated camera integration, and internal file conversions.',
        'SAMS (Simple Automated Measurement Software): Open-source automated field spectroscopy collection suite.'
      ],
      speakerNotes: 'Show the live software GUI and highlight the key indicators students must watch during active data capture.',
      references: ['Analytical Spectral Devices (2012). RS3 User Manual.']
    },
    {
      id: 'm2_s29',
      slideNumber: 29,
      title: 'Case Study: Point Spectrometry in Mineral Exploration',
      category: 'CaseStudy',
      keyTakeaway: 'Point spectroscopy in the Atacama desert demonstrates rapid mineral mapping of hydrothermal alteration zones.',
      bullets: [
        'Hydrothermal porphyry copper deposits exhibit concentric alteration halos: potassic, phyllic, argillic, propylitic.',
        'Field spectroradiometers identify white mica Al-OH composition shifts (2198 nm sodic paragonite vs 2206 nm potassic muscovite vs 2220 nm phengite).',
        'Wavelength shifts correlate directly with paleofluid temperatures and proximity to ore bodies.'
      ],
      speakerNotes: 'Present the geological cross-section and show how 500 point spectra mapped the entire hydrothermal alteration gradient.',
      references: ['Thompson, A. J. B. et al. (1999). Alteration mapping in exploration: application of short-wave infrared (SWIR) spectroscopy. SEG Newsletter.']
    },
    {
      id: 'm2_s30',
      slideNumber: 30,
      title: 'Module 2 Summary & Transition to Calibration Protocols',
      category: 'Instrumentation',
      keyTakeaway: 'Hardware architecture dictates data quality: numerical aperture, gratings, detector cooling, and ADC dynamic range.',
      bullets: [
        'Module 2 reviewed: Optical layout, fiber cables, silicon vs InGaAs detectors, Spectralon white references, and SNR optimization.',
        'Next in Module 3: Laboratory calibration, wavelength standards (Mercury-Argon), radiometric calibration with integrating spheres, and uncertainty budgets.',
        'Laboratory practical: Processing raw binary spectroradiometer files, removing detector steps, and computing SNR curves.'
      ],
      speakerNotes: 'Wrap up hardware lecture, confirm understanding of detector bandgap limits and fiber care.',
      references: ['Milton, E. J. et al. (2009). Remote Sensing of Environment, 113, S92-S109.']
    }
  ];
}

export const MODULE_2: CourseModule = {
  id: 'module_2',
  moduleNumber: 2,
  title: 'Fundamentals of Point Spectroradiometers & Hardware Architecture',
  shortTitle: 'Point Spectroradiometers',
  subtitle: 'Optical layouts, fiber optics, gratings, silicon/InGaAs detectors, White Reference panels, and SNR physics',
  durationHours: 4,
  ectsCredits: 1.5,
  abstract: 'Module 2 deconstructs the internal physics, mechanical design, and electronic subsystems of commercial field spectroradiometers (ASD FieldSpec, SVC HR-1024, Spectral Evolution PSR+). Students analyze entrance foreoptics, fiber optic bundle numerical apertures, holographic diffraction gratings, order-sorting filters, and detector technologies spanning silicon photodiode arrays (VNIR) and thermoelectrically cooled InGaAs detectors (SWIR-1 and SWIR-2). The module details integration time optimization, dark current compensation, Spectralon reference standards, detector junction splice steps, and signal-to-noise ratio (SNR) modeling.',
  coreCompetencies: [
    'Analyze the internal optical bench and photon path through a multi-detector field spectroradiometer.',
    'Calculate angular fields of view (FOV), numerical aperture, and ground footprint diameters.',
    'Formulate signal-to-noise ratio (SNR) scaling laws as a function of integration time and scan averaging.',
    'Identify and mathematically correct detector junction steps at 1000 nm and 1800 nm.',
    'Implement proper handling, cleaning, and calibration validation protocols for Spectralon PTFE panels.'
  ],
  slides: generateModule2Slides(),
  fieldExercise: {
    title: 'Field Exercise 2: Instrument Familiarization, White Reference Calibration & Target Footprint Analysis',
    estimatedDuration: '3.5 hours',
    targetEnvironment: 'Outdoor campus quad with multiple land cover patches (grass, concrete, asphalt, tree canopy, soil)',
    recommendedInstruments: ['ASD FieldSpec 4 or SVC HR-1024i Spectroradiometer', 'Calibrated 99% Spectralon Panel (5" or 10")', 'Foreoptics (Bare fiber 25°, 8° lens, and plant probe)', 'Adjustable heavy-duty tripod with bubble level and boom arm'],
    safetyAndPreTripChecklist: [
      'Inspect fiber optic sheath for kinks, pinching, or cracks before leaving the instrument lab.',
      'Check internal battery charge (> 80%) and verify that spare battery is fully charged.',
      'Allow instrument 15-minute warmup time for InGaAs detector Peltier coolers to reach operating temperature (-20°C).',
      'Verify calibration file timestamp matches the serial number of the attached fiber cable.'
    ],
    fieldProtocolSteps: [
      {
        stepNumber: 1,
        action: 'Power on the spectrometer and observe the internal temperature readouts until stable detector temperatures are achieved.',
        scientificRationale: 'InGaAs dark current and responsivity fluctuate violently during thermal stabilization.',
        commonErrorToAvoid: 'Beginning data acquisition immediately upon power-up without allowing detector temperature lock.'
      },
      {
        stepNumber: 2,
        action: 'Place the Spectralon white reference panel horizontally on a level tripod, aim the 25° foreoptic at nadir from 30 cm height, and trigger auto-optimization.',
        scientificRationale: 'Optimizes integration time so peak counts reach 75–85% of 16-bit ADC saturation without clipping.',
        commonErrorToAvoid: 'Optimizing on a dark grass target, causing the instrument to saturate catastrophically when aimed at the white reference.'
      },
      {
        stepNumber: 3,
        action: 'Acquire Dark Current (DC), then White Reference (WR), and immediately record a second scan of the same WR panel without moving.',
        scientificRationale: 'The second WR scan must evaluate to a flat 100% line across 400–2400 nm; any deviation reveals instrument noise or cloud drift.',
        commonErrorToAvoid: 'Proceeding to target measurement when the WR baseline test deviates by > 1.5% from unity.'
      },
      {
        stepNumber: 4,
        action: 'Measure grass target at heights of 0.5 m, 1.0 m, and 1.5 m with bare fiber (25°) and with 8° foreoptic lens.',
        scientificRationale: 'Empirically verifies the circular footprint expansion formula and illustrates spatial integration of mixed surface components.',
        commonErrorToAvoid: 'Standing on the illuminated side of the target; the operator must stand opposite or perpendicular to the solar azimuth.'
      }
    ],
    dataRecordingSheetFields: [
      'File Name / Scan ID',
      'Target Description',
      'Foreoptic Attached (Bare 25° / 8° Lens / Plant Probe)',
      'Sensor Height h (m)',
      'Calculated Footprint Diameter (cm)',
      'Integration Time (ms)',
      'WR Check Linearity (Max % departure from 1.0)',
      'Detector Temperatures (°C)',
      'Operator Initials'
    ],
    fieldDeliverable: 'Submit raw spectrometer data files alongside an analysis comparing the 100% WR check quality, SNR comparisons between 10 vs 50 scan averages, and footprint scaling effects.'
  },
  practicalLab: {
    title: 'Practical Lab 2: Processing Raw Binary Spectroradiometer Files & Correcting Detector Steps in Python and R',
    softwareEnvironment: 'Hybrid (Python & R)',
    primaryPackages: ['specdal (Python)', 'pysptools', 'numpy', 'matplotlib', 'hsdar (R)'],
    learningObjectives: [
      'Parse binary and ASCII spectroradiometer file formats (.asd, .sig, .sed).',
      'Calculate signal-to-noise ratio (SNR) across contiguous spectral channels.',
      'Implement an automated splice-correction algorithm for detector boundary steps at 1000 nm and 1800 nm.',
      'Convolve field spectra to satellite multispectral bands (Sentinel-2 MSI and Landsat-8 OLI).'
    ],
    sampleDataset: {
      name: 'ASD_FieldSpec_Raw_Vegetation_Soil_Scans.asd',
      description: 'Collection of 40 raw ASD FieldSpec 4 files containing uncalibrated DN, radiance, and reflectance curves with deliberate splice steps at 1000 nm and 1800 nm.',
      spectralRange: '350 - 2500 nm',
      sensor: 'ASD FieldSpec 4 Hi-Res (Serial #18234)',
      bandsCount: 2151
    },
    codeSnippets: [
      {
        language: 'python',
        title: 'Python: Automated Splice Correction for ASD Spectroradiometer Boundary Steps',
        description: 'Detects and removes artificial step discontinuities at 1000 nm (VNIR/SWIR1) and 1800 nm (SWIR1/SWIR2).',
        code: `import numpy as np
import matplotlib.pyplot as plt

def correct_asd_splices(wavelengths, reflectance, splice1=1000, splice2=1800):
    """
    Corrects detector junction discontinuities in ASD field spectra.
    VNIR is held as reference; SWIR1 and SWIR2 are scaled multiplicatively.
    """
    corr_refl = reflectance.copy()
    
    # Locate index positions around splice 1 (1000 nm)
    idx_v_end = np.where(wavelengths <= splice1)[0][-1]
    idx_s1_start = idx_v_end + 1
    
    # Calculate multiplicative step ratio across 1000 nm boundary
    ratio_splice1 = corr_refl[idx_v_end] / corr_refl[idx_s1_start]
    
    # Locate index positions around splice 2 (1800 nm)
    idx_s1_end = np.where(wavelengths <= splice2)[0][-1]
    idx_s2_start = idx_s1_end + 1
    
    # Apply correction to SWIR1 region (splice1 to splice2)
    corr_refl[idx_s1_start:idx_s2_start] *= ratio_splice1
    
    # Calculate step ratio across 1800 nm boundary using updated SWIR1
    ratio_splice2 = corr_refl[idx_s1_end] / corr_refl[idx_s2_start]
    
    # Apply cumulative correction to SWIR2 region
    corr_refl[idx_s2_start:] *= ratio_splice2
    
    return corr_refl, ratio_splice1, ratio_splice2

# Generate synthetic raw uncorrected spectrum with typical 6% and 4% jumps
wl = np.arange(350, 2501, 1)
raw_refl = 0.1 + 0.35 / (1 + np.exp(-0.04 * (wl - 715))) # Sigmoid vegetation curve
# Introduce artificial detector splice shifts
raw_refl[wl > 1000] *= 0.940 # -6% jump at SWIR1
raw_refl[wl > 1800] *= 0.965 # -3.5% jump at SWIR2

cleaned_refl, r1, r2 = correct_asd_splices(wl, raw_refl)

print(f"Applied SWIR1 splice adjustment factor at 1000 nm: {r1:.4f}")
print(f"Applied SWIR2 splice adjustment factor at 1800 nm: {r2:.4f}")
`
      },
      {
        language: 'r',
        title: 'R Script: Computing Wavelength-Dependent SNR and Spectral Averaging Gains',
        description: 'Analyzes 20 repeated scans over a steady target, calculates empirical SNR across 2151 bands, and validates the square-root averaging law.',
        code: `# Principles of Field Spectroscopy: MSc Lab 2
# Signal-to-Noise Ratio (SNR) Analysis in R

calculate_spectral_snr <- function(spectra_matrix) {
  # spectra_matrix: rows = repeated scans (N=20), columns = wavelengths (2151)
  mean_signal <- colMeans(spectra_matrix, na.rm=TRUE)
  noise_sigma <- apply(spectra_matrix, 2, sd, na.rm=TRUE)
  
  # Avoid division by zero in noise floor
  noise_sigma[noise_sigma == 0] <- NA
  snr <- mean_signal / noise_sigma
  return(data.frame(Mean=mean_signal, Noise=noise_sigma, SNR=snr))
}

# Simulate 25 repeated field scans of a 99% Spectralon panel with realistic noise
set.seed(42)
n_scans <- 25
n_channels <- 2151
wavelengths <- seq(350, 2500, by=1)

# Baseline signal + wavelength-dependent shot and thermal noise
base_signal <- 40000 * exp(-0.0003 * (wavelengths - 500)^2)
sim_data <- matrix(nrow=n_scans, ncol=n_channels)

for (i in 1:n_scans) {
  # Shot noise scales as sqrt(signal); thermal noise is constant
  noise <- rnorm(n_channels, mean=0, sd=sqrt(pmax(base_signal, 10)) + 15)
  sim_data[i, ] <- base_signal + noise
}

res <- calculate_spectral_snr(sim_data)
cat("Peak SNR at 650 nm (VNIR):", round(max(res$SNR[wavelengths >= 600 & wavelengths <= 700], na.rm=TRUE), 1), ": 1\\n")
cat("Minimum SNR in Water Vapor Band (1400 nm):", round(min(res$SNR[wavelengths >= 1380 & wavelengths <= 1420], na.rm=TRUE), 1), ": 1\\n")
`
      }
    ],
    studentTasks: [
      'Write a Python function to read raw .asd binary files and extract the metadata header (integration time, GPS coordinates, dark current subtract flag).',
      'Compute the empirical SNR curve across all 2151 channels for 10 scans vs 50 scans and prove that SNR scales with sqrt(N).',
      'Convolve an ASD high-resolution field spectrum with Sentinel-2 MSI Spectral Response Functions (SRF) for Bands 2, 3, 4, 8, 11, and 12.'
    ],
    expectedOutputSummary: 'Students produce clean Python/R scripts that automatically batch-process raw field spectra, execute splice corrections, output quality flags, and resample field signatures to satellite band passes.'
  },
  quiz: {
    moduleNumber: 2,
    title: 'Module 2 Automated Assessment: Point Spectroradiometers & Hardware',
    passingScorePercent: 80,
    questions: [
      {
        id: 'm2_q1',
        question: 'Why does an ASD FieldSpec or SVC spectroradiometer switch from silicon photodiode arrays to Indium Gallium Arsenide (InGaAs) detectors above ~1000 nm?',
        options: [
          'Because silicon cannot withstand the thermal heat of infrared wavelengths.',
          'Because the bandgap energy of silicon (1.12 eV) cannot absorb photons with wavelengths longer than ~1100 nm.',
          'Because InGaAs detectors are immune to dark current noise.',
          'Because diffraction gratings can only disperse light onto InGaAs crystals in vacuum.'
        ],
        correctOptionIndex: 1,
        explanation: 'Silicon has a bandgap of ~1.12 eV. Photons with wavelength λ > hc/Eg ≈ 1100 nm do not possess sufficient energy to excite electrons into the conduction band, requiring a narrower-bandgap semiconductor like InGaAs.',
        academicCitation: 'Sze, S. M. (2007). Physics of Semiconductor Devices.'
      },
      {
        id: 'm2_q2',
        question: 'What is the primary operational consequence of bending a spectrometer fiber optic cable tighter than its recommended minimum bend radius in the field?',
        options: [
          'It permanently switches the diffraction grating order from m=1 to m=2.',
          'It causes micro-bend optical losses and transient transmission variations that distort the calibration ratio.',
          'It causes instant electrical short-circuits in the photodiode array.',
          'It increases the numerical aperture of the entrance slit.'
        ],
        correctOptionIndex: 1,
        explanation: 'Excessive mechanical bending alters internal total reflection angles within the silica fibers, causing bend-loss attenuation and inducing calibration drift.',
        academicCitation: 'NERC FSF (2020). Best Practice Manual for Field Spectroradiometry.'
      },
      {
        id: 'm2_q3',
        question: 'If a single field scan provides a signal-to-noise ratio (SNR) of 200:1 at 650 nm, how many scans must be averaged to achieve an SNR of 1000:1, assuming purely uncorrelated random noise?',
        options: [
          '5 scans',
          '10 scans',
          '25 scans',
          '100 scans'
        ],
        correctOptionIndex: 2,
        explanation: 'SNR scales with the square root of the number of averaged scans: SNR_new = SNR_0 · √N. To increase SNR by 5x (from 200 to 1000), N must be 5² = 25 scans.',
        academicCitation: 'Bevington, P. R., & Robinson, D. K. (2003). Data Reduction and Error Analysis.'
      },
      {
        id: 'm2_q4',
        question: 'What physical artifact causes the characteristic step/jump observed at 1000 nm and 1800 nm in uncorrected ASD FieldSpec spectra?',
        options: [
          'Atmospheric ozone absorption in the Chappuis band.',
          'Small spatial footprint and responsivity misalignments at the optical junction between physically separate VNIR, SWIR1, and SWIR2 detector arrays.',
          'Rapid desiccation of the Spectralon white reference panel.',
          'Quantization truncation in the 16-bit analog-to-digital converter.'
        ],
        correctOptionIndex: 1,
        explanation: 'Three separate gratings and detector arrays receive light through randomized fiber optic sub-bundles; slight differences in spatial alignment and temperature-induced dark drift create step discontinuities at the 1000 nm and 1800 nm boundaries.',
        academicCitation: 'Dorigo, W. et al. (2006). IEEE TGRS.'
      },
      {
        id: 'm2_q5',
        question: 'Why should an operator never optimize integration time on a dark ground target (such as moist soil or deep water) before measuring a white reference panel?',
        options: [
          'Because the instrument will lock the Peltier coolers permanently.',
          'Because the auto-optimization algorithm will set an excessively long integration time that will saturate (> 65535 counts) when pointed at the 99% white reference.',
          'Because the dark target will permanently burn the silicon photodiode pixels.',
          'Because the fiber optic cable will overheat from back-scattered photons.'
        ],
        correctOptionIndex: 1,
        explanation: 'Dark targets reflect minimal photons. Optimizing on them sets a very long integration time. Pointing subsequently at a bright 99% Spectralon panel will saturate the ADC.',
        academicCitation: 'ASD Inc. (2010). FieldSpec 4 User Manual.'
      }
    ]
  },
  keyReferences: [
    {
      authors: 'Curtiss, B., & Goetz, A. F.',
      year: 1994,
      title: 'Field spectrometry: Techniques and instrumentation',
      journalOrPublisher: 'Proceedings of the International Symposium on Spectral Sensing Research (ISSSR), San Diego, CA'
    },
    {
      authors: 'MacArthur, A., MacLellan, C., & Malthus, T.',
      year: 2012,
      title: 'The calibration and characterization of field spectrometers',
      journalOrPublisher: 'NERC Field Spectroscopy Facility Guides, Edinburgh, UK'
    },
    {
      authors: 'Dorigo, W., Bicheron, P., Cain, F., & Prévot, L.',
      year: 2006,
      title: 'A new sensor for vegetation reflectance measurements: Evaluation and calibration',
      journalOrPublisher: 'IEEE Transactions on Geoscience and Remote Sensing, 44(8), 2110-2119'
    }
  ]
};
