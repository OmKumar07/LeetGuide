import { useState, useEffect } from "react";
import { Search, GitCompare, TrendingUp, Users, BarChart3 } from "lucide-react";
import { leetcodeService, type ComparisonData } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import { leetcodeColors } from "../theme/theme";

const Compare = () => {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Set page title
  useEffect(() => {
    document.title = "Compare Users - LeetGuide";
    return () => {
      document.title = "LeetGuide - LeetCode Analytics Dashboard";
    };
  }, []);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user1.trim() || !user2.trim()) return;

    setLoading(true);
    setError(null);
    setComparisonData(null);

    try {
      const comparison = await leetcodeService.compareUsers(
        user1.trim(),
        user2.trim()
      );

      // Calculate total solved for each user
      const user1Total =
        comparison.user1.easySolved +
        comparison.user1.mediumSolved +
        comparison.user1.hardSolved;
      const user2Total =
        comparison.user2.easySolved +
        comparison.user2.mediumSolved +
        comparison.user2.hardSolved;

      setComparisonData({
        ...comparison,
        user1: { ...comparison.user1, totalSolved: user1Total },
        user2: { ...comparison.user2, totalSolved: user2Total },
      });
    } catch (err) {
      setError(
        "Failed to compare users. Please check usernames and try again."
      );
      console.error("Error comparing users:", err);
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
              Compare Users
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Analyze performance differences between two LeetCode users
            </Typography>
          </Box>

          {/* Search Section */}
          <Box sx={{ maxWidth: 800, mx: "auto", width: "100%" }}>
            <Box
              component="form"
              onSubmit={handleCompare}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="First username"
                    value={user1}
                    onChange={(e) => setUser1(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search style={{ height: 20, width: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 48,
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 40,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "primary.main",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <GitCompare
                      style={{ height: 20, width: 20, color: "white" }}
                    />
                  </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Second username"
                    value={user2}
                    onChange={(e) => setUser2(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search style={{ height: 20, width: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 48,
                      },
                    }}
                  />
                </Box>
              </Stack>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={<GitCompare style={{ height: 20, width: 20 }} />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    height: 48,
                    minWidth: 160,
                  }}
                >
                  {loading ? "Comparing..." : "Compare"}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Loading */}
          {loading && <LoadingSpinner />}

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
              {error}
            </Alert>
          )}

          {/* Comparison Preview Cards */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{ maxWidth: 1000, mx: "auto" }}
          >
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: "primary.main",
                      borderRadius: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6" color="white" fontWeight={700}>
                      1
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    {user1 || "User 1"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Total Problems Solved
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {comparisonData?.user1?.totalSolved || "--"}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2}>
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: leetcodeColors.easy }}
                      >
                        {comparisonData?.user1?.easySolved || "--"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Easy
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: leetcodeColors.medium }}
                      >
                        {comparisonData?.user1?.mediumSolved || "--"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Medium
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: leetcodeColors.hard }}
                      >
                        {comparisonData?.user1?.hardSolved || "--"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hard
                      </Typography>
                    </Box>
                  </Stack>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      pt: 2,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Acceptance Rate
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {comparisonData?.user1?.acceptanceRate
                          ? `${comparisonData.user1.acceptanceRate}%`
                          : "--%"}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" color="text.secondary">
                        Ranking
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {comparisonData?.user1?.ranking?.toLocaleString() ||
                          "--"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: "secondary.main",
                      borderRadius: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6" color="white" fontWeight={700}>
                      2
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    {user2 || "User 2"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Total Problems Solved
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {comparisonData?.user2?.totalSolved || "--"}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2}>
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: leetcodeColors.easy }}
                      >
                        {comparisonData?.user2?.easySolved || "--"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Easy
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: leetcodeColors.medium }}
                      >
                        {comparisonData?.user2?.mediumSolved || "--"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Medium
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: leetcodeColors.hard }}
                      >
                        {comparisonData?.user2?.hardSolved || "--"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hard
                      </Typography>
                    </Box>
                  </Stack>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      pt: 2,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Acceptance Rate
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {comparisonData?.user2?.acceptanceRate
                          ? `${comparisonData.user2.acceptanceRate}%`
                          : "--%"}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" color="text.secondary">
                        Ranking
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {comparisonData?.user2?.ranking?.toLocaleString() ||
                          "--"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Stack>

          {/* Features Overview */}
          <Card sx={{ bgcolor: "background.paper" }}>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography
                variant="h4"
                fontWeight={700}
                color="text.primary"
                mb={3}
              >
                Comparison Features
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={4}
                sx={{ maxWidth: 800, mx: "auto" }}
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
                    Performance Metrics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Side-by-side analysis of solving patterns
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
                    <BarChart3
                      style={{ height: 28, width: 28, color: "white" }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    Skill Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compare strengths across different topics
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
                    <Users style={{ height: 28, width: 28, color: "white" }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    Progress Tracking
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track improvement over time
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Compare;
