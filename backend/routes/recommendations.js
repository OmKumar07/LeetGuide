const express = require("express");
const axios = require("axios");
const router = express.Router();

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || "http://localhost:8000";
const LEETCODE_API_URL = "https://leetcode.com/graphql/";

// Function to fetch user's solved problems list
const fetchUserSolvedProblems = async (username) => {
  try {
    const query = {
      query: `
        query getUserSolvedProblems($username: String!) {
          allQuestionsCount {
            difficulty
            count
          }
          matchedUser(username: $username) {
            submissionCalendar
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
          }
          recentSubmissionList(username: $username) {
            title
            titleSlug
            timestamp
            statusDisplay
            __typename
          }
        }
      `,
      variables: { username },
    };

    const response = await axios.post(LEETCODE_API_URL, query, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    // Extract solved problem slugs from recent submissions
    const recentSubmissions = response.data.data?.recentSubmissionList || [];
    const solvedSlugs = recentSubmissions
      .filter((sub) => sub.statusDisplay === "Accepted")
      .map((sub) => sub.titleSlug);

    return solvedSlugs;
  } catch (error) {
    console.error("Error fetching solved problems:", error.message);
    return [];
  }
};

// Function to analyze user's weak areas and skill gaps
const analyzeUserWeaknesses = (userStats) => {
  if (!userStats || !userStats.skillStats) return [];

  const skillStats = userStats.skillStats;
  const avgSolved =
    skillStats.reduce((sum, skill) => sum + skill.solved, 0) /
    skillStats.length;

  // Identify skills below average
  const weakAreas = skillStats
    .filter((skill) => skill.solved < avgSolved * 0.7) // 30% below average
    .map((skill) => skill.name)
    .slice(0, 3); // Top 3 weak areas

  return weakAreas;
};

// Function to suggest personalized learning path
const generateLearningPath = (userStats) => {
  if (!userStats) return null;

  const { easySolved, mediumSolved, hardSolved, totalSolved } = userStats;
  const suggestions = [];

  // Beginner phase
  if (totalSolved < 50) {
    suggestions.push({
      phase: "Foundation Building",
      focus: "Easy problems with core concepts",
      recommendedDaily: 2,
      targetSkills: ["Array", "String", "Hash Table", "Two Pointers"],
      description:
        "Focus on understanding basic data structures and algorithms",
    });
  }
  // Intermediate phase
  else if (totalSolved < 200) {
    suggestions.push({
      phase: "Skill Expansion",
      focus: "Medium problems with varied topics",
      recommendedDaily: 1,
      targetSkills: ["Dynamic Programming", "Tree", "Graph", "Greedy"],
      description:
        "Expand your problem-solving toolkit with intermediate concepts",
    });
  }
  // Advanced phase
  else {
    suggestions.push({
      phase: "Mastery & Optimization",
      focus: "Hard problems and optimization",
      recommendedDaily: 1,
      targetSkills: ["Advanced DP", "Graph Algorithms", "System Design"],
      description:
        "Master complex algorithms and prepare for top-tier interviews",
    });
  }

  return suggestions[0];
};

// Function to fetch popular problems by topic
const fetchPopularProblems = async (topic = null, difficulty = null) => {
  try {
    const query = {
      query: `
        query getProblems($categorySlug: String, $skip: Int, $limit: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList(
            categorySlug: $categorySlug
            skip: $skip
            limit: $limit
            filters: $filters
          ) {
            questions {
              title
              titleSlug
              difficulty
              topicTags {
                name
                slug
              }
              stats
              likes
              dislikes
              acRate
              freqBar
            }
          }
        }
      `,
      variables: {
        categorySlug: "",
        skip: 0,
        limit: 50,
        filters: {
          difficulty: difficulty ? difficulty.toUpperCase() : null,
          tags: topic ? [topic.toLowerCase().replace(/\s+/g, "-")] : null,
          orderBy: "AC_RATE",
          sortOrder: "DESCENDING",
        },
      },
    };

    const response = await axios.post(LEETCODE_API_URL, query, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.data.data?.problemsetQuestionList?.questions) {
      return [];
    }

    return response.data.data.problemsetQuestionList.questions;
  } catch (error) {
    console.error("Error fetching problems:", error.message);
    return [];
  }
};

// Function to generate intelligent recommendations based on user stats
const generateRecommendations = async (
  username,
  userStats,
  topic = null,
  difficulty = null
) => {
  try {
    // Fetch user's solved problems to avoid recommending them again
    const solvedProblems = username
      ? await fetchUserSolvedProblems(username)
      : [];

    // Analyze user's weak areas for targeted recommendations
    const weakAreas = analyzeUserWeaknesses(userStats);

    // Fetch problems from LeetCode
    const problems = await fetchPopularProblems(topic, difficulty);

    if (problems.length === 0) {
      return getMockRecommendations(topic, difficulty, solvedProblems);
    }

    // Filter out already solved problems
    const unsolvedProblems = problems.filter(
      (problem) => !solvedProblems.includes(problem.titleSlug)
    );

    // If user hasn't solved many problems, prioritize their weak areas
    let targetProblems = unsolvedProblems;
    if (weakAreas.length > 0 && !topic) {
      targetProblems = unsolvedProblems.filter((problem) =>
        problem.topicTags.some((tag) =>
          weakAreas.some(
            (weakness) =>
              tag.name.toLowerCase().includes(weakness.toLowerCase()) ||
              weakness.toLowerCase().includes(tag.name.toLowerCase())
          )
        )
      );

      // If no problems found for weak areas, fall back to all unsolved
      if (targetProblems.length === 0) {
        targetProblems = unsolvedProblems;
      }
    }

    // Intelligent difficulty progression
    const recommendedDifficulty = getRecommendedDifficulty(userStats);
    if (!difficulty && recommendedDifficulty) {
      targetProblems = targetProblems.filter(
        (p) =>
          p.difficulty === recommendedDifficulty ||
          (recommendedDifficulty === "Mixed" &&
            ["Easy", "Medium"].includes(p.difficulty))
      );
    }

    // Sort by relevance and acceptance rate
    targetProblems.sort((a, b) => {
      const aScore = calculateRelevanceScore(userStats, a, weakAreas);
      const bScore = calculateRelevanceScore(userStats, b, weakAreas);
      return bScore - aScore;
    });

    // Generate recommendations with detailed reasoning
    const recommendations = targetProblems.slice(0, 8).map((problem) => {
      const stats = JSON.parse(problem.stats);
      const acRate = parseFloat(problem.acRate);

      // Generate enhanced recommendation reason
      let reason = generateEnhancedRecommendationReason(
        userStats,
        problem,
        acRate,
        weakAreas
      );

      // Calculate similarity/confidence score
      let similarity = calculateSimilarityScore(userStats, problem, acRate);

      return {
        title: problem.title,
        slug: problem.titleSlug,
        difficulty: problem.difficulty,
        topicTags: problem.topicTags.map((tag) => tag.name),
        url: `https://leetcode.com/problems/${problem.titleSlug}/`,
        reason: reason,
        similarity: similarity,
        acRate: acRate,
        likes: problem.likes,
        dislikes: problem.dislikes,
        estimatedTime: estimateSolveTime(problem.difficulty, acRate),
        priority: calculatePriority(userStats, problem, weakAreas),
      };
    });

    return recommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error.message);
    return getMockRecommendations(topic, difficulty, []);
  }
};

