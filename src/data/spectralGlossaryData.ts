import type { GlossaryTerm, GlossaryCategory } from '../types';

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  'Radiometry',
  'Instrumentation',
  'Field Protocols',
  'RTM & Indices',
  'Physics & Atmospheric',
  'Cal/Val & Quality'
];

export const SPECTRAL_GLOSSARY: GlossaryTerm[] = [
  {
    id: 'radiance',
    term: 'Radiance',
    aliases: ['radiance', 'spectral radiance', 'radiant flux density per unit solid angle', 'radiant radiance', 'radiometric radiance'],
    symbol: 'L_\\lambda',
    units: '\\text{W} \\cdot \\text{m}^{-2} \\cdot \\text{sr}^{-1} \\cdot \\text{nm}^{-1}',
    category: 'Radiometry',
    shortDefinition: 'Radiant power emitted, reflected, or transmitted by a surface per unit projected source area per unit solid angle in a specified direction.',
    fullDefinition: 'Spectral radiance is the fundamental directional radiometric quantity measured by optical spectroradiometers with directional foreoptics. It quantifies radiant energy passing through or emerging from an element of surface and propagated in directions confined to an elemental cone containing the specified direction, divided by the projected area of the surface normal to that direction and by the solid angle of the cone.',
    mathFormula: 'L_{\\lambda}(\\theta, \\phi) = \\frac{\\mathrm{d}^2 \\Phi_{\\lambda}}{\\mathrm{d}A \\cos\\theta \\cdot \\mathrm{d}\\Omega}',
    formulaExplanation: '\\Phi_\\lambda is spectral radiant flux (W), A is surface area (m²), \\theta is zenith angle relative to the surface normal, and \\Omega is solid angle (steradians, sr).',
    fieldImplication: 'Spectroradiometers (like ASD FieldSpec or SVC) measure target radiance L_target and panel radiance L_ref through a calibrated foreoptic with known field of view (FOV). Variations in viewing geometry or distance to the target alter the footprint area but not the intrinsic radiance of a uniform surface.',
    standardOrAuthority: 'ISO 80000-7 / CEOS WGCV Cal/Val Guideline',
    relatedTermIds: ['irradiance', 'brdf', 'reflectance_factor', 'lambertian', 'fov'],
    keyExample: 'Measuring canopy upwelling radiance at nadir (θ = 0°) under direct sunlit clear-sky conditions.'
  },
  {
    id: 'irradiance',
    term: 'Irradiance',
    aliases: ['irradiance', 'spectral irradiance', 'downwelling irradiance', 'solar irradiance', 'total irradiance'],
    symbol: 'E_\\lambda',
    units: '\\text{W} \\cdot \\text{m}^{-2} \\cdot \\text{nm}^{-1}',
    category: 'Radiometry',
    shortDefinition: 'Total radiant flux received by a surface per unit surface area over an entire 2π steradian hemisphere.',
    fullDefinition: 'Spectral irradiance quantifies the radiant power incident on an element of surface per unit area over all incident directions of the upper hemisphere. In field spectroscopy, downwelling solar irradiance consists of direct beam extraterrestrial sunlight attenuated by the atmosphere plus diffuse skylight scattered by atmospheric molecules and aerosols.',
    mathFormula: 'E_{\\lambda} = \\int_{2\\pi} L_{\\lambda}(\\theta_i, \\phi_i) \\cos\\theta_i \\, \\mathrm{d}\\Omega_i = E_{\\text{dir},\\lambda} \\cos\\theta_s + E_{\\text{diff},\\lambda}',
    formulaExplanation: '\\theta_i and \\phi_i are incident zenith and azimuth angles, \\theta_s is the solar zenith angle, and E_{diff} is the hemispherical integrated diffuse skylight.',
    fieldImplication: 'Irradiance changes continuously during outdoor field campaigns with changing solar zenith angle, diurnal atmospheric vapor drift, and transient thin cirrus clouds. When using a Spectralon reference panel, downwelling irradiance is determined by E_\\lambda = \\pi \\cdot L_{\\text{panel}}(\\lambda) / R_{\\text{panel}}(\\lambda).',
    standardOrAuthority: 'Nicodemus et al. (1977) / CIE 17.4',
    relatedTermIds: ['radiance', 'cosine_receptor', 'lambertian', 'spectralon'],
    keyExample: 'Measuring global downwelling irradiance on a 180° cosine receptor or measuring a horizontal 99% Spectralon panel.'
  },
  {
    id: 'brdf',
    term: 'BRDF',
    aliases: ['brdf', 'bidirectional reflectance distribution function', 'b.r.d.f.', 'bidirectional reflectance', 'directional reflectance'],
    symbol: 'f_r(\\theta_i, \\phi_i; \\theta_r, \\phi_r; \\lambda)',
    units: '\\text{sr}^{-1}',
    category: 'Radiometry',
    shortDefinition: 'Derivative ratio of reflected spectral radiance in an outgoing direction to incident spectral irradiance from a collimated direction.',
    fullDefinition: 'The Bidirectional Reflectance Distribution Function (BRDF), formalized by Fred Nicodemus in 1977, describes the fundamental directional scattering properties of an optically opaque surface. It specifies how incoming directional irradiance from illumination angles (θ_i, φ_i) is scattered into outgoing observation angles (θ_r, φ_r). Because it represents an infinitesimal direction for both incident and reflected rays, BRDF cannot be measured directly in the real world without finite solid-angle integration.',
    mathFormula: 'f_r(\\theta_i, \\phi_i; \\theta_r, \\phi_r; \\lambda) = \\frac{\\mathrm{d}L_r(\\theta_r, \\phi_r; \\lambda)}{\\mathrm{d}E_i(\\theta_i, \\phi_i; \\lambda)}',
    formulaExplanation: 'dL_r is differential reflected radiance in direction (θ_r, φ_r) and dE_i is differential incident irradiance from direction (θ_i, φ_i). Dimensions are per steradian (sr⁻¹).',
    fieldImplication: 'Natural vegetative and soil targets exhibit strong non-Lambertian anisotropy: "hotspot" backscatter occurs when viewing parallel to the sun illumination vector (zero phase angle, hiding shadows), while forward specular scattering occurs over wet soils and specular leaf cuticles. True field measurements yield HDRF (Hemispherical-Directional Reflectance Factor), not pure BRDF.',
    standardOrAuthority: 'Nicodemus et al. (1977), NBS Monograph 160',
    relatedTermIds: ['radiance', 'irradiance', 'reflectance_factor', 'hdrf', 'lambertian'],
    keyExample: 'Goniometer measurements using a FIGIFIGO or dual-arm goniometer at varying solar zenith and view zenith angles.'
  },
  {
    id: 'hdrf',
    term: 'HDRF',
    aliases: ['hdrf', 'hemispherical directional reflectance factor', 'hemispherical-directional reflectance factor'],
    symbol: 'R_{\\text{HDRF}}(\\theta_v, \\phi_v; \\lambda)',
    units: '\\text{Dimensionless (or %)}',
    category: 'Radiometry',
    shortDefinition: 'Ratio of target radiance in a specific view direction under ambient hemispherical illumination to radiance from an ideal lossless Lambertian reflector.',
    fullDefinition: 'Hemispherical-Directional Reflectance Factor (HDRF) is the actual radiometric quantity obtained during in-situ field spectroscopy when measuring under natural ambient sky illumination. Because the incoming light consists of both direct solar beam and diffuse sky irradiance across the hemisphere, the measured directional reflection is governed by the integrated BRDF weighted by the downwelling angular sky radiance.',
    mathFormula: 'R_{\\text{HDRF}} = \\frac{L_{\\text{target}}(\\theta_v, \\phi_v)}{\\frac{1}{\\pi} E_{\\text{total}}} = \\frac{L_{\\text{target}}(\\lambda)}{L_{\\text{white\\_ref}}(\\lambda)} \\times R_{\\text{panel}}(\\lambda)',
    formulaExplanation: 'L_target is target radiance, E_total is total downwelling irradiance, and R_panel is the calibrated reflectance certificate of the white reference standard.',
    fieldImplication: 'HDRF varies with cloud cover, atmospheric aerosol optical depth, and solar elevation because the ratio of direct-to-diffuse illumination changes the angular weighting of the target BRDF. Consistent sunlit windows (±2 hours of solar noon) minimize HDRF divergence.',
    standardOrAuthority: 'Schaepman-Strub et al. (2006), Remote Sens. Environ.',
    relatedTermIds: ['brdf', 'bhr', 'reflectance_factor', 'spectralon'],
    keyExample: 'A hand-held spectroradiometer pistol grip pointing nadir at a crop canopy at 11:30 AM.'
  },
  {
    id: 'bhr',
    term: 'BHR (Albedo)',
    aliases: ['bhr', 'bi-hemispherical reflectance', 'bihemispherical reflectance', 'spherical albedo', 'white sky albedo'],
    symbol: 'r_{\\text{BHR}}(\\lambda)',
    units: '\\text{Dimensionless (0.0 to 1.0)}',
    category: 'Radiometry',
    shortDefinition: 'Ratio of total radiant flux reflected into the entire hemisphere to total radiant flux incident from the entire hemisphere; completely diffuse albedo.',
    fullDefinition: 'Bi-hemispherical Reflectance (BHR) represents the spatial integration of reflected radiance over all viewing directions divided by the hemispherical integration of all incident irradiance directions. In Earth observation and climate modelling, BHR is commonly termed "white-sky albedo" under completely overcast isotropic conditions.',
    mathFormula: 'r_{\\text{BHR}}(\\lambda) = \\frac{1}{\\pi} \\int_{2\\pi} \\int_{2\\pi} f_r(\\theta_i, \\phi_i; \\theta_r, \\phi_r) \\cos\\theta_i \\cos\\theta_r \\, \\mathrm{d}\\Omega_i \\, \\mathrm{d}\\Omega_r',
    formulaExplanation: 'Double hemispherical integration of the bidirectional reflectance distribution function over all illumination and view hemispheres.',
    fieldImplication: 'Integrating spheres with interior diffuse coatings (such as barium sulfate or Spectralon) measure BHR by capturing all forward and backward scattered photons from leaf samples.',
    standardOrAuthority: 'CEOS Land Product Validation (LPV) Protocol',
    relatedTermIds: ['brdf', 'hdrf', 'reflectance_factor'],
    keyExample: 'Total surface albedo calculated for energy balance studies from tower pyranometers or integrated hyperspectral fluxes.'
  },
  {
    id: 'spectralon',
    term: 'Spectralon',
    aliases: ['spectralon', 'ptfe panel', 'white reference panel', 'diffuse reference standard', 'sintered ptfe'],
    symbol: 'R_{\\text{ref}}(\\lambda)',
    units: '\\sim 99\\% \\text{ Reflectance (350–1600 nm)}',
    category: 'Instrumentation',
    shortDefinition: 'Thermoplastic sintered polytetrafluoroethylene (PTFE) standard offering near-ideal Lambertian diffuse reflectance of >99% across VNIR.',
    fullDefinition: 'Spectralon (manufactured by Labsphere) is the international standard diffuse reflectance material used for field spectroradiometer calibration and white referencing. Sintered PTFE has an open, porous microstructure that produces volume internal multiple-scattering, resulting in near-Lambertian behavior with high spatial uniformity and minimal spectral absorption from 350 nm through 1600 nm (>95% out to 2500 nm).',
    mathFormula: 'R_{\\text{target}}(\\lambda) = \\frac{\\text{DN}_{\\text{target}}(\\lambda) - \\text{DN}_{\\text{dark}}(\\lambda)}{\\text{DN}_{\\text{spectralon}}(\\lambda) - \\text{DN}_{\\text{dark}}(\\lambda)} \\times R_{\\text{cert}}(\\lambda)',
    formulaExplanation: 'DN is raw detector digital number, DN_dark is dark current offset, and R_cert is factory laboratory calibration factor certificate.',
    fieldImplication: 'Contamination from hand oils, airborne dust, soil contact, or water droplets significantly degrades UV and SWIR reflectance. Panels must be kept in protective cases, leveled horizontally in the field with bubble levels, never touched by bare skin, and cleaned by gentle sanding with 220-grit waterproof emery paper in deionized water per NIST guidelines.',
    standardOrAuthority: 'NIST Special Publication 250-48 / Labsphere Standard',
    relatedTermIds: ['lambertian', 'reflectance_factor', 'dark_current', 'dn'],
    keyExample: 'Re-calibrating a 10x10 inch Spectralon panel every 10–15 minutes during field spectral acquisition.'
  },
  {
    id: 'dark_current',
    term: 'Dark Current (DC)',
    aliases: ['dark current', 'dark offset', 'dc', 'detector dark noise', 'thermal dark current'],
    symbol: '\\text{DN}_{\\text{dark}}(\\lambda)',
    units: '\\text{Digital Numbers (DN)}',
    category: 'Instrumentation',
    shortDefinition: 'Residual electronic and thermally generated signal produced by detector photodiodes in the complete absence of incident photons.',
    fullDefinition: 'Dark current arises from spontaneous thermal electron-hole pair generation inside the silicon photodiode arrays (VNIR) or InGaAs detectors (SWIR1/SWIR2). The magnitude of dark current doubles approximately every 5°C to 7°C rise in detector junction temperature. Modern instruments utilize thermoelectric (Peltier) coolers to stabilize detector chips, but periodic dark readings are mandatory.',
    mathFormula: '\\text{DN}_{\\text{corrected}}(\\lambda) = \\text{DN}_{\\text{raw}}(\\lambda) - \\text{DN}_{\\text{dark}}(\\lambda)',
    formulaExplanation: 'Direct subtractive offset applied to raw digital numbers across all 2151 spectral channels prior to radiometric calibration.',
    fieldImplication: 'If dark current is not refreshed when ambient outdoor temperature fluctuates, baseline drift introduces artificial spectral slopes, severely distorting SWIR absorption wells and low-reflectance water bodies.',
    standardOrAuthority: 'CEOS WGCV Cal/Val Spectroradiometer Quality Standard',
    relatedTermIds: ['snr', 'dn', 'integration_time', 'spectralon'],
    keyExample: 'Closing internal shutter to capture a 50-sample dark current average after moving from shaded vehicle into direct 32°C sunlight.'
  },
  {
    id: 'snr',
    term: 'Signal-to-Noise Ratio (SNR)',
    aliases: ['snr', 'signal to noise ratio', 'signal-to-noise', 'radiometric snr'],
    symbol: '\\text{SNR}(\\lambda)',
    units: '\\text{Dimensionless (often: 1000:1 or dB)}',
    category: 'Instrumentation',
    shortDefinition: 'Ratio of the magnitude of the measured optical signal to the standard deviation of background noise variations.',
    fullDefinition: 'Signal-to-Noise Ratio is the primary figure of merit for spectroradiometer radiometric precision. Noise components include photon shot noise (Poisson distribution proportional to \\sqrt{N_{photons}}), detector thermal dark noise, readout noise, and analog-to-digital quantization noise.',
    mathFormula: '\\text{SNR}(\\lambda) = \\frac{\\mu_{\\text{signal}}(\\lambda)}{\\sigma_{\\text{noise}}(\\lambda)} \\propto \\sqrt{N_{\\text{averages}} \\cdot t_{\\text{int}}}',
    formulaExplanation: 'μ is mean measured signal, σ is standard deviation across repeat scans, N_averages is number of averaged spectra, and t_int is integration time.',
    fieldImplication: 'Averaging 25 to 50 individual spectral scans in the field increases SNR by a factor of \\sqrt{N} (e.g. \\sqrt{25} = 5\\times noise reduction). In low-illumination SWIR bands near water absorption, averaging prevents jagged noise spikes.',
    standardOrAuthority: 'Milton et al. (2009), Remote Sens. Environ. Special Issue',
    relatedTermIds: ['dark_current', 'integration_time', 'dn'],
    keyExample: 'Configuring ASD RS3 software to average 30 target scans and 30 dark scans per spectral record.'
  },
  {
    id: 'fwhm',
    term: 'Full Width at Half Maximum (FWHM)',
    aliases: ['fwhm', 'full width at half maximum', 'spectral resolution', 'bandpass', 'spectral bandwidth'],
    symbol: '\\Delta\\lambda_{\\text{FWHM}}',
    units: '\\text{nm}',
    category: 'Instrumentation',
    shortDefinition: 'Width of an optical instrument’s spectral response profile at half of its maximum peak transmittance; measures spectral resolution.',
    fullDefinition: 'Full Width at Half Maximum defines the spectral bandpass or effective resolution of an optical dispersive element (diffraction grating or prism) and slit aperture. It represents the wavelength interval between the two points where the instrument spectral response function drops to 50% of peak sensitivity.',
    mathFormula: '\\text{FWHM} = 2\\sqrt{2\\ln 2} \\cdot \\sigma \\approx 2.355 \\cdot \\sigma \\quad \\text{(for Gaussian SRF)}',
    formulaExplanation: 'σ is the standard deviation of the instrument Gaussian spectral bandpass response function.',
    fieldImplication: 'High spectral resolution (FWHM ≈ 3 nm in VNIR, 8–10 nm in SWIR for ASD FieldSpec) is required to resolve narrow mineral diagnostic absorption doublets (e.g., Kaolinite Al-OH doublet at 2160 & 2208 nm) that blend into a single broad dip at sensor bandwidths > 15 nm.',
    standardOrAuthority: 'ISO 19130 / USGS Spectroscopy Lab Calibration Standard',
    relatedTermIds: ['srf', 'radiance'],
    keyExample: 'Verifying FWHM using narrow atmospheric Fraunhofer lines or calibrated Mercury-Argon emission line lamps.'
  },
  {
    id: 'dn',
    term: 'Digital Number (DN)',
    aliases: ['digital number', 'dn', 'raw count', 'adc count', 'detector count'],
    symbol: '\\text{DN}',
    units: '\\text{Integer counts (e.g. 0 to 65535 for 16-bit ADC)}',
    category: 'Instrumentation',
    shortDefinition: 'Quantized raw integer output generated by an analog-to-digital converter (ADC) proportional to photodiode charge.',
    fullDefinition: 'Digital Number is the uncalibrated integer value produced when the detector charge accumulated during integration time is digitized by the instrument electronics. Common modern spectrometers use 16-bit ADCs yielding counts from 0 to 65,535.',
    mathFormula: '\\text{DN}(\\lambda) = \\operatorname{round}\\left( \\frac{V_{\\text{analog}}(\\lambda)}{V_{\\text{ref}}} \\cdot (2^B - 1) \\right)',
    formulaExplanation: 'V_analog is photodiode amplified voltage, V_ref is full-scale voltage, and B is ADC bit depth (e.g., 16 bits).',
    fieldImplication: 'Saturation occurs when DN reaches maximum capacity (65,535 DN in 16-bit systems), causing a flat-topped clipping that invalidates reflectance calculations. Field optimization must keep white reference maximum peak DN between 70% and 85% of saturation (approx 45,000–55,000 DN).',
    standardOrAuthority: 'ASD Analytical Spectral Devices User Guide',
    relatedTermIds: ['integration_time', 'dark_current', 'spectralon'],
    keyExample: 'Checking the live VNIR waveform in field software to verify peak values do not exceed 55,000 DN over Spectralon.'
  },
  {
    id: 'lambertian',
    term: 'Lambertian Surface',
    aliases: ['lambertian', 'lambertian surface', 'isotropic diffuser', 'lambertian reflector', 'cosine emitter'],
    symbol: 'L(\\theta) = \\text{constant}',
    units: '\\text{Ideal property}',
    category: 'Physics & Atmospheric',
    shortDefinition: 'An ideal, perfectly diffuse optical surface that reflects incident light isotropically with equal radiance in all directions.',
    fullDefinition: 'A Lambertian reflector obeys Lambert’s cosine law: the radiant intensity I(θ) exiting the surface varies with the cosine of the viewing angle θ, meaning the projected surface area cancels out the angle dependence, leaving the spectral radiance L independent of viewing angle.',
    mathFormula: 'L_r(\\theta, \\phi) = \\frac{E_i \\cdot \\rho}{\\pi} = \\text{constant} \\quad \\implies \\quad f_r = \\frac{\\rho}{\\pi}',
    formulaExplanation: 'E_i is incident irradiance, ρ is total reflectance, and π steradians represents the hemispherical integration factor.',
    fieldImplication: 'No real natural surface is truly Lambertian. While Spectralon closely approximates Lambertian behavior up to 50° off-nadir, natural vegetation and soil deviate significantly, producing angle-dependent brightness changes.',
    standardOrAuthority: 'Lambert (1760), Photometria / Nicodemus (1977)',
    relatedTermIds: ['radiance', 'irradiance', 'brdf', 'spectralon'],
    keyExample: 'Assuming a Spectralon panel radiates uniformly across all hemisphere angles when converting panel radiance to downwelling irradiance.'
  },
  {
    id: 'fov',
    term: 'Foreoptic Field of View (FOV)',
    aliases: ['fov', 'field of view', 'foreoptic angle', 'acceptance angle', 'instantaneous field of view', 'ifov'],
    symbol: '\\alpha_{\\text{FOV}}',
    units: '^{\\circ} \\text{ (degrees)}',
    category: 'Instrumentation',
    shortDefinition: 'Angular cone of acceptance through which a spectroradiometer collects radiant energy from target surfaces.',
    fullDefinition: 'The Field of View is the solid cone angle determined by the optical lens or bare fiber-optic cable entering the spectroradiometer. Bare fibers typically have a 25° FOV, while optical lens attachments provide narrow restricted angles of 1°, 4°, or 8° for high spatial isolation.',
    mathFormula: 'D_{\\text{footprint}} = 2 \\cdot h \\cdot \\tan\\left(\\frac{\\alpha_{\\text{FOV}}}{2}\\right)',
    formulaExplanation: 'D_footprint is ground circular diameter and h is height of the optic above the target surface.',
    fieldImplication: 'With a standard 25° bare fiber held 1 meter above the ground, the ground footprint is 44.3 cm in diameter. If the operator steps closer than 1 meter, the operator’s shadow or clothing reflectance enters the acceptance cone and corrupts the target measurement.',
    standardOrAuthority: 'Mac Arthur et al. (2012), IEEE JSTARS Cal/Val Protocols',
    relatedTermIds: ['radiance', 'illumination_geometry'],
    keyExample: 'Using an 8° foreoptic lens barrel at 1.5 m height to isolate single maize leaves without capturing background soil.'
  },
  {
    id: 'integration_time',
    term: 'Integration Time',
    aliases: ['integration time', 'dwell time', 'exposure time', 'detector integration time'],
    symbol: 't_{\\text{int}}',
    units: '\\text{ms (milliseconds)}',
    category: 'Instrumentation',
    shortDefinition: 'Duration of time during which detector photodiodes collect and accumulate photo-generated charges per scan.',
    fullDefinition: 'Integration time in a diode-array or CCD spectrometer is equivalent to shutter speed in photography. It determines how long incident photons are integrated onto the silicon or InGaAs semiconductor capacitors prior to readout. Longer integration times increase collected charge and SNR, but excessive times lead to photodiode saturation.',
    mathFormula: '\\text{Signal (DN)} \\propto t_{\\text{int}} \\cdot \\int_{\\lambda_1}^{\\lambda_2} \\Phi_{\\lambda} \\, \\mathrm{d}\\lambda',
    formulaExplanation: 'Accumulated signal is linearly proportional to integration time until non-linear saturation thresholds are approached.',
    fieldImplication: 'Instruments must be re-optimized (integration time re-adjusted) whenever cloud opacity changes or the sun drops. In VNIR arrays, typical integration times range from 8.5 ms in bright midday sun to 270 ms in late afternoon or deep canopies.',
    standardOrAuthority: 'Analytical Spectral Devices / CEOS Best Practice Guide',
    relatedTermIds: ['dn', 'snr', 'dark_current', 'white_reference_optimization'],
    keyExample: 'Automatically optimizing VNIR integration time to 17 ms when pointing at a 99% Spectralon panel under 12:00 sun.'
  },
  {
    id: 'prospect_d',
    term: 'PROSPECT-D',
    aliases: ['prospect-d', 'prospect model', 'leaf radiative transfer model', 'prospect', 'leaf optical model'],
    symbol: 'R_{\\text{leaf}}(\\lambda), \\; T_{\\text{leaf}}(\\lambda)',
    units: '\\text{Model / Reflectance Factor}',
    category: 'RTM & Indices',
    shortDefinition: 'Widely used plate-theory leaf radiative transfer model simulating directional-hemispherical reflectance and transmittance of plant leaves.',
    fullDefinition: 'PROSPECT-D (Féret et al., 2017) represents the leaf as a stack of N elementary absorbing and scattering compact layers separated by N-1 air spaces. It models optical absorption from specific biochemical constituents: chlorophylls a+b (Cab), carotenoids (Ccx), anthocyanins (Can), brown pigments (Cbrown), equivalent water thickness (Cw), and leaf dry matter per unit area (Cm).',
    mathFormula: 'k(\\lambda) = \\sum_i \\frac{C_i}{N} K_i(\\lambda) = \\frac{C_{ab} K_{ab} + C_{xc} K_{xc} + C_w K_w + C_m K_m + \\dots}{N}',
    formulaExplanation: 'k(λ) is total leaf layer absorption coefficient, C_i is concentration of constituent i, and K_i(λ) is specific absorption cross-section.',
    fieldImplication: 'PROSPECT-D allows inversion of in-situ leaf reflectance spectra measured with contact probes to accurately extract biochemical concentrations without destructive laboratory wet chemistry.',
    standardOrAuthority: 'Féret et al. (2017), Remote Sens. Environ.',
    relatedTermIds: ['4sail', 'ndvi', 'red_edge'],
    keyExample: 'Inverting 400–2500 nm leaf contact probe measurements to estimate foliar chlorophyll content in μg/cm².'
  },
  {
    id: '4sail',
    term: '4SAIL',
    aliases: ['4sail', 'sail model', 'canopy radiative transfer model', 'scattering by arbitrarily inclined leaves'],
    symbol: 'R_{\\text{canopy}}(\\theta_s, \\theta_v, \\psi; \\lambda)',
    units: '\\text{Model / Canopy Reflectance}',
    category: 'RTM & Indices',
    shortDefinition: 'Four-stream turbid-medium canopy radiative transfer model calculating top-of-canopy bidirectional reflectance factors.',
    fullDefinition: '4SAIL (Verhoef, 1984) is an analytical physical model that calculates 4 directional radiation fluxes in a vegetation canopy: direct solar downward flux, diffuse downward flux, diffuse upward flux, and directional upward radiance exiting towards the sensor. Inputs include Leaf Area Index (LAI), Leaf Angle Distribution (LAD), leaf reflectance/transmittance (often from PROSPECT), soil background reflectance, and solar/viewing geometry.',
    mathFormula: '\\frac{\\mathrm{d}\\mathbf{F}}{\\mathrm{d}z} = \\mathbf{M} \\mathbf{F}',
    formulaExplanation: 'F is the vector of 4 radiative fluxes along vertical canopy depth z, and M is the 4×4 optical scattering and extinction matrix.',
    fieldImplication: 'Coupled PROSPECT-4SAIL (PROSAIL) enables decoupling canopy architectural effects (LAI, erectophile vs planophile leaf distributions) from leaf biochemical changes (chlorophyll and water).',
    standardOrAuthority: 'Verhoef (1984, 1985), Remote Sens. Environ.',
    relatedTermIds: ['prospect_d', 'brdf', 'ndvi'],
    keyExample: 'Simulating canopy red and near-infrared reflectance across varying Leaf Area Index from LAI = 0.5 to 6.0.'
  },
  {
    id: 'ndvi',
    term: 'NDVI',
    aliases: ['ndvi', 'normalized difference vegetation index', 'vegetation index', 'normalized vegetation index'],
    symbol: '\\text{NDVI}',
    units: '\\text{Dimensionless (-1.0 to +1.0)}',
    category: 'RTM & Indices',
    shortDefinition: 'Normalized ratio of near-infrared reflectance to red reflectance used to estimate green photosynthetic vegetation vigor and fractional cover.',
    fullDefinition: 'NDVI (Rouse et al., 1974) exploits the sharp contrast between intense red chlorophyll absorption (centered around 670 nm) and high near-infrared scattering by the spongy mesophyll leaf structure (centered around 850 nm). Dense green canopies exhibit NDVI values between 0.65 and 0.90, bare soils between 0.1 and 0.25, and water negative values.',
    mathFormula: '\\text{NDVI} = \\frac{\\rho_{\\text{NIR}} - \\rho_{\\text{Red}}}{\\rho_{\\text{NIR}} + \\rho_{\\text{Red}}} = \\frac{R_{800} - R_{670}}{R_{800} + R_{670}}',
    formulaExplanation: 'ρ_NIR is reflectance in the NIR plateau (780–900 nm) and ρ_Red is reflectance in the chlorophyll absorption trough (660–680 nm).',
    fieldImplication: 'NDVI saturates in high-density canopies (LAI > 3–4) because red absorption becomes asymptotically total while NIR multiple scattering continues rising. Alternative indices (EVI, MTCI) are preferred for dense forest canopies.',
    standardOrAuthority: 'Rouse et al. (1974) / NASA Landsat Handbook',
    relatedTermIds: ['red_edge', 'prospect_d', 'reflectance_factor'],
    keyExample: 'Computing ground-truth NDVI from calibrated field spectra to cross-validate Sentinel-2 MSI Band 8 / Band 4.'
  },
  {
    id: 'red_edge',
    term: 'Red Edge Position (REP)',
    aliases: ['red edge', 'rep', 'red edge position', 'inflection point', 'chlorophyll red edge'],
    symbol: '\\lambda_{\\text{re}}',
    units: '\\text{nm (typically 690–740 nm)}',
    category: 'RTM & Indices',
    shortDefinition: 'Wavelength of the maximum first derivative inflection point on the steep reflectance slope between 680 and 750 nm.',
    fullDefinition: 'The Red Edge is one of the most prominent features in terrestrial optical spectroscopy. It marks the abrupt physical boundary between strong electronic chlorophyll-a absorption at 680 nm and high photon scattering within hydrated mesophyll cells at 750 nm. As chlorophyll concentration increases, the absorption band broadens, shifting the inflection point towards longer wavelengths ("red shift"). Stress or senescence causes a "blue shift" toward shorter wavelengths.',
    mathFormula: '\\lambda_{\\text{re}} = \\arg\\max_{\\lambda} \\left( \\frac{\\mathrm{d}R(\\lambda)}{\\mathrm{d}\\lambda} \\right) \\quad \\text{in the domain } 680 \\le \\lambda \\le 760\\text{ nm}',
    formulaExplanation: 'First derivative peak computed using spline interpolation, Lagrangian polynomial fitting, or inverted Gaussian techniques.',
    fieldImplication: 'Hyperspectral sensors with 1–3 nm sampling can precisely pinpoint the 1–5 nm shifts in REP that diagnose subtle early-stage nitrogen deficiencies or water stress days before chlorosis is visible to the human eye.',
    standardOrAuthority: 'Horler et al. (1983), Int. J. Remote Sens. / Curran et al. (1990)',
    relatedTermIds: ['prospect_d', 'ndvi', 'fwhm'],
    keyExample: 'Detecting a 4 nm blue shift in wheat canopy red edge from 724 nm down to 720 nm during heat stress.'
  },
  {
    id: 'atmospheric_windows',
    term: 'Atmospheric Water Vapor Absorption',
    aliases: ['atmospheric absorption', 'water vapor bands', 'telluric absorption', 'atmospheric windows', 'absorption troughs'],
    symbol: '\\tau_\\text{atm}(\\lambda)',
    units: '\\text{Bands at 940, 1140, 1400, 1900, and 2700 nm}',
    category: 'Physics & Atmospheric',
    shortDefinition: 'Deep atmospheric attenuation troughs caused by rotational and vibrational molecular resonance of H₂O, CO₂, and O₃ in the optical column.',
    fullDefinition: 'Incoming solar radiation and ground-reflected photons are absorbed by atmospheric trace gases. The primary absorbers in field spectroscopy are tropospheric water vapor (H₂O) centered at 940 nm, 1140 nm, 1380–1450 nm, and 1850–1950 nm; carbon dioxide (CO₂) at 2010 and 2060 nm; and oxygen (O₂) at the 760 nm A-band. Near 1400 and 1900 nm, atmospheric transmittance drops near zero.',
    mathFormula: 'T(\\lambda) = \\exp\\left( - m \\cdot \\sum_j \\tau_j(\\lambda) \\right)',
    formulaExplanation: 'm is optical air mass and \\tau_j is the spectral optical depth of molecular species j along the solar and sensor optical path.',
    fieldImplication: 'Because incident solar irradiance in the 1350–1450 nm and 1800–1950 nm bands is near zero, calculating reflectance (L_target / L_ref) produces a division by near-zero, generating extreme chaotic noise. These regions must be masked and excluded from post-processing and vegetation index calculations.',
    standardOrAuthority: 'Berk et al., MODTRAN Radiative Transfer Code',
    relatedTermIds: ['irradiance', 'radiance', 'snr'],
    keyExample: 'Masking out channels 1350–1460 nm and 1790–1960 nm in Python/R spectral processing scripts.'
  },
  {
    id: 'specular_reflection',
    term: 'Specular Reflection',
    aliases: ['specular reflection', 'fresnel reflection', 'glint', 'mirror reflection', 'specular glare'],
    symbol: 'R_{\\text{specular}}',
    units: '\\text{Dimensionless}',
    category: 'Physics & Atmospheric',
    shortDefinition: 'Mirror-like reflection of light where angle of reflection equals angle of incidence, governed by Fresnel equations at dielectric interfaces.',
    fullDefinition: 'Specular reflection occurs at the smooth refractive boundary between air (n ≈ 1.0) and a medium with a different refractive index (e.g. waxy leaf epicuticular cuticles n ≈ 1.45–1.50 or wet soil water films n ≈ 1.33). The reflected light retains the spectral color of the illuminant (white sunlight) without penetrating into the absorbing interior pigments, polarizing the reflected beam.',
    mathFormula: 'R_s = \\left| \\frac{n_1 \\cos\\theta_i - n_2 \\cos\\theta_t}{n_1 \\cos\\theta_i + n_2 \\cos\\theta_t} \\right|^2, \\quad R_p = \\left| \\frac{n_1 \\cos\\theta_t - n_2 \\cos\\theta_i}{n_1 \\cos\\theta_t + n_2 \\cos\\theta_i} \\right|^2',
    formulaExplanation: 'Fresnel reflection coefficients for perpendicular (s) and parallel (p) polarized light with refractive indices n_1, n_2.',
    fieldImplication: 'Measuring shiny leaves (e.g. citrus, eucalyptus, laurel) in the forward scattering specular direction leads to artificially high reflectance across all wavelengths, muting chlorophyll absorption dips. Field spectroradiometers should be positioned at least 30° away from the specular glint geometry.',
    standardOrAuthority: 'Grant et al. (1987), Remote Sens. Environ. / Born & Wolf (1999)',
    relatedTermIds: ['brdf', 'lambertian', 'illumination_geometry'],
    keyExample: 'Observing intense white glare on a calm water surface or wet paddy field when looking toward the sun azimuth.'
  },
  {
    id: 'cosine_receptor',
    term: 'Cosine Receptor',
    aliases: ['cosine receptor', 'cosine diffuser', 'hemispherical diffuser', 'cosine corrector', 'irradiance head'],
    symbol: '\\cos\\theta \\text{ Response}',
    units: '2\\pi \\text{ sr Field of View}',
    category: 'Instrumentation',
    shortDefinition: 'An optical diffuser attachment that accepts light across a full 180° hemisphere, weighting rays by the cosine of their incidence angle.',
    fullDefinition: 'A cosine-corrected receptor is designed to measure true downwelling irradiance E_λ. The diffusing element (typically made of opaline glass, Teflon, or Spectralon) attenuates incoming rays according to Lambert’s cosine law so that rays arriving at low grazing angles contribute proportionally to their projected surface area.',
    mathFormula: 'S(\\theta) = S(0) \\cdot \\cos\\theta',
    formulaExplanation: 'Measured detector signal S varies strictly with the cosine of the illumination incident angle θ.',
    fieldImplication: 'Using a calibrated cosine receptor allows continuous dual-beam logging of downwelling irradiance on a dedicated reference channel while the primary foreoptic measures targets, eliminating errors caused by passing clouds.',
    standardOrAuthority: 'CIE Publication No. 198 / WMO Radiometry Guide',
    relatedTermIds: ['irradiance', 'radiance', 'lambertian'],
    keyExample: 'Mounting a cosine receptor horizontally on top of a 10-meter eddy covariance tower to log solar irradiance.'
  },
  {
    id: 'white_reference_optimization',
    term: 'White Reference Optimization',
    aliases: ['white reference optimization', 'optimization', 'gain adjustment', 'spectral optimization', 'wr optimize'],
    symbol: '\\text{OPT}',
    units: '\\text{Procedure / Integration Adjustment}',
    category: 'Field Protocols',
    shortDefinition: 'Automated calibration procedure in which integration time and preamplifier gain are tuned so white reference signal reaches peak safe DN.',
    fullDefinition: 'Optimization is the essential first step before any field spectral acquisition. The instrument points at a calibrated 99% Spectralon panel and automatically steps through integration times and electronic gains until the peak spectral signal across VNIR and SWIR detector arrays reaches approximately 80% of digital full scale (around 50,000 DN in a 16-bit system).',
    mathFormula: 't_{\\text{opt}} = t_{\\text{curr}} \\times \\frac{\\text{DN}_{\\text{target\\_peak}}}{\\text{DN}_{\\text{measured\\_peak}}} \\quad (\\text{clamped to linear range})',
    formulaExplanation: 'Calculates optimal integration time t_opt to safely maximize dynamic range without risking ADC saturation.',
    fieldImplication: 'Never optimize over dark targets or ground surfaces; doing so will cause catastrophic detector saturation the moment the foreoptic points at a brighter surface or white panel. Always optimize strictly over the horizontal 99% Spectralon panel in full sun.',
    standardOrAuthority: 'ASD RS3 Field Guide / CEOS WGCV Cal/Val Protocol',
    relatedTermIds: ['spectralon', 'dn', 'integration_time', 'dark_current'],
    keyExample: 'Running instrument Optimization on a tripod-mounted ASD FieldSpec 4 under clear midday skies.'
  },
  {
    id: 'vicarious_calibration',
    term: 'Vicarious Calibration',
    aliases: ['vicarious calibration', 'in-flight calibration', 'cal/val', 'surface truth validation', 'super-site validation'],
    symbol: 'L_{\\text{satellite}} / L_{\\text{modeled}}',
    units: '\\text{Calibration Ratio / % Bias}',
    category: 'Cal/Val & Quality',
    shortDefinition: 'Technique that uses in-situ surface field spectroscopy and atmospheric measurements to independently calibrate and validate satellite sensors in flight.',
    fullDefinition: 'Because satellite sensors experience launch vibrations, orbital outgassing, and detector degradation, their on-board radiometric calibration must be validated against Earth surface target sites. In vicarious calibration, field teams measure homogeneous pseudo-invariant calibration sites (PICS) or instrumented CEOS test-sites (such as Railroad Valley Playa, NV, USA or Gobabeb, Namibia) coincident with satellite overpasses.',
    mathFormula: 'L_{\\text{TOA}}(\\lambda) = L_0(\\lambda) + \\frac{\\rho(\\lambda) \\cdot E_{\\text{tot}}(\\lambda) \\cdot \\tau_v(\\lambda)}{\\pi \\cdot [1 - s(\\lambda) \\cdot \\rho(\\lambda)]}',
    formulaExplanation: 'L_TOA is Top-of-Atmosphere modeled radiance, L_0 is atmospheric path radiance, τ_v is upward transmittance, and s is spherical albedo.',
    fieldImplication: 'Field spectrometers used for vicarious calibration must maintain SI traceability with annual NIST/NPL recalibrations and strict uncertainty budgets conforming to CEOS WGCV protocols.',
    standardOrAuthority: 'CEOS Working Group on Calibration and Validation (WGCV)',
    relatedTermIds: ['radiance', 'hdrf', 'spectralon'],
    keyExample: 'Conducting ground hyperspectral transects over Railroad Valley during Sentinel-2 and Landsat-9 coincident overpasses.'
  },
  {
    id: 'srf',
    term: 'Spectral Response Function (SRF)',
    aliases: ['srf', 'spectral response function', 'relative spectral response', 'rsr', 'filter function'],
    symbol: 'S_i(\\lambda)',
    units: '\\text{Normalized (0.0 to 1.0)}',
    category: 'Cal/Val & Quality',
    shortDefinition: 'Normalized wavelength-dependent transmission curve of an optical bandpass filter in a multispectral sensor.',
    fullDefinition: 'The Spectral Response Function defines the relative sensitivity of a sensor channel or band (e.g. Landsat 9 OLI Band 4 or Sentinel-2 MSI Band 8A) as a function of wavelength. It is determined in laboratory collimator facilities prior to launch. In-situ field hyperspectral continuous spectra must be spectrally resampled using the target sensor’s SRFs to allow direct validation.',
    mathFormula: '\\rho_{\\text{band } i} = \\frac{\\int_{\\lambda_{\\min}}^{\\lambda_{\\max}} \\rho(\\lambda) \\cdot E_{\\lambda} \\cdot S_i(\\lambda) \\, \\mathrm{d}\\lambda}{\\int_{\\lambda_{\\min}}^{\\lambda_{\\max}} E_{\\lambda} \\cdot S_i(\\lambda) \\, \\mathrm{d}\\lambda}',
    formulaExplanation: 'Convolution of high-resolution continuous field reflectance ρ(λ) and solar irradiance E_λ with the sensor band filter response S_i(λ).',
    fieldImplication: 'Never compare raw hyperspectral readings directly to multispectral satellite bands without SRF convolution; spectral convolution prevents significant spectral mismatch biases across absorption slopes like the red edge.',
    standardOrAuthority: 'ESA / USGS Sentinel-2 and Landsat Technical Documentation',
    relatedTermIds: ['fwhm', 'vicarious_calibration', 'radiance'],
    keyExample: 'Convolving 2151-channel ASD field spectra with the Sentinel-2B MSI SRF curves to validate 20m surface reflectance.'
  },
  {
    id: 'illumination_geometry',
    term: 'Illumination & Viewing Geometry',
    aliases: ['illumination geometry', 'view geometry', 'solar zenith', 'view zenith', 'azimuth angle', 'phase angle'],
    symbol: '(\\theta_s, \\phi_s, \\theta_v, \\phi_v, g)',
    units: '^{\\circ} \\text{ (degrees)}',
    category: 'Field Protocols',
    shortDefinition: 'The complete set of angular coordinates defining the position of the sun and the sensor relative to the target surface normal.',
    fullDefinition: 'Angular geometry in spectroscopy comprises: Solar Zenith Angle (θ_s, angle of sun from vertical), Solar Azimuth Angle (φ_s, compass heading of sun), View Zenith Angle (θ_v, angle of sensor from nadir vertical), View Azimuth Angle (φ_v, sensor compass heading), and Phase Angle (g, angle between illumination vector and observation vector).',
    mathFormula: '\\cos g = \\cos\\theta_s \\cos\\theta_v + \\sin\\theta_s \\sin\\theta_v \\cos(\\phi_s - \\phi_v)',
    formulaExplanation: 'Phase angle g is zero at the backscattering retro-reflection "hotspot", where viewer shadows are hidden.',
    fieldImplication: 'To minimize BRDF variations during multi-target field campaigns, measurements should be collected within ±2 hours of local solar noon (θ_s < 45°), pointing the foreoptic strictly at nadir (θ_v = 0°), with the operator positioned perpendicular to the solar principal plane to prevent casting shadows on the target.',
    standardOrAuthority: 'CEOS Field Spectroscopy Best Practice Guide',
    relatedTermIds: ['brdf', 'hdrf', 'fov'],
    keyExample: 'Standing at 90° azimuth relative to the sun to avoid operator body reflection onto the Spectralon panel.'
  },
  {
    id: 'stray_light',
    term: 'Stray Light',
    aliases: ['stray light', 'optical stray light', 'ghost image', 'scattered light in spectrometer', 'out of band leakage'],
    symbol: '\\Phi_{\\text{stray}}(\\lambda)',
    units: '\\text{Counts / % Signal}',
    category: 'Instrumentation',
    shortDefinition: 'Unwanted radiation arriving at a detector channel from wavelengths or directions other than the nominal optical bandpass path.',
    fullDefinition: 'Stray light originates from scattering off imperfect grating surfaces, reflections from interior housing walls, multiple diffraction orders, and micro-defects in lenses or mirrors within the optical spectrograph. Stray light from intense VNIR wavelengths can scatter onto low-efficiency UV or SWIR detectors.',
    mathFormula: '\\mathbf{y}_{\\text{meas}} = (\\mathbf{I} + \\mathbf{D}) \\mathbf{y}_{\\text{true}} \\quad \\implies \\quad \\mathbf{y}_{\\text{corr}} = (\\mathbf{I} + \\mathbf{D})^{-1} \\mathbf{y}_{\\text{meas}}',
    formulaExplanation: 'D is the Stray Light Correction Matrix characterizing optical scatter from every channel into every other channel.',
    fieldImplication: 'Stray light is particularly hazardous when measuring deep absorption bands (such as water absorption wells) where real in-band signal is tiny; stray light from nearby bright spectral regions leaks in, creating an artificial floor and underestimating absorption depth.',
    standardOrAuthority: 'Zong et al. (2006), NIST Stray Light Correction Algorithm',
    relatedTermIds: ['snr', 'fwhm', 'dark_current'],
    keyExample: 'Applying an in-situ stray light correction matrix calibrated using tunable lasers at NIST or NPL.'
  },
  {
    id: 'reflectance_factor',
    term: 'Reflectance Factor',
    aliases: ['reflectance factor', 'spectral reflectance', 'surface reflectance', 'directional reflectance factor', 'rf'],
    symbol: 'R(\\lambda)',
    units: '\\text{Dimensionless (0.0 to 1.0 or %)}',
    category: 'Radiometry',
    shortDefinition: 'Ratio of radiant flux reflected by a sample surface to flux reflected into the same beam geometry by an ideal lossless Lambertian reflector.',
    fullDefinition: 'Reflectance Factor is the universally reported optical property in remote sensing and laboratory spectroscopy. Unlike pure reflectance (which is bounded strictly between 0 and 1 by conservation of energy), directional reflectance factors can mathematically exceed 1.0 (or 100%) in forward specular or retroreflective hotspot peaks where directional radiance is concentrated above the isotropic Lambertian level.',
    mathFormula: 'R(\\lambda) = \\frac{\\int_{\\Omega_r} L_r(\\lambda) \\cos\\theta_r \\, \\mathrm{d}\\Omega_r}{\\int_{\\Omega_r} L_{\\text{ideal}}(\\lambda) \\cos\\theta_r \\, \\mathrm{d}\\Omega_r}',
    formulaExplanation: 'L_ideal is radiance from a non-absorbing, perfectly diffuse surface under identical incident illumination.',
    fieldImplication: 'Calculated in the field as R_target = (DN_target - DN_dark) / (DN_white - DN_dark) * R_panel_cert.',
    standardOrAuthority: 'Nicodemus (1977) / ISO 80000-7',
    relatedTermIds: ['radiance', 'irradiance', 'spectralon', 'brdf'],
    keyExample: 'Normalizing plant canopy raw counts against a calibrated 99% Spectralon panel to yield 0.0–1.0 reflectance factors.'
  }
];

