import { CourseModule, AcademicReference } from '../types';

export interface CitationItem {
  id: string;
  type: 'spectral_library' | 'field_protocol' | 'journal_article' | 'handbook_standard';
  title: string;
  authors: string;
  year: number;
  source: string; // Journal, Agency Report, Publisher, or Technical Monograph
  volumeIssuePages?: string;
  doiOrUrl?: string;
  authorityOrCurator: string; // e.g. "USGS", "NASA JPL / Caltech", "CEOS WGCV", "ISO", "NERC FSF"
  spectralCoverageOrScope?: string; // e.g. "350–2500 nm (0.2–2.5 μm)", "400–14000 nm"
  applicationNote: string; // How this spectral library or protocol is used in the module
  bibtexKey: string;
}

export interface ModuleCitationGroup {
  moduleNumber: number;
  moduleTitle: string;
  spectralLibraries: CitationItem[];
  fieldProtocols: CitationItem[];
  academicLiterature: CitationItem[];
}

/**
 * Standard APA 7th Edition Formatter
 */
export function formatAPA(item: CitationItem): string {
  let apa = `${item.authors} (${item.year}). ${item.title}. `;
  apa += `*${item.source}*`;
  if (item.volumeIssuePages) {
    apa += `, ${item.volumeIssuePages}.`;
  } else {
    apa += '.';
  }
  if (item.doiOrUrl) {
    const url = item.doiOrUrl.startsWith('http')
      ? item.doiOrUrl
      : `https://doi.org/${item.doiOrUrl}`;
    apa += ` ${url}`;
  }
  return apa;
}

/**
 * BibTeX Formatter for Reference Managers (Overleaf, Zotero, Mendeley)
 */
export function formatBibTeX(item: CitationItem): string {
  const entryType =
    item.type === 'journal_article'
      ? 'article'
      : item.type === 'spectral_library'
      ? 'misc'
      : item.type === 'field_protocol'
      ? 'techreport'
      : 'book';

  let bib = `@${entryType}{${item.bibtexKey},\n`;
  bib += `  author = {${item.authors.replace(/&/g, 'and')}},\n`;
  bib += `  title = {${item.title}},\n`;
  if (entryType === 'article') {
    bib += `  journal = {${item.source}},\n`;
  } else if (entryType === 'techreport') {
    bib += `  institution = {${item.source}},\n`;
  } else {
    bib += `  howpublished = {${item.source}},\n`;
  }
  bib += `  year = {${item.year}},\n`;
  if (item.volumeIssuePages) {
    bib += `  pages = {${item.volumeIssuePages}},\n`;
  }
  if (item.doiOrUrl) {
    bib += `  doi = {${item.doiOrUrl.replace('https://doi.org/', '')}},\n`;
  }
  bib += `  note = {Curated by ${item.authorityOrCurator}}\n`;
  bib += `}`;
  return bib;
}

/**
 * Authoritative spectral libraries and field protocol registry per module
 */