// Function to get recommended difficulty based on user progress
const getRecommendedDifficulty = (userStats) => {
  if (!userStats) return "Easy";

  const { easySolved, mediumSolved, totalSolved } = userStats;

  if (totalSolved < 30) return "Easy";
  if (easySolved < 50) return "Easy";
  if (mediumSolved < 30) return "Medium";
  if (totalSolved < 150) return "Mixed";
  return "Medium";
};

// Function to calculate problem relevance score
const calculateRelevanceScore = (userStats, problem, weakAreas) => {
  let score = 0;

  // Base score from acceptance rate (sweet spot 30-70%)
  const acRate = parseFloat(problem.acRate);
  if (acRate >= 30 && acRate <= 70) score += 3;
  else if (acRate >= 20 && acRate <= 80) score += 2;
  else score += 1;

  // Boost score for weak areas
  if (weakAreas.length > 0) {
    const isWeakArea = problem.topicTags.some((tag) =>
      weakAreas.some(
        (weakness) =>
          tag.name.toLowerCase().includes(weakness.toLowerCase()) ||
          weakness.toLowerCase().includes(tag.name.toLowerCase())
      )
    );
    if (isWeakArea) score += 5;
  }

  // Boost score for popular problems (high likes)
  if (problem.likes > 1000) score += 2;
  if (problem.likes > 5000) score += 1;

  return score;
};

