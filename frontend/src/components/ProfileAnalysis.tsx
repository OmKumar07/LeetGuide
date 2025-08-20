import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Paper,
  Avatar,
} from "@mui/material";
import { TrendingUp, Target, Star, Award, Calendar } from "lucide-react";
import type { UserStats } from "../services/api";
import { leetcodeColors } from "../theme/theme";

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
    past7DaysSubmissions: 0,
    past7DaysActiveDays: 0,
  };

  const badges = userStats.badges || [];

  const getStreakColor = (streak: number) => {
    if (streak >= 10) return leetcodeColors.easy;
    if (streak >= 5) return leetcodeColors.medium;
    return "#9CA3AF";
  };

  const getPhaseProgress = () => {
    const total = userStats.totalSolved || 0;
    if (total < 50)
      return {
        phase: "Beginner",
        progress: (total / 50) * 100,
        next: 50,
        color: leetcodeColors.easy,
        icon: "🌱",
      };
    if (total < 150)
      return {
        phase: "Intermediate",
        progress: ((total - 50) / 100) * 100,
        next: 150,
        color: leetcodeColors.medium,
        icon: "🚀",
      };
    if (total < 300)
      return {
        phase: "Advanced",
        progress: ((total - 150) / 150) * 100,
        next: 300,
        color: leetcodeColors.hard,
        icon: "⚡",
      };
    return {
      phase: "Expert",
      progress: 100,
      next: null,
      color: leetcodeColors.leetcodeOrange,
      icon: "👑",
    };
  };

  const phaseInfo = getPhaseProgress();

  // Debug logging
  console.log("ProfileAnalysis - phaseInfo:", phaseInfo);
  console.log("ProfileAnalysis - progress value:", phaseInfo.progress);
  console.log("ProfileAnalysis - color:", phaseInfo.color);

  return (
    <Card
      sx={{
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(255, 161, 22, 0.08) 0%, rgba(0, 175, 155, 0.08) 50%, rgba(14, 165, 233, 0.08) 100%)"
            : "linear-gradient(135deg, rgba(255, 161, 22, 0.03) 0%, rgba(0, 175, 155, 0.03) 50%, rgba(14, 165, 233, 0.03) 100%)",
        border: (theme) =>
          theme.palette.mode === "dark"
            ? `1px solid rgba(255, 161, 22, 0.2)`
            : `1px solid rgba(255, 161, 22, 0.1)`,
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${leetcodeColors.leetcodeOrange} 0%, ${leetcodeColors.leetcodeGreen} 50%, ${leetcodeColors.leetcodeBlue} 100%)`,
        },
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
            : "0 8px 32px rgba(0, 0, 0, 0.04)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 12px 48px rgba(0, 0, 0, 0.4)"
              : "0 12px 48px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header Section */}
        <Box
          sx={{
            background: (theme) =>
              theme.palette.mode === "dark"
                ? `linear-gradient(135deg, ${leetcodeColors.leetcodeOrange}12 0%, ${leetcodeColors.leetcodeGreen}12 50%, ${leetcodeColors.leetcodeBlue}12 100%)`
                : `linear-gradient(135deg, ${leetcodeColors.leetcodeOrange}08 0%, ${leetcodeColors.leetcodeGreen}08 50%, ${leetcodeColors.leetcodeBlue}08 100%)`,
            p: 4,
            borderBottom: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255, 161, 22, 0.15)"
                : "1px solid rgba(255, 161, 22, 0.08)",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "2px",
              background: `linear-gradient(90deg, ${leetcodeColors.leetcodeOrange} 0%, ${leetcodeColors.leetcodeGreen} 100%)`,
              borderRadius: "1px",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
            <Avatar
              sx={{
                background: `linear-gradient(135deg, ${leetcodeColors.leetcodeOrange} 0%, ${leetcodeColors.leetcodeGreen} 100%)`,
                width: 52,
                height: 52,
                fontSize: "1.4rem",
                boxShadow: `0 8px 24px ${leetcodeColors.leetcodeOrange}25`,
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? "3px solid rgba(255, 255, 255, 0.1)"
                    : "3px solid rgba(255, 255, 255, 0.8)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: `0 12px 32px ${leetcodeColors.leetcodeOrange}35`,
                },
              }}
            >
              <TrendingUp size={24} color="white" />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  color: "#FFA116",
                  fontSize: "1.75rem",
                  mb: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                Profile Analysis
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  opacity: 0.8,
                }}
              >
                Deep insights into your coding journey and performance metrics
              </Typography>
            </Box>
          </Box>

          {/* Progress Phase with Modern Design */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(30, 41, 59, 0.8)"
                  : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(255, 255, 255, 0.3)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${phaseInfo.color}05 0%, transparent 50%)`,
                pointerEvents: "none",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                mb: 3,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${phaseInfo.color}15 0%, ${phaseInfo.color}25 100%)`,
                  border: `2px solid ${phaseInfo.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  boxShadow: `0 8px 24px ${phaseInfo.color}20`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05) rotate(5deg)",
                    boxShadow: `0 12px 32px ${phaseInfo.color}30`,
                  },
                }}
              >
                {phaseInfo.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{
                    color: phaseInfo.color,
                    mb: 0.5,
                    fontSize: "1.4rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {phaseInfo.phase} Level
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                >
                  {phaseInfo.next
                    ? `${
                        phaseInfo.next - (userStats.totalSolved || 0)
                      } problems to reach ${
                        phaseInfo.next === 50
                          ? "Intermediate"
                          : phaseInfo.next === 150
                          ? "Advanced"
                          : phaseInfo.next === 300
                          ? "Expert"
                          : "Next"
                      } level`
                    : "You've mastered all levels! Keep challenging yourself! 🎉"}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Progress to Next Level
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ color: phaseInfo.color }}
                >
                  {Math.round(phaseInfo.progress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={phaseInfo.progress}
                sx={{
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.06)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 8,
                    backgroundColor: `${phaseInfo.color} !important`,
                    background: `${phaseInfo.color} !important`,
                  },
                  "& .MuiLinearProgress-bar1Determinate": {
                    backgroundColor: `${phaseInfo.color} !important`,
                    background: `${phaseInfo.color} !important`,
                  },
                }}
              />
            </Box>
          </Paper>
        </Box>

        <Box sx={{ p: 3 }}>
          <Stack spacing={4}>
            {/* Streak Metrics */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}
              >
                <Avatar
                  sx={{
                    bgcolor: leetcodeColors.leetcodeGreen,
                    width: 32,
                    height: 32,
                  }}
                >
                  <Calendar size={16} />
                </Avatar>
                <Typography variant="h6" fontWeight={700}>
                  Activity Streaks
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ flex: 1, minWidth: "120px" }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      textAlign: "center",
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${getStreakColor(
                        streakData.currentStreak
                      )}15 0%, ${getStreakColor(
                        streakData.currentStreak
                      )}25 100%)`,
                      border: `1px solid ${getStreakColor(
                        streakData.currentStreak
                      )}30`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 8px 25px ${getStreakColor(
                          streakData.currentStreak
                        )}20`,
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      sx={{
                        color: getStreakColor(streakData.currentStreak),
                        mb: 0.5,
                      }}
                    >
                      {streakData.currentStreak}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Current Streak
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ flex: 1, minWidth: "120px" }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      textAlign: "center",
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${leetcodeColors.leetcodeOrange}15 0%, ${leetcodeColors.leetcodeOrange}25 100%)`,
                      border: `1px solid ${leetcodeColors.leetcodeOrange}30`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 8px 25px ${leetcodeColors.leetcodeOrange}20`,
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      sx={{ color: leetcodeColors.leetcodeOrange, mb: 0.5 }}
                    >
                      {streakData.longestStreak}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Longest Streak
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ flex: 1, minWidth: "120px" }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      textAlign: "center",
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${leetcodeColors.leetcodeGreen}15 0%, ${leetcodeColors.leetcodeGreen}25 100%)`,
                      border: `1px solid ${leetcodeColors.leetcodeGreen}30`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 8px 25px ${leetcodeColors.leetcodeGreen}20`,
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      sx={{ color: leetcodeColors.leetcodeGreen, mb: 0.5 }}
                    >
                      {streakData.totalActiveDays}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Active Days
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Box>

            {/* Performance Metrics */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}
              >
                <Avatar
                  sx={{
                    bgcolor: leetcodeColors.leetcodeBlue,
                    width: 32,
                    height: 32,
                  }}
                >
                  <Target size={16} />
                </Avatar>
                <Typography variant="h6" fontWeight={700}>
                  Performance Metrics
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ flex: 1, minWidth: "120px" }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      background: (theme) =>
                        theme.palette.mode === "dark"
                          ? `linear-gradient(135deg, ${leetcodeColors.easy}20 0%, ${leetcodeColors.easy}30 100%)`
                          : `linear-gradient(135deg, ${leetcodeColors.easy}10 0%, ${leetcodeColors.easy}20 100%)`,
                      border: `1px solid ${leetcodeColors.easy}30`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                      mb={0.5}
                    >
                      Success Rate
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{ color: leetcodeColors.easy }}
                    >
                      {userStats.acceptanceRate || "0"}%
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, minWidth: "120px" }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      background: (theme) =>
                        theme.palette.mode === "dark"
                          ? `linear-gradient(135deg, ${leetcodeColors.leetcodeBlue}20 0%, ${leetcodeColors.leetcodeBlue}30 100%)`
                          : `linear-gradient(135deg, ${leetcodeColors.leetcodeBlue}10 0%, ${leetcodeColors.leetcodeBlue}20 100%)`,
                      border: `1px solid ${leetcodeColors.leetcodeBlue}30`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                      mb={0.5}
                    >
                      Overall Accuracy
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{ color: leetcodeColors.leetcodeBlue }}
                    >
                      {userStats.overallAcceptanceRate || "0"}%
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, minWidth: "120px" }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      background: (theme) =>
                        theme.palette.mode === "dark"
                          ? "linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(156, 163, 175, 0.3) 100%)"
                          : "linear-gradient(135deg, rgba(156, 163, 175, 0.1) 0%, rgba(156, 163, 175, 0.2) 100%)",
                      border: (theme) =>
                        theme.palette.mode === "dark"
                          ? "1px solid rgba(156, 163, 175, 0.4)"
                          : "1px solid rgba(156, 163, 175, 0.3)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                      mb={0.5}
                    >
                      Total Attempts
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {userStats.totalAttempts?.toLocaleString() || "0"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Top Skills */}
            {userStats.skillStats && userStats.skillStats.length > 0 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Avatar
                    sx={{ bgcolor: leetcodeColors.hard, width: 32, height: 32 }}
                  >
                    <Target size={16} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700}>
                    Top Problem Topics
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                  {userStats.skillStats.slice(0, 6).map((skill, index) => (
                    <Chip
                      key={skill.name}
                      label={`${skill.name}: ${skill.solved || 0}`}
                      size="medium"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        background:
                          index % 3 === 0
                            ? `linear-gradient(135deg, ${leetcodeColors.easy}20 0%, ${leetcodeColors.easy}30 100%)`
                            : index % 3 === 1
                            ? `linear-gradient(135deg, ${leetcodeColors.medium}20 0%, ${leetcodeColors.medium}30 100%)`
                            : `linear-gradient(135deg, ${leetcodeColors.hard}20 0%, ${leetcodeColors.hard}30 100%)`,
                        border:
                          index % 3 === 0
                            ? `1px solid ${leetcodeColors.easy}40`
                            : index % 3 === 1
                            ? `1px solid ${leetcodeColors.medium}40`
                            : `1px solid ${leetcodeColors.hard}40`,
                        color:
                          index % 3 === 0
                            ? leetcodeColors.easy
                            : index % 3 === 1
                            ? leetcodeColors.medium
                            : leetcodeColors.hard,
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow:
                            index % 3 === 0
                              ? `0 4px 12px ${leetcodeColors.easy}20`
                              : index % 3 === 1
                              ? `0 4px 12px ${leetcodeColors.medium}20`
                              : `0 4px 12px ${leetcodeColors.hard}20`,
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Contest Performance */}
            {userStats.contestRanking && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: leetcodeColors.medium,
                      width: 32,
                      height: 32,
                    }}
                  >
                    <Award size={16} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700}>
                    Contest Performance
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ flex: 1, minWidth: "120px" }}>
                    <Box
                      sx={{
                        p: 2.5,
                        textAlign: "center",
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${leetcodeColors.medium}15 0%, ${leetcodeColors.medium}25 100%)`,
                        border: `1px solid ${leetcodeColors.medium}30`,
                      }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: leetcodeColors.medium, mb: 0.5 }}
                      >
                        {userStats.contestRanking?.rating || 0}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Rating
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ flex: 1, minWidth: "120px" }}>
                    <Box
                      sx={{
                        p: 2.5,
                        textAlign: "center",
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${leetcodeColors.leetcodeBlue}15 0%, ${leetcodeColors.leetcodeBlue}25 100%)`,
                        border: `1px solid ${leetcodeColors.leetcodeBlue}30`,
                      }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: leetcodeColors.leetcodeBlue, mb: 0.5 }}
                      >
                        {userStats.contestRanking?.attendedContestsCount || 0}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Contests
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ flex: 1, minWidth: "120px" }}>
                    <Box
                      sx={{
                        p: 2.5,
                        textAlign: "center",
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${leetcodeColors.easy}15 0%, ${leetcodeColors.easy}25 100%)`,
                        border: `1px solid ${leetcodeColors.easy}30`,
                      }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: leetcodeColors.easy, mb: 0.5 }}
                      >
                        {userStats.contestRanking?.topPercentage?.toFixed(1) ||
                          "0"}
                        %
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Top Percentage
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Badges */}
            {badges.length > 0 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: leetcodeColors.leetcodeOrange,
                      width: 32,
                      height: 32,
                    }}
                  >
                    <Star size={16} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700}>
                    Achievements
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                  {badges.slice(0, 6).map((badge) => (
                    <Chip
                      key={badge.id}
                      label={badge.displayName}
                      size="medium"
                      sx={{
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${leetcodeColors.leetcodeOrange}20 0%, ${leetcodeColors.leetcodeOrange}30 100%)`,
                        border: `1px solid ${leetcodeColors.leetcodeOrange}40`,
                        color: leetcodeColors.leetcodeOrange,
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: `0 4px 12px ${leetcodeColors.leetcodeOrange}20`,
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileAnalysis;
