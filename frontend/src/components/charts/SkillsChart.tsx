import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface SkillsChartProps {
  skills: Array<{
    tagName: string
    problemsSolved: number
  }>
  className?: string
}

const SkillsChart = ({ skills, className = '' }: SkillsChartProps) => {
  const sortedSkills = skills
    .sort((a, b) => b.problemsSolved - a.problemsSolved)
    .slice(0, 10) // Show top 10 skills

  const data = {
    labels: sortedSkills.map(skill => skill.tagName),
    datasets: [
      {
        label: 'Problems Solved',
        data: sortedSkills.map(skill => skill.problemsSolved),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top Skills by Problems Solved',
        font: {
          size: 16,
          weight: 600,
        },
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.parsed.y} problems solved`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  }

  return (
    <div className={`relative ${className}`}>
      <Bar data={data} options={options} />
    </div>
  )
}

export default SkillsChart