// Helper search function
export function searchGlossary(
  query: string,
  categoryFilter?: GlossaryCategory | 'All'
): GlossaryTerm[] {
  const q = query.trim().toLowerCase();
  return SPECTRAL_GLOSSARY.filter((term) => {
    // Category match
    if (categoryFilter && categoryFilter !== 'All' && term.category !== categoryFilter) {
      return false;
    }
    // Query match
    if (!q) return true;

    // Check term title
    if (term.term.toLowerCase().includes(q)) return true;
    // Check aliases
    if (term.aliases.some((a) => a.toLowerCase().includes(q))) return true;
    // Check short/full definitions
    if (term.shortDefinition.toLowerCase().includes(q)) return true;
    if (term.fullDefinition.toLowerCase().includes(q)) return true;
    // Check field implication or standard
    if (term.fieldImplication.toLowerCase().includes(q)) return true;
    if (term.standardOrAuthority?.toLowerCase().includes(q)) return true;
    if (term.symbol?.toLowerCase().includes(q)) return true;

    return false;
  });
}

// Helper to find term matching highlighted text
export function matchGlossaryTermByText(text: string): GlossaryTerm | null {
  if (!text) return null;
  const cleaned = text.trim().toLowerCase();
  if (cleaned.length < 2) return null;

  // 1. Direct exact matches against term title or aliases
  for (const item of SPECTRAL_GLOSSARY) {
    if (item.term.toLowerCase() === cleaned) return item;
    if (item.id.toLowerCase() === cleaned) return item;
    if (item.aliases.some((alias) => alias.toLowerCase() === cleaned)) return item;
  }

  // 2. Normalized alphanumeric check (e.g. "b.r.d.f." -> "brdf", "spectral-radiance" -> "spectral radiance")
  const normCleaned = cleaned.replace(/[^a-z0-9]/g, '');
  if (normCleaned.length >= 2) {
    for (const item of SPECTRAL_GLOSSARY) {
      const normTerm = item.term.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normTerm === normCleaned) return item;
      for (const alias of item.aliases) {
        const normAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normAlias === normCleaned) return item;
      }
    }
  }

  // 3. Substring word boundary match for common compound phrases
  // e.g. if user highlighted "spectral radiance" or "irradiance at 600nm" or "BRDF anisotropy"
  for (const item of SPECTRAL_GLOSSARY) {
    const termLower = item.term.toLowerCase();
    if (cleaned.includes(termLower) && termLower.length >= 4) {
      return item;
    }
    for (const alias of item.aliases) {
      const aliasLower = alias.toLowerCase();
      if (cleaned.includes(aliasLower) && aliasLower.length >= 4) {
        return item;
      }
    }
  }

  return null;
}
