import { useState } from 'react';
import { Search, TrendingUp, Award, Clock, BarChart3, Users, Lightbulb, Target } from 'lucide-react';
import { leetcodeService, type UserStats } from '../services/api';
import StatsCard from '../components/StatsCard';
import DifficultyChart from '../components/charts/DifficultyChart';
import SkillsChart from '../components/charts/SkillsChart';
import ProgressChart from '../components/charts/ProgressChart';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';

const Dashboard = () => {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const stats = await leetcodeService.getUserStats(username.trim())
      setUserStats(stats)
    } catch (err) {
      setError('Failed to fetch user data. Please check the username and try again.')
      console.error('Error fetching user stats:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h3" component="h1" fontWeight={700} color="text.primary" mb={2}>
            LeetCode Analytics Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Visualize your coding journey, track progress, and discover insights from your LeetCode performance
          </Typography>
        </Box>

        {/* Search Section */}
        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter LeetCode username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search style={{ height: 20, width: 20, color: '#9e9e9e' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ px: 3, fontWeight: 600, textTransform: 'none' }}
            >
              {loading ? 'Loading...' : 'Analyze'}
            </Button>
          </Box>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        {userStats ? (
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <StatsCard
              title="Total Solved"
              value={userStats.totalSolved}
              subtitle={`Rank: ${userStats.ranking.toLocaleString()}`}
              icon={TrendingUp}
              color="green"
            />
            <StatsCard
              title="Acceptance Rate"
              value={`${userStats.acceptanceRate}%`}
              subtitle="Success ratio"
              icon={Target}
              color="blue"
            />
            <StatsCard
              title="Contribution"
              value={userStats.contributionPoints}
              subtitle="Community points"
              icon={Award}
              color="purple"
            />
            <StatsCard
              title="Recent Activity"
              value={userStats.recentSubmissions.length}
              subtitle="Recent submissions"
              icon={Clock}
              color="yellow"
            />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Card elevation={3} sx={{ p: 2, minWidth: 220 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Total Solved</Typography>
                  <Typography variant="h5" fontWeight={700}>--</Typography>
                </Box>
                <TrendingUp style={{ height: 32, width: 32, color: '#388e3c' }} />
              </CardContent>
            </Card>
            <Card elevation={3} sx={{ p: 2, minWidth: 220 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Success Rate</Typography>
                  <Typography variant="h5" fontWeight={700}>--%</Typography>
                </Box>
                <Award style={{ height: 32, width: 32, color: '#1976d2' }} />
              </CardContent>
            </Card>
            <Card elevation={3} sx={{ p: 2, minWidth: 220 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Recent Activity</Typography>
                  <Typography variant="h5" fontWeight={700}>--</Typography>
                </Box>
                <Clock style={{ height: 32, width: 32, color: '#7b1fa2' }} />
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Charts Section */}
        {userStats && (
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Difficulty Distribution */}
            <Card elevation={3} sx={{ p: 3, flex: '1 1 400px', maxWidth: 500 }}>
              <Typography variant="h6" fontWeight={600} color="text.primary" mb={3}>
                Problems by Difficulty
              </Typography>
              <Box sx={{ height: 300 }}>
                <DifficultyChart
                  easy={userStats.easySolved}
                  medium={userStats.mediumSolved}
                  hard={userStats.hardSolved}
                  className="h-full"
                />
              </Box>
            </Card>

            {/* Skills Chart */}
            <Card elevation={3} sx={{ p: 3, flex: '1 1 400px', maxWidth: 500 }}>
              <Box sx={{ height: 300 }}>
                <SkillsChart
                  skills={userStats.skillStats}
                  className="h-full"
                />
              </Box>
            </Card>
          </Box>
        )}

        {/* Progress Chart */}
        {userStats && (
          <Card elevation={3} sx={{ p: 3 }}>
            <Box sx={{ height: 300 }}>
              <ProgressChart
                submissionCalendar={userStats.submissionCalendar}
                className="h-full"
              />
            </Box>
          </Card>
        )}

        {/* Getting Started */}
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(45deg, #e3f2fd 30%, #f3e5f5 90%)' }}>
          <Typography variant="h4" fontWeight={700} color="text.primary" mb={2}>
            Get Started with Your Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4} sx={{ maxWidth: 600, mx: 'auto' }}>
            Enter a LeetCode username above to begin exploring detailed analytics, progress tracking, and personalized recommendations.
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', mt: 4 }}>
            <Box sx={{ textAlign: 'center', maxWidth: 200 }}>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: '#e3f2fd', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mx: 'auto', 
                mb: 2 
              }}>
                <BarChart3 style={{ height: 28, width: 28, color: '#1976d2' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} color="text.primary" mb={1}>
                Visual Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interactive charts and insights
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', maxWidth: 200 }}>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: '#e3f2fd', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mx: 'auto', 
                mb: 2 
              }}>
                <Users style={{ height: 28, width: 28, color: '#1976d2' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} color="text.primary" mb={1}>
                User Comparison
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compare with other developers
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', maxWidth: 200 }}>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: '#e3f2fd', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mx: 'auto', 
                mb: 2 
              }}>
                <Lightbulb style={{ height: 28, width: 28, color: '#1976d2' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} color="text.primary" mb={1}>
                Smart Recommendations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered problem suggestions
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard
