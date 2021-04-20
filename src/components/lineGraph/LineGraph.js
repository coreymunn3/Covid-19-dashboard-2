import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import covidAPI from '../../api';
import { sortDates } from '../../utils/sort';
import caseTypeMetadata from '../../utils/caseTypeMetadata';

const LineGraph = ({ activeMeasure }) => {
  const [rawHistoricalData, setRawHistoricalData] = useState(null);
  const [chartData, setChartData] = useState(null);

  // creating an array of dat a points in [{x: data, y:data}] format from object with date keys
  const transformDataForLineChart = (data) => {
    const dateKeys = Object.keys(data[activeMeasure]);
    const sortedDateKeys = sortDates(dateKeys);
    const chartData = [];
    let lastDataPoint;
    sortedDateKeys.map((date) => {
      if (lastDataPoint) {
        chartData.push({
          x: date,
          y: lastDataPoint - data[activeMeasure][date],
        });
      }
      lastDataPoint = data[activeMeasure][date];
    });
    return chartData;
  };

  // get raw historical data on first load
  useEffect(() => {
    const getLineGraphData = async () => {
      const { data } = await covidAPI.getHistoricalData(60);
      setRawHistoricalData(data);
    };
    getLineGraphData();
  }, []);

  // transform & create chart data whenever active measure changes, or if raw historical data is loaded, but only if historical data exists
  useEffect(() => {
    if (rawHistoricalData) {
      setChartData(transformDataForLineChart(rawHistoricalData));
    }
  }, [activeMeasure, rawHistoricalData]);

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
    <Line
      options={options}
      data={{
        datasets: [
          {
            fill: true,
            borderColor: caseTypeMetadata[activeMeasure].border,
            backgroundColor: caseTypeMetadata[activeMeasure].fill,
            data: chartData,
          },
        ],
      }}
    />
  );
};

export default LineGraph;
