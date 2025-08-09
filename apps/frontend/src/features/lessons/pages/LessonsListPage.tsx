import React from 'react';
import { LessonsListFragment } from '../fragments/LessonsListFragment';
import { LessonsListContainer } from '../containers/LessonsListContainer';
import { RecommendationsBanner } from '../components/RecommendationsBanner';

/**
 * Lessons List Page
 * Main page for displaying all available math lessons
 */
const LessonsListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recommendations Banner */}
        <RecommendationsBanner />
        
        <LessonsListFragment>
          <LessonsListContainer />
        </LessonsListFragment>
      </div>
    </div>
  );
};

export default LessonsListPage;
