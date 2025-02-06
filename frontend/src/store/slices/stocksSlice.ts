import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Stock, StockData, StockState, StockDataResponse, Status } from '../../types/stock';
import { API_BASE_URL } from '../../config/constants';

export const fetchStocks = createAsyncThunk<Stock[]>(
  'stocks/fetchStocks',
  async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw error;
    }
  }
);

interface FetchStockDataParams {
  id: string;
  duration: string;
}

export const fetchStockData =  createAsyncThunk<StockDataResponse, FetchStockDataParams>(
  'stocks/fetchStockData',
  async ({ id, duration }, { dispatch }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duration }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      if (data.status == Status.IN_PROGRESS) {
        setTimeout(() => {
          dispatch(fetchStockData({ id, duration }));
        }, 1000);
      }
      
      return data;
      
    
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw error;
    }
  }
);

const initialState: StockState = {
  stocks: [],
  selectedStock: null,
  selectedDuration: null,
  stockData: [],
  loading: false,
  error: null,
  pollingStatus: null,
};

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setSelectedStock: (state, action: PayloadAction<string | null>) => {
      state.selectedStock = action.payload;
      state.stockData = [];
      state.pollingStatus = null;
    },
    setSelectedDuration: (state, action: PayloadAction<string | null>) => {
      state.selectedDuration = action.payload;
      state.stockData = [];
      state.pollingStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        console.log("fetchStocks.pending : P")
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        console.log('fetchStocks.fulfilled Received data:', action.payload);
        state.loading = false;
        state.stocks = action.payload;
        state.error = null;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        console.log("fetchStocks.rejected State : R")
        state.loading = false;
        state.error = action.error.message ?? 'An error occurred';
      })
      .addCase(fetchStockData.pending, (state) => {
        console.log("fetchStockData.pending")
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        console.log("fetchStockData.fulfilled\n Data: ", action.payload)
        if (action.payload.data) {
          console.log("condition\n Data: ", action.payload.data)
          state.stockData = action.payload.data;
        }
        state.pollingStatus = action.payload.status;
        state.error = null;
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        console.log("fetchStockData.rejected")
        state.error = action.error.message ?? 'An error occurred';
        state.pollingStatus = Status.ERROR;
      });
  },
});

export const { setSelectedStock, setSelectedDuration } = stocksSlice.actions;
export default stocksSlice.reducer;