import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

function ChartComponent({ scores }) {
  const chartData = useMemo(() => {
    return {
      labels: ["Activity", "Code", "Diversity", "Community"],
      datasets: [
        {
          label: "Score",
          data: [
            scores.activity,
            scores.codeQuality,
            scores.diversity,
            scores.community,
          ],
          backgroundColor: "rgba(34,197,94,0.2)",
          borderColor: "#22c55e",
          borderWidth: 2,
        },
      ],
    };
  }, [scores]);

  const options = {
    animation: false,
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { display: false },
        grid: { color: "#333" },
        pointLabels: { color: "#fff" },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return <Radar data={chartData} options={options} />;
}

export default ChartComponent;