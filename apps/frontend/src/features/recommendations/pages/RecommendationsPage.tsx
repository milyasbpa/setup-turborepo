import React from 'react';
import AdaptiveLearningPath from '../components/AdaptiveLearningPath';

const RecommendationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdaptiveLearningPath userId={1} limit={6} />
    </div>
  );
};

export default RecommendationsPage;
