import { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  Target,
  Lightbulb,
  Trophy,
  Activity,
} from "lucide-react";
import { leetcodeService, type UserStats } from "../services/api";
import DifficultyChart from "../components/charts/DifficultyChart";
import SkillsChart from "../components/charts/SkillsChart";
import ProgressChart from "../components/charts/ProgressChart";
import ActivityChart from "../components/charts/ActivityChart";
import ProfileAnalysis from "../components/ProfileAnalysis";
import SmartRecommendations from "../components/SmartRecommendations";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { leetcodeColors } from "../theme/theme";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set page title
  useEffect(() => {
    document.title = "Dashboard - LeetGuide";
    return () => {
      document.title = "LeetGuide - LeetCode Analytics Dashboard";
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stats = await leetcodeService.getUserStats(username.trim());

      // Calculate total solved for consistency
      const totalSolved =
        stats.easySolved + stats.mediumSolved + stats.hardSolved;

      setUserStats({
        ...stats,
        totalSolved: totalSolved,
      });
    } catch (err: unknown) {
      console.error("Error fetching user stats:", err);

      // More specific error handling
      if (err && typeof err === "object" && "response" in err) {
        const error = err as {
          response?: { status?: number; data?: { error?: string } };
          code?: string;
          message?: string;
        };
        if (error.response?.status === 404) {
          setError(
            `User "${username.trim()}" not found. Please check the username and try again.`
          );
        } else if (error.response?.status === 500) {
          setError(
            "Server error occurred. This might be due to LeetCode API issues. Please try again later."
          );
        } else if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else {
          setError(
            `Failed to fetch user data for "${username.trim()}". Please verify the username is correct and the user's profile is public.`
          );
        }
      } else if (err && typeof err === "object" && "message" in err) {
        const error = err as { message?: string; code?: string };
        if (
          error.code === "NETWORK_ERROR" ||
          error.message?.includes("Network Error")
        ) {
          setError(
            "Network error. Please check your internet connection and try again."
          );
        } else if (error.message?.includes("timeout")) {
          setError(
            "Request timed out. The LeetCode servers might be slow. Please try again."
          );
        } else {
          setError(
            `Failed to fetch user data for "${username.trim()}". Please verify the username is correct and the user's profile is public.`
          );
        }
      } else {
        setError(
          `Failed to fetch user data for "${username.trim()}". Please verify the username is correct and the user's profile is public.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                position: 'relative',
                display: 'inline-block',
                mb: 3
              }}
            >
              <Typography
                variant="h2"
                component="h1"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  background: `linear-gradient(135deg, ${leetcodeColors.leetcodeOrange} 0%, ${leetcodeColors.leetcodeGreen} 50%, ${leetcodeColors.leetcodeBlue} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: '-0.02em',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '120px',
                    height: '4px',
                    background: `linear-gradient(90deg, ${leetcodeColors.leetcodeOrange} 0%, ${leetcodeColors.leetcodeGreen} 50%, ${leetcodeColors.leetcodeBlue} 100%)`,
                    borderRadius: '2px',
                  }
                }}
              >
                LeetCode Analytics
              </Typography>
            </Box>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ 
                maxWidth: 700, 
                mx: "auto", 
                fontSize: "1.1rem",
                fontWeight: 500,
                lineHeight: 1.6,
                mb: 2
              }}
            >
              Unlock insights into your coding journey with advanced analytics, 
              performance tracking, and AI-powered recommendations
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 1.5, 
              flexWrap: 'wrap',
              mt: 2
            }}>
              <Chip 
                icon={<TrendingUp size={16} />}
                label="Progress Tracking" 
                variant="outlined"
                sx={{ 
                  borderColor: leetcodeColors.leetcodeOrange + '40',
                  color: leetcodeColors.leetcodeOrange,
                  fontWeight: 600
                }}
              />
              <Chip 
                icon={<Target size={16} />}
                label="Performance Analysis" 
                variant="outlined"
                sx={{ 
                  borderColor: leetcodeColors.leetcodeGreen + '40',
                  color: leetcodeColors.leetcodeGreen,
                  fontWeight: 600
                }}
              />
              <Chip 
                icon={<Lightbulb size={16} />}
                label="Smart Recommendations" 
                variant="outlined"
                sx={{ 
                  borderColor: leetcodeColors.leetcodeBlue + '40',
                  color: leetcodeColors.leetcodeBlue,
                  fontWeight: 600
                }}
              />
            </Box>
          </Box>

          {/* Search Section */}
          <Box sx={{ maxWidth: 700, mx: "auto", mb: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 48px rgba(0, 0, 0, 0.08)',
                }
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                color="text.primary"
                mb={2}
                sx={{ 
                  textAlign: 'center',
                  fontSize: '1.1rem'
                }}
              >
                🚀 Start Your Analytics Journey
              </Typography>
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{ display: "flex", gap: 2, alignItems: 'center' }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your LeetCode username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search style={{ 
                          height: 22, 
                          width: 22, 
                          color: leetcodeColors.leetcodeOrange 
                        }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                      borderRadius: 3,
                      fontSize: '1rem',
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: leetcodeColors.leetcodeOrange + '60',
                        }
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: leetcodeColors.leetcodeOrange,
                          borderWidth: '2px',
                        }
                      }
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    px: 4,
                    py: 2,
                    fontWeight: 700,
                    textTransform: "none",
                    height: 56,
                    minWidth: 140,
                    borderRadius: 3,
                    fontSize: '1rem',
                    background: `linear-gradient(135deg, ${leetcodeColors.leetcodeOrange} 0%, ${leetcodeColors.leetcodeGreen} 100%)`,
                    boxShadow: `0 8px 24px ${leetcodeColors.leetcodeOrange}25`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${leetcodeColors.leetcodeOrange} 0%, ${leetcodeColors.leetcodeGreen} 100%)`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 32px ${leetcodeColors.leetcodeOrange}35`,
                    },
                    '&:disabled': {
                      background: '#ccc',
                      color: '#888',
                      transform: 'none',
                      boxShadow: 'none',
                    }
                  }}
                >
                  {loading ? "Analyzing..." : "Analyze Profile"}
                </Button>
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ 
                  display: 'block',
                  textAlign: 'center',
                  mt: 2,
                  fontWeight: 500
                }}
              >
                💡 Make sure your LeetCode profile is public for accurate analytics
              </Typography>
            </Paper>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
              {error}
            </Alert>
          )}

          {/* User Stats Section */}
          {userStats && (
            <>
              {/* User Header */}
              <Card sx={{ maxWidth: 800, mx: "auto" }}>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "primary.main",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h3" color="white" fontWeight={700}>
                        {userStats.username.charAt(0).toUpperCase()}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h4" fontWeight={700} mb={1}>
                        {userStats.username}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <Chip
                          icon={<Trophy style={{ height: 16, width: 16 }} />}
                          label={`Rank ${userStats.ranking.toLocaleString()}`}
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          icon={<Target style={{ height: 16, width: 16 }} />}
                          label={`${userStats.acceptanceRate}% Success`}
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          icon={<Activity style={{ height: 16, width: 16 }} />}
                          label={`${(() => {
                            const avgValue =
                              userStats.streakData?.averageSubmissionsPerDay ||
                              "0";
                            console.log(
                              "Dashboard chip - avgValue:",
                              avgValue,
                              "streakData:",
                              userStats.streakData
                            );
                            return avgValue;
                          })()}/day avg`}
                          variant="outlined"
                          size="small"
                          sx={{
                            bgcolor: "success.light",
                            color: "success.contrastText",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={3}
                    sx={{ flexWrap: "wrap", justifyContent: "space-between" }}
                  >
                    <Box
                      sx={{ textAlign: "center", minWidth: "120px", flex: 1 }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="primary.main"
                      >
                        {userStats.easySolved +
                          userStats.mediumSolved +
                          userStats.hardSolved}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Solved
                      </Typography>
                    </Box>
                    <Box
                      sx={{ textAlign: "center", minWidth: "120px", flex: 1 }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ color: leetcodeColors.easy }}
                      >
                        {userStats.easySolved}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Easy
                      </Typography>
                    </Box>
                    <Box
                      sx={{ textAlign: "center", minWidth: "120px", flex: 1 }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ color: leetcodeColors.medium }}
                      >
                        {userStats.mediumSolved}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Medium
                      </Typography>
                    </Box>
                    <Box
                      sx={{ textAlign: "center", minWidth: "120px", flex: 1 }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ color: leetcodeColors.hard }}
                      >
                        {userStats.hardSolved}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hard
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Charts Section */}
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                  <Card sx={{ flex: 1 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={600} mb={3}>
                        Problems by Difficulty
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <DifficultyChart
                          easy={userStats.easySolved}
                          medium={userStats.mediumSolved}
                          hard={userStats.hardSolved}
                        />
                      </Box>
                    </CardContent>
                  </Card>

                  <Card sx={{ flex: 1 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ height: 300 }}>
                        <SkillsChart
                          skills={userStats.skillStats.map((skill) => ({
                            tagName: skill.name,
                            problemsSolved: skill.solved,
                          }))}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Stack>

                <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
                  <Card sx={{ flex: 1 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ height: 300 }}>
                        <ActivityChart
                          submissionCalendar={userStats.submissionCalendar}
                          averagePerDay={
                            userStats.streakData?.averageSubmissionsPerDay ||
                            "0"
                          }
                        />
                      </Box>
                    </CardContent>
                  </Card>

                  <Card sx={{ flex: 1 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ height: 300 }}>
                        <ProgressChart
                          submissionCalendar={userStats.submissionCalendar}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Stack>
              </Stack>

              {/* Profile Analysis Section */}
              <ProfileAnalysis userStats={userStats} />

              {/* Enhanced Recommendations Section */}
              <SmartRecommendations userStats={userStats} />
            </>
          )}

          {/* Getting Started Section */}
          {!userStats && (
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${leetcodeColors.leetcodeOrange} 0%, ${leetcodeColors.leetcodeGreen} 50%, ${leetcodeColors.leetcodeBlue} 100%)`,
                }
              }}
            >
              <CardContent sx={{ p: 5, textAlign: "center" }}>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    sx={{
                      background: `linear-gradient(135deg, ${leetcodeColors.leetcodeOrange} 0%, ${leetcodeColors.leetcodeGreen} 50%, ${leetcodeColors.leetcodeBlue} 100%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: { xs: "2rem", md: "2.5rem" },
                      mb: 2,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    🚀 Ready to Analyze Your Journey?
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ 
                      maxWidth: 700, 
                      mx: "auto",
                      fontWeight: 500,
                      lineHeight: 1.6,
                      fontSize: '1.1rem'
                    }}
                  >
                    Enter your LeetCode username above to unlock powerful insights, 
                    detailed analytics, and personalized recommendations to accelerate your coding progress.
                  </Typography>
                </Box>

                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={4}
                  sx={{ mt: 4, maxWidth: 900, mx: "auto" }}
                >
                  <Box sx={{ textAlign: "center", flex: 1 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        background: `linear-gradient(135deg, ${leetcodeColors.leetcodeOrange}15 0%, ${leetcodeColors.leetcodeOrange}25 100%)`,
                        border: `2px solid ${leetcodeColors.leetcodeOrange}30`,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                        transition: 'all 0.3s ease',
                        boxShadow: `0 8px 24px ${leetcodeColors.leetcodeOrange}20`,
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.05)',
                          boxShadow: `0 12px 32px ${leetcodeColors.leetcodeOrange}30`,
                        }
                      }}
                    >
                      <TrendingUp
                        style={{ 
                          height: 36, 
                          width: 36, 
                          color: leetcodeColors.leetcodeOrange 
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={700} mb={1.5} color="text.primary">
                      📈 Progress Tracking
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Visualize your coding journey with interactive charts, 
                      streak tracking, and detailed progress analytics
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "center", flex: 1 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        background: `linear-gradient(135deg, ${leetcodeColors.leetcodeGreen}15 0%, ${leetcodeColors.leetcodeGreen}25 100%)`,
                        border: `2px solid ${leetcodeColors.leetcodeGreen}30`,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                        transition: 'all 0.3s ease',
                        boxShadow: `0 8px 24px ${leetcodeColors.leetcodeGreen}20`,
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.05)',
                          boxShadow: `0 12px 32px ${leetcodeColors.leetcodeGreen}30`,
                        }
                      }}
                    >
                      <Target
                        style={{ 
                          height: 36, 
                          width: 36, 
                          color: leetcodeColors.leetcodeGreen 
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={700} mb={1.5} color="text.primary">
                      🎯 Performance Analysis
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Deep dive into your strengths and weaknesses with 
                      comprehensive performance metrics and skill breakdowns
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "center", flex: 1 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        background: `linear-gradient(135deg, ${leetcodeColors.leetcodeBlue}15 0%, ${leetcodeColors.leetcodeBlue}25 100%)`,
                        border: `2px solid ${leetcodeColors.leetcodeBlue}30`,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                        transition: 'all 0.3s ease',
                        boxShadow: `0 8px 24px ${leetcodeColors.leetcodeBlue}20`,
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.05)',
                          boxShadow: `0 12px 32px ${leetcodeColors.leetcodeBlue}30`,
                        }
                      }}
                    >
                      <Lightbulb
                        style={{ 
                          height: 36, 
                          width: 36, 
                          color: leetcodeColors.leetcodeBlue 
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={700} mb={1.5} color="text.primary">
                      💡 Smart Recommendations
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Get AI-powered problem suggestions tailored to your 
                      skill level and areas for improvement
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mt: 5, pt: 4, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    🔒 Your privacy matters - all data is fetched in real-time and never stored
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
