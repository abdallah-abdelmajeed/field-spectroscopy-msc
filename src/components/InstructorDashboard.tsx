import React, { useState, useMemo } from 'react';
import {
  Users,
  Award,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  MessageSquare,
  Edit3,
  BookOpen,
  Check,
  X,
  Sparkles,
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  CheckCircle2,
  Layers,
  GraduationCap
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { INITIAL_STUDENT_ROSTER, COURSE_SYLLABUS_OVERVIEW, COURSE_MODULES } from '../data/courseData';
import type { StudentSubmission } from '../types';

export const InstructorDashboard: React.FC = () => {
  const [students, setStudents] = useState<StudentSubmission[]>(INITIAL_STUDENT_ROSTER);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentForFeedback, setSelectedStudentForFeedback] = useState<StudentSubmission | null>(null);
  const [feedbackModule, setFeedbackModule] = useState(1);
  const [feedbackText, setFeedbackText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending'>('all');
  const [analyticsView, setAnalyticsView] = useState<'completion' | 'distribution'>('completion');
  const [chartMetric, setChartMetric] = useState<'all' | 'quizzes' | 'labs' | 'field'>('all');

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'pending') {
      return Object.values(s.fieldExerciseStatus).some((status) => status === 'Submitted');
    }
    return true;
  });

  // Visual Progress Analytics via Recharts
  const moduleCompletionData = useMemo(() => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((modNum) => {
      let quizPassed = 0;
      let labCompleted = 0;
      let fieldSubmitted = 0;
      let scoreSum = 0;
      let scoreCount = 0;

      students.forEach((s) => {
        const sc = s.moduleScores[modNum];
        if (sc !== undefined) {
          scoreSum += sc;
          scoreCount++;
          if (sc >= 80) quizPassed++;
        }
        if (s.labsCompleted[modNum]) labCompleted++;
        const fStatus = s.fieldExerciseStatus[modNum];
        if (fStatus === 'Approved' || fStatus === 'Submitted') fieldSubmitted++;
      });

      const count = students.length || 1;
      return {
        module: `Module ${modNum}`,
        shortName: `M${modNum}`,
        'Quiz Completion': Math.round((quizPassed / count) * 100),
        'Lab Completion': Math.round((labCompleted / count) * 100),
        'Field Campaign': Math.round((fieldSubmitted / count) * 100),
        'Cohort Average Score': scoreCount > 0 ? Math.round(scoreSum / scoreCount) : 0,
        quizPassed,
        labCompleted,
        fieldSubmitted,
        total: count
      };
    });
  }, [students]);

  const scoreDistributionData = useMemo(() => {
    let distinction = 0;
    let merit = 0;
    let pass = 0;
    let review = 0;

    students.forEach((s) => {
      const scores = Object.values(s.moduleScores) as number[];
      if (scores.length > 0) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        if (avg >= 90) distinction++;
        else if (avg >= 80) merit++;
        else if (avg >= 70) pass++;
        else review++;
      }
    });

    const total = students.length || 1;
    return [
      { name: 'High Distinction (≥90%)', count: distinction, color: '#059669', pct: Math.round((distinction / total) * 100) },
      { name: 'Merit (80–89%)', count: merit, color: '#0284c7', pct: Math.round((merit / total) * 100) },
      { name: 'Pass (70–79%)', count: pass, color: '#d97706', pct: Math.round((pass / total) * 100) },
      { name: 'Review Needed (<70%)', count: review, color: '#e11d48', pct: Math.round((review / total) * 100) }
    ];
  }, [students]);

  // Calculate cohort stats
  const totalStudents = students.length;
  let totalScoreSum = 0;
  let totalScoreCount = 0;
  let totalLabsDone = 0;
  let totalFieldApproved = 0;

  students.forEach((s) => {
    (Object.values(s.moduleScores) as number[]).forEach((sc) => {
      totalScoreSum += sc;
      totalScoreCount++;
    });
    Object.values(s.labsCompleted).forEach((done) => {
      if (done) totalLabsDone++;
    });
    Object.values(s.fieldExerciseStatus).forEach((status) => {
      if (status === 'Approved') totalFieldApproved++;
    });
  });

  const cohortAverageScore = totalScoreCount > 0 ? Math.round(totalScoreSum / totalScoreCount) : 0;
  const labCompletionRate = totalStudents > 0 ? Math.round((totalLabsDone / (totalStudents * 8)) * 100) : 0;

  const handleOpenFeedbackModal = (student: StudentSubmission, modNum: number) => {
    setSelectedStudentForFeedback(student);
    setFeedbackModule(modNum);
    setFeedbackText(student.instructorFeedback[modNum] || '');
  };

  const handleSaveFeedback = () => {
    if (!selectedStudentForFeedback) return;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === selectedStudentForFeedback.studentId) {
          return {
            ...s,
            instructorFeedback: {
              ...s.instructorFeedback,
              [feedbackModule]: feedbackText
            }
          };
        }
        return s;
      })
    );
    setSelectedStudentForFeedback(null);
  };

  const handleToggleFieldStatus = (studentId: string, modNum: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === studentId) {
          const current = s.fieldExerciseStatus[modNum];
          const next =
            current === 'Approved'
              ? 'In Progress'
              : current === 'Submitted'
              ? 'Approved'
              : 'Submitted';
          return {
            ...s,
            fieldExerciseStatus: {
              ...s.fieldExerciseStatus,
              [modNum]: next
            }
          };
        }
        return s;
      })
    );
  };

  const handleExportCSV = () => {
    const headers = ['StudentID,Name,Email,AvgScore,LabsCompleted,FieldExercisesApproved,Notes'];
    const rows = students.map((s) => {
      const scores = Object.values(s.moduleScores) as number[];
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const labsCount = Object.values(s.labsCompleted).filter(Boolean).length;
      const fieldCount = Object.values(s.fieldExerciseStatus).filter((status) => status === 'Approved').length;
      return `"${s.studentId}","${s.studentName}","${s.email}",${avg},${labsCount}/8,${fieldCount}/8,"${s.notes || ''}"`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Field_Spectroscopy_MSc_Cohort_Grades_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-stone-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
              Academic Faculty Portal
            </span>
            <span className="text-xs text-stone-500 font-medium">
              GEO-MSc-704 Course Cohort Tracker
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            Instructor Analytics &amp; Gradebook Dashboard
          </h2>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Gradebook CSV</span>
        </button>
      </div>

      {/* Course Stats Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Enrolled MSc Cohort
          </div>
          <div className="text-2xl font-extrabold text-stone-900">
            {totalStudents} Students
          </div>
          <div className="text-[11px] text-stone-500">
            {COURSE_SYLLABUS_OVERVIEW.totalEctsCredits} ECTS Course
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Cohort Average Quiz
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {cohortAverageScore}%
          </div>
          <div className="text-[11px] text-emerald-800 font-medium">
            Passing threshold: 80%
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Practical Labs Done
          </div>
          <div className="text-2xl font-extrabold text-stone-900">
            {labCompletionRate}%
          </div>
          <div className="text-[11px] text-stone-500">
            {totalLabsDone} / {totalStudents * 8} Lab Notebooks
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Field Exercises Approved
          </div>
          <div className="text-2xl font-extrabold text-stone-900">
            {totalFieldApproved}
          </div>
          <div className="text-[11px] text-stone-500">
            Portable radiometer campaigns
          </div>
        </div>
      </div>

      {/* Visual Progress Tracking Analytics (Recharts) */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-stone-100 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-stone-900">
                Visual Cohort Progress &amp; Completion Rates
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Comparative completion tracking across quizzes, computational lab exercises, and field campaigns
            </p>
          </div>

          {/* View Toggles */}
          <div className="flex items-center space-x-1.5 self-start sm:self-auto">
            <button
              onClick={() => setAnalyticsView('completion')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                analyticsView === 'completion'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Completion by Module</span>
            </button>
            <button
              onClick={() => setAnalyticsView('distribution')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                analyticsView === 'distribution'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Mastery Distribution</span>
            </button>
          </div>
        </div>

        {/* View 1: Module Completion Rates */}
        {analyticsView === 'completion' && (
          <div className="space-y-4">
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-stone-500 font-medium mr-1">Filter Series:</span>
                <button
                  onClick={() => setChartMetric('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                    chartMetric === 'all' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  All (Quizzes, Labs, Field)
                </button>
                <button
                  onClick={() => setChartMetric('quizzes')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                    chartMetric === 'quizzes' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Quizzes Only
                </button>
                <button
                  onClick={() => setChartMetric('labs')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                    chartMetric === 'labs' ? 'bg-sky-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Lab Notebooks Only
                </button>
                <button
                  onClick={() => setChartMetric('field')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                    chartMetric === 'field' ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Field Campaigns Only
                </button>
              </div>

              <div className="text-xs text-stone-400">
                Passing criteria: Quizzes ≥80% • Labs checked • Field approved
              </div>
            </div>

            {/* Recharts Composed Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={moduleCompletionData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="shortName"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    unit="%"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-stone-900 text-white text-xs p-3 rounded-lg shadow-lg space-y-1.5 border border-stone-800">
                            <div className="font-bold border-b border-stone-700 pb-1 text-emerald-400">
                              {data.module}: {COURSE_MODULES.find(m => `M${m.id}` === label)?.title || ''}
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between space-x-4">
                                <span className="text-stone-300">Quiz Pass Rate:</span>
                                <span className="font-bold text-emerald-300">{data['Quiz Completion']}% ({data.quizPassed}/{data.total})</span>
                              </div>
                              <div className="flex justify-between space-x-4">
                                <span className="text-stone-300">Lab Completion:</span>
                                <span className="font-bold text-sky-300">{data['Lab Completion']}% ({data.labCompleted}/{data.total})</span>
                              </div>
                              <div className="flex justify-between space-x-4">
                                <span className="text-stone-300">Field Campaign:</span>
                                <span className="font-bold text-amber-300">{data['Field Campaign']}% ({data.fieldSubmitted}/{data.total})</span>
                              </div>
                              <div className="flex justify-between space-x-4 pt-1 border-t border-stone-800">
                                <span className="text-stone-300">Avg Quiz Score:</span>
                                <span className="font-bold text-purple-300">{data['Cohort Average Score']}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                  />
                  {(chartMetric === 'all' || chartMetric === 'quizzes') && (
                    <Bar
                      dataKey="Quiz Completion"
                      fill="#059669"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={36}
                    />
                  )}
                  {(chartMetric === 'all' || chartMetric === 'labs') && (
                    <Bar
                      dataKey="Lab Completion"
                      fill="#0284c7"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={36}
                    />
                  )}
                  {(chartMetric === 'all' || chartMetric === 'field') && (
                    <Bar
                      dataKey="Field Campaign"
                      fill="#d97706"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={36}
                    />
                  )}
                  {chartMetric === 'all' && (
                    <Line
                      type="monotone"
                      dataKey="Cohort Average Score"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#8b5cf6' }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* View 2: Grade & Mastery Distribution */}
        {analyticsView === 'distribution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreDistributionData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {scoreDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value} Students (${Math.round((value / totalStudents) * 100)}%)`, name]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Cohort Competency Levels
              </h4>
              <div className="space-y-2">
                {scoreDistributionData.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-semibold text-stone-800">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-stone-900">
                      {item.count} students <span className="text-stone-400 font-normal">({item.pct}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student by name, student ID, or university email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Students ({students.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Pending Field Review
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">MSc Student</th>
                <th className="py-3 px-4">Quiz Scores (M1–M8)</th>
                <th className="py-3 px-4">Field Exercises</th>
                <th className="py-3 px-4">Practical Labs</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStudents.map((student) => {
                const scoresList = Object.values(student.moduleScores) as number[];
                const avgScore = scoresList.length > 0 ? Math.round(scoresList.reduce((a, b) => a + b, 0) / scoresList.length) : 0;
                const labsCompletedCount = Object.values(student.labsCompleted).filter(Boolean).length;

                return (
                  <tr key={student.studentId} className="hover:bg-stone-50/70 transition-colors">
                    {/* Student Profile Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.avatar}
                          alt={student.studentName}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-stone-900 text-xs">
                            {student.studentName}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {student.studentId} • {student.email}
                          </div>
                          {student.notes && (
                            <div className="text-[10px] text-emerald-800 italic mt-0.5 max-w-xs truncate">
                              {student.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Module Quiz Scores */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-stone-900 text-xs mr-1">
                          {avgScore}%
                        </span>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((mod) => {
                            const sc = student.moduleScores[mod];
                            return (
                              <span
                                key={mod}
                                className={`w-6 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                                  sc >= 90
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : sc >= 80
                                    ? 'bg-blue-100 text-blue-800'
                                    : sc !== undefined
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-stone-100 text-stone-400'
                                }`}
                                title={`Module ${mod} Quiz: ${sc || 'Not taken'}%`}
                              >
                                {sc !== undefined ? sc : '-'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </td>

                    {/* Field Exercise Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((mod) => {
                          const status = student.fieldExerciseStatus[mod] || 'Not Started';
                          return (
                            <button
                              key={mod}
                              onClick={() => handleToggleFieldStatus(student.studentId, mod)}
                              className={`w-6 h-5 rounded flex items-center justify-center text-[9px] font-bold transition-all cursor-pointer ${
                                status === 'Approved'
                                  ? 'bg-emerald-700 text-white'
                                  : status === 'Submitted'
                                  ? 'bg-amber-500 text-white animate-pulse'
                                  : status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-stone-100 text-stone-400'
                              }`}
                              title={`M${mod} Field Exercise: ${status} (Click to toggle)`}
                            >
                              M{mod}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    {/* Practical Labs */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-semibold text-stone-800">
                          {labsCompletedCount} / 8
                        </span>
                        <div className="w-16 bg-stone-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-700 h-full rounded-full"
                            style={{ width: `${(labsCompletedCount / 8) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleOpenFeedbackModal(student, 1)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-xs font-medium transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
                        <span>Provide Feedback</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructor Feedback Modal */}
      {selectedStudentForFeedback && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">
                  Academic Assessment Feedback
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudentForFeedback(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-lg">
                <span className="font-bold text-stone-800">
                  Student: {selectedStudentForFeedback.studentName}
                </span>
                <span className="text-stone-500">
                  {selectedStudentForFeedback.studentId}
                </span>
              </div>

              {/* Module Selector for Feedback */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">
                  Select Course Module:
                </label>
                <select
                  value={feedbackModule}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setFeedbackModule(m);
                    setFeedbackText(selectedStudentForFeedback.instructorFeedback[m] || '');
                  }}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                >
                  {COURSE_MODULES.map((m) => (
                    <option key={m.moduleNumber} value={m.moduleNumber}>
                      Module {m.moduleNumber}: {m.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feedback Textarea */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">
                  Faculty Critique &amp; Recommendations:
                </label>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Provide constructive feedback regarding spectral processing, BRDF corrections, or protocol adherence..."
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none text-stone-900"
                ></textarea>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedStudentForFeedback(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFeedback}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 cursor-pointer"
              >
                Save Evaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
