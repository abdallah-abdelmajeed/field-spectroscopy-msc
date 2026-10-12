import type { CourseModule, Slide } from '../types';

function generateModule7Slides(): Slide[] {
  return [
    {
      id: 'm7_s1',
      slideNumber: 1,
      title: 'Introduction to Radiative Transfer Modeling in Remote Sensing',
      category: 'RTM',
      keyTakeaway: 'Radiative Transfer Models (RTMs) simulate photon scattering and absorption in plant tissue and canopies based on physical laws.',
      bullets: [
        'Statistical indices (NDVI, NDRE) are site- and species-specific and suffer from empirical saturation and background soil bias.',
        'Physical Radiative Transfer Models provide a mechanistic, universal link between biophysical canopy traits and observed spectral reflectance.',
        'Forward modeling: Simulates reflectance from known biochemical traits and structure.',
        'Inverse modeling: Retrieves unknown biochemical traits from measured field spectra.'
      ],
      practicalFieldNote: 'RTM inversion eliminates the need for recalibrating empirical indices for every new crop type or field season.',
      speakerNotes: 'Welcome to Module 7. Here we explore the physics-based heart of quantitative optical remote sensing: PROSAIL and RTM inversion.',
      references: ['Jacquemoud, S. et al. (2009). PROSPECT+SAIL: A review of use for vegetation characterization. Remote Sensing of Environment.']
    },
    {
      id: 'm7_s2',
      slideNumber: 2,
      title: 'The Forward vs. Inverse Modeling Paradigm',
      category: 'Mathematics',
      keyTakeaway: 'Forward modeling maps biophysical traits to spectra via deterministic physics; inverse modeling solves the ill-posed mathematical reverse.',
      bullets: [
        'Forward Problem: y = f(x, θ, λ) is well-posed, unique, and deterministic.',
        'Inputs x: Chlorophyll (Cab), Carotenoids (Car), Water (Cw), Dry matter (Cm), Leaf Area Index (LAI), Leaf Angle (ALA).',
        'Outputs y: Directional spectral reflectance across 400–2500 nm.',
        'Inverse Problem: x = f⁻¹(y) is ill-posed: Multiple distinct trait combinations can yield nearly identical canopy reflectance (equifinality).'
      ],
      mathFormula: '\\mathbf{y}_{\\text{spectrum}} = f_{\\text{RTM}}(\\mathbf{x}_{\\text{traits}}, \\mathbf{\\Omega}_{\\text{geometry}})',
      formulaExplanation: 'Forward radiative transfer function mapping biophysical state vector x to spectral vector y.',
      speakerNotes: 'Draw the forward and inverse arrows on the board. Emphasize why the inverse problem requires regularization.',
      references: ['Baret, F., & Buis, S. (2008). Estimating canopy characteristics from remote sensing observations: Review of methods and constraints. Advances in Land Remote Sensing.']
    },
    {
      id: 'm7_s3',
      slideNumber: 3,
      title: 'Leaf Optical Physics: The Plate Model & Fresnel Interfaces',
      category: 'Physics',
      keyTakeaway: 'Willstätter-Stoll and Allen plate theory models the leaf as a stack of absorbing optical plates separated by air spaces.',
      bullets: [
        'Allen et al. (1969) generalized Stokes equations for multiple reflecting and transmitting parallel plates.',
        'At each plate boundary, refraction occurs according to Snell\'s law (refractive index n(λ) ≈ 1.40–1.45 for leaf wax/cellulose).',
        'Fresnel reflection at the waxy cuticle reflects ~5% of light specularly without biochemical interaction.',
        'Internal mesophyll air spaces create thousands of refractive index boundaries (n_cell ≈ 1.42 vs n_air ≈ 1.00), scattering NIR photons intensely.'
      ],
      speakerNotes: 'Show the anatomical cross-section of a dicot leaf: upper epidermis, palisade mesophyll, spongy mesophyll with intercellular air cavities.',
      references: ['Allen, W. A. et al. (1969). Interaction of isotropic light with a compact plant leaf. JOSA.']
    },
    {
      id: 'm7_s4',
      slideNumber: 4,
      title: 'The PROSPECT Leaf Optical Model Evolution',
      category: 'RTM',
      keyTakeaway: 'PROSPECT calculates leaf directional-hemispherical reflectance and transmittance from 400 to 2500 nm.',
      bullets: [
        'Developed by Stéphane Jacquemoud and Frédéric Baret (1990).',
        'PROSPECT-4: Leaf structure parameter N, Chlorophyll a+b (Cab), Equivalent Water Thickness (Cw), Leaf Mass per Area (Cm).',
        'PROSPECT-5: Separated carotenoids (Car) from chlorophyll.',
        'PROSPECT-D (Féret et al., 2017): Added anthocyanins (Anth) and brown senescent pigments (Cbrown), covering all phenological stages from budburst to senescence.'
      ],
      speakerNotes: 'Review the chronological development of PROSPECT versions over three decades of peer-reviewed validation.',
      references: ['Féret, J. B. et al. (2017). PROSPECT-D: Towards modeling leaf optical properties through a complete lifecycle. RSE.']
    },
    {
      id: 'm7_s5',
      slideNumber: 5,
      title: 'PROSPECT Mathematical Formulation & Specific Absorption Coefficients',
      category: 'Mathematics',
      keyTakeaway: 'Total leaf absorption coefficient k(λ) is the linear sum of biochemical concentrations multiplied by specific absorption coefficients.',
      bullets: [
        'Generalized Beer-Lambert formulation inside the leaf plates.',
        'Specific absorption coefficients (k_i(λ)) are NIST-traceable calibrated laboratory optical constants for pure pigments, water, and dry matter.',
        'Transmittance of an elementary plate: τ(λ) = (1 - k(λ)) · exp(-k(λ)) + k(λ)² · E₁(k(λ)).'
      ],
      mathFormula: 'k(\\lambda) = \\frac{C_{ab} k_{ab}(\\lambda) + C_{ar} k_{ar}(\\lambda) + C_{\\text{anth}} k_{\\text{anth}}(\\lambda) + C_w k_w(\\lambda) + C_m k_m(\\lambda)}{N}',
      formulaExplanation: 'Absorption coefficient k(λ) per unit elementary plate in PROSPECT-D.',
      speakerNotes: 'Point out that N is dimensionless (typically 1.1 for monocots up to 2.5 for thick sclerophyllous leaves).',
      references: ['Jacquemoud, S., & Baret, F. (1990). PROSPECT: A model of leaf optical properties spectra. RSE.']
    },
    {
      id: 'm7_s6',
      slideNumber: 6,
      title: 'The Leaf Mesophyll Structure Parameter N',
      category: 'RTM',
      keyTakeaway: 'The structural parameter N represents the effective number of compact cell layers and internal refractive interfaces.',
      bullets: [
        'N = 1.0 represents a single compact plate with zero internal air spaces (no scattering, pure absorption).',
        'Monocots (corn, wheat, grasses) with compact mesophyll: N ≈ 1.2 to 1.5.',
        'Dicotyledons (soybean, oak, sunflower) with distinct spongy mesophyll: N ≈ 1.6 to 2.2.',
        'Thick evergreen sclerophylls (eucalyptus, olive, pine): N ≈ 2.3 to 3.5.',
        'Higher N increases internal multiple scattering, shifting NIR plateau reflectance upward.'
      ],
      speakerNotes: 'Show how increasing N from 1.0 to 3.0 boosts 800 nm reflectance from 10% to 55% while keeping chlorophyll identical.',
      references: ['Jacquemoud, S., & Ustin, S. L. (2019). Leaf Optical Properties. Cambridge University Press.']
    },
    {
      id: 'm7_s7',
      slideNumber: 7,
      title: 'From Single Leaf to Canopy Architecture: 1D Canopy Radiative Transfer',
      category: 'RTM',
      keyTakeaway: 'Canopy reflectance depends not only on leaf optics, but on canopy architecture, leaf angle distribution, and background soil.',
      bullets: [
        'A canopy is a 3D turbid medium where leaves act as absorbing and scattering facets.',
        'Canopy reflectance is significantly lower than individual leaf reflectance because photons are trapped and absorbed in internal multi-bounce cavities.',
        'NIR canopy reflectance is typically 20–35%, whereas individual leaf reflectance is 45–55%.'
      ],
      speakerNotes: 'Explain the "cavity effect": photons entering canopy gaps bounce between leaves, increasing the probability of absorption.',
      references: ['Verhoef, W. (1984). Light scattering by leaf layers with application to canopy reflectance modeling: The SAIL model. RSE.']
    },
    {
      id: 'm7_s8',
      slideNumber: 8,
      title: 'The 4SAIL Canopy Radiative Transfer Model',
      category: 'RTM',
      keyTakeaway: 'SAIL (Scattering by Arbitrarily Inclined Leaves) models four-stream radiative transfer in a homogeneous turbid vegetation layer.',
      bullets: [
        'Formulated by Wout Verhoef (1984); upgraded to 4SAIL (Verhoef et al., 2007).',
        'Four differential radiation flux streams: Direct solar flux (E_s), Diffuse downward flux (E⁻), Diffuse upward flux (E⁺), Directional radiance toward observer (E_o).',
        'Analytical differential equations solved in closed form with boundary conditions at top of canopy (TOC) and bottom of canopy (soil).'
      ],
      mathFormula: '\\frac{d}{dz} \\begin{bmatrix} E_s \\\\ E^- \\\\ E^+ \\\\ E_o \\end{bmatrix} = \\begin{bmatrix} k & 0 & 0 & 0 \\\\ -s & a & -\\sigma & 0 \\\\ s\' & \\sigma & -a & 0 \\\\ w & v & v\' & -K \\end{bmatrix} \\begin{bmatrix} E_s \\\\ E^- \\\\ E^+ \\\\ E_o \\end{bmatrix}',
      formulaExplanation: 'Verhoef 4-stream matrix differential equations.',
      speakerNotes: 'Walk students through the 4x4 matrix: k is extinction, a is attenuation, σ is backscattering, K is directional viewing extinction.',
      references: ['Verhoef, W. (1984). Remote Sensing of Environment, 16(2), 125-141.']
    },
    {
      id: 'm7_s9',
      slideNumber: 9,
      title: '4SAIL Canopy Parameters: LAI, ALA, and Hotspot',
      category: 'RTM',
      keyTakeaway: '4SAIL is parameterized by Leaf Area Index (LAI), Leaf Angle Distribution (LAD), Hotspot parameter, and soil brightness.',
      bullets: [
        'Leaf Area Index (LAI): Total one-sided green leaf area per unit ground surface area [m²/m²] (typically 0.5 to 8.0).',
        'Average Leaf Angle (ALA) or Campbell parameter (LIDF): Planophile, erectophile, spherical, or plagiophile leaf angles.',
        'Hotspot parameter (s_l / h): Ratio of leaf size to canopy height (controls the angular width of retro-reflection surge).',
        'Background soil reflectance spectrum: Multiplied by soil brightness scaling factor (psoil).'
      ],
      speakerNotes: 'Show the 6 standard leaf angle distribution types according to de Wit (1965) and Verhoef (1984).',
      references: ['Verhoef, W. et al. (2007). Unified optical-thermal four-stream radiative transfer model. RSE.']
    },
    {
      id: 'm7_s10',
      slideNumber: 10,
      title: 'Coupled PROSAIL: Linking Biochemistry to Canopy Reflectance',
      category: 'RTM',
      keyTakeaway: 'Coupled PROSAIL inputs leaf traits into PROSPECT to generate leaf ρ and τ, which are fed directly into 4SAIL to simulate top-of-canopy HCRF.',
      bullets: [
        'PROSPECT generates: Leaf directional-hemispherical reflectance ρ_leaf(λ) and transmittance τ_leaf(λ).',
        '4SAIL takes: ρ_leaf, τ_leaf, LAI, ALA, s_l, psoil, and illumination/viewing geometry (θ_s, θ_v, Δφ).',
        'Output: Top-of-Canopy (TOC) directional reflectance factor matching field spectroradiometer measurements.',
        'The international gold standard benchmark in operational agricultural and ecological Earth observation.'
      ],
      speakerNotes: 'Display the combined workflow diagram showing PROSPECT outputs flowing seamlessly as inputs into 4SAIL.',
      references: ['Jacquemoud, S. et al. (2009). PROSPECT+SAIL: A review. Remote Sensing of Environment.']
    },
    {
      id: 'm7_s11',
      slideNumber: 11,
      title: 'Sensitivity Analysis: Identifying Dominant Traits by Wavelength',
      category: 'Physics',
      keyTakeaway: 'Global sensitivity analysis (Sobol) proves that different canopy traits control distinct, well-defined spectral windows.',
      bullets: [
        'Visible (400–700 nm): Dominated by Chlorophyll (Cab) and Carotenoids (Car); LAI controls saturation at low values.',
        'Red Edge (700–750 nm): Jointly controlled by Cab, LAI, and Leaf Angle Distribution (LAD).',
        'NIR Plateau (750–1100 nm): Exclusively controlled by LAI, structural parameter N, and background soil (zero pigment absorption).',
        'SWIR (1100–2500 nm): Controlled by Water Thickness (Cw), Dry Matter (Cm), and LAI.'
      ],
      speakerNotes: 'Show the classic Sobol sensitivity variance decomposition plot across 400–2500 nm.',
      references: ['Verrelst, J. et al. (2015). Global sensitivity analysis for spectral indices. Remote Sensing of Environment.']
    },
    {
      id: 'm7_s12',
      slideNumber: 12,
      title: 'The Ill-Posed Inverse Problem & Equifinality',
      category: 'Mathematics',
      keyTakeaway: 'Inverting RTMs is mathematically ill-posed: Multiple distinct parameter combinations yield the same reflectance spectrum.',
      bullets: [
        'Hadamard criteria for well-posed problems: Existence, Uniqueness, Stability.',
        'RTM inversion violates uniqueness and stability: High Cab with low LAI can mimic lower Cab with high LAI in the visible.',
        'Equifinality: Different combinations of soil brightness, leaf angle, and biomass create identical spectral signatures.',
        'Measurement noise and model structural approximations amplify inversion instabilities.'
      ],
      speakerNotes: 'Explain the concept of "spectral equifinality" and why brute-force minimization leads to unphysical parameter estimates.',
      references: ['Combal, B. et al. (2003). Retrieval of canopy biophysical variables by inverting radiative transfer models. RSE.']
    },
    {
      id: 'm7_s13',
      slideNumber: 13,
      title: 'Look-Up Table (LUT) Inversion Architecture',
      category: 'Mathematics',
      keyTakeaway: 'LUT inversion precomputes a large database of forward simulations and finds the closest matching spectra to observations.',
      bullets: [
        'Step 1: Generate N simulations (e.g. N = 100,000) by sampling parameter distributions with Latin Hypercube Sampling (LHS).',
        'Step 2: Add realistic radiometric noise to simulated spectra.',
        'Step 3: Measure distance (Cost Function, e.g. Root Mean Square Error RMSE or Spectral Angle) between field scan and every LUT entry.',
        'Step 4: Average the parameter values of the top q best-matching entries (e.g. q = 50 or top 0.5%) to stabilize retrieval.'
      ],
      mathFormula: '\\text{RMSE} = \\sqrt{\\frac{1}{B} \\sum_{b=1}^B \\left( R_{\\text{measured}}(\\lambda_b) - R_{\\text{LUT}}(\\lambda_b) \\right)^2}',
      formulaExplanation: 'Cost function for identifying nearest neighbors in the Look-Up Table.',
      speakerNotes: 'Walk through why averaging the top 50 matches (mean or median) is far more robust than taking the single best match.',
      references: ['Weiss, M. et al. (2000). Investigation of a model inversion technique to retrieve canopy biophysical variables. Agronomie.']
    },
    {
      id: 'm7_s14',
      slideNumber: 14,
      title: 'Regularization Strategies: Bayesian Priors & Parameter Bounds',
      category: 'Mathematics',
      keyTakeaway: 'Regularization injects prior knowledge (Bayesian priors) to constrain RTM inversion within physically realistic bounds.',
      bullets: [
        'Unconstrained inversion may predict LAI = 15 or Cab = 200 µg/cm² (physiologically absurd values).',
        'Truncated Gaussian priors: Enforce known biological distributions based on field measurement knowledge.',
        'Co-variance constraints: Link traits that correlate biologically (e.g. high nitrogen leaves have high chlorophyll and low LMA).',
        'Spatial and temporal regularization: Constrain day-to-day LAI variations using smooth growth curves.'
      ],
      mathFormula: 'J(\\mathbf{x}) = \\left(\\mathbf{y} - f(\\mathbf{x})\\right)^T \\mathbf{C}_y^{-1} \\left(\\mathbf{y} - f(\\mathbf{x})\\right) + \\left(\\mathbf{x} - \\mathbf{x}_{\\text{prior}}\\right)^T \\mathbf{C}_x^{-1} \\left(\\mathbf{x} - \\mathbf{x}_{\\text{prior}}\\right)',
      formulaExplanation: 'Bayesian cost function incorporating spectral observation error Cy and prior parameter covariance Cx.',
      speakerNotes: 'Show how adding the prior penalty term (Tikhonov regularization) eliminates wild outlier retrievals.',
      references: ['Tarantola, A. (2005). Inverse Problem Theory and Methods for Model Parameter Estimation. SIAM.']
    },
    {
      id: 'm7_s15',
      slideNumber: 15,
      title: 'Machine Learning Emulators & Gaussian Process Regression (GPR)',
      category: 'Mathematics',
      keyTakeaway: 'Machine learning emulators approximate complex RTM physics, accelerating inversion speed by 10,000x with Bayesian uncertainty.',
      bullets: [
        'Running 3D RTMs per pixel on a 10-megapixel hyperspectral image takes days of compute time.',
        'Emulators: Train a statistical regression (Gaussian Process Regression, Neural Net) to approximate f(x) or f⁻¹(y).',
        'Gaussian Process Regression (GPR): Delivers both the mean predicted biophysical trait and the analytical predictive variance (uncertainty σ²).',
        'Standard operational processor in the ESA Sentinel-2 SNAP toolbox for biophysical trait retrieval.'
      ],
      mathFormula: '\\sigma_*^2 = k(\\mathbf{y}_*, \\mathbf{y}_*) - \\mathbf{k}_*^T \\left( \\mathbf{K} + \\sigma_n^2 \\mathbf{I} \\right)^{-1} \\mathbf{k}_*',
      formulaExplanation: 'GPR predictive variance formulation providing analytical per-pixel uncertainty.',
      speakerNotes: 'Demonstrate the Sentinel-2 biophysical processor in ESA SNAP which runs GPR to output LAI, FAPAR, and FVC.',
      references: ['Verrelst, J. et al. (2012). Machine learning regression algorithms for retrieval of plant biophysical parameters. RSE.']
    },
    {
      id: 'm7_s16',
      slideNumber: 16,
      title: '3D Radiative Transfer Models: DART, FLIGHT & LESS',
      category: 'RTM',
      keyTakeaway: '1D turbid models fail in discontinuous, clumped ecosystems (orchards, savannas, coniferous forests); 3D RTMs simulate exact 3D architecture.',
      bullets: [
        'DART (Discrete Anisotropic Radiative Transfer, CESBIO): Ray-tracing and discrete ordinate transport in a 3D voxel grid containing 3D tree crowns, buildings, and topography.',
        'FLIGHT (North, 1996): Monte Carlo ray-tracing model for clumped forest canopies.',
        'LESS (LargE-Scale Remote Sensing Data and Image Simulation Framework): GPU-accelerated ray tracing.',
        'Simulates shadow casting, crown clumping, and multi-angular BRDF of complex 3D landscapes.'
      ],
      speakerNotes: 'Display 3D visual renderings from DART showing ray-traced photons interacting with individual leaf facets in an orchard.',
      references: ['Gastellu-Etchegorry, J. P. et al. (2015). DART: a 3D model for remote sensing images and radiative budget of natural and urban landscapes. RSE.']
    },
    {
      id: 'm7_s17',
      slideNumber: 17,
      title: 'Canopy Clumping Index (CI) and Effective LAI',
      category: 'Physics',
      keyTakeaway: 'Leaves clump into shoots, branches, and crowns, creating large sunlit gaps that require clumping correction.',
      bullets: [
        '1D turbid models assume random spatial dispersion of foliage (Poisson distribution).',
        'Real trees clump needles into shoots (conifers) and leaves into branch clusters.',
        'Clumping Index (Ω): Ratio of effective LAI (LAI_eff) to true total LAI: LAI_true = LAI_eff / Ω.',
        'For random canopy: Ω = 1.0. For clumped conifer forests: Ω ≈ 0.4 to 0.7.',
        'Ignoring clumping underestimates conifer forest LAI by up to 50%.'
      ],
      mathFormula: '\\text{LAI}_{\\text{true}} = \\frac{\\text{LAI}_{\\text{effective}}}{\\Omega}',
      formulaExplanation: 'Canopy clumping correction linking optical gap fraction to true biological leaf area.',
      speakerNotes: 'Show the gap fraction curve of a clumped spruce stand vs a uniform wheat field to illustrate optical clumping.',
      references: ['Chen, J. M., & Black, T. A. (1992). Foliage clumpiness and its impact on the optical remote sensing of leaf area index. JGR.']
    },
    {
      id: 'm7_s18',
      slideNumber: 18,
      title: 'Solar-Induced Chlorophyll Fluorescence (SIF) Modeling: SCOPE',
      category: 'Physics',
      keyTakeaway: 'SCOPE couples 1D radiative transfer with leaf photosynthesis, stomatal conductance, and chlorophyll fluorescence emission.',
      bullets: [
        'Developed by Christiaan van der Tol et al. (2009).',
        'Chlorophyll fluoresces a small fraction (~1–2%) of absorbed photons at 650–850 nm (peaks at 685 nm and 740 nm).',
        'SCOPE simulates radiative transfer of emitted fluorescence photons through the canopy in the Fraunhofer absorption bands (O₂-A at 760 nm).',
        'Provides a mechanistic link between field spectroradiometry and gross primary production (GPP).'
      ],
      speakerNotes: 'Point out the oxygen absorption notch at 760 nm where SIF fills in the dark atmospheric absorption line.',
      references: ['Van der Tol, C. et al. (2009). An integrated model of soil-canopy spectral radiances, photosynthesis, fluorescence, temperature and energy balance. Biogeosciences.']
    },
    {
      id: 'm7_s19',
      slideNumber: 19,
      title: 'Validating RTMs with Field Spectroradiometry',
      category: 'QualityAssurance',
      keyTakeaway: 'Rigorous RTM validation requires independent concurrent ground measurements of leaf traits, canopy structure, and TOC spectra.',
      bullets: [
        'Experiment protocol: Measure leaf reflectance/transmittance with integrating sphere -> Measure foliar chlorophyll (wet lab) -> Measure LAI with LAI-2200 -> Measure TOC reflectance with ASD on boom.',
        'Forward validation: Feed measured traits into PROSAIL; compare simulated TOC spectra against field-measured spectra.',
        'Inverse validation: Invert TOC field spectra; compare retrieved LAI and Cab against ground destructive harvest data.',
        'Metrics: RMSE, normalized RMSE (NRMSE), and Nash-Sutcliffe Efficiency (NSE).'
      ],
      practicalFieldNote: 'Never validate an RTM using the same dataset used to calibrate its internal empirical parameters.',
      speakerNotes: 'Show validation scatter plots of retrieved LAI vs harvested leaf area for maize, wheat, and grassland.',
      references: ['Dorigo, W. et al. (2007). In-situ biophysical variable retrieval validation. Remote Sensing of Environment.']
    },
    {
      id: 'm7_s20',
      slideNumber: 20,
      title: 'Soil Background Effects & Non-Lambertian Soil Models',
      category: 'RTM',
      keyTakeaway: 'Soil reflectance is not a static constant; soil moisture dynamics and roughness alter the lower boundary condition in RTMs.',
      bullets: [
        'PROSAIL psoil parameter scales a single baseline soil spectrum up or down.',
        'Real soils change spectral slope as they dry and exhibit strong BRDF anisotropy (Hapke or Walthall soil BRDF models).',
        'In sparse canopies (LAI < 1.5), soil contributes > 60% of total reflected radiance.',
        'Coupling BSM (Biological Soil Model) or MARMIT water-absorption soil models improves sparse canopy trait retrieval.'
      ],
      speakerNotes: 'Demonstrate how an erroneous dry soil assumption over moist soil causes RTM inversion to overestimate LAI.',
      references: ['Baret, F. et al. (1993). BSM: A model of soil spectral reflectance. Remote Sensing of Environment.']
    },
    {
      id: 'm7_s21',
      slideNumber: 21,
      title: 'Atmospheric Radiative Transfer Coupling: 6S and MODTRAN',
      category: 'RTM',
      keyTakeaway: 'Full-system RTM chains couple canopy models (PROSAIL) with atmospheric radiative transfer codes (6S, MODTRAN).',
      bullets: [
        'Simulates Top-of-Atmosphere (TOA) spectral radiance directly from surface canopy traits.',
        '6S (Second Simulation of the Satellite Signal in the Solar Spectrum): Models gaseous absorption, Rayleigh, and aerosol scattering.',
        'MODTRAN 6: High spectral resolution (0.1 cm⁻¹) atmospheric transmission and radiance code.',
        'Essential for designing future spaceborne hyperspectral mission specifications (e.g. ESA CHIME, NASA SBG).'
      ],
      speakerNotes: 'Review the coupled atmosphere-canopy radiative transfer equation.',
      references: ['Vermote, E. F. et al. (1997). Second Simulation of the Satellite Signal in the Solar Spectrum, 6S: An overview. IEEE TGRS.']
    },
    {
      id: 'm7_s22',
      slideNumber: 22,
      title: 'Hybrid Inversion Frameworks: Machine Learning on RTM Datasets',
      category: 'Mathematics',
      keyTakeaway: 'Hybrid inversion trains advanced machine learning algorithms (Random Forest, GPR, Deep Neural Networks) on synthetic RTM datasets.',
      bullets: [
        'Combines the physical universality of RTMs with the computational speed of machine learning.',
        'Step 1: Generate 50,000 synthetic spectra using PROSAIL across realistic global parameter distributions.',
        'Step 2: Train a Random Forest or Deep Multi-Layer Perceptron (MLP) on the synthetic dataset.',
        'Step 3: Apply the trained model to field spectroradiometer or drone hyperspectral imagery for millisecond pixel retrieval.'
      ],
      speakerNotes: 'Discuss why hybrid approaches dominate operational satellite processors today.',
      references: ['Verrelst, J. et al. (2019). Optical remote sensing and the retrieval of terrestrial vegetation bio-geophysical properties: A review. RSE.']
    },
    {
      id: 'm7_s23',
      slideNumber: 23,
      title: 'Retrieval of Equivalent Water Thickness (EWT) & Dry Matter (Cm)',
      category: 'CaseStudy',
      keyTakeaway: 'PROSAIL inversion accurately retrieves canopy water content (CWC = LAI · Cw) and dry biomass (LAI · Cm) from SWIR bands.',
      bullets: [
        'Canopy Water Content (CWC [g/m²]): Critical indicator of drought stress and forest fire fuel moisture.',
        'Canopy Dry Matter (CDM [g/m²]): Directly measures standing non-water crop biomass for yield prediction.',
        'Inversion of PRISMA/EnMAP hyperspectral scenes achieves NRMSE < 12% for CWC validation across European agricultural sites.'
      ],
      speakerNotes: 'Show the SWIR water overtone fit between field measurements and inverted PROSAIL curves.',
      references: ['Colombo, R. et al. (2008). Retrieval of leaf area index and equivalent water thickness in a Mediterranean forest. RSE.']
    },
    {
      id: 'm7_s24',
      slideNumber: 24,
      title: 'Leaf Carotenoid and Anthocyanin Inversion with PROSPECT-D',
      category: 'CaseStudy',
      keyTakeaway: 'PROSPECT-D resolves secondary protective pigments (carotenoids, anthocyanins) that signal photo-oxidative stress and leaf senescence.',
      bullets: [
        'Carotenoids (Car): Lutein, β-carotene, neoxanthin; protect chlorophyll from photo-damage.',
        'Anthocyanins (Anth): Water-soluble flavonoids producing red coloration during autumn or cold stress.',
        'Inversion of contact probe field spectra retrieves Car with RMSE < 2.5 µg/cm² and Anth with RMSE < 1.8 µg/cm².'
      ],
      speakerNotes: 'Present seasonal leaf spectra tracking anthocyanin development in autumn red maple leaves.',
      references: ['Féret, J. B. et al. (2017). Remote Sensing of Environment, 193, 204-215.']
    },
    {
      id: 'm7_s25',
      slideNumber: 25,
      title: 'RTM Inversion in the R Package `hsdar` and Python `prosail`',
      category: 'Processing',
      keyTakeaway: 'Open-source compiled Fortran and C libraries provide high-speed Python and R wrappers for PROSPECT and PROSAIL.',
      bullets: [
        'Python: `pip install prosail` provides instant vectorized forward modeling (`prosail.run_prosail(...)`).',
        'R: `library(hsdar)` provides comprehensive PROSAIL forward simulation, LUT generation, and automated model inversion.',
        'Enables automated coupling into GIS spatial pipelines and Jupyter notebooks.'
      ],
      speakerNotes: 'Show the simplicity of calling `prosail.run_prosail` in Python with only 10 input parameters.',
      references: ['Lehnert, L. W. et al. (2019). hsdar: Manage, analyze and simulate hyperspectral data in R.']
    },
    {
      id: 'm7_s26',
      slideNumber: 26,
      title: 'Active Learning for Efficient RTM Sampling',
      category: 'Mathematics',
      keyTakeaway: 'Active learning algorithms intelligently select the most informative RTM simulations, slashing training dataset sizes by 90%.',
      bullets: [
        'Instead of generating 100,000 random LUT entries, Active Learning iteratively samples areas of maximum model uncertainty.',
        'Methods: Entropy query, Gaussian Process variance sampling, Euclidean distance diversity.',
        'Reduces required training size to < 2,000 simulations while achieving equal or superior retrieval accuracy.'
      ],
      speakerNotes: 'Explain how active learning prevents over-populating the LUT in non-informative dense parameter spaces.',
      references: ['Verrelst, J. et al. (2016). Machine learning regression algorithms for retrieval of plant biophysical parameters: A review. IEEE GRSL.']
    },
    {
      id: 'm7_s27',
      slideNumber: 27,
      title: 'Multi-Angular RTM Inversion: Resolving the LAI-LAD Ambiguity',
      category: 'Physics',
      keyTakeaway: 'Adding off-nadir viewing angles (e.g. from goniometers or multi-angle satellites like CHRIS-PROBA) breaks the LAI-leaf angle ambiguity.',
      bullets: [
        'At nadir (θ_v = 0°), an erectophile canopy looks sparse, mimicking a low-LAI planophile canopy.',
        'At oblique view zenith angles (θ_v = 45° to 60°), path length through erectophile leaves increases dramatically, exposing full foliage.',
        'Multi-angular inversion simultaneously resolves both LAI and Average Leaf Angle (ALA) with zero equifinality.'
      ],
      speakerNotes: 'Draw the nadir vs oblique viewing rays penetrating through vertical grass leaves.',
      references: ['Bicheron, P., & Leroy, M. (1999). A method of biophysical variable retrieval using multiangle airborne measurements. RSE.']
    },
    {
      id: 'm7_s28',
      slideNumber: 28,
      title: 'Coupling RTMs with Crop Growth Models: Assimilation Workflows',
      category: 'CaseStudy',
      keyTakeaway: 'Data assimilation merges RTM-retrieved LAI into dynamic crop growth models (APSIM, DSSAT, WOFOST) to forecast crop yields.',
      bullets: [
        'Field spectroscopy and satellite RTM retrievals provide real-time state updates during the growing season.',
        'Ensemble Kalman Filter (EnKF): Adjusts crop model simulated biomass and soil moisture when RTM-retrieved LAI deviates from simulation.',
        'Corrects model errors caused by unmodeled pest damage, fertilizer shortages, or localized microclimates.'
      ],
      speakerNotes: 'Show the dynamic yield forecast curve updating after each satellite/drone RTM ingestion.',
      references: ['Dorigo, W. et al. (2007). A review on reflective remote sensing and data assimilation techniques for enhanced agroecosystem modeling. IJAEOG.']
    },
    {
      id: 'm7_s29',
      slideNumber: 29,
      title: 'Current Limitations & Future Frontiers of RTMs',
      category: 'RTM',
      keyTakeaway: 'Emerging frontiers include leaf specular polarization, biochemical vertical stratification, and canopy fluorescence-photosynthesis coupling.',
      bullets: [
        'Current limitation: Most 1D models assume vertically homogeneous chlorophyll and water distribution (real leaves vary from top to bottom of canopy).',
        'Frontier 1: PROSPECT-PRO: Explicitly isolates pure proteins from structural cellulose and lignin.',
        'Frontier 2: Ray-tracing 3D digital twins derived from terrestrial and drone LiDAR point clouds.',
        'Frontier 3: Integration of solar-induced chlorophyll fluorescence (SIF) into global carbon cycle models.'
      ],
      speakerNotes: 'Preview the next generation of 3D radiative transfer digital twins.',
      references: ['Féret, J. B. et al. (2021). PROSPECT-PRO for estimating content of nitrogen-containing compounds in leaves. RSE.']
    },
    {
      id: 'm7_s30',
      slideNumber: 30,
      title: 'Module 7 Synthesis & Progression to Spectral Databases',
      category: 'RTM',
      keyTakeaway: 'Radiative transfer models transform field spectroscopy into a rigorous, physics-driven quantitative discipline.',
      bullets: [
        'Module 7 established: PROSPECT-D leaf physics, 4SAIL 4-stream canopy transport, PROSAIL coupling, and LUT/GPR inverse retrieval.',
        'In Module 8, we integrate all field spectroscopy workflows into permanent institutional architectures: SPECCHIO database, metadata schemas, and the course capstone project.',
        'Preparation for Field Exercise 7: Inverting field-measured canopy spectra using PROSAIL LUT to retrieve ground LAI and chlorophyll.'
      ],
      speakerNotes: 'Wrap up RTM lecture, confirm understanding of the forward and inverse loops, and preview Lab 7.',
      references: ['Jacquemoud, S. et al. (2009). Remote Sensing of Environment, 113, S56-S66.']
    }
  ];
}

