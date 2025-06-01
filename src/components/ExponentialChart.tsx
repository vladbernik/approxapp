import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// eslint-disable-next-line react/prop-types
export function ExponentialChart({ data, a, b }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data.length && a !== null && b !== null) {
      const aValues = data.slice(1).map((row) => parseFloat(row[a]));
      const bValues = data.slice(1).map((row) => parseFloat(row[b]));

      const chartPoints = aValues.map((x, index) => {
        const y = bValues[index];
        return { x, y };
      });

      const chartData = {
        datasets: [
          {
            label: 'Экспоненциальная функция',
            data: chartPoints,
            fill: false,
            borderColor: 'blue',
            showLine: true,
          },
        ],
      };

      setChartData(chartData);
    }
  }, [data, a, b]);

  return chartData ? (
    <Line
      data={chartData}
      options={{
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Значения a',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Экспоненциальная функция',
            },
          },
        },
      }}
    />
  ) : (
    <p>Выберите параметры a и b.</p>
  );
}
