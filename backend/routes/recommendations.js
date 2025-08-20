const express = require("express");
const axios = require("axios");
const router = express.Router();

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || "http://localhost:8000";

// Simple fallback recommendations if NLP service is unavailable
const getBasicRecommendations = (userStats) => {
  const { totalSolved, easySolved, mediumSolved } = userStats || {};

  const basicProblems = [
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
      estimatedTime: 15,
      priority: "High",
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
      estimatedTime: 20,
      priority: "High",
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
      estimatedTime: 25,
      priority: "Medium",
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
      estimatedTime: 30,
      priority: "Medium",
    },
  ];

  // Filter based on user's level
  if (totalSolved < 30) {
    return basicProblems.filter((p) => p.difficulty === "Easy");
  } else if (totalSolved < 100) {
    return basicProblems;
  } else {
    return basicProblems.filter(
      (p) => p.difficulty === "Medium" || p.difficulty === "Easy"
    );
  }
};

// Get recommendations from NLP service with fallback
router.post("/recommendations", async (req, res) => {
  try {
    const { username, topic, difficulty } = req.body;

    // Get user stats first
    let userStats = null;
    try {
      const userResponse = await axios.get(
        `http://localhost:3001/api/leetcode/user/${username}`
      );
      userStats = userResponse.data;
    } catch (userError) {
      console.warn("Could not fetch user stats:", userError.message);
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
        "NLP service unavailable, using basic recommendations:",
        nlpError.message
      );

      // Fallback to basic recommendations
      const basicRecommendations = getBasicRecommendations(userStats);
      res.json(basicRecommendations);
    }
  } catch (error) {
    console.error("Error getting recommendations:", error.message);

    // Final fallback
    const fallbackRecommendations = getBasicRecommendations(null);
    res.json(fallbackRecommendations);
  }
});

module.exports = router;