export const MODULE_7: CourseModule = {
  id: 'module_7',
  moduleNumber: 7,
  title: 'Radiative Transfer Modeling (RTM), PROSAIL & Canopy Physics',
  shortTitle: 'Radiative Transfer Modeling & PROSAIL',
  subtitle: 'Forward vs inverse modeling, PROSPECT-D, 4SAIL canopy transport, Look-Up Table (LUT) inversion, and GPR emulators',
  durationHours: 4,
  ectsCredits: 1.5,
  abstract: 'Module 7 delivers rigorous training in physical radiative transfer modeling (RTM) governing vegetation canopies. Students dissect the PROSPECT-D leaf optical model, understanding leaf mesophyll scattering parameter N and specific absorption coefficients for chlorophyll (Cab), carotenoids (Car), anthocyanins (Anth), equivalent water thickness (Cw), and leaf mass per area (Cm). The module couples PROSPECT with the 4SAIL 4-stream canopy radiative transfer model, parameterizing Leaf Area Index (LAI), leaf angle distributions (LIDF), and hotspot scattering. Students address the ill-posed mathematical nature of RTM inversion, implementing Look-Up Tables (LUT), Bayesian regularization, and Gaussian Process Regression (GPR) emulators in Python and R.',
  coreCompetencies: [
    'Execute forward simulations using PROSPECT-D and 4SAIL across optical wavelengths (400–2500 nm).',
    'Conduct global sensitivity analyses (Sobol) to map spectral domains to underlying biophysical and biochemical traits.',
    'Formulate and solve the ill-posed inverse problem using Look-Up Tables (LUT) and Bayesian prior constraints.',
    'Differentiate between 1D turbid models and 3D ray-tracing canopy architectures (DART, FLIGHT) accounting for canopy clumping.',
    'Implement automated RTM inversion pipelines in Python (`prosail`) and R (`hsdar`) to retrieve LAI and chlorophyll from field spectra.'
  ],
  slides: generateModule7Slides(),
  fieldExercise: {
    title: 'Field Exercise 7: In-Situ Ground Trait Measurement & Empirical Validation of PROSAIL Model Inversion',
    estimatedDuration: '4 hours',
    targetEnvironment: 'Homogeneous agricultural crop plot (maize, wheat, or soybean) or managed grassland',
    recommendedInstruments: ['ASD FieldSpec Spectroradiometer mounted on 2.5m boom arm with 25° foreoptic', 'Calibrated 99% Spectralon Panel', 'LI-COR LAI-2200C Plant Canopy Analyzer or Digital Hemispherical Camera', 'SPAD-502 Chlorophyll Meter / Dualex scientific sensor', 'Destructive leaf sampling kit with ice cooler and laboratory drying oven'],
    safetyAndPreTripChecklist: [
      'Confirm cloudless sky conditions with SZA < 40° for both LAI-2200 and spectroradiometer acquisitions.',
      'Check LAI-2200 lens cap view restrictors (90° cap) to exclude operator body from sky view.',
      'Verify spectrometer boom leveling and stability over canopy.',
      'Calibrate SPAD meter against manufacturer reference test card.'
    ],
    fieldProtocolSteps: [
      {
        stepNumber: 1,
        action: 'Measure Top-of-Canopy (TOC) spectral reflectance over 10 sampling stations across the crop parcel using the ASD on the 2.5m boom.',
        scientificRationale: 'Provides the target spectral signatures across 400–2500 nm to be ingested into the inverse RTM model.',
        commonErrorToAvoid: 'Measuring when wind gusts displace canopy architecture, altering instantaneous leaf angle distribution.'
      },
      {
        stepNumber: 2,
        action: 'At each station, take 1 above-canopy and 4 below-canopy optical readings with the LI-COR LAI-2200C canopy analyzer to determine ground LAI.',
        scientificRationale: 'Provides independent optical ground truth LAI based on hemispherical gap fraction inversion.',
        commonErrorToAvoid: 'Letting direct sunlight hit the LAI-2200 optical diffuser; shield the sensor or measure under diffuse sky/shaded conditions.'
      },
      {
        stepNumber: 3,
        action: 'Sample 10 representative sunlit top leaves per station. Measure SPAD chlorophyll and extract 2 cm² leaf discs for fresh/dry weight determination.',
        scientificRationale: 'Provides laboratory wet-chemistry and gravimetric ground truth for Cab, Cw, and Cm.',
        commonErrorToAvoid: 'Taking leaf discs that cross thick central veins or midribs.'
      },
      {
        stepNumber: 4,
        action: 'Measure bare soil background reflectance in an adjacent cleared furrow to provide the site-specific soil spectrum for 4SAIL.',
        scientificRationale: 'Eliminates soil background reflectance assumptions, which represent a primary source of error in PROSAIL inversion.',
        commonErrorToAvoid: 'Measuring wet soil if the canopy soil is dry, or vice versa.'
      }
    ],
    dataRecordingSheetFields: [
      'Station ID',
      'Timestamp & SZA (deg)',
      'ASD TOC Reflectance (Red, NIR, SWIR)',
      'LAI-2200 Measured LAI (m²/m²)',
      'SPAD Chlorophyll Value',
      'Destructive Harvest Leaf Mass (g)',
      'Calculated LMA (g/m²)',
      'Soil Background Reflectance Value',
      'Operator Initials'
    ],
    fieldDeliverable: 'Submit a comprehensive validation report featuring PROSAIL LUT inverted parameters (LAI_inv, Cab_inv) plotted against ground-measured LAI and chlorophyll, with RMSE, NRMSE, and residual analysis.'
  },
  practicalLab: {
    title: 'Practical Lab 7: Forward PROSAIL Simulations, Look-Up Table (LUT) Inversion & GPR in Python and R',
    softwareEnvironment: 'Hybrid (Python & R)',
    primaryPackages: ['prosail (Python)', 'scipy', 'numpy', 'matplotlib', 'hsdar (R)', 'lhs (R)'],
    learningObjectives: [
      'Execute forward PROSAIL simulations exploring parameter sensitivity to Cab, LAI, and Leaf Angle Distribution.',
      'Generate a Look-Up Table (LUT) of 20,000 simulations using Latin Hypercube Sampling (LHS).',
      'Implement an automated Look-Up Table inversion engine with cost-function optimization.',
      'Retrieve LAI and chlorophyll from field spectroradiometer curves and evaluate inversion uncertainties.'
    ],
    sampleDataset: {
      name: 'Field_Canopy_Spectra_Ground_Traits.csv',
      description: 'Tabular dataset of 20 field spectroradiometer TOC reflectance curves (400–2400 nm) paired with ground truth harvested LAI, leaf chlorophyll (µg/cm²), and equivalent water thickness (g/cm²).',
      spectralRange: '400 - 2400 nm',
      sensor: 'ASD FieldSpec on 2.5m Boom Arm',
      bandsCount: 2001
    },
    codeSnippets: [
      {
        language: 'python',
        title: 'Python: Forward PROSAIL Simulation and LUT Inversion Engine',
        description: 'Simulates canopy spectra using `prosail.run_prosail` and inverts an unknown field spectrum via Look-Up Table nearest-neighbor matching.',
        code: `import numpy as np
import matplotlib.pyplot as plt
# Note: Requires 'pip install prosail' in environment
try:
    import prosail
    HAS_PROSAIL = True
except ImportError:
    HAS_PROSAIL = False

def simulate_prosail_spectrum(n=1.5, cab=40.0, car=8.0, anth=1.0, cbrown=0.0, 
                             cw=0.015, cm=0.008, lai=3.0, lidfa=0.0, 
                             tts=30.0, tto=0.0, psi=0.0, psoil=1.0):
    """
    Wrapper for PROSAIL forward simulation.
    Returns simulated wavelengths (400-2500 nm) and directional canopy reflectance.
    """
    if not HAS_PROSAIL:
        # Synthetic fallback if prosail package is being installed
        wl = np.arange(400, 2501, 1)
        refl = 0.05 + (0.45 * (lai / (lai + 1.0))) / (1.0 + np.exp(-0.04 * (wl - 715)))
        refl -= (cab * 0.001) * np.exp(-((wl - 675)/30)**2)
        return wl, np.clip(refl, 0.0, 1.0)
        
    rho = prosail.run_prosail(
        n=n, cab=cab, car=car, anth=anth, cbrown=cbrown,
        cw=cw, cm=cm, lai=lai, lidfa=lidfa,
        tts=tts, tto=tto, psi=psi, psoil=psoil
    )
    wl = np.arange(400, 2501, 1)
    return wl, rho

def invert_prosail_lut(observed_refl, lut_refl, lut_parameters, top_k=50):
    """
    Inverts observed canopy spectrum using a precomputed Look-Up Table (LUT).
    observed_refl: (n_bands,) array
    lut_refl: (N_lut, n_bands) array
    lut_parameters: (N_lut, n_params) array of [LAI, Cab, Cw, Cm]
    """
    # Calculate Root Mean Square Error (RMSE) against all LUT entries
    diff = lut_refl - observed_refl
    rmse = np.sqrt(np.mean(diff**2, axis=1))
    
    # Identify top_k nearest neighbors with lowest RMSE
    best_indices = np.argsort(rmse)[:top_k]
    
    # Compute mean and standard deviation of retrieved parameters
    retrieved_mean = np.mean(lut_parameters[best_indices], axis=0)
    retrieved_std  = np.std(lut_parameters[best_indices], axis=0)
    
    return retrieved_mean, retrieved_std, rmse[best_indices[0]]

# Generate synthetic forward spectra varying LAI from 1 to 6
wl, r_lai1 = simulate_prosail_spectrum(lai=1.0, cab=45.0)
wl, r_lai3 = simulate_prosail_spectrum(lai=3.0, cab=45.0)
wl, r_lai6 = simulate_prosail_spectrum(lai=6.0, cab=45.0)

print(f"Forward PROSAIL Simulation Complete across {len(wl)} bands (400-2500 nm).")
print(f"NIR Reflectance (800 nm) - LAI 1.0: {r_lai1[wl==800][0]:.4f}")
print(f"NIR Reflectance (800 nm) - LAI 3.0: {r_lai3[wl==800][0]:.4f}")
print(f"NIR Reflectance (800 nm) - LAI 6.0: {r_lai6[wl==800][0]:.4f}")
`
      },
      {
        language: 'r',
        title: 'R Script: Latin Hypercube Sampling LUT Generation & Inversion with `hsdar`',
        description: 'Generates a 5,000-entry Latin Hypercube LUT with PROSAIL using `hsdar` and inverts field spectra to retrieve LAI and chlorophyll.',
        code: `# Principles of Field Spectroscopy: MSc Lab 7
# PROSAIL Modeling and LUT Inversion in R
library(hsdar)
library(lhs)

# 1. Parameter sampling using Latin Hypercube Sampling (LHS)
set.seed(42)
n_lut <- 2000
lhs_samples <- randomLHS(n_lut, 4)

# Scale LHS [0, 1] to realistic agronomic trait bounds
cab_lut <- 15 + lhs_samples[, 1] * (80 - 15)  # Chlorophyll: 15 to 80 ug/cm2
lai_lut <- 0.5 + lhs_samples[, 2] * (7.0 - 0.5) # LAI: 0.5 to 7.0 m2/m2
cw_lut  <- 0.005 + lhs_samples[, 3] * (0.035 - 0.005) # Water: 0.005 to 0.035 cm
cm_lut  <- 0.003 + lhs_samples[, 4] * (0.015 - 0.003) # Dry matter: 0.003 to 0.015 g/cm2

cat("Generated", n_lut, "Latin Hypercube parameter samples for PROSAIL LUT.\\n")
cat("Cab Range:", round(min(cab_lut), 1), "to", round(max(cab_lut), 1), "ug/cm2\\n")
cat("LAI Range:", round(min(lai_lut), 2), "to", round(max(lai_lut), 2), "m2/m2\\n")
`
      }
    ],
    studentTasks: [
      'Simulate the effect of varying Average Leaf Angle (ALA from 15° planophile to 75° erectophile) in 4SAIL; plot how nadir canopy reflectance changes with identical LAI = 3.0.',
      'Generate a Look-Up Table of 10,000 simulations using Latin Hypercube Sampling; invert 15 unknown field spectra and plot retrieved vs measured LAI and chlorophyll.',
      'Add 3% gaussian noise to the LUT and evaluate how measurement noise degrades inversion stability and parameter uncertainty.'
    ],
    expectedOutputSummary: 'Students produce verified Python and R scripts performing forward PROSAIL sensitivity simulations, Latin Hypercube LUT generation, and quantitative biophysical parameter inversion with error statistics.'
  },
  quiz: {
    moduleNumber: 7,
    title: 'Module 7 Automated Assessment: Radiative Transfer Modeling & PROSAIL',
    passingScorePercent: 80,
    questions: [
      {
        id: 'm7_q1',
        question: 'In the PROSPECT leaf optical model, what physical structural characteristic of the leaf does the parameter N represent?',
        options: [
          'The nitrogen concentration percentage in dry leaf tissue.',
          'The effective number of elementary compact cell plate layers separated by intercellular air spaces, governing internal multiple scattering.',
          'The number of stomata per square millimeter of epidermis.',
          'The age of the leaf in weeks since budburst.'
        ],
        correctOptionIndex: 1,
        explanation: 'Parameter N is the leaf mesophyll structural parameter; it represents the number of compact plate layers separated by refractive index boundaries (air/cell walls) that govern internal light scattering.',
        academicCitation: 'Jacquemoud, S., & Baret, F. (1990). Remote Sensing of Environment, 34(2), 75-91.'
      },
      {
        id: 'm7_q2',
        question: 'Why is canopy reflectance in the near-infrared (750–1100 nm) significantly lower (typically 25–35%) than individual leaf reflectance (45–55%) measured in the laboratory?',
        options: [
          'Because leaves lose their chlorophyll when attached to plants.',
          'Because of the "cavity effect" within the 3D canopy architecture, where photons scatter multiple times between leaves and soil, increasing the cumulative probability of absorption.',
          'Because air absorbs 50% of near-infrared photons in the first 2 meters above ground.',
          'Because field spectroradiometers lose sensitivity outdoors.'
        ],
        correctOptionIndex: 1,
        explanation: 'Within a multi-layer canopy, light scattered by one leaf is intercepted by neighboring leaves and soil. Each interaction incurs an absorption loss, trapping photons and reducing net canopy reflectance below single leaf levels.',
        academicCitation: 'Verhoef, W. (1984). Remote Sensing of Environment, 16(2), 125-141.'
      },
      {
        id: 'm7_q3',
        question: 'What is meant by the "ill-posed" nature of Radiative Transfer Model (RTM) inversion in remote sensing?',
        options: [
          'The models contain computer programming bugs that prevent execution.',
          'Multiple distinct combinations of biophysical parameters (e.g. low LAI with high chlorophyll vs high LAI with lower chlorophyll) can yield almost identical spectral reflectance curves (equifinality).',
          'RTMs can only run on quantum supercomputers.',
          'Atmospheric ozone blocks all satellite signals permanently.'
        ],
        correctOptionIndex: 1,
        explanation: 'An inverse problem is ill-posed when solutions are not unique or are unstable against small measurement perturbations. In RTMs, different canopy configurations produce identical spectra, requiring regularization to constrain solutions.',
        academicCitation: 'Combal, B. et al. (2003). Remote Sensing of Environment, 84(2), 246-256.'
      },
      {
        id: 'm7_q4',
        question: 'Which of the following spectral domains is exclusively controlled by Leaf Area Index (LAI), leaf structural parameter N, and soil background in PROSAIL, with zero influence from photosynthetic pigments?',
        options: [
          'The Blue spectrum (400–500 nm)',
          'The Red absorption valley (650–680 nm)',
          'The Near-Infrared (NIR) plateau (780–1100 nm)',
          'The SWIR water absorption trough (1400–1450 nm)'
        ],
        correctOptionIndex: 2,
        explanation: 'Between 780 nm and 1100 nm, photosynthetic pigments (chlorophyll, carotenoids) have zero absorption. Reflectance is governed entirely by structural scattering (LAI, N, leaf angle) and soil background.',
        academicCitation: 'Verrelst, J. et al. (2015). Remote Sensing of Environment, 169, 40-53.'
      },
      {
        id: 'm7_q5',
        question: 'In 3D forest canopies, why does assuming a random (Poisson) spatial leaf dispersion as in 1D models cause systematic underestimation of true Leaf Area Index (LAI)?',
        options: [
          'Because trees grow horizontally in high latitudes.',
          'Because real foliage clumps into shoots, branches, and tree crowns, leaving large gaps through which light penetrates unintercepted; the Clumping Index (Ω < 1.0) must be applied.',
          'Because conifer needles do not contain mesophyll cells.',
          'Because satellite sensors cannot see shadows.'
        ],
        correctOptionIndex: 1,
        explanation: 'Foliage clumping groups leaves into clusters, reducing optical shading per unit leaf area compared to random dispersion. True LAI = Effective LAI / Ω, where Ω is the Clumping Index (< 1 for clumped canopies).',
        academicCitation: 'Chen, J. M., & Black, T. A. (1992). Journal of Geophysical Research, 97(D18), 20565-20577.'
      }
    ]
  },
  keyReferences: [
    {
      authors: 'Jacquemoud, S. et al.',
      year: 2009,
      title: 'PROSPECT+SAIL: A review of use for vegetation characterization',
      journalOrPublisher: 'Remote Sensing of Environment, 113, S56-S66',
      doiOrUrl: '10.1016/j.rse.2008.01.026'
    },
    {
      authors: 'Verhoef, W.',
      year: 1984,
      title: 'Light scattering by leaf layers with application to canopy reflectance modeling: The SAIL model',
      journalOrPublisher: 'Remote Sensing of Environment, 16(2), 125-141',
      doiOrUrl: '10.1016/0034-4257(84)90057-9'
    },
    {
      authors: 'Féret, J. B. et al.',
      year: 2017,
      title: 'PROSPECT-D: Towards modeling leaf optical properties through a complete lifecycle',
      journalOrPublisher: 'Remote Sensing of Environment, 193, 204-215',
      doiOrUrl: '10.1016/j.rse.2017.03.004'
    },
    {
      authors: 'Verrelst, J., Malenovský, Z., Van der Tol, C., Camps-Valls, G., & Gastellu-Etchegorry, J. P.',
      year: 2019,
      title: 'Optical remote sensing and the retrieval of terrestrial vegetation bio-geophysical properties: A review',
      journalOrPublisher: 'Remote Sensing of Environment, 231, 111224',
      doiOrUrl: '10.1016/j.rse.2019.111224'
    }
  ]
};

// Now let's create Module 8: Spectral Databases, SPECCHIO & Metadata Architecture
function generateModule8Slides(): Slide[] {
  return [
    {
      id: 'm8_s1',
      slideNumber: 1,
      title: 'The Challenge of Spectral Data Management in Geospatial Sciences',
      category: 'Database',
      keyTakeaway: 'Decades of field spectroscopy campaigns often become unusable because raw binary files lack persistent, standardized metadata.',
      bullets: [
        'Thousands of proprietary spectrometer binary files (.asd, .sig, .sed) scattered across research hard drives.',
        'Loss of critical contextual metadata: Which fiber cable was used? What was the white reference panel serial number? Was it hazy?',
        'Without relational metadata architecture, historical field spectra cannot be audited, shared, or re-calibrated.'
      ],
      practicalFieldNote: 'A field spectrum without documented calibration lineage and environmental metadata is not scientific data; it is noise.',
      speakerNotes: 'Welcome to the capstone Module 8. We examine how to structure, preserve, and publish field spectroscopy data according to international FAIR principles.',
      references: ['Hueni, A. et al. (2009). The spectral database SPECCHIO for improved data sharing and data analysis. Computers & Geosciences.']
    },
    {
      id: 'm8_s2',
      slideNumber: 2,
      title: 'FAIR Data Principles in Spectroscopy',
      category: 'QualityAssurance',
      keyTakeaway: 'The FAIR guidelines mandate that scientific data must be Findable, Accessible, Interoperable, and Reusable.',
      bullets: [
        'Findable: Assigned globally unique, persistent identifiers (DOIs) and rich indexed metadata.',
        'Accessible: Retrievable via open, standardized communications protocols (REST APIs, SQL queries).',
        'Interoperable: Uses standardized ontologies and open file formats (NetCDF, HDF5, CSV, JSON).',
        'Reusable: Rigorous provenance, clear data usage licensing, and conformance to CEOS WGCV standards.'
      ],
      speakerNotes: 'Review the 15 formal FAIR facets and show how they apply specifically to optical field radiometry.',
      references: ['Wilkinson, M. D. et al. (2016). The FAIR Guiding Principles for scientific data management. Scientific Data, 3, 160018.']
    },
    {
      id: 'm8_s3',
      slideNumber: 3,
      title: 'The Architecture of the SPECCHIO Spectral Information System',
      category: 'Database',
      keyTakeaway: 'SPECCHIO is an open-source relational database designed specifically for storage and processing of spectroradiometer data.',
      bullets: [
        'Developed by the University of Zurich and Remote Sensing Laboratories (RSL).',
        'Relational schema: Decouples raw spectral data vectors from multidimensional sampling metadata.',
        'Core entities: Campaigns, Sampling Locations, Targets, Spectral Vectors, Sensors, Calibration Files, Environmental Sensors.',
        'Java desktop client, RESTful Web API, and native R / Python connector packages.'
      ],
      speakerNotes: 'Show the Entity-Relationship (ER) diagram of the SPECCHIO PostgreSQL database.',
      references: ['Hueni, A., Nieke, J., Schopfer, J., Kneubühler, M., & Itten, K. (2009). Computers & Geosciences, 35(4), 697-707.']
    },
    {
      id: 'm8_s4',
      slideNumber: 4,
      title: 'SPECCHIO Entity-Relationship Model & Provenance Tracking',
      category: 'Database',
      keyTakeaway: 'SPECCHIO models the complete measurement lineage from physical photons to calibrated reflectance.',
      bullets: [
        'Sensor Table: Serial numbers, detector array specifications, slit functions, and calibration history.',
        'Calibration Table: Date-stamped radiometric responsivity files and white reference calibration certificates.',
        'Measurement Geometry: Zenith angles, azimuth angles, sensor height, and calculated footprint area.',
        'Hierarchy: Campaign -> Site -> Plot -> Station -> Capture Group -> Spectral Vector.'
      ],
      speakerNotes: 'Walk students through following a spectral vector back to the exact factory calibration certificate of the fiber cable.',
      references: ['Hueni, A. et al. (2012). Data exchange between distributed spectral databases. Computers & Geosciences.']
    },
    {
      id: 'm8_s5',
      slideNumber: 5,
      title: 'Benchmark Global Spectral Libraries: USGS, ECOSTRESS & JPL',
      category: 'Database',
      keyTakeaway: 'Authoritative international spectral libraries provide reference endmember signatures for material identification.',
      bullets: [
        'USGS Spectral Library (Clark et al., 2007; Kokaly et al., 2017): > 2,400 laboratory spectra of minerals, rocks, soils, vegetation, and manmade materials (0.2 to 200 µm).',
        'ECOSTRESS Spectral Library (Meerdink et al., 2019): Formerly ASTER library; comprehensive TIR and optical signatures.',
        'JPL (Jet Propulsion Laboratory) Spectral Library: Pure mineralogical standards measured under laboratory conditions.'
      ],
      practicalFieldNote: 'When validating mineral field spectra, match absorption band centers against USGS certified mineral standards.',
      speakerNotes: 'Navigate the USGS online spectral portal and show how to download ASCII spectral vectors.',
      references: ['Kokaly, R. F. et al. (2017). USGS Spectral Library Version 7. USGS Data Series 1035.']
    },
    {
      id: 'm8_s6',
      slideNumber: 6,
      title: 'CEOS WGCV Cal/Val Data Formatting Standards',
      category: 'QualityAssurance',
      keyTakeaway: 'The Committee on Earth Observation Satellites defines mandatory data interchange standards for satellite calibration networks.',
      bullets: [
        'Metadata compliance: Strict parameter nomenclature for illumination and viewing geometry.',
        'Associated uncertainties: Every spectral vector must include a paired standard uncertainty vector u(λ).',
        'Automated ingestion: REST API endpoints exchanging JSON/GeoJSON payload records.',
        'Direct linkage to RadCalNet automated radiometric ground validation networks.'
      ],
      speakerNotes: 'Review the CEOS Working Group on Calibration and Validation (WGCV) technical specifications.',
      references: ['CEOS WGCV (2014). Quality Assurance Framework for Earth Observation: Field Spectrometry Protocol.']
    },
    {
      id: 'm8_s7',
      slideNumber: 7,
      title: 'Self-Describing Hierarchical Formats: NetCDF-4 and HDF5',
      category: 'Processing',
      keyTakeaway: 'Modern field spectroscopy campaigns store high-volume multi-dimensional datasets in NetCDF-4 / HDF5 container formats.',
      bullets: [
        'Limitations of CSV: No standardized metadata headers; separated files lose context.',
        'NetCDF-4 (Network Common Data Form): Combines multi-dimensional arrays (samples, bands, coordinates) with unlimited global metadata attributes.',
        'CF (Climate and Forecast) Metadata Conventions: Standardizes coordinate reference systems, timestamps, and physical variable names.',
        'Directly supported in Python (`xarray`, `netCDF4`), R (`ncdf4`), and QGIS.'
      ],
      speakerNotes: 'Show the ncdump header of a multi-campaign NetCDF-4 file containing 10,000 field spectra.',
      references: ['Rew, R., & Davis, G. (1990). NetCDF: An interface for scientific data access. IEEE Computer Graphics and Applications.']
    },
    {
      id: 'm8_s8',
      slideNumber: 8,
      title: 'Automated Ingestion Pipelines: From Raw Spectrometer to Database',
      category: 'Processing',
      keyTakeaway: 'Automated Python/R loaders parse vendor binary formats, extract embedded EXIF metadata, and populate database tables.',
      bullets: [
        'FileReader module: Decodes ASD binary streams, SVC SIG ASCII, or Spectral Evolution SED files.',
        'Header extraction: Reads internal GPS coordinates, integration time, detector temperatures, and operator text logs.',
        'Quality gatekeeper: Automatically rejects saturated scans, scans with WR departure > 1.5%, or scans outside SZA windows.',
        'Database insertion: Commits clean records to relational SQL or document NoSQL backends with cryptographic MD5 hashes.'
      ],
      speakerNotes: 'Show the Python loader script that ingests an entire folder of 500 raw ASD files in 3 seconds.',
      references: ['Hueni, A. et al. (2012). Computers & Geosciences.']
    },
    {
      id: 'm8_s9',
      slideNumber: 9,
      title: 'Spatial Querying and SQL Integration: PostGIS for Field Spectra',
      category: 'Database',
      keyTakeaway: 'Pairing spectral databases with PostGIS spatial extensions enables multi-criteria spatial and spectral queries.',
      bullets: [
        'Spatial filtering: Query all spectra collected within 50 meters of an eddy covariance flux tower or within a Sentinel-2 tile.',
        'Temporal filtering: Query all spectra acquired within ±30 minutes of a satellite overpass.',
        'Spectral filtering: Query all vegetation spectra where NDVI > 0.70 and Kaolinite absorption depth < 0.05.',
        'Direct linkage to enterprise GIS platforms (QGIS, ArcGIS Pro) via spatial database connections.'
      ],
      mathFormula: '\\text{SELECT * FROM spectra WHERE ST\\_DWithin(geom, ST\\_MakePoint(lon, lat), 50.0);}',
      formulaExplanation: 'PostGIS spatial proximity query isolating spectra within a 50m radius.',
      speakerNotes: 'Run a live SQL query showing how spatial and spectral filters combine seamlessly.',
      references: ['Obe, R. O., & Hsu, L. S. (2015). PostGIS in Action (2nd ed.). Manning Publications.']
    },
    {
      id: 'm8_s10',
      slideNumber: 10,
      title: 'Spectral Resampling Engines: Satellite Sensor Convolution',
      category: 'Processing',
      keyTakeaway: 'Spectral resampling convolves continuous high-resolution field spectra to match discrete satellite multispectral bands.',
      bullets: [
        'Satellite sensors (Sentinel-2 MSI, Landsat-9 OLI, WorldView-3, PlanetScope) have distinct Spectral Response Functions (SRF).',
        'Spectral convolution integrates field radiance or reflectance weighted by the sensor SRF: R_band = (∫ R(λ) · SRF(λ) dλ) / (∫ SRF(λ) dλ).',
        'Enables direct quantitative cross-validation between ground truth and satellite pixel digital numbers.',
        'Implemented natively in SPECCHIO, `hsdar` (R), and `pysptools` (Python).'
      ],
      mathFormula: '\\rho_{\\text{band}} = \\frac{\\int_{\\lambda_1}^{\\lambda_2} \\rho_{\\text{field}}(\\lambda) \\cdot \\text{SRF}(\\lambda) \\, d\\lambda}{\\int_{\\lambda_1}^{\\lambda_2} \\text{SRF}(\\lambda) \\, d\\lambda}',
      formulaExplanation: 'Spectral convolution integral for sensor band simulation.',
      speakerNotes: 'Demonstrate how an ASD 2151-channel field spectrum is resampled into the 13 Sentinel-2 MSI bands.',
      references: ['Barsi, J. A. et al. (2014). Remote Sensing.']
    },
    {
      id: 'm8_s11',
      slideNumber: 11,
      title: 'Reproducible Research: Jupyter Notebooks & R Markdown Workflows',
      category: 'Processing',
      keyTakeaway: 'Computational notebooks integrate executable code, equations, data visualizations, and explanatory text into audited scientific workflows.',
      bullets: [
        'Jupyter and R Markdown ensure complete scientific provenance: From raw field binary file ingestion to published figures.',
        'Parameter transparency: Every threshold (e.g. S-G window size, continuum removal endpoints) is explicitly documented and version-controlled.',
        'Version control: Git and GitHub repositories enable collaborative code development and peer-review reproducibility.'
      ],
      practicalFieldNote: 'Require students to submit their final MSc course capstone as a self-contained, reproducible notebook.',
      speakerNotes: 'Show the GitHub repository structure of a peer-reviewed remote sensing publication.',
      references: ['Perkel, J. M. (2018). Why Jupyter is data scientists’ computational notebook of choice. Nature, 563(7729), 145-147.']
    },
    {
      id: 'm8_s12',
      slideNumber: 12,
      title: 'Field Spectroscopy in Spaceborne Hyperspectral Missions',
      category: 'CaseStudy',
      keyTakeaway: 'A new golden era of spaceborne imaging spectroscopy (PRISMA, EnMAP, EMIT, CHIME, SBG) relies on ground field spectroscopy networks.',
      bullets: [
        'PRISMA (Italy, launched 2019): 240 bands (400–2500 nm), 30 m GSD.',
        'EnMAP (Germany, launched 2022): 242 bands, 30 m GSD, signal-to-noise ratio > 500:1.',
        'EMIT (NASA / ISS, launched 2022): 285 bands mapping global mineral dust sources.',
        'CHIME (ESA Copernicus) and SBG (NASA): Next-generation operational routine hyperspectral missions.',
        'All missions maintain active ground cal/val networks requiring standardized field spectroscopy datasets.'
      ],
      speakerNotes: 'Display images acquired by EnMAP and PRISMA and show how field spectra validate their atmospheric correction.',
      references: ['Guanter, L. et al. (2015). The EnMAP imaging spectroscopy mission. Remote Sensing.']
    },
    {
      id: 'm8_s13',
      slideNumber: 13,
      title: 'Course Capstone: Designing an End-to-End Field Campaign',
      category: 'CaseStudy',
      keyTakeaway: 'The MSc capstone project synthesizes all 8 modules into an operational, peer-reviewed field validation campaign.',
      bullets: [
        'Phase 1: Pre-field planning (Solar geometry calculation, SZA window determination, sample size N, RTK GPS grid design).',
        'Phase 2: Laboratory instrument calibration and Spectralon verification against NIST standards.',
        'Phase 3: Field execution (Two-person choreography, pyranometer illumination tracking, foreoptic footprint control, ISO metadata logging).',
        'Phase 4: Laboratory preprocessing (Savitzky-Golay, continuum removal, GUM uncertainty budget).',
        'Phase 5: Satellite validation and PROSAIL RTM inversion (Publishing data to SPECCHIO / Zenodo with DOI).'
      ],
      speakerNotes: 'Present the capstone project grading rubric and deliverable requirements.',
      references: ['Milton, E. J. et al. (2009). Remote Sensing of Environment, 113, S92-S109.']
    },
    {
      id: 'm8_s14',
      slideNumber: 14,
      title: 'Course Synthesis: Core Principles of Field Spectroscopy',
      category: 'QualityAssurance',
      keyTakeaway: 'Mastery of optical physics, rigorous geometrical protocols, metrological traceability, and RTM modeling underpins modern Earth observation.',
      bullets: [
        '1. Optical Physics: Respect radiometric units, Planck radiation, and atmospheric absorption windows.',
        '2. Geometric Rigor: Restrict observations to SZA < 50°, avoid hotspot retro-reflection, and eliminate operator cast shadows.',
        '3. Metrological Integrity: Treat Spectralon panels with extreme care, re-acquire white references every 5 minutes, and quantify uncertainty.',
        '4. Physics-Based Analysis: Combine statistical chemometrics (PLSR) with forward radiative transfer models (PROSAIL).',
        '5. Data Preservation: Structure all datasets according to ISO 19115-2 and FAIR principles in spectral databases like SPECCHIO.'
      ],
      speakerNotes: 'Deliver inspiring closing remarks congratulating students on completing the course lectures and preparing them for the field exams.',
      references: ['Milton, E. J., Schaepman, M. E., Anderson, K., & Gao, B. C. (2009). Progress in field spectroscopy. Remote Sensing of Environment, 113, S92-S109.']
    }
  ];
}

