const express = require('express');
const axios = require('axios');
const router = express.Router();

// Mock data for development
const generateMockData = (username) => {
  return {
    username,
    totalSolved: Math.floor(Math.random() * 2000) + 100,
    easySolved: Math.floor(Math.random() * 800) + 50,
    mediumSolved: Math.floor(Math.random() * 800) + 30,
    hardSolved: Math.floor(Math.random() * 400) + 10,
    acceptanceRate: (Math.random() * 30 + 50).toFixed(1),
    ranking: Math.floor(Math.random() * 100000) + 1000,
    contributionPoints: Math.floor(Math.random() * 500),
    recentSubmissions: [
      { date: '2024-12-10', count: 3 },
      { date: '2024-12-09', count: 1 },
      { date: '2024-12-08', count: 5 }
    ],
    skillStats: [
      { name: 'Array', solved: Math.floor(Math.random() * 100) + 20 },
      { name: 'String', solved: Math.floor(Math.random() * 80) + 15 },
      { name: 'Dynamic Programming', solved: Math.floor(Math.random() * 60) + 10 },
      { name: 'Tree', solved: Math.floor(Math.random() * 70) + 12 },
      { name: 'Graph', solved: Math.floor(Math.random() * 50) + 8 }
    ],
    submissionCalendar: generateSubmissionCalendar()
  };
};

const generateSubmissionCalendar = () => {
  const calendar = [];
  const today = new Date();
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    calendar.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10)
    });
  }
  
  return calendar;
};

// Get user stats
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // For now, return mock data
    // In production, this would make actual API calls to LeetCode
    const userData = generateMockData(username);
    
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Compare two users
router.get('/compare/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    
    const userData1 = generateMockData(user1);
    const userData2 = generateMockData(user2);
    
    res.json({
      user1: userData1,
      user2: userData2,
      comparison: {
        totalSolvedDiff: userData1.totalSolved - userData2.totalSolved,
        acceptanceRateDiff: parseFloat(userData1.acceptanceRate) - parseFloat(userData2.acceptanceRate)
      }
    });
  } catch (error) {
    console.error('Error comparing users:', error);
    res.status(500).json({ error: 'Failed to compare users' });
  }
});

module.exports = router;