export const MODULE_CITATIONS_DATABASE: Record<number, ModuleCitationGroup> = {
  1: {
    moduleNumber: 1,
    moduleTitle: 'Foundations of Optical Radiometry & Spectroradiometry',
    spectralLibraries: [
      {
        id: 'usgs_splib07_m1',
        type: 'spectral_library',
        title: 'USGS Spectral Library Version 7',
        authors: 'Kokaly, R. F., Clark, R. N., Swayze, G. A., Livo, K. E., Hoefen, T. M., Pearson, N. C., Wise, R. A., Benzel, W. M., Lowers, H. A., Driscoll, R. L., & Klein, A. J.',
        year: 2017,
        source: 'U.S. Geological Survey Data Series 1035',
        volumeIssuePages: '61 p.',
        doiOrUrl: 'https://doi.org/10.3133/ds1035',
        authorityOrCurator: 'USGS Spectroscopy Laboratory',
        spectralCoverageOrScope: '350–2500 nm (0.2–200 μm in full collection, 4,845 spectra)',
        applicationNote: 'Used as the baseline reference library for standard laboratory-quality directional-hemispherical reflectance factors (DHRF) across minerals, vegetation, soils, and artificial calibration materials.',
        bibtexKey: 'kokaly2017usgs'
      },
      {
        id: 'ecostress_v1_m1',
        type: 'spectral_library',
        title: 'The ECOSTRESS Spectral Library Version 1.0',
        authors: 'Meerdink, S. K., Hook, S. J., Roberts, D. A., & Abbott, E. A.',
        year: 2019,
        source: 'Remote Sensing of Environment',
        volumeIssuePages: '230, 111196',
        doiOrUrl: 'https://doi.org/10.1016/j.rse.2019.05.015',
        authorityOrCurator: 'NASA Jet Propulsion Laboratory (JPL) / Caltech',
        spectralCoverageOrScope: '350–15400 nm (VNIR, SWIR, TIR)',
        applicationNote: 'Provides continuous benchmark reflectance and emissivity spectra across the VNIR through thermal infrared used to verify Planck radiation curves and Kirchhoff radiation balance.',
        bibtexKey: 'meerdink2019ecostress'
      }
    ],
    fieldProtocols: [
      {
        id: 'nicodemus_brdf_m1',
        type: 'field_protocol',
        title: 'Geometrical Considerations and Nomenclature for Reflectance',
        authors: 'Nicodemus, F. E., Richmond, J. C., Hsia, J. J., Ginsberg, I. W., & Limperis, T.',
        year: 1977,
        source: 'National Bureau of Standards (NBS) Monograph 160',
        volumeIssuePages: 'U.S. Department of Commerce, 52 p.',
        doiOrUrl: 'https://physics.nist.gov/Pubs/SP250/nicodemus.pdf',
        authorityOrCurator: 'NIST / NBS',
        spectralCoverageOrScope: 'Fundamental optical radiometry & geometrical definitions',
        applicationNote: 'The foundational standard defining radiance, irradiance, radiant exitance, and the 9 formal reflectance quantities (including BRDF, BHRF, and HDRF).',
        bibtexKey: 'nicodemus1977geometrical'
      },
      {
        id: 'schaepman_quantities_m1',
        type: 'field_protocol',
        title: 'Reflectance quantities in optical remote sensing—definitions and case studies',
        authors: 'Schaepman-Strub, G., Schaepman, M. E., Painter, T. H., Dangel, S., & Martonchik, J. V.',
        year: 2006,
        source: 'Remote Sensing of Environment',
        volumeIssuePages: '103(1), 27–42',
        doiOrUrl: 'https://doi.org/10.1016/j.rse.2006.03.002',
        authorityOrCurator: 'CEOS WGCV / University of Zurich',
        spectralCoverageOrScope: 'In-situ reflectance measurement geometry',
        applicationNote: 'Defines the rigorous boundary conditions for field spectroscopy, proving why portable spectroradiometers measure biconical reflectance factors (BCRF) or hemispherical-directional reflectance factors (HDRF) rather than pure BRDF.',
        bibtexKey: 'schaepman2006reflectance'
      }
    ],
    academicLiterature: [
      {
        id: 'milton_field_spec_m1',
        type: 'journal_article',
        title: 'Field spectroscopy: Principles and practice',
        authors: 'Milton, E. J., Schaepman, M. E., Anderson, K., Kneubühler, M., & Fox, N.',
        year: 2009,
        source: 'International Journal of Remote Sensing',
        volumeIssuePages: '30(11), 2715–2740',
        doiOrUrl: 'https://doi.org/10.1080/01431160802558778',
        authorityOrCurator: 'NERC Field Spectroscopy Facility',
        applicationNote: 'Review article describing the physical sources of error in field spectroscopy and rigorous standard procedures for dark current, white panel optimization, and geometric alignment.',
        bibtexKey: 'milton2009field'
      }
    ]
  },
  2: {
    moduleNumber: 2,
    moduleTitle: 'Atmospheric Radiative Transfer & In-Situ Illumination',
    spectralLibraries: [
      {
        id: 'radcalnet_database_m2',
        type: 'spectral_library',
        title: 'RadCalNet: A Radiometric Calibration Network for Earth Observing Optical Sensors',
        authors: 'Bouvet, M., Thome, K., Berthelot, B., Bialek, A., Czapla-Myers, J., Fox, N. P., Goryl, P., Henry, P., Ma, L., Marcq, S., & Santer, R.',
        year: 2019,
        source: 'Remote Sensing',
        volumeIssuePages: '11(20), 2401',
        doiOrUrl: 'https://doi.org/10.3390/rs11202401',
        authorityOrCurator: 'CEOS Working Group on Calibration and Validation (WGCV)',
        spectralCoverageOrScope: '400–2500 nm at 10 nm step (automated 30-min TOA / BOA irradiance)',
        applicationNote: 'Used to provide benchmark top-of-atmosphere and bottom-of-atmosphere continuous solar irradiance curves under calibrated atmospheric transmittance.',
        bibtexKey: 'bouvet2019radcalnet'
      }
    ],
    fieldProtocols: [
      {
        id: 'aeronet_field_protocol_m2',
        type: 'field_protocol',
        title: 'AERONET Version 3 Aerosol Retrieval Algorithm, Properties and In-Situ Measurement Protocols',
        authors: 'Giles, D. M., Sinyuk, A., Sorokin, M. G., Schafer, J. S., Smirnov, A., Slutsker, I., Eck, T. F., Holben, B. N., et al.',
        year: 2019,
        source: 'Atmospheric Measurement Techniques',
        volumeIssuePages: '12(1), 169–209',
        doiOrUrl: 'https://doi.org/10.5194/amt-12-169-2019',
        authorityOrCurator: 'NASA Goddard Space Flight Center AERONET Program',
        spectralCoverageOrScope: 'Direct sun & diffuse sky photometer cal/val (340–1640 nm)',
        applicationNote: 'Defines the operational field protocol for measuring aerosol optical depth (AOD at 550 nm) and precipitable water vapor (PWV in cm) concurrently with field spectroscopy scans.',
        bibtexKey: 'giles2019aeronet'
      },
      {
        id: 'ceos_atmospheric_protocol_m2',
        type: 'field_protocol',
        title: 'CEOS WGCV Best Practice for In-Situ Atmospheric Characterization During Surface Reflectance Validation',
        authors: 'Pacheco, A., Barsi, J., Czapla-Myers, J., & Fox, N.',
        year: 2021,
        source: 'Committee on Earth Observation Satellites (CEOS) Publication',
        volumeIssuePages: 'WGCV-LPV-ATMO-v2.1, 48 p.',
        doiOrUrl: 'https://ceos.org/ourwork/workinggroups/wgcv/',
        authorityOrCurator: 'CEOS WGCV Land Product Validation',
        spectralCoverageOrScope: 'Direct beam vs diffuse ratio protocol',
        applicationNote: 'Mandates time limits (<10 min) between white reference acquisitions under varying diffuse skylight ratios and requires documentation of cloud proximity within 30° of zenith.',
        bibtexKey: 'ceos2021atmospheric'
      }
    ],
    academicLiterature: [
      {
        id: 'berk_modtran6_m2',
        type: 'journal_article',
        title: 'MODTRAN6: A tool for radiative transfer modeling with high spectral resolution and user-friendly GUI',
        authors: 'Berk, A., Conforti, P., Kennett, R., Perkins, T., Hawes, F., & van den Bosch, J.',
        year: 2014,
        source: 'SPIE Defense + Security',
        volumeIssuePages: '9088, 90880H',
        doiOrUrl: 'https://doi.org/10.1117/12.2050433',
        authorityOrCurator: 'Spectral Sciences Inc. / Air Force Research Laboratory',
        applicationNote: 'Describes the line-by-line and band model calculations used to model atmospheric gas absorption (H2O, CO2, O2, O3, CH4) that obstruct field measurements at 1400 nm and 1900 nm.',
        bibtexKey: 'berk2014modtran6'
      }
    ]
  },
  3: {
    moduleNumber: 3,
    moduleTitle: 'Spectroradiometer Architecture, Sensor Calibration & Characterization',
    spectralLibraries: [
      {
        id: 'nist_standards_m3',
        type: 'spectral_library',
        title: 'NIST Standard Reference Materials for Optical Reflectance and Wavelength Calibration (SRM 2065 & SRM 1920a)',
        authors: 'Yoon, H. W., Allen, D. W., & Saunders, R. D.',
        year: 2003,
        source: 'NIST Special Publication 250-48',
        volumeIssuePages: 'National Institute of Standards and Technology, Gaithersburg, MD',
        doiOrUrl: 'https://www.nist.gov/pml/sensor-science/optical-radiation',
        authorityOrCurator: 'National Institute of Standards and Technology (NIST)',
        spectralCoverageOrScope: 'Holmium oxide and Erbium oxide sharp spectral absorption standards (350–2500 nm)',
        applicationNote: 'Provides certified sub-nanometer absorption line wavelengths used to verify spectrometer grating dispersion and wavelength alignment.',
        bibtexKey: 'nist2003standards'
      }
    ],
    fieldProtocols: [
      {
        id: 'nerc_fsf_calibration_m3',
        type: 'field_protocol',
        title: 'Field Spectroscopy Facility User Guide & Instrument Calibration Protocols for ASD FieldSpec and SVC GER',
        authors: 'MacArthur, A., Robinson, I., & Malthus, T.',
        year: 2012,
        source: 'Natural Environment Research Council (NERC) FSF Calibration Manual',
        volumeIssuePages: 'NERC-FSF-PROT-v3, Edinburgh, UK, 72 p.',
        doiOrUrl: 'https://fsf.nerc.ac.uk/resources/guides/',
        authorityOrCurator: 'NERC Field Spectroscopy Facility',
        spectralCoverageOrScope: 'ASD FieldSpec 4 / SVC HR-1024i laboratory calibration protocol',
        applicationNote: 'Standard laboratory procedures for spectrometer dark current profiling, radiometric calibration against NIST-traceable tungsten FEL halogen lamps, and detector linearity verification.',
        bibtexKey: 'macarthur2012nerc'
      },
      {
        id: 'labsphere_spectralon_protocol_m3',
        type: 'field_protocol',
        title: 'Handling, Cleaning, and Calibration Recertification Protocol for Diffuse Reflectance Materials (Spectralon)',
        authors: 'Labsphere Optical Calibration Laboratory',
        year: 2020,
        source: 'Labsphere Technical Guide',
        volumeIssuePages: 'Reflectance Technology Monograph No. 8, North Sutton, NH, 24 p.',
        doiOrUrl: 'https://www.labsphere.com/support/technical-library/',
        authorityOrCurator: 'Labsphere Inc.',
        spectralCoverageOrScope: 'Sintered PTFE (Spectralon 99% & 50%) optical maintenance',
        applicationNote: 'Prescribes cleaning protocols with water-sandpaper milling, UV outgassing, and annual factory 8°/hemispherical recalibration to prevent hydrocarbon grease drift.',
        bibtexKey: 'labsphere2020spectralon'
      }
    ],
    academicLiterature: [
      {
        id: 'hueni_snr_m3',
        type: 'journal_article',
        title: 'Determination of the dynamic signal-to-noise ratio of field spectroradiometers',
        authors: 'Hueni, A., & Bialek, A.',
        year: 2017,
        source: 'Remote Sensing of Environment',
        volumeIssuePages: '197, 102–114',
        doiOrUrl: 'https://doi.org/10.1016/j.rse.2017.05.023',
        authorityOrCurator: 'University of Zurich / National Physical Laboratory (NPL)',
        applicationNote: 'Defines the mathematical model for detector noise (shot noise, dark current noise, readout electronic noise) and methods to calculate wavelength-dependent SNR in the field.',
        bibtexKey: 'hueni2017snr'
      }
    ]
  },
  4: {
    moduleNumber: 4,
    moduleTitle: 'In-Situ Field Measurement Protocols, Reference Standards & Error Budgets',
    spectralLibraries: [
      {
        id: 'speclib_calval_m4',
        type: 'spectral_library',
        title: 'SPECCHIO Spectral Information System: Storage and processing of in-situ field spectrometry data and metadata',
        authors: 'Hueni, A., Nieke, J., Schopfer, J., Kneubühler, M., & Itten, K. I.',
        year: 2009,
        source: 'Computers & Geosciences',
        volumeIssuePages: '35(4), 696–705',
        doiOrUrl: 'https://doi.org/10.1016/j.cageo.2008.03.010',
        authorityOrCurator: 'University of Zurich / European Space Agency',
        spectralCoverageOrScope: 'Field spectral metadata, environmental records, instrument serial tracking',
        applicationNote: 'Standardized relational schema for capturing illumination angles, sky conditions, operator metadata, and raw DN alongside calibrated reflectance curves.',
        bibtexKey: 'hueni2009specchio'
      }
    ],
    fieldProtocols: [
      {
        id: 'ceos_lpv_surface_reflectance_m4',
        type: 'field_protocol',
        title: 'CEOS WGCV Land Product Validation Subgroup: Best Practice Protocol for In-Situ Surface Reflectance Measurements',
        authors: 'Pacheco, A., Barsi, J., Czapla-Myers, J., Doxani, G., Fox, N., Goryl, P., & Helder, D.',
        year: 2021,
        source: 'CEOS WGCV-LPV Protocol Document Version 1.0',
        volumeIssuePages: '74 p.',
        doiOrUrl: 'https://lpvs.gsfc.nasa.gov/PDF/CEOS_WGCV_LPV_Surface_Reflectance_Protocol_v1.0.pdf',
        authorityOrCurator: 'CEOS / NASA / ESA / USGS',
        spectralCoverageOrScope: 'International benchmark field protocol for satellite cal/val campaigns',
        applicationNote: 'The gold-standard protocol specifying solar zenith angle boundaries (<60°), white reference optimization intervals (<10–15 min), sampling grids, and total measurement uncertainty budgeting.',
        bibtexKey: 'pacheco2021ceos'
      },
      {
        id: 'iso_19115_spectrometry_m4',
        type: 'field_protocol',
        title: 'ISO 19115-2: Geographic Information — Metadata — Part 2: Extensions for acquisition and processing',
        authors: 'International Organization for Standardization (ISO)',
        year: 2019,
        source: 'ISO Standard 19115-2:2019(E)',
        volumeIssuePages: 'Geneva, Switzerland',
        doiOrUrl: 'https://www.iso.org/standard/67039.html',
        authorityOrCurator: 'ISO Technical Committee TC 211',
        spectralCoverageOrScope: 'Geospatial imagery and in-situ field sensor metadata standards',
        applicationNote: 'Specifies essential metadata recording standards: foreoptic FOV, distance to target, sensor azimuth/zenith, solar azimuth/zenith, target photos, and GPS datum.',
        bibtexKey: 'iso2019geographic'
      }
    ],
    academicLiterature: [
      {
        id: 'curran_field_sampling_m4',
        type: 'journal_article',
        title: 'Estimating the canopy water content of foliage from spectral reflectance measurements',
        authors: 'Curran, P. J., Dungan, J. L., & Peterson, D. L.',
        year: 1992,
        source: 'Remote Sensing of Environment',
        volumeIssuePages: '39(3), 193–208',
        doiOrUrl: 'https://doi.org/10.1016/0034-4257(92)90086-G',
        authorityOrCurator: 'NASA Ames Research Center',
        applicationNote: 'Establishes sample spatial sampling design rules, nested plots, and statistical sample size calculations to ensure field spectroscopy footprint representative of satellite pixel scales.',
        bibtexKey: 'curran1992estimating'
      }
    ]
  },
  5: {
    moduleNumber: 5,
    moduleTitle: 'Vegetation Biophysical & Biochemical Spectroscopy, RTMs & Spectral Indices',
    spectralLibraries: [
      {
        id: 'lopex93_database_m5',
        type: 'spectral_library',
        title: 'LOPEX93: Leaf Optical Properties Experiment 93',
        authors: 'Hosgood, B., Jacquemoud, S., Andreoli, G., Verdebout, J., Pedrini, A., & Schmuck, G.',
        year: 1995,
        source: 'Joint Research Centre (JRC) European Commission Report EUR 16095 EN',
        volumeIssuePages: 'Ispra, Italy, 150 p.',
        doiOrUrl: 'https://data.jrc.ec.europa.eu/dataset/jrc-eurl-ecv-lopex93',
        authorityOrCurator: 'European Commission Joint Research Centre (JRC)',
        spectralCoverageOrScope: '400–2500 nm (directional-hemispherical reflectance and transmittance of 66 plant species)',
        applicationNote: 'The global benchmark database of leaf directional-hemispherical reflectance and transmittance measured with integrating spheres along with wet chemical assays (chlorophyll, water, dry matter).',
        bibtexKey: 'hosgood1995lopex93'
      },
      {
        id: 'angers_database_m5',
        type: 'spectral_library',
        title: 'The ANGERS 2003 Leaf Optical Properties Database',
        authors: 'Jacquemoud, S., Baret, F., Frangi, J. P., Ustin, S. L., & Verdebout, J.',
        year: 2003,
        source: 'INRA / Université Paris Diderot Research Database',
        volumeIssuePages: 'Angers, France',
        doiOrUrl: 'https://opticleaf.ipgp.fr/',
        authorityOrCurator: 'Institut de Physique du Globe de Paris (IPGP) & INRAE',
        spectralCoverageOrScope: '400–2450 nm (276 leaf samples across 40 angiosperm & gymnosperm species)',
        applicationNote: 'Used for calibration and inversion testing of leaf radiative transfer models (PROSPECT-4, PROSPECT-5, and PROSPECT-D).',
        bibtexKey: 'jacquemoud2003angers'
      }
    ],
    fieldProtocols: [
      {
        id: 'promis_integrating_sphere_protocol_m5',
        type: 'field_protocol',
        title: 'Protocol for Integrating Sphere Measurements of Leaf Directional-Hemispherical Reflectance and Transmittance',
        authors: 'Daughtry, C. S. T., Biehl, L. L., & Ranson, K. J.',
        year: 1989,
        source: 'Remote Sensing of Environment',
        volumeIssuePages: '27(1), 81–91',
        doiOrUrl: 'https://doi.org/10.1016/0034-4257(89)90039-4',
        authorityOrCurator: 'USDA-ARS Hydrology and Remote Sensing Laboratory',
        spectralCoverageOrScope: 'Integrating sphere replacement techniques with external lamp collimation',
        applicationNote: 'Mandates zero-leakage clamping of foliage samples onto integrating sphere ports, stray light port correction factors, and sample substitution bias equations.',
        bibtexKey: 'daughtry1989integrating'
      }
    ],
    academicLiterature: [
      {
        id: 'feret_prospect_d_m5',
        type: 'journal_article',
        title: 'PROSPECT-D: Towards modeling leaf optical properties through a complete lifecycle',
        authors: 'Féret, J. B., Gitelson, A. A., Noble, S. D., & Jacquemoud, S.',
        year: 2017,
        source: 'Remote Sensing of Environment',
        volumeIssuePages: '193, 204–215',
        doiOrUrl: 'https://doi.org/10.1016/j.rse.2017.03.004',
        authorityOrCurator: 'IPGP / University of Nebraska-Lincoln',
        applicationNote: 'Derives specific absorption coefficients (SAC) for chlorophyll a+b, total carotenoids, anthocyanins, brown pigments, equivalent water thickness, and leaf dry matter.',
        bibtexKey: 'feret2017prospectd'
      },
      {
        id: 'verhoef_sail_m5',
        type: 'journal_article',
        title: 'Earth observation modeling based on bidirectional reflectance of vegetative canopies',
        authors: 'Verhoef, W.',
        year: 1984,
        source: 'Remote Sensing of Environment',
        volumeIssuePages: '16(2), 125–141',
        doiOrUrl: 'https://doi.org/10.1016/0034-4257(84)90057-9',
        authorityOrCurator: 'National Aerospace Laboratory NLR',
        applicationNote: 'Formulates the 4-stream canopy scattering differential equations linking leaf optical properties to canopy architecture (LAI, ALA, hotspot) in the PROSAIL model.',
        bibtexKey: 'verhoef1984sail'
      }
    ]
  },
  6: {
    moduleNumber: 6,
    moduleTitle: 'Soil, Mineral & Geological Spectroscopy: Chemical Bonds & Spectral Feature Fitting',
    spectralLibraries: [
      {
        id: 'usgs_minerals_m6',
        type: 'spectral_library',
        title: 'USGS Digital Spectral Library splib06a: Pure Minerals, Mineral Mixtures, and Coatings',
        authors: 'Clark, R. N., Swayze, G. A., Wise, R., Livo, K. E., Hoefen, T. M., Kokaly, R. F., & Sutley, S. J.',
        year: 2007,
        source: 'U.S. Geological Survey Digital Data Series 231',
        volumeIssuePages: 'Reston, VA',
        doiOrUrl: 'https://speclab.cr.usgs.gov/spectral.lib06/',
        authorityOrCurator: 'USGS Spectroscopy Laboratory',
        spectralCoverageOrScope: '200–3000 nm at high resolving power (1,300 pure mineral endmembers)',
        applicationNote: 'Gold standard for continuum removal, absorption band depth, and spectral feature fitting (SFF) for diagnostic clay overtone doublets (e.g. kaolinite at 2162 & 2208 nm, montmorillonite at 2206 nm).',
        bibtexKey: 'clark2007usgs'
      },
      {
        id: 'lucas_soil_library_m6',
        type: 'spectral_library',
        title: 'LUCAS Topsoil Database: European Vis-NIR Soil Spectral Library',
        authors: 'Orgiazzi, A., Ballabio, C., Panagos, P., Yigini, Y., & Montanarella, L.',
        year: 2018,
        source: 'European Journal of Soil Science',
        volumeIssuePages: '69(1), 140–153',
        doiOrUrl: 'https://doi.org/10.1111/ejss.12499',
        authorityOrCurator: 'European Soil Data Centre (ESDAC) / JRC',
        spectralCoverageOrScope: '400–2500 nm (20,000 topsoil samples across 28 European countries)',
        applicationNote: 'Continental-scale calibrated spectral library for chemometric PLSR, SVM, and random forest estimation of soil organic carbon (SOC), clay content, and cation exchange capacity (CEC).',
        bibtexKey: 'orgiazzi2018lucas'
      }
    ],
    fieldProtocols: [
      {
        id: 'fao_soil_spectroscopy_protocol_m6',
        type: 'field_protocol',
        title: 'Global Soil Spectroscopy Protocol: Guidelines for Laboratory and In-Situ Soil Vis-NIR Measurements',
        authors: 'Viscarra Rossel, R. A., Behrens, T., Ben-Dor, E., Brown, D. J., Demattê, J. A. M., et al.',
        year: 2016,
        source: 'FAO / Global Soil Partnership Technical Report',
        volumeIssuePages: 'Rome, Italy, 84 p.',
        doiOrUrl: 'https://www.fao.org/global-soil-partnership/resources/',
        authorityOrCurator: 'Food and Agriculture Organization (FAO) of the United Nations',
        spectralCoverageOrScope: 'Sample grinding, sieving (<2mm), drying (40°C), and contact probe protocols',
        applicationNote: 'Prescribes precise protocol standards to eliminate soil moisture quenching and aggregate shadow effects before spectral acquisition.',
        bibtexKey: 'viscarra2016fao'
      }
    ],
    academicLiterature: [
      {
        id: 'clark_continuum_removal_m6',
        type: 'journal_article',
        title: 'High spectral resolution reflectance spectroscopy of minerals',
        authors: 'Clark, R. N., King, T. V., Klejwa, M., Swayze, G. A., & Vergo, N.',
        year: 1990,
        source: 'Journal of Geophysical Research: Solid Earth',
        volumeIssuePages: '95(B8), 12653–12680',
        doiOrUrl: 'https://doi.org/10.1029/JB095iB08p12653',
        authorityOrCurator: 'USGS',
        applicationNote: 'Introduces the mathematical formulation of upper convex hull continuum removal, band depth calculation, and band center definition used in Tetracorder and hyperspectral mineral mapping.',
        bibtexKey: 'clark1990high'
      }
    ]
  },
  7: {
    moduleNumber: 7,
    moduleTitle: 'Spectroradiometric Data Pre-processing, Chemometrics & Feature Extraction',
    spectralLibraries: [
      {
        id: 'specchio_archive_m7',
        type: 'spectral_library',
        title: 'The SPECCHIO Spectral Information System for Processing and Quality Assessment of Spectral Campaigns',
        authors: 'Hueni, A., Chisholm, L. A., Santer, R., & Ong, C.',
        year: 2020,
        source: 'IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing',
        volumeIssuePages: '13, 2410–2425',
        doiOrUrl: 'https://doi.org/10.1109/JSTARS.2020.2989123',
        authorityOrCurator: 'University of Zurich Remote Sensing Laboratories (RSL)',
        spectralCoverageOrScope: 'Raw spectrometer file parsing, automated bad scan flagging, SNR filtering',
        applicationNote: 'Standard open platform for managing spectral campaigns, automated splice correction across VNIR/SWIR detectors, and spectral metadata traceability.',
        bibtexKey: 'hueni2020specchio'
      }
    ],
    fieldProtocols: [
      {
        id: 'ceos_quality_flags_protocol_m7',
        type: 'field_protocol',
        title: 'CEOS Quality Assurance Framework for Earth Observation (QA4EO): Field Radiometry Guidelines',
        authors: 'QA4EO Task Team',
        year: 2010,
        source: 'QA4EO Document QA4EO-GEN-DQK-002',
        volumeIssuePages: 'Committee on Earth Observation Satellites, 32 p.',
        doiOrUrl: 'https://qa4eo.org/documentation/',
        authorityOrCurator: 'QA4EO / CEOS / GEO',
        spectralCoverageOrScope: 'Traceable uncertainty estimation, quality flags, and instrument sensor drift logs',
        applicationNote: 'Establishes guidelines for documenting metrological traceability to SI units, calculating combined measurement uncertainty (GUM methodology), and creating machine-readable quality flags.',
        bibtexKey: 'qa4eo2010guidelines'
      }
    ],
    academicLiterature: [
      {
        id: 'savitzky_golay_m7',
        type: 'journal_article',
        title: 'Smoothing and differentiation of data by simplified least squares procedures',
        authors: 'Savitzky, A., & Golay, M. J. E.',
        year: 1964,
        source: 'Analytical Chemistry',
        volumeIssuePages: '36(8), 1627–1639',
        doiOrUrl: 'https://doi.org/10.1021/ac60214a047',
        authorityOrCurator: 'Perkin-Elmer Corporation',
        applicationNote: 'The classical least-squares convolutional filter used universally in spectroscopy to calculate smoothed zero, first, and second spectral derivatives while preserving peak heights and widths.',
        bibtexKey: 'savitzky1964smoothing'
      },
      {
        id: 'wold_plsr_m7',
        type: 'journal_article',
        title: 'PLS-regression: A basic tool of chemometrics',
        authors: 'Wold, S., Sjöström, M., & Eriksson, L.',
        year: 2001,
        source: 'Chemometrics and Intelligent Laboratory Systems',
        volumeIssuePages: '58(2), 109–130',
        doiOrUrl: 'https://doi.org/10.1016/S0169-7439(01)00155-1',
        authorityOrCurator: 'Umeå University Chemometrics Group',
        applicationNote: 'Formulates Partial Least Squares Regression (PLSR) and cross-validation protocols for predicting biophysical and chemical constituents from collinear high-dimensional spectral channels.',
        bibtexKey: 'wold2001pls'
      }
    ]
  },
  8: {
    moduleNumber: 8,
    moduleTitle: 'Upscaling Field Spectroscopy to Airborne & Satellite Sensors (Cal/Val & Validation)',
    spectralLibraries: [
      {
        id: 'radcalnet_portal_m8',
        type: 'spectral_library',
        title: 'RadCalNet: International Network of Automated Radiometric Calibration Sites (Railroad Valley, Gobabeb, Baotou, La Crau)',
        authors: 'Bouvet, M., Berthelot, B., Czapla-Myers, J., Fox, N., Goryl, P., & Henry, P.',
        year: 2019,
        source: 'CEOS RadCalNet Operational Cal/Val Portal',
        volumeIssuePages: 'https://www.radcalnet.org/',
        doiOrUrl: 'https://doi.org/10.3390/rs11202401',
        authorityOrCurator: 'CEOS WGCV / ESA / NASA / CNES / AOE',
        spectralCoverageOrScope: '400–2500 nm continuous automated surface reflectance and atmospheric optical depth',
        applicationNote: 'Automated ground calibration sites providing fiducial reference measurements for continuous vicarious calibration of Sentinel-2 MSI, Landsat 8/9 OLI, and PRISMA.',
        bibtexKey: 'bouvet2019radcalnet_portal'
      }
    ],
    fieldProtocols: [
      {
        id: 'frm4veg_protocol_m8',
        type: 'field_protocol',
        title: 'Fiducial Reference Measurements for Vegetation (FRM4VEG): Field Measurement Protocol for Surface Reflectance & Canopy Parameters',
        authors: 'Origo, N., Baret, F., Camacho, F., Gorroño, J., Hueni, A., Morris, H., Nightingale, J., Weiss, M., & Fox, N.',
        year: 2020,
        source: 'European Space Agency Technical Document',
        volumeIssuePages: 'ESA Contract Report FRM4VEG-PROTO-v2.0, 96 p.',
        doiOrUrl: 'https://frm4veg.org/documents/',
        authorityOrCurator: 'ESA / National Physical Laboratory (NPL) / INRAE',
        spectralCoverageOrScope: 'SI-traceable field spectroscopy, sampling grids, and UAV upscaling protocols',
        applicationNote: 'Defines the mandatory protocol for Copernicus Sentinel-2 surface reflectance and LAI validation: spatial sampling schemes, UAV-based spatial upscaling, and GUM error budgets.',
        bibtexKey: 'origo2020frm4veg'
      },
      {
        id: 'ceos_lpv_validation_m8',
        type: 'field_protocol',
        title: 'CEOS Land Product Validation (LPV) Hierarchy and Guidelines for High-Resolution Satellite Product Validation',
        authors: 'Baret, F., Weiss, M., Lacaze, R., Camacho, F., Makhmara, H., & Pacholczyk, P.',
        year: 2020,
        source: 'CEOS WGCV LPV Technical Monograph',
        volumeIssuePages: 'Version 2.3, 56 p.',
        doiOrUrl: 'https://lpvs.gsfc.nasa.gov/',
        authorityOrCurator: 'CEOS WGCV Land Product Validation Subgroup',
        spectralCoverageOrScope: 'Stage 1 through Stage 4 validation criteria for terrestrial surface products',
        applicationNote: 'Prescribes the spatial convolution and point-to-pixel validation procedures required to declare satellite surface reflectance and biophysical variables validated at Stage 3/4.',
        bibtexKey: 'baret2020ceos'
      }
    ],
    academicLiterature: [
      {
        id: 'doxani_aci_m8',
        type: 'journal_article',
        title: 'Atmospheric Correction Inter-comparison Exercise (ACIX): Validation of atmospheric correction algorithms using field spectroscopy',
        authors: 'Doxani, G., Vermote, E., Roger, J. C., Gascon, F., Adriaensen, S., Frantz, D., Hagolle, O., Hollstein, A., et al.',
        year: 2018,
        source: 'Remote Sensing',
        volumeIssuePages: '10(2), 352',
        doiOrUrl: 'https://doi.org/10.3390/rs10020352',
        authorityOrCurator: 'ESA / NASA Goddard Space Flight Center',
        applicationNote: 'Compares Sen2Cor, LaSRC, MAJA, and FORCE atmospheric correction algorithms against in-situ AERONET and RadCalNet field spectrometry.',
        bibtexKey: 'doxani2018acix'
      }
    ]
  }
};

