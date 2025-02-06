// src/types/stock.ts
export interface Stock {
  id: string;
  name: string;
  symbol: string;
  available: string[];
}

export interface StockData {
  open: number;
  high: number;
  low: number;
  close: number;
  price: number;
  volume: number;
  timestamp: string;
}

export enum Status {
  COMPLETE = "COMPLETE",
  ERROR = "ERROR",
  IN_PROGRESS = "IN_PROGRESS",
  STARTING = "STARTING"
}

export interface StockDataResponse {
  data: StockData[];
  status: Status;
}

export interface StockState {
  stocks: Stock[];
  selectedStock: string | null;
  selectedDuration: string | null;
  stockData: StockData[];
  loading: boolean;
  error: string | null;
  pollingStatus: Status | null;
}