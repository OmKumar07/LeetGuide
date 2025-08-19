import { useState } from "react";
import {
  Search,
  TrendingUp,
  Target,
  Lightbulb,
  ExternalLink,
  Trophy,
  Zap,
} from "lucide-react";
import {
  leetcodeService,
  type UserStats,
  type Recommendation,
} from "../services/api";
import DifficultyChart from "../components/charts/DifficultyChart";
import SkillsChart from "../components/charts/SkillsChart";
import ProgressChart from "../components/charts/ProgressChart";
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
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { leetcodeColors } from "../theme/theme";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recTopic, setRecTopic] = useState("");
  const [recDifficulty, setRecDifficulty] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const stats = await leetcodeService.getUserStats(username.trim());
      setUserStats(stats);

      // Fetch recommendations automatically
      const recs = await leetcodeService.getRecommendations(username.trim());
      setRecommendations(recs);
    } catch (err) {
      setError(
        "Failed to fetch user data. Please check the username and try again."
      );
      console.error("Error fetching user stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (!userStats) return;

    try {
      const recs = await leetcodeService.getRecommendations(
        userStats.username,
        recTopic || undefined,
        recDifficulty || undefined
      );
      setRecommendations(recs);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return leetcodeColors.easy;
      case "Medium":
        return leetcodeColors.medium;
      case "Hard":
        return leetcodeColors.hard;
      default:
        return "#666";
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
                        {userStats.totalSolved}
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
                        <SkillsChart skills={userStats.skillStats} />
                      </Box>
                    </CardContent>
                  </Card>
                </Stack>

                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ height: 300 }}>
                      <ProgressChart
                        submissionCalendar={userStats.submissionCalendar}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Stack>

              {/* Recommendations Section */}
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Lightbulb
                      style={{ height: 24, width: 24, color: "orange" }}
                    />
                    <Typography variant="h5" fontWeight={600}>
                      Recommended Problems
                    </Typography>
                  </Box>

                  {/* Recommendation Filters */}
                  <Box
                    sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}
                  >
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel>Topic</InputLabel>
                      <Select
                        value={recTopic}
                        label="Topic"
                        onChange={(e) => setRecTopic(e.target.value)}
                      >
                        <MenuItem value="">All Topics</MenuItem>
                        <MenuItem value="array">Array</MenuItem>
                        <MenuItem value="dynamic-programming">
                          Dynamic Programming
                        </MenuItem>
                        <MenuItem value="tree">Tree</MenuItem>
                        <MenuItem value="graph">Graph</MenuItem>
                        <MenuItem value="string">String</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel>Difficulty</InputLabel>
                      <Select
                        value={recDifficulty}
                        label="Difficulty"
                        onChange={(e) => setRecDifficulty(e.target.value)}
                      >
                        <MenuItem value="">All Levels</MenuItem>
                        <MenuItem value="Easy">Easy</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Hard">Hard</MenuItem>
                      </Select>
                    </FormControl>

                    <Button
                      variant="outlined"
                      onClick={handleGetRecommendations}
                      startIcon={<Zap style={{ height: 16, width: 16 }} />}
                      sx={{ textTransform: "none" }}
                    >
                      Update Recommendations
                    </Button>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Recommendations List */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, 1fr)",
                      },
                      gap: 2,
                    }}
                  >
                    {recommendations.map((rec, index) => (
                      <Paper
                        key={index}
                        sx={{
                          p: 3,
                          border: "1px solid",
                          borderColor: "divider",
                          "&:hover": {
                            borderColor: "primary.main",
                            boxShadow: 2,
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ flex: 1, mr: 2 }}
                          >
                            {rec.title}
                          </Typography>
                          <Chip
                            label={rec.difficulty}
                            size="small"
                            sx={{
                              bgcolor: getDifficultyColor(rec.difficulty),
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={2}
                        >
                          {rec.reason}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            mb: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          {rec.topicTags.slice(0, 3).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.75rem" }}
                            />
                          ))}
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {Math.round(rec.similarity * 100)}% match
                          </Typography>
                          <Button
                            href={rec.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            endIcon={
                              <ExternalLink style={{ height: 16, width: 16 }} />
                            }
                            sx={{ textTransform: "none", minWidth: "auto" }}
                          >
                            Solve
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </Box>

                  {recommendations.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography color="text.secondary">
                        Recommendations will appear here based on your solving
                        patterns
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
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