// Function to estimate solve time
const estimateSolveTime = (difficulty, acRate) => {
  const baseTime = {
    Easy: 15,
    Medium: 30,
    Hard: 60,
  };

  const difficultyMultiplier = acRate < 30 ? 1.5 : acRate > 70 ? 0.8 : 1;
  return Math.round(baseTime[difficulty] * difficultyMultiplier);
};

// Function to calculate priority
const calculatePriority = (userStats, problem, weakAreas) => {
  const isWeakArea =
    weakAreas.length > 0 &&
    problem.topicTags.some((tag) =>
      weakAreas.some((weakness) =>
        tag.name.toLowerCase().includes(weakness.toLowerCase())
      )
    );

  const acRate = parseFloat(problem.acRate);
  const hasGoodAcceptanceRate = acRate >= 30 && acRate <= 70;

  if (isWeakArea && hasGoodAcceptanceRate) return "High";
  if (isWeakArea || hasGoodAcceptanceRate) return "Medium";
  return "Low";
};

// Enhanced recommendation reason generator
const generateEnhancedRecommendationReason = (
  userStats,
  problem,
  acRate,
  weakAreas
) => {
  const difficulty = problem.difficulty;
  const totalSolved = userStats?.totalSolved || 0;
  const isWeakArea =
    weakAreas.length > 0 &&
    problem.topicTags.some((tag) =>
      weakAreas.some((weakness) =>
        tag.name.toLowerCase().includes(weakness.toLowerCase())
      )
    );

  const mainTopics = problem.topicTags
    .slice(0, 2)
    .map((tag) => tag.name)
    .join(" and ");

  if (isWeakArea) {
    return `🎯 Targets your weak area in ${mainTopics}! This ${difficulty.toLowerCase()} problem (${acRate.toFixed(
      1
    )}% acceptance) will help strengthen these skills.`;
  }

  if (difficulty === "Easy" && totalSolved < 50) {
    return `🌱 Perfect for building ${mainTopics} fundamentals! High success rate (${acRate.toFixed(
      1
    )}%) makes it great for learning.`;
  } else if (difficulty === "Medium" && totalSolved >= 30) {
    return `🚀 Ready for the next level! This ${mainTopics} problem (${acRate.toFixed(
      1
    )}% acceptance) will advance your skills.`;
  } else if (difficulty === "Hard" && totalSolved >= 100) {
    return `💪 Challenge yourself! This advanced ${mainTopics} problem (${acRate.toFixed(
      1
    )}% acceptance) will push your limits.`;
  } else if (acRate > 70) {
    return `✅ High confidence problem! ${acRate.toFixed(
      1
    )}% acceptance rate in ${mainTopics} - great for building momentum.`;
  } else if (acRate < 30) {
    return `🔥 Elite challenge! Only ${acRate.toFixed(
      1
    )}% solve this ${mainTopics} problem - excellent for skill mastery.`;
  } else {
    return `⚖️ Balanced challenge in ${mainTopics} with ${acRate.toFixed(
      1
    )}% acceptance rate - perfect for steady improvement.`;
  }
};

