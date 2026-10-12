import type { CourseModule, Slide } from '../types';

function generateModule5Slides(): Slide[] {
  return [
    {
      id: 'm5_s1',
      slideNumber: 1,
      title: 'Transition from Point Spectrometry to Drone Imaging Spectroscopy',
      category: 'Instrumentation',
      keyTakeaway: 'UAV imaging spectroscopy bridges the spatial scaling gap between individual ground point spectra and satellite pixel grids.',
      bullets: [
        'Point spectrometers deliver exceptional spectral fidelity (> 2000 contiguous bands) but lack continuous spatial context.',
        'Unmanned Aerial Vehicles (UAVs / drones) provide centimetric ground sampling distance (GSD 1–5 cm) with hundreds of spectral channels.',
        'Enables mapping individual plant crowns, crop stress micro-heterogeneity, and sub-meter geological outcrops.'
      ],
      practicalFieldNote: 'UAV flights inherit aircraft attitude dynamics (roll, pitch, yaw) and vibration requiring high-grade IMU integration.',
      speakerNotes: 'Welcome to Module 5. We transition from stationary tripods to airborne drone imaging systems.',
      references: ['Aasen, H. et al. (2018). Quantitative remote sensing at ultra-high resolution with UAV photogrammetry and spectroscopy. Remote Sensing.']
    },
    {
      id: 'm5_s2',
      slideNumber: 2,
      title: 'Anatomy of Hyperspectral Sensor Types: Pushbroom vs. Snapshot',
      category: 'Instrumentation',
      keyTakeaway: 'Pushbroom sensors scan linear cross-track swaths over time; snapshot frame cameras capture full 2D spatial images instantaneously.',
      bullets: [
        'Pushbroom (Line-scan, e.g. Headwall Nano-Hyperspec, Corning microHSI): Entrance slit disperses light along a 2D focal plane array (one spatial axis, one spectral axis). Forward aircraft motion builds the 2D image.',
        'Snapshot Hyperspectral (e.g. Cubert UHD, Photonfocus): Captures 2D spatial dimensions (X, Y) and multiple spectral bands simultaneously in a single exposure.',
        'Fabry-Perot Interferometer (FPI, e.g. Senop): Sequentially changes interferometer cavity gap to acquire spectral frames across time.'
      ],
      speakerNotes: 'Show the 3D data cube animation illustrating line-scan vs frame-sequential acquisition.',
      references: ['Adão, T. et al. (2017). Hyperspectral imaging: A review on UAV-based sensors, data processing and applications for agriculture and forestry. Remote Sensing.']
    },
    {
      id: 'm5_s3',
      slideNumber: 3,
      title: 'Multispectral vs. Hyperspectral UAV Payloads',
      category: 'Instrumentation',
      keyTakeaway: 'Multispectral sensors use discrete optical bandpass filters; hyperspectral sensors sample contiguous continuous narrow bands.',
      bullets: [
        'Multispectral (e.g. MicaSense RedEdge-P, DJI Mavic 3M): 5 to 10 broad bands (FWHM 10–40 nm) targeting key pigments and red edge.',
        'Hyperspectral (e.g. Headwall, Resonon): 100 to 300+ contiguous narrow bands (FWHM 2–6 nm) resolving narrow absorption features.',
        'Trade-off: Multispectral is lightweight, low-cost, and robust; hyperspectral is heavy, expensive, and demands complex georeferencing.'
      ],
      practicalFieldNote: 'Multispectral sensors suffice for general NDVI and canopy vigor; hyperspectral is required for biochemical trait retrieval (nitrogen, carotenoids, lignin).',
      speakerNotes: 'Display spectral band comparisons of MicaSense 5-band vs Headwall 270-band curves over the same leaf.',
      references: ['Zarco-Tejada, P. J. et al. (2012). High-resolution airborne hyperspectral imagery for assessing crop water stress. Agricultural and Forest Meteorology.']
    },
    {
      id: 'm5_s4',
      slideNumber: 4,
      title: 'The Pushbroom Image Cube Formation Physics',
      category: 'Physics',
      keyTakeaway: 'Pushbroom cameras project a single geographic line onto a 2D detector array, with one dimension recording space and the orthogonal dimension recording wavelength.',
      bullets: [
        'Spatial dimension: Line of N pixels across track (e.g. 640 or 1024 spatial pixels).',
        'Spectral dimension: M spectral channels dispersed by an internal convex grating onto M rows of the array (e.g. 270 bands).',
        'Frame rate (fps): The drone must fly forward at an exact ground speed to produce square pixels on the ground without spatial stretching or compression.'
      ],
      mathFormula: 'V_{\\text{drone}} = \\text{GSD} \\cdot f_{\\text{frame}} = \\left( \\frac{h \\cdot p}{f} \\right) \\cdot f_{\\text{frame}}',
      formulaExplanation: 'Ideal flight speed V_drone as a function of ground sampling distance GSD and camera frame rate f_frame.',
      speakerNotes: 'Work out a practical flight calculation: if GSD = 3 cm and frame rate = 100 Hz, maximum flight speed is 3.0 m/s.',
      references: ['Headwall Photonics (2018). Nano-Hyperspec User and Integration Manual.']
    },
    {
      id: 'm5_s5',
      slideNumber: 5,
      title: 'Direct Georeferencing: GNSS/IMU Inertial Navigation',
      category: 'Instrumentation',
      keyTakeaway: 'Pushbroom lines cannot be stitched using standard photogrammetry; each scan line requires position and orientation from an RTK GNSS/IMU.',
      bullets: [
        'Each individual pushbroom line is acquired at a unique microsecond in time with distinct aircraft roll, pitch, yaw, and altitude.',
        'Applanix APX or SBG Ellipse tactical-grade Inertial Measurement Unit (IMU): Measures angular velocity and linear acceleration at 200–500 Hz.',
        'Extended Kalman Filter (EKF): Fuses dual-frequency RTK GNSS and IMU gyroscopes to achieve pitch/roll accuracy < 0.03° and heading < 0.08°.'
      ],
      practicalFieldNote: 'Never fly pushbroom payloads with consumer-grade IMUs; uncorrected roll wiggles turn straight crop rows into oscillating sine waves.',
      speakerNotes: 'Show the raw distorted "snake" pushbroom image before IMU trajectory correction and the clean orthorectified image after.',
      references: ['Mostafa, M. M. R., & Schwarz, K. P. (2000). A multi-sensor system for airborne mapping without ground control points. Photogrammetric Engineering & Remote Sensing.']
    },
    {
      id: 'm5_s6',
      slideNumber: 6,
      title: 'Boresight and Lever-Arm Calibration',
      category: 'QualityAssurance',
      keyTakeaway: 'Physical offsets between GNSS antenna, IMU center of navigation, and camera focal point must be calibrated to sub-millimeter precision.',
      bullets: [
        'Lever-Arm Offset [ΔX, ΔY, ΔZ]: Physical vector between IMU center of navigation and camera optical entrance pupil.',
        'Boresight Misalignment Angles [dRoll, dPitch, dYaw]: Angular rotation between the IMU coordinate axes and the camera optical frame.',
        'Calibration flights: Flying reciprocal opposing flight lines over distinct sharp control targets (buildings, survey markers) resolves boresight angles.'
      ],
      mathFormula: '\\mathbf{r}_{\\text{ground}} = \\mathbf{r}_{\\text{GNSS}} + \\mathbf{R}_{\\text{IMU}} \\cdot \\mathbf{l}_{\\text{lever}} + s \\cdot \\mathbf{R}_{\\text{IMU}} \\cdot \\mathbf{R}_{\\text{boresight}} \\cdot \\mathbf{u}_{\\text{pixel}}',
      formulaExplanation: 'Rigorous direct georeferencing transformation equation.',
      speakerNotes: 'A boresight pitch error of only 0.2° produces a 17 cm ground projection error from a flight altitude of 50 m.',
      references: ['Skaloud, J. (1999). Optimizing Direct Georeferencing of Airborne Mapping Systems. PhD Thesis, University of Calgary.']
    },
    {
      id: 'm5_s7',
      slideNumber: 7,
      title: 'Structure-from-Motion (SfM) Photogrammetry for Multispectral Frame Cameras',
      category: 'Processing',
      keyTakeaway: 'Snapshot and multispectral frame cameras reconstruct 3D surface geometry and orthomosaics using bundle block adjustment.',
      bullets: [
        'Scale-Invariant Feature Transform (SIFT): Detects thousands of shared feature keypoints across overlapping photos.',
        'High overlap requirement: Multispectral mapping requires 75–85% forward overlap and 70–80% side overlap.',
        'Bundle adjustment: Simultaneously solves camera interior orientation (focal length, lens distortion) and exterior poses.',
        'Generates 3D Dense Point Cloud, Digital Surface Model (DSM), and radiometrically calibrated orthomosaic.'
      ],
      speakerNotes: 'Discuss Agisoft Metashape and Pix4D workflows for multispectral radiometric calibration.',
      references: ['Westoby, M. J. et al. (2012). ‘Structure-from-Motion’ photogrammetry: A low-cost, effective tool for geoscience applications. Geomorphology.']
    },
    {
      id: 'm5_s8',
      slideNumber: 8,
      title: 'Downwelling Light Sensors (DLS / Sunshine Sensors)',
      category: 'Instrumentation',
      keyTakeaway: 'Upward-looking DLS sensors measure incident solar irradiance during flight to normalize image pixels for solar illumination drift.',
      bullets: [
        'Mounted on the highest point of the UAV airframe with an unobstructed 180° hemispherical view of the sky.',
        'Internal spectral photodiode channels matched to the camera bands, equipped with cosine diffusers.',
        'Logs instantaneous solar irradiance for every captured image frame.',
        'Correction model: Reflectance = (Pixel Radiance / Downwelling Irradiance) · Calibration Scale.'
      ],
      practicalFieldNote: 'Propeller shadows passing over the DLS sensor create massive periodic irradiance noise spikes. Mount DLS on an elevated mast.',
      speakerNotes: 'Show the MicaSense DLS-2 sensor and discuss how its built-in magnetometer and orientation sensor correct for drone tilt.',
      references: ['MicaSense Inc. (2020). RedEdge-P and DLS-2 Integration and Calibration Guide.']
    },
    {
      id: 'm5_s9',
      slideNumber: 9,
      title: 'The Empirical Line Method (ELM) with Ground Calibration Tarps',
      category: 'QualityAssurance',
      keyTakeaway: 'ELM establishes a linear regression between in-flight digital numbers (or at-sensor radiance) and ground-measured surface reflectance.',
      bullets: [
        'Deploy at least two (optimally three or four) large Lambertian calibration tarps in the flight area.',
        'Tarps: Typically 3% (black), 24% (medium gray), 48% (light gray), and 84% (white) diffuse reflectance across 400–1000 nm.',
        'Tarps must be measured on the ground during flight with a calibrated point spectroradiometer (ASD or SVC).',
        'ELM regression: ρ(λ) = Gain(λ) · DN(λ) + Offset(λ), directly accounting for atmospheric path radiance and sensor gain.'
      ],
      mathFormula: '\\rho_i(\\lambda) = m(\\lambda) \\cdot \\text{DN}_i(\\lambda) + b(\\lambda)',
      formulaExplanation: 'Empirical Line Method linear transfer equation.',
      practicalFieldNote: 'Tarp size must span at least 5 to 10 image pixels to avoid mixed-edge adjacency effects.',
      speakerNotes: 'Point out why ELM remains the gold standard for UAV optical calibration: it eliminates atmospheric model uncertainties.',
      references: ['Smith, G. M., & Milton, E. J. (1999). The use of the empirical line method to calibrate remotely sensed data to reflectance. IJRS.']
    },
    {
      id: 'm5_s10',
      slideNumber: 10,
      title: 'Rolling Shutter vs. Global Shutter Distortions',
      category: 'Instrumentation',
      keyTakeaway: 'Rolling shutters expose pixels line-by-line, causing severe "jello" geometric warping during UAV flight motion; global shutters are mandatory.',
      bullets: [
        'Rolling shutter: CMOS array reads out top-to-bottom sequentially over several milliseconds.',
        'High-frequency drone vibrations and forward velocity shear and warp objects within a single frame.',
        'Global shutter: All photodiode wells open and close simultaneously, freezing the entire spatial scene instantaneously.',
        'Never use consumer rolling-shutter cameras for precision quantitative radiometry.'
      ],
      speakerNotes: 'Show the classic rolling shutter photo of a bent airplane propeller to explain why it destroys photogrammetric geometry.',
      references: ['Vautherin, J. et al. (2016). Photogrammetric accuracy and modeling of rolling shutter cameras on UAVs. ISPRS Annals.']
    },
    {
      id: 'm5_s11',
      slideNumber: 11,
      title: 'Optical Vignetting and Lens Falloff Correction',
      category: 'Processing',
      keyTakeaway: 'Optical vignetting causes image brightness to decay radial-symmetrically from the optical center toward the frame corners.',
      bullets: [
        'Cosine-fourth law of illumination: Off-axis image brightness drops with cos⁴(θ_lens).',
        'Mechanical vignetting: Lens barrel or filter rims physically obstructing peripheral light rays.',
        'Calibration: Laboratory flat-field acquisition using an integrating sphere or uniform white light panel.',
        'Vignetting lookup table (LUT): Multiplies corner pixels by inverse radial falloff polynomial V(r) = 1 + k₁·r² + k₂·r⁴.'
      ],
      mathFormula: 'I_{\\text{corrected}}(x, y) = \\frac{I_{\\text{raw}}(x, y)}{V(r)}, \\quad r = \\sqrt{(x - x_0)^2 + (y - y_0)^2}',
      formulaExplanation: 'Radial flat-field vignetting normalization formula.',
      speakerNotes: 'Show an uncorrected multispectral mosaic with dark circular halos in every frame before vignetting correction.',
      references: ['Kelcey, J., & Lucieer, A. (2012). Sensor correction of a 6-band multispectral imaging sensor for UAV remote sensing. Remote Sensing.']
    },
    {
      id: 'm5_s12',
      slideNumber: 12,
      title: 'Gimbal Stabilization: 3-Axis Brushless Gimbals vs. Fixed Mounts',
      category: 'Instrumentation',
      keyTakeaway: 'Active 3-axis brushless gimbals decouple camera orientation from aircraft buffeting, maintaining true nadir pointing.',
      bullets: [
        'High-torque brushless motors and dedicated IMU controllers compensate for drone roll, pitch, and yaw in milliseconds.',
        'Fixed camera mounts inherit every tilt of the drone, causing footprint wander of ±15° during windy cross-tracks.',
        'In pushbroom imaging, gimbals maintain the scan line perpendicular to the flight path vector.'
      ],
      practicalFieldNote: 'Balance the gimbal mechanically with power OFF until the camera sits neutral in any orientation before powering motors.',
      speakerNotes: 'Show how an unbalanced gimbal overheats its motor drivers and induces high-frequency micro-jitter.',
      references: ['Aasen, H. et al. (2018). Remote Sensing.']
    },
    {
      id: 'm5_s13',
      slideNumber: 13,
      title: 'Ground Sampling Distance (GSD) & Flight Altitude Math',
      category: 'Mathematics',
      keyTakeaway: 'Ground Sampling Distance represents the physical ground dimension represented by a single detector pixel.',
      bullets: [
        'GSD is governed by flight altitude h above ground level (AGL), camera focal length f, and sensor pixel pitch p.',
        'Higher altitude expands field coverage but degrades spatial resolution.',
        'In undulating terrain, GSD varies across the flight line unless terrain-following flight planning is utilized.'
      ],
      mathFormula: '\\text{GSD} = \\frac{h \\cdot p}{f} \\iff h = \\frac{\\text{GSD} \\cdot f}{p}',
      formulaExplanation: 'Fundamental photogrammetric ground sampling distance equation.',
      speakerNotes: 'Calculate GSD for a 5.5 µm pixel pitch, 8 mm lens flown at 50 m AGL (GSD = 50 * 5.5e-6 / 8e-3 = 3.44 cm).',
      references: ['Wolf, P. R. et al. (2014). Elements of Photogrammetry with Applications in GIS (4th ed.). McGraw-Hill.']
    },
    {
      id: 'm5_s14',
      slideNumber: 14,
      title: 'Terrain Following Flight Planning with High-Resolution DEMs',
      category: 'Protocol',
      keyTakeaway: 'Flying at fixed barometric altitude over hilly terrain causes massive variations in GSD and overlap, ruining orthomosaics.',
      bullets: [
        'Barometric altimeters maintain fixed height relative to takeoff point, not local ground level.',
        'Flying over a 50m hill from a 80m takeoff drops true altitude to 30m, causing image overlap to plunge and risking terrain collision.',
        'Terrain following: Flight management software (e.g. UgCS, DJI Pilot) adjusts drone altitude dynamically using an onboard Digital Elevation Model (SRTM, LiDAR).'
      ],
      practicalFieldNote: 'Always verify terrain DEM accuracy; outdated SRTM data may miss new quarry pits or tree canopy heights.',
      speakerNotes: 'Show the flight profile cross-section of a terrain-following flight vs a flat barometric flight.',
      references: ['Nex, F., & Remondino, F. (2014). UAV for 3D mapping applications: a review. Applied Geomatics.']
    },
    {
      id: 'm5_s15',
      slideNumber: 15,
      title: 'Atmospheric Path Radiance and Adjacency Effects at UAV Altitudes',
      category: 'Physics',
      keyTakeaway: 'At 50–120 m flight altitudes, atmospheric attenuation is small (< 2–3%) but target adjacency and diffuse scattering still exist.',
      bullets: [
        'Unlike 700 km satellites, UAVs operate beneath 99% of the atmospheric column.',
        'Rayleigh scattering in the 50 m path is negligible (< 0.5% in blue).',
        'However, dense haze or dust plumes create significant path radiance.',
        'Adjacency effect: Photons reflected from bright concrete borders scatter into adjacent dark vegetation pixels.'
      ],
      speakerNotes: 'Explain why full atmospheric radiative transfer codes like 6S/MODTRAN are usually overkill for low-altitude UAVs, whereas ELM is ideal.',
      references: ['Bimonte, M. et al. (2021). Atmospheric correction of UAV hyperspectral data. Remote Sensing.']
    },
    {
      id: 'm5_s16',
      slideNumber: 16,
      title: 'Signal-to-Noise Ratio (SNR) in Airborne Imaging Systems',
      category: 'Physics',
      keyTakeaway: 'Airborne imaging spectrometers suffer lower SNR than ground point sensors due to millisecond integration times and tiny pixel areas.',
      bullets: [
        'Ground point spectrometer: Big entrance slit, large foreoptic, integration times 10–100 ms, SNR > 1000:1.',
        'UAV pushbroom pixel: Tiny entrance slit, fast flight speed requiring integration times 2–5 ms, SNR often 100:1 to 300:1.',
        'Binning (spatial and spectral): Summing adjacent pixels 2×2 or 4×4 boosts SNR at the expense of spatial or spectral resolution.'
      ],
      mathFormula: '\\text{SNR}_{\\text{binned}} = \\text{SNR}_0 \\cdot \\sqrt{N_{\\text{pixels}}}',
      formulaExplanation: 'SNR scaling through hardware pixel binning.',
      speakerNotes: 'Highlight this core trade-off: You cannot have 1 cm spatial resolution, 1 nm spectral resolution, and 1000:1 SNR simultaneously on a drone.',
      references: ['Schaepman, M. E. (2007). Spectroradiometry—A review. Remote Sensing of Environment.']
    },
    {
      id: 'm5_s17',
      slideNumber: 17,
      title: 'Solar Angle Restrictions & Glint in UAV Surveys',
      category: 'Protocol',
      keyTakeaway: 'UAV surveys over wet soils, rice paddies, or water bodies produce intense specular sun glint that saturates camera arrays.',
      bullets: [
        'Sun glint: Direct mirror reflection of the solar disk into the wide-angle camera lens.',
        'Occurs when surface normal bisects the sun and sensor vectors (Snell-Fresnel specular geometry).',
        'Polarized lens filters and off-nadir camera tilting (10°–15° away from solar azimuth) eliminate specular glint.',
        'Over land, solar zenith angle must remain between 30° and 50° to avoid both deep tree shadows and extreme hotspot surge.'
      ],
      speakerNotes: 'Show a multispectral orthomosaic over an orchard where half the leaves are washed out white from sun glint.',
      references: ['Suomalainen, J. et al. (2014). Direct reflectance measurements from drones. Remote Sensing.']
    },
    {
      id: 'm5_s18',
      slideNumber: 18,
      title: 'Calibration Panel Deployment & Ground Target Protocols',
      category: 'QualityAssurance',
      keyTakeaway: 'Calibration tarps must be maintained in pristine condition and pinned flat to prevent wind flutter and shadow folds.',
      bullets: [
        'Position tarps in an open, level area free from building or tree shadows throughout the flight.',
        'Anchor tarp corners with tent pegs to eliminate wind billowing.',
        'Measure the center of each tarp with a calibrated field spectroradiometer at the exact moment the UAV passes overhead.',
        'Never walk on or drag equipment across radiometric calibration tarps.'
      ],
      practicalFieldNote: 'Store calibration tarps rolled around PVC cores; folding tarps creates permanent creases that cause micro-shadows.',
      speakerNotes: 'Show photos of well-pinned tarps versus wrinkled, windblown tarps that ruined a drone survey.',
      references: ['Smith, G. M., & Milton, E. J. (1999). International Journal of Remote Sensing.']
    },
    {
      id: 'm5_s19',
      slideNumber: 19,
      title: 'UAV Flight Mission Design & Overlap Strategies',
      category: 'Protocol',
      keyTakeaway: 'Mission geometry must guarantee consistent ground overlap, cross-track coverage, and adequate battery reserves.',
      bullets: [
        'Flight lines: Parallel serpentine paths oriented perpendicular to prevailing wind to maintain steady ground speed.',
        'Forward overlap (along-track): 80% minimum for multispectral SfM matching in vegetated canopies.',
        'Side overlap (cross-track): 75% minimum to prevent longitudinal stitching seams and gaps.',
        'Battery reserve: Plan flight duration to land with at least 25% battery capacity remaining.'
      ],
      practicalFieldNote: 'Repetitive agricultural crops (wheat, maize) lack visual texture; insufficient overlap (< 75%) causes photogrammetry alignment failure.',
      speakerNotes: 'Demonstrate flight planning in software, showing overlap coverage heatmaps.',
      references: ['Aasen, H. et al. (2018). Remote Sensing.']
    },
    {
      id: 'm5_s20',
      slideNumber: 20,
      title: 'Radiometric Calibration Pipelines in Photogrammetry Suites',
      category: 'Processing',
      keyTakeaway: 'Modern photogrammetry suites (Agisoft Metashape, Pix4D) execute multi-stage radiometric calibration algorithms.',
      bullets: [
        'Stage 1: Read EXIF metadata (exposure time, ISO gain, sensor black level, calibration panel albedo).',
        'Stage 2: DLS solar irradiance normalization frame-by-frame.',
        'Stage 3: Lens vignetting and radial distortion removal.',
        'Stage 4: Calibration panel optimization (ELM calibration factor calculation).',
        'Output: 16-bit or 32-bit floating-point GeoTIFF reflectance orthomosaics scaled from 0.0 to 1.0.'
      ],
      speakerNotes: 'Walk students through the radiometric calibration settings panel in Pix4Dmapper and Agisoft Metashape.',
      references: ['Pix4D SA (2020). Radiometric Calibration of Multispectral Images Technical Guide.']
    },
    {
      id: 'm5_s21',
      slideNumber: 21,
      title: 'Multi-Sensor Payloads: Thermal IR and LiDAR Co-Registration',
      category: 'CaseStudy',
      keyTakeaway: 'Fusing hyperspectral imagery with concurrent UAV LiDAR and thermal infrared provides structural and physiological data.',
      bullets: [
        'UAV LiDAR: Delivers 3D structural canopy height models (CHM), vertical vegetation density profiles, and exact ground terrain.',
        'Thermal IR (e.g. FLIR Vue Pro R): Measures canopy surface kinetic temperature, revealing stomatal conductance and early water stress.',
        'Hyperspectral: Delivers biochemical pigment concentrations (chlorophyll, carotenoids, nitrogen).',
        'Spatial co-registration: Merging LiDAR point clouds with hyperspectral voxels creates true 3D hyper-spectral canopy models.'
      ],
      speakerNotes: 'Show a 3D LiDAR canopy point cloud color-coded by hyperspectral chlorophyll content.',
      references: ['Zarco-Tejada, P. J. et al. (2013). Assessing vineyard water status with UAV thermal and hyperspectral imagery. Remote Sensing of Environment.']
    },
    {
      id: 'm5_s22',
      slideNumber: 22,
      title: 'UAV Regulatory Frameworks & Airspace Safety Protocols',
      category: 'QualityAssurance',
      keyTakeaway: 'Scientific UAV operations require strict adherence to national civil aviation authorities (FAA Part 107, EASA Open/Specific Category).',
      bullets: [
        'Pilot-in-Command (PIC) certification: Mandatory commercial remote pilot licensing.',
        'Visual Line-of-Sight (VLOS): Drone must remain visible to the remote pilot without visual aids at all times.',
        'Maximum altitude ceiling: Typically 120 m (400 ft) AGL to avoid manned general aviation airspace.',
        'Pre-flight risk assessment: Failsafe return-to-home (RTH) programming, lost-link procedures, and emergency landing zones.'
      ],
      practicalFieldNote: 'Always conduct a physical crew safety briefing and test RTH altitude settings before taking off.',
      speakerNotes: 'Review the legal liabilities of conducting university UAV research flights.',
      references: ['FAA (2021). 14 CFR Part 107 — Small Unmanned Aircraft Systems. Federal Aviation Administration.']
    },
    {
      id: 'm5_s23',
      slideNumber: 23,
      title: 'Data Volumes, Storage Architecture & Field Compute',
      category: 'QualityAssurance',
      keyTakeaway: 'UAV hyperspectral surveys generate massive data volumes (50–200 GB per flight) requiring high-throughput field storage.',
      bullets: [
        'A 20-minute pushbroom flight collecting 100 frames/sec at 1024 spatial pixels × 270 bands generates ~35 GB of raw uncompressed data.',
        'Field requirements: Fast NVMe solid-state drives (read/write > 1500 MB/s) to offload flight cards quickly.',
        'Field triage workstation: High-core laptop with GPU acceleration to inspect pushbroom track completeness before leaving the field.'
      ],
      practicalFieldNote: 'Never fly subsequent missions using the same SD card without verifying full hash-verified checksum backup.',
      speakerNotes: 'Calculate daily storage requirements for a 4-flight research campaign.',
      references: ['Aasen, H. et al. (2018). Remote Sensing.']
    },
    {
      id: 'm5_s24',
      slideNumber: 24,
      title: 'Quality Assessment of UAV Orthomosaics',
      category: 'QualityAssurance',
      keyTakeaway: 'Systematic QA checks must verify radiometric uniformity, spatial resolution, and geometric positional accuracy.',
      bullets: [
        'Ground Control Points (GCPs): Independent check points surveyed with RTK-GNSS must yield RMSE_xy < 1–2 GSD.',
        'Radiometric uniformity: Verify that no striping or brightness seams exist along flight line boundaries.',
        'Ghosting and blur: Inspect moving vegetation in the mosaic for double edges or motion-blur artifacts caused by wind.'
      ],
      speakerNotes: 'Show examples of poor orthomosaic stitching where tree crowns are smeared into blurred artifacts.',
      references: ['Turner, D. et al. (2012). An automated technique for generating georeferenced orthorectified mosaics from ultra-high resolution UAV imagery. IEEE TGRS.']
    },
    {
      id: 'm5_s25',
      slideNumber: 25,
      title: 'Case Study: Precision Viticulture Water Stress Mapping',
      category: 'CaseStudy',
      keyTakeaway: 'Airborne multispectral imagery at 5 cm GSD isolates pure grapevine sunlit leaves from shaded soil and grass cover.',
      bullets: [
        'Vineyard challenge: Conventional 10m satellite pixels mix vine rows (30%), bare soil (50%), and inter-row weed grass (20%).',
        'UAV solution: 5 cm multispectral orthomosaic allows automated mask segmentation isolating 100% pure vine canopies.',
        'Photochemical Reflectance Index (PRI) and CWSI (Crop Water Stress Index) retrieved from pure vine pixels correlate with leaf water potential (R² = 0.84).'
      ],
      speakerNotes: 'Display the high-resolution vine segmentation mask and the resulting water stress prescription map.',
      references: ['Zarco-Tejada, P. J. et al. (2013). Remote Sensing of Environment.']
    },
    {
      id: 'm5_s26',
      slideNumber: 26,
      title: 'Case Study: Forest Canopy Biodiversity and Tree Species Classification',
      category: 'CaseStudy',
      keyTakeaway: 'UAV hyperspectral imaging identifies tropical and temperate tree species by resolving subtle biochemical absorption signatures.',
      bullets: [
        'Individual Tree Crown (ITC) delineation using high-resolution canopy height models.',
        'Extraction of 150-band continuous spectral signatures per individual tree crown.',
        'Machine learning classification (Support Vector Machines, Random Forest) achieves > 92% tree species identification accuracy.',
        'Distinguishes ash, oak, beech, and birch based on red edge slopes and water overtone band depths.'
      ],
      speakerNotes: 'Show the classified forest map with individual delineated crowns color-coded by species.',
      references: ['Féret, J. B., & Asner, G. P. (2013). Tree species discrimination in tropical forests using airborne imaging spectroscopy. IEEE TGRS.']
    },
    {
      id: 'm5_s27',
      slideNumber: 27,
      title: 'Case Study: Acid Mine Drainage & Heavy Metal Soil Contamination',
      category: 'CaseStudy',
      keyTakeaway: 'UAV pushbroom spectroscopy maps iron oxide mineralogy (hematite, goethite, jarosite) across mine tailings at sub-meter scale.',
      bullets: [
        'Acid mine drainage generates distinctive secondary iron sulfate and oxide precipitates.',
        'Jarosite (diagnostic absorption at 430 nm and 2260 nm) indicates highly acidic conditions (pH < 3).',
        'Goethite (absorption at 480 nm and 900 nm) indicates neutralizing pH conditions.',
        'UAV mapping pinpoints active acid generation zones without hazardous foot sampling in toxic tailings ponds.'
      ],
      speakerNotes: 'Present the geological false-color composite and mineral abundance maps from an abandoned copper mine.',
      references: ['Swayze, G. A. et al. (2000). Using imaging spectroscopy to map acidic mine waste. Environmental Science & Technology.']
    },
    {
      id: 'm5_s28',
      slideNumber: 28,
      title: 'Cross-Scale Validation: Ground Point to Drone to Satellite',
      category: 'CaseStudy',
      keyTakeaway: 'UAV imaging spectroscopy serves as the critical intermediate upscaling bridge validating spaceborne missions (PRISMA, EnMAP, EMIT).',
      bullets: [
        'Tier 1 (Ground): ASD point spectrometer characterizes leaf optics and calibration tarps with SI traceability.',
        'Tier 2 (Airborne): UAV hyperspectral camera maps 1 km² area at 5 cm GSD, capturing full spatial variability.',
        'Tier 3 (Spaceborne): Convolving UAV mosaic to 30m EnMAP/PRISMA pixels provides synthetic validation scenes with zero spatial error.'
      ],
      speakerNotes: 'Show the multi-tier scaling pyramid diagram from leaf clip to space station sensor.',
      references: ['Kokaly, R. F. et al. (2009). Spectroscopic remote sensing for material identification and mapping. Remote Sensing of Environment.']
    },
    {
      id: 'm5_s29',
      slideNumber: 29,
      title: 'Emerging Sensor Horizons: Lightweight SWIR and Hyperspectral LiDAR',
      category: 'Instrumentation',
      keyTakeaway: 'Miniaturized SWIR pushbroom cameras (1000–2500 nm) and hyperspectral LiDAR are opening revolutionary new observational dimensions.',
      bullets: [
        'SWIR on drones: Historically prohibited by weight (> 10 kg); new compact InGaAs cameras weigh < 1.8 kg.',
        'Enables airborne mineral mapping, cellulose/lignin detection, and microplastic identification on drones.',
        'Hyperspectral LiDAR (Supercontinuum laser): Measures range and contiguous reflectance simultaneously, delivering illuminated spectra without solar shadows.'
      ],
      speakerNotes: 'Preview the cutting-edge prototypes currently in academic flight testing.',
      references: ['Hakala, T. et al. (2012). Full waveform hyperspectral LiDAR for remote sensing of vegetation. Optics Express.']
    },
    {
      id: 'm5_s30',
      slideNumber: 30,
      title: 'Module 5 Synthesis & Progression to Spectral Preprocessing',
      category: 'Instrumentation',
      keyTakeaway: 'UAV spectroscopy demands mastery of sensor physics, direct IMU georeferencing, ELM tarp calibration, and photogrammetry.',
      bullets: [
        'Module 5 established: Pushbroom vs snapshot sensors, IMU trajectory synchronization, GSD math, ELM tarp calibration, and flight planning.',
        'In Module 6, we analyze spectral curves mathematically: Savitzky-Golay smoothing, SNV, continuum removal, derivatives, and spectral indices.',
        'Preparation for Field Exercise 5: Conducting an airborne multispectral drone flight with ground calibration tarps and ASD validation.'
      ],
      speakerNotes: 'Wrap up UAV lecture, address flight planning questions, and preview Practical Lab 5.',
      references: ['Aasen, H. et al. (2018). Quantitative remote sensing with UAV spectroscopy. Remote Sensing.']
    }
  ];
}

