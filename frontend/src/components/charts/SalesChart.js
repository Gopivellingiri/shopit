import React from "react";
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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = ({ salesData }) => {
  // const salesData = [
  //   { date: "2024-09-01T00:00:00.000Z", sales: 100, numOrders: 1 },
  //   { date: "2024-09-02T00:00:00.000Z", sales: 200, numOrders: 2 },
  //   { date: "2024-09-03T00:00:00.000Z", sales: 150, numOrders: 3 },
  //   { date: "2024-09-04T00:00:00.000Z", sales: 120, numOrders: 2 },
  //   // ...and so on
  // ];
  // Use native Date methods for formatting
  const labels = salesData
    ? salesData.map((item) =>
        new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      )
    : [];

  const sales = salesData ? salesData.map((item) => item.sales) : [];
  const orders = salesData ? salesData.map((item) => item.numOrders) : [];

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: sales,
        fill: false,
        borderColor: "#198753",
        yAxisID: "y-axis-1",
      },
      {
        label: "Orders",
        data: orders,
        fill: false,
        borderColor: "#dc3545",
        yAxisID: "y-axis-2",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      "y-axis-1": {
        type: "linear",
        position: "left",
      },
      "y-axis-2": {
        type: "linear",
        position: "right",
        grid: {
          drawOnChartArea: false, // Avoids grid lines over the chart
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default SalesChart;
