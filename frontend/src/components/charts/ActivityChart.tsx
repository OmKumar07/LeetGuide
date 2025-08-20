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
  Filler,
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
  Legend,
  Filler
);

interface ActivityChartProps {
  submissionCalendar: Array<{
    date: string;
    count: number;
  }>;
  averagePerDay: string;
}

const ActivityChart = ({
  submissionCalendar,
  averagePerDay,
}: ActivityChartProps) => {
  console.log("ActivityChart - averagePerDay:", averagePerDay);
  console.log("ActivityChart - submissionCalendar:", submissionCalendar);

  // Always use the last 7 days of data (backend now guarantees 7 days)
  // If backend provides less than 7 days, fill with zeros
  let last7Days = [];

  if (submissionCalendar.length >= 7) {
    last7Days = submissionCalendar.slice(-7);
  } else {
    // Fill missing days with zeros if less than 7 days provided
    const today = new Date();
    last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Find if this date exists in the provided data
      const existingData = submissionCalendar.find(
        (entry) => entry.date === dateStr
      );

      last7Days.push({
        date: dateStr,
        count: existingData ? existingData.count : 0,
      });
    }
  }

  // Format dates for display
  const formattedLast7Days = last7Days.map((entry) => ({
    ...entry,
    date: new Date(entry.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  console.log("ActivityChart - formattedLast7Days:", formattedLast7Days);

  // Calculate moving averages for trend line
  const calculateMovingAverage = (data: number[], windowSize: number = 7) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const window = data.slice(start, i + 1);
      const average = window.reduce((sum, val) => sum + val, 0) / window.length;
      result.push(average);
    }
    return result;
  };

  const dailyCounts = formattedLast7Days.map((entry) => entry.count);
  const movingAverages = calculateMovingAverage(dailyCounts);

  const data = {
    labels: formattedLast7Days.map((entry) => entry.date),
    datasets: [
      {
        label: "Daily Submissions",
        data: dailyCounts,
        borderColor: "rgba(59, 130, 246, 0.8)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "7-Day Average",
        data: movingAverages,
        borderColor: "rgba(16, 185, 129, 0.8)",
        backgroundColor: "transparent",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      title: {
        display: true,
        text: `Past 7 Days Activity (Avg: ${averagePerDay}/day)`,
        font: {
          size: 16,
          weight: 600,
        },
        padding: 20,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(59, 130, 246, 0.8)",
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            if (label === "7-Day Average") {
              return `${label}: ${value.toFixed(1)} problems`;
            }
            return `${label}: ${value} problems`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        ticks: {
          stepSize: 1,
          callback: (value) => `${value}`,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        title: {
          display: true,
          text: "Problems Solved",
          font: {
            weight: 600,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
        },
        title: {
          display: true,
          text: "Date",
          font: {
            weight: 600,
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <Line data={data} options={options} />
    </Box>
  );
};

export default ActivityChart;
