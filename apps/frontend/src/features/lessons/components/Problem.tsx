import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';
import type { Problem as ProblemType } from '@/core/api';
import { Card } from '@/core/components';

/**
 * Problem Component Props
 */
interface ProblemComponentProps {
  problem: ProblemType;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  showResult?: boolean;
  isCorrect?: boolean;
  correctAnswer?: string;
  className?: string;
}

/**
 * Problem Component
 * Interactive math problem with multiple choice or input
 */
export const ProblemItem: React.FC<ProblemComponentProps> = ({
  problem,
  value,
  onChange,
  disabled = false,
  showResult = false,
  isCorrect,
  correctAnswer,
  className = '',
}) => {
  const { t } = useTranslation('lessons');
  const [localValue, setLocalValue] = useState(value);

  const handleInputChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getResultColor = () => {
    if (!showResult) return '';
    return isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
  };

  return (
    <Card className={`${className} ${getResultColor()}`}>
      {/* Problem Question */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('lesson.problem', { number: problem.id, total: '{{total}}' })}
        </h3>
        <p className="text-gray-700 text-base leading-relaxed">
          {problem.question}
        </p>
      </div>

      {/* Multiple Choice Options */}
      {problem.problemType === 'multiple_choice' && problem.options && (
        <div className="space-y-2">
          {problem.options.map((option) => {
            const isSelected = localValue === option.optionText;
            const isDisabled = disabled || showResult;
            
            let optionClasses = 'w-full p-3 text-left border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
            
            if (showResult) {
              if (option.optionText === correctAnswer) {
                optionClasses += ' bg-green-100 border-green-500 text-green-800';
              } else if (isSelected && !isCorrect) {
                optionClasses += ' bg-red-100 border-red-500 text-red-800';
              } else {
                optionClasses += ' bg-gray-50 border-gray-300 text-gray-600';
              }
            } else if (isSelected) {
              optionClasses += ' bg-blue-50 border-blue-500 text-blue-800';
            } else if (isDisabled) {
              optionClasses += ' bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed';
            } else {
              optionClasses += ' bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
            }

            return (
              <button
                key={option.id}
                type="button"
                className={optionClasses}
                onClick={() => !isDisabled && handleInputChange(option.optionText)}
                disabled={isDisabled}
              >
                <div className="flex items-center">
                  <div className={`
                    w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0
                    ${isSelected 
                      ? (showResult && isCorrect 
                          ? 'border-green-500 bg-green-500' 
                          : showResult && !isCorrect 
                            ? 'border-red-500 bg-red-500'
                            : 'border-blue-500 bg-blue-500'
                        )
                      : 'border-gray-300'
                    }
                  `}>
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full m-auto" />
                    )}
                  </div>
                  <span className="font-medium">{option.optionText}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Input Field */}
      {problem.problemType === 'input' && (
        <div>
          <label htmlFor={`problem-${problem.id}`} className="block text-sm font-medium text-gray-700 mb-2">
            {t('lesson.enterAnswer')}
          </label>
          <input
            id={`problem-${problem.id}`}
            type="text"
            value={localValue}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={disabled || showResult}
            placeholder={t('lesson.enterAnswer')}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${showResult 
                ? isCorrect 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50'
                : 'border-gray-300'
              }
              ${disabled || showResult ? 'cursor-not-allowed' : ''}
            `}
          />
        </div>
      )}

      {/* Result Display */}
      {showResult && (
        <div className="mt-4 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            {isCorrect ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">{t('lesson.correct')}</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">{t('lesson.incorrect')}</span>
              </>
            )}
          </div>
          {!isCorrect && correctAnswer && (
            <p className="text-sm text-gray-600 mt-1">
              {t('lesson.correctAnswer', { answer: correctAnswer })}
            </p>
          )}
        </div>
      )}
    </Card>
  );
};
