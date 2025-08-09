import React from 'react';
import { RecommendationsFragment } from '../fragments/RecommendationsFragment';
import { RecommendationsContainer } from '../containers/RecommendationsContainer';

/**
 * Recommendations Page
 * Main page for displaying adaptive learning path and recommendations
 */
const RecommendationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecommendationsFragment userId={1} limit={6}>
          <RecommendationsContainer />
        </RecommendationsFragment>
      </div>
    </div>
  );
};

export default RecommendationsPage;
