import { useState } from 'react'
import { Search, TrendingUp, Award, Clock, BarChart3, Users, Lightbulb, Target } from 'lucide-react'
import { leetcodeService, type UserStats } from '../services/api'
import StatsCard from '../components/StatsCard'
import DifficultyChart from '../components/charts/DifficultyChart'
import SkillsChart from '../components/charts/SkillsChart'
import ProgressChart from '../components/charts/ProgressChart'

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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          LeetCode Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Visualize your coding journey, track progress, and discover insights from your LeetCode performance
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Enter LeetCode username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Analyze'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {userStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Solved</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">--%</p>
              </div>
              <Award className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {userStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Difficulty Distribution */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Problems by Difficulty
            </h3>
            <div className="h-64">
              <DifficultyChart
                easy={userStats.easySolved}
                medium={userStats.mediumSolved}
                hard={userStats.hardSolved}
                className="h-full"
              />
            </div>
          </div>

          {/* Skills Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="h-64">
              <SkillsChart
                skills={userStats.skillStats}
                className="h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Progress Chart */}
      {userStats && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="h-64">
            <ProgressChart
              submissionCalendar={userStats.submissionCalendar}
              className="h-full"
            />
          </div>
        </div>
      )}

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Get Started with Your Analytics
        </h2>
        <p className="text-gray-600 mb-6">
          Enter a LeetCode username above to begin exploring detailed analytics, progress tracking, and personalized recommendations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Visual Analytics</h3>
            <p className="text-sm text-gray-600">Interactive charts and insights</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">User Comparison</h3>
            <p className="text-sm text-gray-600">Compare with other developers</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Smart Recommendations</h3>
            <p className="text-sm text-gray-600">AI-powered problem suggestions</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
