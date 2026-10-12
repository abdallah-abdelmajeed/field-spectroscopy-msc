import type { CourseModule, Slide } from '../types';

function generateModule6Slides(): Slide[] {
  return [
    {
      id: 'm6_s1',
      slideNumber: 1,
      title: 'Introduction to Spectral Preprocessing & Feature Extraction',
      category: 'Processing',
      keyTakeaway: 'Raw reflectance curves contain both diagnostic chemical absorption features and confounding multiplicative scatter noise.',
      bullets: [
        'Physical scatter vs. Chemical absorption: Particle size, leaf internal cell anatomy, and surface roughness induce baseline shifts.',
        'Preprocessing objective: Remove non-linear scattering and instrument noise while enhancing subtle molecular vibrational and electronic transitions.',
        'Core methods: Smoothing, scatter correction (SNV, MSC), continuum removal, derivative spectroscopy, and narrow-band indices.'
      ],
      practicalFieldNote: 'Never apply chemometric modeling (PLSR, Random Forest) directly to raw un-preprocessed field spectra.',
      speakerNotes: 'Welcome to Module 6. Here we master the mathematical toolkit of chemometrics and spectroscopic feature extraction.',
      references: ['Rinnan, Å. et al. (2009). Review of the most common pre-processing techniques for near-infrared spectra. TrAC Trends in Analytical Chemistry.']
    },
    {
      id: 'm6_s2',
      slideNumber: 2,
      title: 'Noise Suppression: Moving Average vs. Gaussian vs. Savitzky-Golay',
      category: 'Mathematics',
      keyTakeaway: 'Simple moving averages distort narrow absorption peak shapes; Savitzky-Golay filters preserve peak height, width, and area.',
      bullets: [
        'Moving average: Replaces each point with the unweighted local mean; flattens sharp absorption peaks and widens FWHM.',
        'Gaussian filter: Applies Gaussian weights; still attenuates high-frequency peak tips.',
        'Savitzky-Golay (1964): Fits a local polynomial of degree p across a moving window of 2m + 1 points using least-squares convolution coefficients.'
      ],
      mathFormula: 'y_j^* = \\sum_{i=-m}^m c_i \\cdot y_{j+i}',
      formulaExplanation: 'Savitzky-Golay convolution sum where c_i are precomputed least-squares polynomial coefficients.',
      speakerNotes: 'Demonstrate on the board how a moving average blunts a sharp Kaolinite doublet into an uninterpretable lump.',
      references: ['Savitzky, A., & Golay, M. J. (1964). Smoothing and differentiation of data by simplified least squares procedures. Analytical Chemistry.']
    },
    {
      id: 'm6_s3',
      slideNumber: 3,
      title: 'Savitzky-Golay Parameter Optimization: Window Size & Polynomial Degree',
      category: 'Mathematics',
      keyTakeaway: 'Selecting the optimal window length and polynomial order requires balancing noise removal against spectral feature distortion.',
      bullets: [
        'Polynomial degree p: Typically quadratic (p=2) or cubic (p=3); higher degrees (p=4, 5) fit high-frequency noise.',
        'Window size w = 2m + 1: Must be odd and smaller than the full width at half maximum (FWHM) of the narrowest diagnostic absorption feature.',
        'If window size exceeds absorption feature FWHM, the feature is systematically smoothed away.',
        'Rule of thumb: In field spectroscopy with 1 nm sampling, w = 11 to 21 points (11 to 21 nm) with polynomial degree 2 or 3.'
      ],
      speakerNotes: 'Show the effect of increasing window size from 5 to 51 nm on the Chlorophyll red edge slope.',
      references: ['Schafer, R. W. (2011). What is a Savitzky-Golay filter? IEEE Signal Processing Magazine.']
    },
    {
      id: 'm6_s4',
      slideNumber: 4,
      title: 'Standard Normal Variate (SNV) Transformation',
      category: 'Mathematics',
      keyTakeaway: 'SNV centers and scales each individual spectrum independently, eliminating additive baseline offsets and multiplicative scaling effects.',
      bullets: [
        'Developed by Barnes et al. (1989) for near-infrared diffuse reflectance spectroscopy of particulates.',
        'Additive shift: Caused by sample height variations and stray light.',
        'Multiplicative scaling: Caused by particle size differences and optical path length changes.',
        'SNV requires no reference or target set; it operates on a single spectrum row-by-row.'
      ],
      mathFormula: 'x_{ij}^{\\text{SNV}} = \\frac{x_{ij} - \\bar{x}_i}{s_i}, \\quad \\bar{x}_i = \\frac{1}{K}\\sum_{k=1}^K x_{ik}, \\quad s_i = \\sqrt{\\frac{1}{K-1}\\sum_{k=1}^K (x_{ik} - \\bar{x}_i)^2}',
      formulaExplanation: 'Standard Normal Variate normalization for spectrum i at channel j across K wavelengths.',
      speakerNotes: 'Point out that after SNV, every spectrum has a mean of 0.0 and a standard deviation of 1.0.',
      references: ['Barnes, R. J. et al. (1989). Standard normal variate transformation and de-trending of near-infrared diffuse reflectance spectra. Applied Spectroscopy.']
    },
    {
      id: 'm6_s5',
      slideNumber: 5,
      title: 'Multiplicative Scatter Correction (MSC)',
      category: 'Mathematics',
      keyTakeaway: 'MSC separates light scattering from chemical absorption by regressing each spectrum against an ideal reference mean spectrum.',
      bullets: [
        'Formulated by Geladi et al. (1985).',
        'Assumes that physical scatter linearly shifts and scales the entire spectrum relative to an average population spectrum.',
        'Step 1: Compute the mean spectrum x̄ across the entire calibration dataset.',
        'Step 2: Fit linear regression per spectrum: x_i = a_i + b_i · x̄ + e_i.',
        'Step 3: Correct spectrum: x_i^MSC = (x_i - a_i) / b_i.'
      ],
      mathFormula: 'x_i(\\lambda) = a_i + b_i \\cdot \\bar{x}(\\lambda) + e_i(\\lambda) \\implies x_i^{\\text{MSC}}(\\lambda) = \\frac{x_i(\\lambda) - a_i}{b_i}',
      formulaExplanation: 'MSC linear scatter correction equation.',
      speakerNotes: 'Contrast MSC with SNV: MSC uses the population mean; SNV is purely sample-internal. Their results are mathematically very similar.',
      references: ['Geladi, P. et al. (1985). Linearization and scatter-correction for near-infrared reflectance spectra of meat. Applied Spectroscopy.']
    },
    {
      id: 'm6_s6',
      slideNumber: 6,
      title: 'Detrending Algorithms: Removing Baseline Curvature',
      category: 'Mathematics',
      keyTakeaway: 'Detrending fits a second-order polynomial baseline to each spectrum, removing curvilinear drift caused by dense scattering.',
      bullets: [
        'Often applied immediately following SNV (SNV-Detrending pipeline).',
        'Accounts for wavelength-dependent scattering that increases at shorter wavelengths (Rayleigh-Mie scatter curvature).',
        'Fits y = c₀ + c₁·λ + c₂·λ² to the SNV-transformed curve and subtracts the fitted curve.',
        'Flattens spectral baselines to zero, highlighting discrete absorption bands.'
      ],
      speakerNotes: 'Show an agricultural grain flour spectrum before and after SNV-Detrend.',
      references: ['Barnes, R. J. et al. (1989). Applied Spectroscopy.']
    },
    {
      id: 'm6_s7',
      slideNumber: 7,
      title: 'Continuum Removal: The Convex Hull Concept',
      category: 'Mathematics',
      keyTakeaway: 'Continuum removal normalizes reflectance spectra to a common convex hull baseline, isolating true absorption band shapes.',
      bullets: [
        'Formalized by Clark & Roush (1984) at USGS Spectroscopy Lab.',
        'Continuum: An upper boundary convex hull that connects local reflectance maxima, representing background scattering without absorption.',
        'Mathematical definition: Smallest convex polygon enclosing all spectral points from above.',
        'Continuum-removed reflectance: Ratio of original reflectance to the continuum value at each wavelength: R_cr(λ) = R(λ) / R_c(λ).'
      ],
      mathFormula: 'R_{\\text{cr}}(\\lambda) = \\frac{R(\\lambda)}{R_c(\\lambda)} \\quad \\implies \\quad 0.0 \\le R_{\\text{cr}}(\\lambda) \\le 1.0',
      formulaExplanation: 'Continuum-removed reflectance is bounded between 0 (complete absorption) and 1 (on the continuum baseline).',
      speakerNotes: 'Draw the rubber-band analogy on the board: imagine stretching a rubber band tightly over the top of the spectral curve.',
      references: ['Clark, R. N., & Roush, T. L. (1984). Reflectance spectroscopy: Quantitative analysis techniques for remote sensing applications. JGR.']
    },
    {
      id: 'm6_s8',
      slideNumber: 8,
      title: 'Continuum-Removed Diagnostic Parameters',
      category: 'Mathematics',
      keyTakeaway: 'Continuum-removed features yield quantitative physical parameters: Band Center, Band Depth, FWHM, and Absorption Area.',
      bullets: [
        'Band Center (λ_min): Wavelength corresponding to minimum continuum-removed reflectance (maximum absorption).',
        'Band Depth (BD): Maximum absorption depth: BD = 1.0 - R_cr(λ_min).',
        'Full Width at Half Maximum (FWHM): Width of the absorption feature where depth is half of BD: BD / 2.',
        'Absorption Band Area: Numerical integral of (1.0 - R_cr(λ)) across the absorption interval.'
      ],
      mathFormula: '\\text{BD} = 1 - R_{\\text{cr}}(\\lambda_{\\min}), \\quad \\text{Area} = \\int_{\\lambda_{\\text{start}}}^{\\lambda_{\\text{end}}} \\left(1 - R_{\\text{cr}}(\\lambda)\\right) \\, d\\lambda',
      formulaExplanation: 'Band Depth and Band Area definitions for quantitative absorption feature characterization.',
      speakerNotes: 'Demonstrate how Band Area scales linearly with chemical absorber concentration according to radiative transfer theory.',
      references: ['Clark, R. N. (1999). Manual of Remote Sensing.']
    },
    {
      id: 'm6_s9',
      slideNumber: 9,
      title: 'Absorption Feature Asymmetry and Skewness',
      category: 'Mathematics',
      keyTakeaway: 'Absorption feature asymmetry reveals overlapping secondary absorption sub-bands and mineral solid solutions.',
      bullets: [
        'Symmetric feature: The left half-width (λ_min - λ_left) equals the right half-width (λ_right - λ_min).',
        'Asymmetry parameter: S = (λ_right - λ_min) / (λ_min - λ_left) or S = log((Area_right) / (Area_left)).',
        'In Kaolinite vs Halloysite: Asymmetry distinguishes disorder in the crystal lattice.',
        'In chlorophyll: Carotenoid absorption on the left wing (450–500 nm) creates strong negative asymmetry.'
      ],
      mathFormula: '\\text{Asymmetry} = \\frac{\\lambda_{\\text{right, 0.5}} - \\lambda_{\\min}}{\\lambda_{\\min} - \\lambda_{\\text{left, 0.5}}}',
      formulaExplanation: 'Ratio of right to left half-width at half-maximum depth.',
      speakerNotes: 'Show the Al-OH 2200 nm feature in pure muscovite vs phengite and how asymmetry shifts.',
      references: ['Van der Meer, F. (2004). Analysis of spectral absorption features. International Journal of Applied Earth Observation.']
    },
    {
      id: 'm6_s10',
      slideNumber: 10,
      title: 'Spectral Derivatives: First and Second Order Formulations',
      category: 'Mathematics',
      keyTakeaway: 'Spectral derivatives eliminate baseline offsets (1st derivative) and linear slopes (2nd derivative), resolving overlapping peaks.',
      bullets: [
        'First Derivative (dR/dλ): Measures spectral slope. Zero-crossings locate reflectance peaks and absorption troughs.',
        'Second Derivative (d²R/dλ²): Measures curvature. Negative values identify local maxima; positive peaks identify absorption minima.',
        'Derivative computation: Implemented simultaneously with Savitzky-Golay polynomial differentiation to suppress noise amplification.'
      ],
      mathFormula: '\\frac{d R}{d\\lambda} \\approx \\frac{R(\\lambda_{i+1}) - R(\\lambda_{i-1})}{2 \\Delta\\lambda}, \\quad \\frac{d^2 R}{d\\lambda^2} \\approx \\frac{R(\\lambda_{i+1}) - 2R(\\lambda_i) + R(\\lambda_{i-1})}{(\\Delta\\lambda)^2}',
      formulaExplanation: 'Central finite difference approximations for first and second derivatives.',
      speakerNotes: 'Warning: Taking a numerical derivative of raw noisy data amplifies high-frequency noise by 1/Δλ. Always smooth first!',
      references: ['Tsai, F., & Philpot, W. (1998). Derivative analysis of hyperspectral data. Remote Sensing of Environment.']
    },
    {
      id: 'm6_s11',
      slideNumber: 11,
      title: 'The Red Edge Inflection Point (REIP) Algorithms',
      category: 'Mathematics',
      keyTakeaway: 'REIP marks the maximum first-derivative slope between red chlorophyll absorption (680 nm) and the NIR plateau (750 nm).',
      bullets: [
        'Guyot & Baret (1988) 4-band linear interpolation model.',
        'Miller et al. (1990) inverted-Gaussian fitting model.',
        'First-derivative peak detection: Finding the exact wavelength where dR/dλ reaches its maximum.',
        'Chlorophyll increase causes the REIP to shift toward longer wavelengths ("red edge shift") due to saturation of the 680 nm band.'
      ],
      mathFormula: '\\lambda_{\\text{REIP}} = 700 + 40 \\cdot \\left[ \\frac{\\frac{R_{670} + R_{780}}{2} - R_{700}}{R_{740} - R_{700}} \\right]',
      formulaExplanation: 'Guyot & Baret (1988) formulation for Red Edge Position from four spectral bands.',
      speakerNotes: 'Show the red edge shift in leaves subjected to heavy metal stress vs healthy controls.',
      references: ['Guyot, G., & Baret, F. (1988). Utilisation de la haute résolution spectrale pour suivre l\'état des couverts végétaux. ESA SP-287.']
    },
    {
      id: 'm6_s12',
      slideNumber: 12,
      title: 'Broadband vs. Narrowband Spectral Indices',
      category: 'Mathematics',
      keyTakeaway: 'Narrowband indices exploit specific 2–5 nm physical absorption features, avoiding saturation common in broadband indices.',
      bullets: [
        'Broadband indices (e.g. Landsat NDVI): Integrate 50–100 nm chunks; saturate rapidly at LAI > 2.5 to 3.0.',
        'Narrowband indices (hyperspectral): Select precise wavelengths on the red edge slope, xanthophyll cycle, or water overtones.',
        'Red Edge NDVI (NDRE): Replaces red band with red edge band (705 nm), maintaining sensitivity at high biomass (LAI > 6.0).'
      ],
      speakerNotes: 'Compare the saturation curve of broadband NDVI vs narrowband NDRE over a dense corn canopy.',
      references: ['Gitelson, A. A., & Merzlyak, M. N. (1994). Quantitative estimation of chlorophyll-a content in plant leaves using reflectance spectra. Journal of Photochemistry and Photobiology.']
    },
    {
      id: 'm6_s13',
      slideNumber: 13,
      title: 'Pigment Indices: Chlorophyll, Carotenoids & Anthocyanins',
      category: 'Processing',
      keyTakeaway: 'Tailored band ratios isolate specific pigment pools without interference from overlapping absorption.',
      bullets: [
        'Chlorophyll Index Red Edge: CI_RE = (R780 / R710) - 1.0 (linear relationship with foliar chlorophyll content).',
        'Chlorophyll Index Green: CI_Green = (R780 / R550) - 1.0.',
        'Carotenoid Reflectance Index (CRI550): CRI = (1 / R510) - (1 / R550).',
        'Anthocyanin Reflectance Index (ARI): ARI = (1 / R550) - (1 / R700).'
      ],
      mathFormula: '\\text{CI}_{\\text{RE}} = \\frac{R_{780}}{R_{710}} - 1, \\quad \\text{ARI} = \\frac{1}{R_{550}} - \\frac{1}{R_{700}}',
      formulaExplanation: 'Gitelson pigment indices based on reciprocal reflectance differences.',
      speakerNotes: 'Explain the three-band concept: 1/R(pigment) - 1/R(interfering) normalized by R(NIR).',
      references: ['Gitelson, A. A. et al. (2006). Novel algorithms for remote estimation of vegetation fraction. Remote Sensing of Environment.']
    },
    {
      id: 'm6_s14',
      slideNumber: 14,
      title: 'Photochemical Reflectance Index (PRI) & Xanthophyll Cycle',
      category: 'Physics',
      keyTakeaway: 'PRI tracks the rapid, reversible epoxidation of violaxanthin to antheraxanthin and zeaxanthin in the photosynthetic apparatus.',
      bullets: [
        'Xanthophyll cycle: Non-Photochemical Quenching (NPQ) dissipates excess absorbed photon energy as heat under stress.',
        'Induces a subtle 0.2% to 0.5% absorption shift at 531 nm.',
        'Reference band at 570 nm is unaffected by xanthophyll interconversion.',
        'PRI = (R531 - R570) / (R531 + R570): Directly correlates with light use efficiency (LUE) and diurnal photosynthetic stress.'
      ],
      mathFormula: '\\text{PRI} = \\frac{R_{531} - R_{570}}{R_{531} + R_{570}}',
      formulaExplanation: 'Formulated by Gamon et al. (1992) for diurnal tracking of photosynthetic efficiency.',
      practicalFieldNote: 'Requires high SNR instruments; changes in PRI are small and easily drowned out by instrument drift.',
      speakerNotes: 'Show diurnal PRI curves: drops sharply at midday as plants enter photo-inhibition, recovers in late afternoon.',
      references: ['Gamon, J. A., Peñuelas, J., & Field, C. B. (1992). A narrow-waveband spectral index that tracks diurnal changes in photosynthetic efficiency. RSE.']
    },
    {
      id: 'm6_s15',
      slideNumber: 15,
      title: 'Canopy Water Indices: WI, NDWI & NDII',
      category: 'Processing',
      keyTakeaway: 'Water indices exploit weak water overtone absorption features at 970 nm and 1240 nm to retrieve canopy moisture.',
      bullets: [
        'Water Index (WI): WI = R900 / R970 (Peñuelas et al., 1993).',
        'Normalized Difference Water Index (NDWI): NDWI = (R860 - R1240) / (R860 + R1240) (Gao, 1996).',
        'Normalized Difference Infrared Index (NDII): NDII = (R860 - R1640) / (R860 + R1640).',
        'Directly estimates Equivalent Water Thickness (EWT [g/cm²]) and Fuel Moisture Content (FMC %).'
      ],
      mathFormula: '\\text{WI} = \\frac{R_{900}}{R_{970}}, \\quad \\text{NDWI} = \\frac{R_{860} - R_{1240}}{R_{860} + R_{1240}}',
      formulaExplanation: 'Formulations for foliar water overtone retrieval.',
      speakerNotes: 'Why use 970 and 1240 nm rather than 1400 nm? Because 1400 nm saturates immediately and is blocked by atmosphere.',
      references: ['Gao, B. C. (1996). NDWI—A normalized difference water index for remote sensing of vegetation liquid water from space. RSE.']
    },
    {
      id: 'm6_s16',
      slideNumber: 16,
      title: 'Cellulose Absorption Index (CAI) & Non-Photosynthetic Vegetation (NPV)',
      category: 'Physics',
      keyTakeaway: 'CAI quantifies dry plant litter, crop residue, and dead senescent vegetation using cellulose and lignin features in the SWIR.',
      bullets: [
        'Crop residue and dry grass cannot be detected with NDVI because chlorophyll is gone.',
        'Cellulose and lignin exhibit diagnostic doublet absorption features at 2100 nm and 2300 nm.',
        'CAI = 0.5 · (R2000 + R2200) - R2100 (Daughtry, 2001).',
        'Essential for monitoring conservation tillage, carbon sequestration, and wildfire fuel loads.'
      ],
      mathFormula: '\\text{CAI} = 100 \\cdot \\left[ 0.5 \\cdot (R_{2000} + R_{2200}) - R_{2100} \\right]',
      formulaExplanation: 'Cellulose Absorption Index formulated by Daughtry (2001).',
      speakerNotes: 'Show the SWIR spectrum of dry wheat straw vs green wheat vs bare mineral soil.',
      references: ['Daughtry, C. S. (2001). Discriminating crop residues from soil by shortwave infrared reflectance. Agronomy Journal.']
    },
    {
      id: 'm6_s17',
      slideNumber: 17,
      title: 'Mineral Indices: Clay, Carbonate & Iron Oxide Ratios',
      category: 'Processing',
      keyTakeaway: 'Narrowband SWIR band ratios differentiate clay species, carbonate rocks, and iron oxide alteration phases.',
      bullets: [
        'Al-OH Hydroxyl Index (Kaolinite/Muscovite): (R2160 / R2200).',
        'Carbonate Index (Calcite/Dolomite): (R2340 / R2200).',
        'Ferrous Iron Index: R1600 / R900.',
        'Ferric Oxide Index (Hematite vs Goethite): R650 / R450 and 2nd derivative zero-crossings.'
      ],
      speakerNotes: 'Show how mining geologists use these exact band ratios to map alteration zones in real time.',
      references: ['Ninomiya, Y. et al. (2005). Detecting lithology with advanced spaceborne thermal emission and reflection radiometer (ASTER). RSE.']
    },
    {
      id: 'm6_s18',
      slideNumber: 18,
      title: 'Spectral Angle Mapper (SAM) & Spectral Correlation Measure (SCM)',
      category: 'Mathematics',
      keyTakeaway: 'SAM treats spectra as vectors in N-dimensional space, measuring spectral angle θ independent of illumination brightness.',
      bullets: [
        'Vector dot product: cos(θ) = (t · r) / (||t|| · ||r||).',
        'Spectral angle θ is invariant to uniform illumination scaling (shadows or irradiance changes).',
        'Spectral Correlation Measure (SCM): Computes Pearson correlation coefficient r between target and reference spectrum.',
        'SCM standardizes spectra to mean 0, variance 1, making it robust against additive baseline offsets.'
      ],
      mathFormula: '\\theta(\\mathbf{t}, \\mathbf{r}) = \\arccos\\left( \\frac{\\sum_{i=1}^B t_i r_i}{\\sqrt{\\sum_{i=1}^B t_i^2} \\sqrt{\\sum_{i=1}^B r_i^2}} \\right)',
      formulaExplanation: 'Spectral Angle Mapper angle in radians or degrees.',
      speakerNotes: 'Explain the geometric intuition: Two spectra that have identical shapes but differ in brightness lie along the same vector ray (θ = 0).',
      references: ['Kruse, F. A. et al. (1993). The spectral image processing system (SIPS)—Interactive visualization and analysis. RSE.']
    },
    {
      id: 'm6_s19',
      slideNumber: 19,
      title: 'Spectral Information Divergence (SID)',
      category: 'Mathematics',
      keyTakeaway: 'SID models spectra as probability distributions and calculates spectral similarity using Kullback-Leibler information divergence.',
      bullets: [
        'Formulated by Chang (2000) based on Shannon information theory.',
        'Normalizes spectrum to a probability vector: p_i = x_i / Σ x_k.',
        'Calculates relative entropy D(p || q) and symmetrizes: SID = D(p || q) + D(q || p).',
        'More sensitive to subtle narrow absorption feature differences than SAM.'
      ],
      mathFormula: '\\text{SID}(\\mathbf{p}, \\mathbf{q}) = \\sum_{i=1}^B p_i \\log\\left(\\frac{p_i}{q_i}\\right) + \\sum_{i=1}^B q_i \\log\\left(\\frac{q_i}{p_i}\\right)',
      formulaExplanation: 'Symmetric Kullback-Leibler spectral information divergence.',
      speakerNotes: 'Compare classification confusion matrices of SAM vs SID for discriminating 12 mineral species.',
      references: ['Chang, C. I. (2000). An information-theoretic approach to spectral variability, similarity, and discrimination for hyperspectral imagery. IEEE TGRS.']
    },
    {
      id: 'm6_s20',
      slideNumber: 20,
      title: 'Principal Component Analysis (PCA) on Hyperspectral Data',
      category: 'Mathematics',
      keyTakeaway: 'PCA transforms hundreds of correlated spectral channels into an uncorrelated orthogonal subspace, concentrating variance.',
      bullets: [
        'Hyperspectral bands exhibit severe multicollinearity (> 0.95 inter-band correlation between adjacent channels).',
        'PCA diagonalizes the spectral covariance matrix: C = V · Λ · Vᵀ.',
        'First 3 to 5 Principal Components typically capture > 98% of total spectral variance across the dataset.',
        'PC1 captures overall brightness/albedo; PC2 captures red-edge/pigment contrast; PC3 captures SWIR moisture/cellulose.',
        'Noise whitening: Higher-order PCs contain primarily random noise and can be truncated.'
      ],
      speakerNotes: 'Show the scree plot of eigenvalues and display false-color composites of PC1, PC2, and PC3.',
      references: ['Richards, J. A. (2013). Remote Sensing Digital Image Analysis (5th ed.). Springer.']
    },
    {
      id: 'm6_s21',
      slideNumber: 21,
      title: 'Minimum Noise Fraction (MNF) Transformation',
      category: 'Mathematics',
      keyTakeaway: 'MNF performs two cascaded PCA rotations: the first separates and whitens noise; the second concentrates signal-to-noise ratio.',
      bullets: [
        'Standard PCA orders components by total variance, which can mistakenly elevate high-variance noise.',
        'MNF (Green et al., 1988) orders components strictly by Signal-to-Noise Ratio (SNR).',
        'Requires an estimate of the noise covariance matrix (from dark scans or spatial shift differences).',
        'Coherent vs. Noise bands: Eigenvalues >> 1 contain coherent spatial/spectral signal; eigenvalues near 1 contain pure white noise.'
      ],
      speakerNotes: 'Contrast MNF with PCA. Explain why MNF is the standard preprocessing step prior to spectral unmixing.',
      references: ['Green, A. A. et al. (1988). A transformation for ordering multispectral data in terms of image quality with implications for noise removal. IEEE TGRS.']
    },
    {
      id: 'm6_s22',
      slideNumber: 22,
      title: 'Linear Spectral Mixture Analysis (LSMA) & Endmember Extraction',
      category: 'Mathematics',
      keyTakeaway: 'Field footprints often mix multiple surface covers; LSMA decomposes mixed spectra into fractional abundances of pure endmembers.',
      bullets: [
        'Linear mixture model: Mixed spectrum is the linear combination of pure endmembers weighted by their areal fractions: x = Σ f_k · e_k + ε.',
        'Physical constraints: Fully Constrained Least Squares (FCLS): Abundance Non-Negativity Constraint (f_k ≥ 0) and Sum-to-One Constraint (Σ f_k = 1).',
        'Endmember extraction algorithms: Pixel Purity Index (PPI), N-FINDR, Vertex Component Analysis (VCA).'
      ],
      mathFormula: '\\mathbf{x} = \\sum_{k=1}^P f_k \\mathbf{e}_k + \\boldsymbol{\\varepsilon}, \\quad \\text{s.t.} \\; f_k \\ge 0 \\; \\text{and} \\; \\sum_{k=1}^P f_k = 1',
      formulaExplanation: 'Fully Constrained Linear Spectral Mixture Model.',
      speakerNotes: 'Walk students through unmixing a mixed pixel containing 40% green leaf, 35% dry litter, and 25% bare soil.',
      references: ['Adams, J. B., Smith, M. O., & Gillespie, A. R. (1993). Imaging spectroscopy: Interpretation based on spectral mixture analysis. Remote Geochemical Analysis.']
    },
    {
      id: 'm6_s23',
      slideNumber: 23,
      title: 'Non-Linear Spectral Mixing in Vegetation Canopies',
      category: 'Physics',
      keyTakeaway: 'Multiple scattering between canopy leaves and background soil produces non-linear photon interactions that violate linear mixture models.',
      bullets: [
        'Linear mixing assumes photons interact with only one surface component before entering the foreoptic.',
        'In dense canopies, transmitted NIR photons bounce between multiple leaf layers and soil before exitance.',
        'Hapke intimate mixture model and bilinear models (Fan, Nascimento) account for multi-bounce interactions.',
        'Linear unmixing of vegetation canopies typically overestimates soil fraction if non-linear scattering is ignored.'
      ],
      speakerNotes: 'Draw the multiple scattering photon trajectory through a 3D forest canopy to explain non-linear mixing.',
      references: ['Ray, T. W., & Murray, B. C. (1996). Nonlinear spectral mixing in desert vegetation. RSE.']
    },
    {
      id: 'm6_s24',
      slideNumber: 24,
      title: 'Partial Least Squares Regression (PLSR) in Spectroscopy',
      category: 'Mathematics',
      keyTakeaway: 'PLSR projects both predictor spectra (X) and target biochemical traits (Y) to latent variables, maximizing covariance.',
      bullets: [
        'Overcomes multicollinearity where ordinary least squares (OLS) regression completely fails.',
        'Latent vectors: Supervised decomposition that extracts features most predictive of foliar nitrogen, phosphorus, or LMA.',
        'Cross-validation (k-fold or leave-one-out): Determines the optimal number of latent components to avoid overfitting.',
        'Variable Importance in Projection (VIP): Identifies which spectral wavelengths contribute most to the biochemical model.'
      ],
      speakerNotes: 'Explain VIP scores: Wavelengths with VIP > 1.0 are considered statistically significant predictors.',
      references: ['Wold, S. et al. (2001). PLS-regression: a basic tool of chemometrics. Chemometrics and Intelligent Laboratory Systems.']
    },
    {
      id: 'm6_s25',
      slideNumber: 25,
      title: 'Cross-Validation & Avoiding Overfitting in Chemometrics',
      category: 'QualityAssurance',
      keyTakeaway: 'With 2000 spectral predictor bands and 50 field samples, random correlation can produce spurious R² > 0.95 without cross-validation.',
      bullets: [
        'The Curse of Dimensionality: p >> n problem (more spectral bands than physical ground samples).',
        'Always evaluate models on an independent holdout test set (e.g. 70% train / 30% test).',
        'Spatial cross-validation: Split training and testing sets by geographic spatial blocks to avoid spatial autocorrelation leakage.',
        'Report RMSE_CV (Cross-Validation Root Mean Square Error) and RPD (Ratio of Performance to Deviation).'
      ],
      practicalFieldNote: 'Never report calibration R² alone; report validation R²_val and RMSE_val on truly independent sites.',
      speakerNotes: 'Show an example of a 100-band noise dataset predicting a random coin flip with R² = 0.92 when overfitted with OLS.',
      references: ['Roberts, D. R. et al. (2017). Cross-validation strategies for data with spatial, temporal, hierarchical or phylogenetic structure. Ecography.']
    },
    {
      id: 'm6_s26',
      slideNumber: 26,
      title: 'Automated Spectral Feature Matching: USGS Tetracorder',
      category: 'CaseStudy',
      keyTakeaway: 'USGS Tetracorder matches unknown field spectra against a reference spectral library using continuum-removed shape metrics.',
      bullets: [
        'Developed by Roger Clark and USGS Spectral Lab team.',
        'Normalizes candidate features using continuum removal over diagnostic wavelength intervals.',
        'Computes weighted correlation coefficient, band depth, and asymmetry against > 1000 laboratory reference minerals and plants.',
        'Delivers automated mineral identification with quantitative confidence levels.'
      ],
      speakerNotes: 'Show the USGS mineral library database and the Tetracorder decision-tree logic flow.',
      references: ['Clark, R. N. et al. (2003). Imaging spectroscopy: Earth and planetary remote sensing with the USGS Tetracorder and expert systems. JGR.']
    },
    {
      id: 'm6_s27',
      slideNumber: 27,
      title: 'Foliar Nitrogen & Protein Retrieval: The N-H SWIR Bands',
      category: 'CaseStudy',
      keyTakeaway: 'Foliar nitrogen is bound primarily in Rubisco enzymes and photosynthetic proteins, producing diagnostic N-H absorption in SWIR.',
      bullets: [
        'Total leaf nitrogen (N %): Highly correlated with maximum carboxylation rate (Vcmax) and photosynthetic capacity.',
        'N-H peptide bond absorption features: 1510 nm, 1680 nm, 2060 nm, and 2180 nm.',
        'Often masked by liquid water in fresh leaves; continuum removal and first-derivative analysis isolate protein features.',
        'PLSR models routinely achieve R² > 0.85 for nitrogen retrieval across diverse plant functional types.'
      ],
      speakerNotes: 'Show dry leaf spectra vs fresh leaf spectra in the 2100–2200 nm zone to demonstrate protein feature unmasking.',
      references: ['Kokaly, R. F. (2001). Investigating a physical basis for spectroscopic estimates of canopy nitrogen concentration. RSE.']
    },
    {
      id: 'm6_s28',
      slideNumber: 28,
      title: 'Open-Source Spectral Processing Toolkits: Python & R Ecosystem',
      category: 'Processing',
      keyTakeaway: 'The modern spectroscopic research workflow is built on open-source Python (pysptools, specdal, scikit-learn) and R (hsdar, prospectr).',
      bullets: [
        'Python: `pysptools` (endmember extraction, unmixing), `specdal` (instrument readers, ASD batch processing), `scikit-learn` (PLSR, PCA, RF).',
        'R: `hsdar` (hyperspectral data analysis, PROSAIL coupling, indices), `prospectr` (SNV, MSC, Savitzky-Golay, continuum removal).',
        'Guarantees fully scripted, reproducible, version-controlled scientific analysis pipelines.'
      ],
      speakerNotes: 'Review the package dependencies and show the online documentation for hsdar and prospectr.',
      references: ['Lehnert, L. W. et al. (2019). hsdar: Manage, analyze and simulate hyperspectral data in R. Package Vignette.']
    },
    {
      id: 'm6_s29',
      slideNumber: 29,
      title: 'Batch Processing Pipelines for Large Field Campaigns',
      category: 'QualityAssurance',
      keyTakeaway: 'Automated batch pipelines enforce consistent quality flags, dark current subtraction, and feature extraction across thousands of spectra.',
      bullets: [
        'Modular pipeline architecture: Ingestion -> Quality screening -> Dark current subtract -> White reference calibrate -> Saturated band mask -> Savitzky-Golay filter -> Continuum removal -> Feature extraction -> Export to SPECCHIO / NetCDF.',
        'Automated logging of QA failure flags (e.g. WR departure > 1.5%, SZA > 50°).',
        'Enables repeatable re-processing when sensor calibration coefficients are updated.'
      ],
      speakerNotes: 'Show the flowchart of an automated batch script processing 5,000 field spectra in under 2 minutes.',
      references: ['Hueni, A. et al. (2009). Computers & Geosciences.']
    },
    {
      id: 'm6_s30',
      slideNumber: 30,
      title: 'Module 6 Synthesis & Preparing for Radiative Transfer Modeling',
      category: 'Processing',
      keyTakeaway: 'Preprocessing and feature extraction isolate fundamental physical and biochemical parameters from noisy outdoor spectra.',
      bullets: [
        'Module 6 established: Savitzky-Golay smoothing, SNV, MSC, continuum removal convex hulls, band depths, derivatives, and spectral indices.',
        'In Module 7, we explore the forward physics: Radiative Transfer Models (RTMs) spanning leaf-level PROSPECT and canopy-level SAIL (PROSAIL) and look-up table inversion.',
        'Preparation for Field Exercise 6: Collecting leaf and mineral spectra and executing continuum removal and band depth analysis.'
      ],
      speakerNotes: 'Wrap up preprocessing lecture, confirm understanding of continuum removal math, and introduce Lab 6.',
      references: ['Clark, R. N., & Roush, T. L. (1984). JGR, 89(B7), 6329-6340.']
    }
  ];
}

