import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import type { AutomatedQuiz } from '../types';
import { MathText } from './MathRenderer';

interface QuizViewProps {
  quiz: AutomatedQuiz;
  moduleNumber: number;
}

export const QuizView: React.FC<QuizViewProps> = ({ quiz, moduleNumber }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset when module changes
  useEffect(() => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  }, [quiz.moduleNumber]);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  // Calculate score
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  let correctCount = 0;

  if (isSubmitted) {
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });
  }

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercentage >= quiz.passingScorePercent;

  return (
    <div className="space-y-6">
      {/* Quiz Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-stone-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
              Module {moduleNumber} Assessment
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Passing Threshold: {quiz.passingScorePercent}%
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            {quiz.title}
          </h2>
        </div>

        {/* Progress / Submission Status */}
        {isSubmitted ? (
          <div className="flex items-center space-x-3 shrink-0">
            <div className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center space-x-2 ${
              passed
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <Award className={`w-4 h-4 ${passed ? 'text-emerald-700' : 'text-rose-700'}`} />
              <span>Score: {scorePercentage}% ({correctCount}/{totalQuestions} Correct) - {passed ? 'PASSED' : 'RETRY NEEDED'}</span>
            </div>
            <button
              onClick={handleRetake}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        ) : (
          <div className="text-xs text-stone-500 shrink-0">
            {answeredCount} of {totalQuestions} Questions Answered
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-5">
        {quiz.questions.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = isSubmitted && selectedOption === q.correctOptionIndex;
          const isWrong = isSubmitted && isAnswered && !isCorrect;

          return (
            <div
              key={q.id}
              className={`p-6 bg-white rounded-xl border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-300 shadow-xs'
                    : 'border-rose-300 shadow-xs'
                  : 'border-stone-200 shadow-xs hover:border-stone-300'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start space-x-3 mb-4">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  isSubmitted
                    ? isCorrect
                      ? 'bg-emerald-700 text-white'
                      : 'bg-rose-700 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}>
                  {qIndex + 1}
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-stone-900 leading-snug">
                    <MathText text={q.question} />
                  </h4>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 pl-9">
                {q.options.map((optionText, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  const isThisCorrect = isSubmitted && optIdx === q.correctOptionIndex;
                  const isThisIncorrect = isSubmitted && isThisSelected && !isThisCorrect;

                  let optionStyles = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';

                  if (isSubmitted) {
                    if (isThisCorrect) {
                      optionStyles = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold';
                    } else if (isThisIncorrect) {
                      optionStyles = 'bg-rose-50 border-rose-400 text-rose-950';
                    } else {
                      optionStyles = 'bg-stone-50/50 border-stone-200 text-stone-400';
                    }
                  } else if (isThisSelected) {
                    optionStyles = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3 rounded-lg border text-xs flex items-start space-x-3 transition-all cursor-pointer ${optionStyles}`}
                    >
                      <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">
                        <MathText text={optionText} />
                      </span>
                      {isSubmitted && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isSubmitted && isThisIncorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* In-depth Explanation Card (Shown After Submission) */}
              {isSubmitted && (
                <div className="mt-4 pt-4 border-t border-stone-100 pl-9 space-y-2">
                  <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1.5">
                    <div className="font-bold text-stone-800 flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Academic Scientific Explanation:</span>
                    </div>
                    <div className="text-stone-700 leading-relaxed">
                      <MathText text={q.explanation} />
                    </div>
                    <div className="text-[11px] text-stone-500 font-serif italic pt-1 border-t border-stone-200">
                      <strong>Source Citation:</strong> {q.academicCitation}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission Action Bar */}
      {!isSubmitted && (
        <div className="p-5 bg-white rounded-xl border border-stone-200 flex items-center justify-between shadow-sm">
          <div className="text-xs text-stone-600">
            {answeredCount === totalQuestions ? (
              <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>All {totalQuestions} questions answered. Ready for assessment.</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-amber-700 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>Please complete all questions ({totalQuestions - answeredCount} remaining).</span>
              </span>
            )}
          </div>

          <button
            onClick={() => setIsSubmitted(true)}
            disabled={answeredCount < totalQuestions}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors disabled:opacity-40 cursor-pointer"
          >
            Submit &amp; Grade Assessment
          </button>
        </div>
      )}
    </div>
  );
};
