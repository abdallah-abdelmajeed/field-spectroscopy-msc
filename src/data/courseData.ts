import { MODULE_1, MODULE_2 } from './modulesDataPart1';
import { MODULE_3 } from './modulesDataPart1_B';
import { MODULE_4 } from './modulesDataPart1_C';
import { MODULE_5 } from './modulesDataPart2_A';
import { MODULE_6 } from './modulesDataPart2_B';
import { MODULE_7, MODULE_8 } from './modulesDataPart2_C';
import type { CourseModule, StudentSubmission } from '../types';

export const COURSE_MODULES: CourseModule[] = [
  MODULE_1,
  MODULE_2,
  MODULE_3,
  MODULE_4,
  MODULE_5,
  MODULE_6,
  MODULE_7,
  MODULE_8
];

export const COURSE_SYLLABUS_OVERVIEW = {
  courseCode: 'GEO-MSc-704',
  courseName: 'Principles of Field Spectroscopy',
  targetAudience: 'MSc Students in Geo-Information, Spatial Management & Environmental Remote Sensing',
  totalEctsCredits: 12.0,
  totalLectureHours: 32,
  totalFieldExerciseHours: 34,
  totalLabHours: 32,
  totalSlideDecksCount: 8,
  totalSlidesCount: COURSE_MODULES.reduce((acc, m) => acc + m.slides.length, 0), // 240 slides
  leadInstructorTitle: 'Professor of Earth Observation & Environmental Spectroscopy',
  curriculumStandard: 'CEOS WGCV Cal/Val & ISO 19115-2 Geographic Metadata Standards',
  softwareEcosystem: 'Python 3.11 (specdal, pysptools, scikit-learn, prosail) & R 4.3 (hsdar, prospectr, pls)',
  instrumentPlatforms: [
    'ASD FieldSpec 4 Hi-Res (350–2500 nm)',
    'Spectral Evolution SR-3501 (350–2500 nm)',
    'SVC HR-1024i Spectroradiometer (350–2500 nm)',
    'MicaSense RedEdge-P / DJI Mavic 3M Multispectral UAV',
    'Headwall Nano-Hyperspec Pushbroom Drone Payload',
    'LI-COR LAI-2200C Plant Canopy Analyzer',
    'NIST-Traceable Calibrated Spectralon Reflectance Standards (99%, 84%, 48%, 24%, 3%)'
  ]
};

// Simulated cohort of 10 MSc Geo-Information & Spatial Management students for tracking
export const INITIAL_STUDENT_ROSTER: StudentSubmission[] = [
  {
    studentId: 'MSc-GEO-2026-01',
    studentName: 'Elena Rostova',
    email: 'elena.rostova@geoinfo.uni.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    moduleScores: { 1: 95, 2: 90, 3: 85, 4: 92, 5: 88, 6: 94, 7: 86, 8: 90 },
    quizAttempts: { 1: 1, 2: 2, 3: 1, 4: 1, 5: 2, 6: 1, 7: 2, 8: 1 },
    labsCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true },
    fieldExerciseStatus: { 1: 'Approved', 2: 'Approved', 3: 'Approved', 4: 'Approved', 5: 'Approved', 6: 'Approved', 7: 'Submitted', 8: 'Submitted' },
    instructorFeedback: {
      1: 'Exemplary Planck radiation derivations and rigorous uncertainty discussion.',
      4: 'Superb BRDF sampling scheme in the orchard test plot; clear sky protocol respected.',
      7: 'PROSAIL inversion showed good parameter convergence. Minor bias in background soil spectra.'
    },
    lastActive: '2026-09-12 16:45',
    notes: 'Thesis topic: UAV hyperspectral retrieval of vineyard leaf water potential.'
  },
  {
    studentId: 'MSc-GEO-2026-02',
    studentName: 'Marcus Vance',
    email: 'm.vance@geoinfo.uni.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    moduleScores: { 1: 88, 2: 85, 3: 80, 4: 78, 5: 84, 6: 82, 7: 75, 8: 80 },
    quizAttempts: { 1: 2, 2: 1, 3: 2, 4: 3, 5: 1, 6: 2, 7: 3, 8: 2 },
    labsCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: false, 8: false },
    fieldExerciseStatus: { 1: 'Approved', 2: 'Approved', 3: 'Approved', 4: 'Approved', 5: 'Submitted', 6: 'In Progress', 7: 'Not Started', 8: 'Not Started' },
    instructorFeedback: {
      3: 'Spectralon cleaning protocol accurately documented. Remember to avoid abrasive microfiber.',
      4: 'Review detector splice step offsets; SWIR-1 to SWIR-2 step exceeded 2% threshold.'
    },
    lastActive: '2026-09-13 11:20',
    notes: 'Focus on mining reclamation and acid mine drainage iron oxide mapping.'
  },
  {
    studentId: 'MSc-GEO-2026-03',
    studentName: 'Aisha Al-Mansoor',
    email: 'aisha.mansoor@geoinfo.uni.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    moduleScores: { 1: 100, 2: 95, 3: 92, 4: 96, 5: 98, 6: 95, 7: 92, 8: 95 },
    quizAttempts: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1 },
    labsCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true },
    fieldExerciseStatus: { 1: 'Approved', 2: 'Approved', 3: 'Approved', 4: 'Approved', 5: 'Approved', 6: 'Approved', 7: 'Approved', 8: 'Approved' },
    instructorFeedback: {
      5: 'Exceptional Empirical Line Method calibration. Gain and offset uncertainties were rigorously propagated.',
      8: 'SPECCHIO database schema successfully linked with PostGIS spatial database.'
    },
    lastActive: '2026-09-14 09:15',
    notes: 'Candidate for PhD research in spaceborne PRISMA/EnMAP cal/val.'
  },
  {
    studentId: 'MSc-GEO-2026-04',
    studentName: 'Julian Chen',
    email: 'j.chen@geoinfo.uni.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    moduleScores: { 1: 90, 2: 88, 3: 82, 4: 85, 5: 90, 6: 88, 7: 80, 8: 85 },
    quizAttempts: { 1: 1, 2: 2, 3: 1, 4: 2, 5: 1, 6: 2, 7: 2, 8: 1 },
    labsCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: false },
    fieldExerciseStatus: { 1: 'Approved', 2: 'Approved', 3: 'Approved', 4: 'Approved', 5: 'Approved', 6: 'Submitted', 7: 'Submitted', 8: 'In Progress' },
    instructorFeedback: {
      6: 'Savitzky-Golay filter window length was well selected. Beautiful continuum removal of Kaolinite doublet.'
    },
    lastActive: '2026-09-13 18:30',
    notes: 'Working on agricultural phenology time-series and nitrogen mapping.'
  },
  {
    studentId: 'MSc-GEO-2026-05',
    studentName: 'Fatima Zahra',
    email: 'f.zahra@geoinfo.uni.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    moduleScores: { 1: 92, 2: 90, 3: 88, 4: 86, 5: 92, 6: 90, 7: 85, 8: 88 },
    quizAttempts: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 1, 6: 1, 7: 2, 8: 1 },
    labsCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true },
    fieldExerciseStatus: { 1: 'Approved', 2: 'Approved', 3: 'Approved', 4: 'Approved', 5: 'Approved', 6: 'Approved', 7: 'Approved', 8: 'Submitted' },
    instructorFeedback: {
      7: 'Latin Hypercube Sampling for LUT inversion was well implemented. Good discussion of equifinality.'
    },
    lastActive: '2026-09-14 08:50',
    notes: 'Specialization in arid land soil degradation and biological soil crusts.'
  }
];

