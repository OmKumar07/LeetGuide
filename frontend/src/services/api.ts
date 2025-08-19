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
  ranking: number;
  contributionPoints: number;
  submissionCalendar: Array<{
    date: string;
    count: number;
  }>;
  skillStats: Array<{
    name: string;
    solved: number;
  }>;
  profile?: {
    realName?: string;
    avatar?: string;
    aboutMe?: string;
    school?: string;
    company?: string;
    country?: string;
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

  // Get recommendations
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
    ranking: 125432,
    contributionPoints: 1840,
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
    profile: {
      realName: username,
      company: "Tech Corp",
      country: "United States",
    },
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
      reason: "Improve your sliding window technique",
      similarity: 0.85,
      url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      acRate: 33.8,
      likes: 32451,
    },
    {
      title: "Binary Tree Inorder Traversal",
      slug: "binary-tree-inorder-traversal",
      difficulty: "Easy",
      topicTags: ["Stack", "Tree", "Depth-First Search"],
      reason: "Strengthen tree traversal fundamentals",
      similarity: 0.78,
      url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
      acRate: 74.4,
      likes: 11234,
    },
    {
      title: "Word Ladder",
      slug: "word-ladder",
      difficulty: "Hard",
      topicTags: ["Hash Table", "String", "Breadth-First Search"],
      reason: "Challenge yourself with graph algorithms",
      similarity: 0.72,
      url: "https://leetcode.com/problems/word-ladder/",
      acRate: 23.1,
      likes: 8765,
    },
  ];
}

export default api;
