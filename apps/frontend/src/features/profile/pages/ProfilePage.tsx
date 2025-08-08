import React from 'react';
import { ProfileFragment } from '../fragments/ProfileFragment';
import { ProfileContainer } from '../containers/ProfileContainer';

/**
 * Profile Page
 * Main page for displaying user profile, stats, and achievements
 */
const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileFragment>
          <ProfileContainer />
        </ProfileFragment>
      </div>
    </div>
  );
};

export default ProfilePage;
