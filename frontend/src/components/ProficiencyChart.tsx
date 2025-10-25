import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProficiencyChartProps {
  proficiencyLevels: Record<string, number>;
}

export const ProficiencyChart: React.FC<ProficiencyChartProps> = ({ proficiencyLevels }) => {
  const labels = Object.keys(proficiencyLevels);
  const values = Object.values(proficiencyLevels);

  const colorMap: Record<string, string> = {
    beginner: 'rgba(255, 99, 132, 0.8)',
    intermediate: 'rgba(255, 206, 86, 0.8)',
    advanced: 'rgba(54, 162, 235, 0.8)',
    expert: 'rgba(75, 192, 192, 0.8)',
  };

  const backgroundColors = labels.map(label => colorMap[label] || 'rgba(201, 203, 207, 0.8)');

  const data = {
    labels,
    datasets: [
      {
        label: 'จำนวนผู้เรียน',
        data: values,
        backgroundColor: backgroundColors,
        borderWidth: 2,
      },
    ],
  };

  const options: React.ComponentProps<typeof Doughnut>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'ระดับความสามารถของผู้เรียน (Proficiency Distribution)',
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <Doughnut data={data} options={options} />
    </div>
  );
};