export const MODULE_6: CourseModule = {
  id: 'module_6',
  moduleNumber: 6,
  title: 'Advanced Spectral Preprocessing, Continuum Removal & Feature Extraction',
  shortTitle: 'Spectral Preprocessing & Feature Extraction',
  subtitle: 'Savitzky-Golay smoothing, SNV, MSC, continuum removal convex hulls, spectral derivatives, and narrow-band indices',
  durationHours: 4,
  ectsCredits: 1.5,
  abstract: 'Module 6 equips MSc students with advanced mathematical and chemometric algorithms for preprocessing field spectra and extracting diagnostic biochemical and mineralogical features. The curriculum covers noise suppression via Savitzky-Golay polynomial convolution, scatter correction via Standard Normal Variate (SNV) and Multiplicative Scatter Correction (MSC), and the Clark & Roush continuum removal algorithm. Students derive physical absorption metrics: band center, band depth, FWHM, and absorption band area. The module explores spectral derivatives (1st/2nd order, red edge inflection point REIP), narrow-band physiological indices (PRI, NDRE, CI_RE, NDWI, CAI), and dimensionality reduction via PCA, MNF, and Partial Least Squares Regression (PLSR).',
  coreCompetencies: [
    'Implement and optimize Savitzky-Golay smoothing and derivative convolution filters without distorting narrow absorption features.',
    'Apply Standard Normal Variate (SNV) and Multiplicative Scatter Correction (MSC) to remove non-linear particulate scattering.',
    'Formulate the convex hull continuum removal algorithm and calculate band depth, FWHM, and absorption area.',
    'Calculate spectral derivatives and determine the Red Edge Inflection Point (REIP) using polynomial and inverted Gaussian models.',
    'Compute narrow-band physiological indices (PRI, NDRE, CI_RE, WI, CAI) and execute Partial Least Squares Regression (PLSR).'
  ],
  slides: generateModule6Slides(),
  fieldExercise: {
    title: 'Field Exercise 6: Spectral Library Construction, Foliar Trait Collection & In-Situ Absorption Feature Extraction',
    estimatedDuration: '4 hours',
    targetEnvironment: 'Botanical garden, arboretum, or agricultural research plot with diverse plant functional types',
    recommendedInstruments: ['ASD FieldSpec or SVC Spectroradiometer with plant probe and leaf clip', 'Spectralon reference standard', 'Field SPAD chlorophyll meter / Dualex sensor', 'Precision leaf punch and analytical balance (for Specific Leaf Area SLA)', 'Drying oven (at field station)'],
    safetyAndPreTripChecklist: [
      'Inspect plant probe halogen bulb alignment and verify clean internal Spectralon white backing.',
      'Prepare sealable bags with moist paper towels on ice for preserving destructively sampled leaf discs.',
      'Check spectrometer battery capacity for > 3 hours of continuous plant probe halogen lamp operation.',
      'Verify SPAD meter calibration on reference card before field departure.'
    ],
    fieldProtocolSteps: [
      {
        stepNumber: 1,
        action: 'Sample 5 distinct plant species (broadleaf deciduous, evergreen conifer, C3 crop, C4 grass, nitrogen-fixing legume).',
        scientificRationale: 'Spans a wide dynamic range of chlorophyll, nitrogen, carotenoid, and dry matter concentrations.',
        commonErrorToAvoid: 'Selecting diseased or damaged leaves that do not represent healthy canopy status.'
      },
      {
        stepNumber: 2,
        action: 'For each species, measure 10 sunlit leaves using the plant probe with internal halogen light against the black background backing.',
        scientificRationale: 'Eliminates outdoor solar zenith dynamics and atmospheric fluctuations, capturing pure leaf reflectance.',
        commonErrorToAvoid: 'Clamping the leaf for more than 5 seconds, causing thermal burning and moisture loss.'
      },
      {
        stepNumber: 3,
        action: 'Measure SPAD chlorophyll index and take a 2 cm² leaf punch from the exact measured leaf area; record fresh weight.',
        scientificRationale: 'Provides ground truth biophysical metrics required to calibrate chemometric regression models.',
        commonErrorToAvoid: 'Measuring over primary thick leaf veins or midribs; measure uniform inter-veinal lamina.'
      },
      {
        stepNumber: 4,
        action: 'Dry leaf punches in the laboratory oven at 65°C for 48 hours; re-weigh to determine Equivalent Water Thickness (EWT) and Leaf Mass per Area (LMA).',
        scientificRationale: 'Quantifies true physical foliar water content and dry matter fraction for validation.',
        commonErrorToAvoid: 'Drying at excessive temperatures (> 80°C) which volatilizes structural carbon compounds.'
      }
    ],
    dataRecordingSheetFields: [
      'Sample ID & Species Botanical Name',
      'Plant Functional Type',
      'SPAD Chlorophyll Value (triplicate mean)',
      'Fresh Leaf Punch Weight (mg)',
      'Dry Leaf Punch Weight (mg)',
      'Calculated LMA (g/m²)',
      'Calculated EWT (g/cm²)',
      'Raw Spectrometer File Name',
      'Operator Initials'
    ],
    fieldDeliverable: 'Submit a curated spectral library dataset containing calibrated foliar spectra, continuum-removed absorption feature metrics, SPAD correlation plots, and PLSR model validation tables.'
  },
  practicalLab: {
    title: 'Practical Lab 6: Savitzky-Golay, SNV, Continuum Removal & PLSR Chemometrics in Python and R',
    softwareEnvironment: 'Hybrid (Python & R)',
    primaryPackages: ['pysptools', 'scikit-learn', 'scipy', 'numpy', 'matplotlib', 'prospectr (R)', 'pls (R)'],
    learningObjectives: [
      'Implement the Savitzky-Golay smoothing and derivative convolution algorithm.',
      'Execute Standard Normal Variate (SNV) and Multiplicative Scatter Correction (MSC) transformations.',
      'Code a robust convex-hull continuum removal algorithm from scratch in Python.',
      'Build and cross-validate a Partial Least Squares Regression (PLSR) model to predict chlorophyll from hyperspectral curves.'
    ],
    sampleDataset: {
      name: 'Foliar_Spectra_Biochemistry_Lab_Data.csv',
      description: 'Hyperspectral reflectance matrix of 80 leaf samples across 400–2400 nm paired with laboratory wet-chemistry chlorophyll a+b (µg/cm²), carotenoids, and nitrogen content.',
      spectralRange: '400 - 2400 nm',
      sensor: 'ASD Plant Probe Spectroradiometer',
      bandsCount: 2001
    },
    codeSnippets: [
      {
        language: 'python',
        title: 'Python: Convex Hull Continuum Removal & Absorption Band Depth Extraction',
        description: 'Computes the upper convex hull over a specified absorption region and extracts band center, band depth, and band area.',
        code: `import numpy as np
from scipy.spatial import ConvexHull
import matplotlib.pyplot as plt

def compute_continuum_removal(wavelengths, reflectance, band_start=550, band_end=750):
    """
    Computes continuum-removed reflectance over a specific absorption feature
    using a 2D convex hull.
    """
    # Isolate spectral window
    mask = (wavelengths >= band_start) & (wavelengths <= band_end)
    sub_wl = wavelengths[mask]
    sub_refl = reflectance[mask]
    
    # Construct 2D points for convex hull: [wavelength, reflectance]
    # Add baseline endpoints to close the hull at the bottom
    pts = np.column_stack([sub_wl, sub_refl])
    # Append artificial lower bounding points
    p_start_bot = [sub_wl[0], 0.0]
    p_end_bot   = [sub_wl[-1], 0.0]
    hull_pts = np.vstack([pts, p_end_bot, p_start_bot])
    
    hull = ConvexHull(hull_pts)
    
    # Extract vertices forming the upper boundary
    upper_vertices = []
    for v in hull.vertices:
        if v < len(pts): # Only original spectral points
            upper_vertices.append(pts[v])
            
    upper_vertices = np.array(upper_vertices)
    # Sort vertices by wavelength
    upper_vertices = upper_vertices[np.argsort(upper_vertices[:, 0])]
    
    # Ensure strict endpoints are included
    if upper_vertices[0, 0] > sub_wl[0]:
        upper_vertices = np.vstack([[sub_wl[0], sub_refl[0]], upper_vertices])
    if upper_vertices[-1, 0] < sub_wl[-1]:
        upper_vertices = np.vstack([upper_vertices, [sub_wl[-1], sub_refl[-1]]])
        
    # Interpolate continuum linearly between upper hull vertices
    continuum = np.interp(sub_wl, upper_vertices[:, 0], upper_vertices[:, 1])
    
    # Continuum-removed reflectance
    cr_reflectance = sub_refl / continuum
    cr_reflectance = np.clip(cr_reflectance, 0.0, 1.0)
    
    # Calculate quantitative diagnostic parameters
    min_idx = np.argmin(cr_reflectance)
    band_center = sub_wl[min_idx]
    band_depth  = 1.0 - cr_reflectance[min_idx]
    band_area   = np.trapz(1.0 - cr_reflectance, sub_wl)
    
    return sub_wl, sub_refl, continuum, cr_reflectance, band_center, band_depth, band_area

# Synthetic vegetation red absorption trough (Chlorophyll absorption 550 to 750 nm)
wl = np.arange(400, 901, 1)
# Realistic vegetation curve with green peak (550nm), red trough (675nm), NIR plateau (780nm)
refl = 0.05 + 0.10 * np.exp(-((wl - 550)/40)**2) + 0.40 / (1.0 + np.exp(-0.05 * (wl - 715)))
# Add dip at 675 nm
refl -= 0.08 * np.exp(-((wl - 675)/30)**2)

sub_wl, orig, cont, cr, center, depth, area = compute_continuum_removal(wl, refl, 550, 750)

print(f"Diagnostic Chlorophyll Absorption Feature:")
print(f"Band Center: {center} nm")
print(f"Band Depth:  {depth:.4f}")
print(f"Band Area:   {area:.2f} nm")
`
      },
      {
        language: 'r',
        title: 'R Script: Savitzky-Golay Smoothing, SNV & PLSR Modeling in R',
        description: 'Applies Standard Normal Variate (SNV) and Savitzky-Golay filtering using `prospectr`, then trains a Partial Least Squares Regression model.',
        code: `# Principles of Field Spectroscopy: MSc Lab 6
# Advanced Preprocessing and PLSR in R
library(prospectr)
library(pls)

# Simulate 50 leaf spectra across 100 wavelengths
set.seed(42)
n_samples <- 50
n_bands <- 100
wavelengths <- seq(500, 900, length.out=n_bands)

raw_spectra <- matrix(nrow=n_samples, ncol=n_bands)
true_chlorophyll <- runif(n_samples, min=15, max=65) # ug/cm2

for (i in 1:n_samples) {
  # Red trough depth scales with chlorophyll
  depth <- true_chlorophyll[i] * 0.003
  base <- 0.15 + 0.35 / (1 + exp(-0.04 * (wavelengths - 710))) - depth * exp(-((wavelengths - 675)/25)^2)
  # Add multiplicative scatter noise and random noise
  scatter <- runif(1, 0.85, 1.15)
  raw_spectra[i, ] <- base * scatter + rnorm(n_bands, sd=0.005)
}

# 1. Standard Normal Variate (SNV) Scatter Correction
snv_spectra <- standardNormalVariate(X = raw_spectra)

# 2. Savitzky-Golay Smoothing & 1st Derivative (window=11, poly=2, deriv=1)
sg_deriv1 <- savitzkyGolay(X = snv_spectra, m = 1, p = 2, w = 11)

# 3. Fit Partial Least Squares Regression (PLSR) with 10-fold cross-validation
plsr_data <- data.frame(Chlorophyll = true_chlorophyll)
plsr_data$Spectra <- sg_deriv1

model <- plsr(Chlorophyll ~ Spectra, data = plsr_data, ncomp = 5, validation = "CV")
cat("PLSR Model Summary (Cross-Validation):\\n")
print(summary(model))
`
      }
    ],
    studentTasks: [
      'Write a Python function to test different Savitzky-Golay window lengths (7, 15, 31, 51 nm); plot the change in Red Edge Inflection Point (REIP) and evaluate over-smoothing.',
      'Implement the Clark & Roush continuum removal algorithm across the 2100–2250 nm region for kaolinite and montmorillonite minerals; extract the Al-OH doublet depths.',
      'Train a PLSR model predicting chlorophyll from raw spectra vs SNV-transformed spectra; compare validation RMSE and demonstrate the benefit of scatter removal.'
    ],
    expectedOutputSummary: 'Students produce complete Python and R scripts demonstrating Savitzky-Golay derivative filtering, convex hull continuum removal, and cross-validated PLSR foliar trait retrieval.'
  },
  quiz: {
    moduleNumber: 6,
    title: 'Module 6 Automated Assessment: Spectral Preprocessing & Feature Extraction',
    passingScorePercent: 80,
    questions: [
      {
        id: 'm6_q1',
        question: 'Why is a Savitzky-Golay filter strongly preferred over a simple moving average filter when smoothing high-resolution field spectra?',
        options: [
          'Because Savitzky-Golay filters run faster on GPUs.',
          'Because a moving average blunts and flattens narrow absorption peaks, reducing peak depth and artificially broadening FWHM, whereas Savitzky-Golay fits a local least-squares polynomial that preserves peak geometry.',
          'Because moving averages convert reflectance into radiance automatically.',
          'Because Savitzky-Golay filters remove atmospheric water vapor without data.'
        ],
        correctOptionIndex: 1,
        explanation: 'Moving averages unweighted local means systematically blunt narrow spectral absorption peaks. Savitzky-Golay fits local polynomials that preserve higher-order moments (peak height, width, and area).',
        academicCitation: 'Savitzky, A., & Golay, M. J. (1964). Analytical Chemistry, 36(8), 1627-1639.'
      },
      {
        id: 'm6_q2',
        question: 'What is the primary physical objective of applying Standard Normal Variate (SNV) or Multiplicative Scatter Correction (MSC) to reflectance spectra?',
        options: [
          'To generate artificial RGB false-color images.',
          'To remove non-linear physical light scattering, baseline offsets, and optical path-length variations caused by particle size and cellular anatomy, isolating pure chemical absorption.',
          'To boost satellite down-link bandwidth.',
          'To convert 16-bit integers into 8-bit characters.'
        ],
        correctOptionIndex: 1,
        explanation: 'SNV and MSC normalize each spectrum to eliminate additive baseline offsets and multiplicative scaling shifts caused by physical scattering and particle morphology, leaving pure chemical absorption features.',
        academicCitation: 'Barnes, R. J. et al. (1989). Applied Spectroscopy, 43(5), 772-777.'
      },
      {
        id: 'm6_q3',
        question: 'In the Clark & Roush (1984) continuum removal algorithm, how is the continuum-removed reflectance R_cr(λ) calculated from the raw reflectance R(λ) and upper convex hull baseline R_c(λ)?',
        options: [
          'R_cr(λ) = R(λ) - R_c(λ)',
          'R_cr(λ) = R(λ) / R_c(λ)',
          'R_cr(λ) = R_c(λ) / R(λ)',
          'R_cr(λ) = log(R(λ)) · R_c(λ)'
        ],
        correctOptionIndex: 1,
        explanation: 'Continuum removal normalizes reflectance by dividing the measured reflectance by the continuum convex hull curve: R_cr(λ) = R(λ) / R_c(λ), yielding values scaled between 0 and 1.',
        academicCitation: 'Clark, R. N., & Roush, T. L. (1984). JGR, 89(B7), 6329-6340.'
      },
      {
        id: 'm6_q4',
        question: 'What biological physiological process does the Photochemical Reflectance Index (PRI = (R531 - R570) / (R531 + R570)) track in sunlit plant leaves?',
        options: [
          'Xylem water flow from roots to stems.',
          'The rapid, reversible de-epoxidation of violaxanthin to zeaxanthin in the xanthophyll cycle, which regulates non-photochemical quenching and photosynthetic light use efficiency (LUE).',
          'Root nodule nitrogen fixation by Rhizobium bacteria.',
          'Cellulose synthesis in cell walls during autumn senescence.'
        ],
        correctOptionIndex: 1,
        explanation: 'PRI measures subtle absorption shifts at 531 nm associated with the interconversion of xanthophyll pigment states, tracking excess photon energy dissipation as heat (NPQ) and photosynthetic efficiency.',
        academicCitation: 'Gamon, J. A. et al. (1992). Remote Sensing of Environment, 41(1), 35-44.'
      },
      {
        id: 'm6_q5',
        question: 'Why does Ordinary Least Squares (OLS) multiple linear regression fail catastrophically when applied directly to 2000 contiguous hyperspectral bands, necessitating Partial Least Squares Regression (PLSR)?',
        options: [
          'Because OLS cannot compute numbers with decimal places.',
          'Because extreme multicollinearity (near-perfect correlation between adjacent bands) causes matrix inversion singularity (X^T X)^(-1), resulting in severe overfitting and explosive coefficient variance.',
          'Because OLS only works on black-and-white photographs.',
          'Because hyperspectral sensors use analog electronics.'
        ],
        correctOptionIndex: 1,
        explanation: 'Adjacent hyperspectral bands are highly collinear. The X^T X covariance matrix is near-singular and cannot be inverted stably in OLS; PLSR projects X and Y to orthogonal latent components, overcoming collinearity.',
        academicCitation: 'Wold, S. et al. (2001). Chemometrics and Intelligent Laboratory Systems, 58(2), 109-130.'
      }
    ]
  },
  keyReferences: [
    {
      authors: 'Clark, R. N., & Roush, T. L.',
      year: 1984,
      title: 'Reflectance spectroscopy: Quantitative analysis techniques for remote sensing applications',
      journalOrPublisher: 'Journal of Geophysical Research: Solid Earth, 89(B7), 6329-6340',
      doiOrUrl: '10.1029/JB089iB07p06329'
    },
    {
      authors: 'Rinnan, Å., van den Berg, F., & Engelsen, S. B.',
      year: 2009,
      title: 'Review of the most common pre-processing techniques for near-infrared spectra',
      journalOrPublisher: 'TrAC Trends in Analytical Chemistry, 28(10), 1201-1222',
      doiOrUrl: '10.1016/j.trac.2009.07.007'
    },
    {
      authors: 'Gamon, J. A., Peñuelas, J., & Field, C. B.',
      year: 1992,
      title: 'A narrow-waveband spectral index that tracks diurnal changes in photosynthetic efficiency',
      journalOrPublisher: 'Remote Sensing of Environment, 41(1), 35-44',
      doiOrUrl: '10.1016/0034-4257(92)90059-S'
    }
  ]
};
