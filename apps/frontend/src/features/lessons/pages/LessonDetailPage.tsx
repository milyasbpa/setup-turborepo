import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '@/core/i18n';
import { LessonDetailFragment } from '../fragments/LessonDetailFragment';
import { LessonDetailContainer } from '../containers/LessonDetailContainer';
import { LessonsDetailProvider } from '../context/LessonsDetailContext';

/**
 * Lesson Detail Page
 * Page for displaying a specific lesson with interactive problems
 */
const LessonDetailPage: React.FC = () => {
  const { t } = useTranslation('lessons');
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('error.lessonNotFoundTitle')}</h1>
          <p className="text-gray-600">{t('error.lessonNotFoundMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <LessonsDetailProvider lessonId={id}>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LessonDetailFragment lessonId={id}>
            <LessonDetailContainer />
          </LessonDetailFragment>
        </div>
      </div>
    </LessonsDetailProvider>
  );
};

export default LessonDetailPage;
