import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './BarGraphic.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function BarChart ({ data }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      label: 'Ocupación de Camas (%)',
      data: Object.values(data),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ocupación de Camas por Sala (%)',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.raw + '%';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div style={{ width: '50%', height: '400px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

