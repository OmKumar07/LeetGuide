import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  Paper,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  ExternalLink,
  Clock,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react";
import type { Recommendation } from "../services/api";

interface EnhancedRecommendationsProps {
  recommendations: Recommendation[];
  title?: string;
}

const EnhancedRecommendations = ({
  recommendations,
  title = "Smart Recommendations",
}: EnhancedRecommendationsProps) => {
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
        return <Zap size={16} color="#2196f3" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "High":
        return "error.main";
      case "Medium":
        return "warning.main";
      case "Low":
        return "success.main";
      default:
        return "info.main";
    }
  };

  const formatEstimatedTime = (minutes?: number) => {
    if (!minutes) return "~30 min";
    if (minutes < 60) return `~${minutes} min`;
    return `~${Math.round(minutes / 60)}h ${minutes % 60}min`;
  };

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <TrendingUp style={{ height: 24, width: 24, color: "#2196f3" }} />
          <Typography variant="h5" fontWeight={600}>
            {title}
          </Typography>
        </Box>

        {recommendations.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              No recommendations available at this time
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
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
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: getPriorityColor(rec.priority),
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease-in-out",
                  position: "relative",
                }}
              >
                {/* Priority Badge */}
                {rec.priority && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Tooltip title={`${rec.priority} Priority`}>
                      {getPriorityIcon(rec.priority)}
                    </Tooltip>
                  </Box>
                )}

                {/* Header */}
                <Box sx={{ mb: 2, pr: 4 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 1, lineHeight: 1.3 }}
                  >
                    {rec.title}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Chip
                      label={rec.difficulty}
                      size="small"
                      sx={{
                        bgcolor: getDifficultyColor(rec.difficulty),
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                    {rec.estimatedTime && (
                      <Chip
                        icon={<Clock size={12} />}
                        label={formatEstimatedTime(rec.estimatedTime)}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    )}
                  </Stack>
                </Box>

                {/* Recommendation Reason */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, lineHeight: 1.5 }}
                >
                  {rec.reason}
                </Typography>

                {/* Topic Tags */}
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {rec.topicTags.slice(0, 3).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: "0.7rem",
                          height: 24,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    ))}
                    {rec.topicTags.length > 3 && (
                      <Chip
                        label={`+${rec.topicTags.length - 3}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: "0.7rem",
                          height: 24,
                          opacity: 0.7,
                        }}
                      />
                    )}
                  </Stack>
                </Box>

                {/* Statistics */}
                <Box sx={{ mb: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Acceptance Rate
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {rec.acRate?.toFixed(1)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={rec.acRate || 0}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        bgcolor:
                          rec.acRate && rec.acRate > 50
                            ? "success.main"
                            : rec.acRate && rec.acRate > 30
                            ? "warning.main"
                            : "error.main",
                      },
                    }}
                  />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mt: 1 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Match: {Math.round((rec.similarity || 0) * 100)}%
                    </Typography>
                    {rec.likes && (
                      <Typography variant="caption" color="text.secondary">
                        👍 {rec.likes.toLocaleString()}
                      </Typography>
                    )}
                  </Stack>
                </Box>

                {/* Action Button */}
                <Button
                  fullWidth
                  variant="contained"
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<ExternalLink size={16} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1,
                    bgcolor: getPriorityColor(rec.priority),
                    "&:hover": {
                      bgcolor: getPriorityColor(rec.priority),
                      opacity: 0.9,
                    },
                  }}
                >
                  Start Solving
                </Button>
              </Paper>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedRecommendations;
