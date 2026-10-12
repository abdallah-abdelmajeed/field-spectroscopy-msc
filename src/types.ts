export interface AcademicReference {
  authors: string;
  year: number;
  title: string;
  journalOrPublisher: string;
  doiOrUrl?: string;
}

export interface Slide {
  id: string;
  slideNumber: number;
  title: string;
  category: 'Physics' | 'Instrumentation' | 'Protocol' | 'Mathematics' | 'Processing' | 'CaseStudy' | 'QualityAssurance' | 'RTM' | 'Database';
  keyTakeaway: string;
  bullets: string[];
  mathFormula?: string;
  formulaExplanation?: string;
  diagramDescription?: string;
  practicalFieldNote?: string;
  speakerNotes: string;
  references: string[];
}

export interface FieldExercise {
  title: string;
  estimatedDuration: string;
  targetEnvironment: string;
  recommendedInstruments: string[];
  safetyAndPreTripChecklist: string[];
  fieldProtocolSteps: {
    stepNumber: number;
    action: string;
    scientificRationale: string;
    commonErrorToAvoid: string;
  }[];
  dataRecordingSheetFields: string[];
  fieldDeliverable: string;
}

export interface CodeSnippet {
  language: 'python' | 'r';
  title: string;
  description: string;
  code: string;
}

export interface PracticalLab {
  title: string;
  softwareEnvironment: 'Python (Jupyter / Spyder)' | 'R (RStudio / hsdar)' | 'Hybrid (Python & R)';
  primaryPackages: string[];
  learningObjectives: string[];
  sampleDataset: {
    name: string;
    description: string;
    spectralRange: string;
    sensor: string;
    bandsCount: number;
  };
  codeSnippets: CodeSnippet[];
  studentTasks: string[];
  expectedOutputSummary: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  academicCitation: string;
}

export interface AutomatedQuiz {
  moduleNumber: number;
  title: string;
  passingScorePercent: number;
  questions: QuizQuestion[];
}

export interface CourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  durationHours: number;
  ectsCredits: number;
  abstract: string;
  coreCompetencies: string[];
  slides: Slide[];
  fieldExercise: FieldExercise;
  practicalLab: PracticalLab;
  quiz: AutomatedQuiz;
  keyReferences: AcademicReference[];
}

export interface StudentSubmission {
  studentId: string;
  studentName: string;
  email: string;
  avatar: string;
  moduleScores: Record<number, number>; // moduleNumber -> quiz percentage
  quizAttempts: Record<number, number>;
  labsCompleted: Record<number, boolean>;
  fieldExerciseStatus: Record<number, 'Not Started' | 'In Progress' | 'Submitted' | 'Approved'>;
  instructorFeedback: Record<number, string>;
  lastActive: string;
  notes?: string;
}

export interface UserAuthProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  accessToken: string | null;
}

export type GlossaryCategory =
  | 'Radiometry'
  | 'Instrumentation'
  | 'Field Protocols'
  | 'RTM & Indices'
  | 'Physics & Atmospheric'
  | 'Cal/Val & Quality';

export interface GlossaryTerm {
  id: string;
  term: string;
  aliases: string[];
  symbol?: string;
  units?: string;
  category: GlossaryCategory;
  shortDefinition: string;
  fullDefinition: string;
  mathFormula?: string;
  formulaExplanation?: string;
  fieldImplication: string;
  standardOrAuthority?: string;
  relatedTermIds?: string[];
  keyExample?: string;
}
