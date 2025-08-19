import { useState } from 'react'
import { Lightbulb, Target, Brain, Zap } from 'lucide-react'

const Recommendations = () => {
  const [username, setUsername] = useState('')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const [loading, setLoading] = useState(false)

  const handleGetRecommendations = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    
    setLoading(true)
    // TODO: Implement API call to get recommendations
    setTimeout(() => setLoading(false), 2000) // Simulate API call
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Smart Recommendations
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get AI-powered problem recommendations based on your solving patterns and areas for improvement
        </p>
      </div>

      {/* Input Section */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleGetRecommendations} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="LeetCode username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Topic (optional)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              aria-label="Select difficulty level"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              <span>{loading ? 'Analyzing...' : 'Get Recommendations'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recommendation Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Weakness-Based</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Problems targeting your weakest topics and patterns
          </p>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Coming soon...</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Skill Building</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Progressive problems to build specific algorithm skills
          </p>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Coming soon...</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="h-6 w-6 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Wins</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Problems similar to ones you've solved for confidence building
          </p>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Coming soon...</div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How Smart Recommendations Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-lg font-bold text-purple-600">1</span>
            </div>
            <h3 className="font-semibold text-gray-900">Analyze Profile</h3>
            <p className="text-sm text-gray-600">Study your solving patterns and performance</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-lg font-bold text-purple-600">2</span>
            </div>
            <h3 className="font-semibold text-gray-900">Identify Gaps</h3>
            <p className="text-sm text-gray-600">Find weak areas and improvement opportunities</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-lg font-bold text-purple-600">3</span>
            </div>
            <h3 className="font-semibold text-gray-900">AI Processing</h3>
            <p className="text-sm text-gray-600">Use NLP to match problems to your needs</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-lg font-bold text-purple-600">4</span>
            </div>
            <h3 className="font-semibold text-gray-900">Personalized Suggestions</h3>
            <p className="text-sm text-gray-600">Get curated problem recommendations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recommendations
