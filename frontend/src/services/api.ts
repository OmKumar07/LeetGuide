import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export interface UserStats {
  username: string
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  acceptanceRate: number
  ranking: number
  contributionPoints: number
  reputation: number
  submissionCalendar: Record<string, number>
  recentSubmissions: Array<{
    title: string
    titleSlug: string
    timestamp: string
    statusDisplay: string
    lang: string
  }>
  problemsSolvedBeatsStats: Array<{
    difficulty: string
    percentage: number
  }>
  skillStats: Array<{
    tagName: string
    tagSlug: string
    problemsSolved: number
  }>
}

export interface ComparisonData {
  user1: UserStats
  user2: UserStats
  comparison: {
    totalSolvedDiff: number
    strengthsUser1: string[]
    strengthsUser2: string[]
    commonProblems: number
    uniqueProblemsUser1: number
    uniqueProblemsUser2: number
  }
}

export interface Recommendation {
  title: string
  titleSlug: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topicTags: string[]
  reason: string
  similarity: number
  url: string
}

// LeetCode API service functions
export const leetcodeService = {
  // Get user statistics
  async getUserStats(username: string): Promise<UserStats> {
    try {
      const response = await api.get(`/api/user/${username}`)
      return response.data
    } catch (error) {
      // For development, return mock data
      console.warn('Using mock data for development')
      return getMockUserStats(username)
    }
  },

  // Compare two users
  async compareUsers(username1: string, username2: string): Promise<ComparisonData> {
    try {
      const response = await api.post('/api/compare', { username1, username2 })
      return response.data
    } catch (error) {
      console.warn('Using mock data for development')
      return getMockComparisonData(username1, username2)
    }
  },

  // Get recommendations
  async getRecommendations(
    username: string,
    topic?: string,
    difficulty?: string
  ): Promise<Recommendation[]> {
    try {
      const response = await api.post('/api/recommendations', {
        username,
        topic,
        difficulty,
      })
      return response.data
    } catch (error) {
      console.warn('Using mock data for development')
      return getMockRecommendations()
    }
  },
}

// Mock data for development
function getMockUserStats(username: string): UserStats {
  return {
    username,
    totalSolved: 342,
    easySolved: 145,
    mediumSolved: 156,
    hardSolved: 41,
    acceptanceRate: 68.5,
    ranking: 125432,
    contributionPoints: 1840,
    reputation: 0,
    submissionCalendar: {
      '2024-01-01': 3,
      '2024-01-02': 1,
      '2024-01-03': 2,
      '2024-01-04': 0,
      '2024-01-05': 4,
    },
    recentSubmissions: [
      {
        title: 'Two Sum',
        titleSlug: 'two-sum',
        timestamp: '2024-01-05T10:30:00Z',
        statusDisplay: 'Accepted',
        lang: 'python3',
      },
      {
        title: 'Add Two Numbers',
        titleSlug: 'add-two-numbers',
        timestamp: '2024-01-05T09:15:00Z',
        statusDisplay: 'Accepted',
        lang: 'javascript',
      },
    ],
    problemsSolvedBeatsStats: [
      { difficulty: 'Easy', percentage: 75.2 },
      { difficulty: 'Medium', percentage: 65.8 },
      { difficulty: 'Hard', percentage: 45.3 },
    ],
    skillStats: [
      { tagName: 'Array', tagSlug: 'array', problemsSolved: 89 },
      { tagName: 'Dynamic Programming', tagSlug: 'dynamic-programming', problemsSolved: 34 },
      { tagName: 'Tree', tagSlug: 'tree', problemsSolved: 28 },
      { tagName: 'Hash Table', tagSlug: 'hash-table', problemsSolved: 45 },
    ],
  }
}

function getMockComparisonData(username1: string, username2: string): ComparisonData {
  return {
    user1: getMockUserStats(username1),
    user2: getMockUserStats(username2),
    comparison: {
      totalSolvedDiff: 47,
      strengthsUser1: ['Dynamic Programming', 'Tree'],
      strengthsUser2: ['Array', 'Hash Table'],
      commonProblems: 156,
      uniqueProblemsUser1: 89,
      uniqueProblemsUser2: 72,
    },
  }
}

function getMockRecommendations(): Recommendation[] {
  return [
    {
      title: 'Longest Substring Without Repeating Characters',
      titleSlug: 'longest-substring-without-repeating-characters',
      difficulty: 'Medium',
      topicTags: ['Hash Table', 'String', 'Sliding Window'],
      reason: 'Improve your sliding window technique',
      similarity: 0.85,
      url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    },
    {
      title: 'Binary Tree Inorder Traversal',
      titleSlug: 'binary-tree-inorder-traversal',
      difficulty: 'Easy',
      topicTags: ['Stack', 'Tree', 'Depth-First Search'],
      reason: 'Strengthen tree traversal fundamentals',
      similarity: 0.78,
      url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
    },
    {
      title: 'Word Ladder',
      titleSlug: 'word-ladder',
      difficulty: 'Hard',
      topicTags: ['Hash Table', 'String', 'Breadth-First Search'],
      reason: 'Challenge yourself with graph algorithms',
      similarity: 0.72,
      url: 'https://leetcode.com/problems/word-ladder/',
    },
  ]
}

export default api
