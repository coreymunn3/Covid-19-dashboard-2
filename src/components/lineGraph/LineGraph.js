import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import covidAPI from '../../api';
import { sortDates } from '../../utils/sort';

const LineGraph = () => {
  const [chartData, setChartData] = useState(null);

  const transformDataForLineChart = (data) => {
    const dateKeys = Object.keys(data['cases']);
    const sortedDateKeys = sortDates(dateKeys);
    const chartData = [];
    let lastDataPoint;
    sortedDateKeys.map((date) => {
      if (lastDataPoint) {
        chartData.push({
          x: date,
          y: lastDataPoint - data['cases'][date],
        });
      }
      lastDataPoint = data['cases'][date];
    });
    return chartData;
  };

  useEffect(() => {
    const getLineGraphData = async () => {
      const { data } = await covidAPI.getHistoricalData(60);
      setChartData(transformDataForLineChart(data));
    };
    getLineGraphData();
  }, []);

  const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            format: 'MMDDYY',
            tooltipFormat: 'll',
          },
          gridLines: {
            display: true,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    },
  };

  return (
    <div>
      <Line
        options={options}
        data={{
          datasets: [
            {
              data: chartData,
            },
          ],
        }}
      />
    </div>
  );
};

export default LineGraph;
