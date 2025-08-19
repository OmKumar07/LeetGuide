import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Paper,
  LinearProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  ExternalLink,
  Clock,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
  Lightbulb,
} from "lucide-react";
import {
  leetcodeService,
  type Recommendation,
  type UserStats,
} from "../services/api";

interface SmartRecommendationsProps {
  userStats?: UserStats;
}

const SmartRecommendations = ({ userStats }: SmartRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [recTopic, setRecTopic] = useState("");
  const [recDifficulty, setRecDifficulty] = useState("");

  const fetchRecommendations = useCallback(async () => {
    if (!userStats?.username) return;

    setLoading(true);
    try {
      const recs = await leetcodeService.getRecommendations(
        userStats.username,
        recTopic,
        recDifficulty
      );
      setRecommendations(recs);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  }, [userStats?.username, recTopic, recDifficulty]);

  useEffect(() => {
    if (userStats?.username) {
      fetchRecommendations();
    }
  }, [userStats?.username, fetchRecommendations]);

  const handleUpdateRecommendations = () => {
    fetchRecommendations();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#4caf50";
      case "Medium":
        return "#ff9800";
      case "Hard":
        return "#f44336";
      default:
        return "#666";
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case "High":
        return <AlertTriangle size={16} color="#f44336" />;
      case "Medium":
        return <Target size={16} color="#ff9800" />;
      case "Low":
        return <CheckCircle size={16} color="#4caf50" />;
      default:
        return <TrendingUp size={16} color="#666" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "High":
        return "#f44336";
      case "Medium":
        return "#ff9800";
      case "Low":
        return "#4caf50";
      default:
        return "#666";
    }
  };

  const formatEstimatedTime = (minutes?: number) => {
    if (!minutes) return "~30 min";
    if (minutes < 60) return `~${minutes} min`;
    return `~${Math.round(minutes / 60)}h ${minutes % 60}m`;
  };

  if (!userStats) {
    return null;
  }

  return (
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
          <Lightbulb style={{ height: 24, width: 24, color: "orange" }} />
          <Typography variant="h5" fontWeight={600}>
            Smart Recommendations
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Personalized problem suggestions based on your solving patterns and
          weak areas. These problems are filtered to exclude ones you've already
          solved.
        </Typography>

        {/* Recommendation Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
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
            onClick={handleUpdateRecommendations}
            startIcon={<Zap style={{ height: 16, width: 16 }} />}
            sx={{ textTransform: "none" }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Recommendations"}
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress />
          </Box>
        )}

        {/* Enhanced Recommendations List */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 3,
          }}
        >
          {recommendations.map((rec, index) => (
            <Paper
              key={index}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderLeft: `4px solid ${getPriorityColor(rec.priority)}`,
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: 3,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease-in-out",
              }}
            >
              {/* Header with Priority and Difficulty */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1, mr: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    {getPriorityIcon(rec.priority)}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {rec.priority || "Medium"} Priority
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ lineHeight: 1.3 }}
                  >
                    {rec.title}
                  </Typography>
                </Box>
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

              {/* Enhanced Reason */}
              <Typography
                variant="body2"
                color="text.secondary"
                mb={2}
                sx={{ lineHeight: 1.5 }}
              >
                {rec.reason}
              </Typography>

              {/* Time Estimate */}
              {rec.estimatedTime && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Clock size={14} color="#666" />
                  <Typography variant="caption" color="text.secondary">
                    Est. {formatEstimatedTime(rec.estimatedTime)}
                  </Typography>
                </Box>
              )}

              {/* Topic Tags */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 2,
                  flexWrap: "wrap",
                }}
              >
                {rec.topicTags.slice(0, 4).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: "0.7rem",
                      height: "20px",
                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                ))}
                {rec.topicTags.length > 4 && (
                  <Tooltip title={rec.topicTags.slice(4).join(", ")}>
                    <Chip
                      label={`+${rec.topicTags.length - 4}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: "0.7rem",
                        height: "20px",
                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                  </Tooltip>
                )}
              </Box>

              {/* Footer with Match and Action */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pt: 1,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(rec.similarity * 100)}% match
                  </Typography>
                  {rec.similarity > 0.8 && (
                    <Chip
                      label="Perfect Match"
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ height: "20px", fontSize: "0.65rem" }}
                    />
                  )}
                </Box>
                <Button
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<ExternalLink style={{ height: 16, width: 16 }} />}
                  sx={{
                    textTransform: "none",
                    minWidth: "auto",
                    fontWeight: 600,
                  }}
                  color="primary"
                >
                  Solve Now
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>

        {recommendations.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Target size={48} color="#ccc" style={{ marginBottom: 16 }} />
            <Typography variant="h6" color="text.secondary" mb={1}>
              No recommendations available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or check back after solving more
              problems
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
