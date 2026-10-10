import React from 'react';
import { Hero } from '../components/Hero';
import { ProfileForm } from '../components/ProfileForm';
import { UserProfile } from '../types';

interface HomeProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  onSearch: () => void;
  onExploreDemo: () => void;
  isLoading: boolean;
}

export const Home: React.FC<HomeProps> = ({
  profile,
  setProfile,
  onSearch,
  onExploreDemo,
  isLoading,
}) => {
  const profileFormRef = React.useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    profileFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-12">
      <Hero onStartSearch={scrollToForm} onExploreDemo={onExploreDemo} />

      <div ref={profileFormRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileForm
          profile={profile}
          setProfile={setProfile}
          onSubmit={onSearch}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
