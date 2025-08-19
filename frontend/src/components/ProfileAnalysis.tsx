import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Divider,
} from "@mui/material";
import { TrendingUp, Target, Star, Award, Calendar } from "lucide-react";
import type { UserStats } from "../services/api";

interface ProfileAnalysisProps {
  userStats: UserStats;
}

const ProfileAnalysis = ({ userStats }: ProfileAnalysisProps) => {
  // Safety checks for undefined data
  if (!userStats) return null;

  const streakData = userStats.streakData || {
    currentStreak: 0,
    longestStreak: 0,
    totalActiveDays: 0,
    averageSubmissionsPerDay: "0",
  };

  const languageStats = userStats.languageStats || [];
  const badges = userStats.badges || [];

  const getStreakColor = (streak: number) => {
    if (streak >= 10) return "success.main";
    if (streak >= 5) return "warning.main";
    return "text.secondary";
  };

  const getPhaseProgress = () => {
    const total = userStats.totalSolved || 0;
    if (total < 50)
      return { phase: "Beginner", progress: (total / 50) * 100, next: 50 };
    if (total < 150)
      return {
        phase: "Intermediate",
        progress: ((total - 50) / 100) * 100,
        next: 150,
      };
    if (total < 300)
      return {
        phase: "Advanced",
        progress: ((total - 150) / 150) * 100,
        next: 300,
      };
    return { phase: "Expert", progress: 100, next: null };
  };

  const phaseInfo = getPhaseProgress();

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          mb={3}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <TrendingUp size={20} />
          Profile Analysis
        </Typography>

        <Stack spacing={3}>
          {/* Progress Phase */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                Current Phase: {phaseInfo.phase}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {phaseInfo.next
                  ? `${phaseInfo.next - (userStats.totalSolved || 0)} to next level`
                  : "Max level reached!"}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={phaseInfo.progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Divider />

          {/* Streak Information */}
          <Box>
            <Typography
              variant="body2"
              fontWeight={600}
              mb={2}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Calendar size={16} />
              Activity Streaks
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Box sx={{ textAlign: "center", minWidth: 80 }}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ color: getStreakColor(streakData.currentStreak) }}
                >
                  {streakData.currentStreak}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Current
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center", minWidth: 80 }}>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {streakData.longestStreak}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Longest
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center", minWidth: 80 }}>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {streakData.totalActiveDays}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Active Days
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center", minWidth: 80 }}>
                <Typography variant="h5" fontWeight={700} color="info.main">
                  {streakData.averageSubmissionsPerDay}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg/Day
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Accuracy Analysis */}
          <Box>
            <Typography
              variant="body2"
              fontWeight={600}
              mb={2}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Target size={16} />
              Accuracy Metrics
            </Typography>
            <Stack direction="row" spacing={3}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Success Rate
                </Typography>
                <Typography variant="h6" fontWeight={600} color="success.main">
                  {userStats.acceptanceRate || "0"}%
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Overall Accuracy
                </Typography>
                <Typography variant="h6" fontWeight={600} color="primary.main">
                  {userStats.overallAcceptanceRate || "0"}%
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Attempts
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {userStats.totalAttempts?.toLocaleString() || "0"}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Language Proficiency */}
          <Box>
            <Typography variant="body2" fontWeight={600} mb={2}>
              Language Proficiency
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {languageStats.slice(0, 4).map((lang) => (
                <Chip
                  key={lang.languageName}
                  label={`${lang.languageName}: ${lang.problemsSolved}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Stack>
          </Box>

          {/* Contest Performance */}
          {userStats.contestRanking && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  mb={2}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Award size={16} />
                  Contest Performance
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Box sx={{ textAlign: "center", minWidth: 80 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="warning.main"
                    >
                      {userStats.contestRanking?.rating || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Rating
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center", minWidth: 80 }}>
                    <Typography variant="h6" fontWeight={700} color="info.main">
                      {userStats.contestRanking?.attendedContestsCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Contests
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center", minWidth: 100 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="success.main"
                    >
                      {userStats.contestRanking?.topPercentage?.toFixed(1) || "0"}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Top Percentage
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  mb={2}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Star size={16} />
                  Achievements
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {badges.slice(0, 6).map((badge) => (
                    <Chip
                      key={badge.id}
                      label={badge.displayName}
                      size="small"
                      sx={{
                        bgcolor: "primary.light",
                        color: "primary.contrastText",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileAnalysis;
