import React from 'react';
import type { Problem } from '@/core/api';
import { ProblemItem } from './Problem';

/**
 * Problem List Props
 */
interface ProblemListProps {
  problems: Problem[];
  answers: Record<number, string>;
  onAnswerChange: (problemId: number, answer: string) => void;
  disabled?: boolean;
  showResults?: boolean;
  results?: Record<number, { isCorrect: boolean; correctAnswer: string }>;
  className?: string;
}

/**
 * Problem List Component
 * Renders a list of problems with consistent spacing
 */
export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  answers,
  onAnswerChange,
  disabled = false,
  showResults = false,
  results = {},
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {problems.map((problem) => (
        <ProblemItem
          key={problem.id}
          problem={problem}
          value={answers[problem.id] || ''}
          onChange={(value) => onAnswerChange(problem.id, value)}
          disabled={disabled}
          showResult={showResults}
          isCorrect={results[problem.id]?.isCorrect}
          correctAnswer={results[problem.id]?.correctAnswer}
        />
      ))}
    </div>
  );
};
