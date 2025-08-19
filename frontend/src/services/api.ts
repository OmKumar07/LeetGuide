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
    try {
      const response = await api.get(`/api/leetcode/user/${username}`);
      return response.data;
    } catch {
      // For development, return mock data
      console.warn("Using mock data for development");
      return getMockUserStats(username);
    }
  },

  // Compare two users
  async compareUsers(
    username1: string,
    username2: string
  ): Promise<ComparisonData> {
    try {
      const response = await api.get(
        `/api/leetcode/compare/${username1}/${username2}`
      );
      return response.data;
    } catch {
      console.warn("Using mock data for development");
      return getMockComparisonData(username1, username2);
    }
  },

  // Get learning path analysis
  async getLearningPath(username: string): Promise<LearningPath> {
    try {
      const response = await api.post("/api/learning-path", { username });
      return response.data;
    } catch {
      console.warn("Using mock learning path data");
      return getMockLearningPath();
    }
  },
  async getRecommendations(
    username: string,
    topic?: string,
    difficulty?: string
  ): Promise<Recommendation[]> {
    try {
      const response = await api.post("/api/recommendations", {
        username,
        topic,
        difficulty,
      });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.warn("Using mock data for development");
      return getMockRecommendations();
    }
  },
};

// Mock data for development
function getMockUserStats(username: string): UserStats {
  return {
    username,
    totalSolved: 342,
    easySolved: 145,
    mediumSolved: 156,
    hardSolved: 41,
    acceptanceRate: "68.5",
    overallAcceptanceRate: "65.2",
    totalAttempts: 525,
    ranking: 125432,
    contributionPoints: 1840,

    streakData: {
      currentStreak: 5,
      longestStreak: 23,
      totalActiveDays: 127,
      averageSubmissionsPerDay: "2.7",
    },

    languageStats: [
      { languageName: "Python", problemsSolved: 156 },
      { languageName: "Java", problemsSolved: 89 },
      { languageName: "C++", problemsSolved: 67 },
      { languageName: "JavaScript", problemsSolved: 30 },
    ],

    recentSubmissions: [
      {
        title: "Two Sum",
        titleSlug: "two-sum",
        timestamp: "1692384000",
        status: "Accepted",
        language: "Python",
      },
      {
        title: "Valid Parentheses",
        titleSlug: "valid-parentheses",
        timestamp: "1692297600",
        status: "Accepted",
        language: "Java",
      },
    ],

    badges: [
      {
        id: "1",
        displayName: "50 Days Badge",
        icon: "🏆",
        creationDate: "2024-01-15",
      },
      {
        id: "2",
        displayName: "100 Problems",
        icon: "💯",
        creationDate: "2024-02-20",
      },
    ],

    submissionCalendar: [
      { date: "2024-01-01", count: 3 },
      { date: "2024-01-02", count: 1 },
      { date: "2024-01-03", count: 2 },
      { date: "2024-01-04", count: 0 },
      { date: "2024-01-05", count: 4 },
    ],

    skillStats: [
      { name: "Array", solved: 89 },
      { name: "Dynamic Programming", solved: 34 },
      { name: "Tree", solved: 28 },
      { name: "Hash Table", solved: 45 },
    ],

    contestHistory: [
      {
        attended: true,
        trendDirection: "UP",
        problemsSolved: 3,
        totalProblems: 4,
        finishTimeInSeconds: 5400,
        rating: 1650,
        ranking: 1250,
        contest: { title: "Weekly Contest 350", startTime: "2024-01-14" },
      },
    ],

    contestRanking: {
      attendedContestsCount: 15,
      rating: 1650,
      globalRanking: 45230,
      totalParticipants: 120000,
      topPercentage: 37.7,
      badge: { name: "Specialist" },
    },

    profile: {
      realName: username,
      company: "Tech Corp",
      country: "United States",
      websites: ["https://github.com/user"],
      skillTags: ["Python", "Algorithms", "Data Structures"],
      starRating: 4,
      postViewCount: 1250,
      reputationChange: 50,
    },
  };
}

function getMockLearningPath(): LearningPath {
  return {
    currentPath: {
      phase: "Skill Expansion",
      focus: "Medium problems with varied topics",
      recommendedDaily: 1,
      targetSkills: ["Dynamic Programming", "Tree", "Graph", "Greedy"],
      description:
        "Expand your problem-solving toolkit with intermediate concepts",
    },
    weakAreas: ["Dynamic Programming", "Graph"],
    totalSolved: 342,
    progressAnalysis: {
      beginnerPhase: true,
      intermediatePhase: true,
      advancedPhase: false,
      currentPhase: "Intermediate",
    },
    solvedCount: 342,
    recommendations: getMockRecommendations(),
  };
}

function getMockComparisonData(
  username1: string,
  username2: string
): ComparisonData {
  return {
    user1: getMockUserStats(username1),
    user2: getMockUserStats(username2),
    comparison: {
      totalSolvedDiff: 47,
      acceptanceRateDiff: 5.2,
      rankingDiff: -12340,
    },
  };
}

function getMockRecommendations(): Recommendation[] {
  return [
    {
      title: "Longest Substring Without Repeating Characters",
      slug: "longest-substring-without-repeating-characters",
      difficulty: "Medium",
      topicTags: ["Hash Table", "String", "Sliding Window"],
      reason:
        "🎯 Targets your weak area in Hash Table! This medium problem (33.8% acceptance) will help strengthen these skills.",
      similarity: 0.85,
      url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      acRate: 33.8,
      likes: 32451,
      estimatedTime: 30,
      priority: "High",
    },
    {
      title: "Binary Tree Inorder Traversal",
      slug: "binary-tree-inorder-traversal",
      difficulty: "Easy",
      topicTags: ["Stack", "Tree", "Depth-First Search"],
      reason:
        "✅ High confidence problem! 74.4% acceptance rate in Tree - great for building momentum.",
      similarity: 0.78,
      url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
      acRate: 74.4,
      likes: 11234,
      estimatedTime: 12,
      priority: "Medium",
    },
    {
      title: "Word Ladder",
      slug: "word-ladder",
      difficulty: "Hard",
      topicTags: ["Hash Table", "String", "Breadth-First Search"],
      reason:
        "🔥 Elite challenge! Only 23.1% solve this Graph problem - excellent for skill mastery.",
      similarity: 0.72,
      url: "https://leetcode.com/problems/word-ladder/",
      acRate: 23.1,
      likes: 8765,
      estimatedTime: 90,
      priority: "Low",
    },
  ];
}

export default api;
