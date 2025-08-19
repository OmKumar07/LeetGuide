const express = require('express');
const axios = require('axios');
const router = express.Router();

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || 'http://localhost:8000';

// Get recommendations from NLP service
router.post('/recommendations', async (req, res) => {
  try {
    const { username, topic, difficulty } = req.body;
    
    const response = await axios.post(`${NLP_SERVICE_URL}/recommendations`, {
      username,
      topic,
      difficulty
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error calling NLP service:', error.message);
    
    // Fallback to mock recommendations
    const mockRecommendations = [
      {
        title: "Two Sum",
        slug: "two-sum",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        reason: "Perfect starting point for hash table practice",
        confidence: 0.9
      },
      {
        title: "Valid Parentheses", 
        slug: "valid-parentheses",
        difficulty: "Easy",
        tags: ["String", "Stack"],
        reason: "Great for understanding stack data structure",
        confidence: 0.85
      },
      {
        title: "Binary Tree Inorder Traversal",
        slug: "binary-tree-inorder-traversal", 
        difficulty: "Easy",
        tags: ["Tree", "Stack", "Recursion"],
        reason: "Essential tree traversal technique",
        confidence: 0.88
      }
    ];
    
    res.json(mockRecommendations);
  }
});

module.exports = router;
