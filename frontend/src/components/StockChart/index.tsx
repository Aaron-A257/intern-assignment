import React, { useEffect, useState } from 'react';
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
  ChartOptions,
  ChartData,
  TimeScale,
} from 'chart.js';
import { Box, Paper, Button } from '@mui/material';
import { fetchStockData } from '../../store/slices/stocksSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { log } from 'console';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useRef } from "react";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin,
);

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    zoom : {
      pan: {
        enabled: true
        
      },
      zoom:{
      wheel:{
        enabled:true
      },
      pinch:{
        enabled:true,
      },
    },
  },
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: `Stock Price Over Time`,
    },
  },
  layout: {
    padding: {
      right:26,
      left:10,
      bottom:30,
    }
  }
};

const StockChart: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const { selectedStock, selectedDuration, stockData } = useAppSelector((state) => state.stocks);
  const [chartKey, setChartKey] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Y : ", selectedStock, selectedDuration, stockData);
    if (selectedStock && selectedDuration && stockData.length === 0) {
      setLoading(true); 
      const fetchData = () => {
        dispatch(fetchStockData({ id: selectedStock, duration: selectedDuration }));
        setLoading(false);
      };
      

      // Initial fetch
      fetchData();

      // Set up interval for periodic updates
      const intervalId = setInterval(fetchData, 5000);

      // Clear interval on component unmount or when dependencies change
      return () => clearInterval(intervalId);
    }
  }, [selectedStock, selectedDuration, dispatch]);

  useEffect(() => {
    if (stockData.length > 0) {
      const lastDate = new Date(stockData[stockData.length - 1].timestamp).toLocaleDateString()
      console.log("Last date in data:", lastDate)
    }
  }, [stockData])

  const chartData: ChartData<'line'> = {
    labels: stockData.map(d => new Date(d.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Stock Price',
        data: stockData.map(d => {
          console.log("Val : ", d);
          return d.price
        }
        ),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.5,
        pointRadius: 6,  // Size of points
        pointHoverRadius: 5,
      },
    ],
  };

  options.scales = {
    y: {
      beginAtZero: false,
    },
    x: {
      title: {
        display: true,
        align: 'end',
        text: stockData.length > 0 
        ? `Last updated: ${new Date(stockData[stockData.length - 1].timestamp).toLocaleDateString()}`
        : '',
      }
    }
  };

  console.log("Current stock data", chartData.datasets[0].data);
  const chartRef = useRef<ChartJS<"line", number[], string>>(null);
  const handleZoomRest = () => {
    if (chartRef && chartRef.current) {
      chartRef.current.resetZoom();
    }
  }

  if (!selectedStock) {
    return (
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <p>Please select a stock to view data.</p>
      </Box>
    );
  }
  if (!selectedDuration) {
    return (
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <p>Please select a Duration to view data.</p>
      </Box>
    );
  }
  return (
    <Paper elevation={3} sx={{ p: 2, height: '700px', width:'60vw' }}>
      <Box sx={{ height: '100%', padding: '16px', flexDirection:'column' }}>
        {stockData.length > 0 ? (
          <Line key={chartKey} data={chartData} options={options} ref={chartRef} width={2800} />
        ) : (
          <Box 
            sx={{
              display: 'flex',
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p>Loading Data....</p>
          </Box>
        )
        }
      </Box>
      <Button variant='contained' color='primary' onClick={handleZoomRest}>Reset Zoom</Button>
    </Paper>
  );
};

export default StockChart;