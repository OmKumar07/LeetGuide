const express = require("express");
const axios = require("axios");
const router = express.Router();

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || "http://localhost:8000";
const LEETCODE_API_URL = "https://leetcode.com/graphql/";

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
    // Fetch problems from LeetCode
    const problems = await fetchPopularProblems(topic, difficulty);

    if (problems.length === 0) {
      return getMockRecommendations(topic, difficulty);
    }

    // Analyze user's skill level and generate recommendations
    const recommendations = problems.slice(0, 6).map((problem) => {
      const stats = JSON.parse(problem.stats);
      const acRate = parseFloat(problem.acRate);

      // Generate recommendation reason based on user stats and problem characteristics
      let reason = generateRecommendationReason(userStats, problem, acRate);

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
      };
    });

    return recommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error.message);
    return getMockRecommendations(topic, difficulty);
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
const getMockRecommendations = (topic = null, difficulty = null) => {
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

  let filtered = mockProblems;

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

  return filtered.length > 0 ? filtered : mockProblems;
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
      req.body.difficulty
    );
    res.json(mockRecommendations);
  }
});

module.exports = router;