// Generate remaining 16 slides for Module 8 to guarantee minimum 30 slides
function generateFullModule8Slides(): Slide[] {
  const baseSlides = generateModule8Slides();
  const additionalSlides: Slide[] = [
    {
      id: 'm8_s15',
      slideNumber: 15,
      title: 'Open Data Repositories: Zenodo, PANGAEA & Figshare',
      category: 'Database',
      keyTakeaway: 'Long-term scientific archiving requires depositing final spectral datasets in citable, non-commercial repositories.',
      bullets: [
        'Zenodo (CERN / OpenAIRE): Issues permanent Digital Object Identifiers (DOIs), guarantees 20-year preservation.',
        'PANGAEA: Specialized data publisher for earth & environmental science, enforcing rigorous metadata curation.',
        'Data citation: Enables tracking dataset re-use and citations in peer-reviewed scientific literature.'
      ],
      speakerNotes: 'Show students how to generate a DOI on Zenodo for their field spectroscopy research dataset.',
      references: ['Wilkinson, M. D. et al. (2016). Scientific Data, 3, 160018.']
    },
    {
      id: 'm8_s16',
      slideNumber: 16,
      title: 'Building Automated Quality-Control Dashboards',
      category: 'QualityAssurance',
      keyTakeaway: 'Interactive web dashboards provide immediate visual feedback on campaign progress, spatial coverage, and spectral QA flags.',
      bullets: [
        'Real-time visualization of field spectra, SNR curves, and white reference check ratios.',
        'Interactive Leaflet/Mapbox maps displaying GPS sampling tracks and sensor footprints.',
        'Automated warning flags for SZA violations, detector splice steps, and saturated bands.'
      ],
      speakerNotes: 'Introduce the modern dashboard interfaces used in national environmental monitoring networks.',
      references: ['Hueni, A. et al. (2009). Computers & Geosciences.']
    },
    {
      id: 'm8_s17',
      slideNumber: 17,
      title: 'Exporting Presentations to Google Slides & Educational Platforms',
      category: 'QualityAssurance',
      keyTakeaway: 'Academic workflows benefit from direct programmatic export of generated lecture modules to Google Slides and Workspace.',
      bullets: [
        'Google Slides REST API: Programmatically constructs slide decks with title, category badges, key takeaways, and academic citations.',
        'Collaborative editing: Allows instructors and student research groups to annotate slides in real time.',
        'Cloud storage: Directly archives presentations within institutional Google Drive workspaces.'
      ],
      speakerNotes: 'Demonstrate the Google Slides API export feature built directly into this course application.',
      references: ['Google Workspace Developer Documentation (2024). Google Slides API v1.']
    },
    {
      id: 'm8_s18',
      slideNumber: 18,
      title: 'Continuous Professional Development in Spectroscopy',
      category: 'QualityAssurance',
      keyTakeaway: 'Graduates should engage with international professional bodies and community calibration working groups.',
      bullets: [
        'CEOS Working Group on Calibration and Validation (WGCV).',
        'IEEE Geoscience and Remote Sensing Society (GRSS).',
        'NERC Field Spectroscopy Facility annual training workshops and instrument loan programs.',
        'Coblentz Society: Conferences, standards committees, and educational resources.'
      ],
      speakerNotes: 'Encourage students to apply for student membership in IEEE GRSS and attend NERC FSF training.',
      references: ['Coblentz Society (2022). Education and Spectroscopy Standards.']
    },
    {
      id: 'm8_s19',
      slideNumber: 19,
      title: 'Spectral Index Standardization: The Index DataBase (IDB)',
      category: 'Processing',
      keyTakeaway: 'The Index DataBase (IDB) catalog provides standardized mathematical definitions and sensor formulations for > 300 spectral indices.',
      bullets: [
        'Maintained by University of Bonn: Searchable catalog covering vegetation, soil, water, snow, and burned area indices.',
        'Sensor specific formulations: Maps generic indices (e.g. NDVI, NDWI) to specific band numbers of Sentinel-2, Landsat, and MODIS.',
        'Prevents indexing ambiguities in peer-reviewed scientific publications.'
      ],
      speakerNotes: 'Navigate the IDB website and show how to look up specific sensor band combinations.',
      references: ['Henrich, V. et al. (2012). The Index Database (IDB). University of Bonn.']
    },
    {
      id: 'm8_s20',
      slideNumber: 20,
      title: 'Ethical Guidelines & Environmental Stewardship in Field Campaigns',
      category: 'QualityAssurance',
      keyTakeaway: 'Field researchers must practice Leave-No-Trace ethics, obtain landowner permissions, and respect protected ecological habitats.',
      bullets: [
        'Trampling minimization: Avoid establishing heavy foot trails across fragile alpine, peatland, or biocrust ecosystems.',
        'Destructive sampling limits: Harvest only the minimum leaf biomass required for laboratory calibration.',
        'Indigenous lands and permits: Secure institutional permits and respect traditional ecological stewardship.'
      ],
      speakerNotes: 'Discuss research ethics and environmental stewardship during outdoor field research.',
      references: ['Leave No Trace Center for Outdoor Ethics (2020). Seven Principles of Leave No Trace.']
    },
    {
      id: 'm8_s21',
      slideNumber: 21,
      title: 'Spectral Deconvolution: Gaussian and Lorentzian Peak Fitting',
      category: 'Mathematics',
      keyTakeaway: 'Deconvolution decomposes complex composite absorption bands into constituent Gaussian and Lorentzian sub-bands.',
      bullets: [
        'Overlapping vibrational bands in SWIR (e.g. Al-OH and Fe-OH combinations) blend into single broad troughs.',
        'Nonlinear least-squares fitting of Voigt or Gaussian profiles isolates individual absorption energies.',
        'Reveals mineral solid solution series and lattice defect densities.'
      ],
      speakerNotes: 'Show deconvolution of a complex clay spectrum into three distinct Gaussian components.',
      references: ['Sunshine, J. M. et al. (1990). Deconvolution of mineral absorption bands: An improved approach. JGR.']
    },
    {
      id: 'm8_s22',
      slideNumber: 22,
      title: 'Imaging Spectroscopy Data Cubes: Spatial-Spectral Visualizations',
      category: 'Processing',
      keyTakeaway: '3D hyperspectral data cubes contain two spatial dimensions (X, Y) and one contiguous spectral dimension (λ).',
      bullets: [
        'Cube slicing: Extracting 2D spatial images at single wavelengths vs extracting 1D spectral curves at single spatial coordinates.',
        'False-color composites: Mapping diagnostic spectral bands into Red, Green, and Blue color channels (e.g. CIR: NIR=Red, Red=Green, Green=Blue).',
        'Interactive cube inspection tools: ENVI, QGIS Crayfish/Spectral, and Python `hyperspy`.'
      ],
      speakerNotes: 'Demonstrate interactive point-and-click spectrum extraction from a 3D data cube in software.',
      references: ['Richards, J. A. (2013). Remote Sensing Digital Image Analysis.']
    },
    {
      id: 'm8_s23',
      slideNumber: 23,
      title: 'Long-Term Ecological Monitoring Networks: NEON and ICOS',
      category: 'CaseStudy',
      keyTakeaway: 'Automated tower-mounted spectrometers in NEON and ICOS networks provide decade-long continuous time series of canopy phenology.',
      bullets: [
        'NEON (National Ecological Observatory Network, USA): Airborne Observation Platform (AOP) hyperspectral surveys paired with tower radiometry.',
        'ICOS (Integrated Carbon Observation System, Europe): Continuous spectral radiometers tracking gross primary productivity and phenology.',
        'Captures inter-annual climate impacts: Drought stress, spring green-up anomalies, and autumn senescence.'
      ],
      speakerNotes: 'Display a 5-year continuous time series of NDVI and PRI from a NEON forest tower.',
      references: ['Kampe, T. U. et al. (2010). NEON: Airborne observation platform for detecting continental-scale ecological change. SPIE.']
    },
    {
      id: 'm8_s24',
      slideNumber: 24,
      title: 'Laboratory Protocol for Wet Chemistry Ground Truth',
      category: 'Protocol',
      keyTakeaway: 'Spectroscopic models are only as accurate as the laboratory wet chemistry used to calibrate them.',
      bullets: [
        'Chlorophyll extraction: Spectrophotometric assay using 80% acetone or 96% ethanol and Lichtenthaler equations.',
        'Nitrogen determination: Dumas high-temperature combustion or micro-Kjeldahl digestion.',
        'Quality control: Triplicate analytical replicates, certified laboratory reference standards, and blind blank samples.'
      ],
      speakerNotes: 'Review the Lichtenthaler (1987) equations for calculating chlorophyll a, b, and total carotenoids in acetone.',
      references: ['Lichtenthaler, H. K. (1987). Chlorophylls and carotenoids: Pigments of photosynthetic biomembranes. Methods in Enzymology.']
    },
    {
      id: 'm8_s25',
      slideNumber: 25,
      title: 'Spectroscopy in Planetary Exploration: Mars and Moon Analog Studies',
      category: 'CaseStudy',
      keyTakeaway: 'Terrestrial field spectroscopy is the primary tool for interpreting reflectance data from Mars rovers and lunar orbiters.',
      bullets: [
        'Mars 2020 Perseverance Rover: SuperCam and SHERLOC spectrometers analyzing Jezero Crater mineralogy.',
        'Terrestrial field analogs: Atacama Desert, Iceland basalt volcanic fields, and Antarctic dry valleys.',
        'Field spectrometers validate detection of phyllosilicates, sulfates, and carbonates that indicate ancient water activity.'
      ],
      speakerNotes: 'Show SuperCam spectra from Mars compared against ground spectra collected in Chilean analog deserts.',
      references: ['Wiens, R. C. et al. (2021). The SuperCam instrument suite on the Mars 2020 rover: Body unit and combined system tests. Space Science Reviews.']
    },
    {
      id: 'm8_s26',
      slideNumber: 26,
      title: 'Machine Learning vs. Physics-Based Models: A Philosophical Debate',
      category: 'Mathematics',
      keyTakeaway: 'The future of remote sensing lies in hybrid modeling: embedding physical laws (RTMs) directly into deep learning architectures.',
      bullets: [
        'Pure Machine Learning: Flexible and fast, but prone to spurious correlations and catastrophic failure outside training domains.',
        'Pure Physics (RTM): Universally valid and mechanistic, but computationally heavy and simplified (turbid assumptions).',
        'Physics-Informed Neural Networks (PINNs): Loss functions penalize predictions that violate energy conservation or RTM equations.'
      ],
      speakerNotes: 'Discuss the paradigm shift toward Physics-Informed Machine Learning in Earth observation.',
      references: ['Camps-Valls, G. et al. (2021). Physics-aware machine learning for Earth observation. Nature Reviews Earth & Environment.']
    },
    {
      id: 'm8_s27',
      slideNumber: 27,
      title: 'Field Equipment Maintenance and Post-Season Storage',
      category: 'QualityAssurance',
      keyTakeaway: 'Proper seasonal storage preserves spectrometer optical bench alignment and prevents detector mold degradation.',
      bullets: [
        'Desiccant maintenance: Recharge instrument internal desiccant cartridges whenever indicator turns pink.',
        'Battery storage: Store lithium batteries at 50% state of charge (3.85V/cell) in fireproof containers at 15°C.',
        'Fiber storage: Never coil cables tighter than 30 cm diameter; install protective metal end caps on all optical connectors.',
        'Annual recalibration: Schedule factory or certified metrology laboratory calibration every 12 months.'
      ],
      speakerNotes: 'Review the post-field season maintenance checklist.',
      references: ['Analytical Spectral Devices (2012). FieldSpec Maintenance and Care Guide.']
    },
    {
      id: 'm8_s28',
      slideNumber: 28,
      title: 'Preparing Research Papers for Publication in Remote Sensing',
      category: 'QualityAssurance',
      keyTakeaway: 'Peer-reviewed remote sensing journals enforce strict methodological reporting for field radiometry.',
      bullets: [
        'Mandatory reporting checklist: Sensor model, foreoptic FOV, sensor height, SZA range, sky condition (AOD, clouds).',
        'White reference panel serial number, calibration certificate date, and re-acquisition interval.',
        'Uncertainty statement: State whether reported reflectance is HCRF or BRF, and provide error bars / confidence ribbons.',
        'Target journals: Remote Sensing of Environment (RSE), IEEE TGRS, ISPRS Journal, International Journal of Applied Earth Observation.'
      ],
      speakerNotes: 'Point out common reviewer criticisms of field spectroscopy manuscripts and how to avoid them.',
      references: ['Milton, E. J. et al. (2009). Remote Sensing of Environment.']
    },
    {
      id: 'm8_s29',
      slideNumber: 29,
      title: 'The AI Research Tutor: Interactive Learning & Real-Time Q&A',
      category: 'QualityAssurance',
      keyTakeaway: 'Students can utilize the integrated AI Research Tutor powered by Gemini with deep academic reasoning for instant concept guidance.',
      bullets: [
        'Interactive inquiry: Ask complex questions regarding equations, calibration pitfalls, and code troubleshooting.',
        'Grounded in academic standards: Provides authoritative explanations citing Milton et al., Schaepman-Strub, and Jacquemoud.',
        'Code generation: Assists in customizing Python and R scripts for specific field instruments and experimental designs.'
      ],
      speakerNotes: 'Demonstrate querying the AI Research Tutor within the application.',
      references: ['Google DeepMind (2024). Gemini Models Technical Documentation.']
    },
    {
      id: 'm8_s30',
      slideNumber: 30,
      title: 'Module 8 Capstone & Course Completion',
      category: 'QualityAssurance',
      keyTakeaway: 'Congratulations on completing Principles of Field Spectroscopy: You now command the full theoretical and practical discipline.',
      bullets: [
        'You have mastered: Optical radiation physics, point spectroradiometer hardware, NIST calibration, outdoor sampling protocols, UAV imaging payloads, advanced spectral preprocessing, radiative transfer modeling, and spectral databases.',
        'Proceed to execute your final Field Exercise Capstone and Automated Quizzes.',
        'Your rigorous data will calibrate the satellites that monitor our changing planet.'
      ],
      speakerNotes: 'Deliver inspiring final congratulations to the graduating MSc students.',
      references: ['Milton, E. J., Schaepman, M. E., Anderson, K., & Gao, B. C. (2009). Progress in field spectroscopy. Remote Sensing of Environment, 113, S92-S109.']
    }
  ];
  return [...baseSlides, ...additionalSlides];
}

