import React, { useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  SelectChangeEvent,
  Menu,
} from '@mui/material';
import {
  fetchStocks,
  setSelectedStock,
  setSelectedDuration,
} from '../../store/slices/stocksSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

const StockControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stocks, selectedStock, selectedDuration } = useAppSelector(
    (state) => state.stocks
  );

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  const handleStockChange = (event: SelectChangeEvent<string>) => {
    dispatch(setSelectedStock(event.target.value));
    
    const selectedValue = event.target.value;

    if (!selectedValue.trim()) { // Trim to avoid whitespace selection
      dispatch(setSelectedStock(null)); // Reset stock selection
      dispatch(setSelectedDuration(null)); // Reset duration
    } else {
      dispatch(setSelectedStock(selectedValue));
    }
  };

  const handleDurationChange = (event: SelectChangeEvent<string>) => {
    dispatch(setSelectedDuration(event.target.value));

  };

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}> 
      <Grid item xs={12} sm={6}>  
        <FormControl fullWidth>
          <InputLabel>Stock</InputLabel>
          
          <Select
            value={selectedStock || ''}
            label="Stock"
            onChange={handleStockChange}
          >
            <MenuItem  value=" ">
              Select a stock
            </MenuItem>
            {stocks.map((stock) => (
              <MenuItem key={stock.id} value={stock.id}>
                {stock.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={16} sm={6}>  
        <FormControl fullWidth>
          <InputLabel>Duration</InputLabel>
          <Select
            value={selectedDuration || ''}
            label="Duration"
            onChange={handleDurationChange}
            disabled={!selectedStock}
          >
            
            {selectedStock &&
              stocks
                .find((s) => s.id === selectedStock)
                ?.available.map((duration) => (
                  <MenuItem key={duration} value={duration}>
                    {duration}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default StockControls;