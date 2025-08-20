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

interface ProgressChartProps {
  submissionCalendar: Array<{
    date: string;
    count: number;
  }>;
}

const ProgressChart = ({ submissionCalendar }: ProgressChartProps) => {
  console.log("ProgressChart - submissionCalendar:", submissionCalendar);
  
  // Always use the last 30 days of data (backend now guarantees 30 days)
  // If backend provides less than 30 days, fill with zeros
  let last30Days = [];
  
  if (submissionCalendar.length >= 30) {
    last30Days = submissionCalendar.slice(-30);
  } else {
    // Fill missing days with zeros if less than 30 days provided
    const today = new Date();
    last30Days = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      // Find if this date exists in the provided data
      const existingData = submissionCalendar.find(entry => entry.date === dateStr);
      
      last30Days.push({
        date: dateStr,
        count: existingData ? existingData.count : 0
      });
    }
  }
  
  console.log("ProgressChart - last30Days length:", last30Days.length);
  console.log("ProgressChart - first 5 days:", last30Days.slice(0, 5));
  console.log("ProgressChart - last 5 days:", last30Days.slice(-5));

  const data = {
    labels: last30Days.map((item) => {
      const d = new Date(item.date);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    datasets: [
      {
        label: "Problems Solved",
        data: last30Days.map((item) => item.count),
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
        min: 0,
        ticks: {
          stepSize: 1,
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
  };

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <Line data={data} options={options} />
    </Box>
  );
};

export default ProgressChart;