// Function to generate recommendation reason
const generateRecommendationReason = (userStats, problem, acRate) => {
  const difficulty = problem.difficulty;
  const totalSolved = userStats?.totalSolved || 0;

  if (difficulty === "Easy" && totalSolved < 50) {
    return `Great for beginners! This ${difficulty.toLowerCase()} problem has a ${acRate.toFixed(
      1
    )}% acceptance rate and helps build fundamentals.`;
  } else if (
    difficulty === "Medium" &&
    totalSolved >= 50 &&
    totalSolved < 200
  ) {
    return `Perfect next step! This ${difficulty.toLowerCase()} problem will challenge your current skills with a ${acRate.toFixed(
      1
    )}% acceptance rate.`;
  } else if (difficulty === "Hard" && totalSolved >= 200) {
    return `Advanced challenge! This ${difficulty.toLowerCase()} problem will push your limits with a ${acRate.toFixed(
      1
    )}% acceptance rate.`;
  } else if (acRate > 70) {
    return `High success rate problem (${acRate.toFixed(
      1
    )}%) - great for building confidence and practicing fundamentals.`;
  } else if (acRate < 30) {
    return `Challenging problem with ${acRate.toFixed(
      1
    )}% acceptance rate - excellent for improving problem-solving skills.`;
  } else {
    return `Balanced difficulty with ${acRate.toFixed(
      1
    )}% acceptance rate - good for steady skill improvement.`;
  }
};

// Function to calculate similarity score
const calculateSimilarityScore = (userStats, problem, acRate) => {
  let score = 0.5; // Base score

  const totalSolved = userStats?.totalSolved || 0;
  const difficulty = problem.difficulty;

  // Adjust score based on user experience and problem difficulty
  if (difficulty === "Easy" && totalSolved < 100) score += 0.3;
  else if (difficulty === "Medium" && totalSolved >= 50 && totalSolved < 300)
    score += 0.3;
  else if (difficulty === "Hard" && totalSolved >= 200) score += 0.3;

  // Adjust based on acceptance rate (sweet spot around 40-60%)
  if (acRate >= 40 && acRate <= 60) score += 0.2;
  else if (acRate >= 20 && acRate <= 80) score += 0.1;

  return Math.min(score, 1.0);
};

