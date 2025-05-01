'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DailyForecastProps {
  dailyData: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

const DailyForecast = ({ dailyData }: DailyForecastProps) => {
  const dates = dailyData.time.map(date => format(new Date(date), 'EEE, MMM d'));

  const temperatureData = {
    labels: dates,
    datasets: [
      {
        label: 'Max Temperature (°C)',
        data: dailyData.temperature_2m_max,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Min Temperature (°C)',
        data: dailyData.temperature_2m_min,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4,
        yAxisID: 'y',
      },
    ],
  };

  const precipitationData = {
    labels: dates,
    datasets: [
      {
        label: 'Precipitation Probability (%)',
        data: dailyData.precipitation_probability_max,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Probability (%)'
        }
      },
    },
  };

  const getPrecipitationIcon = (probability: number) => {
    if (probability >= 80) return '🌧️';
    if (probability >= 50) return '🌦️';
    if (probability >= 20) return '⛅';
    return '☀️';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Temperature Forecast</h3>
        <Line options={options} data={temperatureData} />
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Precipitation Probability</h3>
        <Line options={options} data={precipitationData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dailyData.time.map((date, index) => (
          <div key={date} className="bg-white rounded-lg shadow-lg p-4">
            <h4 className="text-lg font-semibold mb-2">
              {format(new Date(date), 'EEEE, MMM d')}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Max:</p>
                <p className="text-sm font-medium">{dailyData.temperature_2m_max[index]}°C</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Min:</p>
                <p className="text-sm font-medium">{dailyData.temperature_2m_min[index]}°C</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Rain Chance:</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getPrecipitationIcon(dailyData.precipitation_probability_max[index])}</span>
                  <p className={`text-sm font-medium ${dailyData.precipitation_probability_max[index] > 50 ? 'text-blue-600' : 'text-gray-600'}`}>
                    {dailyData.precipitation_probability_max[index]}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast; 