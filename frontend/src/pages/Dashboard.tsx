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
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight={700}
              color="text.primary"
              mb={2}
              sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
            >
              LeetCode Analytics
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", fontSize: "1rem" }}
            >
              Track your progress, analyze patterns, and get personalized
              recommendations
            </Typography>
          </Box>

          {/* Search Section */}
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{ display: "flex", gap: 2 }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter LeetCode username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search style={{ height: 20, width: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    height: 48,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{
                  px: 4,
                  fontWeight: 600,
                  textTransform: "none",
                  height: 48,
                  minWidth: 120,
                }}
              >
                {loading ? "Loading..." : "Search"}
              </Button>
            </Box>
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
            <Card sx={{ bgcolor: "background.paper" }}>
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="text.primary"
                  mb={2}
                >
                  Analyze Your LeetCode Journey
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  mb={4}
                  sx={{ maxWidth: 600, mx: "auto" }}
                >
                  Enter your LeetCode username to get detailed analytics,
                  progress insights, and personalized problem recommendations.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={4}
                  sx={{ mt: 2, maxWidth: 800, mx: "auto" }}
                >
                  <Box sx={{ textAlign: "center", flex: 1 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: "primary.main",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <TrendingUp
                        style={{ height: 28, width: 28, color: "white" }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      Progress Tracking
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Visual insights into your coding journey
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "center", flex: 1 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: "secondary.main",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <Target
                        style={{ height: 28, width: 28, color: "white" }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      Performance Analysis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Detailed breakdown of your strengths
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "center", flex: 1 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: "#ff9800",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <Lightbulb
                        style={{ height: 28, width: 28, color: "white" }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      Smart Recommendations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI-powered problem suggestions
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