// Mock recommendations fallback
const getMockRecommendations = (
  topic = null,
  difficulty = null,
  solvedProblems = []
) => {
  const mockProblems = [
    {
      title: "Two Sum",
      slug: "two-sum",
      difficulty: "Easy",
      topicTags: ["Array", "Hash Table"],
      url: "https://leetcode.com/problems/two-sum/",
      reason: "Perfect starting point for hash table practice",
      similarity: 0.9,
      acRate: 51.4,
      likes: 45231,
      dislikes: 1432,
    },
    {
      title: "Valid Parentheses",
      slug: "valid-parentheses",
      difficulty: "Easy",
      topicTags: ["String", "Stack"],
      url: "https://leetcode.com/problems/valid-parentheses/",
      reason: "Great for understanding stack data structure",
      similarity: 0.85,
      acRate: 40.1,
      likes: 18743,
      dislikes: 1123,
    },
    {
      title: "Longest Substring Without Repeating Characters",
      slug: "longest-substring-without-repeating-characters",
      difficulty: "Medium",
      topicTags: ["Hash Table", "String", "Sliding Window"],
      url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      reason: "Essential sliding window technique",
      similarity: 0.78,
      acRate: 33.8,
      likes: 32451,
      dislikes: 1432,
    },
    {
      title: "Binary Tree Inorder Traversal",
      slug: "binary-tree-inorder-traversal",
      difficulty: "Easy",
      topicTags: ["Tree", "Stack", "Recursion"],
      url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
      reason: "Essential tree traversal technique",
      similarity: 0.88,
      acRate: 74.4,
      likes: 11234,
      dislikes: 542,
    },
    {
      title: "Add Two Numbers",
      slug: "add-two-numbers",
      difficulty: "Medium",
      topicTags: ["Linked List", "Math", "Recursion"],
      url: "https://leetcode.com/problems/add-two-numbers/",
      reason: "Great for linked list manipulation practice",
      similarity: 0.82,
      acRate: 39.3,
      likes: 24123,
      dislikes: 4321,
    },
    {
      title: "Maximum Depth of Binary Tree",
      slug: "maximum-depth-of-binary-tree",
      difficulty: "Easy",
      topicTags: ["Tree", "Depth-First Search", "Breadth-First Search"],
      url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      reason: "Perfect introduction to tree algorithms",
      similarity: 0.91,
      acRate: 73.7,
      likes: 9876,
      dislikes: 321,
    },
  ];

  let filtered = mockProblems.filter(
    (problem) => !solvedProblems.includes(problem.slug)
  );

  if (difficulty) {
    filtered = filtered.filter(
      (p) => p.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }

  if (topic) {
    filtered = filtered.filter((p) =>
      p.topicTags.some((tag) => tag.toLowerCase().includes(topic.toLowerCase()))
    );
  }

  return filtered.length > 0
    ? filtered
    : mockProblems.filter((p) => !solvedProblems.includes(p.slug));
};

// Get recommendations from NLP service or generate them
router.post("/recommendations", async (req, res) => {
  try {
    const { username, topic, difficulty } = req.body;

    // First try to get user stats to make better recommendations
    let userStats = null;
    if (username) {
      try {
        const userResponse = await axios.get(
          `http://localhost:3001/api/leetcode/user/${username}`
        );
        userStats = userResponse.data;
      } catch (error) {
        console.warn(
          "Could not fetch user stats for recommendations:",
          error.message
        );
      }
    }

    // Try NLP service first
    try {
      const response = await axios.post(
        `${NLP_SERVICE_URL}/recommendations`,
        {
          username,
          topic,
          difficulty,
          userStats,
        },
        { timeout: 5000 }
      );

      res.json(response.data);
    } catch (nlpError) {
      console.warn(
        "NLP service unavailable, generating recommendations locally:",
        nlpError.message
      );

      // Generate recommendations locally
      const recommendations = await generateRecommendations(
        username,
        userStats,
        topic,
        difficulty
      );
      res.json(recommendations);
    }
  } catch (error) {
    console.error("Error getting recommendations:", error.message);

    // Final fallback to mock recommendations
    const mockRecommendations = getMockRecommendations(
      req.body.topic,
      req.body.difficulty,
      []
    );
    res.json(mockRecommendations);
  }
});

// New endpoint for learning path analysis
router.post("/learning-path", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Get user stats
    const userResponse = await axios.get(
      `http://localhost:3001/api/leetcode/user/${username}`
    );
    const userStats = userResponse.data;

    // Generate learning path
    const learningPath = generateLearningPath(userStats);
    const weakAreas = analyzeUserWeaknesses(userStats);
    const solvedProblems = await fetchUserSolvedProblems(username);

    res.json({
      currentPath: learningPath,
      weakAreas: weakAreas,
      totalSolved: userStats.totalSolved,
      progressAnalysis: {
        beginnerPhase: userStats.totalSolved >= 50,
        intermediatePhase: userStats.totalSolved >= 150,
        advancedPhase: userStats.totalSolved >= 300,
        currentPhase:
          userStats.totalSolved < 50
            ? "Beginner"
            : userStats.totalSolved < 150
            ? "Intermediate"
            : "Advanced",
      },
      solvedCount: solvedProblems.length,
      recommendations: await generateRecommendations(username, userStats),
    });
  } catch (error) {
    console.error("Error generating learning path:", error.message);
    res.status(500).json({ error: "Failed to generate learning path" });
  }
});

// Get recommendations from NLP service or generate them
router.post("/recommendations", async (req, res) => {
  try {
    const { username, topic, difficulty } = req.body;

    // First try to get user stats to make better recommendations
    let userStats = null;
    if (username) {
      try {
        const userResponse = await axios.get(
          `http://localhost:3001/api/leetcode/user/${username}`
        );
        userStats = userResponse.data;
      } catch (error) {
        console.warn(
          "Could not fetch user stats for recommendations:",
          error.message
        );
      }
    }

    // Try NLP service first
    try {
      const response = await axios.post(
        `${NLP_SERVICE_URL}/recommendations`,
        {
          username,
          topic,
          difficulty,
          userStats,
        },
        { timeout: 5000 }
      );

      res.json(response.data);
    } catch (nlpError) {
      console.warn(
        "NLP service unavailable, generating recommendations locally:",
        nlpError.message
      );

      // Generate recommendations locally
      const recommendations = await generateRecommendations(
        username,
        userStats,
        topic,
        difficulty
      );
      res.json(recommendations);
    }
  } catch (error) {
    console.error("Error getting recommendations:", error.message);

    // Final fallback to mock recommendations
    const mockRecommendations = getMockRecommendations(
      req.body.topic,
      req.body.difficulty
    );
    res.json(mockRecommendations);
  }
});

module.exports = router;