export const MODULE_5: CourseModule = {
  id: 'module_5',
  moduleNumber: 5,
  title: 'UAV-Based Imaging Spectroscopy & Multispectral Payloads',
  shortTitle: 'UAV Imaging Spectroscopy',
  subtitle: 'Pushbroom line-scanners, snapshot frame sensors, direct GNSS/IMU georeferencing, Empirical Line Method (ELM), and orthorectification',
  durationHours: 4,
  ectsCredits: 1.5,
  abstract: 'Module 5 explores the operational and physical principles of airborne imaging spectroscopy deployed on Unmanned Aerial Vehicles (UAVs / drones). Students examine pushbroom (line-scan) spectrometers, 2D snapshot hyperspectral frame cameras, and multi-lens multispectral payloads (e.g. MicaSense RedEdge, DJI Mavic 3M, Headwall Nano-Hyperspec). The module covers direct georeferencing via tactical-grade GNSS/IMU integration, lever-arm and boresight calibration, rolling vs global shutter distortions, downwelling light sensors (DLS), lens vignetting correction, and the Empirical Line Method (ELM) using ground radiometric calibration tarps.',
  coreCompetencies: [
    'Differentiate between pushbroom line-scan, snapshot 2D hyperspectral, and multispectral camera architectures.',
    'Formulate ground sampling distance (GSD), frame rate, and aircraft forward velocity relationships.',
    'Implement the Empirical Line Method (ELM) using ground calibration tarps to convert airborne at-sensor radiance into surface reflectance.',
    'Analyze direct georeferencing equations involving IMU attitude angles (roll, pitch, yaw) and boresight matrices.',
    'Design compliant UAV flight missions ensuring required along-track and cross-track overlaps, SZA windows, and regulatory airspace safety.'
  ],
  slides: generateModule5Slides(),
  fieldExercise: {
    title: 'Field Exercise 5: Drone Flight Execution, Radiometric Calibration Tarp Deployment & Ground Truth Inter-Comparison',
    estimatedDuration: '4 hours',
    targetEnvironment: 'Agricultural research station or natural ecosystem testbed (1 to 2 hectares)',
    recommendedInstruments: ['Multispectral UAV (e.g. DJI Mavic 3M or MicaSense RedEdge on quadcopter)', 'Set of 4 Certified Radiometric Calibration Tarps (3%, 24%, 48%, 84% reflectance)', 'ASD FieldSpec Spectroradiometer with 8° lens', 'RTK-GNSS rover for ground control point (GCP) surveying', 'Continuous downwelling solar pyranometer logger'],
    safetyAndPreTripChecklist: [
      'Check local airspace classification and obtain flight authorization/NOTAM if required.',
      'Inspect drone propellers, airframe, and sensor gimbal mounts.',
      'Pin calibration tarps flat to ground using tent pegs in an open, unshaded area.',
      'Establish visual line of sight (VLOS) and verify return-to-home (RTH) altitude (50 m AGL).'
    ],
    fieldProtocolSteps: [
      {
        stepNumber: 1,
        action: 'Survey 6 ground control points (GCPs) and the 4 calibration tarp corners with RTK-GNSS (sub-2 cm precision).',
        scientificRationale: 'Guarantees sub-pixel geometric accuracy in photogrammetric bundle adjustment.',
        commonErrorToAvoid: 'Placing GCPs in shadowed areas or too close to tree canopies where satellite multipath occurs.'
      },
      {
        stepNumber: 2,
        action: 'Execute automated UAV survey at 50 m AGL with 80% front overlap and 75% side overlap, maintaining speed at 4.0 m/s.',
        scientificRationale: 'Provides high feature matching redundancy for SfM bundle adjustment and ensures constant ground sampling distance (~3.5 cm).',
        commonErrorToAvoid: 'Flying too fast, causing motion blur on lower-end exposure settings.'
      },
      {
        stepNumber: 3,
        action: 'Simultaneously, use the ASD FieldSpec to measure the exact spectral reflectance of each calibration tarp and 5 distinct ground targets as the drone passes overhead.',
        scientificRationale: 'Provides absolute ground truth spectra to calibrate and validate the UAV orthomosaic via Empirical Line Method.',
        commonErrorToAvoid: 'Allowing the ground spectroradiometer operator to enter the camera field of view during flight lines.'
      },
      {
        stepNumber: 4,
        action: 'Capture post-flight reference calibration panel photos with the UAV camera held 1 meter away at nadir.',
        scientificRationale: 'Provides panel DN values required by photogrammetry software for factory radiometric calibration equations.',
        commonErrorToAvoid: 'Casting the operator body shadow across the calibration panel during photo capture.'
      }
    ],
    dataRecordingSheetFields: [
      'Flight Mission ID',
      'Flight Altitude AGL (m)',
      'GSD Calculated (cm)',
      'Solar Zenith Angle θ_s at Takeoff & Landing',
      'Mean Wind Speed (m/s)',
      'Mean Global Irradiance (W/m²)',
      'GCP RTK Coordinates (E, N, H)',
      'ASD Ground Tarp Reflectance Values (450, 560, 650, 705, 840 nm)',
      'UAV Raw DN of Tarps'
    ],
    fieldDeliverable: 'Submit raw UAV image dataset, RTK GCP coordinates, ground ASD spectral verification files, and an SfM photogrammetric processing report documenting orthomosaic radiometric accuracy.'
  },
  practicalLab: {
    title: 'Practical Lab 5: UAV Radiometric Calibration via Empirical Line Method & Spatial Resampling in Python and R',
    softwareEnvironment: 'Hybrid (Python & R)',
    primaryPackages: ['rasterio', 'geopandas', 'numpy', 'scipy', 'matplotlib', 'raster (R)', 'sf (R)'],
    learningObjectives: [
      'Extract raw digital numbers (DN) from calibration tarps in multi-band drone imagery.',
      'Fit empirical linear regression models (Gain and Offset) per spectral band.',
      'Apply the Empirical Line Method (ELM) transformation to generate calibrated surface reflectance rasters.',
      'Perform spatial aggregation and validation against co-located ground spectroradiometer point measurements.'
    ],
    sampleDataset: {
      name: 'UAV_Multispectral_Tarps_Raw_TIF.tif',
      description: '5-band multispectral orthomosaic (Blue 475nm, Green 560nm, Red 668nm, RedEdge 717nm, NIR 840nm) in 16-bit raw digital numbers, accompanied by ground ASD tarp reflectance measurements.',
      spectralRange: '450 - 860 nm',
      sensor: 'MicaSense RedEdge-P / DJI Mavic 3M',
      bandsCount: 5
    },
    codeSnippets: [
      {
        language: 'python',
        title: 'Python: Empirical Line Method (ELM) Multi-Band Calibration Engine',
        description: 'Performs linear regression between raw drone image tarp DN values and ground-measured reflectance, applying gain and offset to calibrate the full raster.',
        code: `import numpy as np
import matplotlib.pyplot as plt

def fit_empirical_line_method(tarp_dns, tarp_ground_reflectances):
    """
    Fits linear regression: Reflectance = Gain * DN + Offset per spectral band.
    tarp_dns: (N_tarps, N_bands) array of extracted mean DNs
    tarp_ground_reflectances: (N_tarps, N_bands) array of ground ASD measured reflectances (0 to 1.0)
    """
    n_bands = tarp_dns.shape[1]
    gains = []
    offsets = []
    r_squared = []
    
    for b in range(n_bands):
        x = tarp_dns[:, b]
        y = tarp_ground_reflectances[:, b]
        # Linear polynomial fit (degree 1)
        slope, intercept = np.polyfit(x, y, 1)
        
        # Calculate R^2
        y_pred = slope * x + intercept
        r2 = 1.0 - np.sum((y - y_pred)**2) / np.sum((y - np.mean(y))**2)
        
        gains.append(slope)
        offsets.append(intercept)
        r_squared.append(r2)
        
    return np.array(gains), np.array(offsets), np.array(r_squared)

# Demonstration with 4 calibration tarps (3%, 24%, 48%, 84%) across 5 multispectral bands
band_names = ['Blue (475)', 'Green (560)', 'Red (668)', 'RedEdge (717)', 'NIR (840)']

# Simulated raw 16-bit DN values extracted from tarp ROIs
tarp_dns = np.array([
    [ 2100,  2300,  2450,  2600,  2800],  # 3% Black Tarp
    [15400, 16200, 16800, 17100, 17500],  # 24% Gray Tarp
    [29800, 31200, 32100, 32800, 33400],  # 48% Light Gray Tarp
    [52100, 54500, 55800, 56700, 57900]   # 84% White Tarp
])

# Ground truth spectral reflectance measured with ASD FieldSpec
tarp_refl = np.array([
    [0.031, 0.032, 0.033, 0.034, 0.035],
    [0.238, 0.241, 0.243, 0.245, 0.248],
    [0.479, 0.482, 0.485, 0.487, 0.490],
    [0.838, 0.841, 0.844, 0.846, 0.850]
])

gains, offsets, r2 = fit_empirical_line_method(tarp_dns, tarp_refl)

for i, name in enumerate(band_names):
    print(f"Band {name}: Gain = {gains[i]:.4e}, Offset = {offsets[i]:.4f}, R² = {r2[i]:.4f}")

# Example: Calibrating a crop canopy pixel with raw DN = 24000 in Red, 48000 in NIR
crop_red_refl = gains[2] * 24000 + offsets[2]
crop_nir_refl = gains[4] * 48000 + offsets[4]
ndvi = (crop_nir_refl - crop_red_refl) / (crop_nir_refl + crop_red_refl)

print(f"\\nCalibrated Crop Red Reflectance: {crop_red_refl:.4f}")
print(f"Calibrated Crop NIR Reflectance: {crop_nir_refl:.4f}")
print(f"Calculated Surface NDVI: {ndvi:.4f}")
`
      },
      {
        language: 'r',
        title: 'R Script: Batch Radiometric Calibration and Orthomosaic Processing in R',
        description: 'Imports raw multispectral GeoTIFF bands, applies band-specific ELM coefficients, and exports a calibrated 32-bit floating-point reflectance raster stack.',
        code: `# Principles of Field Spectroscopy: MSc Lab 5
# Raster Radiometric Calibration in R

calibrate_uav_raster <- function(input_raster_path, gains, offsets, output_raster_path) {
  library(raster)
  
  raw_stack <- stack(input_raster_path)
  n_bands <- nlayers(raw_stack)
  
  cal_layers <- list()
  for (i in 1:n_bands) {
    # Apply linear formula: Refl = Gain * DN + Offset
    cal_band <- raw_stack[[i]] * gains[i] + offsets[i]
    # Clamp physically impossible reflectance values outside [0, 1]
    cal_band <- clamp(cal_band, lower=0.0, upper=1.0)
    cal_layers[[i]] <- cal_band
  }
  
  calibrated_stack <- stack(cal_layers)
  names(calibrated_stack) <- c("Blue_Refl", "Green_Refl", "Red_Refl", "RedEdge_Refl", "NIR_Refl")
  
  cat("Successfully calibrated", n_bands, "multispectral bands.\\n")
  return(calibrated_stack)
}
`
      }
    ],
    studentTasks: [
      'Write a Python function to automatically extract region-of-interest (ROI) mean and standard deviation DNs from calibration tarp polygons.',
      'Fit the ELM regression across all bands and evaluate the residual errors on independent validation targets.',
      'Calculate Normalized Difference Vegetation Index (NDVI) and Chlorophyll Red Edge Index (CI_RE) from the calibrated raster and evaluate the histogram distribution.'
    ],
    expectedOutputSummary: 'Students produce Python and R scripts demonstrating ELM regression fitting, raw image conversion to calibrated surface reflectance rasters, and quantitative validation against ground spectroradiometer truth.'
  },
  quiz: {
    moduleNumber: 5,
    title: 'Module 5 Automated Assessment: UAV Imaging Spectroscopy',
    passingScorePercent: 80,
    questions: [
      {
        id: 'm5_q1',
        question: 'Why do pushbroom (line-scan) hyperspectral cameras mounted on drones require a tactical-grade GNSS/IMU system, whereas 2D multispectral frame cameras can be processed with standard Structure-from-Motion (SfM)?',
        options: [
          'Because pushbroom cameras cannot see visible light.',
          'Because each individual line in a pushbroom scan is acquired at a distinct microsecond in time with unique aircraft attitude (roll, pitch, yaw) and position, lacking 2D spatial tie points for bundle adjustment.',
          'Because drones fly faster than the speed of sound when carrying pushbroom sensors.',
          'Because pushbroom sensors are prohibited from using GPS satellites.'
        ],
        correctOptionIndex: 1,
        explanation: 'Pushbroom sensors collect only a single 1D line at any instant. There are no 2D overlapping image features to perform SIFT feature matching; direct georeferencing using a high-frequency IMU and RTK GNSS is strictly mandatory to place each scan line in 3D space.',
        academicCitation: 'Mostafa, M. M. R., & Schwarz, K. P. (2000). PE&RS, 66(10), 1187-1195.'
      },
      {
        id: 'm5_q2',
        question: 'What is the core operational principle of the Empirical Line Method (ELM) used in drone remote sensing?',
        options: [
          'Running a deep convolutional neural network to invent missing color pixels.',
          'Establishing a direct empirical linear regression between raw camera digital numbers (DN) and ground-measured surface reflectance using certified calibration tarps.',
          'Assuming that all crop leaves reflect exactly 50% in the near-infrared.',
          'Measuring the speed of drone motors to infer atmospheric humidity.'
        ],
        correctOptionIndex: 1,
        explanation: 'ELM uses deployed ground calibration tarps of known reflectance to fit a linear equation: Reflectance = Gain · DN + Offset, simultaneously correcting for solar irradiance, atmospheric path effects, and sensor radiometric gains.',
        academicCitation: 'Smith, G. M., & Milton, E. J. (1999). IJRS, 20(13), 2653-2662.'
      },
      {
        id: 'm5_q3',
        question: 'A drone carrying a multispectral camera with a focal length f = 8 mm and pixel pitch p = 4.0 µm flies at an altitude of 60 meters above ground level. What is the Ground Sampling Distance (GSD)?',
        options: [
          '1.5 cm',
          '3.0 cm',
          '6.0 cm',
          '12.0 cm'
        ],
        correctOptionIndex: 1,
        explanation: 'GSD = (h · p) / f = (60 m · 4.0 × 10⁻⁶ m) / (8.0 × 10⁻³ m) = (0.00024) / (0.008) = 0.03 m = 3.0 cm.',
        academicCitation: 'Wolf, P. R. et al. (2014). Elements of Photogrammetry.'
      },
      {
        id: 'm5_q4',
        question: 'What optical distortion does a radial flat-field vignetting correction remove from wide-angle UAV camera frames?',
        options: [
          'Atmospheric Rayleigh scattering in the blue spectrum.',
          'Radial brightness decay where corners appear darker than the optical center due to the cosine-fourth law and lens barrel obstruction.',
          'Electronic noise spikes caused by low battery voltage.',
          'Geometric elevation distortion caused by mountain slopes.'
        ],
        correctOptionIndex: 1,
        explanation: 'Optical vignetting describes the natural radial drop in brightness from center to edge dictated by cos⁴(θ) optics and mechanical lens obstruction; flat-field correction normalizes brightness across the frame.',
        academicCitation: 'Kelcey, J., & Lucieer, A. (2012). Remote Sensing, 4(5), 1462-1493.'
      },
      {
        id: 'm5_q5',
        question: 'Why are global shutter sensors strongly preferred over rolling shutter sensors for drone imaging spectroscopy?',
        options: [
          'Because global shutters are 100 times cheaper than rolling shutters.',
          'Because global shutters expose all pixels simultaneously, eliminating the "jello" geometric distortion caused by aircraft flight speed and high-frequency airframe vibration during row-by-row readout.',
          'Because rolling shutters cannot capture near-infrared photons.',
          'Because global shutters eliminate the need for drone batteries.'
        ],
        correctOptionIndex: 1,
        explanation: 'Rolling shutters expose the detector row-by-row over several milliseconds; high-frequency aircraft vibrations and forward motion warp objects within the frame, destroying photogrammetric geometric accuracy.',
        academicCitation: 'Vautherin, J. et al. (2016). ISPRS Annals.'
      }
    ]
  },
  keyReferences: [
    {
      authors: 'Aasen, H. et al.',
      year: 2018,
      title: 'Quantitative remote sensing at ultra-high resolution with UAV photogrammetry and spectroscopy: A review',
      journalOrPublisher: 'Remote Sensing, 10(7), 1060',
      doiOrUrl: '10.3390/rs10071060'
    },
    {
      authors: 'Zarco-Tejada, P. J., González-Dugo, V., & Berni, J. A.',
      year: 2012,
      title: 'Fluorescence, temperature and narrow-band indices acquired from a UAV platform for water stress detection using high-resolution hyperspectral and thermal imagery',
      journalOrPublisher: 'Remote Sensing of Environment, 117, 322-337',
      doiOrUrl: '10.1016/j.rse.2011.10.007'
    },
    {
      authors: 'Smith, G. M., & Milton, E. J.',
      year: 1999,
      title: 'The use of the empirical line method to calibrate remotely sensed data to reflectance',
      journalOrPublisher: 'International Journal of Remote Sensing, 20(13), 2653-2662'
    }
  ]
};
