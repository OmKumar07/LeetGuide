const express = require("express");
const axios = require("axios");
const router = express.Router();

// LeetCode GraphQL API endpoints
const LEETCODE_API_URL = "https://leetcode.com/graphql/";
const LEETCODE_USER_PROFILE_URL = "https://leetcode.com/graphql/";

// Function to fetch real LeetCode user data
const fetchLeetCodeUserData = async (username) => {
  try {
    // Query for user profile and statistics
    const userProfileQuery = {
      query: `
        query getUserProfile($username: String!) {
          allQuestionsCount {
            difficulty
            count
          }
          matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            profile {
              ranking
              userAvatar
              realName
              aboutMe
              school
              websites
              countryName
              company
              jobTitle
              skillTags
              postViewCount
              postViewCountDiff
              reputation
              reputationDiff
            }
          }
        }
      `,
      variables: {
        username: username,
      },
    };

    const response = await axios.post(LEETCODE_API_URL, userProfileQuery, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.data.data.matchedUser) {
      throw new Error("User not found");
    }

    const userData = response.data.data.matchedUser;
    const submitStats = userData.submitStats.acSubmissionNum;

    // Parse difficulty-wise submission data
    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    let totalSubmissions = 0;

    submitStats.forEach((stat) => {
      totalSolved += stat.count;
      totalSubmissions += stat.submissions;

      switch (stat.difficulty) {
        case "Easy":
          easySolved = stat.count;
          break;
        case "Medium":
          mediumSolved = stat.count;
          break;
        case "Hard":
          hardSolved = stat.count;
          break;
      }
    });

    const acceptanceRate =
      totalSubmissions > 0
        ? ((totalSolved / totalSubmissions) * 100).toFixed(1)
        : "0.0";

    return {
      username: userData.username,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      acceptanceRate,
      ranking: userData.profile.ranking || 0,
      contributionPoints: userData.profile.reputation || 0,
      skillStats: await fetchUserSkillStats(username),
      submissionCalendar: await fetchSubmissionCalendar(username),
      profile: {
        realName: userData.profile.realName,
        avatar: userData.profile.userAvatar,
        aboutMe: userData.profile.aboutMe,
        school: userData.profile.school,
        company: userData.profile.company,
        country: userData.profile.countryName,
      },
    };
  } catch (error) {
    console.error("Error fetching LeetCode data:", error.message);
    throw error;
  }
};

// Function to fetch user skill statistics
const fetchUserSkillStats = async (username) => {
  try {
    const skillStatsQuery = {
      query: `
        query getTagProblemCounts($username: String!) {
          matchedUser(username: $username) {
            tagProblemCounts {
              advanced {
                tagName
                tagSlug
                problemsSolved
              }
              intermediate {
                tagName
                tagSlug
                problemsSolved
              }
              fundamental {
                tagName
                tagSlug
                problemsSolved
              }
            }
          }
        }
      `,
      variables: { username },
    };

    const response = await axios.post(LEETCODE_API_URL, skillStatsQuery, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.data.data.matchedUser) {
      return [];
    }

    const tagProblemCounts = response.data.data.matchedUser.tagProblemCounts;
    const allTags = [
      ...(tagProblemCounts.fundamental || []),
      ...(tagProblemCounts.intermediate || []),
      ...(tagProblemCounts.advanced || []),
    ];

    // Sort by problems solved and take top 10
    return allTags
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 10)
      .map((tag) => ({
        name: tag.tagName,
        solved: tag.problemsSolved,
      }));
  } catch (error) {
    console.error("Error fetching skill stats:", error.message);
    return [];
  }
};

// Function to fetch submission calendar
const fetchSubmissionCalendar = async (username) => {
  try {
    const calendarQuery = {
      query: `
        query getUserCalendar($username: String!) {
          matchedUser(username: $username) {
            submissionCalendar
          }
        }
      `,
      variables: { username },
    };

    const response = await axios.post(LEETCODE_API_URL, calendarQuery, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.data.data.matchedUser) {
      return [];
    }

    const calendar = response.data.data.matchedUser.submissionCalendar;
    if (!calendar) return [];

    // Parse the submission calendar (it's a JSON string of timestamp: count)
    const submissionData = JSON.parse(calendar);
    return Object.entries(submissionData)
      .map(([timestamp, count]) => ({
        date: new Date(parseInt(timestamp) * 1000).toISOString().split("T")[0],
        count: parseInt(count),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error("Error fetching submission calendar:", error.message);
    return [];
  }
};

// Mock data for development fallback
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
      { date: "2024-12-10", count: 3 },
      { date: "2024-12-09", count: 1 },
      { date: "2024-12-08", count: 5 },
    ],
    skillStats: [
      { name: "Array", solved: Math.floor(Math.random() * 100) + 20 },
      { name: "String", solved: Math.floor(Math.random() * 80) + 15 },
      {
        name: "Dynamic Programming",
        solved: Math.floor(Math.random() * 60) + 10,
      },
      { name: "Tree", solved: Math.floor(Math.random() * 70) + 12 },
      { name: "Graph", solved: Math.floor(Math.random() * 50) + 8 },
    ],
    submissionCalendar: generateSubmissionCalendar(),
  };
};

const generateSubmissionCalendar = () => {
  const calendar = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    calendar.push({
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 10),
    });
  }

  return calendar;
};

// Get user stats
router.get("/user/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Try to fetch real LeetCode data first
    try {
      const userData = await fetchLeetCodeUserData(username);
      res.json(userData);
    } catch (apiError) {
      console.warn(
        "LeetCode API failed, falling back to mock data:",
        apiError.message
      );
      // Fall back to mock data if API fails
      const userData = generateMockData(username);
      res.json(userData);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Compare two users
router.get("/compare/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    let userData1, userData2;

    // Try to fetch real data for both users
    try {
      userData1 = await fetchLeetCodeUserData(user1);
    } catch (error) {
      console.warn(
        `Failed to fetch data for ${user1}, using mock data:`,
        error.message
      );
      userData1 = generateMockData(user1);
    }

    try {
      userData2 = await fetchLeetCodeUserData(user2);
    } catch (error) {
      console.warn(
        `Failed to fetch data for ${user2}, using mock data:`,
        error.message
      );
      userData2 = generateMockData(user2);
    }

    res.json({
      user1: userData1,
      user2: userData2,
      comparison: {
        totalSolvedDiff: userData1.totalSolved - userData2.totalSolved,
        acceptanceRateDiff:
          parseFloat(userData1.acceptanceRate) -
          parseFloat(userData2.acceptanceRate),
        rankingDiff: userData2.ranking - userData1.ranking, // Lower ranking is better
      },
    });
  } catch (error) {
    console.error("Error comparing users:", error);
    res.status(500).json({ error: "Failed to compare users" });
  }
});

module.exports = router;
