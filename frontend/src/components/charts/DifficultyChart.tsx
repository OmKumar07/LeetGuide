import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface DifficultyChartProps {
  easy: number
  medium: number
  hard: number
  className?: string
}

const DifficultyChart = ({ easy, medium, hard, className = '' }: DifficultyChartProps) => {
  const data = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [easy, medium, hard],
        backgroundColor: [
          '#00b8a3', // LeetCode easy color
          '#ffb800', // LeetCode medium color
          '#ff375f', // LeetCode hard color
        ],
        borderColor: [
          '#00a693',
          '#e6a600',
          '#e6334f',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#00c9b3',
          '#ffc333',
          '#ff5577',
        ],
      },
    ],
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.parsed
            const total = easy + medium + hard
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
  }

  return (
    <div className={`relative ${className}`}>
      <Doughnut data={data} options={options} />
    </div>
  )
}

export default DifficultyChart
