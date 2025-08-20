import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface UserStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: string;
  overallAcceptanceRate: string;
  totalAttempts: number;
  ranking: number;
  contributionPoints: number;

  // Enhanced streak and activity data
  streakData: {
    currentStreak: number;
    longestStreak: number;
    totalActiveDays: number;
    averageSubmissionsPerDay: string;
  };

  // Language proficiency
  languageStats: Array<{
    languageName: string;
    problemsSolved: number;
  }>;

  // Recent activity
  recentSubmissions: Array<{
    title: string;
    titleSlug: string;
    timestamp: string;
    status: string;
    language: string;
  }>;

  // Badges and achievements
  badges: Array<{
    id: string;
    displayName: string;
    icon: string;
    creationDate: string;
  }>;

  submissionCalendar: Array<{
    date: string;
    count: number;
  }>;

  skillStats: Array<{
    name: string;
    solved: number;
  }>;

  // Contest performance
  contestHistory: Array<{
    attended: boolean;
    trendDirection: string;
    problemsSolved: number;
    totalProblems: number;
    finishTimeInSeconds: number;
    rating: number;
    ranking: number;
    contest: {
      title: string;
      startTime: string;
    };
  }>;

  contestRanking: {
    attendedContestsCount: number;
    rating: number;
    globalRanking: number;
    totalParticipants: number;
    topPercentage: number;
    badge?: {
      name: string;
    };
  } | null;

  profile?: {
    realName?: string;
    avatar?: string;
    aboutMe?: string;
    school?: string;
    company?: string;
    country?: string;
    websites?: string[];
    skillTags?: string[];
    starRating?: number;
    postViewCount?: number;
    reputationChange?: number;
  };
}

export interface ComparisonData {
  user1: UserStats;
  user2: UserStats;
  comparison: {
    totalSolvedDiff: number;
    acceptanceRateDiff: number;
    rankingDiff: number;
  };
}

export interface Recommendation {
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topicTags: string[];
  reason: string;
  similarity: number;
  url: string;
  acRate?: number;
  likes?: number;
  dislikes?: number;
  estimatedTime?: number;
  priority?: "High" | "Medium" | "Low";
}

export interface LearningPath {
  currentPath: {
    phase: string;
    focus: string;
    recommendedDaily: number;
    targetSkills: string[];
    description: string;
  };
  weakAreas: string[];
  totalSolved: number;
  progressAnalysis: {
    beginnerPhase: boolean;
    intermediatePhase: boolean;
    advancedPhase: boolean;
    currentPhase: string;
  };
  solvedCount: number;
  recommendations: Recommendation[];
}

// LeetCode API service functions
export const leetcodeService = {
  // Get user statistics
  async getUserStats(username: string): Promise<UserStats> {
    const response = await api.get(`/api/leetcode/user/${username}`);
    return response.data;
  },

  // Compare two users
  async compareUsers(
    username1: string,
    username2: string
  ): Promise<ComparisonData> {
    const response = await api.get(
      `/api/leetcode/compare/${username1}/${username2}`
    );
    return response.data;
  },

  // Get learning path analysis
  async getLearningPath(username: string): Promise<LearningPath> {
    const response = await api.post("/api/learning-path", { username });
    return response.data;
  },
  async getRecommendations(
    username: string,
    topic?: string,
    difficulty?: string
  ): Promise<Recommendation[]> {
    const response = await api.post("/api/recommendations", {
      username,
      topic,
      difficulty,
    });
    return response.data;
  },
};

export default api;
