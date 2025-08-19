import { useState } from 'react'
import { Search, GitCompare, TrendingUp } from 'lucide-react'

const Compare = () => {
  const [user1, setUser1] = useState('')
  const [user2, setUser2] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user1.trim() || !user2.trim()) return
    
    setLoading(true)
    // TODO: Implement API call to compare users
    setTimeout(() => setLoading(false), 2000) // Simulate API call
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          User Comparison
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Compare two LeetCode users side-by-side to analyze strengths, weaknesses, and progress trends
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleCompare} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="First username"
                value={user1}
                onChange={(e) => setUser1(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Second username"
                value={user2}
                onChange={(e) => setUser2(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <GitCompare className="h-4 w-4" />
              <span>{loading ? 'Comparing...' : 'Compare Users'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comparison Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User 1</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Solved:</span>
              <span className="font-semibold">--</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Easy:</span>
              <span className="font-semibold text-leetcode-easy">--</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Medium:</span>
              <span className="font-semibold text-leetcode-medium">--</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hard:</span>
              <span className="font-semibold text-leetcode-hard">--</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User 2</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Solved:</span>
              <span className="font-semibold">--</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Easy:</span>
              <span className="font-semibold text-leetcode-easy">--</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Medium:</span>
              <span className="font-semibold text-leetcode-medium">--</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hard:</span>
              <span className="font-semibold text-leetcode-hard">--</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Comparison Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Progress Trends</h3>
            <p className="text-sm text-gray-600">Track solving patterns over time</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <GitCompare className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Side-by-Side Analysis</h3>
            <p className="text-sm text-gray-600">Direct performance comparison</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Detailed Insights</h3>
            <p className="text-sm text-gray-600">Identify strengths and gaps</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Compare
