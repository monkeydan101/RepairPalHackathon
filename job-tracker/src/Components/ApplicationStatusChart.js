import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ApplicationStatusChart = ({ applications }) => {
  const statusCounts = applications.reduce(
    (counts, app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
      return counts;
    },
    { Pending: 0, Accepted: 0, Rejected: 0 }
  );

  const data = {
    labels: ['Pending', 'Accepted', 'Rejected'],
    datasets: [
      {
        data: [statusCounts.Pending, statusCounts.Accepted, statusCounts.Rejected],
        backgroundColor: [
          'rgba(147, 51, 234, 0.7)',  // Lighter purple for Pending
          'rgba(88, 28, 135, 0.7)',   // Darker purple for Accepted
          'rgba(192, 38, 211, 0.7)',  // Vibrant purple for Rejected
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(88, 28, 135, 1)',
          'rgba(192, 38, 211, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            family: "'Roboto', sans-serif",
          },
          color: '#4a1d96',  // Dark purple for legend text
        },
      },
      title: {
        display: true,
        text: 'Job Application Status',
        font: {
          size: 20,
          family: "'Roboto', sans-serif",
          weight: 'bold',
        },
        color: '#4a1d96',  // Dark purple for title
      },
      tooltip: {
        backgroundColor: 'rgba(107, 33, 168, 0.8)',  // Semi-transparent purple for tooltip
        titleFont: {
          size: 16,
          family: "'Roboto', sans-serif",
        },
        bodyFont: {
          size: 14,
          family: "'Roboto', sans-serif",
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: 'auto',
      padding: '20px',
      backgroundColor: 'rgba(230, 197, 243, 0.8)',  // Very light purple background
      borderRadius: '25px',
      boxShadow: '0 4px 6px rgba(74, 29, 150, 0.1)',  // Subtle purple shadow
    }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default ApplicationStatusChart;