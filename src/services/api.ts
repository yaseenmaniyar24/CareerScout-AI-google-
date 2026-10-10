import {
  UserProfile,
  Opportunity,
  DetailedAnalysis,
  Roadmap,
  CareerReport,
  SearchResponse,
} from '../types';

export class ApiService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMsg = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson.error || errorJson.detail) {
          errorMsg = errorJson.error || errorJson.detail;
        }
      } catch {
        // ignore parse error
      }
      throw new Error(errorMsg);
    }

    return response.json();
  }

  static async checkHealth(): Promise<{
    status: string;
    serpapi_configured: boolean;
    gemini_configured: boolean;
    demo_mode: boolean;
  }> {
    return this.request('/api/health');
  }

  static async analyzeProfile(profile: UserProfile): Promise<any> {
    return this.request('/api/profile/analyze', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  static async searchJobs(
    profile: UserProfile,
    customRole?: string,
    customLocation?: string,
    forceDemo: boolean = false
  ): Promise<SearchResponse> {
    return this.request('/api/jobs/search', {
      method: 'POST',
      body: JSON.stringify({
        profile,
        custom_role: customRole,
        custom_location: customLocation,
        force_demo: forceDemo,
      }),
    });
  }

  static async analyzeJob(
    profile: UserProfile,
    opportunity: Opportunity
  ): Promise<DetailedAnalysis> {
    return this.request('/api/jobs/analyze', {
      method: 'POST',
      body: JSON.stringify({
        profile,
        opportunity,
      }),
    });
  }

  static async generateRoadmap(
    profile: UserProfile,
    opportunity?: Opportunity,
    targetRole?: string
  ): Promise<Roadmap> {
    return this.request('/api/roadmap/generate', {
      method: 'POST',
      body: JSON.stringify({
        profile,
        opportunity,
        target_role: targetRole,
      }),
    });
  }

  static async generateCareerReport(
    profile: UserProfile,
    selectedOpportunities?: Opportunity[]
  ): Promise<CareerReport> {
    return this.request('/api/career/report', {
      method: 'POST',
      body: JSON.stringify({
        profile,
        selected_opportunities: selectedOpportunities,
      }),
    });
  }

  static async getDemoData(): Promise<any> {
    return this.request('/api/demo');
  }
}