/**
 * Retrieve all citations for a given module (combining database and module.keyReferences)
 */
export function getModuleCitations(module: CourseModule): ModuleCitationGroup {
  const defaultGroup = MODULE_CITATIONS_DATABASE[module.moduleNumber] || {
    moduleNumber: module.moduleNumber,
    moduleTitle: module.title,
    spectralLibraries: [],
    fieldProtocols: [],
    academicLiterature: []
  };

  // If module already has keyReferences that are not yet in defaultGroup, merge them as academic literature
  const existingTitles = new Set([
    ...defaultGroup.spectralLibraries.map(c => c.title.toLowerCase()),
    ...defaultGroup.fieldProtocols.map(c => c.title.toLowerCase()),
    ...defaultGroup.academicLiterature.map(c => c.title.toLowerCase())
  ]);

  const mergedAcademic = [...defaultGroup.academicLiterature];

  if (module.keyReferences && module.keyReferences.length > 0) {
    for (const ref of module.keyReferences) {
      if (!existingTitles.has(ref.title.toLowerCase())) {
        const item: CitationItem = {
          id: `module_${module.moduleNumber}_ref_${mergedAcademic.length + 1}`,
          type: 'journal_article',
          title: ref.title,
          authors: ref.authors,
          year: ref.year,
          source: ref.journalOrPublisher,
          doiOrUrl: ref.doiOrUrl,
          authorityOrCurator: 'Academic Peer-Reviewed Literature',
          applicationNote: `Core reading reference designated for Module ${module.moduleNumber}.`,
          bibtexKey: `ref_m${module.moduleNumber}_${ref.year}`
        };
        mergedAcademic.push(item);
      }
    }
  }

  return {
    ...defaultGroup,
    academicLiterature: mergedAcademic
  };
}
