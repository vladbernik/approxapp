import { Line } from 'react-chartjs-2';

interface Props {
  original: { x: number; y: number }[];
  approximation: { x: number; y: number }[];
  approxLabel?: string;
}

export function ChartRenderer({ original, approximation, approxLabel }: Props) {
  return (
    <Line
      data={{
        labels: original.map((point) => point.x),
        datasets: [
          {
            label: 'Исходные данные',
            data: original.map((p) => p.y),
            borderColor: 'blue',
            fill: false,
          },
          {
            label: approxLabel || 'Аппроксимация',
            data: approximation.map((p) => p.y),
            borderColor: 'red',
            fill: false,
          },
        ],
      }}
    />
  );
}
