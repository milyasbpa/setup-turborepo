import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Sparkles } from 'lucide-react';
import { useLocalizedRoutes } from '@/core/i18n';

/**
 * Recommendations Banner Component
 * Appears on lessons page to promote the recommendations feature
 */
export const RecommendationsBanner: React.FC = () => {
  const { routes } = useLocalizedRoutes();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 right-2 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-12 h-12 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 border border-white rounded-full"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Get Personalized Recommendations</h3>
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          
          <p className="text-blue-100 text-sm mb-4 max-w-2xl">
            Discover lessons tailored to your learning style and progress. Our AI analyzes your performance 
            to suggest the perfect next steps in your math journey.
          </p>

          <div className="flex items-center gap-4 text-xs text-blue-200">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Performance Analysis
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Adaptive Learning
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              Personal Goals
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 ml-6">
          <Link
            to={routes.recommendations}
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold 
                     hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Target className="w-5 h-5" />
            View Recommendations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsBanner;
