// services/metricsService.js
// import api from './api';
const api = "http://localhost:5000/api/metrics";

export const metricsService = {
  // Cover letter metrics
  getCoverLetterStats: async () => {
    try {
      const response = await api.get('/cover-letters');
      return response.data;
    } catch (error) {
      console.error('Error fetching cover letter stats:', error);
      return { count: 0, trend: 0 };
    }
  },

  // Job application metrics
  getApplicationStats: async () => {
    try {
      const response = await api.get('/applications');
      return response.data;
    } catch (error) {
      console.error('Error fetching application stats:', error);
      return { count: 0, trend: 0 };
    }
  },

  // Recent activities
  getRecentActivities: async (limit = 5) => {
    try {
      const response = await api.get(`activities?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  },

  // Profile completeness calculation
  calculateCompleteness: (profile) => {
    if (!profile) return 0;
    
    let score = 0;
    const maxScore = 100;
    
    // Basic info (name, email)
    if (profile.name) score += 10;
    if (profile.email) score += 10;
    
    // Resume
    if (profile.resumePath) score += 20;
    
    // Job preferences
    if (profile.jobPreferences) {
      if (profile.jobPreferences.title) score += 10;
      if (profile.jobPreferences.skills?.length > 0) score += 10;
    }
    
    // Experience
    if (profile.experience?.length > 0) score += 15;
    
    // Projects
    if (profile.projects?.length > 0) score += 15;
    
    // Education
    if (profile.education?.length > 0) score += 10;
    
    return Math.min(score, maxScore);
  }
};