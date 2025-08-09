import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Badge } from '@/core/components';

/**
 * Lesson Detail Container Props
 */
interface LessonDetailContainerProps {
  className?: string;
}

/**
 * Lesson Detail Container
 * Renders lesson details with interactive problems and submission
 * Simplified version focused on UI structure
 */
export const LessonDetailContainer: React.FC<LessonDetailContainerProps> = ({
  className = '',
}) => {
  const navigate = useNavigate();
  const [isLoading] = useState(true); // Placeholder for actual loading state
  
  if (isLoading) {
    return (
      <div className={`max-w-4xl mx-auto ${className}`}>
        <nav className="mb-4">
          <Link 
            to="/lessons" 
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Lessons
          </Link>
        </nav>
        
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 mb-6 shadow">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // This would be replaced with actual lesson data and functionality
  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <nav className="mb-4">
        <Link 
          to="/lessons" 
          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Lessons
        </Link>
      </nav>

      <div className="flex items-start justify-between mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lesson Loading...
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            This component will be fully implemented when lesson detail functionality is added.
          </p>
        </div>
        <Badge variant="warning" size="md">
          Demo
        </Badge>
      </div>

      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
        <Button onClick={() => navigate('/lessons')}>
          Back to Lessons
        </Button>
      </div>
    </div>
  );
};
