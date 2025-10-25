import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ScoreDistributionBin } from '../types/dashboard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ScoreDistributionChartProps {
  distribution: ScoreDistributionBin[];
}

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ distribution }) => {
  const labels = distribution.map(bin => bin.label);
  const counts = distribution.map(bin => bin.count);

  const data = {
    labels,
    datasets: [
      {
        label: 'จำนวนผู้เรียน',
        data: counts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options: React.ComponentProps<typeof Bar>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'การกระจายคะแนน (Score Distribution)',
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <Bar data={data} options={options} />
    </div>
  );
};