// Interactive spectral library curves for the real-time Spectra Explorer
export interface ReferenceSpectrum {
  id: string;
  name: string;
  category: 'Vegetation' | 'Mineral' | 'Soil' | 'Water' | 'Manmade' | 'Atmosphere';
  description: string;
  source: string;
  diagnosticFeatures: string;
  dataPoints: { wavelength: number; reflectance: number }[];
}

export const REFERENCE_SPECTRA: ReferenceSpectrum[] = [
  {
    id: 'healthy_green_leaf',
    name: 'Healthy Green Deciduous Canopy (Broadleaf)',
    category: 'Vegetation',
    description: 'Fresh sunlit Quercus robur leaf exhibiting strong chlorophyll pigment absorption, steep red-edge slope, and prominent near-infrared cellular scattering plateau.',
    source: 'USGS Spectral Library & ASD FieldSpec 4',
    diagnosticFeatures: 'Chlorophyll-a (675 nm), Green reflection peak (550 nm), Red Edge inflection (705-725 nm), NIR scattering plateau (780-1100 nm), Water overtones (970, 1200, 1450, 1940 nm)',
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
    id: 'senescent_dry_residue',
    name: 'Senescent Dry Crop Residue / Straw (NPV)',
    category: 'Vegetation',
    description: 'Dry wheat straw (Non-Photosynthetic Vegetation) with depleted chlorophyll and diagnostic cellulose and lignin SWIR absorption doublets.',
    source: 'C. Daughtry / USDA Agricultural Research Service',
    diagnosticFeatures: 'Absence of 680 nm red edge; diagnostic Cellulose Absorption Index (CAI) absorption at 2100 nm and 2300 nm.',
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
    id: 'kaolinite_mineral',
    name: 'Kaolinite Clay Mineral (Al2Si2O5(OH)4)',
    category: 'Mineral',
    description: 'High-purity hydrothermal clay standard with characteristic Al-OH vibrational combination doublet at 2162 nm and 2208 nm.',
    source: 'USGS Spectral Library Version 7 (Splib07a)',
    diagnosticFeatures: 'Distinctive Al-OH doublet at 2162 nm and 2208 nm; OH-stretching fundamental overtone at 1412 nm.',
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
    id: 'agricultural_loam_soil',
    name: 'Temperate Silt Loam Soil (Moist)',
    category: 'Soil',
    description: 'Organic-rich agricultural topsoil showing gentle monotonic upward slope across optical wavelengths governed by soil organic matter (SOM) and iron oxide content.',
    source: 'JPL Soil Library / USDA-NRCS',
    diagnosticFeatures: 'Broad iron oxide absorption shoulder (450–550 nm and 850–950 nm); weak clay lattice OH absorption at 1400 and 1900 nm.',
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
    id: 'spectralon_white_standard',
    name: 'Certified NIST-Traceable Spectralon 99%',
    category: 'Manmade',
    description: 'Sintered polytetrafluoroethylene (PTFE) diffuse radiometric reflectance standard exhibiting > 98.5% hemispherical reflectance from 350 to 2000 nm.',
    source: 'Labsphere Inc. Calibration Certificate (NIST Traceable)',
    diagnosticFeatures: 'Near-flat Lambertian white line across optical range; minor dip at 2150 nm due to PTFE polymer stretching.',
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
