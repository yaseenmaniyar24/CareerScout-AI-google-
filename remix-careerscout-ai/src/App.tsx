/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { OpportunityDetails } from './pages/OpportunityDetails';
import { RoadmapPage } from './pages/RoadmapPage';
import { CareerReportPage } from './pages/CareerReportPage';
import { ApiService } from './services/api';
import {
  UserProfile,
  Opportunity,
  DetailedAnalysis,
  Roadmap,
  CareerReport,
} from './types';

// Empty initial candidate profile so user can enter their own details
const INITIAL_PROFILE: UserProfile = {
  name: '',
  education: '',
  college: '',
  degree: '',
  branch: '',
  year: '3rd Year',
  graduation_year: '',
  preferred_role: '',
  preferred_location: '',
  preferred_work_mode: 'Hybrid',
  experience_level: 'Student',
  skills: [],
  programming_languages: [],
  frameworks: [],
  tools: [],
  projects: '',
  resume_text: '',
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'search' | 'dashboard' | 'opportunity' | 'roadmap' | 'report'
  >('search');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<DetailedAnalysis | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [careerReport, setCareerReport] = useState<CareerReport | null>(null);

  const [stats, setStats] = useState({
    total_opportunities: 0,
    strong_matches: 0,
    average_match: 0,
    critical_skill_gaps: 0,
  });

  const [queriesExecuted, setQueriesExecuted] = useState<string[]>([]);
  const [executionSource, setExecutionSource] = useState<'serpapi_live' | 'demo_mode'>('serpapi_live');
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('careerscout_demo_mode');
    return saved !== null ? saved === 'true' : false;
  });
  const userToggledDemoRef = React.useRef<boolean>(
    localStorage.getItem('careerscout_demo_mode') !== null
  );

  const setIsDemoMode = (val: boolean) => {
    userToggledDemoRef.current = true;
    localStorage.setItem('careerscout_demo_mode', String(val));
    setIsDemoModeState(val);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<{
    serpapi_configured: boolean;
    gemini_configured: boolean;
  } | null>(null);

  // Check health on boot
  useEffect(() => {
    ApiService.checkHealth()
      .then((health) => {
        setSystemStatus({
          serpapi_configured: health.serpapi_configured,
          gemini_configured: health.gemini_configured,
        });
        if (!health.serpapi_configured && !userToggledDemoRef.current) {
          setIsDemoModeState(true);
        }
      })
      .catch((err) => {
        console.warn('Backend health check error:', err);
      });
  }, []);

  const isProfileReady = Boolean(
    profile.name.trim() &&
      profile.preferred_role.trim() &&
      (profile.skills.length > 0 ||
        profile.programming_languages.length > 0 ||
        profile.frameworks.length > 0 ||
        profile.tools.length > 0)
  );

  // Main search function
  const handleSearch = async (customRole?: string, customLocation?: string, forceDemo: boolean = isDemoMode) => {
    const roleToSearch = (customRole ?? profile.preferred_role).trim();
    if (!roleToSearch && !forceDemo) {
      setCurrentTab('search');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await ApiService.searchJobs(
        profile,
        customRole,
        customLocation,
        forceDemo
      );

      setOpportunities(response.opportunities);
      setStats(response.stats);
      setQueriesExecuted(response.queries_executed);
      setExecutionSource(forceDemo ? 'demo_mode' : response.execution_source);

      setCurrentTab('dashboard');
    } catch (err: any) {
      console.error('Search error:', err);
      setErrorMessage(
        err.message ||
          'Failed to retrieve live opportunities. You can switch to Demo Mode to explore curated Indian tech roles.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Instant explore demo trigger
  const handleExploreDemo = () => {
    setIsDemoMode(true);
    handleSearch(undefined, undefined, true);
  };

  // View deep analysis for a specific job
  const handleViewAnalysis = async (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setCurrentTab('opportunity');
    setIsLoadingAnalysis(true);

    try {
      const analysis = await ApiService.analyzeJob(profile, opp);
      setDetailedAnalysis(analysis);
    } catch (err) {
      console.warn('Deep analysis error, falling back to cached details:', err);
      // Fallback analysis using card data
      setDetailedAnalysis({
        opportunity_id: opp.id,
        title: opp.title,
        company: opp.company,
        match_score: opp.match_score,
        matched_skills: opp.matched_skills,
        partial_skills: opp.partial_skills,
        missing_skills: opp.missing_skills,
        candidate_strengths: [
          `Strong background in ${profile.skills[0] || 'core engineering'} applicable to ${opp.title}`,
          `Academic degree in ${profile.branch} from ${profile.college || 'university'}`,
          `Practical project experience in technical domain`,
        ],
        missing_requirements: opp.missing_skills.length > 0
          ? opp.missing_skills.slice(0, 3).map((s) => `Hands-on implementation experience in ${s}`)
          : [
              `Production architecture and API integration for ${opp.title}`,
              `Performance optimization and edge-case error handling`,
              `Automated unit and integration testing coverage`,
            ],
        recommendation: opp.recommendation,
        role_insights: `${opp.title} at ${opp.company} emphasizes reliable implementation and strong problem-solving fundamentals.`,
        interview_focus_areas: [
          `Core ${opp.title} technical concepts and practical workflows`,
          'System architecture, data flow, and error resilience',
          'Algorithmic problem solving and clean code practices',
        ],
        skill_breakdown: opp.matched_skills.map((s) => ({
          skill: s,
          user_level: 90,
          required_level: 80,
          status: 'MATCHED' as const,
          importance: 'CRITICAL' as const,
        })),
        scoring_explanation: {
          skill_factor: `${opp.skill_score}% - Verified competency match`,
          role_factor: `${opp.role_score}% - Role relevance to target career goal`,
          experience_factor: `${opp.experience_score}% - Level match for student/grad`,
          tech_factor: `${opp.technology_score}% - Tech stack synergy`,
          location_factor: `${opp.location_score}% - Location compatibility`,
          quality_factor: `${opp.job_quality_score}% - Listing verified link completeness`,
        },
      });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Generate 30-day roadmap
  const handleGenerateRoadmap = async (targetOpp?: Opportunity) => {
    const opp = targetOpp || undefined;
    const targetRole = (opp?.title || profile.preferred_role || selectedOpportunity?.title || '').trim();
    if (!targetRole) {
      setCurrentTab('roadmap');
      return;
    }

    setIsLoading(true);
    setCurrentTab('roadmap');

    try {
      const rm = await ApiService.generateRoadmap(
        profile,
        opp,
        targetRole
      );
      setRoadmap(rm);
    } catch (err: any) {
      console.error('Roadmap error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Career Report
  const handleGenerateReport = async () => {
    if (!isProfileReady) {
      setCurrentTab('report');
      return;
    }

    setIsLoadingReport(true);
    try {
      const rep = await ApiService.generateCareerReport(
        profile,
        opportunities.slice(0, 5)
      );
      setCareerReport(rep);
    } catch (err: any) {
      console.error('Report error:', err);
    } finally {
      setIsLoadingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'dashboard' && opportunities.length === 0 && isProfileReady) {
            handleSearch();
          } else if (
            tab === 'roadmap' &&
            profile.preferred_role.trim() &&
            (!roadmap ||
              roadmap.target_role.toLowerCase().trim() !==
                profile.preferred_role.toLowerCase().trim())
          ) {
            handleGenerateRoadmap();
          } else if (tab === 'report' && !careerReport && isProfileReady) {
            handleGenerateReport();
            setCurrentTab('report');
          } else {
            setCurrentTab(tab);
          }
        }}
        isDemoMode={isDemoMode}
        setIsDemoMode={(val) => {
          setIsDemoMode(val);
          if (currentTab === 'dashboard' && (opportunities.length > 0 || isProfileReady)) {
            handleSearch(undefined, undefined, val);
          }
        }}
        systemStatus={systemStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full py-6">
        {isLoading && <LoadingState />}

        {errorMessage && !isLoading && (
          <ErrorState
            message={errorMessage}
            onRetry={() => handleSearch()}
            onSwitchToDemo={handleExploreDemo}
          />
        )}

        {!isLoading && !errorMessage && (
          <>
            {currentTab === 'search' && (
              <Home
                profile={profile}
                setProfile={(updatedProfile) => {
                  if (updatedProfile.preferred_role !== profile.preferred_role) {
                    setSelectedOpportunity(null);
                  }
                  setProfile(updatedProfile);
                  setCareerReport(null);
                  setRoadmap(null);
                }}
                onSearch={() => handleSearch()}
                onExploreDemo={handleExploreDemo}
                isLoading={isLoading}
              />
            )}

            {currentTab === 'dashboard' && (
              <Dashboard
                opportunities={opportunities}
                stats={stats}
                executionSource={executionSource}
                queriesExecuted={queriesExecuted}
                profile={profile}
                onSearch={(r, l) => handleSearch(r, l)}
                onViewAnalysis={handleViewAnalysis}
                onGenerateRoadmap={(opp) => handleGenerateRoadmap(opp)}
                onGoToProfile={() => setCurrentTab('search')}
                isLoading={isLoading}
              />
            )}

            {currentTab === 'opportunity' && selectedOpportunity && (
              <OpportunityDetails
                opportunity={selectedOpportunity}
                analysis={detailedAnalysis}
                profile={profile}
                onBack={() => setCurrentTab('dashboard')}
                onGenerateRoadmap={(opp) => handleGenerateRoadmap(opp)}
                isLoadingAnalysis={isLoadingAnalysis}
              />
            )}

            {currentTab === 'roadmap' && (
              <RoadmapPage
                roadmap={roadmap}
                profile={profile}
                selectedOpportunity={selectedOpportunity}
                onGenerateRoadmap={() => handleGenerateRoadmap()}
                onGoToProfile={() => setCurrentTab('search')}
                isLoading={isLoading}
              />
            )}

            {currentTab === 'report' && (
              <CareerReportPage
                report={careerReport}
                profile={profile}
                isProfileReady={isProfileReady}
                onGenerateReport={handleGenerateReport}
                onGoToProfile={() => setCurrentTab('search')}
                isLoading={isLoadingReport}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
