import React, { useCallback } from "react";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type DefaultDataPoint,
  type Plugin,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { ILegendProps } from "./StaffDistributionContainer";

ChartJS.register(ArcElement, Tooltip, Legend);

type ChartType = ChartJS<"doughnut", DefaultDataPoint<"doughnut">, unknown>;
interface IChartProps {
  data: ILegendProps[];
  total: number;
}
export const StaffDistributionChart: React.FC<IChartProps> = ({
  data: chartData, 
  total
}) => {
  
  // console.log(chartData, total);

  const convertToPercentage = useCallback(
    (value: number) => {
      return (value / total) * 100;
    },
    [total],
  );
  const data = {
    labels: chartData.map((d) => d.title),
    datasets: [
      {
        data: chartData.map((d) => convertToPercentage(d.count).toFixed(1)),
        backgroundColor: [
          "#2684FF", // blue-500
          "#36B37E", // emerald-500
          " #6554C0", // purple-400
          "#253858", // gray-600
          "#FF991F", // orange-400
        ],
        borderColor: ["#2684FF", "#36B37E", " #6554C0", "#253858", "#FF991F"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 16, weight: "bold", family: "Arial" },
        bodyFont: { size: 14, family: "Arial" },
        padding: 10,
        cornerRadius: 4,
      },
    },
    cutout: "60%",
    radius: "90%",
  };

  const textCenter: Plugin<"doughnut"> = {
    id: "textCenter",
    beforeDraw(chart: ChartType) {
      const { ctx, chartArea } = chart;
      const { left, top, width, height } = chartArea;

      ctx.save();
      ctx.font = "bold 30px Arial"; // Using Arial font
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(total), left + width / 2, top + height / 2);
      ctx.restore();
    },
  };

  const percentageLabels: Plugin<"doughnut"> = {
    id: "percentageLabels",
    afterDraw(chart: ChartType) {
      const { ctx } = chart;
      const dataset = chart.data.datasets[0];
      const meta = chart.getDatasetMeta(0);

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 14px Arial";
      ctx.fillStyle = "white";

      meta.data.forEach((element, index) => {
        // @ts-expect-error - Chart.js types are incomplete
        const angle = (element.startAngle + element.endAngle) / 2;
        const radius = (chart.chartArea.width / 2) * 0.7;
        const labelX =
          chart.chartArea.left +
          chart.chartArea.width / 2 +
          Math.cos(angle) * radius;
        const labelY =
          chart.chartArea.top +
          chart.chartArea.height / 2 +
          Math.sin(angle) * radius;

        ctx.fillText(`${dataset.data[index]}%`, labelX, labelY);
      });

      ctx.restore();
    },
  };

  return (
    <div className="">
      <Doughnut
        key={total}
        data={data}
        // @ts-expect-error - Chart.js types are incomplete
        options={options}
        plugins={[textCenter, percentageLabels]}
      />
    </div>
  );
};
