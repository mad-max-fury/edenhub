import React from "react";
import { IEmployeeYearlyResultProps } from "@/redux/api";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface PerformanceChartProps {
  data?: IEmployeeYearlyResultProps[];
  className?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  className = "",
}) => {
  const chartData = {
    labels: data && data.map((d) => d.appraisalName),
    datasets: [
      {
        label: "Appraiser score",
        data: data && data.map((d) => d.appraiseeResult),
        backgroundColor: "#B3D4FF",
        borderRadius: 4,
        barPercentage: 0.8,
        categoryPercentage: 0.7,
      },
      {
        label: "Personal score",
        data: data && data.map((d) => d.employeeResult),
        backgroundColor: "#8993A4",
        borderRadius: 4,
        barPercentage: 0.8,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          font: {
            family: "'Inter', sans-serif",
          },
        },
        grid: {
          display: false,
          drawTicks: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
  };

  return (
    <div className={`h-[70%] ${className}`}>
      <Bar data={chartData} options={options} />
    </div>
  );
};