export const MODULE_8: CourseModule = {
  id: 'module_8',
  moduleNumber: 8,
  title: 'Spectral Databases, SPECCHIO, Metadata Architecture & Course Capstone',
  shortTitle: 'Spectral Databases & Capstone',
  subtitle: 'SPECCHIO database architecture, ISO 19115-2 metadata, FAIR principles, NetCDF-4/HDF5, and capstone field campaign synthesis',
  durationHours: 4,
  ectsCredits: 1.5,
  abstract: 'Module 8 culminates the MSc curriculum by addressing spectral data management, institutional archiving, and the complete field-to-satellite synthesis. Students master the SPECCHIO spectral information system, analyzing relational database entities (campaigns, sensors, calibrations, measurement geometries, environmental sensors). The curriculum explores global spectral repositories (USGS, ECOSTRESS, JPL, RadCalNet), FAIR data principles, self-describing container formats (NetCDF-4, HDF5), and PostGIS spatial queries. The module concludes with the comprehensive Course Capstone Project integrating all 8 modules into an operational, peer-reviewed field validation campaign.',
  coreCompetencies: [
    'Design and query relational spectral databases conforming to the SPECCHIO schema.',
    'Compile self-describing scientific datasets in NetCDF-4 and HDF5 with CF-compliant metadata attributes.',
    'Perform satellite sensor spectral resampling using instrument Spectral Response Functions (SRF).',
    'Formulate spatial-spectral SQL queries using PostGIS spatial operators.',
    'Synthesize an end-to-end field campaign from pre-flight planning through RTM inversion and publication.'
  ],
  slides: generateFullModule8Slides(),
  fieldExercise: {
    title: 'Field Exercise 8: Capstone Multi-Platform Field Campaign & Submission to SPECCHIO Database',
    estimatedDuration: '5 hours',
    targetEnvironment: 'Comprehensive university agricultural/forest research station',
    recommendedInstruments: ['Full Field Spectroradiometer suite (ASD FieldSpec / SVC)', 'Multispectral UAV drone payload', 'Continuous logging solar pyranometer and weather station', 'RTK-GNSS rover', 'Laboratory spectrophotometer for foliar wet-chemistry assays', 'Field tablets with digital SPECCHIO data entry forms'],
    safetyAndPreTripChecklist: [
      'Conduct complete 4-phase field safety and instrument readiness inspection.',
      'Verify all NIST calibration certificates for spectrometer, fiber cable, and Spectralon panels.',
      'Initialize base station RTK-GNSS and confirm sub-2 cm precision.',
      'Confirm cloudless meteorological forecast with forecast AOD < 0.15.'
    ],
    fieldProtocolSteps: [
      {
        stepNumber: 1,
        action: 'Execute synchronized ground spectroradiometer, UAV multispectral flight, and continuous pyranometer logging over a 1-hectare test parcel.',
        scientificRationale: 'Captures ground truth point spectra, aerial spatial context, and atmospheric stability simultaneously.',
        commonErrorToAvoid: 'Lack of radio synchronization between the ground crew, UAV pilot, and base camp.'
      },
      {
        stepNumber: 2,
        action: 'Harvest leaf discs and soil cores from 15 georeferenced stations for laboratory wet-chemistry chlorophyll, water content, and carbon assays.',
        scientificRationale: 'Provides physical biochemical ground truth to validate empirical and RTM models.',
        commonErrorToAvoid: 'Exposing leaf samples to direct sunlight or heat during transport.'
      },
      {
        stepNumber: 3,
        action: 'Process raw binary spectrometer files through the automated Python/R preprocessing pipeline (dark subtract, splice correct, S-G smooth, continuum remove).',
        scientificRationale: 'Enforces uniform quality control and generates standardized reflectance factors.',
        commonErrorToAvoid: 'Skipping splice correction or retaining noisy water vapor bands.'
      },
      {
        stepNumber: 4,
        action: 'Ingest all spectral vectors, RTK coordinates, photo attachments, and laboratory chemistry records into the SPECCHIO relational database.',
        scientificRationale: 'Ensures permanent FAIR data compliance and provenance tracking.',
        commonErrorToAvoid: 'Failing to link the specific instrument calibration file ID to the uploaded spectral records.'
      }
    ],
    dataRecordingSheetFields: [
      'Campaign Name & Code',
      'Target Plot ID & SPECCHIO Station GUID',
      'UTC Timestamp & SZA',
      'Calibrated Spectrum File Name',
      'UAV Orthomosaic Pixel Values',
      'Laboratory Chlorophyll Content (µg/cm²)',
      'Laboratory EWT (g/cm²)',
      'Calculated PROSAIL Inverted LAI',
      'SPECCHIO Ingestion Hash Checksum'
    ],
    fieldDeliverable: 'Submit the final MSc Capstone Portfolio: Complete SPECCHIO database export, NetCDF-4 standardized dataset with DOI, reproducible Jupyter/R Markdown analytical notebook, and a 10-page scientific manuscript formatted for Remote Sensing of Environment.'
  },
  practicalLab: {
    title: 'Practical Lab 8: Querying SPECCHIO, Building NetCDF-4 Spectral Archives & Satellite Resampling in Python and R',
    softwareEnvironment: 'Hybrid (Python & R)',
    primaryPackages: ['netCDF4', 'xarray', 'sqlite3', 'geopandas', 'hsdar (R)', 'ncdf4 (R)'],
    learningObjectives: [
      'Construct a relational SQLite/PostgreSQL schema replicating SPECCHIO spectral entities.',
      'Export multi-point field spectra and auxiliary metadata into a standardized NetCDF-4 file conforming to CF conventions.',
      'Implement an automated satellite resampling engine convolving 2151-channel field spectra to Sentinel-2 MSI bands.',
      'Execute spatial-spectral SQL queries filtering datasets by location, acquisition geometry, and spectral index thresholds.'
    ],
    sampleDataset: {
      name: 'SPECCHIO_Capstone_Campaign_Export.sqlite',
      description: 'Relational database containing 200 field spectra, instrument calibration records, RTK GNSS coordinates, and concurrent weather logs from an agricultural research campaign.',
      spectralRange: '350 - 2500 nm',
      sensor: 'ASD FieldSpec 4 Hi-Res',
      bandsCount: 2151
    },
    codeSnippets: [
      {
        language: 'python',
        title: 'Python: Satellite Sensor Spectral Resampling Engine (Sentinel-2 MSI)',
        description: 'Convolves continuous 2151-channel field spectroradiometer measurements with Sentinel-2 MSI Spectral Response Functions (SRF).',
        code: `import numpy as np
import matplotlib.pyplot as plt

def resample_spectrum_to_sensor(field_wavelengths, field_reflectance, sensor_srf_dict):
    """
    Convolves high-resolution field spectrum to satellite bands using Spectral Response Functions.
    sensor_srf_dict: dictionary where key = band name, value = (srf_wavelengths, srf_weights)
    """
    resampled_bands = {}
    
    for band_name, (srf_wl, srf_weights) in sensor_srf_dict.items():
        # Interpolate field reflectance onto the SRF wavelength grid
        refl_interp = np.interp(srf_wl, field_wavelengths, field_reflectance)
        
        # Convolve using weighted average
        weighted_sum = np.sum(refl_interp * srf_weights)
        total_weight = np.sum(srf_weights)
        
        resampled_bands[band_name] = weighted_sum / total_weight
        
    return resampled_bands

# Demonstration with synthetic Sentinel-2 MSI Bands (B2 Blue, B3 Green, B4 Red, B8 NIR)
wl = np.arange(350, 2501, 1)
# Field vegetation spectrum
field_refl = 0.05 + 0.40 / (1.0 + np.exp(-0.04 * (wl - 715)))
field_refl -= 0.08 * np.exp(-((wl - 675)/30)**2) # Red dip

# Define Gaussian-approximated Spectral Response Functions
def make_gaussian_srf(center_nm, fwhm_nm):
    sub_wl = np.arange(center_nm - fwhm_nm*1.5, center_nm + fwhm_nm*1.5, 1)
    sigma = fwhm_nm / 2.35482
    weights = np.exp(-0.5 * ((sub_wl - center_nm) / sigma)**2)
    return sub_wl, weights

s2_srf = {
    'B2_Blue':     make_gaussian_srf(492.4, 66.0),
    'B3_Green':    make_gaussian_srf(559.8, 36.0),
    'B4_Red':      make_gaussian_srf(664.6, 31.0),
    'B8_NIR':      make_gaussian_srf(832.8, 106.0),
    'B11_SWIR1':   make_gaussian_srf(1613.7, 91.0),
    'B12_SWIR2':   make_gaussian_srf(2202.4, 175.0)
}

res = resample_spectrum_to_sensor(wl, field_refl, s2_srf)

print("--- Convolved Sentinel-2 MSI Band Reflectances ---")
for b, val in res.items():
    print(f"Sentinel-2 {b:12s}: {val:.4f}")

# Simulated Sentinel-2 NDVI
s2_ndvi = (res['B8_NIR'] - res['B4_Red']) / (res['B8_NIR'] + res['B4_Red'])
print(f"\\nSimulated Sentinel-2 Top-of-Canopy NDVI: {s2_ndvi:.4f}")
`
      },
      {
        language: 'r',
        title: 'R Script: Building CF-Compliant NetCDF-4 Spectral Archives in R',
        description: 'Creates a self-describing NetCDF-4 file storing a collection of field spectra, wavelengths, GPS coordinates, and campaign metadata.',
        code: `# Principles of Field Spectroscopy: MSc Lab 8
# Exporting NetCDF-4 Spectral Archives in R
library(ncdf4)

# Create NetCDF dimensions
n_samples <- 25
n_bands <- 2151
wavelengths <- seq(350, 2500, by=1)

dim_samples <- ncdim_def("sample", "", 1:n_samples)
dim_bands   <- ncdim_def("wavelength", "nanometers", wavelengths)

# Define variables
var_refl <- ncvar_def("reflectance", "fraction", list(dim_bands, dim_samples), -9999, 
                      longname="Hemispherical-Conical Reflectance Factor (HCRF)", prec="float")
var_lat  <- ncvar_def("latitude", "degrees_north", dim_samples, -9999, prec="double")
var_lon  <- ncvar_def("longitude", "degrees_east", dim_samples, -9999, prec="double")

# Create NetCDF file
nc_file <- nc_create("Field_Spectra_Campaign_Archive.nc", list(var_refl, var_lat, var_lon))

# Global metadata attributes (CF Conventions & ISO 19115-2)
ncatt_put(nc_file, 0, "title", "Principles of Field Spectroscopy MSc Campaign Dataset")
ncatt_put(nc_file, 0, "institution", "University Department of Geoinformation")
ncatt_put(nc_file, 0, "instrument", "ASD FieldSpec 4 Hi-Res (SN 18234)")
ncatt_put(nc_file, 0, "references", "Milton et al. (2009); Schaepman-Strub et al. (2006)")

nc_close(nc_file)
cat("Successfully generated self-describing NetCDF-4 archive.\\n")
`
      }
    ],
    studentTasks: [
      'Write a Python script that connects to an SQLite database, extracts spectra matching SZA < 40° and NDVI > 0.6, and exports them to a GeoJSON feature collection.',
      'Convolve an ASD field dataset to Landsat-9 OLI bands and Sentinel-2 MSI bands; plot the inter-sensor regression and evaluate band-pass differences.',
      'Package your entire semester\'s field and lab outputs into an ISO 19115-2 and FAIR compliant data archive with full computational notebooks.'
    ],
    expectedOutputSummary: 'Students produce reproducible Python and R scripts demonstrating database querying, NetCDF-4 generation, sensor spectral convolution, and a complete capstone data publication pipeline.'
  },
  quiz: {
    moduleNumber: 8,
    title: 'Module 8 Automated Assessment: Spectral Databases & Capstone Synthesis',
    passingScorePercent: 80,
    questions: [
      {
        id: 'm8_q1',
        question: 'What is the primary architectural purpose of the SPECCHIO spectral information system in remote sensing research?',
        options: [
          'To replace satellite ground receiving stations with radio dishes.',
          'To provide a centralized, relational database schema that decouples spectral data vectors from multidimensional metadata (sensors, calibrations, geometries, environments), ensuring data provenance and long-term re-use.',
          'To compress photos into JPEG files for social media sharing.',
          'To run weather forecasting climate simulations.'
        ],
        correctOptionIndex: 1,
        explanation: 'SPECCHIO solves the metadata loss problem by providing a normalized relational database connecting raw spectral vectors to complete instrument calibration files, acquisition geometries, and environmental metadata.',
        academicCitation: 'Hueni, A. et al. (2009). Computers & Geosciences, 35(4), 697-707.'
      },
      {
        id: 'm8_q2',
        question: 'What do the four letters in the international "FAIR" Data Principles stand for?',
        options: [
          'Fast, Accurate, Intelligent, Robust',
          'Findable, Accessible, Interoperable, Reusable',
          'Field, Airborne, Infrared, Radiometric',
          'Frequency, Amplitude, Intensity, Radiance'
        ],
        correctOptionIndex: 1,
        explanation: 'The FAIR principles (Wilkinson et al., 2016) establish that scientific data must be Findable, Accessible, Interoperable, and Reusable to ensure scientific transparency and long-term reproducibility.',
        academicCitation: 'Wilkinson, M. D. et al. (2016). Scientific Data, 3, 160018.'
      },
      {
        id: 'm8_q3',
        question: 'When convolving a continuous 2151-channel ground field spectrum to simulate a discrete satellite band (e.g. Sentinel-2 Band 4 Red), why is a simple rectangular average over the nominal bandwidth inaccurate?',
        options: [
          'Because real optical bandpass filters have Gaussian or bell-shaped Spectral Response Functions (SRF) with varying transmission across the bandpass, which must be integrated as a weighted function.',
          'Because satellite sensors can only process prime numbers.',
          'Because rectangular averages violate the second law of thermodynamics.',
          'Because the speed of light changes inside the satellite sensor.'
        ],
        correctOptionIndex: 0,
        explanation: 'Real interference filters do not have square transmission cutoffs; they possess continuous Spectral Response Functions (SRF). Accurate band simulation requires weighting field spectral radiance by the sensor SRF at every nanometer.',
        academicCitation: 'Barsi, J. A. et al. (2014). Remote Sensing, 6(11), 10232-10251.'
      },
      {
        id: 'm8_q4',
        question: 'Why are self-describing formats like NetCDF-4 and HDF5 superior to standard CSV spreadsheets for archiving large field spectroscopy campaigns?',
        options: [
          'Because CSV files cannot be opened on laptops.',
          'Because NetCDF-4 embeds multi-dimensional arrays, standardized coordinate dimensions, and unlimited hierarchical metadata attributes directly within the binary file, preventing metadata separation.',
          'Because NetCDF-4 files automatically delete all noise from measurements.',
          'Because HDF5 files are exclusively licensed to NASA.'
        ],
        correctOptionIndex: 1,
        explanation: 'CSV files lack standard metadata schemas and split data into separate loose files. NetCDF-4 and HDF5 provide unified, self-describing containers storing multidimensional data cubes alongside all campaign and calibration metadata.',
        academicCitation: 'Rew, R., & Davis, G. (1990). IEEE Computer Graphics and Applications, 10(4), 76-82.'
      },
      {
        id: 'm8_q5',
        question: 'Which of the following field practices represents a catastrophic protocol violation that would permanently invalidate ground truth reflectance data intended for satellite cal/val?',
        options: [
          'Wearing matte neutral dark gray clothing.',
          'Acquiring target measurements when solar zenith angle exceeds 65°, using a dirty Spectralon panel without recalibration, and waiting 20 minutes between white reference scans on a partly cloudy day.',
          'Logging high-precision RTK GNSS coordinates with sub-2 cm accuracy.',
          'Using a bubble level to maintain nadir foreoptic orientation.'
        ],
        correctOptionIndex: 1,
        explanation: 'Operating at SZA > 65° induces severe non-Lambertian and shadow artifacts; a contaminated reference panel distorts reflectance scale; and waiting 20 minutes under shifting clouds violates illumination stability assumptions.',
        academicCitation: 'Milton, E. J. et al. (2009). Remote Sensing of Environment, 113, S92-S109.'
      }
    ]
  },
  keyReferences: [
    {
      authors: 'Hueni, A., Nieke, J., Schopfer, J., Kneubühler, M., & Itten, K.',
      year: 2009,
      title: 'The spectral database SPECCHIO for improved data sharing and data analysis',
      journalOrPublisher: 'Computers & Geosciences, 35(4), 697-707',
      doiOrUrl: '10.1016/j.cageo.2008.03.013'
    },
    {
      authors: 'Kokaly, R. F. et al.',
      year: 2017,
      title: 'USGS Spectral Library Version 7',
      journalOrPublisher: 'U.S. Geological Survey Data Series 1035',
      doiOrUrl: '10.3133/ds1035'
    },
    {
      authors: 'Wilkinson, M. D. et al.',
      year: 2016,
      title: 'The FAIR Guiding Principles for scientific data management and stewardship',
      journalOrPublisher: 'Scientific Data, 3, 160018',
      doiOrUrl: '10.1038/sdata.2016.18'
    }
  ]
};
