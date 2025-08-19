import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Box } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  submissionCalendar: Record<string, number>;
}

const ProgressChart = ({ submissionCalendar }: ProgressChartProps) => {
  // Convert calendar data to chart format
  const sortedDates = Object.keys(submissionCalendar).sort();
  const last30Days = sortedDates.slice(-30);

  const data = {
    labels: last30Days.map((date) => {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    datasets: [
      {
        label: "Problems Solved",
        data: last30Days.map((date) => submissionCalendar[date] || 0),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Submission Activity (Last 30 Days)",
        font: {
          size: 16,
          weight: 600,
        },
        padding: 20,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => {
            return `${context.parsed.y} problems solved`;
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
        },
      },
    },
  };

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <Line data={data} options={options} />
    </Box>
  );
};

export default ProgressChart;
