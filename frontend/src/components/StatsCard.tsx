import { type LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow'
  trend?: {
    value: number
    label: string
  }
  className?: string
}

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
  className = '',
}: StatsCardProps) => {
  const colorClasses = {
    blue: {
      icon: 'text-blue-500',
      bg: 'bg-blue-50',
      trend: 'text-blue-600',
    },
    green: {
      icon: 'text-green-500',
      bg: 'bg-green-50',
      trend: 'text-green-600',
    },
    purple: {
      icon: 'text-purple-500',
      bg: 'bg-purple-50',
      trend: 'text-purple-600',
    },
    red: {
      icon: 'text-red-500',
      bg: 'bg-red-50',
      trend: 'text-red-600',
    },
    yellow: {
      icon: 'text-yellow-500',
      bg: 'bg-yellow-50',
      trend: 'text-yellow-600',
    },
  }

  const colors = colorClasses[color]

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-xl ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-xs ${colors.trend}`}>
              <span className="font-medium">
                {trend.value > 0 ? '+' : ''}{trend.value}
              </span>
              <span className="ml-1 text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colors.bg}`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  )
}

export default StatsCard
